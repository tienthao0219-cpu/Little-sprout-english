/* Khu giáo viên › 🎤 Chấm Speaking bằng AI
   Cô upload file ghi âm của học viên -> app đo ngắt nghỉ trên máy cô, nhờ Gemini nghe và chấm theo rubric 100 điểm,
   cô xem/sửa điểm, chấm tay phần phong thái, rồi sao chép tin nhắn Zalo. Mọi điểm AI chỉ là bản nháp để cô duyệt. */
(function (L) {
  "use strict";
  const { h, toast, modal, fmtDate } = L;
  const S = L.spk;
  const DK = "lse_spg_demo_v1";
  const MAX_SEC = 300;               // tối đa 5 phút mỗi file

  /* Chỉ điền những gì cô đã viết trong rubric. Các phần cô chưa nói tới để TRỐNG, cô tự bổ sung ở tab Cấu hình bài. */
  const SEEDS = [
    { id: "1", code: "1", title: "Bài 1", targetSounds: "/s/, /z/", soundNotes: "Bật rõ âm /s/ và /z/.", notes: "Cô điền đề nói và từ vựng của bài." },
    { id: "4.1", code: "4.1", title: "Bài 4.1", grammar: "Phân biệt BE (với tính từ) và HAVE/HAS (với bộ phận cơ thể).", notes: "Rubric của cô: nói được thần chú tả tóc 3 bước. Cô điền nội dung 3 bước vào ô từ vựng/cụm từ." },
    { id: "5.1", code: "5.1", title: "Bài 5.1", targetSounds: "/f/, /v/", soundNotes: "Khẩu hình môi-răng: răng trên chạm môi dưới. Từ ví dụ trong mẫu của cô: file, video.", grammar: "use ... to V hoặc use ... for V-ing", notes: "Rubric của cô: dùng đúng các app công sở. Cô điền danh sách app vào ô từ vựng." },
    { id: "6.1", code: "6.1", title: "Bài 6.1", targetSounds: "đuôi -s/-es đọc thành /s/, /z/, /ɪz/", grammar: "Chia đúng động từ số ít với He/She (goes, watches, has)." },
    { id: "6.2", code: "6.2", title: "Bài 6.2", notes: "Rubric của cô: dùng chuẩn các mốc thời gian. Cô điền các mốc thời gian vào ô từ vựng." },
    { id: "7.1", code: "7.1", title: "Bài 7.1", targetSounds: "/p/, /k/", soundNotes: "Bật gió.", grammar: "work at + tên công ty; work in + phòng ban.", notes: "Ví dụ nối âm trong rubric: work in an office." }
  ];

  /* ============================================================
     Lưu trữ: Apps Script (thật) hoặc bộ nhớ trình duyệt (DEMO)
     ============================================================ */
  const demoLoad = () => { try { return Object.assign({ lessons: [], settings: null, results: [] }, JSON.parse(localStorage.getItem(DK) || "{}")); } catch (e) { return { lessons: [], settings: null, results: [] }; } };
  const demoSave = d => { try { localStorage.setItem(DK, JSON.stringify(d)); } catch (e) { throw new Error("Bộ nhớ trình duyệt đầy"); } };
  const isDemo = () => L.api.isDemo();
  const store = {
    async info() { return isDemo() ? { hasKey: false, demo: true } : L.api.call("spgInfo"); },
    async lessons() {
      if (isDemo()) { const d = demoLoad(); return { lessons: d.lessons, settings: d.settings }; }
      const r = await L.api.call("spgLessonList");
      return { lessons: r.lessons || [], settings: r.settings || null };
    },
    async saveLesson(l) {
      if (isDemo()) { const d = demoLoad(); const i = d.lessons.findIndex(x => x.id === l.id); if (i >= 0) d.lessons[i] = l; else d.lessons.push(l); demoSave(d); return; }
      await L.api.call("spgLessonSave", { lesson: l });
    },
    async delLesson(id) {
      if (isDemo()) { const d = demoLoad(); d.lessons = d.lessons.filter(x => x.id !== id); demoSave(d); return; }
      await L.api.call("spgLessonDelete", { id: id });
    },
    async saveSettings(s) {
      if (isDemo()) { const d = demoLoad(); d.settings = s; demoSave(d); return; }
      await L.api.call("spgSettingsSave", { settings: s });
    },
    async saveResult(r) {
      if (isDemo()) {
        const d = demoLoad(); const id = r.id || L.uid("r");
        const row = Object.assign({}, r, { id: id, time: (d.results.find(x => x.id === id) || {}).time || new Date().toISOString() });
        const i = d.results.findIndex(x => x.id === id); if (i >= 0) d.results[i] = row; else d.results.push(row);
        demoSave(d); return id;
      }
      return (await L.api.call("spgResultSave", { result: r })).id;
    },
    async results() {
      if (isDemo()) return demoLoad().results.map(r => { const c = Object.assign({}, r); delete c.data; return c; }).reverse();
      return (await L.api.call("spgResultList")).list || [];
    },
    async getResult(id) {
      if (isDemo()) { const r = demoLoad().results.find(x => x.id === id); if (!r) throw new Error("Không tìm thấy kết quả này"); return r; }
      return (await L.api.call("spgResultGet", { id: id })).item;
    },
    async delResult(id) {
      if (isDemo()) { const d = demoLoad(); d.results = d.results.filter(x => x.id !== id); demoSave(d); return; }
      await L.api.call("spgResultDelete", { id: id });
    },
    async grade(payload, sampleMeasured) {
      if (isDemo()) { await new Promise(r => setTimeout(r, 900)); return { raw: S.sampleResult(), demo: true }; }
      return L.api.call("spgGrade", payload);
    },
    async studentNames() {
      try { const r = await L.api.call("studentList"); return (r.list || []).filter(s => s.active !== false).map(s => s.name); } catch (e) { return []; }
    }
  };
  /** "Bài 5.1" nếu tên đã bắt đầu bằng "Bài", ngược lại "Bài 5.1 · Tên bài" */
  const lessonLabel = l => { const t = String((l && l.title) || "").trim(), c = String((l && (l.code || l.id)) || "").trim(); return /^bài\s/i.test(t) || !c ? (t || "Bài " + c) : "Bài " + c + " · " + t; };
  const settingsOf = s => Object.assign({}, S.DEFAULT_SETTINGS, s || {});
  const lines = v => (Array.isArray(v) ? v : String(v || "").split(/\n|;/)).map(x => String(x).trim()).filter(Boolean);

  /* ============================================================
     Đọc file ghi âm -> mono 16 kHz (WAV) + đo ngắt nghỉ
     ============================================================ */
  async function prepAudio(file) {
    const AC = window.AudioContext || window.webkitAudioContext, OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AC || !OAC) throw new Error("Trình duyệt này chưa hỗ trợ xử lý âm thanh. Hãy dùng Chrome hoặc Safari bản mới.");
    if (file.size > 250 * 1024 * 1024) throw new Error("File quá nặng (trên 250 MB). Hãy cắt ngắn file hoặc xuất riêng phần âm thanh (mp3).");
    const buf = await file.arrayBuffer();
    const ctx = new AC();
    let dec;
    try {
      dec = await new Promise((res, rej) => { const p = ctx.decodeAudioData(buf, res, rej); if (p && p.catch) p.catch(rej); });
    } catch (e) { throw new Error("Không đọc được âm thanh trong file này. Nếu là video, hãy thử xuất riêng phần tiếng ra mp3/m4a rồi up lại; hoặc thử file khác."); }
    finally { try { ctx.close(); } catch (e) { } }
    if (dec.duration > MAX_SEC) throw new Error("File dài " + Math.round(dec.duration) + " giây, vượt giới hạn " + MAX_SEC / 60 + " phút. Hãy cắt ngắn rồi up lại.");
    const sr = 16000, off = new OAC(1, Math.max(1, Math.ceil(dec.duration * sr)), sr);
    const src = off.createBufferSource(); src.buffer = dec; src.connect(off.destination); src.start(0);
    const rendered = await new Promise((res, rej) => { off.oncomplete = e => res(e.renderedBuffer); const p = off.startRendering(); if (p && p.then) p.then(res, rej); });
    const x = rendered.getChannelData(0);
    return { durationSec: dec.duration, measured: S.analyzeSamples(x, sr), b64: wavBase64(x, sr) };
  }
  function wavBase64(x, sr) {
    const n = x.length, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
    for (let i = 0; i < n; i++) { const s = Math.max(-1, Math.min(1, x[i])); v.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); }
    const bytes = new Uint8Array(buf); let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  const mmss = s => { s = Math.max(0, Math.round(s)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
  const toSec = t => { const m = String(t || "").match(/(\d+):(\d{1,2})/); return m ? (+m[1]) * 60 + (+m[2]) : null; };

  /* ============================================================
     Khung: tab con + điều hướng
     ============================================================ */
  L.speakTab = async function (body, rest) {
    const sub = (rest && rest[0]) || "new";
    const tabs = [["new", "🎤 Chấm bài mới"], ["history", "🗂️ Lịch sử"], ["lessons", "📚 Cấu hình bài"]];
    body.append(h("div.tabs", tabs.map(([id, t]) => h("button" + (sub === id || (sub === "r" && id === "history") ? ".on" : ""), { onclick: () => L.go("/teacher/speak/" + id) }, t))));
    const host = h("div"); body.append(host);
    if (sub === "history") return historyView(host);
    if (sub === "lessons") return lessonsView(host);
    if (sub === "r" && rest[1]) return savedView(host, rest[1]);
    return gradeView(host);
  };

  /* ============================================================
     CHẤM BÀI MỚI
     ============================================================ */
  async function gradeView(host) {
    host.append(h("div.center.muted", h("span.spinner")));
    let info, ls, names;
    try { [info, ls, names] = await Promise.all([store.info(), store.lessons(), store.studentNames()]); }
    catch (e) { host.innerHTML = ""; host.append(h("div.card", h("div.err", e.message))); return; }
    host.innerHTML = "";
    const settings = settingsOf(ls.settings);
    const st = { lessonId: "", student: "", prep: null, file: null, busy: false, url: "" };

    if (info.demo) host.append(h("div.hint", { style: "margin-bottom:12px" }, "Đang ở chế độ DEMO (chưa nối Google Apps Script): app vẫn đo ngắt nghỉ thật từ file của cô, nhưng phần điểm AI là KẾT QUẢ MẪU để xem giao diện. Muốn chấm thật, làm theo mục Chấm Speaking trong HUONG-DAN.md."));
    else if (!info.hasKey) host.append(h("div.hint", { style: "margin-bottom:12px;background:var(--rose)" }, "Chưa cài khoá Gemini nên chưa chấm được. Vào Apps Script › Cài đặt dự án › Thuộc tính tập lệnh, thêm GEMINI_API_KEY (xem HUONG-DAN.md, mục Chấm Speaking), rồi tải lại trang."));

    const lessonSel = h("select", { onchange: e => { st.lessonId = e.target.value; refresh(); } },
      h("option", { value: "" }, ls.lessons.length ? "— Chọn bài học —" : "— Chưa có bài nào —"),
      ls.lessons.slice().sort((a, b) => String(a.code || a.id).localeCompare(String(b.code || b.id), "vi", { numeric: true })).map(l => h("option", { value: l.id }, lessonLabel(l))));
    const nameIn = h("input", { type: "text", list: "spgNames", placeholder: "Tên học viên", autocomplete: "off", oninput: e => { st.student = e.target.value; refresh(); } });
    const fileIn = h("input", { type: "file", accept: "audio/*,video/*,.mp3,.m4a,.wav,.aac,.ogg,.flac,.mp4,.mov,.m4v,.webm,.3gp", onchange: onFile });
    const dropName = h("span.spg-dropname", "Chưa chọn file");
    const drop = h("label.spg-drop", h("span.spg-dropico", "📁"), h("span", h("b", "Bấm để chọn file ghi âm hoặc video"), h("br"), h("span.small.muted", "mp3, m4a, wav, mp4, mov... (tối đa 5 phút)")), dropName, fileIn);
    drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("over"));
    drop.addEventListener("drop", e => { e.preventDefault(); drop.classList.remove("over"); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if (f) { try { const dt = new DataTransfer(); dt.items.add(f); fileIn.files = dt.files; } catch (_) { } onFile({ target: { files: [f] } }); } });
    const player = h("div");
    const infoBox = h("div");
    const lessonHint = h("div");
    const goBtn = h("button.btn.rose", { onclick: go }, "🎤 Chấm điểm");
    const out = h("div");

    host.append(h("div.card",
      h("h3", { style: "margin-bottom:10px" }, "Chấm bài nói của học viên"),
      h("div.grid2", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px" },
        h("label.field", h("span", "1. Bài học"), lessonSel),
        h("label.field", h("span", "2. Học viên"), nameIn, h("datalist#spgNames", names.map(n => h("option", { value: n })))),
        h("div.field", h("span", "3. File ghi âm hoặc video (mp3, mp4...)"), drop)),
      lessonHint, player, infoBox,
      h("div.row", { style: "margin-top:12px" }, goBtn, h("span.small.muted", "Mất khoảng 20-60 giây. Bài càng ngắn càng nhanh.")),
      ls.lessons.length ? null : h("div.hint", { style: "margin-top:12px" }, "Cô chưa có bài học nào. ", h("a", { href: "#/teacher/speak/lessons", style: "font-weight:800" }, "Vào Cấu hình bài"), " để tạo (có nút tạo sẵn các bài theo rubric)."),
      ), out);

    function lessonOf() { return ls.lessons.find(l => l.id === st.lessonId); }
    function refresh() {
      const l = lessonOf();
      lessonHint.innerHTML = "";
      if (l && !lines(l.vocab).length) lessonHint.append(h("div.hint", { style: "margin-top:10px" }, "Bài này chưa có từ vựng cốt lõi. AI sẽ chấm mục từ vựng theo chủ đề chung nên kém chính xác hơn; cô nên bổ sung ở ", h("a", { href: "#/teacher/speak/lessons", style: "font-weight:800" }, "Cấu hình bài"), "."));
      const ok = st.lessonId && st.student.trim() && st.prep && st.prep.measured && st.prep.measured.ok && !st.busy;
      goBtn.disabled = !ok; goBtn.classList.toggle("ghost", !ok);
    }
    async function onFile(e) {
      const f = e.target.files[0]; st.file = f || null; st.prep = null; infoBox.innerHTML = ""; player.innerHTML = "";
      if (st.url) { URL.revokeObjectURL(st.url); st.url = ""; }
      refresh();
      dropName.textContent = f ? f.name : "Chưa chọn file"; drop.classList.toggle("has", !!f);
      if (!f) return;
      st.url = URL.createObjectURL(f);
      const isVid = /^video\//.test(f.type) || /\.(mp4|mov|m4v|webm|3gp)$/i.test(f.name);
      player.append(h(isVid ? "video" : "audio", { controls: true, src: st.url, style: "width:100%;margin-top:12px" + (isVid ? ";max-height:220px;background:#000;border-radius:12px" : "") }));
      infoBox.append(h("div.muted.small", { style: "margin-top:8px" }, h("span.spinner"), " Đang đọc và đo file..."));
      try {
        const prep = await prepAudio(f);
        if (st.file !== f) return;
        st.prep = prep; infoBox.innerHTML = ""; infoBox.append(measuredCard(prep.measured, prep.durationSec, true));
        const m = prep.measured;
        if (m.ok && m.spanSec < 40) infoBox.append(h("div.hint", { style: "margin-top:8px" }, "Bài nói chỉ khoảng " + Math.round(m.spanSec) + " giây (chuẩn 60-90 giây). Vẫn chấm được nhưng điểm độ dài sẽ thấp."));
        if (m.ok && m.spanSec > 120) infoBox.append(h("div.hint", { style: "margin-top:8px" }, "Bài nói dài hơn 2 phút (chuẩn 60-90 giây): điểm độ dài sẽ thấp."));
      } catch (err) { infoBox.innerHTML = ""; infoBox.append(h("div.err", err.message)); }
      refresh();
    }
    async function go() {
      const lesson = lessonOf();
      if (!lesson || !st.prep) return;
      st.busy = true; goBtn.disabled = true; goBtn.classList.add("ghost"); goBtn.textContent = "⏳ AI đang nghe...";
      out.innerHTML = ""; out.append(h("div.card.center.muted", h("span.spinner"), " AI đang nghe và chấm, cô chờ chút nhé (20-60 giây)..."));
      try {
        const payload = {
          audioBase64: st.prep.b64, mimeType: "audio/wav", measured: st.prep.measured,
          rubric: S.ITEMS.filter(i => i.mode === "ai").map(i => ({ id: i.id, label: i.label, max: i.max, def: i.def })),
          lesson: lesson, settings: settings
        };
        const r = await store.grade(payload);
        const result = S.sanitize(r.raw, st.prep.measured);
        const rs = {
          id: "", student: st.student.trim(), lesson: { id: lesson.id, code: lesson.code || "", title: lesson.title || "", vocab: lines(lesson.vocab), phrases: lines(lesson.phrases) },
          result: result, measured: st.prep.measured, scores: Object.assign({}, result.scores), manual: { eyeContact: "", expression: "" },
          zalo: "", note: "", durationSec: st.prep.measured.spanSec, demo: !!r.demo, model: r.model || "", audioUrl: st.url, status: "draft", settings: settings
        };
        rs.zalo = S.buildZalo({ result: result, student: rs.student, totals: S.totals(rs.scores, rs.manual) });
        out.innerHTML = ""; renderResult(out, rs);
        try { await persist(rs, "draft"); toast("Đã lưu bản nháp AI vào Lịch sử"); } catch (e) { toast("Chưa lưu được bản nháp: " + e.message, 5000); }
        out.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (e) {
        out.innerHTML = ""; out.append(h("div.card", h("div.err", e.message), h("div.small.muted", { style: "margin-top:6px" }, "Cô bấm Chấm điểm lần nữa để thử lại. File và tên học viên vẫn còn nguyên.")));
      } finally { st.busy = false; goBtn.textContent = "🎤 Chấm điểm"; refresh(); }
    }
    refresh();
  }

  /* ---------- thẻ số liệu đo bằng phần mềm ---------- */
  function measuredCard(m, totalSec, compact, stats) {
    const cell = (v, l, tip) => h("div.spg-stat", { title: tip || "" }, h("b", String(v)), h("span", l));
    if (!m || !m.ok) return h("div.hint", { style: "margin-top:8px;background:var(--rose)" }, (m && m.reason) || "Không đo được file này.");
    const kids = [
      cell(mmss(m.spanSec), "thời lượng nói", "Từ lúc bắt đầu nói đến lúc nói xong (bỏ phần im lặng đầu/cuối). File dài " + mmss(totalSec || m.totalSec)),
      cell(Math.round(m.ratio * 100) + "%", "thời gian có tiếng", "Tỉ lệ thời gian thực sự có tiếng nói trong bài"),
      cell(m.pauseCount, "lần ngắt ≥ 0,5s", "Số khoảng lặng từ nửa giây trở lên giữa các đoạn nói"),
      cell(m.longPauseCount, "lần ngắt ≥ 1,2s", "Số khoảng lặng dài từ 1,2 giây trở lên"),
      cell(m.longestPause ? m.longestPause + "s" : "0s", "ngắt dài nhất")
    ];
    if (stats) { kids.push(cell(stats.wpm, "từ/phút", "Số từ (không tính âm đệm) chia cho thời lượng nói")); kids.push(cell(stats.fillers, "âm đệm uhm/er")); }
    return h("div", { style: "margin-top:10px" }, h("div.spg-stats", kids),
      compact ? h("div.small.muted", { style: "margin-top:4px" }, "Đo tự động từ âm lượng trên máy cô. Nếu file có nhiều tiếng ồn nền, số lần ngắt có thể lệch.") : null);
  }

  /* ============================================================
     KẾT QUẢ: xem, sửa điểm, chấm tay, tin Zalo, lưu
     ============================================================ */
  function renderResult(host, rs) {
    const R = rs.result;
    const T = () => S.totals(rs.scores, rs.manual);
    const refs = { inputs: {}, groups: {} };

    /* --- đầu trang: tổng điểm --- */
    const ring = h("div.spg-ring"), bandBox = h("div"), provBox = h("div.small.muted");
    const head = h("div.card.spg-head", ring, h("div.grow", h("div", { style: "font-family:var(--hfont);font-size:22px;font-weight:700" }, rs.student), h("div.muted.small", lessonLabel(rs.lesson) + " · " + mmss(rs.durationSec || 0) + " thời lượng nói"), bandBox, provBox));
    host.append(head);
    if (rs.demo) host.append(h("div.hint", { style: "margin-top:12px;background:var(--rose)" }, "⚠️ ĐÂY LÀ KẾT QUẢ MẪU (chế độ DEMO). Điểm AI và nhận xét bên dưới không phải do AI chấm file của cô."));
    if (R.audioNote && !rs.demo) host.append(h("div.hint", { style: "margin-top:12px" }, "📝 AI ghi chú về âm thanh: " + R.audioNote));
    if (R.confidence === "low" && !rs.demo) host.append(h("div.hint", { style: "margin-top:12px;background:var(--rose)" }, "AI tự đánh giá độ tin cậy THẤP với bài này (file ngắn, nhiều tiếng ồn hoặc khó nghe). Cô nghe lại và xem kỹ điểm trước khi gửi."));
    host.append(h("div.hint", { style: "margin-top:12px" }, "Điểm AI chỉ là bản nháp. Phát âm và ngữ điệu AI có thể nghe sai, nhất là những lỗi có nhãn \"tin cậy thấp\". Cô nghe lại và chỉnh điểm được ở bảng dưới."));

    /* --- bảng điểm --- */
    const tblBody = [];
    S.RUBRIC.forEach(g => {
      const gh = h("span.pill.big");
      refs.groups[g.id] = gh;
      tblBody.push(h("div.spg-grp", h("b", g.icon + " " + g.label), gh));
      g.items.forEach(it => {
        const isMan = it.mode === "manual";
        const val = isMan ? rs.manual[it.id] : rs.scores[it.id];
        const inp = h("input", { type: "number", min: 0, max: it.max, step: 0.5, inputmode: "decimal", value: val === undefined || val === null ? "" : String(val), placeholder: isMan ? "chấm" : "",
          oninput: e => { const v = e.target.value; if (isMan) rs.manual[it.id] = v === "" ? "" : S.clamp(parseFloat(v), 0, it.max); else rs.scores[it.id] = S.clamp(parseFloat(v) || 0, 0, it.max); paint(); },
          onchange: e => { const v = e.target.value; if (v !== "") e.target.value = String(S.clamp(parseFloat(v) || 0, 0, it.max)); } });
        refs.inputs[it.id] = inp;
        const modeTag = it.mode === "ai" ? h("span.pill.sky", "🤖 AI") : it.mode === "auto" ? h("span.pill.butter", "⚙️ tự tính") : h("span.pill.peach", "✋ cô chấm");
        const cm = isMan ? it.def : (R.comments[it.id] || "");
        tblBody.push(h("div.spg-row", h("div.spg-lab", h("b", it.label), modeTag), h("div.spg-in", inp, h("span.muted", " / " + it.max)), h("div.spg-cm.small", cm || h("span.muted", "(AI không ghi nhận xét)"))));
      });
    });
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", { style: "margin-bottom:8px" }, "Bảng điểm theo rubric"), tblBody));

    /* --- số liệu đo --- */
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "Số liệu đo được"), measuredCard(rs.measured, rs.measured && rs.measured.totalSec, false, R.textStats),
      R.textStats && R.textStats.repeated.length ? h("div.small", { style: "margin-top:8px" }, "Từ lặp nhiều: ", R.textStats.repeated.map(x => h("span.pill.butter", { style: "margin-right:4px" }, x.word + " ×" + x.count))) : null));

    /* --- phiên âm --- */
    const terms = lines(rs.lesson.vocab).concat(lines(rs.lesson.phrases), lines(rs.settings && rs.settings.phrases)).filter(t => /^[A-Za-z][A-Za-z' -]*[A-Za-z]$|^[A-Za-z]$/.test(t));
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "Bản phiên âm (đúng như học viên nói, không sửa lỗi)"),
      h("p.spg-tr", highlight(R.transcript || "(Không có phiên âm)", terms)),
      h("div.small.muted", h("mark.v", "tô xanh"), " = từ vựng/cụm từ của bài · ", h("mark.f", "tô cam"), " = âm đệm")));

    /* --- phát âm --- */
    const audio = rs.audioUrl ? h("audio", { controls: true, src: rs.audioUrl, style: "width:100%;margin:6px 0 10px" }) : null;
    const confTxt = { high: ["mint", "tin cậy cao"], medium: ["butter", "tin cậy vừa"], low: ["rose", "tin cậy thấp"] };
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "🎙️ Phát âm cần nghe lại"),
      audio, R.pronunciationIssues.length ? R.pronunciationIssues.map(x => {
        const sec = toSec(x.time), cf = confTxt[x.confidence] || confTxt.medium;
        return h("div.spg-iss", h("div.row", { style: "gap:6px" },
          h("b", { style: "font-size:17px" }, x.word || "(âm)"),
          x.time ? (audio && sec !== null ? h("button.btn.sm.sky", { onclick: () => { audio.currentTime = sec; audio.play(); } }, "▶ " + x.time) : h("span.pill", x.time)) : null,
          h("span.pill." + cf[0], cf[1])),
          (x.heard || x.expected) ? h("div.small", (x.heard ? "Nghe thấy: " + x.heard : "") + (x.heard && x.expected ? "  →  " : "") + (x.expected ? "Chuẩn: " + x.expected : "")) : null,
          x.tip ? h("div.small", "💡 " + x.tip) : null);
      }) : h("div.muted", "AI không ghi nhận lỗi phát âm rõ ràng nào."),
      !audio && R.pronunciationIssues.length ? h("div.small.muted", "Muốn nghe lại đúng mốc thời gian, cô mở file ghi âm gốc.") : null));

    /* --- từ vựng & cụm từ --- */
    const chips = (a, cls) => a.length ? a.map(w => h("span.pill." + cls, { style: "margin:2px 4px 2px 0" }, w)) : h("span.muted.small", "(không có)");
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "📚 Từ vựng, cụm từ & từ nối"),
      h("div", { style: "margin-top:6px" }, h("b.small", "Từ vựng của bài đã dùng: "), chips(R.vocabUsed, "mint")),
      h("div", { style: "margin-top:6px" }, h("b.small", "Từ vựng của bài chưa dùng: "), chips(R.vocabMissing, "peach")),
      h("div", { style: "margin-top:6px" }, h("b.small", "Cụm từ đắt giá đã dùng: "), chips(R.phrasesUsed, "mint")),
      h("div", { style: "margin-top:6px" }, h("b.small", "Cụm từ nên dùng thêm: "), chips(R.phrasesMissing, "peach")),
      h("div", { style: "margin-top:6px" }, h("b.small", "Từ nối đã dùng: "), chips(R.connectorsUsed, "sky"))));

    /* --- ngữ pháp --- */
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "📐 Lỗi ngữ pháp"),
      R.grammarErrors.length ? h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["Học viên nói", "Nên là", "Giải thích"].map(t => h("th", t)))),
        h("tbody", R.grammarErrors.map(g => h("tr", h("td", g.said), h("td", h("b", g.better)), h("td.small", g.rule)))))) : h("div.muted", "AI không ghi nhận lỗi ngữ pháp đáng kể.")));

    /* --- điểm mạnh / yếu / cần cải thiện --- */
    const ul = a => a.length ? h("ul", { style: "margin:6px 0 0;padding-left:20px" }, a.map(x => h("li", x))) : h("div.muted.small", "(trống)");
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "Phân tích"),
      h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:8px" },
        h("div", h("b", "💪 Điểm mạnh"), ul(R.strengths)), h("div", h("b", "⚠️ Điểm yếu"), ul(R.weaknesses))),
      h("div", { style: "margin-top:14px" }, h("b", "🎯 Cần cải thiện"), R.improvements.length ? R.improvements.map(x => h("div.spg-iss", h("b", x.title), x.how ? h("div.small", x.how) : null, x.practice ? h("div.small", "🏋️ Luyện: " + x.practice) : null)) : h("div.muted.small", "(trống)"))));

    /* --- giao tiếp đời sống --- */
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "🗣️ Nói tự nhiên hơn trong đời sống"),
      R.naturalPhrasing.length ? R.naturalPhrasing.map(x => h("div.spg-iss", h("div.small", "Em nói: ", h("i", x.said)), h("div", "Người bản xứ hay nói: ", h("b", x.moreNatural)), x.why ? h("div.small.muted", x.why) : null)) : h("div.muted", "AI chưa có gợi ý nào."),
      R.nextChallenge.scenario || R.nextChallenge.sentences.length ? h("div.hint", { style: "margin-top:10px" }, h("b", "🎯 Thử thách buổi sau: "), R.nextChallenge.scenario, R.nextChallenge.sentences.length ? ul(R.nextChallenge.sentences) : null) : null));

    /* --- Zalo --- */
    const zalo = h("textarea.spg-zalo", { oninput: e => { rs.zalo = e.target.value; rs.zaloEdited = true; zaloNote.style.display = ""; } }); zalo.value = rs.zalo;
    const zaloNote = h("div.small.muted", { style: "margin-top:6px;display:" + (rs.zaloEdited ? "" : "none") }, "Cô đã sửa tay tin nhắn nên app không tự đổi nữa. Sau khi chỉnh điểm, bấm \"Tạo lại\" để cập nhật số điểm trong tin.");
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", "💬 Tin nhắn gửi Zalo (sửa trực tiếp được)"), zalo, zaloNote,
      h("div.row", { style: "margin-top:8px" },
        h("button.btn.sky", { onclick: () => L.copyText(zalo.value) }, "📋 Sao chép"),
        h("button.btn.ghost", { onclick: async () => { if (!(await L.confirmBox("Tạo lại tin nhắn theo điểm hiện tại? Phần cô đã sửa tay sẽ mất.", "Tạo lại"))) return; rs.zalo = S.buildZalo({ result: R, student: rs.student, totals: T() }); rs.zaloEdited = false; zaloNote.style.display = "none"; zalo.value = rs.zalo; } }, "🔄 Tạo lại theo điểm hiện tại"))));

    /* --- ghi chú & lưu --- */
    const note = h("textarea", { style: "min-height:70px;font-family:inherit", placeholder: "Ghi chú riêng của cô (học viên không thấy)...", oninput: e => { rs.note = e.target.value; } }); note.value = rs.note || "";
    const saveBtn = h("button.btn.mint", { onclick: async () => {
      saveBtn.disabled = true;
      try { const t = T(); await persist(rs, t.provisional ? "tentative" : "final"); toast(t.provisional ? "Đã lưu. Cô nhớ chấm 10 điểm phong thái nữa nhé." : "Đã lưu kết quả ✓"); }
      catch (e) { toast("Chưa lưu được: " + e.message, 5000); } finally { saveBtn.disabled = false; }
    } }, "💾 Lưu kết quả");
    host.append(h("div.card", { style: "margin-top:12px" }, h("h3", { style: "margin-bottom:6px" }, "📝 Ghi chú riêng"), note));
    host.append(h("div.card.spg-bar", { style: "margin-top:12px" },
      h("div.row", saveBtn, h("a.btn.ghost", { href: "#/teacher/speak/history" }, "🗂️ Lịch sử"), h("a.btn.ghost", { href: "#/teacher/speak/new", onclick: e => { if (location.hash.indexOf("#/teacher/speak/new") === 0) { e.preventDefault(); L.route(); window.scrollTo(0, 0); } } }, "➕ Chấm bài khác"))));

    function paint() {
      const t = T();
      ring.innerHTML = ""; ring.append(h("b", String(t.provisional ? t.part : t.total)), h("span", t.provisional ? "/90 (tạm)" : "/100"));
      ring.className = "spg-ring " + t.band.key;
      bandBox.innerHTML = ""; bandBox.append(h("div", { style: "margin-top:4px" }, h("span.pill.big", t.band.icon + " " + t.band.label + (t.provisional ? " (tạm tính)" : ""))), h("div.small", { style: "margin-top:6px" }, t.band.note));
      provBox.textContent = t.provisional ? "Chưa tính 10 điểm Phong thái (cô tự chấm bên dưới). Xếp loại tạm quy từ " + t.part + "/90." : "";
      t.groups.forEach(g => { refs.groups[g.id].textContent = g.got + " / " + g.max; });
      if (!rs.zaloEdited) { rs.zalo = S.buildZalo({ result: R, student: rs.student, totals: t }); zalo.value = rs.zalo; }
    }
    paint();
  }

  async function persist(rs, status) {
    const t = S.totals(rs.scores, rs.manual);
    rs.status = status;
    rs.id = await store.saveResult({
      id: rs.id || undefined, student: rs.student, lessonId: rs.lesson.id, lessonTitle: lessonLabel(rs.lesson),
      total: t.provisional ? t.part : t.total, band: t.band.label, durationSec: rs.durationSec || 0, status: status,
      data: { result: rs.result, measured: rs.measured, scores: rs.scores, manual: rs.manual, zalo: rs.zalo, zaloEdited: !!rs.zaloEdited, note: rs.note, lesson: rs.lesson, demo: rs.demo, model: rs.model, settings: { phrases: (rs.settings || {}).phrases } }
    });
  }

  function highlight(text, terms) {
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const t = terms.slice().sort((a, b) => b.length - a.length).map(esc);
    const re = new RegExp((t.length ? "(\\b(?:" + t.join("|") + ")\\b)|" : "") + "(\\b(?:uh+m*|um+|er+m*|erm|ah+|hmm+)\\b)", "gi");
    const out = []; let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push(text.slice(last, m.index));
      out.push(h("mark" + (t.length && m[1] ? ".v" : ".f"), m[0]));
      last = m.index + m[0].length;
      if (m[0].length === 0) re.lastIndex++;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
  }

  /* ============================================================
     LỊCH SỬ & mở lại bài đã lưu
     ============================================================ */
  async function historyView(host) {
    host.append(h("div.center.muted", h("span.spinner")));
    let list;
    try { list = await store.results(); } catch (e) { host.innerHTML = ""; host.append(h("div.card", h("div.err", e.message))); return; }
    host.innerHTML = "";
    if (!list.length) { host.append(h("div.card.empty", "Chưa có bài nào được chấm.", h("div", h("a.btn", { style: "margin-top:10px", href: "#/teacher/speak/new" }, "🎤 Chấm bài đầu tiên")))); return; }
    const students = Array.from(new Set(list.map(r => r.student))).sort((a, b) => a.localeCompare(b, "vi"));
    let sel = "";
    const box = h("div");
    const stTag = { draft: ["rose", "Nháp AI"], tentative: ["butter", "Chờ chấm phong thái"], final: ["mint", "Hoàn tất"] };
    function draw() {
      box.innerHTML = "";
      const rows = list.filter(r => !sel || r.student === sel);
      if (sel) {
        const chrono = rows.slice().reverse().filter(r => r.status === "final");
        if (chrono.length >= 2) box.append(h("div.hint", { style: "margin-bottom:10px" }, h("b", "Tiến bộ của " + sel + ": "), chrono.map(r => r.total).join("  →  "), "  (các bài đã hoàn tất, cũ đến mới)"));
      }
      box.append(h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["Ngày", "Học viên", "Bài", "Điểm", "Xếp loại", "Trạng thái", ""].map(t => h("th", t)))),
        h("tbody", rows.map(r => {
          const tg = stTag[r.status] || stTag.draft;
          return h("tr", h("td", { style: "white-space:nowrap" }, fmtDate(r.time)), h("td", h("b", r.student)), h("td", r.lessonTitle),
            h("td", h("b", String(r.total)), h("span.muted", r.status === "final" ? "/100" : "/90")), h("td", r.band), h("td", h("span.pill." + tg[0], tg[1])),
            h("td", { style: "white-space:nowrap" }, h("a.btn.sm", { href: "#/teacher/speak/r/" + r.id }, "Mở"), " ",
              h("button.btn.sm.ghost", { onclick: async () => { if (!(await L.confirmBox("Xoá kết quả của " + r.student + " (" + r.lessonTitle + ")?", "Xoá"))) return; try { await store.delResult(r.id); list = list.filter(x => x.id !== r.id); draw(); toast("Đã xoá"); } catch (e) { toast(e.message, 4000); } } }, "🗑️")));
        })))));
    }
    host.append(h("div.card",
      h("div.row", { style: "margin-bottom:10px" }, h("h3", "Lịch sử chấm Speaking"), h("span.grow"),
        h("select", { style: "width:auto", onchange: e => { sel = e.target.value; draw(); } }, h("option", { value: "" }, "Tất cả học viên"), students.map(n => h("option", { value: n }, n)))), box));
    draw();
  }

  async function savedView(host, id) {
    host.append(h("div.center.muted", h("span.spinner")));
    let item;
    try { item = await store.getResult(id); } catch (e) { host.innerHTML = ""; host.append(h("div.card", h("div.err", e.message), h("a.btn", { href: "#/teacher/speak/history" }, "← Lịch sử"))); return; }
    host.innerHTML = "";
    const d = item.data || {};
    if (!d.result) { host.append(h("div.card.empty", "Kết quả này không còn dữ liệu chi tiết (có thể đã bị rút gọn).")); return; }
    const rs = {
      id: item.id, student: item.student, lesson: d.lesson || { id: item.lessonId, code: "", title: item.lessonTitle, vocab: [], phrases: [] },
      result: d.result, measured: d.measured, scores: d.scores || d.result.scores, manual: d.manual || { eyeContact: "", expression: "" }, zalo: d.zalo || "", zaloEdited: !!d.zaloEdited, note: d.note || "",
      durationSec: item.durationSec, demo: !!d.demo, model: d.model || "", audioUrl: "", status: item.status, settings: d.settings || {}
    };
    host.append(h("div.row", { style: "margin-bottom:12px" }, h("a.btn.sm.ghost", { href: "#/teacher/speak/history" }, "← Lịch sử"), h("span.muted.small", "Chấm lúc " + fmtDate(item.time))));
    renderResult(host, rs);
  }

  /* ============================================================
     CẤU HÌNH BÀI + cài đặt chung
     ============================================================ */
  async function lessonsView(host) {
    host.append(h("div.center.muted", h("span.spinner")));
    let ls;
    try { ls = await store.lessons(); } catch (e) { host.innerHTML = ""; host.append(h("div.card", h("div.err", e.message))); return; }
    host.innerHTML = "";
    const have = new Set(ls.lessons.map(l => l.id));
    const missing = SEEDS.filter(s => !have.has(s.id));
    const list = h("div");
    const sorted = ls.lessons.slice().sort((a, b) => String(a.code || a.id).localeCompare(String(b.code || b.id), "vi", { numeric: true }));
    const chip = (ok, t) => h("span.pill." + (ok ? "mint" : "butter"), (ok ? "✓ " : "chưa có ") + t);
    list.append(sorted.length ? sorted.map(l => h("div.spg-iss", h("div.row",
      h("div.grow", h("b", { style: "font-size:17px" }, lessonLabel(l)),
        h("div", { style: "margin-top:4px" }, chip(!!l.targetSounds, "âm IPA"), " ", chip(lines(l.vocab).length > 0, lines(l.vocab).length + " từ vựng"), " ", chip(!!l.grammar, "ngữ pháp"), " ", chip(!!l.prompt, "đề nói"))),
      h("button.btn.sm", { onclick: () => editLesson(l) }, "Sửa"),
      h("button.btn.sm.ghost", { onclick: async () => { if (!(await L.confirmBox("Xoá cấu hình " + (l.title || l.id) + "? (Kết quả đã chấm vẫn giữ nguyên)", "Xoá"))) return; try { await store.delLesson(l.id); L.route(); } catch (e) { toast(e.message, 4000); } } }, "🗑️")))) : h("div.muted", "Chưa có bài nào."));

    host.append(h("div.card",
      h("div.row", h("h3", "Cấu hình từng bài"), h("span.grow"),
        missing.length ? h("button.btn.sky", { title: "Tạo bài " + missing.map(m => m.code).join(", ") + " chỉ với phần cô đã viết trong rubric, các ô còn lại để cô điền", onclick: async () => {
          try { for (const s of missing) await store.saveLesson(Object.assign({ vocab: [], phrases: [], prompt: "", targetSounds: "", soundNotes: "", grammar: "", notes: "" }, s)); toast("Đã tạo " + missing.length + " bài"); L.route(); } catch (e) { toast(e.message, 5000); }
        } }, "✨ Tạo sẵn bài " + missing.map(m => m.code).join(", ")) : null,
        h("button.btn", { onclick: () => editLesson(null) }, "+ Thêm bài")),
      h("p.small.muted", { style: "margin:6px 0 10px" }, "Mỗi bài cần: âm IPA trọng tâm, từ vựng cốt lõi, cấu trúc ngữ pháp và đề nói. Càng đủ thì AI chấm càng sát bài cô dạy. App không tự thêm nội dung bài; các bài tạo sẵn chỉ chứa phần cô đã viết trong rubric."),
      list));

    const st = settingsOf(ls.settings);
    const f = (k, label, ph) => { const t = h("textarea", { style: "min-height:80px;font-family:inherit", placeholder: ph || "" }); t.value = lines(st[k]).join("\n"); t.dataset.k = k; return h("label.field", h("span", label), t); };
    const fields = [f("phrases", "Cụm từ đắt giá (chung cho mọi bài, mỗi dòng một cụm)"), f("connectors", "Từ nối cần dùng (mỗi dòng một từ)"), f("stressWords", "Từ mẫu về trọng âm (mỗi dòng một từ)"), f("endSounds", "Âm đuôi cần giữ (mỗi dòng một âm)")];
    host.append(h("div.card", { style: "margin-top:16px" }, h("h3", { style: "margin-bottom:8px" }, "Cài đặt chung cho mọi bài"),
      h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px" }, fields),
      h("div.row", { style: "margin-top:10px" }, h("button.btn.mint", { onclick: async () => {
        const o = {}; fields.forEach(fl => { const t = fl.querySelector("textarea"); o[t.dataset.k] = lines(t.value); });
        try { await store.saveSettings(o); toast("Đã lưu cài đặt chung ✓"); } catch (e) { toast(e.message, 4000); }
      } }, "💾 Lưu cài đặt chung"))));
  }

  function editLesson(l) {
    const isNew = !l; l = l || { id: "", code: "", title: "", prompt: "", targetSounds: "", soundNotes: "", vocab: [], phrases: [], grammar: "", notes: "" };
    modal(close => {
      const ta = (v, ph, min) => { const t = h("textarea", { style: "min-height:" + (min || 64) + "px;font-family:inherit", placeholder: ph || "" }); t.value = v || ""; return t; };
      const code = h("input", { type: "text", placeholder: "VD: 5.1", value: l.code || l.id || "", disabled: !isNew });
      const title = h("input", { type: "text", placeholder: "VD: Bài 5.1 hoặc tên chủ đề", value: l.title || "" });
      const prompt = ta(l.prompt, "Đề bài học viên phải nói (cô đã giao)", 60);
      const sounds = h("input", { type: "text", placeholder: "VD: /f/, /v/", value: l.targetSounds || "" });
      const snotes = ta(l.soundNotes, "Ghi chú phát âm: khẩu hình, từ mẫu, lỗi hay gặp...", 56);
      const vocab = ta(lines(l.vocab).join("\n"), "Mỗi dòng một từ/cụm từ cốt lõi của bài", 100);
      const phrases = ta(lines(l.phrases).join("\n"), "Mỗi dòng một cụm từ/collocation của bài", 70);
      const grammar = ta(l.grammar, "Cấu trúc ngữ pháp trọng tâm của bài", 60);
      const notes = ta(l.notes, "Ghi chú khác cho AI", 56);
      const err = h("div.err");
      const fld = (t, el) => h("label.field", { style: "margin-top:10px" }, h("span", t), el);
      return h("div", h("h3", { style: "margin-bottom:6px" }, isNew ? "Thêm bài học" : "Sửa " + lessonLabel(l)),
        fld("Mã bài (chữ không dấu, số, dấu chấm)", code), fld("Tên bài", title), fld("Đề nói", prompt), fld("Âm IPA trọng tâm", sounds), fld("Ghi chú phát âm", snotes),
        fld("Từ vựng cốt lõi", vocab), fld("Cụm từ/collocation của bài", phrases), fld("Ngữ pháp trọng tâm", grammar), fld("Ghi chú khác", notes), err,
        h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn.ghost", { onclick: close }, "Huỷ"),
          h("button.btn.mint", { onclick: async () => {
            const id = (isNew ? code.value : (l.id || code.value)).trim();
            if (!/^[A-Za-z0-9_.-]+$/.test(id)) { err.textContent = "Mã bài chỉ gồm chữ không dấu, số, dấu chấm hoặc gạch (VD 5.1)"; return; }
            if (!title.value.trim()) { err.textContent = "Nhập tên bài nhé"; return; }
            try { await store.saveLesson({ id: id, code: id, title: title.value.trim(), prompt: prompt.value.trim(), targetSounds: sounds.value.trim(), soundNotes: snotes.value.trim(), vocab: lines(vocab.value), phrases: lines(phrases.value), grammar: grammar.value.trim(), notes: notes.value.trim() }); close(); toast("Đã lưu ✓"); L.route(); }
            catch (e) { err.textContent = e.message; }
          } }, "💾 Lưu")));
    }, { wide: true });
  }
})(window.LSE);
