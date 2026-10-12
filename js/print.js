/* In phiếu bài tập (A4) + trang đáp án. Dùng "In / Lưu PDF" của trình duyệt (chọn "Lưu dưới dạng PDF"). */
window.LSE = window.LSE || {};
(function (L) {
  const { h, shuffle } = L;
  const LET = "ABCDEFGH";
  const U = n => h("span.pu", { style: "min-width:" + Math.max(70, Math.min(260, (n || 8) * 9)) + "px" });
  const pimg = v => { const r = v && L.imgs && L.imgs.resolve(v); return !r ? null : r.k === "img" ? h("img.pimg", { src: r.src, alt: r.word || "" }) : h("span.pemoji", r.e); };
  const short = t => String(t || "").length <= 24;
  const imgLeft = t => { const m = String(t).match(/^\s*img\s*:\s*(.+)$/i); return m ? pimg(m[1]) || m[1] : String(t); };
  const leftText = t => { const m = String(t).match(/^\s*img\s*:\s*(.+)$/i); return m ? (L.imgs.text(m[1]) || m[1]) : String(t); };

  /* mỗi hàm trả {s: nút phiếu học sinh, k: chuỗi đáp án} */
  function item(q, no, sec, rt) {
    const num = h("span.no", no + ".");
    const stem = (extra) => h("div", num, q.stem ? L.rich(q.stem) : "", extra || null);
    const wrap = (...kids) => h("div.pq", ...kids);
    switch (q.type) {
      case "mcq1": case "mcqN": {
        const inline = q.opts.every(o => short(o.t));
        return { s: wrap(stem(q.type === "mcqN" ? h("i", "  (choose all correct answers)") : null), pimg(q.img), q.opts.map((o, i) => h("span.po", inline ? {} : { style: "display:block" }, [LET[i] + ". ", L.rich(o.t)]))), k: q.opts.map((o, i) => o.ok ? LET[i] : "").filter(Boolean).join(", ") };
      }
      case "tf": { const lb = sec.tfLabels === "vi" ? ["Đúng", "Sai"] : ["True", "False"]; return { s: wrap(stem(h("span", "   ☐ " + lb[0] + "    ☐ " + lb[1])), pimg(q.img)), k: q.answer ? lb[0] : lb[1] }; }
      case "tf4": { const lb = sec.tfLabels === "vi" ? ["Đ", "S"] : ["T", "F"]; return { s: wrap(stem(), pimg(q.img), q.subs.map((s, i) => h("div", { style: "margin-left:18px" }, "abcdefgh"[i] + ") " + s.t, h("span", "    ☐ " + lb[0] + "   ☐ " + lb[1])))), k: q.subs.map((s, i) => "abcdefgh"[i] + ")" + (s.answer ? lb[0] : lb[1])).join("  ") }; }
      case "fill": case "fillhint": case "fillchoose": case "fillbank": {
        let first = true; const k = [];
        const kids = q.parts.map(p => {
          if (p.k === "t") return document.createTextNode(p.s);
          k.push(p.answers[0]);
          return h("span", U(p.answers[0].length), p.hint ? h("span", " (" + p.hint + ")") : null, p.choose ? h("span", " (" + p.opts.join(" / ") + ")") : null);
        });
        return { s: wrap(h("div", num, kids), pimg(q.img)), k: k.join(" ; ") };
      }
      case "short": return { s: wrap(stem(), pimg(q.img), h("div.pline")), k: q.answers.join(" / ") };
      case "wordpick": return { s: wrap(h("div", num, q.stem || "Circle the correct words.", h("div", { style: "margin-top:4px;line-height:2" }, q.toks.map(t => document.createTextNode(t.w))))), k: q.toks.filter(t => t.ok).map(t => t.w).join(", ") };
      case "match": {
        const rights = shuffle(q.pairs.map((p, i) => ({ r: p.r, i }))), key = {};
        rights.forEach((x, pos) => key[x.i] = LET[pos] || "?");
        return { s: wrap(stem(), h("div.pcols", h("div", q.pairs.map((p, i) => h("div", { style: "margin:5px 0" }, (i + 1) + ". ", imgLeft(p.l), "  ......"))), h("div", rights.map((x, pos) => h("div", { style: "margin:5px 0" }, LET[pos] + ". " + x.r))))), k: q.pairs.map((p, i) => (i + 1) + "-" + key[i]).join("  ") };
      }
      case "order": {
        const sh = shuffle(q.items.map((t, i) => ({ t, i }))), pos = {}; sh.forEach((x, p) => pos[x.i] = p);
        return { s: wrap(stem(), sh.map((x, p) => h("div", { style: "margin-left:14px" }, LET[p] + ". " + x.t)), h("div", { style: "margin-top:4px" }, "Order: ", q.items.map(() => h("span", U(2), " "))), h("div.small", "(write the letters in the correct order)")), k: q.items.map((t, i) => LET[pos[i]]).join(" → ") };
      }
      case "sentence": return { s: wrap(h("div", num, q.chunks.length ? shuffle(q.chunks.slice()).join("  /  ") : ""), q.hint ? h("div", { style: "font-size:13px" }, "(" + q.hint + ")") : null, h("div.pline")), k: q.chunks.join(" ") };
      case "classify": {
        const pool = shuffle(q.items.map(x => x.t));
        return { s: wrap(stem(), h("div.pwords", pool.map(t => h("span", t))), h("table.ptbl", h("thead", h("tr", q.cats.map(c => h("th", c)))), h("tbody", h("tr", q.cats.map(() => h("td")))))), k: q.cats.map((c, ci) => c + ": " + q.items.filter(x => x.c === ci).map(x => x.t).join(", ")).join("   |   ") };
      }
      case "pick": {
        const head = q.mode === "listen" ? h("div", num, h("span", "🔊 Listen and choose. "), h("i", "(teacher says the word)")) : stem();
        return { s: wrap(head, pimg(q.img), q.opts.map((o, i) => h("span.po", LET[i] + ". " + o.t))), k: q.opts.map((o, i) => o.ok ? LET[i] + " (" + o.t + ")" : "").filter(Boolean).join("") };
      }
      case "scramble": return { s: wrap(h("div", num, "Unscramble: ", h("b", shuffle(q.lt.slice()).map(c => c.toUpperCase()).join(" ")), q.hint ? "   (" + q.hint + ")" : ""), pimg(q.img), h("div.pline")), k: q.ans };
      case "memory": {
        const cards = shuffle(q.pairs.flatMap(p => [{ n: imgLeft(p.l) }, { n: p.r }]));
        return { s: wrap(stem(), h("div.small", "Cut out the cards, turn them face down and play Memory with a partner."), h("div.cut", cards.map(c => h("div", c.n)))), k: q.pairs.map(p => leftText(p.l) + " = " + p.r).join("  ;  ") };
      }
      case "wordsearch": {
        const g = L.gx.ensureSearch(q, q.level); if (!g || !g.size) return { s: wrap(stem(), h("div", "(không tạo được bảng)")), k: "" };
        const hl = new Set(); Object.keys(g.pos).forEach(w => { const p = g.pos[w]; for (let i = 0; i < w.length; i++) hl.add((p.r + p.dr * i) + "," + (p.c + p.dc * i)); });
        const tbl = (mark) => h("table.pgrid.ws", g.grid.map((row, r) => h("tr", row.map((ch, c) => h("td", mark && hl.has(r + "," + c) ? { style: "background:#ddd;font-weight:900" } : {}, ch)))));
        const list = q.words.map(w => q.level === "hard" ? w.w[0] + " " + "_ ".repeat(w.w.length - 1).trim() + " (" + w.w.length + ")" : q.level === "medium" && w.clue ? w.clue : w.w);
        return { s: wrap(h("div", num, q.stem || "Find the words."), tbl(false), h("div.pwords", list.map(t => h("span", t)))), k: q.words.map(w => w.w.toLowerCase()).join(", "), kn: tbl(true) };
      }
      case "crossword": {
        const cell = {}, nums = {};
        q.words.forEach(w => { for (let i = 0; i < w.w.length; i++) cell[(w.r + (w.dir ? i : 0)) + "," + (w.c + (w.dir ? 0 : i))] = w.w[i]; nums[w.r + "," + w.c] = w.n; });
        const tbl = key => h("table.pgrid", Array.from({ length: q.rows }, (_, r) => h("tr", Array.from({ length: q.cols }, (_, c) => { const k = r + "," + c; return cell[k] ? h("td", nums[k] ? h("i", String(nums[k])) : null, key ? cell[k] : "") : h("td.blk"); }))));
        const cl = d => h("div", h("b", d ? "Down ↓" : "Across →"), q.words.filter(w => w.dir === d).map(w => h("div", w.n + ". " + w.clue)));
        return { s: wrap(h("div", num, q.stem || "Do the crossword."), tbl(false), h("div.pcols", cl(0), cl(1))), k: q.words.map(w => w.n + (w.dir ? "↓ " : "→ ") + w.w.toLowerCase()).join(", "), kn: tbl(true) };
      }
      case "transform": {
        if (q.parts) { const k = []; const kids = q.parts.map(p => { if (p.k === "t") return document.createTextNode(p.s); k.push(p.answers[0]); return U(Math.max(14, p.answers[0].length)); }); return { s: wrap(h("div", num, q.src), h("div", { style: "margin:4px 0 0 18px;line-height:2.2" }, kids)), k: k.join(" ; ") }; }
        return { s: wrap(h("div", num, q.src), q.starter ? h("div", { style: "margin-left:18px" }, q.starter + " …") : null, h("div.pline"), h("div.pline")), k: q.answers.join("  /  ") };
      }
      case "errfix": return { s: wrap(h("div", num, q.full), h("div", { style: "margin-left:18px" }, "Mistake: ", U(10), "   Correct: ", U(12))), k: q.wrong + " → " + q.fixes.join(" / ") };
    }
    return { s: wrap(stem()), k: "" };
  }

  async function printView(id) {
    const ui = L.ui; ui.show(ui.spinner());
    let hw; try { hw = (await L.api.call("hwGet", { id })).hw; try { await L.imgs.load(); } catch (e) { } }
    catch (e) { ui.show(h("div.card", h("div.err", e.message), h("a.btn", { href: "#/teacher/hw" }, "← Quay lại"))); return; }
    const c = L.cur(hw.curId), unit = c && hw.unitId ? L.unitName(c, hw.unitId) : "";
    const rts = (hw.sections || []).map(sec => L.hw.buildRuntime(sec, { keepOrder: true }));
    const paper = h("div.paper"), keyp = h("div.paper.keypaper");
    paper.append(h("div.ph", h("h1", hw.title || "Worksheet"), h("div", { style: "text-align:right;font-size:13px" }, (c ? c.name : "") + (unit ? " · " + unit : ""))),
      h("div.fld", h("div", "Name: ", h("span")), h("div", "Class: ", h("span", { style: "min-width:80px" })), h("div", "Date: ", h("span", { style: "min-width:100px" })), h("div", "Score: ", h("span", { style: "min-width:70px" }))));
    if (hw.desc) paper.append(h("div.pdesc", hw.desc));
    keyp.append(h("div.ph", h("h1", "ANSWER KEY · " + (hw.title || "")), h("div", { style: "font-size:13px" }, "Đáp án (dành cho giáo viên)")));
    let no = 1;
    rts.forEach((rt, si) => {
      const sec = rt.sec, tl = (L.hw.TYPE[sec.type] || {}).label || sec.type;
      const sBox = h("div.ps", h("h3", "Part " + (si + 1) + (sec.title ? ": " + sec.title : "")));
      if (sec.desc) sBox.append(h("div.pdesc", sec.desc));
      if (sec.media && sec.media.audio) sBox.append(h("div.pdesc", "🎧 Listening part – teacher plays the audio."));
      if (sec.media && sec.media.img) sBox.append(h("img", { src: sec.media.img, style: "max-width:100%;max-height:220px;display:block;margin:4px 0" }));
      if (sec.type === "fillbank" && rt.parsed.bank) sBox.append(h("div.pwords", shuffle(rt.parsed.bank.slice()).map(w => h("span", w))));
      const kBox = h("div.ps", h("h3", "Part " + (si + 1) + (sec.title ? ": " + sec.title : "") + "  [" + tl + "]"));
      rt.qs.forEach(q => {
        const r = item(q, no, sec, rt);
        sBox.append(r.s);
        kBox.append(h("div.pq", h("span.no", no + "."), h("span.ok", r.k || "—"), r.kn || null, q.expl ? h("div", { style: "font-size:13px;font-style:italic" }, "💡 " + q.expl) : null));
        no++;
      });
      paper.append(sBox); keyp.append(kBox);
    });
    paper.append(h("div", { style: "text-align:center;margin-top:18px;font-size:12px;color:#555" }, "— The end —   " + window.LSE_CONFIG.siteName));
    const wrap = h("div"), sizes = { sm: "13.5px", md: "15.5px", lg: "18px" };
    const setSize = v => { paper.style.fontSize = keyp.style.fontSize = sizes[v]; };
    const keyChk = h("input", { type: "checkbox", checked: true, onchange: e => { keyp.style.display = e.target.checked ? "" : "none"; } });
    const sizeSel = h("select", { onchange: e => setSize(e.target.value) }, [["sm", "Chữ nhỏ"], ["md", "Chữ vừa"], ["lg", "Chữ to (cho học sinh nhỏ)"]].map(([v, t]) => h("option", { value: v, selected: v === "md" }, t)));
    const bar = h("div.card.noprint.pr-bar", h("div.row", h("b", "🖨️ In phiếu: " + hw.title), h("span.grow"), h("label.small", keyChk, " Kèm trang đáp án"), sizeSel, h("button.btn", { onclick: () => window.print() }, "In / Lưu PDF"), h("a.btn.ghost", { href: "#/teacher/hw" }, "← Quay lại")),
      h("div.small.muted", "Bấm \"In / Lưu PDF\", trong hộp thoại chọn máy in hoặc \"Lưu dưới dạng PDF\". Đáp án nằm ở trang riêng; bỏ dấu tích nếu chỉ muốn in phiếu cho học sinh. Mỗi lần mở, thứ tự đáp án ở dạng Ghép cặp, Sắp xếp... được xáo ngẫu nhiên và đáp án khớp với phiếu đang hiển thị."));
    paper.classList.add("pagebreak-after");
    wrap.append(bar, paper, keyp); setSize("md");
    ui.show(wrap);
  }
  L.printView = printView;
})(window.LSE);
