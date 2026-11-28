/* Đọc file PDF CÓ CHỮ (xuất từ Word / NotebookLM / Google Docs / ChatGPT…, không phải ảnh scan) -> các khối "đoạn" và "bảng"
   giống hệt khối mà js/docx.js đọc từ file Word, rồi đưa vào cùng bộ nhận dạng câu hỏi (L.docx.parseDocx).
   Làm được: gom chữ thành dòng theo toạ độ, ghép dòng bị xuống hàng thành đoạn, nhận bố cục 2 cột (đọc theo số câu để biết
   đọc ngang hay dọc), nhận bảng đáp án (cột đầu là số câu), bỏ đầu trang / chân trang lặp lại.
   Không làm được: chữ gạch chân / in đậm, ảnh trong PDF, PDF scan (không có chữ). Thư viện: vendor/pdfjs (pdf.js 3.11, bản legacy cho Safari cũ). */
window.LSE = window.LSE || {};
(function (L) {
  const loadPdfJs = () => window.pdfjsLib ? Promise.resolve() : new Promise((ok, no) => {
    const s = document.createElement("script"); s.src = "vendor/pdfjs/pdf.min.js";
    s.onload = () => { try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdfjs/pdf.worker.min.js"; ok(); } catch (e) { no(e); } };
    s.onerror = () => no(new Error("Không tải được thư viện đọc PDF (vendor/pdfjs). Cô kiểm tra đã tải thư mục vendor lên GitHub chưa."));
    document.head.append(s);
  });

  const norm = s => String(s || "").normalize("NFC").replace(/[     ]/g, " ").replace(/[​‌‍﻿]/g, "")
    .replace(/ﬁ/g, "fi").replace(/ﬂ/g, "fl").replace(/ﬀ/g, "ff").replace(/ﬃ/g, "ffi").replace(/ﬄ/g, "ffl");
  const NUMSTART = /^\s*(?:(?:question|câu|cau|q)\s*)?(\d{1,3})\s*[.:)]/i;
  const MARKER = /^\s*(?:\(?\d{1,3}\s*[.:)]|\(?[A-Za-z][.)]\s|[•▪●·★☆✦▶►]|[-–—*]\s|(?:question|câu|cau|task|exercise|activity|part|phần|section|bài\s*tập|unit|trả\s*lời|answer|đáp\s*án|ví\s*dụ|example|note|lưu\s*ý)\b)/i;

  /* ---------- 1. chữ -> dòng (theo toạ độ) ---------- */
  async function pageLines(page) {
    const vp = page.getViewport({ scale: 1 }), tc = await page.getTextContent();
    const its = [];
    for (const it of tc.items) {
      if (typeof it.str !== "string") continue;
      const s = norm(it.str); if (!s.trim()) continue;
      const tr = it.transform || [1, 0, 0, 1, 0, 0];
      if (Math.abs(tr[1]) > 0.5 * Math.abs(tr[0]) + 0.01 && Math.abs(tr[1]) > 1) continue;   // chữ xoay dọc (hình mờ, nhãn trục…): bỏ
      its.push({ s, x: tr[4], y: vp.height - tr[5], w: it.width || 0, h: Math.abs(tr[3]) || it.height || 10 });
    }
    its.sort((a, b) => a.y - b.y || a.x - b.x);
    const lines = [];
    for (const it of its) {
      const ln = lines[lines.length - 1];
      if (ln && Math.abs(it.y - ln.y) <= 0.4 * Math.max(ln.h, it.h)) { ln.its.push(it); ln.h = Math.max(ln.h, it.h); }
      else lines.push({ y: it.y, h: it.h, its: [it] });
    }
    lines.forEach(ln => {
      ln.its.sort((a, b) => a.x - b.x);
      ln.x0 = ln.its[0].x; ln.x1 = Math.max(...ln.its.map(i => i.x + i.w));
      ln.text = joinItems(ln.its);
      ln.cells = cellsOf(ln);
    });
    return { w: vp.width, h: vp.height, lines };
  }
  function joinItems(its) {
    let out = "";
    its.forEach((it, i) => {
      if (i) {
        const p = its[i - 1], gap = it.x - (p.x + p.w);
        if (gap > 0.12 * it.h && !/\s$/.test(out)) out += gap > 2.5 * it.h ? "  " : " ";
      }
      out += it.s;
    });
    return out.replace(/[ \t]+/g, m => m.length > 1 && m.indexOf("  ") >= 0 ? "  " : " ").trim();
  }
  /** chia một dòng thành các "ô" (bảng) tại chỗ trống lớn */
  function cellsOf(ln) {
    const gapMin = Math.max(12, 1.4 * ln.h), cells = []; let cur = null;
    ln.its.forEach(it => {
      if (cur && it.x - cur.x1 < gapMin) { cur.its.push(it); cur.x1 = Math.max(cur.x1, it.x + it.w); }
      else { cur = { its: [it], x0: it.x, x1: it.x + it.w }; cells.push(cur); }
    });
    cells.forEach(c => c.text = joinItems(c.its));
    return cells;
  }

  /* ---------- 2. bỏ đầu trang / chân trang ---------- */
  function dropRepeated(pages) {
    const sig = t => t.replace(/\d+/g, "#").replace(/\s+/g, " ").trim().toLowerCase();
    const edge = (P, ln) => ln.y < 0.07 * P.h || ln.y > 0.93 * P.h;
    const cnt = {};
    pages.forEach(P => { const seen = new Set(); P.lines.forEach(ln => { if (edge(P, ln)) seen.add(sig(ln.text)); }); seen.forEach(k => { cnt[k] = (cnt[k] || 0) + 1; }); });
    pages.forEach(P => { P.lines = P.lines.filter(ln => {
      if (!edge(P, ln)) return true;
      const t = ln.text.trim();
      if (/^(?:trang|page)\s*\d+(?:\s*(?:\/|of)\s*\d+)?$/i.test(t) || /^[-–]?\s*\d{1,3}\s*[-–]?$/.test(t)) return false;   // số trang
      return !(pages.length >= 2 && cnt[sig(t)] >= 2);
    }); });
  }

  /* ---------- 3. bảng (cột đầu là số câu: bảng đáp án) ---------- */
  const isIntRow = ln => ln.cells.length >= 2 && /^\d{1,3}$/.test(ln.cells[0].text.trim());
  const isHeadRow = ln => ln.cells.length >= 2 && /^(?:câu|stt|tt|no\.?|số|question|#)$/i.test(ln.cells[0].text.trim().replace(/[.:]$/, ""));
  const isPartRow = ln => ln.cells.length === 1 && ln.text.length < 120 && /^\s*(?:phần|part|section|task|exercise|bài)\b/i.test(ln.text);
  /** số dòng của bảng bắt đầu tại dòng i (0 nếu không có bảng) */
  function tableAt(lines, i) {
    if (!isHeadRow(lines[i]) && !isIntRow(lines[i])) return 0;
    let k = isHeadRow(lines[i]) ? i + 1 : i, n = 0, col1End = 0;
    const nextInt = j => { for (let q = j + 1; q < Math.min(lines.length, j + 3); q++) { if (isIntRow(lines[q])) return true; if (!isPartRow(lines[q])) return false; } return false; };
    for (; k < lines.length; k++) {
      const ln = lines[k];
      if (isIntRow(ln)) { n++; col1End = Math.max(col1End, ln.cells[0].x1); continue; }
      if (isPartRow(ln) && nextInt(k)) continue;   // dòng "PHẦN 1 (1–29)" gộp cả hàng, nằm giữa các hàng của bảng đáp án
      if (n > 0 && !isHeadRow(ln) && !isPartRow(ln) && ln.x0 > col1End + 4 && ln.cells.length >= 1 && !NUMSTART.test(ln.text)) continue;   // dòng nối của ô giải thích
      break;
    }
    return n >= 3 ? k - i : 0;
  }
  function tableBlock(lines) {
    const rowsIn = lines.filter(isIntRow);
    const starts = [];   // vị trí bắt đầu từng cột (gom các ô có x0 gần nhau)
    rowsIn.forEach(ln => ln.cells.forEach(c => { const s = starts.find(x => Math.abs(x.x - c.x0) <= 10); if (s) { s.n++; s.x = (s.x * (s.n - 1) + c.x0) / s.n; } else starts.push({ x: c.x0, n: 1 }); }));
    const cols = starts.filter(s => s.n >= 0.5 * rowsIn.length).sort((a, b) => a.x - b.x).map(s => s.x);
    const colOf = x => { let c = 0; cols.forEach((cx, i) => { if (cx <= x + 3) c = i; }); return c; };
    /* chia lại chữ của dòng theo vị trí cột (không theo khoảng trống, vì chữ ô này có thể sát ô bên cạnh) */
    const split = ln => { const parts = cols.map(() => []); ln.its.forEach(it => parts[colOf(it.x)].push(it)); return parts.map(a => a.length ? joinItems(a) : ""); };
    const rows = []; let row = null;
    lines.forEach(ln => {
      if (isIntRow(ln) || isHeadRow(ln)) { row = split(ln); rows.push(row); }
      else if (isPartRow(ln)) { rows.push([ln.text]); row = null; }
      else if (row) { split(ln).forEach((t, k) => { if (t) row[k] = (row[k] ? row[k] + " " : "") + t; }); }   // ô dài bị xuống hàng: nối bằng dấu cách
    });
    return { k: "t", rows };
  }

  /* ---------- 4. đoạn văn: ghép các dòng bị xuống hàng ---------- */
  function paraBlocks(lines, right, out) {
    let cur = null, prev = null;
    const push = () => { if (cur) { const t = cur.replace(/[ \t]+/g, " ").trim(); if (t) out.push({ k: "p", t, tb: t, style: "" }); } cur = null; };
    lines.forEach(ln => {
      const t = ln.text;
      const wrap = prev && !MARKER.test(t) && (ln.y - prev.y) < 1.8 * prev.h && prev.x1 >= right - 0.1 * Math.max(40, right - prev.x0) && Math.abs(ln.x0 - prev.x0) < 14 + 1.5 * ln.h;
      if (wrap) cur += " " + t; else { push(); cur = t; }
      prev = ln;
    });
    push();
  }

  /* ---------- 5. bố cục 2 cột ---------- */
  function findGutter(lines) {
    const N = lines.length; if (N < 8) return null;
    const minX = Math.min(...lines.map(l => l.x0)), maxX = Math.max(...lines.map(l => l.x1)), W = maxX - minX;
    if (W < 220) return null;
    const cov = new Int32Array(Math.ceil(W) + 2);
    lines.forEach(ln => {
      const iv = []; ln.its.forEach(it => { const a = it.x, b = it.x + it.w; const last = iv[iv.length - 1]; if (last && a - last[1] < 8) last[1] = Math.max(last[1], b); else iv.push([a, b]); });
      iv.forEach(([a, b]) => { for (let x = Math.max(0, Math.floor(a - minX)); x <= Math.min(cov.length - 1, Math.ceil(b - minX)); x++) cov[x]++; });
    });
    const lo = Math.floor(W * 0.3), hi = Math.ceil(W * 0.7), lim = Math.max(1, Math.round(0.2 * N));
    let best = null, run = null;
    for (let x = lo; x <= hi + 1; x++) {
      if (x <= hi && cov[x] <= lim) { if (!run) run = { a: x, b: x }; run.b = x; }
      else { if (run && run.b - run.a >= 16 && (!best || run.b - run.a > best.b - best.a)) best = run; run = null; }
    }
    if (!best) return null;
    const xb = minX + (best.a + best.b) / 2;
    /* hai cột thật: cả hai bên đều có chữ, và mỗi bên có các dòng bắt đầu bằng số câu cùng lề trái
       (tránh nhầm "A. … B. …" cách nhau bằng tab trên cùng một dòng thành 2 cột) */
    let nL = 0, nR = 0; const xsL = [], xsR = [];
    lines.forEach(ln => {
      const Ls = ln.its.filter(i => i.x + i.w / 2 < xb), Rs = ln.its.filter(i => i.x + i.w / 2 >= xb);
      if (Ls.length) { nL++; if (NUMSTART.test(joinItems(Ls))) xsL.push(Ls[0].x); }
      if (Rs.length) { nR++; if (NUMSTART.test(joinItems(Rs))) xsR.push(Rs[0].x); }
    });
    if (nL < 0.25 * N || nR < 0.25 * N || xsL.length < 2 || xsR.length < 2) return null;
    if (Math.max(...xsR) - Math.min(...xsR) > 8) return null;
    return { xb };
  }
  const crosses = (ln, xb) => ln.its.some(i => i.x < xb - 1 && i.x + i.w > xb + 1);
  const numOf = c => { const m = c[0].text.match(NUMSTART); return m ? +m[1] : null; };
  /** một dải các dòng không vắt qua khe giữa 2 cột -> các "ô" (mỗi ô một câu) của cột trái và cột phải */
  function bandBlocks(band, xb, right, out) {
    const cols = [[], []];
    band.forEach(ln => {
      [0, 1].forEach(ci => {
        const its = ln.its.filter(i => (ci === 0) === (i.x + i.w / 2 < xb)); if (!its.length) return;
        cols[ci].push({ y: ln.y, h: ln.h, x0: its[0].x, x1: Math.max(...its.map(i => i.x + i.w)), text: joinItems(its), its });
      });
    });
    const cellsOfCol = lines => {
      const cells = []; lines.forEach(ln => { const m = ln.text.match(NUMSTART); if (m || !cells.length) cells.push({ n: m ? +m[1] : null, lines: [ln] }); else cells[cells.length - 1].lines.push(ln); });
      return cells;
    };
    const cl = cellsOfCol(cols[0]), cr = cellsOfCol(cols[1]);
    const colMajor = cl.concat(cr), rowMajor = []; for (let k = 0; k < Math.max(cl.length, cr.length); k++) { if (cl[k]) rowMajor.push(cl[k]); if (cr[k]) rowMajor.push(cr[k]); }
    const score = seq => { let s = 0, prev = null; seq.forEach(c => { if (c.n != null) { if (prev != null && c.n > prev) s += (c.n === prev + 1 ? 2 : 1); prev = c.n; } }); return s; };
    const order = score(rowMajor) > score(colMajor) ? rowMajor : colMajor;
    order.forEach(c => paraBlocks(c.lines, right, out));
  }
  function regionBlocks(lines, P, out) {
    if (!lines.length) return;
    const right = Math.max(...lines.map(l => l.x1)), g = findGutter(lines);
    if (!g) { paraBlocks(lines, right, out); return; }
    let band = [], full = [];
    const flushFull = () => { if (full.length) { paraBlocks(full, right, out); full = []; } };
    const flushBand = () => { if (band.length) { bandBlocks(band, g.xb, right, out); band = []; } };
    lines.forEach(ln => { if (crosses(ln, g.xb)) { flushBand(); full.push(ln); } else { flushFull(); band.push(ln); } });
    flushFull(); flushBand();
  }
  function pageBlocks(P) {
    const out = [], ls = P.lines; let buf = [], i = 0;
    const flush = () => { regionBlocks(buf, P, out); buf = []; };
    while (i < ls.length) { const t = tableAt(ls, i); if (t) { flush(); out.push(tableBlock(ls.slice(i, i + t))); i += t; } else { buf.push(ls[i]); i++; } }
    flush();
    return out;
  }

  async function readBlocks(file) {
    await loadPdfJs();
    let pdf;
    try { pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise; }
    catch (e) {
      if (e && e.name === "PasswordException") throw new Error("PDF này có đặt mật khẩu. Cô lưu lại bản PDF không mật khẩu rồi thử lại.");
      throw new Error("Không mở được file PDF này (" + ((e && e.message) || e) + "). Cô thử xuất lại file PDF hoặc dùng bản Word.");
    }
    const pages = []; let chars = 0;
    for (let n = 1; n <= pdf.numPages; n++) { const P = await pageLines(await pdf.getPage(n)); P.lines.forEach(l => { chars += l.text.length; }); pages.push(P); }
    if (chars < 30) throw new Error("PDF này gần như không có chữ để đọc (có vẻ là ảnh chụp / bản scan). Cô dùng nút \"AI soạn bài\" với ảnh các trang, hoặc xuất lại PDF từ Word / Google Docs.");
    dropRepeated(pages);
    const blocks = []; pages.forEach(P => blocks.push(...pageBlocks(P)));
    return blocks;
  }

  L.pdfread = { readBlocks };
})(window.LSE);
