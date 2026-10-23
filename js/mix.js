/* Tạo bài tổng hợp (mix): chọn unit làm nguồn -> bốc ngẫu nhiên câu từ các bài tập đã có, theo nhóm
   (từ vựng, ngữ pháp, viết lại câu, đọc hiểu, khác) và số lượng cô nhập. Có tuỳ chọn ưu tiên câu có hình (cấp 1).
   Kết quả là một BẢN NHÁP bài tập mới mở ra trong trình soạn bài để cô xem lại rồi lưu. */
window.LSE = window.LSE || {};
(function (L) {
  const { h, toast } = L;

  const CATS = [["vocab", "Từ vựng"], ["grammar", "Ngữ pháp / Mẫu câu"], ["writing", "Viết lại · Sắp xếp câu"], ["reading", "Đọc hiểu"], ["other", "Khác"]];
  const CATN = Object.fromEntries(CATS);
  const LINE = new Set(["tf", "fill", "fillhint", "fillchoose", "short", "transform", "errfix", "sentence", "listen", "meanpick", "scramble"]);
  const BLOCK = new Set(["mcq1", "mcqN", "tf4", "match", "order", "classify", "wordpick"]);
  const GROUPW = new Set(["match", "order", "classify", "wordpick"]);      // mỗi nhóm tính theo số ý
  const isCap1 = c => !!c && (/^gs[345]$/i.test(c.id || "") || /starters|movers|flyers|global success [345]\b|tiểu học|lớp [1-5]\b/i.test(c.name || ""));
  const flat = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").toLowerCase();

  /* tự đoán nhóm theo tên bài + tên phần; không đoán được thì theo dạng bài */
  function guess(hwTitle, sec) {
    const t = flat((hwTitle || "") + " " + (sec.title || "") + " " + (sec.topic || ""));
    if (/tu vung|vocab|\bdef\b|definition|meaning|nghia|spelling|flashcard|picture|\bwords?\b/.test(t)) return "vocab";
    if (/reading|doc hieu|passage|bai doc/.test(t)) return "reading";
    if (/writing|viet lai|rewrite|sap xep|dong nghia|transform|sentence/.test(t)) return "writing";
    if (/ngu phap|gram|tense|compar|so sanh|error|loi sai|preposition|article|conjunction|mau cau|structure/.test(t)) return "grammar";
    if (["listen", "meanpick", "scramble", "memory", "wordsearch", "crossword", "match"].includes(sec.type)) return "vocab";
    if (["transform", "sentence"].includes(sec.type)) return "writing";
    if (sec.type === "errfix") return "grammar";
    return "other";
  }

  const IMG_RE = /(^|\n)\s*(IMG|HÌNH|HINH|PIC)\s*[:：]|\bimg\s*:/i;
  const META_NEXT = /^(IMG|HÌNH|HINH|PIC|AUDIO|LEVEL|TASK|YÊU CẦU|YEU CAU)\s*[:：]/i;
  const META_PREV = /^(EXP|EXPL|EXPLAIN|GIẢI THÍCH|GIAI THICH|TOPIC|CHỦ ĐIỂM|CHU DIEM|ANS|ANSWER|ĐÁP ÁN|DAP AN)\s*[:：]/i;

  /** tách một phần thành các "câu" độc lập; phần có đoạn văn/âm thanh/hình chung hoặc dạng đặc biệt thì giữ nguyên cả phần */
  function chunksOf(hwTitle, sec) {
    const raw = String(sec.raw || "").replace(/\r/g, "");
    if (!raw.trim()) return [];
    const t = sec.type, catAuto = guess(hwTitle, sec);
    const m = sec.media || {};
    const whole = () => {
      const p = L.hw.parseSection(sec); const n = p.questions.length; if (!n) return [];
      return [{ cat: catAuto, type: t, raw, weight: n, hasImg: IMG_RE.test(raw) || !!m.img, whole: true, sec, from: hwTitle }];
    };
    const indivisible = (sec.desc && String(sec.desc).trim()) || m.img || m.audio || m.yt || !(LINE.has(t) || BLOCK.has(t));
    if (indivisible) return whole();
    let parts = [];
    if (BLOCK.has(t)) parts = raw.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    else {
      let pend = [];
      raw.split("\n").forEach(ln => {
        const s = ln.trim(); if (!s) return;
        if (META_NEXT.test(s)) { pend.push(ln); return; }
        if (META_PREV.test(s)) { if (parts.length) parts[parts.length - 1] += "\n" + ln; return; }
        parts.push(pend.concat(ln).join("\n")); pend = [];
      });
    }
    const out = [];
    for (const raw1 of parts) {
      const probe = { type: t, raw: raw1, tfLabels: sec.tfLabels };
      const p = L.hw.parseSection(probe);
      if (!p.questions.length) return whole();               // một câu không đứng riêng được -> giữ nguyên cả phần
      const weight = GROUPW.has(t) ? Math.max(1, L.hw.countItems(probe)) : 1;
      out.push({ cat: catAuto, type: t, raw: raw1, weight, hasImg: IMG_RE.test(raw1), whole: false, tf: sec.tfLabels, speak: !!sec.speak, from: hwTitle });
    }
    return out;
  }

  function sample(pool, quota, mode) {
    let p = pool.slice();
    if (mode === "only") p = p.filter(x => x.hasImg);
    const ordered = mode === "prefer" ? L.shuffle(p.filter(x => x.hasImg)).concat(L.shuffle(p.filter(x => !x.hasImg))) : L.shuffle(p);
    const picks = []; let sum = 0;
    for (const x of ordered) { if (sum >= quota) break; if (sum + x.weight <= quota) { picks.push(x); sum += x.weight; } }
    return L.shuffle(picks);
  }

  function sectionsFrom(cat, picks) {
    const out = [], byType = {};
    picks.filter(p => !p.whole).forEach(p => (byType[p.type] = byType[p.type] || []).push(p));
    Object.keys(byType).forEach(t => {
      const arr = byType[t];
      out.push({ id: "s" + L.uid("").slice(-5), title: CATN[cat] + " – " + ((L.hw.TYPE[t] || {}).label || t), type: t, desc: "", media: { img: "", audio: "", yt: "" },
        raw: arr.map(p => p.raw).join(BLOCK.has(t) ? "\n\n" : "\n"), topic: CATN[cat].toLowerCase(), shuffleQ: false, tfLabels: arr[0].tf || "en", speak: arr.some(p => p.speak) });
    });
    picks.filter(p => p.whole).forEach(p => out.push(Object.assign(JSON.parse(JSON.stringify(p.sec)), { id: "s" + L.uid("").slice(-5), title: p.sec.title || CATN[cat] })));
    return out;
  }

  function mixModal() {
    const m = L.state.manifest || { curricula: [] };
    if (!m.curricula.length) { toast("Chưa có giáo trình nào. Vào tab Giáo trình & unit để tạo trước nhé."); return; }
    const st = { cur: m.curricula[0].id, units: new Set(), srcs: null, use: {}, q: {}, img: "none", imgTouched: false, title: "" };
    L.modal(close => {
      const box = h("div"), unitBox = h("div.row", { style: "flex-wrap:wrap;gap:6px 16px;margin:6px 0" }), srcBox = h("div"), catBox = h("div"), msg = h("div");
      const unitName = id => { const c = L.cur(st.cur); return id === "" ? "Chưa phân unit" : ((c.units || []).find(u => u.id === id) || {}).name || id; };

      const drawUnits = () => {
        unitBox.innerHTML = "";
        const c = L.cur(st.cur), list = [["", "Chưa phân unit"]].concat((c.units || []).map(u => [u.id, u.name]));
        unitBox.append(h("button.btn.sm.ghost", { type: "button", onclick: () => { if (st.units.size === list.length) st.units.clear(); else list.forEach(([id]) => st.units.add(id)); drawUnits(); } }, "Chọn tất cả / bỏ hết"));
        list.forEach(([id, name]) => unitBox.append(h("label.row", { style: "gap:6px;cursor:pointer" },
          h("input", { type: "checkbox", style: "width:18px;height:18px", checked: st.units.has(id), onchange: e => { e.target.checked ? st.units.add(id) : st.units.delete(id); } }), name)));
      };

      const poolOf = cat => st.srcs.filter(s => s.include).flatMap(s => s.chunks.filter(c => (s.cat === "auto" ? c.cat : s.cat) === cat));

      const drawCats = () => {
        catBox.innerHTML = "";
        if (!st.srcs) return;
        const rows = CATS.map(([cat, label]) => {
          const pool = poolOf(cat), total = pool.reduce((a, p) => a + p.weight, 0), withImg = pool.filter(p => p.hasImg).reduce((a, p) => a + p.weight, 0);
          if (!total) return null;
          if (st.use[cat] === undefined) st.use[cat] = false;
          if (st.q[cat] === undefined) st.q[cat] = Math.min(10, total);
          return h("div.item", { style: "flex-wrap:wrap;gap:10px" },
            h("label.row", { style: "gap:8px;cursor:pointer;min-width:200px" }, h("input", { type: "checkbox", style: "width:20px;height:20px", checked: !!st.use[cat], onchange: e => { st.use[cat] = e.target.checked; sum(); } }), h("b", label)),
            h("span.small.muted", "có " + total + " câu" + (withImg ? " (" + withImg + " có hình)" : "")),
            h("span.grow"), h("span.small", "Lấy"),
            h("input", { type: "number", min: 0, max: total, value: st.q[cat], style: "width:80px", oninput: e => { st.q[cat] = Math.max(0, +e.target.value || 0); sum(); } }), h("span.small", "câu"));
        }).filter(Boolean);
        if (!rows.length) { catBox.append(h("div.empty", "Các bài nguồn đã chọn chưa có câu nào bốc được. Kiểm tra lại bài nguồn hoặc đổi nhóm.")); return; }
        const total = h("b", "");
        const sum = () => { total.textContent = CATS.reduce((a, [c]) => a + (st.use[c] && poolOf(c).length ? Math.min(+st.q[c] || 0, poolOf(c).reduce((x, p) => x + p.weight, 0)) : 0), 0) + " câu"; };
        const imgSel = h("select", { onchange: e => { st.img = e.target.value; st.imgTouched = true; } }, [["prefer", "Ưu tiên câu có hình"], ["only", "Chỉ lấy câu có hình"], ["none", "Không quan tâm hình"]].map(([v, t]) => h("option", { value: v, selected: st.img === v }, t)));
        const titleIn = h("input", { type: "text", value: st.title, placeholder: "Tên bài tổng hợp", oninput: e => { st.title = e.target.value; } });
        catBox.append(h("h4", { style: "margin:14px 0 4px" }, "3. Lấy bao nhiêu câu mỗi nhóm?"), rows,
          h("div.row", { style: "margin:10px 0 2px" }, h("span", "Tổng cộng: "), total, h("span.small.muted", " (nên dưới 50 câu)")),
          h("div.two", { style: "margin-top:8px" }, h("label.field", h("span", "Hình ảnh" + (isCap1(L.cur(st.cur)) ? " (cấp 1 nên ưu tiên câu có hình)" : "")), imgSel), h("label.field", h("span", "Tên bài"), titleIn)),
          h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn", { type: "button", onclick: make }, "🎲 Tạo bài tổng hợp")));
        sum();
      };

      const drawSrcs = () => {
        srcBox.innerHTML = "";
        if (!st.srcs) return;
        if (!st.srcs.length) { srcBox.append(h("div.empty", "Các unit đã chọn chưa có bài tập nào. Hãy up bài (từ file Word) vào unit trước nhé.")); return; }
        srcBox.append(h("h4", { style: "margin:14px 0 4px" }, "2. Bài nguồn (bỏ tích bài không muốn dùng; chỉnh nhóm nếu máy đoán chưa đúng)"),
          h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["Dùng", "Bài tập", "Unit", "Số câu", "Nhóm"].map(x => h("th", x)))),
            h("tbody", st.srcs.map(s => h("tr",
              h("td", h("input", { type: "checkbox", style: "width:18px;height:18px", checked: s.include, onchange: e => { s.include = e.target.checked; drawCats(); } })),
              h("td", h("b", s.hw.title)), h("td", unitName(s.hw.unitId || "")), h("td", String(s.chunks.reduce((a, c) => a + c.weight, 0))),
              h("td", h("select", { onchange: e => { s.cat = e.target.value; drawCats(); } }, [["auto", "Tự nhận"]].concat(CATS).map(([v, t]) => h("option", { value: v, selected: s.cat === v }, t))))))))));
      };

      const load = async () => {
        if (!st.units.size) { toast("Chọn ít nhất một unit nhé"); return; }
        msg.innerHTML = ""; msg.append(h("div.empty", h("span.spinner"), " Đang tải các bài nguồn…"));
        try {
          const list = (await L.loadHw(true)).filter(x => x.curId === st.cur && st.units.has(x.unitId || ""));
          const hws = [];
          for (let i = 0; i < list.length; i += 4) {
            msg.querySelector(".empty").lastChild.textContent = " Đang tải " + Math.min(i + 4, list.length) + "/" + list.length + "…";
            hws.push(...await Promise.all(list.slice(i, i + 4).map(x => L.api.call("hwGet", { id: x.id }).then(r => r.hw))));
          }
          st.srcs = hws.map(hw => ({ hw, include: true, cat: "auto", chunks: (hw.sections || []).flatMap(sec => chunksOf(hw.title, sec)) }));
          if (!st.imgTouched) st.img = isCap1(L.cur(st.cur)) ? "prefer" : "none";
          st.use = {}; st.q = {};
          if (!st.title) st.title = "Bài tổng hợp – " + [...st.units].map(unitName).join(", ");
          msg.innerHTML = ""; drawSrcs(); drawCats();
        } catch (e) { msg.innerHTML = ""; msg.append(h("div.err", "Không tải được: " + e.message)); }
      };

      const make = () => {
        const secs = [], notes = [];
        CATS.forEach(([cat, label]) => {
          if (!st.use[cat]) return;
          const pool = poolOf(cat), quota = Math.max(0, +st.q[cat] || 0); if (!pool.length || !quota) return;
          const picks = sample(pool, quota, st.img), got = picks.reduce((a, p) => a + p.weight, 0);
          if (got < quota) notes.push(label + ": lấy được " + got + "/" + quota + " câu");
          secs.push(...sectionsFrom(cat, picks));
        });
        if (!secs.length) { toast("Chưa có câu nào được chọn. Kiểm tra lại số lượng nhé."); return; }
        sessionStorage.setItem("lse_hw_draft", JSON.stringify({ title: st.title || "Bài tổng hợp", curId: st.cur, unitId: st.units.size === 1 ? [...st.units][0] : "", sections: secs }));
        close(); L.go("/teacher/hw-edit/new");
        toast("Đã tạo bản nháp bài tổng hợp. Cô xem lại rồi bấm Lưu nhé." + (notes.length ? " (" + notes.join("; ") + ")" : ""), 6000);
      };

      const curSel = h("select", { onchange: e => { st.cur = e.target.value; st.units.clear(); st.srcs = null; st.title = ""; drawUnits(); srcBox.innerHTML = ""; catBox.innerHTML = ""; msg.innerHTML = ""; } }, m.curricula.map(c => h("option", { value: c.id, selected: c.id === st.cur }, L.curLabel ? L.curLabel(c) : c.name)));
      box.append(h("div.row", h("h3", { style: "margin:0" }, "🎲 Tạo bài tổng hợp"), h("span.grow"), h("button.btn.sm.ghost", { type: "button", onclick: close }, "Đóng")),
        h("p.small.muted", "Chọn unit làm nguồn. Hệ thống lấy ngẫu nhiên câu từ các bài tập đã có trong các unit đó, theo số lượng cô nhập cho từng nhóm."),
        h("label.field", h("span", "1. Giáo trình và unit nguồn"), curSel), unitBox,
        h("div.row", { style: "margin-top:8px" }, h("button.btn.sky", { type: "button", onclick: load }, "Xem các bài nguồn")), msg, srcBox, catBox);
      drawUnits();
      return box;
    }, { wide: true, sticky: true });
  }

  /* ================= Biến một bài từ vựng thành các bài GAME =================
     Lấy các cặp từ-nghĩa trong bài (ghép cặp, trắc nghiệm định nghĩa, xếp chữ, nhìn nghĩa chọn từ…),
     cô tích chọn từ và loại game, app tạo BẢN NHÁP bài mới gồm các game (lật thẻ, tìm từ, ô chữ, xếp chữ cái…). */
  const isEn = t => /[A-Za-z]/.test(t || "") && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t || "");
  const wc = s => String(s).trim().split(/\s+/).length;
  const clean1 = s => String(s == null ? "" : s).replace(/<\/?u>/g, "").replace(/\*\*/g, "").replace(/\s+/g, " ").replace(/^[\s*•\-–]+/, "").replace(/[\s.,;:!?]+$/, "").trim();
  const META_LINE = /^(IMG|HÌNH|HINH|PIC|AUDIO|LEVEL|TASK|YÊU CẦU|YEU CAU|EXP|EXPL|EXPLAIN|GIẢI THÍCH|TOPIC|CHỦ ĐIỂM|BANK|ANS|ĐÁP ÁN)\s*[:：]/i;

  const FUNC = new Set("am is are was were be been do does did can could will would should must may might have has had the and but for not you your she her his him they them their our its this that these those there here what who when where which how why yes".split(" "));
  function vocabPairs(hw) {
    const out = [], seen = new Set();
    const add = (word, hint, img, ctx) => {
      word = clean1(word); hint = ctx ? String(hint || "").replace(/<\/?u>/g, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim() : clean1(hint);
      if (!word || word.length > 40 || /^[\d\s]+$/.test(word)) return;
      const k = word.toLowerCase();
      if (seen.has(k)) {   /* trùng từ: ưu tiên nghĩa/hình thật hơn câu gợi ý hay không có gì */
        const ex = out.find(o => o.word.toLowerCase() === k);
        if (ex && !ctx && (hint || img) && (ex.ctx || (!ex.hint && !ex.img))) { ex.hint = hint; ex.ctx = false; if (img) ex.img = img; }
        return;
      }
      seen.add(k);
      out.push({ word, hint, img: img || "", ctx: !!ctx });
    };
    (hw.sections || []).forEach(sec => {
      const raw = String(sec.raw || "").replace(/\r/g, ""), t = sec.type, lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
      if (t === "match" || t === "memory") {
        lines.forEach(l => {
          if (META_LINE.test(l) && !/^img\s*:[^=]*=/i.test(l)) return; const m = l.match(/^(.+?)\s*=\s*(.+)$/); if (!m) return;
          const a = m[1].trim(), b = m[2].trim(), im = a.match(/^img\s*:\s*(.+)$/i);
          if (im) { add(b, "", "img:" + im[1].trim()); return; }
          if (isEn(a) && !isEn(b)) add(a, b); else if (!isEn(a) && isEn(b)) add(b, a); else if (wc(a) <= wc(b)) add(a, b); else add(b, a);
        });
      } else if (t === "meanpick") {
        let img = "";
        lines.forEach(l => { const mi = l.match(/^(?:IMG|HÌNH|HINH|PIC)\s*[:：]\s*(.+)$/i); if (mi) { img = "img:" + mi[1].trim(); return; } if (META_LINE.test(l)) return; const m = l.match(/^(.+?)\s*=>\s*([^|]+)/); if (m) add(m[2], /^what is this\??$/i.test(m[1].trim()) ? "" : m[1], img); img = ""; });
      } else if (["scramble", "wordsearch", "crossword", "listen"].includes(t)) {
        let img = "";
        lines.forEach(l => {
          const mi = l.match(/^(?:IMG|HÌNH|HINH|PIC)\s*[:：]\s*(.+)$/i); if (mi) { img = "img:" + mi[1].trim(); return; }
          if (META_LINE.test(l)) return;
          if (t === "wordsearch" && !l.includes("|") && l.includes(",")) { l.split(",").forEach(w => add(w, "")); img = ""; return; }
          const p = l.split("|"); add(p[0], t === "listen" ? "" : p[1], img); img = "";
        });
      } else if (["fill", "fillhint", "fillchoose", "fillbank"].includes(t)) {
        /* từ đứng trong [[ ]] là từ vựng cần nhớ; gợi ý = câu có chỗ trống */
        lines.forEach(l => {
          if (META_LINE.test(l)) return;
          const ms = [...l.matchAll(/\[\[([^\]]+)\]\]/g)];
          const firstOf = inner => { const o = inner.split("|").map(x => x.trim()); const st = o.find(x => x.startsWith("*")); return (st || o[0] || "").replace(/^\*/, "").split("/")[0].trim(); };
          ms.forEach((m, k) => {
            const a = firstOf(m[1]); if (t !== "fillchoose" && m[1].includes("|")) return;
            if (!/^[A-Za-z' -]+$/.test(a) || wc(a) > 3 || a.length < 3 || FUNC.has(a.toLowerCase())) return;
            let n = -1, ctx = l.replace(/\[\[([^\]]+)\]\](\{[^}]*\})?/g, (_, inner) => (++n === k ? "___" : firstOf(inner)));
            ctx = ctx.replace(/\s+/g, " ").trim();
            if (ctx.length > 110) { const q = ctx.indexOf("___"), st = Math.max(0, q - 50); ctx = (st ? "…" : "") + ctx.slice(st, st + 110) + "…"; }
            add(a, ctx, "", true);
          });
        });
      } else if (t === "short") {
        lines.forEach(l => { if (META_LINE.test(l)) return; const m = l.match(/^(.+?)\s*=>\s*(.+)$/); if (!m) return; const a = m[2].split("/")[0].trim(); if (/^[A-Za-z' -]+$/.test(a) && wc(a) <= 3 && a.length >= 3 && !FUNC.has(a.toLowerCase())) add(a, m[1], "", true); });
      } else if (t === "classify") {
        lines.forEach(l => { const m = l.match(/^\[[^\]]+\]\s*(.+)$/); if (m) m[1].split(",").forEach(w => { w = w.trim(); if (/^[A-Za-z' -]+$/.test(w) && wc(w) <= 3) add(w, ""); }); });
      } else if (t === "mcqN") {
        L.hw.parseSection(sec).questions.forEach(q => (q.opts || []).filter(o => o.ok).forEach(o => { const w = clean1(o.t); if (/^[A-Za-z' -]+$/.test(w) && wc(w) <= 3) add(w, String(q.stem || "").replace(/_{2,}|\.{3,}|…+/g, "…"), q.img ? "img:" + q.img : "", true); }));
      } else if (t === "mcq1") {
        L.hw.parseSection(sec).questions.forEach(q => {
          const ok = (q.opts || []).find(o => o.ok); if (!ok) return; const w = clean1(ok.t);
          if (!/^[A-Za-z' -]+$/.test(w) || wc(w) > 3) return;
          add(w, String(q.stem || "").replace(/_{2,}|\.{3,}|…+/g, "…"), q.img ? "img:" + q.img : "");
        });
      }
    });
    return out;
  }

  const GAMES = [
    { id: "memory", cap: 12, note: "tối đa 12 cặp/bàn, cần nghĩa hoặc hình", ok: p => !!(p.img || (p.hint && !p.ctx)) },
    { id: "wordsearch", cap: 10, note: "chỉ từ gồm chữ cái, ≤ 14 chữ, 10 từ/ván", ok: p => /^[A-Za-z]{2,14}$/.test(p.word) },
    { id: "crossword", cap: 8, note: "cần có gợi ý, 8 từ/ván", ok: p => /^[A-Za-z]{3,14}$/.test(p.word) && !!p.hint },
    { id: "scramble", cap: 99, note: "xếp lại các chữ cái", ok: p => p.word.length >= 3 },
    { id: "meanpick", cap: 99, note: "cần có gợi ý nghĩa/hình, từ 4 từ trở lên", ok: p => !!(p.hint || p.img) },
    { id: "listen", cap: 99, note: "học sinh bấm 🔊 nghe rồi chọn từ, từ 4 từ trở lên", ok: p => /^[A-Za-z' -]+$/.test(p.word) }
  ];
  const imgLine = p => p.img ? "IMG: " + p.img.replace(/^img:/i, "") + "\n" : "";
  function gameRaw(id, picks) {
    const chunk = (arr, n) => { const o = []; for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n)); return o; };
    switch (id) {
      case "memory": return "TASK: Lật thẻ, tìm các cặp giống nhau.\n" + picks.map(p => p.img ? p.img + " = " + p.word : p.word + " = " + p.hint).join("\n");
      case "wordsearch": return chunk(picks, 10).map(g => "TASK: Tìm các từ sau trong bảng.\n" + g.map(p => p.word + (p.hint ? " | " + p.hint : "")).join("\n")).join("\n\n");
      case "crossword": return chunk(picks, 8).map(g => "TASK: Điền ô chữ.\n" + g.map(p => p.word + " | " + p.hint).join("\n")).join("\n\n");
      case "scramble": return picks.map(p => imgLine(p) + p.word + (p.hint ? " | " + p.hint : "")).join("\n");
      case "meanpick": return picks.map(p => imgLine(p) + (p.hint || "What is this?") + " => " + p.word).join("\n");
      case "listen": return picks.map(p => p.word).join("\n");
    }
    return "";
  }

  function gameModal(x) {
    L.modal(close => {
      const box = h("div", h("h3", { style: "margin:0 0 8px" }, "🎮 Biến thành game"), h("div.empty", h("span.spinner"), " Đang đọc bài…"));
      const st = { pairs: [], on: {}, games: {}, n: 10, title: "" };
      const draw = () => {
        box.innerHTML = "";
        box.append(h("div.row", h("h3", { style: "margin:0" }, "🎮 Biến thành game"), h("span.grow"), h("button.btn.sm.ghost", { type: "button", onclick: close }, "Đóng")),
          h("p.small.muted", "Bài nguồn: ", h("b", x.title), ". App lấy các từ trong bài, cô chọn từ và loại game, app tạo bản nháp bài game mới (cô xem lại rồi lưu)."));
        if (!st.pairs.length) { box.append(h("div.empty", "Bài này chưa lấy được từ vựng nào. App đọc được từ các dạng: ghép cặp, xếp chữ, ô chữ, nhìn nghĩa chọn từ, nghe chọn từ, trắc nghiệm (đáp án là một từ), điền từ [[…]], trả lời ngắn, phân loại. Bài chỉ có câu dài, đúng/sai hoặc sắp xếp câu thì không có từ riêng để làm game.")); return; }
        const chosen = st.pairs.filter(p => st.on[p.word]);
        box.append(h("div.row", { style: "margin:6px 0" }, h("b", "1. Chọn từ (" + chosen.length + "/" + st.pairs.length + ")"), h("span.grow"),
          h("button.btn.sm.ghost", { type: "button", onclick: () => { const all = chosen.length === st.pairs.length; st.pairs.forEach(p => st.on[p.word] = !all); draw(); } }, "Chọn tất cả / bỏ hết")));
        box.append(h("div.scroll-x", { style: "max-height:210px;overflow:auto" }, h("table.tbl", h("tbody", st.pairs.map(p => h("tr",
          h("td", h("input", { type: "checkbox", style: "width:18px;height:18px", checked: !!st.on[p.word], onchange: e => { st.on[p.word] = e.target.checked; draw(); } })),
          h("td", h("b", p.word)), h("td", { style: "font-size:13px" }, (p.img ? "🖼 " : "") + (p.hint || "").slice(0, 70))))))));
        box.append(h("div.row", { style: "margin:14px 0 4px" }, h("b", "2. Chọn loại game")));
        GAMES.forEach(g => {
          const el = chosen.filter(g.ok), need = ["meanpick", "listen"].includes(g.id) ? 4 : 2;
          const okG = el.length >= need;
          box.append(h("label.row", { style: "gap:8px;cursor:" + (okG ? "pointer" : "not-allowed") + ";opacity:" + (okG ? 1 : .55) + ";padding:3px 0" },
            h("input", { type: "checkbox", style: "width:20px;height:20px", disabled: !okG, checked: okG && !!st.games[g.id], onchange: e => { st.games[g.id] = e.target.checked; } }),
            h("b", ((L.hw.TYPE[g.id] || {}).emoji || "") + " " + ((L.hw.TYPE[g.id] || {}).label || g.id)), h("span.small.muted", " · dùng được " + el.length + " từ · " + g.note)));
        });
        /* chơi ngay bằng Trung tâm trò chơi (cần nghĩa tiếng Việt của từ) */
        const viP = chosen.filter(p => p.hint && !p.ctx && !isEn(p.hint));
        box.append(h("div.row", { style: "margin:14px 0 4px" }, h("b", "🎮 Hoặc chơi ngay bằng Trung tâm trò chơi")));
        if (viP.length >= 4) {
          box.append(h("p.small.muted", { style: "margin:0 0 6px" }, "Dùng " + viP.length + " từ đã chọn có nghĩa tiếng Việt, không cần tạo hay lưu bài mới."),
            h("div.row", { style: "gap:8px;flex-wrap:wrap" }, [["vuon-chuot", "🔨 Đập Chuột"], ["dao-vang", "⛏️ Đào Vàng"], ["xi-ngau", "🎲 Xí Ngầu"]].map(([gid, lb]) => h("button.btn.sm.rose", { type: "button", onclick: () => {
              try { sessionStorage.setItem("lse_custom_set", JSON.stringify({ title: x.title, items: viP.map(p => ({ w: p.word, vi: p.hint })) })); } catch (e) { toast("Không lưu được bộ từ tạm"); return; }
              close(); L.go("/games/play/" + gid + "/custom?cur=" + encodeURIComponent(x.curId || "") + "&unit=" + encodeURIComponent(x.unitId || ""));
            } }, lb))));
        } else box.append(h("p.small.muted", { style: "margin:0" }, "Cần ít nhất 4 từ đã chọn có nghĩa tiếng Việt (hiện có " + viP.length + "). Bài điền từ chỉ có câu gợi ý tiếng Anh nên chưa chơi được cách này."));
        const nIn = h("input", { type: "number", min: 4, value: st.n, style: "width:90px", oninput: e => { st.n = Math.max(2, +e.target.value || 10); } });
        const tIn = h("input", { type: "text", value: st.title, oninput: e => { st.title = e.target.value; } });
        box.append(h("div.two", { style: "margin-top:10px" }, h("label.field", h("span", "3. Số từ cho mỗi game (lấy ngẫu nhiên)"), nIn), h("label.field", h("span", "Tên bài game"), tIn)),
          h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn", { type: "button", onclick: make }, "🎮 Tạo bài game")));
      };
      const make = () => {
        const chosen = st.pairs.filter(p => st.on[p.word]), secs = [], notes = [];
        GAMES.forEach(g => {
          if (!st.games[g.id]) return;
          const el = chosen.filter(g.ok); if (!el.length) return;
          const picks = L.shuffle(el).slice(0, Math.min(st.n, g.id === "memory" ? 12 : 999));
          const sec = { id: "s" + L.uid("").slice(-5), title: ((L.hw.TYPE[g.id] || {}).label || g.id), type: g.id, desc: "", media: { img: "", audio: "", yt: "" }, raw: gameRaw(g.id, picks), topic: "từ vựng", shuffleQ: false, tfLabels: "en" };
          const p = L.hw.parseSection(sec);
          if (!p.questions.length) { notes.push((L.hw.TYPE[g.id] || {}).label + ": chưa tạo được (" + (p.errors[0] || "thiếu từ") + ")"); return; }
          if (p.errors.length) notes.push((L.hw.TYPE[g.id] || {}).label + ": " + p.errors.length + " dòng bị bỏ qua");
          secs.push(sec);
        });
        if (!secs.length) { toast(notes[0] || "Chưa chọn game nào có đủ từ", 5000); return; }
        sessionStorage.setItem("lse_hw_draft", JSON.stringify({ title: st.title || ("Game – " + x.title), curId: x.curId, unitId: x.unitId || "", sections: secs }));
        close(); L.go("/teacher/hw-edit/new");
        toast("Đã tạo bản nháp " + secs.length + " game. Cô xem lại rồi bấm Lưu nhé." + (notes.length ? " (" + notes.join("; ") + ")" : ""), 7000);
      };
      L.api.call("hwGet", { id: x.id }).then(r => {
        st.pairs = vocabPairs(r.hw); st.pairs.forEach(p => st.on[p.word] = true);
        st.n = Math.min(10, st.pairs.length) || 10; st.title = "Game – " + x.title;
        GAMES.forEach(g => { st.games[g.id] = ["memory", "wordsearch", "crossword", "scramble"].includes(g.id); });
        draw();
      }).catch(e => { box.innerHTML = ""; box.append(h("div.err", "Không đọc được bài: " + e.message)); });
      return box;
    }, { wide: true, sticky: true });
  }

  L.mixModal = mixModal;
  L.gameModal = gameModal;
  L.mix = { chunksOf, guess, sample, sectionsFrom, vocabPairs, gameRaw };
})(window.LSE);
