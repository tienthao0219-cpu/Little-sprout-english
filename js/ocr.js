/* Ảnh sách -> bài tập.
   - Đọc chữ (OCR) MIỄN PHÍ ngay trong trình duyệt bằng Tesseract.js, file nằm sẵn trong thư mục vendor/ của web (không gọi dịch vụ ngoài, ảnh không rời máy cô).
   - Bộ tạo bài chỉ dùng CHỮ TRONG ẢNH CỦA CÔ (không tự thêm nội dung sách).
   Giới hạn: chỉ đọc tốt chữ in tiếng Anh; tiếng Việt có dấu đọc kém; không "hiểu" nội dung như AI. Cô luôn xem lại và sửa trước khi tạo bài. */
window.LSE = window.LSE || {};
(function (L) {
  const BASE = () => new URL("vendor/tesseract/", location.href).href;

  /* ================= Bộ tạo bài từ văn bản (thuần tuý, test được) ================= */
  const STOP = new Set(("a an the and or but so if of to in on at by for with from as is am are was were be been being do does did have has had " +
    "i you he she it we they me him her us them my your his its our their this that these those there here not no yes can could will would " +
    "shall should may might must very too also just then than when what who whom whose which where why how all any some many much more most " +
    "one two three four five six seven eight nine ten into onto up down out off over under about after before again very").split(/\s+/));

  /** dọn lỗi hay gặp của OCR, giữ nguyên xuống dòng */
  function clean(text) {
    return String(text || "").replace(/\r/g, "").replace(/[’‘´`]/g, "'").replace(/[“”]/g, '"')
      .split("\n").map(l => l.replace(/[ \t]+/g, " ").replace(/(^|\s)\|(?=\s|$)/g, "$1I").replace(/^[\s•·●▪■□○◦*]+(?=[A-Za-z0-9])/, "").trim())
      .filter((l, i, a) => l === "" || /[A-Za-z0-9]{2}/.test(l) || (a[i - 1] === undefined))
      .join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  const words = s => (s.match(/[A-Za-z][A-Za-z'-]*/g) || []);

  /** tách câu: mỗi dòng là một câu (gộp với dòng sau nếu dòng này chưa kết thúc và dòng sau viết thường), cắt tiếp theo . ! ? ;
      bỏ tiêu đề, dòng "từ - nghĩa" và mục quá ngắn */
  function sentences(text) {
    const out = [], lines = clean(text).split("\n");
    const isPair = l => PAIR.test(l);
    let cur = "";
    const flush = () => {
      if (!cur) return;
      cur.split(/(?<=[.!?])\s+(?=[A-Z"'(\[])/).forEach(s => {
        s = s.replace(/^\d+[.)]\s+/, "").replace(/^[A-D][.)]\s+(?=[A-Z])/, "").trim();
        const n = words(s).length, ended = /[.!?]["')]?$/.test(s);
        if (n >= 3 && n <= 22 && /[a-z]/.test(s) && (ended || n >= 5) && !/:$/.test(s)) out.push(s);
      });
      cur = "";
    };
    lines.forEach(l => {
      l = l.trim();
      if (!l || isPair(l)) { flush(); return; }
      if (cur && !/[.!?:]["')]?$/.test(cur) && /^[a-z]/.test(l)) cur += " " + l.replace(/^-\s*/, "");
      else { flush(); cur = l; }
    });
    flush();
    return out;
  }

  const PAIR = /^(?:\d+[.)]\s*)?([A-Za-z][A-Za-z' \/-]{0,38}?)\s*(?:\s[-–—=:]\s|[=:–—]|\t)\s*(.{1,80})$/;
  /** cặp "từ - nghĩa" (dấu - – — = : hoặc tab) */
  function pairs(text) {
    const out = [], seen = new Set();
    clean(text).split("\n").forEach(l => {
      const m = l.match(PAIR);
      if (!m) return;
      const a = m[1].trim(), b = m[2].trim();
      if (!a || !b || a.toLowerCase() === b.toLowerCase()) return;
      const k = a.toLowerCase(); if (seen.has(k)) return; seen.add(k);
      out.push([a, b]);
    });
    return out;
  }

  /** dòng chỉ có từ/cụm từ ngắn (danh sách từ vựng không kèm nghĩa) */
  function wordList(text) {
    const set = new Set();
    clean(text).split("\n").forEach(l => {
      const w = l.replace(/^\d+[.)]\s*/, "").trim();
      if (/^[A-Za-z][A-Za-z' -]{1,24}$/.test(w) && words(w).length <= 3) set.add(w);
    });
    return Array.from(set);
  }

  /** đã có [[ ]] do cô tự đánh dấu chưa */
  const hasMarks = s => /\[\[[^\]]+\]\]/.test(s);

  /** chọn từ để bỏ trống trong 1 câu: từ nội dung (không phải từ chức năng, không phải tên riêng giữa câu), ưu tiên từ dài */
  function pickBlanks(sentence, k, seed) {
    const toks = Array.from(sentence.matchAll(/[A-Za-z][A-Za-z'-]*/g)).map((m, i) => ({ w: m[0], at: m.index, i }));
    const cand = toks.filter(t => t.w.length >= 3 && !STOP.has(t.w.toLowerCase()) && !(t.i > 0 && /^[A-Z]/.test(t.w)) && t.i > 0);
    if (!cand.length) { const c2 = toks.filter(t => t.w.length >= 3 && !STOP.has(t.w.toLowerCase())); if (!c2.length) return []; cand.push(...c2); }
    const sorted = cand.slice().sort((a, b) => (b.w.length - a.w.length) || (a.at - b.at));
    const pool = sorted.slice(0, Math.max(k, Math.min(sorted.length, k + 2)));
    const chosen = [];
    for (let j = 0; j < k && pool.length; j++) chosen.push(pool.splice((seed + j * 7) % pool.length, 1)[0]);
    return chosen.sort((a, b) => a.at - b.at);
  }
  function blankLine(sentence, k, seed) {
    if (hasMarks(sentence)) return { line: sentence, answers: Array.from(sentence.matchAll(/\[\[([^\]]+)\]\]/g)).map(m => m[1].split("/")[0]) };
    const ch = pickBlanks(sentence, k, seed);
    if (!ch.length) return null;
    let out = "", pos = 0; const answers = [];
    ch.forEach(t => { out += sentence.slice(pos, t.at) + "[[" + t.w + "]]"; pos = t.at + t.w.length; answers.push(t.w); });
    return { line: out + sentence.slice(pos), answers };
  }

  const TASKS = {
    fill: "Điền từ vào chỗ trống.",
    match: "Ghép từ với nghĩa."
  };

  /** Tạo các phần bài. opts: {types:[...], blanks:1|2, max:số câu tối đa mỗi phần, topic} -> [{type,title,raw,topic}] */
  function generate(text, opts) {
    opts = Object.assign({ types: ["fill"], blanks: 1, max: 12, topic: "" }, opts || {});
    const sec = [], notes = [];
    const sents = sentences(text), pr = pairs(text), wl = wordList(text);
    const topic = opts.topic || "";
    const T = opts.types;

    if (T.includes("fill") || T.includes("fillbank")) {
      const lines = [], answers = [];
      sents.slice(0, opts.max).forEach((s, i) => { const r = blankLine(s, opts.blanks, i); if (r) { lines.push(r.line); answers.push(...r.answers); } });
      if (!lines.length) notes.push("Không tìm thấy câu đủ dài để tạo bài điền từ (cần câu có từ 3 từ trở lên).");
      else {
        if (T.includes("fill")) sec.push({ type: "fill", title: "Fill in the blanks", raw: lines.join("\n"), topic });
        if (T.includes("fillbank")) {
          const uniq = Array.from(new Set(answers.map(a => a)));
          sec.push({ type: "fillbank", title: "Fill in the blanks (word bank)", raw: "BANK: " + uniq.join(", ") + "\n" + lines.join("\n"), topic });
        }
      }
    }
    if (T.includes("sentence")) {
      const ok = sents.filter(s => { const n = words(s).length; return n >= 4 && n <= 12; }).slice(0, opts.max);
      if (!ok.length) notes.push("Không có câu 4–12 từ để tạo bài sắp xếp câu.");
      else sec.push({ type: "sentence", title: "Put the words in order", raw: ok.join("\n"), topic });
    }
    if (T.includes("match")) {
      if (pr.length < 2) notes.push("Không thấy các dòng dạng \"từ - nghĩa\" (cần ít nhất 2 dòng) nên chưa tạo bài ghép cặp.");
      else {
        const groups = []; for (let i = 0; i < pr.length; i += 6) groups.push(pr.slice(i, i + 6));
        if (groups.length > 1 && groups[groups.length - 1].length < 2) groups[groups.length - 2].push(...groups.pop());
        sec.push({ type: "match", title: "Match the words", raw: groups.map(g => "TASK: " + TASKS.match + "\n" + g.map(p => p[0] + " = " + p[1]).join("\n")).join("\n\n"), topic });
      }
    }
    if (T.includes("mcq1")) {
      if (pr.length < 4) notes.push("Cần ít nhất 4 dòng \"từ - nghĩa\" để tạo trắc nghiệm nghĩa của từ.");
      else {
        const blocks = pr.slice(0, opts.max).map((p, i) => {
          const others = pr.filter((_, j) => j !== pr.indexOf(p)).map(x => x[1]);
          const wrong = [];
          for (let j = 0; wrong.length < 3 && j < others.length; j++) { const o = others[(i * 3 + j) % others.length]; if (!wrong.includes(o) && o !== p[1]) wrong.push(o); }
          const opts4 = wrong.slice(0, 3); const pos = i % 4; opts4.splice(pos, 0, p[1]);
          return "What does \"" + p[0] + "\" mean?\n" + opts4.map((o, k) => (k === pos ? "*" : "") + "ABCD"[k] + ". " + o).join("\n");
        });
        sec.push({ type: "mcq1", title: "Choose the correct meaning", raw: blocks.join("\n\n"), topic });
      }
    }
    if (T.includes("scramble")) {
      const ws = pr.length ? pr.map(p => [p[0], p[1]]) : wl.map(w => [w, ""]);
      const ok = ws.filter(p => /^[A-Za-z' -]{3,16}$/.test(p[0])).slice(0, opts.max * 2);
      if (!ok.length) notes.push("Không có từ để tạo bài xếp chữ cái (cần dòng từ vựng ngắn hoặc dòng \"từ - nghĩa\").");
      else sec.push({ type: "scramble", title: "Unscramble the words", raw: ok.map(p => p[0] + (p[1] ? " | " + p[1] : "")).join("\n"), topic });
    }
    if (T.includes("meanpick")) {
      if (pr.length < 4) notes.push("Cần ít nhất 4 dòng \"từ - nghĩa\" để tạo bài nhìn nghĩa chọn từ.");
      else sec.push({ type: "meanpick", title: "Look and choose the English word", raw: pr.slice(0, opts.max * 2).map(p => p[1] + " => " + p[0]).join("\n"), topic });
    }
    if (T.includes("listen")) {
      const ws = pr.length ? pr.map(p => p[0]) : wl;
      if (ws.length < 4) notes.push("Cần ít nhất 4 từ để tạo bài nghe chọn từ.");
      else sec.push({ type: "listen", title: "Listen and choose", raw: ws.slice(0, opts.max * 2).join("\n"), topic });
    }
    if (T.includes("memory")) {
      if (pr.length < 2) notes.push("Cần ít nhất 2 dòng \"từ - nghĩa\" để tạo lật thẻ.");
      else { const gs = []; for (let i = 0; i < pr.length; i += 6) gs.push(pr.slice(i, i + 6)); if (gs.length > 1 && gs[gs.length - 1].length < 2) gs[gs.length - 2].push(...gs.pop()); sec.push({ type: "memory", title: "Memory cards", raw: gs.map(g => g.map(p => p[0] + " = " + p[1]).join("\n")).join("\n\n"), topic }); }
    }
    if (T.includes("wordsearch")) {
      const ws = pr.length ? pr.map(p => p[0] + " | " + p[1]) : wl;
      if (ws.length < 2) notes.push("Cần ít nhất 2 từ để tạo bài tìm từ.");
      else sec.push({ type: "wordsearch", title: "Word search", raw: ws.slice(0, 10).join("\n"), topic });
    }
    if (T.includes("short")) {
      if (!pr.length) notes.push("Không có cặp \"từ - nghĩa\" để tạo bài trả lời ngắn.");
      else sec.push({ type: "short", title: "Write the English word", raw: pr.slice(0, opts.max * 2).map(p => "How do you say \"" + p[1] + "\" in English? => " + p[0]).join("\n"), topic });
    }
    return { sections: sec, notes, stats: { sentences: sents.length, pairs: pr.length, words: wl.length } };
  }

  /* ================= Xử lý ảnh + OCR ================= */
  async function loadBitmap(file) {
    if (window.createImageBitmap) { try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch (e) { } }
    return await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = () => rej(new Error("Không mở được ảnh")); im.src = URL.createObjectURL(file); });
  }

  /** phóng/thu ảnh, xoay (độ), chuyển xám, làm rõ chữ (ngưỡng thích ứng) -> canvas */
  function prepare(bmp, opt) {
    opt = Object.assign({ rotate: 0, enhance: true }, opt || {});
    let w = bmp.width, h = bmp.height;
    const long = Math.max(w, h), short = Math.min(w, h);
    let sc = 1;
    if (long > 3000) sc = 3000 / long;
    else if (short < 1100) sc = Math.min(2.5, 1400 / short);
    const sw = Math.round(w * sc), sh = Math.round(h * sc);
    const rot = ((opt.rotate % 360) + 360) % 360;
    const cv = document.createElement("canvas");
    cv.width = rot % 180 ? sh : sw; cv.height = rot % 180 ? sw : sh;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.translate(cv.width / 2, cv.height / 2); ctx.rotate(rot * Math.PI / 180);
    ctx.drawImage(bmp, -sw / 2, -sh / 2, sw, sh);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const W = cv.width, H = cv.height;
    const img = ctx.getImageData(0, 0, W, H), d = img.data;
    const g = new Uint8ClampedArray(W * H);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) g[j] = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0;
    if (opt.enhance) {
      /* ngưỡng thích ứng bằng ảnh tích phân: pixel tối hơn trung bình vùng lân cận một chút => chữ (đen), còn lại nền (trắng) */
      const win = Math.max(15, (Math.min(W, H) / 12) | 0), integ = new Float64Array((W + 1) * (H + 1));
      for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += g[y * W + x]; integ[(y + 1) * (W + 1) + x + 1] = integ[y * (W + 1) + x + 1] + row; } }
      const out = new Uint8ClampedArray(W * H), half = win >> 1;
      for (let y = 0; y < H; y++) {
        const y0 = Math.max(0, y - half), y1 = Math.min(H - 1, y + half);
        for (let x = 0; x < W; x++) {
          const x0 = Math.max(0, x - half), x1 = Math.min(W - 1, x + half);
          const sum = integ[(y1 + 1) * (W + 1) + x1 + 1] - integ[y0 * (W + 1) + x1 + 1] - integ[(y1 + 1) * (W + 1) + x0] + integ[y0 * (W + 1) + x0];
          const mean = sum / ((x1 - x0 + 1) * (y1 - y0 + 1));
          out[y * W + x] = g[y * W + x] < mean * 0.86 ? 0 : 255;
        }
      }
      g.set(out);
    }
    for (let i = 0, j = 0; i < d.length; i += 4, j++) { d[i] = d[i + 1] = d[i + 2] = g[j]; d[i + 3] = 255; }
    ctx.putImageData(img, 0, 0);
    return cv;
  }

  let worker = null, workerBusy = null;
  function loadScript(src) {
    return new Promise((res, rej) => {
      if (window.Tesseract) return res();
      const s = document.createElement("script"); s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error("Không tải được bộ đọc chữ (thiếu thư mục vendor/tesseract trên GitHub?)"));
      document.head.appendChild(s);
    });
  }
  let workerLang = "";
  async function getWorker(onProgress, lang) {
    lang = lang || "eng";
    if (worker && workerLang !== lang) await stopWorker();
    if (worker) return worker;
    await loadScript(BASE() + "tesseract.min.js");
    workerLang = lang;
    worker = await Tesseract.createWorker(lang, 1, {
      workerPath: BASE() + "worker.min.js", corePath: BASE(), langPath: BASE(), gzip: true, workerBlobURL: false,
      logger: m => { try { onProgress && onProgress(m); } catch (e) { } }
    });
    return worker;
  }
  async function stopWorker() { if (worker) { try { await worker.terminate(); } catch (e) { } worker = null; } }

  /** đọc 1 ảnh -> chuỗi chữ */
  async function read(file, opt, onProgress) {
    const bmp = await loadBitmap(file);
    const cv = prepare(bmp, opt);
    const w = await getWorker(onProgress, opt && opt.lang);
    const r = await w.recognize(cv);
    return { text: r.data.text || "", confidence: r.data.confidence };
  }

  L.ocr = { clean, sentences, pairs, wordList, generate, prepare, loadBitmap, read, stopWorker, getWorker };
})(window.LSE);
