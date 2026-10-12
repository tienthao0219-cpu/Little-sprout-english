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
        const t = paraText(c); if (t) blocks.push({ k: "p", t, style: sty ? (sty.getAttributeNS(W, "val") || sty.getAttribute("w:val") || "") : "" });
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
  const KEYHEAD = /(đáp\s*án|answer\s*key|^key\b|hướng\s*dẫn\s*giải)/i;

  /* ---- bảng đáp án ---- */
  function parseKey(blocks, startIdx) {
    const key = { ans: {}, expl: {}, parts: [] };
    for (let i = startIdx; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.k === "t") {
        b.rows.forEach(r => {
          const c0 = (r[0] || "").trim();
          if (/^\d{1,3}$/.test(c0) && r.length >= 2) { const n = +c0; key.ans[n] = (r[1] || "").trim(); key.expl[n] = (r[2] || "").trim(); }
          else if (/^(ph[ầa]n|part|section)\b/i.test(c0)) {
            const m = c0.match(/\((\d+)\s*[–\-—to]+\s*(\d+)\)/i);
            if (m) key.parts.push({ from: +m[1], to: +m[2], title: c0.replace(/\s*\(\d+\s*[–\-—to]+\s*\d+\)\s*/i, "").trim(), full: c0 });
          }
        });
      } else {
        const m = b.t.match(/^(?:câu\s*|question\s*)?(\d{1,3})\s*[.:)\-–]\s*(.+)$/i);
        if (m && !(+m[1] in key.ans)) key.ans[+m[1]] = m[2].trim();
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

  function parseDocx(blocks, fileName) {
    const warns = [];
    let keyAt = blocks.findIndex(b => b.k === "p" && KEYHEAD.test(b.t) && b.t.length < 90 && !QRE.test(b.t));
    if (keyAt < 0) keyAt = blocks.findIndex(b => b.k === "t" && /đáp\s*án|answer/i.test((b.rows[0] || []).join(" ")));
    const key = keyAt >= 0 ? parseKey(blocks, keyAt) : { ans: {}, expl: {}, parts: [] };
    if (keyAt < 0) warns.push("Không thấy bảng/đoạn ĐÁP ÁN trong file. Các câu sẽ chưa có đáp án đúng, cô cần đánh dấu lại trong bước chỉnh sửa. (Gợi ý: tiêu đề có chữ \"ĐÁP ÁN\" và bảng có cột Câu | Đáp án | Giải thích.)");
    const main = keyAt >= 0 ? blocks.slice(0, keyAt) : blocks;

    let title = "", secs = [], cur = null, q = null, started = false;
    const newSec = t => { cur = { title: t, desc: [], qs: [] }; secs.push(cur); q = null; };
    const flushQ = () => { q = null; };
    main.forEach(b => {
      if (b.k === "t") {
        const txt = b.rows.map(r => r.filter(Boolean).join("\n")).filter(Boolean).join("\n");
        if (!cur) return;                                   // bảng thông tin đầu đề (Môn, Thời gian, Họ tên…) bỏ qua
        if (!cur.qs.length) { if (txt) cur.desc.push(txt); } else if (q) q.lines.push(txt);
        return;
      }
      const m = b.t.match(QRE);
      const isQ = m && !INSTR.test(b.t) && (m[2] !== "" || /^(question|câu)/i.test(b.t));
      if (isQ) {
        if (!cur) newSec("");
        q = { num: +m[1], lines: [m[2]] }; cur.qs.push(q); started = true; return;
      }
      if (INSTR.test(b.t) && b.t.length < 220 && (!cur || cur.qs.length || !cur.title)) {
        newSec(b.t); return;
      }
      if (!cur) { if (!title) title = stripU(b.t); return; }
      if (!cur.qs.length) cur.desc.push(b.t); else if (q) q.lines.push(b.t);
    });
    secs = secs.filter(s => s.qs.length);

    /* câu hỏi -> kiểu */
    secs.forEach(s => {
      s.items = s.qs.map(qq => {
        const text = qq.lines.join("\n").trim();
        const key1 = key.ans[qq.num] || "", ex = key.expl[qq.num] || "";
        const o = splitOptions(text);
        if (o) {
          let stem = o.stem;
          if (!stem) stem = s.desc.join(" ").includes("(" + qq.num + ")") ? "Chỗ trống (" + qq.num + ")" : "Choose the correct answer.";
          const lm = key1.match(/^([A-H])(?![A-Za-z])/i); const letter = lm ? lm[1].toUpperCase() : "";
          const w = [];
          if (!key1) w.push("Câu " + qq.num + ": chưa có đáp án trong bảng đáp án");
          else if (!letter || !o.opts.some(x => x.l === letter)) w.push("Câu " + qq.num + ": đáp án \"" + key1 + "\" không khớp A/B/C/D");
          return { num: qq.num, type: "mcq1", stem, opts: o.opts, letter, expl: ex, warns: w };
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
          const src = ls[0], starter = ls.slice(1).join(" ").replace(/^(→|->|➜)\s*/, "").replace(/[….]{2,}|_{3,}/g, "").trim();
          const ans = key1.replace(/^(→|->|➜)\s*/, "").trim();
          return { num: qq.num, type: "transform", src: stripU(src), starter, answers: ans ? ans.split(/\s+\/\s+/) : [], expl: ex, warns: ans ? [] : ["Câu " + qq.num + ": chưa có đáp án viết lại câu"] };
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
      groups.forEach((g, gi) => out.push({ title: g.part ? prettyPart(g.part) : (s.title || "Phần " + (out.length + 1)), instr: s.title, desc: gi === 0 ? s.desc.join("\n\n") : (g.part ? "" : s.desc.join("\n\n")), topic: g.part ? g.part.title.replace(/^(ph[ầa]n|part|section)\s+[IVX\d]+\s*[:.\-–]\s*/i, "").toLowerCase() : "", type: g.type, items: g.items }));
    });
    /* nếu tách theo PHẦN thì giữ yêu cầu đề bài trong mô tả */
    out.forEach(o => { if (o.title !== o.instr && o.instr && !o.desc.includes(o.instr)) o.desc = (o.instr + (o.desc ? "\n\n" + o.desc : "")).trim(); });

    const sections = [], notes = [];
    out.forEach((o, i) => {
      const sec = { title: stripU(o.title), type: o.type === "?" ? "mcq1" : o.type, desc: stripU(o.desc), topic: o.topic, raw: "", n: 0, warns: [] };
      const lines = [];
      o.items.forEach(it => {
        sec.warns.push(...(it.warns || []));
        if (it.type === "mcq1") {
          if (o.type !== "mcq1") return;
          const t = [it.stem]; it.opts.forEach(x => t.push((x.l === it.letter ? "*" : "") + x.l + ". " + x.t)); if (it.expl) t.push("EXP: " + it.expl.replace(/\n/g, " ")); lines.push(t.join("\n")); sec.n++;
        } else if (it.type === "errfix") { if (!it.marked) return; lines.push(it.marked + " => " + it.fixes.join(" / ") + (it.expl ? "\nEXP: " + it.expl.replace(/\n/g, " ") : "")); sec.n++; }
        else if (it.type === "transform") { if (!it.answers.length) return; lines.push(it.src + (it.starter ? " | " + it.starter : "") + " => " + it.answers.join(" / ") + (it.expl ? "\nEXP: " + it.expl.replace(/\n/g, " ") : "")); sec.n++; }
        else if (it.type === "fill" || it.type === "fillhint") { lines.push(it.line + (it.expl ? "\nEXP: " + it.expl.replace(/\n/g, " ") : "")); sec.n++; }
      });
      if (o.type === "?") { sec.type = "mcq1"; }
      sec.raw = lines.join(o.type === "transform" || o.type === "errfix" || o.type === "fill" || o.type === "fillhint" ? "\n" : "\n\n");
      if (sec.n) sections.push(sec); else if (sec.warns.length) notes.push(...sec.warns);
    });
    sections.forEach(s => { if (s.type === "fill" || s.type === "fillhint") s.raw = s.raw.replace(/\nEXP:/g, "\nEXP:"); });
    const nQ = sections.reduce((a, s) => a + s.n, 0);
    if (!nQ) warns.push("Chưa nhận ra câu hỏi nào. File cần có câu dạng \"Question 1.\" hoặc \"1.\" hoặc \"Câu 1.\".");
    return { title: title || (fileName || "").replace(/\.docx$/i, "").replace(/[_]+/g, " "), sections, warns: warns.concat(notes), hasKey: keyAt >= 0, nQ };
  }
  const prettyPart = p => { const t = p.full.replace(/\s*\(\d+\s*[–\-—to]+\s*\d+\)\s*/i, "").trim(); const m = t.match(/^(ph[ầa]n|part|section)\s+([IVX\d]+)\s*[:.\-–]\s*(.+)$/i); const nm = m ? m[3].toLowerCase().replace(/(^|\s)\S/g, x => x.toUpperCase()) : t; return (m ? "Phần " + m[2] + ": " : "") + nm + " (" + p.from + "–" + p.to + ")"; };

  L.docx = {
    async parseFile(file) { return parseDocx(await readBlocks(file), file.name); },
    parseDocx, readBlocks
  };
})(window.LSE);
