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

      const curSel = h("select", { onchange: e => { st.cur = e.target.value; st.units.clear(); st.srcs = null; st.title = ""; drawUnits(); srcBox.innerHTML = ""; catBox.innerHTML = ""; msg.innerHTML = ""; } }, m.curricula.map(c => h("option", { value: c.id, selected: c.id === st.cur }, c.name)));
      box.append(h("div.row", h("h3", { style: "margin:0" }, "🎲 Tạo bài tổng hợp"), h("span.grow"), h("button.btn.sm.ghost", { type: "button", onclick: close }, "Đóng")),
        h("p.small.muted", "Chọn unit làm nguồn. Hệ thống lấy ngẫu nhiên câu từ các bài tập đã có trong các unit đó, theo số lượng cô nhập cho từng nhóm."),
        h("label.field", h("span", "1. Giáo trình và unit nguồn"), curSel), unitBox,
        h("div.row", { style: "margin-top:8px" }, h("button.btn.sky", { type: "button", onclick: load }, "Xem các bài nguồn")), msg, srcBox, catBox);
      drawUnits();
      return box;
    }, { wide: true, sticky: true });
  }

  L.mixModal = mixModal;
  L.mix = { chunksOf, guess, sample, sectionsFrom };
})(window.LSE);
