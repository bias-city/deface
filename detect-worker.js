// SCRFD-Inferenz in einem Worker. Wird vom Hauptthread nach jeder Erkennung
// per terminate() beendet → der WASM-Heap (onnxruntime-web) wird vollständig
// freigegeben. So bleibt der Hauptthread (Canvases) schlank und der Zoom stabil.
const SC_IN = 640, SC_STRIDES = [8, 16, 32], SC_ANCHORS = 2, SC_SCORE = 0.5, SC_NMS = 0.4;

function decode(out) {
  const boxes = [], scores = [];
  for (let si = 0; si < SC_STRIDES.length; si++) {
    const s = SC_STRIDES[si], sc = out['out' + si], bb = out['out' + (si + 3)];
    const fw = Math.floor(SC_IN / s), N = fw * fw * SC_ANCHORS;
    for (let n = 0; n < N; n++) {
      const score = sc[n]; if (score < SC_SCORE) continue;
      const pos = (n / SC_ANCHORS) | 0, col = pos % fw, row = (pos / fw) | 0, cx = col * s, cy = row * s;
      const l = bb[n*4]*s, t = bb[n*4+1]*s, r = bb[n*4+2]*s, b = bb[n*4+3]*s;
      boxes.push([cx - l, cy - t, cx + r, cy + b]); scores.push(score);
    }
  }
  return { boxes, scores };
}
function iou(a, b) {
  const x1 = Math.max(a[0],b[0]), y1 = Math.max(a[1],b[1]), x2 = Math.min(a[2],b[2]), y2 = Math.min(a[3],b[3]);
  const iw = Math.max(0,x2-x1), ih = Math.max(0,y2-y1), inter = iw*ih;
  return inter / ((a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter + 1e-9);
}
function nms(boxes, scores, thr) {
  const order = scores.map((s,i)=>i).sort((i,j)=>scores[j]-scores[i]);
  const keep = [], dead = new Uint8Array(boxes.length);
  for (const i of order) { if (dead[i]) continue; keep.push(i);
    for (const j of order) if (!dead[j] && j !== i && iou(boxes[i],boxes[j]) > thr) dead[j] = 1; }
  return keep;
}

self.onmessage = async (e) => {
  try {
    importScripts('./ort/ort.min.js');
    ort.env.wasm.wasmPaths = './ort/'; ort.env.wasm.numThreads = 1; ort.env.wasm.simd = true;
    const { model, input } = e.data;     // model: ArrayBuffer, input: Float32Array (640er NCHW)
    const s = await ort.InferenceSession.create(new Uint8Array(model), { executionProviders: ['wasm'] });
    const feeds = {}; feeds[s.inputNames[0]] = new ort.Tensor('float32', input, [1, 3, SC_IN, SC_IN]);
    const res = await s.run(feeds);
    const out = {}; for (let i = 0; i < 6; i++) out['out' + i] = res['out' + i].data;   // nur score+bbox
    const { boxes, scores } = decode(out);
    const keep = nms(boxes, scores, SC_NMS);
    try { await s.release(); } catch (_) {}
    self.postMessage({ boxes: keep.map(i => boxes[i]) });   // Boxen im 640er-Koordinatensystem
  } catch (err) {
    self.postMessage({ error: (err && err.message) || String(err) });
  }
};
