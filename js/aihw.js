/* AI soạn bài tập từ ảnh sách (Gemini, dùng chung khoá GEMINI_API_KEY với Chấm Speaking).
   File này chỉ chứa phần "thuần": thu nhỏ ảnh, dựng lời nhắc theo ĐÚNG cú pháp của web, kiểm tra kết quả AI trả về.
   Cửa sổ giao diện nằm ở teacher.js (aiHwModal). Kết quả luôn được cô xem lại trước khi lưu. */
window.LSE = window.LSE || {};
(function (L) {
  /* các dạng bài AI được phép soạn: [id, số câu mặc định, bật sẵn?] */
  const CHOICES = [
    ["mcq1", 8, true], ["fillchoose", 8, true], ["tf", 6, true], ["short", 6, true], ["classify", 6, false],
    ["fill", 8, false], ["fillbank", 8, false], ["match", 6, false], ["sentence", 6, false], ["order", 4, false],
    ["mcqN", 4, false], ["wordpick", 4, false]
  ];
  const COUNTS = [3, 4, 5, 6, 8, 10, 12, 15, 20];
  const MAX_IMAGES = 8, MAX_SIDE = 1600, MAX_TOTAL_B64 = 14 * 1024 * 1024;

  const allowed = () => CHOICES.filter(c => L.hw && L.hw.TYPE && L.hw.TYPE[c[0]]);

  /** thu nhỏ ảnh về tối đa 1600px, JPEG 0.82 -> { mimeType, data(base64), w, h } */
  async function shrink(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error("Không mở được ảnh \"" + file.name + "\" (có thể là định dạng HEIC; hãy chụp lại hoặc chọn JPG/PNG).")); i.src = url; });
      const k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * k)), hh = Math.max(1, Math.round(img.naturalHeight * k));
      const cv = document.createElement("canvas"); cv.width = w; cv.height = hh;
      const cx = cv.getContext("2d"); cx.fillStyle = "#fff"; cx.fillRect(0, 0, w, hh); cx.drawImage(img, 0, 0, w, hh);
      const data = cv.toDataURL("image/jpeg", 0.82).split(",")[1];
      return { mimeType: "image/jpeg", data, w, h: hh };
    } finally { URL.revokeObjectURL(url); }
  }

  /** dựng lời nhắc. o: { types:[{id,n}], theory:bool, note, level } */
  function buildPrompt(o) {
    const parts = [];
    parts.push("Bạn là giáo viên tiếng Anh giàu kinh nghiệm. Các ảnh đính kèm là trang sách / tài liệu của cô giáo. Hãy soạn MỘT BÀI TẬP online để học sinh làm và nộp cho cô chấm, dựa trên các ảnh đó.");
    if (o.level) parts.push("Lớp / giáo trình: " + o.level + ".");
    parts.push("");
    parts.push("NGUYÊN TẮC (bắt buộc):");
    parts.push("- CHỈ dùng từ vựng, ngữ pháp, ví dụ có trong ảnh. KHÔNG tự thêm kiến thức, tên unit, số trang hay nội dung sách không thấy trong ảnh. Chỗ nào ảnh mờ hoặc không chắc thì bỏ qua và ghi vào \"notes\".");
    parts.push("- Câu hỏi viết bằng tiếng Anh. Phần giải thích (dòng EXP:) và nhận xét viết bằng tiếng Việt, ngắn gọn.");
    parts.push("- Mỗi câu phải có đáp án đúng duy nhất và chính xác. Kiểm tra lại đáp án trước khi trả về.");
    parts.push("- Độ khó vừa sức học sinh của lớp trên.");
    if (o.note && o.note.trim()) parts.push("- Yêu cầu thêm của cô: " + o.note.trim());
    parts.push("");
    parts.push("ĐỊNH DẠNG TRẢ VỀ: CHỈ một đối tượng JSON, không lời dẫn, không khung code, có đúng các khoá:");
    parts.push("{\"title\": \"tên bài tập ngắn gọn (tiếng Anh hoặc theo tiêu đề trong ảnh)\", \"desc\": \"khung lý thuyết đầu bài (chuỗi, có thể rỗng)\", \"sections\": [{\"type\": \"mã dạng bài\", \"title\": \"tên phần\", \"raw\": \"nội dung phần theo đúng cú pháp\"}], \"notes\": [\"ghi chú cho cô: chỗ không chắc, chỗ ảnh mờ...\"]}");
    parts.push("Trong chuỗi JSON, xuống dòng viết là \\n. Dùng \\n\\n (1 dòng trống) để ngăn cách các câu khi cú pháp yêu cầu.");
    parts.push("");
    if (o.theory) {
      parts.push("KHOÁ \"desc\" – KHUNG LÝ THUYẾT: tóm tắt phần lý thuyết/từ vựng chính trong ảnh để học sinh xem lại khi làm bài. Tiêu đề mục đặt trong **đậm**. Bảng viết mỗi dòng dạng | ô 1 | ô 2 | ô 3 |, dòng đầu là tiêu đề cột, KHÔNG có dòng |---|. Đoạn giải thích để dòng thường, ngắn gọn bằng tiếng Việt. Chỉ dùng nội dung có trong ảnh.");
    } else {
      parts.push("KHOÁ \"desc\": để chuỗi rỗng \"\".");
    }
    parts.push("");
    parts.push("KHOÁ \"sections\": soạn đúng các phần sau, theo thứ tự. \"raw\" của mỗi phần là văn bản thuần (KHÔNG markdown, KHÔNG đánh số câu) theo đúng cú pháp:");
    o.types.forEach((t, i) => {
      const T = L.hw.TYPE[t.id];
      parts.push("");
      parts.push("PHẦN " + (i + 1) + " – type: \"" + t.id + "\" (" + T.label + "), " + t.n + " câu/mục.");
      parts.push("Cú pháp: " + T.rule);
      parts.push("Mẫu (chỉ để tham khảo cú pháp, KHÔNG chép lại nội dung mẫu):");
      parts.push(T.sample);
    });
    return parts.join("\n");
  }

  /** kiểm tra kết quả AI: loại phần sai cú pháp, trả { title, desc, secs:[{title,type,raw,topic,desc,n,errors}], notes } */
  function check(raw, wantTypes) {
    const out = { title: "", desc: "", secs: [], notes: [] };
    if (!raw || typeof raw !== "object") throw new Error("AI trả về dữ liệu lạ. Hãy bấm soạn lại.");
    out.title = String(raw.title || "").replace(/\s+/g, " ").trim().slice(0, 120);
    out.desc = String(raw.desc || "").replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
    (Array.isArray(raw.notes) ? raw.notes : []).forEach(n => { n = String(n || "").trim(); if (n) out.notes.push(n.slice(0, 300)); });
    const ok = new Set(wantTypes);
    (Array.isArray(raw.sections) ? raw.sections : []).forEach((s, i) => {
      const type = String((s && s.type) || "").trim(), txt = String((s && s.raw) || "").replace(/\r/g, "").trim();
      const label = ((L.hw.TYPE[type] || {}).label || type);
      if (!ok.has(type) || !L.hw.TYPE[type]) { out.notes.push("Bỏ phần " + (i + 1) + ": dạng bài \"" + type + "\" không có trong danh sách cô chọn."); return; }
      if (!txt) { out.notes.push("Bỏ phần " + (i + 1) + " (" + label + "): AI không trả nội dung."); return; }
      let r;
      try { r = L.hw.parseSection({ id: "ai" + i, type, raw: txt, topic: "" }); } catch (e) { out.notes.push("Bỏ phần " + (i + 1) + " (" + label + "): sai cú pháp (" + (e.message || e) + ")."); return; }
      const n = (r.questions || []).length;
      if (!n) { out.notes.push("Bỏ phần " + (i + 1) + " (" + label + "): không có câu nào dùng được" + ((r.errors || [])[0] ? " – " + r.errors[0] : "") + "."); return; }
      out.secs.push({ title: String(s.title || label).replace(/\s+/g, " ").trim().slice(0, 100) || label, type, raw: txt, topic: "", desc: "", n, errors: (r.errors || []).slice(0, 4) });
    });
    if (!out.secs.length) throw new Error("AI chưa soạn được phần nào dùng được. Thử chụp ảnh rõ hơn hoặc bấm soạn lại." + (out.notes.length ? " (" + out.notes[0] + ")" : ""));
    return out;
  }

  L.aihw = { CHOICES, COUNTS, MAX_IMAGES, MAX_TOTAL_B64, allowed, shrink, buildPrompt, check };
})(window.LSE);
