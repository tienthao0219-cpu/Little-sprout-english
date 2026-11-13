/* Đọc file Word (.docx) -> các phần bài tập.
   Nhận dạng: trắc nghiệm A/B/C/D, điền từ có gợi ý (BIẾN ĐỔI TỪ), tìm lỗi sai (A)(B)(C)(D), viết lại câu (→),
   đoạn văn (bảng hoặc đoạn) đi kèm câu hỏi, bảng đáp án + giải thích ở cuối file.
   Chữ gạch chân trong Word được giữ lại dưới dạng <u>...</u>. */
window.LSE = window.LSE || {};
(function (L) {
  const loadJSZip = () => window.JSZip ? Promise.resolve() : new Promise((ok, no) => {
    const s = document.createElement("script"); s.src = "vendor/jszip/jszip.min.js"; s.onload = ok; s.onerror = () => no(new Error("Không tải được thư viện đọc Word (vendor/jszip). Cô kiểm tra đã tải thư mục vendor lên GitHub chưa.")); document.head.append(s);
  });
  const W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";
  const kids = (el, name) => Array.from(el.children).filter(c => c.localName === name);

  /* đoạn văn -> chuỗi có <u> */
  function paraText(p) {
    let out = "", open = false;
    const close = () => { if (open) { out += "</u>"; open = false; } };
    (function walk(node) {
      for (const c of node.children) {
        if (c.localName === "r") {
          const rpr = kids(c, "rPr")[0], u = rpr && kids(rpr, "u")[0];
          const isU = !!u && (u.getAttributeNS(W, "val") || u.getAttribute("w:val") || "single") !== "none";
          let t = "";
          for (const x of c.children) {
            if (x.localName === "t") t += x.textContent; else if (x.localName === "tab") t += " "; else if (x.localName === "br" || x.localName === "cr") t += "\n";
          }
          if (!t) continue;
          if (isU && !/^\s+$/.test(t)) { if (!open) { out += "<u>"; open = true; } out += t; } else { close(); out += t; }
        } else if (["hyperlink", "ins", "smartTag", "sdt", "sdtContent"].includes(c.localName)) walk(c);
      }
    })(p);
    close();
    return out.replace(/<\/u>(\s*)<u>/g, "$1").replace(/[  ]+/g, " ").replace(/ *\n */g, "\n").trim();
  }
  /* đoạn văn -> chuỗi có **chữ đậm** (dùng cho đoạn văn đọc hiểu; cả đoạn đậm như tiêu đề thì không đánh dấu) */
  function paraBold(p) {
    let out = "";
    (function walk(node) {
      for (const c of node.children) {
        if (c.localName === "r") {
          const rpr = kids(c, "rPr")[0], b = rpr && kids(rpr, "b")[0];
          const isB = !!b && !/^(0|false|off|none)$/i.test(b.getAttributeNS(W, "val") || b.getAttribute("w:val") || "1");
          let t = "";
          for (const x of c.children) { if (x.localName === "t") t += x.textContent; else if (x.localName === "tab") t += " "; else if (x.localName === "br" || x.localName === "cr") t += "\n"; }
          if (!t) continue;
          const m = t.match(/^(\s*)([\s\S]*?)(\s*)$/);
          out += isB && m[2] ? m[1] + "**" + m[2] + "**" + m[3] : t;
        } else if (["hyperlink", "ins", "smartTag", "sdt", "sdtContent"].includes(c.localName)) walk(c);
      }
    })(p);
    out = out.replace(/\*\*(\s*)\*\*/g, "$1").replace(/[  ]+/g, " ").replace(/ *\n */g, "\n").trim();
    if (/^\*\*[^*]+\*\*$/.test(out)) out = out.slice(2, -2);
    return out;
  }
  function cellText(tc) { return kids(tc, "p").map(paraText).filter(Boolean).join("\n"); }

  async function readBlocks(file) {
    await loadJSZip();
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const f = zip.file("word/document.xml"); if (!f) throw new Error("File này không phải Word .docx (cô lưu lại dạng .docx rồi thử lại; file .doc cũ không đọc được).");
    const doc = new DOMParser().parseFromString(await f.async("string"), "application/xml");
    const body = doc.getElementsByTagNameNS(W, "body")[0], blocks = [];
    for (const c of body.children) {
      if (c.localName === "p") {
        const st = kids(c, "pPr")[0], sty = st && kids(st, "pStyle")[0];
        const t = paraText(c); if (t) blocks.push({ k: "p", t, tb: paraBold(c), style: sty ? (sty.getAttributeNS(W, "val") || sty.getAttribute("w:val") || "") : "" });
      } else if (c.localName === "tbl") {
        const rows = kids(c, "tr").map(tr => kids(tr, "tc").map(cellText));
        blocks.push({ k: "t", rows });
      }
    }
    return blocks;
  }

  const stripU = s => String(s || "").replace(/<\/?u>/g, "");
  const QRE = /^(?:(?:question|câu|cau|q)\s*)?(\d{1,3})\s*[.:)]\s*(.*)$/is;
  const INSTR = /^(choose|mark|read|supply|find|rewrite|complete|fill|match|circle|underline|put|write|use|give|correct|change|turn|listen|look|identify|decide|select|arrange|reorder|rearrange|choose|answer|do|finish|make|order)\b/i;
  /* dòng yêu cầu bằng tiếng Việt đứng trước câu 1 (vd "Bài tập: Hãy đặt câu hỏi…", "Chọn đáp án đúng…") và khung hướng dẫn cho học sinh */
  const VIINSTR = /^\s*(?:bài\s*tập\s*[:.\-–]\s*)?(?:hãy|đặt câu hỏi|chọn|điền|viết lại|sắp xếp|tìm|nối|ghép|đọc|hoàn thành|khoanh|gạch chân)\b/i;
  const GUIDE = /hướng\s*dẫn\s*làm\s*bài|mẹo|lưu\s*ý|ghi\s*nhớ|cách\s*làm/i;
  /* tiêu đề bảng đáp án phải BẮT ĐẦU bằng cụm này (tránh nhầm với dòng hướng dẫn như "Chọn đáp án đúng nhất…") */
  const KEYHEAD = /^\s*(?:(?:phần|part)\s+[ivx\d]+\s*[:.\-–]\s*)?(?:bảng\s+)?(?:đáp\s*án|answer\s*key|key|hướng\s*dẫn\s*giải|lời\s*giải)\b/i;

  /* ---- bài đọc dạng phiếu: "Task 1: Match…" (ghép từ với nghĩa), "Task 2: … True (T) or False (F)", đoạn văn chung ---- */
  const TASKRE = /^\s*(?:task|exercise|activity|bài\s*tập)\s*(\d+)\s*[:.\-–)]/i;
  const TFEND = /\(?\s*(?:T\s*\/\s*F|True\s*\/\s*False|Đúng\s*\/\s*Sai)\s*\)?[\s.]*$/i;
  const TFCELL = /^\(?\s*(?:T\s*\/\s*F|True\s*\/\s*False|Đúng\s*\/\s*Sai)\s*\)?$/i;
  const ENUM_ONLY = /^(?:\d{1,3}|[a-hA-H])\s*[.)]?$/;
  /** gộp ô "1." + ô "stretching" liền nhau thành "1. stretching" (bảng Word thường tách số/chữ cái ra một ô riêng) */
  function normCells(row) {
    const cells = (row || []).map(c => String(c || "").trim()), out = [];
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i], nx = cells[i + 1];
      if (ENUM_ONLY.test(c) && nx && !ENUM_ONLY.test(nx)) { out.push(c.replace(/[.)]\s*$/, "") + ". " + nx); i++; }
      else out.push(c);
    }
    return out.filter(Boolean);
  }
  const tfOf = v => { const s = String(v || "").trim(); if (/^(?:t|true|đúng|đ)(?![a-zà-ỹ])/i.test(s)) return "T"; if (/^(?:f|false|sai|s)(?![a-zà-ỹ])/i.test(s)) return "F"; return ""; };
  const segOf = (key, taskNo) => (key.segs || []).find(x => x.tn === taskNo) || ((key.segs || []).length === 1 && key.segs[0].tn === 0 ? key.segs[0] : null) || { ans: key.ans, expl: key.expl };
  /** nhận ra bài Đúng/Sai hoặc bài Ghép từ trong một Task; trả {items, warns} hoặc null nếu không phải hai dạng này */
  function detectTask(s, key) {
    const seg = segOf(key, s.taskNo || 0), warns = [], tag = "Task " + (s.taskNo || "?") + ": ";
    /* --- Đúng / Sai: mỗi nhận định một hàng (số | nhận định | T / F) hoặc một đoạn kết thúc bằng T / F --- */
    const tfs = [];
    s.blocks.forEach(b => {
      const rows = b.k === "t" ? b.rows.map(normCells) : String(b.t).split("\n").map(x => [x.trim()]);
      rows.forEach(cells => {
        if (!cells.length) return;
        const last = cells[cells.length - 1]; let stem = "";
        if (cells.length >= 2 && TFCELL.test(last)) stem = cells.slice(0, -1).join(" ");
        else if (cells.length === 1 && TFEND.test(cells[0]) && cells[0].replace(TFEND, "").trim().length > 3) stem = cells[0].replace(TFEND, "");
        else return;
        let num = 0; const m = stem.match(/^\s*(\d{1,3})\s*[.)]\s*([\s\S]+)$/); if (m) { num = +m[1]; stem = m[2]; }
        stem = stem.replace(/\s+/g, " ").trim(); if (stem.length > 2) tfs.push({ num, stem });
      });
    });
    if (tfs.length >= 2) {
      const items = [];
      tfs.forEach((t, i) => {
        const num = t.num || i + 1, v = tfOf(seg.ans[num]);
        if (!v) { warns.push(tag + "câu " + num + " chưa có đáp án T/F trong bảng đáp án (bỏ qua)"); return; }
        const ex = String(seg.expl[num] || "").replace(/\s+/g, " ").trim();
        items.push({ num, type: "tf", line: t.stem + " | " + v + (ex ? " | " + ex : ""), warns: [] });
      });
      return { items, warns, kind: "tf" };
    }
    /* --- Ghép từ với nghĩa: một danh sách 1. 2. 3. và một danh sách a. b. c. (trong bảng hoặc đoạn văn), đáp án "1 – c" --- */
    if (/match|nối|ghép/i.test(s.title || "")) {
      const left = [], right = [];
      const take = x => {
        x = x.replace(/[\s○◯◦•☐□_]+$/g, "").trim(); let m;
        if ((m = x.match(/^(\d{1,2})\s*[.)]\s*([\s\S]+)$/))) left.push({ n: +m[1], t: m[2].trim() });
        else if ((m = x.match(/^([a-hA-H])\s*[.)]\s*([\s\S]+)$/))) right.push({ l: m[1].toLowerCase(), t: m[2].trim() });
      };
      s.blocks.forEach(b => (b.k === "t" ? b.rows.flatMap(normCells) : String(b.t).split("\n")).forEach(c => String(c).split("\n").forEach(x => { x = x.trim(); if (x) take(x); })));
      if (left.length >= 2 && right.length >= 2) {
        const pairs = [];
        left.forEach(l => {
          const a = String(seg.ans[l.n] || ""), lm = a.match(/^\s*\(?([a-hA-H])\b/);
          let r = lm ? right.find(x => x.l === lm[1].toLowerCase()) : (a ? right.find(x => a.toLowerCase().includes(x.t.toLowerCase().slice(0, 18))) : null);
          if (!r) { warns.push(tag + "từ " + l.n + " (" + l.t + ") chưa có đáp án ghép trong bảng đáp án (bỏ qua)"); return; }
          pairs.push(l.t.replace(/\s*=\s*/g, " - ") + " = " + r.t.replace(/\s*=\s*/g, " - "));
        });
        if (right.length > left.length) warns.push(tag + "có " + (right.length - left.length) + " nghĩa thừa (không có từ nào ghép), app bỏ qua các nghĩa thừa");
        return { items: pairs.length >= 2 ? [{ num: 0, type: "match", line: pairs.join("\n"), n: pairs.length, warns: [] }] : [], warns, kind: "match" };
      }
    }
    return null;
  }

  /* sắp xếp từ thành câu: ghép các cụm bị xáo trộn theo câu hoàn chỉnh trong bảng đáp án -> "A / horse / can / …" */
  function orderChunks(chunks, ans) {
    const n1 = s => s.toLowerCase().replace(/[.,;:!?]+$/g, "");
    const toks = ans.replace(/\s+/g, " ").trim().split(" ");
    const pool = chunks.map(c => c.replace(/\s+/g, " ").trim()).filter(c => c && !/^[.?!,;]+$/.test(c));
    const endP = (ans.match(/[.?!]+\s*$/) || [""])[0].trim();
    const used = pool.map(() => false), out = []; let i = 0;
    while (i < toks.length) {
      let best = -1, bestLen = 0;
      pool.forEach((c, k) => {
        if (used[k]) return; const cw = c.split(" "); if (cw.length > toks.length - i) return;
        for (let j = 0; j < cw.length; j++) if (n1(cw[j]) !== n1(toks[i + j])) return;
        if (cw.length > bestLen) { best = k; bestLen = cw.length; }
      });
      if (best < 0) return null;
      used[best] = true; out.push(pool[best]); i += bestLen;
    }
    if (used.some(u => !u) || !out.length) return null;
    if (endP) out[out.length - 1] = out[out.length - 1].replace(/[.?!]+$/, "") + endP;
    return out.join(" / ");
  }

  /* ---- bảng đáp án ---- */
  function parseKey(blocks, startIdx) {
    const key = { ans: {}, expl: {}, parts: [], segs: [] };
    let expCol = 2;                                            // cột "Giải thích" (mặc định cột thứ 3; đọc theo hàng tiêu đề nếu có)
    /* bài đọc nhiều Task, số câu làm lại từ 1 ở mỗi Task: đáp án của từng Task nằm trong một "đoạn" riêng (segs) */
    let seg = null;
    const KT = /^\s*(?:task|exercise|activity|bài\s*tập)\s*(\d+)/i;
    const newSeg = tn => { seg = { tn, ans: {}, expl: {} }; key.segs.push(seg); };
    const put = (n, a, e) => { if (!seg) newSeg(0); seg.ans[n] = a; seg.expl[n] = e || ""; };
    for (let i = startIdx; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.k === "p") { const km = b.t.match(KT); if (km && b.t.length < 120) newSeg(+km[1]); }
      if (b.k === "t") {
        b.rows.forEach(r => {
          const c0 = (r[0] || "").trim();
          const kr = c0.match(KT); if (kr && c0.length < 80) { newSeg(+kr[1]); return; }
          const rowNo = (c0.match(/^(?:câu|cau|question|q)?\s*(\d{1,3})\s*[.:)]?$/i) || [])[1];   // "1", "Câu 1", "Question 1."
          if (!rowNo && r.length >= 4) { const hi = r.findIndex((x, k) => k >= 2 && /giải\s*thích|explanation|lý\s*do|hướng\s*dẫn/i.test(String(x))); if (hi >= 2) expCol = hi; }   // bảng 4 cột: Câu | Đáp án | Từ gạch chân | Giải thích
          if (rowNo && r.length >= 2) { const n = +rowNo; key.ans[n] = (r[1] || "").trim(); key.expl[n] = (r[expCol] || "").trim(); put(n, key.ans[n], key.expl[n]); }
          else if (/^(ph[ầa]n|part|section)\b/i.test(c0)) {
            const m = c0.match(/\((\d+)\s*[–\-—to]+\s*(\d+)\)/i);
            if (m) key.parts.push({ from: +m[1], to: +m[2], title: c0.replace(/\s*\(\d+\s*[–\-—to]+\s*\d+\)\s*/i, "").trim(), full: c0 });
          }
        });
      } else {
        /* đáp án viết gọn trên một dòng: "1 – c, 2 – a, 3 – d, 4 – b" hoặc "1-T 2-F 3-T" */
        const toks = []; b.t.replace(/(\d{1,2})\s*[-–:.)]\s*([a-hA-H]|True|False|T|F|Đúng|Sai)(?![A-Za-zà-ỹ])/g, (all, n, v) => { toks.push([+n, v]); return all; });
        if (toks.length >= 2) { toks.forEach(([n, v]) => { put(n, v, ""); if (!(n in key.ans)) key.ans[n] = v; }); continue; }
        const m = b.t.match(/^(?:câu\s*|question\s*)?(\d{1,3})\s*[.:)\-–]\s*(.+)$/i);
        if (m && !(+m[1] in key.ans)) key.ans[+m[1]] = m[2].trim();
        if (m) put(+m[1], m[2].trim(), "");
      }
    }
    return key;
  }

  /* ---- tách phần & câu hỏi ---- */
  function splitOptions(text) {
    const t = "\n" + text; const pos = []; let from = 0;
    for (const L2 of "ABCDEFGH") {
      const re = new RegExp("(?:^|[\\s\\n])" + L2 + "[.)]\\s", "g"); re.lastIndex = from;
      const m = re.exec(t); if (!m) break;
      const at = m.index + (m[0].match(/^[\s\n]/) ? 1 : 0);
      pos.push({ l: L2, at, start: at + 2 }); from = m.index + m[0].length - 1;
      if (L2 === "A") { /* A phải xuất hiện đầu tiên */ }
    }
    if (pos.length < 2 || pos[0].l !== "A") return null;
    const opts = pos.map((p, i) => ({ l: p.l, t: t.slice(p.start, i + 1 < pos.length ? pos[i + 1].at : t.length).replace(/\s+/g, " ").trim() }));
    return { stem: t.slice(0, pos[0].at).replace(/\s+/g, " ").trim(), opts };
  }

  /* ---- khung mẹo làm bài ở đầu file ---- */
  const blocks0 = (main, end) => main.slice(0, end);
  const flat = b => b.k === "t" ? b.rows.map(r => r.filter(Boolean).join("\n")).filter(Boolean).join("\n") : b.t;
  const isHeadLine = t => t.length < 160 && /^\s*(?:[★☆✦✧●▶►]|(?:phần|part)\s+[ivx\d]+\b|mẹo\s*\d)/i.test(t);
  /** bảng Word -> các dòng "| ô | ô |" (ô nhiều dòng gộp bằng " · "); engine.richBlock vẽ lại thành bảng */
  const tableLines = rows => rows.filter(r => r.some(c => String(c).trim())).map(r => "| " + r.map(c => String(c).replace(/\s*\n\s*/g, " · ").replace(/\|/g, "/").trim()).join(" | ") + " |");
  /** bảng từ vựng có cột Phiên âm: chỉ giữ Từ vựng + Phiên âm, bỏ cột Trọng âm / Dấu hiệu / Mẹo (tránh lộ đáp án bài trọng âm) */
  function slimPhonetic(rows, note) {
    const head = rows[0] || [];
    if (!head.some(c => /phiên\s*âm|\bipa\b/i.test(c))) return rows;
    const keep = head.map((c, i) => /phiên\s*âm|\bipa\b/i.test(c) || !/trọng\s*âm|stress|dấu\s*hiệu|mẹo/i.test(c));
    if (keep.every(Boolean)) return rows;
    note.dropped = head.filter((c, i) => !keep[i]).map(c => String(c).replace(/\s+/g, " ").trim());
    return rows.map(r => r.filter((c, i) => keep[i] !== false));
  }
  function buildGuide(lead, titleBlock, taskFile, note) {
    const isGuide = b => b !== titleBlock && (b.k === "t" ? GUIDE.test(flat(b).slice(0, 80)) : (!taskFile && b.t.length < 100 && GUIDE.test(b.t.slice(0, 80))));
    const at = lead.findIndex(isGuide);
    if (at < 0) return "";
    let g = lead.slice(at).filter(b => b !== titleBlock);
    while (g.length && g[g.length - 1].k === "p" && g[g.length - 1].t.length < 100 && g[g.length - 1].t === g[g.length - 1].t.toUpperCase()) g.pop();   // dòng "PHẦN III: 20 CÂU BÀI TẬP…" ngay trước câu 1
    if (taskFile) g = g.filter(b => b.k === "t");
    const out = [];
    g.forEach(b => {
      if (b.k === "t") { const rows = tableLines(slimPhonetic(b.rows, note)); if (rows.length) { if (out.length) out.push(""); out.push(...rows); out.push(""); } return; }
      const t = (b.tb || b.t).replace(/<\/?u>/g, "");
      if (isHeadLine(b.t)) out.push("", "**" + t.replace(/\*\*/g, "").replace(/\n/g, " ") + "**"); else out.push(t);
    });
    return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function parseDocx(blocks, fileName) {
    const warns = [];
    let keyAt = blocks.findIndex(b => b.k === "p" && KEYHEAD.test(b.t) && b.t.length < 90 && !QRE.test(b.t));
    if (keyAt < 0) keyAt = blocks.findIndex(b => b.k === "t" && /đáp\s*án|answer/i.test((b.rows[0] || []).join(" ")));
    const key = keyAt >= 0 ? parseKey(blocks, keyAt) : { ans: {}, expl: {}, parts: [], segs: [] };
    if (keyAt < 0) warns.push("Không thấy bảng/đoạn ĐÁP ÁN trong file. Các câu sẽ chưa có đáp án đúng, cô cần đánh dấu lại trong bước chỉnh sửa. (Gợi ý: tiêu đề có chữ \"ĐÁP ÁN\" và bảng có cột Câu | Đáp án | Giải thích.)");
    const main = keyAt >= 0 ? blocks.slice(0, keyAt) : blocks;

    let title = "", secs = [], cur = null, q = null, started = false;
    const pre = [], guide = [];                              // pre: đoạn văn đứng trước "Task 1" (bài đọc chung); guide: khung "Hướng dẫn làm bài" đứng trước đề
    let bi = 0, leadEnd = -1, titleBlock = null;               // leadEnd: vị trí khối đầu tiên mở phần bài (mọi thứ đứng trước là phần mở đầu của file)
    const newSec = t => { if (leadEnd < 0) leadEnd = bi; cur = { title: t, desc: [], qs: [] }; secs.push(cur); q = null; };
    const flushQ = () => { q = null; };
    main.forEach((b, bIdx) => {
      bi = bIdx;
      /* "Task 1: …" mở một phần mới; mọi khối đứng sau nó (đoạn, bảng) được giữ lại để nhận dạng bài Ghép / Đúng-Sai */
      if (b.k === "p" && b.t.length < 260 && TASKRE.test(b.t)) { newSec(stripU(b.t)); cur.task = true; cur.taskNo = +b.t.match(TASKRE)[1]; cur.blocks = []; return; }
      if (cur && cur.task) cur.blocks.push(b);
      if (b.k === "t") {
        const txt = b.rows.map(r => r.filter(Boolean).join("\n")).filter(Boolean).join("\n");
        if (!cur) { if (GUIDE.test(txt.slice(0, 80))) return; if (title && txt.replace(/\s+/g, " ").length >= 160) pre.push(txt); return; }   // bảng thông tin đầu đề (Môn, Thời gian, Họ tên…) bỏ qua
        if (!cur.qs.length) { if (txt) cur.desc.push(txt); } else if (q) q.lines.push(txt);
        return;
      }
      const m = b.t.match(QRE);
      const isQ = m && !INSTR.test(b.t) && (m[2] !== "" || /^(question|câu)/i.test(b.t));
      if (isQ) {
        if (!cur) newSec("");
        q = { num: +m[1], lines: [m[2]] }; cur.qs.push(q); started = true; return;
      }
      if (!cur && !started && b.t.length < 260 && VIINSTR.test(b.t)) { newSec(b.t.replace(/^\s*bài\s*tập\s*[:.\-–]\s*/i, "").replace(/\s*[:：]\s*$/, "").trim()); return; }   // "Bài tập: Hãy đặt câu hỏi cho phần gạch chân…"
      if (INSTR.test(b.t) && b.t.length < 220 && (!cur || cur.qs.length || !cur.title)) {
        newSec(b.t); return;
      }
      if (!cur) { if (!title) { title = stripU(b.t).replace(/\s*\n\s*/g, " – "); titleBlock = b; } else if (b.t.length >= 40) pre.push(b.tb || b.t); return; }
      if (!cur.qs.length) cur.desc.push(b.tb || b.t); else if (q) q.lines.push(b.t);
    });
    /* Task ghép từ / đúng-sai: nhận dạng từ bảng + đoạn, bỏ qua cách tách câu theo số thứ tự thông thường */
    secs.forEach(s => {
      if (!s.task) return;
      const det = detectTask(s, key);
      if (det) { s.pre = det.items; s.qs = []; s.desc = []; warns.push(...det.warns); }
    });
    const passage = pre.join("\n\n").trim(), usePassage = passage.replace(/\s+/g, " ").length >= 160;
    secs = secs.filter(s => s.qs.length || (s.pre && s.pre.length));
    /* KHUNG MẸO LÀM BÀI đứng trước đề (đoạn văn + bảng): đưa lên đầu bài (hw.desc), rộng hết khổ, bảng hiển thị thành bảng thật.
       Bắt đầu từ khối đầu tiên có chữ "mẹo / hướng dẫn làm bài / lưu ý / ghi nhớ / cách làm" ở đầu; bỏ tiêu đề file và dòng tiêu đề phần đứng ngay trước câu 1. */
    const gnote = { dropped: null };
    const guideText = buildGuide(blocks0(main, leadEnd < 0 ? main.length : leadEnd), titleBlock, secs.some(x => x.task), gnote);
    if (gnote.dropped) warns.push("Bảng từ vựng ở đầu file: chỉ giữ cột Từ vựng + Phiên âm, đã bỏ cột " + gnote.dropped.map(x => "\"" + x + "\"").join(", ") + " (để học sinh không thấy sẵn trọng âm).");

    /* câu hỏi -> kiểu */
    secs.forEach(s => {
      s.items = s.pre || s.qs.map(qq => {
        let text = qq.lines.join("\n").trim();
        { const fl = text.split("\n")[0]; if ((fl.match(/\//g) || []).length >= 3 && !/_{3,}|\.{4,}|…/.test(fl)) text = fl.trim(); }   // sắp xếp từ thành câu: dòng "➔ ? ____" bên dưới chỉ là chỗ viết trên giấy
        const key1 = key.ans[qq.num] || "", ex = key.expl[qq.num] || "";
        const o = splitOptions(text);
        if (o) {
          let stem = o.stem;
          /* câu không có đề, chỉ có A/B/C và đoạn văn có "(21) ____" -> bài đọc điền chỗ trống (xem clozeMerge) */
          const cloze = !stem && s.desc.join(" ").includes("(" + qq.num + ")");
          if (!stem) stem = cloze ? "Chỗ trống (" + qq.num + ")" : "Choose the correct answer.";
          const lm = key1.match(/^([A-H])(?![A-Za-z])/i); const letter = lm ? lm[1].toUpperCase() : "";
          const w = [];
          if (!key1) w.push("Câu " + qq.num + ": chưa có đáp án trong bảng đáp án");
          else if (!letter || !o.opts.some(x => x.l === letter)) w.push("Câu " + qq.num + ": đáp án \"" + key1 + "\" không khớp A/B/C/D");
          return { num: qq.num, type: "mcq1", stem, opts: o.opts, letter, expl: ex, warns: w, cloze };
        }
        if (/\([A-D]\)/.test(text)) {            // tìm lỗi sai
          const w = [];
          const km = key1.match(/^([A-D])\s*[\(:\-–]?\s*(.*?)\)?\s*$/i);
          const letter = km ? km[1].toUpperCase() : "";
          const fix = km ? (km[2] || "").split(/→|->|=>/) : [];
          const right = (fix[1] || "").trim(), left = (fix[0] || "").trim();
          if (!letter || !right) { w.push("Câu " + qq.num + ": đáp án tìm lỗi cần dạng \"C (find → finds)\", hiện là \"" + key1 + "\""); }
          // tách đoạn trước từng (X)
          const parts = []; const re = /\(([A-D])\)/g; let last = 0, mm;
          while ((mm = re.exec(text))) { parts.push({ l: mm[1], seg: text.slice(last, mm.index) }); last = mm.index + mm[0].length; }
          const tail = text.slice(last);
          let sentence = parts.map(p => p.seg).join("") + tail; sentence = stripU(sentence).replace(/\s+/g, " ").replace(/\s+([.,;!?])/g, "$1").trim();
          // vị trí đoạn sai
          let marked = "";
          if (letter && right) {
            let pre = "", before = "";
            for (const p of parts) { if (p.l === letter) { before = pre; const sg = stripU(p.seg); const clean = sg.replace(/\s+/g, " ");
              const idx = left ? clean.toLowerCase().lastIndexOf(left.toLowerCase()) : -1;
              let wrong = left && idx >= 0 ? clean.slice(idx, idx + left.length) : null;
              if (!wrong) { const um = p.seg.match(/<u>([^<]+)<\/u>\s*$/); wrong = um ? um[1].trim() : (clean.trim().split(" ").pop()); }
              const full = (before + clean).replace(/\s+/g, " ");
              const at = full.toLowerCase().lastIndexOf(wrong.toLowerCase());
              const rest = parts.slice(parts.indexOf(p) + 1).map(x => stripU(x.seg)).join("") + stripU(tail);
              marked = (full.slice(0, at) + "[[" + wrong + "]]" + full.slice(at + wrong.length) + rest).replace(/\s+/g, " ").replace(/\s+([.,;!?])/g, "$1").trim(); break; }
              pre += stripU(p.seg); }
          }
          return { num: qq.num, type: "errfix", sentence, marked, fixes: right ? right.split(/\s*\/\s*/) : [], expl: ex, warns: marked ? w : w.concat("Câu " + qq.num + ": chưa tạo được câu tìm lỗi (sẽ bỏ qua)") };
        }
        if (/^[→➜➔>-]\s/.test(text.split("\n")[1] || "") || /\n\s*(→|->)/.test(text)) {   // viết lại câu
          const ls = text.split("\n").map(x => x.trim()).filter(Boolean);
          const ARROW = /^\s*(?:→|->|➜|➔|⟶|⇒|>)\s*/;
          /* GIỮ chữ gạch chân ở câu gốc: với bài "đặt câu hỏi cho phần gạch chân" đó chính là đề bài */
          const src = ls[0], starter = ls.slice(1).join(" ").replace(ARROW, "").replace(/[….]{2,}|_{3,}/g, "").trim();
          const ans = key1.replace(ARROW, "").trim();
          return { num: qq.num, type: "transform", src, starter, answers: ans ? ans.split(/\s+\/\s+/) : [], expl: ex, warns: ans ? [] : ["Câu " + qq.num + ": chưa có đáp án viết lại câu"] };
        }
        if (text.split("/").length >= 4 && !/_{3,}|\.{4,}|…/.test(text)) {   // sắp xếp từ thành câu: từ / từ / từ / …
          const chunks = text.split("/").map(x => x.replace(/\s+/g, " ").trim()).filter(Boolean);
          const ans = key1.replace(/\s+/g, " ").trim(), w = []; let line = "";
          if (!ans) w.push("Câu " + qq.num + ": chưa có câu hoàn chỉnh trong bảng đáp án");
          else { line = orderChunks(chunks, ans); if (!line) { w.push("Câu " + qq.num + ": không ghép được các cụm với đáp án, đã tách theo từng từ (cô kiểm tra lại)"); line = ans.split(" ").join(" / "); } }
          return { num: qq.num, type: "sentence", line, expl: ex, warns: w, skip: !ans };
        }
        if (/_{3,}|\.{4,}|…/.test(text)) {       // điền từ có gợi ý trong ngoặc
          const hm = text.match(/\(([A-Za-zÀ-ỹ][^()]{0,40})\)\s*[.?!]?\s*$/);
          const hint = hm ? hm[1].trim() : "";
          let body = hm ? text.slice(0, hm.index).trim() : text;
          const blanks = body.match(/_{3,}|\.{4,}|…+/g) || [];
          const ans = key1.replace(/[.]+$/, "").trim();
          const w = [];
          if (!ans) w.push("Câu " + qq.num + ": chưa có đáp án điền từ");
          if (blanks.length !== 1) w.push("Câu " + qq.num + ": có " + blanks.length + " chỗ trống, hãy kiểm tra sau khi chỉnh");
          body = stripU(body).replace(/\s+/g, " ");
          let done = false;
          const line = body.replace(/_{3,}|\.{4,}|…+/, () => { done = true; return "[[" + (ans || "?") + "]]" + (hint ? "{" + hint + "}" : ""); });
          return { num: qq.num, type: hint ? "fillhint" : "fill", line, expl: ex, warns: w };
        }
        return { num: qq.num, type: "?", text, warns: ["Câu " + qq.num + ": chưa nhận ra dạng câu, nên bỏ qua (cô thêm tay trong bước chỉnh sửa)"] };
      });
    });

    /* tách phần theo các "PHẦN I, II, III" trong bảng đáp án */
    let out = [];
    secs.forEach(s => {
      const groups = [];
      s.items.forEach(it => {
        const part = key.parts.find(p => it.num >= p.from && it.num <= p.to);
        const gk = it.type + "|" + (part ? part.full : "");
        const g = groups[groups.length - 1];
        if (g && g.gk === gk) g.items.push(it); else groups.push({ gk, part, type: it.type, items: [it] });
      });
      groups.forEach((g, gi) => out.push({ title: g.part ? prettyPart(g.part) : (s.title || "Phần " + (out.length + 1)), instr: s.title, desc: gi === 0 ? s.desc.join("\n\n") : (g.part ? "" : s.desc.join("\n\n")), topic: g.part ? g.part.title.replace(/^(ph[ầa]n|part|section)\s+[IVX\d]+\s*[:.\-–]\s*/i, "").toLowerCase() : "", type: g.type, items: g.items, task: !!s.task }));
    });
    /* đoạn văn đứng trước Task 1 là bài đọc chung: gắn vào mọi Task để app ghim đoạn văn cạnh câu hỏi */
    if (usePassage) out.forEach(o => { if (o.task) o.desc = passage + (o.desc ? "\n\n" + o.desc : ""); });
    /* nếu tách theo PHẦN thì giữ yêu cầu đề bài trong mô tả */
    out.forEach(o => { if (o.title !== o.instr && o.instr && !o.desc.includes(o.instr)) o.desc = (o.instr + (o.desc ? "\n\n" + o.desc : "")).trim(); });

    /* Bài đọc điền chỗ trống: đoạn văn có "(21) ____" + các câu "Question 21. A. … B. … C. …" chỉ có đáp án.
       Gộp thành MỘT bài dạng "Điền từ (chọn trong danh sách)": ô chọn nằm ngay trong đoạn văn, học sinh không phải kéo xuống.
       Chỉ gộp khi mọi câu đều có đáp án đúng và tìm thấy đủ chỗ trống; nếu không thì giữ nguyên dạng trắc nghiệm. */
    const clozeMerge = o => {
      if (o.type !== "mcq1" || o.items.length < 2) return null;
      if (!o.items.every(it => it.type === "mcq1" && it.cloze && it.letter && it.opts.some(x => x.l === it.letter))) return null;
      let text = stripU(o.desc || ""), instrText = stripU(o.instr || "").trim();
      if (instrText && text.startsWith(instrText)) text = text.slice(instrText.length);
      const clean = s => String(s).replace(/[|\[\]]/g, "/").replace(/\s+/g, " ").trim();
      for (const it of o.items) {
        const re = new RegExp("(?:\\*\\*)?\\(\\s*" + it.num + "\\s*\\)(?:\\*\\*)?\\s*(?:_{2,}|\\.{3,}|…+)");
        if (!re.test(text)) return null;
        const list = it.opts.map(x => (x.l === it.letter ? "*" : "") + clean(x.t)).join("|");
        text = text.replace(re, "(" + it.num + ") [[" + list + "]]");
      }
      text = text.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
      const expl = o.items.map(it => { const right = it.opts.find(x => x.l === it.letter); return "(" + it.num + ") " + clean(right.t) + (it.expl ? " – " + clean(it.expl) : ""); }).join("  ·  ");
      const title = stripU(o.title);
      return { title, type: "fillchoose", desc: instrText && instrText !== title ? instrText : "", topic: o.topic, raw: text + "\nEXP: " + expl, n: o.items.length, warns: [].concat(...o.items.map(it => it.warns || [])) };
    };

    const sections = [], notes = [];
    out.forEach((o, i) => {
      const cz = clozeMerge(o);
      if (cz) { sections.push(cz); return; }
      const sec = { title: stripU(o.title), type: o.type === "?" ? "mcq1" : o.type, desc: stripU(o.desc), topic: o.topic, raw: "", n: 0, warns: [], numFresh: !!o.task, tfLabels: "en" };
      const lines = [];
      o.items.forEach(it => {
        sec.warns.push(...(it.warns || []));
        if (it.type === "mcq1") {
          if (o.type !== "mcq1") return;
          const t = [it.stem]; it.opts.forEach(x => t.push((x.l === it.letter ? "*" : "") + x.l + ". " + x.t)); if (it.expl) t.push("EXP: " + it.expl.replace(/\n/g, " ")); lines.push(t.join("\n")); sec.n++;
        } else if (it.type === "errfix") { if (!it.marked) return; lines.push(it.marked + " => " + it.fixes.join(" / ") + (it.expl ? "\nEXP: " + it.expl.replace(/\n/g, " ") : "")); sec.n++; }
        else if (it.type === "transform") { if (!it.answers.length) return; lines.push(it.src + (it.starter ? " | " + it.starter : "") + " => " + it.answers.join(" / ") + (it.expl ? "\nEXP: " + it.expl.replace(/\n/g, " ") : "")); sec.n++; }
        else if (it.type === "fill" || it.type === "fillhint") { lines.push(it.line + (it.expl ? "\nEXP: " + it.expl.replace(/\n/g, " ") : "")); sec.n++; }
        else if (it.type === "sentence") { if (it.skip || !it.line) return; lines.push(it.line + (it.expl ? "\nEXP: " + it.expl.replace(/\n/g, " ") : "")); sec.n++; }
        else if (it.type === "tf") { lines.push(it.line); sec.n++; }
        else if (it.type === "match") { lines.push(it.line); sec.n += it.n; }
      });
      if (o.type === "?") { sec.type = "mcq1"; }
      sec.raw = lines.join(o.type === "transform" || o.type === "errfix" || o.type === "fill" || o.type === "fillhint" || o.type === "sentence" || o.type === "tf" ? "\n" : "\n\n");
      if (sec.n) sections.push(sec); else if (sec.warns.length) notes.push(...sec.warns);
    });
    sections.forEach(s => { if (s.type === "fill" || s.type === "fillhint") s.raw = s.raw.replace(/\nEXP:/g, "\nEXP:"); });
    let unitNo = 0;   // "UNIT 4" trong vài dòng đầu file -> app gợi ý đúng unit khi xếp bài vào giáo trình
    for (const b of blocks.slice(0, 8)) { if (b.k !== "p") continue; const um = b.t.match(/\bunit\s*0*(\d{1,2})\b/i); if (um) { unitNo = +um[1]; break; } }
    const nQ = sections.reduce((a, s) => a + s.n, 0);
    if (!nQ) warns.push("Chưa nhận ra câu hỏi nào. File cần có câu dạng \"Question 1.\" hoặc \"1.\" hoặc \"Câu 1.\".");
    return { title: title || (fileName || "").replace(/\.docx$/i, "").replace(/[_]+/g, " "), sections, warns: warns.concat(notes), hasKey: keyAt >= 0, nQ, unitNo, guide: guideText };
  }
  const prettyPart = p => { const t = p.full.replace(/\s*\(\d+\s*[–\-—to]+\s*\d+\)\s*/i, "").trim(); const m = t.match(/^(ph[ầa]n|part|section)\s+([IVX\d]+)\s*[:.\-–]\s*(.+)$/i); const nm = m ? m[3].toLowerCase().replace(/(^|\s)\S/g, x => x.toUpperCase()) : t; return (m ? "Phần " + m[2] + ": " : "") + nm + " (" + p.from + "–" + p.to + ")"; };

  L.docx = {
    async parseFile(file) { return parseDocx(await readBlocks(file), file.name); },
    parseDocx, readBlocks
  };
})(window.LSE);
