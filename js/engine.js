/* ============================================================
   BỘ MÁY BÀI TẬP: 14 dạng, mỗi dạng có "cú pháp" để dán vào.
   parse(raw) -> câu hỏi | view(q, st, ctx) -> giao diện | grade(q, st) -> điểm
   ============================================================ */
(function (L) {
  const { h, norm, shuffle, esc } = L;

  /* ---------------------------------------------------------------
     1. DANH MỤC DẠNG BÀI + MẪU CÚ PHÁP
     --------------------------------------------------------------- */
  const TYPES = [
    { id: "mcq1", label: "Trắc nghiệm 1 đáp án", emoji: "🔘", color: "sky",
      rule: "Mỗi câu: dòng câu hỏi, rồi các dòng đáp án A. B. C. D. Đáp án đúng đánh dấu dấu * ở đầu dòng (ví dụ *B. goes). Có thể thêm dòng EXP: giải thích và TOPIC: chủ điểm. Các câu cách nhau 1 dòng trống.",
      sample: "She ___ to school every day.\nA. go\n*B. goes\nC. going\nD. went\nEXP: Chủ ngữ số ít (She) nên động từ thêm -es.\nTOPIC: present simple\n\nThey ___ football on Sundays.\n*A. play\nB. plays\nC. playing\nD. played\nTOPIC: present simple" },
    { id: "mcqN", label: "Trắc nghiệm nhiều đáp án", emoji: "☑️", color: "sky",
      rule: "Giống Trắc nghiệm 1 đáp án nhưng mỗi câu có thể có nhiều đáp án đúng, mỗi đáp án đúng đều có dấu * ở đầu dòng. Học sinh phải chọn đủ và đúng mới được điểm.",
      sample: "Which words are fruits?\n*A. apple\nB. carrot\n*C. banana\nD. potato\nTOPIC: food vocabulary" },
    { id: "tf", label: "Đúng / Sai", emoji: "✅", color: "mint",
      rule: "Mỗi dòng là một nhận định, theo dạng: nhận định | T hoặc F | giải thích (không bắt buộc) | chủ điểm (không bắt buộc). T là đúng, F là sai.",
      sample: "A cat is a bird. | F | Cat là động vật có vú. | animals\nWe use \"an\" before a vowel sound. | T\nThe sun rises in the west. | F" },
    { id: "tf4", label: "Đúng / Sai (nhiều ý a b c d)", emoji: "🧩", color: "mint",
      rule: "Mỗi câu gồm đề bài, rồi các ý a) b) c) d). Cuối mỗi ý ghi | T hoặc | F. Các câu cách nhau 1 dòng trống. Mỗi ý được tính là 1 điểm.",
      sample: "Read: Nam gets up at 6 a.m. and goes to school by bike.\na) Nam gets up at 6 a.m. | T\nb) Nam goes to school by bus. | F\nc) Nam rides a bike to school. | T\nd) Nam gets up at 7 a.m. | F\nTOPIC: reading" },
    { id: "fill", label: "Điền từ", emoji: "✏️", color: "peach",
      rule: "Mỗi dòng (hoặc đoạn văn) có chỗ trống đặt trong [[ ]], bên trong là đáp án đúng. Có nhiều đáp án được chấp nhận thì ngăn bằng dấu / ví dụ [[color/colour]]. Không phân biệt hoa thường.",
      sample: "She [[goes]] to school every day.\nI [[am/'m]] a teacher.\nThere [[are]] two cats and one [[dog]] in the garden." },
    { id: "fillhint", label: "Điền từ (có gợi ý)", emoji: "💡", color: "peach",
      rule: "Giống Điền từ, nhưng ngay sau chỗ trống ghi gợi ý trong { }, ví dụ [[goes]]{go}. Gợi ý hiện ra bên cạnh ô trống (thường là động từ nguyên mẫu cần chia).",
      sample: "She [[goes]]{go} to school every day.\nThey [[are playing]]{play} football now.\nHe [[didn't see]]{not / see} the film." },
    { id: "fillbank", label: "Điền từ (chọn từ trong khung)", emoji: "🧺", color: "peach",
      rule: "Dòng đầu: BANK: liệt kê các từ trong khung, ngăn bằng dấu phẩy (có thể thêm từ gây nhiễu). Nếu bỏ dòng BANK, khung từ tự lấy từ các đáp án. Các dòng sau có chỗ trống [[đáp án]]. Mỗi từ trong khung dùng được 1 lần.",
      sample: "BANK: happy, sad, angry, tired, hungry\nShe smiled because she was [[happy]].\nHe didn't sleep well, so he is [[tired]].\nI haven't eaten all day. I'm [[hungry]]." },
    { id: "fillchoose", label: "Điền từ (chọn trong danh sách)", emoji: "🔽", color: "peach",
      rule: "Chỗ trống là danh sách chọn: [[lựa chọn 1|lựa chọn 2|lựa chọn 3]], đáp án đúng đánh dấu * ở đầu, ví dụ [[*goes|go|going]].",
      sample: "She [[*goes|go|going]] to school every day.\nThere [[is|*are]] two apples on the table.\nI have [[*a|an]] umbrella." },
    { id: "short", label: "Trả lời ngắn", emoji: "💬", color: "rose",
      rule: "Mỗi dòng: câu hỏi => đáp án. Có nhiều đáp án chấp nhận thì ngăn bằng dấu /. Không phân biệt hoa thường.",
      sample: "What is the plural of \"child\"? => children\nWhat colour do you get from blue and yellow? => green\nWhat is the opposite of \"hot\"? => cold / cool" },
    { id: "wordpick", label: "Chọn từ trong câu / đoạn", emoji: "👆", color: "rose",
      rule: "Mỗi dòng (hoặc đoạn) là một văn bản; những từ học sinh cần chọn đặt trong [[ ]]. Học sinh chạm vào các từ trong văn bản để chọn. Nên viết yêu cầu (ví dụ 'Chọn các danh từ') vào ô Nội dung chung hoặc dòng TASK: ở đầu đoạn.",
      sample: "TASK: Chọn tất cả danh từ.\nThe [[cat]] sat on the [[mat]] and looked at the [[bird]].\n\nTASK: Chọn tất cả động từ.\nShe [[likes]] apples and [[eats]] one every day." },
    { id: "match", label: "Ghép cặp", emoji: "🔗", color: "lav",
      rule: "Mỗi nhóm là một câu hỏi, các dòng dạng: vế trái = vế phải. Các nhóm cách nhau 1 dòng trống. Có thể thêm dòng TASK: để ghi yêu cầu. Vế phải sẽ bị xáo trộn.",
      sample: "TASK: Ghép từ với nghĩa.\ndog = con chó\ncat = con mèo\nbird = con chim\nfish = con cá" },
    { id: "order", label: "Sắp xếp thứ tự", emoji: "🔢", color: "lav",
      rule: "Mỗi nhóm là một câu hỏi: viết các mục theo ĐÚNG thứ tự, mỗi mục một dòng (hệ thống sẽ xáo trộn). Các nhóm cách nhau 1 dòng trống. Có thể thêm dòng TASK:.",
      sample: "TASK: Sắp xếp các hoạt động trong ngày.\nWake up\nBrush teeth\nHave breakfast\nGo to school" },
    { id: "sentence", label: "Sắp xếp câu", emoji: "🧱", color: "lav",
      rule: "Mỗi dòng là một câu đúng, các từ hoặc cụm từ ngăn bằng dấu /. Nếu không có dấu / thì tách theo từng từ. Có thể thêm gợi ý tiếng Việt sau dấu |.",
      sample: "She / goes / to school / every day. | Cô ấy đi học mỗi ngày.\nWhat / is / your / name?\nI like playing football on Sundays." },
    { id: "classify", label: "Phân loại", emoji: "🗂️", color: "butter",
      rule: "Mỗi nhóm là một câu hỏi, mỗi dòng dạng: [Tên nhóm] mục 1, mục 2, mục 3. Cần ít nhất 2 nhóm. Các câu cách nhau 1 dòng trống. Có thể thêm dòng TASK:.",
      sample: "TASK: Phân loại các từ.\n[Fruits] apple, banana, orange\n[Animals] dog, cat, horse\n[Colours] red, green, blue" }
  ].concat(L.gx ? L.gx.TYPES : []);
  const TYPE = Object.fromEntries(TYPES.map(t => [t.id, t]));

  /* ---------------------------------------------------------------
     2. PARSER
     --------------------------------------------------------------- */
  const META = {
    topic: /^\s*(?:TOPIC|CHỦ ĐIỂM|CHU DIEM)\s*[:：]\s*(.+?)\s*$/i,
    expl: /^\s*(?:EXP|EXPL|EXPLAIN|GIẢI THÍCH|GIAI THICH)\s*[:：]\s*(.+?)\s*$/i,
    ans: /^\s*(?:ANS|ANSWER|ĐÁP ÁN|DAP AN)\s*[:：]\s*(.+?)\s*$/i,
    task: /^\s*(?:TASK|YÊU CẦU|YEU CAU)\s*[:：]\s*(.+?)\s*$/i,
    bank: /^\s*(?:BANK|KHUNG TỪ|KHUNG TU)\s*[:：]\s*(.+?)\s*$/i,
    img: /^\s*(?:IMG|HÌNH|HINH|PIC)\s*[:：]\s*(.+?)\s*$/i
  };
  const stripNum = s => String(s).replace(/^\s*(?:Câu|Cau|Question|Q)\s*\d*\s*[\.\):：]\s*/i, "").replace(/^\s*\d+\s*[\.\)]\s+/, "").trim();
  const VERDICT = { t: true, true: true, đúng: true, dung: true, đ: true, d: true, yes: true, correct: true, f: false, false: false, sai: false, s: false, no: false, wrong: false };
  const verdict = s => { const k = norm(s); return Object.prototype.hasOwnProperty.call(VERDICT, k) ? VERDICT[k] : undefined; };

  function lines(raw) { return String(raw || "").replace(/\r/g, "").split("\n"); }
  /** tách khối theo dòng trống; nếu không có dòng trống nào: mỗi dòng 1 khối (perLine) hoặc cả đoạn 1 khối (whole) */
  function blocks(raw, fallback) {
    const ls = lines(raw).map(l => l.replace(/\s+$/, ""));
    const text = ls.join("\n").trim();
    if (!text) return [];
    if (!/\n\s*\n/.test(text)) return fallback === "whole" ? [text.split("\n")] : text.split("\n").filter(l => l.trim()).map(l => [l]);
    const out = []; let cur = [];
    ls.forEach(l => { if (!l.trim()) { if (cur.length) out.push(cur); cur = []; } else cur.push(l); });
    if (cur.length) out.push(cur);
    return out;
  }
  function takeMeta(ls, keys) {
    const m = { topic: "", expl: "", ans: "", task: "", img: "", rest: [] };
    ls.forEach(l => {
      for (const k of keys) { const r = l.match(META[k]); if (r) { m[k] = r[1]; return; } }
      m.rest.push(l);
    });
    return m;
  }

  function parseMCQ(raw, multi) {
    const qs = [], errors = [];
    const optRe = /^\s*(\*)?\s*\(?([A-Ha-h])[\.\)]\s+(.*\S)\s*$/;
    let cur = null, pend = "";
    const flush = () => { if (cur) { qs.push(cur); cur = null; } };
    lines(raw).forEach(l => {
      if (!l.trim()) { flush(); return; }
      let m;
      if ((m = l.match(META.img))) { if (cur) cur.img = m[1]; else pend = m[1]; return; }
      if ((m = l.match(META.topic))) { (cur || qs[qs.length - 1] || {}).topic = m[1]; return; }
      if ((m = l.match(META.expl))) { (cur || qs[qs.length - 1] || {}).expl = m[1]; return; }
      if ((m = l.match(META.ans))) { const t = cur || qs[qs.length - 1]; if (t) t.ansLetters = m[1].toUpperCase().replace(/[^A-H]/g, "").split(""); return; }
      if ((m = l.match(optRe))) {
        if (!cur) { errors.push("Có đáp án nhưng chưa thấy câu hỏi: " + l.trim().slice(0, 40)); return; }
        cur.opts.push({ t: m[3].replace(/\s*\*\s*$/, ""), ok: !!m[1] || /\*\s*$/.test(m[3]), letter: m[2].toUpperCase() });
        return;
      }
      if (cur && cur.opts.length) flush();
      if (!cur) { cur = { type: multi ? "mcqN" : "mcq1", stem: "", opts: [] }; if (pend) { cur.img = pend; pend = ""; } }
      cur.stem += (cur.stem ? "\n" : "") + (cur.stem ? l.trim() : stripNum(l));
    });
    flush();
    return {
      questions: qs.filter((q, i) => {
        const tag = "Câu " + (i + 1) + ": ";
        if (q.ansLetters) q.opts.forEach(o => { if (q.ansLetters.includes(o.letter)) o.ok = true; });
        if (q.opts.length < 2) { errors.push(tag + "cần ít nhất 2 đáp án"); return false; }
        const nOk = q.opts.filter(o => o.ok).length;
        if (!nOk) { errors.push(tag + "chưa đánh dấu đáp án đúng (dùng dấu * ở đầu dòng)"); return false; }
        if (!multi && nOk > 1) errors.push(tag + "có " + nOk + " đáp án đúng nhưng dạng này chỉ chấp nhận 1; hãy dùng dạng 'nhiều đáp án'");
        if (!q.stem) { errors.push(tag + "thiếu nội dung câu hỏi"); return false; }
        return true;
      }), errors
    };
  }

  function parseTF(raw) {
    const questions = [], errors = []; let pend = "";
    lines(raw).filter(l => l.trim()).forEach((l, i) => {
      let mi; if ((mi = l.match(META.img))) { pend = mi[1]; return; }
      const p = l.split("|").map(s => s.trim());
      const v = p.length > 1 ? verdict(p[1]) : undefined;
      if (v === undefined) { errors.push("Dòng " + (i + 1) + ": thiếu | T hoặc | F ở cuối nhận định"); pend = ""; return; }
      const q = { type: "tf", stem: stripNum(p[0]), answer: v, expl: p[2] || "", topic: p[3] || "" }; if (pend) { q.img = pend; pend = ""; } questions.push(q);
    });
    return { questions, errors };
  }

  function parseTF4(raw) {
    const questions = [], errors = [];
    const subRe = /^\s*\(?([a-hA-H])[\.\)]\s+(.+?)\s*\|\s*(\S+)\s*$/;
    blocks(raw, "whole").forEach((b, i) => {
      const m = takeMeta(b, ["topic", "expl", "img"]);
      const q = { type: "tf4", stem: "", subs: [], topic: m.topic, expl: m.expl }; if (m.img) q.img = m.img;
      m.rest.forEach(l => {
        const r = l.match(subRe);
        if (r) { const v = verdict(r[3]); if (v === undefined) errors.push("Câu " + (i + 1) + ": ý " + r[1] + " cần | T hoặc | F"); else q.subs.push({ t: r[2], answer: v }); }
        else if (!q.subs.length) q.stem += (q.stem ? "\n" : "") + (q.stem ? l.trim() : stripNum(l));
        else errors.push("Câu " + (i + 1) + ": dòng không đúng định dạng ý a) b): " + l.trim().slice(0, 40));
      });
      if (q.subs.length < 2) errors.push("Câu " + (i + 1) + ": cần ít nhất 2 ý a) b)"); else questions.push(q);
    });
    return { questions, errors };
  }

  const BLANK = /\[\[(.+?)\]\](?:\{([^}]*)\})?/g;
  /** như blocks(raw,"perLine") nhưng dòng EXP:/TOPIC: đứng riêng ngay sau một dòng sẽ đi kèm dòng đó (trước đây bị bỏ mất) */
  function fillBlocks(raw) {
    const out = [];
    blocks(raw, "perLine").forEach(b => {
      if (out.length && b.length === 1 && (META.expl.test(b[0]) || META.topic.test(b[0]))) out[out.length - 1] = out[out.length - 1].concat(b);
      else out.push(b);
    });
    return out;
  }
  function parseFill(raw, type) {
    const questions = [], errors = []; let bank = null, pend = "";
    fillBlocks(raw).forEach((b, i) => {
      const m = takeMeta(b, ["topic", "expl", "bank", "img"]);
      if (m.bank) { bank = (bank || []).concat(m.bank.split(/[,;]/).map(s => s.trim()).filter(Boolean)); }
      if (!m.rest.length) { if (m.img) pend = m.img; return; }
      const imgV = m.img || pend; pend = "";
      const text = m.rest.map((l, k) => k ? l : stripNum(l)).join("\n");
      const parts = []; let last = 0, r; BLANK.lastIndex = 0;
      const tag = "Câu " + (questions.length + 1) + ": ";
      let bad = false;
      while ((r = BLANK.exec(text))) {
        if (r.index > last) parts.push({ k: "t", s: text.slice(last, r.index) });
        const c = r[1];
        if (c.includes("|")) {
          const opts = c.split("|").map(s => s.trim()).filter(Boolean);
          const good = opts.filter(s => s.startsWith("*"));
          if (good.length !== 1) { errors.push(tag + "danh sách chọn cần đúng 1 lựa chọn đánh dấu *: [[" + c + "]]"); bad = true; }
          const clean = opts.map(s => s.replace(/^\*\s*/, ""));
          parts.push({ k: "b", choose: true, opts: clean, answers: good.length ? [good[0].replace(/^\*\s*/, "")] : [], hint: r[2] || "" });
        } else {
          const answers = c.split("/").map(s => s.trim()).filter(Boolean);
          if (!answers.length) { errors.push(tag + "chỗ trống rỗng"); bad = true; }
          parts.push({ k: "b", answers, hint: r[2] || "" });
        }
        last = r.index + r[0].length;
      }
      if (last < text.length) parts.push({ k: "t", s: text.slice(last) });
      if (!parts.some(p => p.k === "b")) { errors.push(tag + "chưa có chỗ trống [[đáp án]]: " + text.slice(0, 40)); return; }
      if (bad) return;
      const fq = { type, parts, topic: m.topic, expl: m.expl }; if (imgV) fq.img = imgV; questions.push(fq);
    });
    if (type === "fillchoose" && questions.length && !questions.some(q => q.parts.some(p => p.choose))) errors.push("Dạng 'chọn trong danh sách' cần chỗ trống dạng [[*đúng|sai|sai]]");
    return { questions, errors, bank };
  }

  function parseShort(raw) {
    const questions = [], errors = []; let pend = "";
    lines(raw).filter(l => l.trim()).forEach((l, i) => {
      let mi; if ((mi = l.match(META.img))) { pend = mi[1]; return; }
      const k = l.indexOf("=>");
      if (k < 0) { errors.push("Dòng " + (i + 1) + ": thiếu dấu => giữa câu hỏi và đáp án"); pend = ""; return; }
      const answers = l.slice(k + 2).split("/").map(s => s.trim()).filter(Boolean);
      if (!answers.length) { errors.push("Dòng " + (i + 1) + ": chưa có đáp án"); pend = ""; return; }
      const sq = { type: "short", stem: stripNum(l.slice(0, k)), answers }; if (pend) { sq.img = pend; pend = ""; } questions.push(sq);
    });
    return { questions, errors };
  }

  function parseWordpick(raw) {
    const questions = [], errors = [];
    blocks(raw, "perLine").forEach((b, i) => {
      const m = takeMeta(b, ["topic", "expl", "task", "img"]);
      const text = m.rest.join("\n"); if (!text.trim()) return;
      const toks = []; const re = /\[\[(.+?)\]\]|([A-Za-zÀ-ỹ0-9'’\-]+)|(\s+)|([^\sA-Za-zÀ-ỹ0-9'’\-])/g; let r;
      while ((r = re.exec(text))) {
        if (r[1] !== undefined) r[1].split(/(\s+)/).forEach(w => { if (/\S/.test(w)) toks.push({ w, ok: true, pick: true }); else if (w) toks.push({ w, pick: false }); });
        else if (r[2] !== undefined) toks.push({ w: r[2], ok: false, pick: true });
        else toks.push({ w: r[0], pick: false });
      }
      if (!toks.some(t => t.ok)) { errors.push("Đoạn " + (questions.length + 1) + ": chưa có từ cần chọn [[từ]]"); return; }
      const wq = { type: "wordpick", stem: m.task ? stripNum(m.task) : "", toks, topic: m.topic, expl: m.expl }; if (m.img) wq.img = m.img; questions.push(wq);
    });
    return { questions, errors };
  }

  function parseMatch(raw) {
    const questions = [], errors = [];
    blocks(raw, "whole").forEach((b, i) => {
      const m = takeMeta(b, ["topic", "expl", "task"]); // không dùng IMG: ở đây vì vế trái có thể là "img:tên"
      const pairs = [];
      m.rest.forEach(l => { const r = l.match(/^\s*(.+?)\s*(?:=>|->|=|\|)\s*(.+?)\s*$/); if (r) pairs.push({ l: r[1], r: r[2] }); else errors.push("Nhóm " + (i + 1) + ": dòng không có dấu = : " + l.trim().slice(0, 40)); });
      if (pairs.length < 2) { errors.push("Nhóm " + (i + 1) + ": cần ít nhất 2 cặp"); return; }
      const mq = { type: "match", stem: m.task, pairs, topic: m.topic, expl: m.expl }; if (m.img) mq.img = m.img; questions.push(mq);
    });
    return { questions, errors };
  }

  function parseOrder(raw) {
    const questions = [], errors = [];
    blocks(raw, "whole").forEach((b, i) => {
      const m = takeMeta(b, ["topic", "expl", "task", "img"]);
      const items = m.rest.map(l => l.replace(/^\s*\d+\s*[\.\)]\s+/, "").trim()).filter(Boolean);
      if (items.length < 2) { errors.push("Nhóm " + (i + 1) + ": cần ít nhất 2 mục"); return; }
      const oq = { type: "order", stem: m.task, items, topic: m.topic, expl: m.expl }; if (m.img) oq.img = m.img; questions.push(oq);
    });
    return { questions, errors };
  }

  function parseSentence(raw) {
    const questions = [], errors = []; let pend = "";
    lines(raw).filter(l => l.trim()).forEach((l, i) => {
      let mi; if ((mi = l.match(META.img))) { pend = mi[1]; return; }
      if ((mi = l.match(META.expl))) { if (questions.length) questions[questions.length - 1].expl = mi[1]; return; }
      if ((mi = l.match(META.topic))) { if (questions.length) questions[questions.length - 1].topic = mi[1]; return; }
      const p = l.split("|"); const body = stripNum(p[0]); const hint = (p[1] || "").trim();
      const chunks = (body.includes("/") ? body.split("/") : body.split(/\s+/)).map(s => s.trim()).filter(Boolean);
      if (chunks.length < 2) { errors.push("Dòng " + (i + 1) + ": cần ít nhất 2 từ/cụm"); pend = ""; return; }
      const sq = { type: "sentence", chunks, hint }; if (pend) { sq.img = pend; pend = ""; } questions.push(sq);
    });
    return { questions, errors };
  }

  function parseClassify(raw) {
    const questions = [], errors = [];
    blocks(raw, "whole").forEach((b, i) => {
      const m = takeMeta(b, ["topic", "expl", "task", "img"]);
      const cats = [], items = [];
      m.rest.forEach(l => {
        const r = l.match(/^\s*\[(.+?)\]\s*(.+)$/);
        if (!r) { errors.push("Nhóm " + (i + 1) + ": dòng cần dạng [Tên nhóm] mục 1, mục 2: " + l.trim().slice(0, 40)); return; }
        const ci = cats.push(r[1].trim()) - 1;
        r[2].split(r[2].includes(";") ? ";" : ",").map(s => s.trim()).filter(Boolean).forEach(t => items.push({ t, c: ci }));
      });
      if (cats.length < 2 || items.length < 2) { errors.push("Nhóm " + (i + 1) + ": cần ít nhất 2 nhóm và 2 mục"); return; }
      const cq = { type: "classify", stem: m.task, cats, items, topic: m.topic, expl: m.expl }; if (m.img) cq.img = m.img; questions.push(cq);
    });
    return { questions, errors };
  }

  /** parse một phần; trả về {questions, errors, bank} với id ổn định theo thứ tự */
  function parseSection(sec) {
    const raw = sec.raw || "", t = sec.type;
    let r;
    switch (t) {
      case "mcq1": r = parseMCQ(raw, false); break;
      case "mcqN": r = parseMCQ(raw, true); break;
      case "tf": r = parseTF(raw); break;
      case "tf4": r = parseTF4(raw); break;
      case "fill": case "fillhint": case "fillchoose": case "fillbank": r = parseFill(raw, t); break;
      case "short": r = parseShort(raw); break;
      case "wordpick": r = parseWordpick(raw); break;
      case "match": r = parseMatch(raw); break;
      case "order": r = parseOrder(raw); break;
      case "sentence": r = parseSentence(raw); break;
      case "classify": r = parseClassify(raw); break;
      default: r = (L.gx && L.gx.has(t) && L.gx.parse(t, raw)) || { questions: [], errors: ["Dạng bài không hợp lệ: " + t] };
    }
    r.questions.forEach((q, i) => { q.id = (sec.id || "s") + "-" + (i + 1); q.topic = q.topic || sec.topic || ""; });
    if (t === "fillbank") {
      const ans = []; r.questions.forEach(q => q.parts.forEach(p => { if (p.k === "b") ans.push(p.answers[0]); }));
      r.bank = (r.bank || []).slice();
      // đảm bảo mỗi đáp án có mặt đúng số lần cần dùng
      const need = {}; ans.forEach(a => need[norm(a)] = (need[norm(a)] || 0) + 1);
      const have = {}; r.bank.forEach(a => have[norm(a)] = (have[norm(a)] || 0) + 1);
      Object.keys(need).forEach(k => { for (let i = have[k] || 0; i < need[k]; i++) r.bank.push(ans.find(a => norm(a) === k)); });
    }
    return r;
  }

  /* ---------------------------------------------------------------
     3. TRẠNG THÁI, ĐÁP ÁN MẪU, CHẤM ĐIỂM
     --------------------------------------------------------------- */
  const blanksOf = q => q.parts.filter(p => p.k === "b");
  const isFill = q => q.type.startsWith("fill");

  function initState(q) {
    switch (q.type) {
      case "mcq1": return { v: null };
      case "mcqN": return { v: [] };
      case "tf": return { v: null };
      case "tf4": return { v: q.subs.map(() => null) };
      case "fill": case "fillhint": case "fillchoose": case "fillbank": {
        const bs = blanksOf(q);
        return { v: bs.map(() => ""), ord: bs.map(b => b.choose ? shuffle(b.opts.map((_, i) => i)) : null) };
      }
      case "short": return { v: "" };
      case "wordpick": return { v: [] };
      case "match": return { v: q.pairs.map(() => ""), ord: shuffle(q.pairs.map((_, i) => i)) };
      case "order": return { v: [], ord: shuffle(q.items.map((_, i) => i)) };
      case "sentence": return { v: [], ord: shuffle(q.chunks.map((_, i) => i)) };
      case "classify": return { v: q.items.map(() => -1), ord: shuffle(q.items.map((_, i) => i)) };
    }
    if (L.gx && L.gx.hasQ(q.type)) return L.gx.init(q);
  }
  /** trạng thái = đáp án đúng (dùng cho chế độ xem đáp án) */
  function keyState(q) {
    const st = initState(q);
    switch (q.type) {
      case "mcq1": st.v = q.opts.findIndex(o => o.ok); break;
      case "mcqN": st.v = q.opts.map((o, i) => o.ok ? i : -1).filter(i => i >= 0); break;
      case "tf": st.v = q.answer; break;
      case "tf4": st.v = q.subs.map(s => s.answer); break;
      case "fill": case "fillhint": case "fillchoose": case "fillbank": st.v = blanksOf(q).map(b => b.answers[0]); break;
      case "short": st.v = q.answers[0]; break;
      case "wordpick": st.v = q.toks.map((t, i) => t.ok ? i : -1).filter(i => i >= 0); break;
      case "match": st.v = q.pairs.map(p => p.r); break;
      case "order": st.v = q.items.map((_, i) => i); break;
      case "sentence": st.v = q.chunks.map((_, i) => i); break;
      case "classify": st.v = q.items.map(it => it.c); break;
      default: if (L.gx && L.gx.hasQ(q.type)) L.gx.key(q, st);
    }
    return st;
  }

  const sameSet = (a, b) => a.length === b.length && a.every(x => b.includes(x));
  /** trả về {got, max, items:[{ok, label}]} — items dùng cho báo cáo chủ điểm */
  function grade(q, st) {
    const r = gradeCore(q, st);
    if (q.img && r.items && L.imgs) { const t = L.imgs.text(q.img); if (t) r.items.forEach(it => { if (it.label && it.label.indexOf("🖼 ") < 0) it.label += "  🖼 " + t; }); }
    return r;
  }
  function gradeCore(q, st) {
    const v = st.v;
    if (L.gx && L.gx.hasQ(q.type)) return L.gx.grade(q, st);
    const lab = s => String(s).replace(/^\s*img\s*:\s*/i, "🖼 ").replace(/\s+/g, " ").slice(0, 90);
    /* Mỗi ý trả về: ok, label (đề) + ans (em đã chọn/gõ) + key (đáp án đúng) -> dùng cho báo cáo chi tiết của cô */
    const NOPICK = "(chưa chọn)", NOFILL = "(bỏ trống)";
    const optLine = (o, i) => LET[i] + ". " + String(o.t).replace(/\s+/g, " ");
    const picked = idx => idx.slice().sort((a, b) => a - b).filter(i => q.opts[i]).map(i => optLine(q.opts[i], i)).join(" ; ");
    const keyOpts = () => q.opts.map((o, i) => o.ok ? optLine(o, i) : null).filter(Boolean).join(" ; ");
    /* đề chung chung kiểu "Choose the correct answer." (câu ngữ âm, chọn từ...) thì kèm các đáp án để cô biết câu nào */
    const mcqLab = () => { const s = String(q.stem || "").trim(); return (s.length >= 25 && !/^(choose|mark|select)\b[^?]*\b(answer|word|letter)\b/i.test(s)) ? lab(s) : lab(s) + "  [" + q.opts.map(optLine).join("   ") + "]"; };
    const TFT = x => x === true ? "Đúng" : x === false ? "Sai" : NOPICK;
    /* câu có nhiều chỗ trống (bài đọc điền chỗ trống): chỉ lấy đoạn quanh chỗ trống thứ i, các chỗ trống khác điền sẵn đáp án */
    const fillCtx = i => {
      let bi = -1, before = "", after = "", hit = false;
      q.parts.forEach(p => { if (p.k === "t") { if (hit) after += p.s; else before += p.s; } else { bi++; if (bi === i) hit = true; else if (hit) after += p.answers[0]; else before += p.answers[0]; } });
      before = before.replace(/\s+/g, " "); after = after.replace(/\s+/g, " ");
      /* cắt ở ranh giới chữ (không cắt giữa từ); tổng ≤ 90 ký tự để lab() không cắt thêm */
      if (before.length > 46) before = "…" + before.slice(-46).replace(/^\S*\s/, "");
      if (after.length > 32) after = after.slice(0, 32).replace(/\s\S*$/, "") + "…";
      return before + "___" + after;
    };
    switch (q.type) {
      case "mcq1": { const ok = v != null && v >= 0 && !!q.opts[v] && q.opts[v].ok; return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: mcqLab(), ans: v != null && v >= 0 && q.opts[v] ? optLine(q.opts[v], v) : NOPICK, key: keyOpts() }] }; }
      case "mcqN": { const want = q.opts.map((o, i) => o.ok ? i : -1).filter(i => i >= 0); const ok = sameSet(v || [], want); return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: mcqLab(), ans: (v || []).length ? picked(v) : NOPICK, key: keyOpts() }] }; }
      case "tf": { const ok = v === q.answer; return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: lab(q.stem), ans: TFT(v), key: TFT(q.answer) }] }; }
      case "tf4": { const items = q.subs.map((s, i) => ({ ok: v[i] === s.answer, label: lab(s.t), ans: TFT(v[i]), key: TFT(s.answer) })); return { got: items.filter(x => x.ok).length, max: items.length, items }; }
      case "fill": case "fillhint": case "fillchoose": case "fillbank": {
        const bs = blanksOf(q);
        const items = bs.map((b, i) => ({ ok: !!v[i] && b.answers.some(a => norm(a) === norm(v[i])), label: lab(bs.length > 1 ? fillCtx(i) : q.parts.map(p => p.k === "t" ? p.s : "___").join("")) + " → " + b.answers[0], ans: v[i] ? String(v[i]) : NOFILL, key: b.answers.join(" / ") }));
        return { got: items.filter(x => x.ok).length, max: items.length, items };
      }
      case "short": { const ok = !!v && q.answers.some(a => norm(a) === norm(v)); return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: lab(q.stem), ans: v ? String(v) : NOFILL, key: q.answers.join(" / ") }] }; }
      case "wordpick": {
        const want = q.toks.map((t, i) => t.ok ? i : -1).filter(i => i >= 0);
        const right = (v || []).filter(i => want.includes(i)).length, wrong = (v || []).length - right;
        const items = want.map(i => ({ ok: (v || []).includes(i), label: q.toks[i].w, ans: (v || []).includes(i) ? q.toks[i].w : "(không chọn)", key: q.toks[i].w }));
        (v || []).filter(i => !want.includes(i)).forEach(i => items.push({ ok: false, label: "chọn nhầm: " + q.toks[i].w, ans: q.toks[i].w, key: "(không phải đáp án)" }));
        return { got: Math.max(0, right - wrong), max: want.length, items };
      }
      case "match": { const items = q.pairs.map((p, i) => ({ ok: !!v[i] && norm(v[i]) === norm(p.r), label: lab(p.l) + " = " + p.r, ans: v[i] ? String(v[i]) : "(chưa ghép)", key: p.r })); return { got: items.filter(x => x.ok).length, max: items.length, items }; }
      case "order": { const items = q.items.map((t, i) => ({ ok: v[i] === i, label: lab(t), ans: v[i] != null && q.items[v[i]] != null ? q.items[v[i]] : "(trống)", key: t })); return { got: items.filter(x => x.ok).length, max: items.length, items }; }
      case "sentence": { const ok = v.length === q.chunks.length && norm(v.map(i => q.chunks[i]).join(" ")) === norm(q.chunks.join(" ")); return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: lab(q.chunks.join(" ")), ans: v.length ? v.map(i => q.chunks[i]).join(" ") : "(chưa sắp xếp)", key: q.chunks.join(" ") }] }; }
      case "classify": { const items = q.items.map((it, i) => ({ ok: v[i] === it.c, label: lab(it.t) + " → " + q.cats[it.c], ans: v[i] >= 0 && q.cats[v[i]] != null ? q.cats[v[i]] : NOPICK, key: q.cats[it.c] })); return { got: items.filter(x => x.ok).length, max: items.length, items }; }
    }
    return { got: 0, max: 0, items: [] };
  }

  /* ---------------------------------------------------------------
     4. GIAO DIỆN TỪNG DẠNG
     ctx = {mode:'do'|'review', showAns:boolean, redraw(), sec, secSt}
     --------------------------------------------------------------- */
  const LET = "ABCDEFGH";
  /** chữ gạch chân từ file Word: <u>x</u> -> thẻ u (không dùng innerHTML) */
  const rich = t => { const s = String(t == null ? "" : t); if (s.indexOf("<u>") < 0 && s.indexOf("**") < 0) return s; const out = []; s.split(/(<u>.*?<\/u>|\*\*[^*\n]+?\*\*)/g).forEach(x => { let m; if ((m = x.match(/^<u>(.*)<\/u>$/))) out.push(h("u", m[1])); else if ((m = x.match(/^\*\*([^*\n]+?)\*\*$/))) out.push(h("b", m[1])); else if (x) out.push(x); }); return out; };

  L.rich = rich;
  function view(q, st, ctx, no) {
    const review = ctx.mode === "review";
    const g = review ? grade(q, st) : null;
    const cls = review ? (g.got === g.max ? "right" : g.got > 0 ? "partial" : "wrong") : "";
    const body = (VIEW[q.type] || L.gx.VIEW[q.type])(q, st, ctx, g, no);
    return h("div.q" + (cls ? "." + cls : ""),
      isFill(q) ? null : h("div.stem", h("span.qn", "Câu " + no + ". "), q.stem ? rich(q.stem) : null, ["mcq1", "mcqN", "tf", "short"].includes(q.type) ? spkMini(q.stem, ctx) : null),
      q.img ? L.imgs.node(q.img) : null,
      body,
      review && ctx.showAns && q.expl ? h("div.expl", "💡 " + q.expl) : null);
  }

  const isEn = t => /[A-Za-z]/.test(t || "") && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t || "");
  const spkMini = (t0, ctx) => { const t = String(t0 == null ? "" : t0).replace(/<\/?u>/g, ""); return !(ctx && ctx.sec && ctx.sec.speak) || !isEn(t) || String(t).length > 120 || !(L.gx && L.gx.speak) ? null : h("span.ospk", { role: "button", title: "Nghe", onclick: ev => { ev.stopPropagation(); L.gx.speak(String(t).replace(/^\s*img\s*:.*/i, "")); } }, "🔊"); };
  function tfLabels(ctx) { return ctx.sec && ctx.sec.tfLabels === "vi" ? ["Đúng", "Sai"] : ["True", "False"]; }

  const VIEW = {
    mcq1(q, st, ctx) { return mcqView(q, st, ctx, false); },
    mcqN(q, st, ctx) { return mcqView(q, st, ctx, true); },
    tf(q, st, ctx) {
      const lb = tfLabels(ctx), review = ctx.mode === "review";
      return h("div.tfrow", [true, false].map((val, i) => {
        let c = "opt"; const sel = st.v === val;
        if (sel) c += " sel";
        if (review) { if (sel) c += val === q.answer ? " k-right" : " k-wrong"; else if (val === q.answer && ctx.showAns) c += " k-miss"; }
        return h("button." + c.split(" ").join("."), { onclick: () => { if (review) return; st.v = val; ctx.redraw(); } }, lb[i]);
      }));
    },
    tf4(q, st, ctx) {
      const lb = tfLabels(ctx), review = ctx.mode === "review";
      return h("div", q.subs.map((s, si) => h("div.sub", h("span.qn", "abcdefgh"[si] + ")"), h("div.t", s.t),
        h("div.tfrow", [true, false].map((val, i) => {
          let c = "opt"; const sel = st.v[si] === val;
          if (sel) c += " sel";
          if (review) { if (sel) c += val === s.answer ? " k-right" : " k-wrong"; else if (val === s.answer && ctx.showAns) c += " k-miss"; }
          return h("button." + c.split(" ").join("."), { style: "min-width:72px;min-height:38px;padding:5px 10px", onclick: () => { if (review) return; st.v[si] = val; ctx.redraw(); } }, lb[i]);
        })))));
    },
    fill(q, st, ctx, g, no) { return fillView(q, st, ctx, g, no); },
    fillhint(q, st, ctx, g, no) { return fillView(q, st, ctx, g, no); },
    fillchoose(q, st, ctx, g, no) { return fillView(q, st, ctx, g, no); },
    fillbank(q, st, ctx, g, no) { return fillView(q, st, ctx, g, no); },
    short(q, st, ctx, g) {
      const review = ctx.mode === "review";
      const inp = h("input.blank" + (review ? (g.items[0].ok ? ".k-right" : ".k-wrong") : ""), { type: "text", style: "width:100%;max-width:420px;text-align:left", value: st.v, autocomplete: "off", autocapitalize: "none", spellcheck: "false", placeholder: st.hnt || "Nhập câu trả lời…", disabled: review, oninput: e => { st.v = e.target.value; } });
      return h("div", inp, review && ctx.showAns && !g.items[0].ok ? h("div.fb.bad", "Đáp án: ", h("span.ans", q.answers.join(" / "))) : null);
    },
    wordpick(q, st, ctx, g) {
      const review = ctx.mode === "review";
      const want = q.toks.map((t, i) => t.ok ? i : -1).filter(i => i >= 0);
      return h("div",
        h("div", { style: "font-size:18px;line-height:2;white-space:pre-wrap" }, q.toks.map((t, i) => {
          if (!t.pick) return document.createTextNode(t.w);
          const sel = (st.v || []).includes(i);
          let c = "tok"; if (sel) c += " sel";
          if (review) { c = "tok"; if (sel) c += t.ok ? " k-right" : " k-wrong"; else if (t.ok && ctx.showAns) c += " k-miss"; }
          return h("span." + c.split(" ").join("."), { onclick: () => { if (review) return; st.v = sel ? st.v.filter(x => x !== i) : st.v.concat(i); ctx.redraw(); } }, t.w);
        })));
    },
    match(q, st, ctx, g) {
      const review = ctx.mode === "review";
      const rights = st.ord.map(i => q.pairs[i].r);
      return h("div",
        q.pairs.map((p, i) => {
          const ok = review ? g.items[i].ok : null;
          const sel = h("select.blank" + (review ? (ok ? ".k-right" : ".k-wrong") : ""), { style: "width:100%", disabled: review, onchange: e => { st.v[i] = e.target.value; } },
            h("option", { value: "" }, "— chọn —"), rights.map(r => h("option", { value: r, selected: st.v[i] === r }, r)));
          const lm = String(p.l).match(/^\s*img\s*:\s*(.+)$/i), pic = lm ? L.imgs.node(lm[1]) : null;
          return h("div.pairrow", pic ? h("div.lft", pic) : h("div.lft", p.l, spkMini(p.l, ctx)), h("div", { style: "flex:1.2" }, sel, review && ctx.showAns && !ok ? h("div.small", { style: "color:var(--good);font-weight:800" }, "→ " + p.r) : null));
        }));
    },
    order(q, st, ctx, g) { return seqView(q, st, ctx, g, q.items, "order"); },
    sentence(q, st, ctx, g) { return seqView(q, st, ctx, g, q.chunks, "sentence"); },
    classify(q, st, ctx, g) {
      if (!(ctx.sec && ctx.sec.clsMode === "choose") && L.gx && L.gx.classifyDrag) return L.gx.classifyDrag(q, st, ctx, g);
      const review = ctx.mode === "review";
      return h("div",
        st.ord.map(i => {
          const it = q.items[i];
          const ok = review ? g.items[i].ok : null;
          return h("div.clsrow", h("div.w", it.t, review && ctx.showAns && !ok ? h("span.small", { style: "color:var(--good);margin-left:8px" }, "→ " + q.cats[it.c]) : null),
            h("div.row", { style: "gap:6px" }, q.cats.map((c, ci) => {
              let k = "chip"; const sel = st.v[i] === ci;
              if (review) { if (sel) k += ok ? " k-right" : " k-wrong"; } else if (sel) k += " pick";
              return h("button." + k.split(" ").join("."), { onclick: () => { if (review) return; st.v[i] = ci; ctx.redraw(); } }, c);
            })));
        }));
    }
  };

  function mcqView(q, st, ctx, multi) {
    const review = ctx.mode === "review";
    return h("div", q.opts.map((o, i) => {
      const sel = multi ? (st.v || []).includes(i) : st.v === i;
      let c = "opt"; if (sel) c += " sel"; const hid = st.hid && st.hid.includes(i); if (hid) c += " dim";
      if (review) { if (sel) c += o.ok ? " k-right" : " k-wrong"; else if (o.ok && ctx.showAns) c += " k-miss"; }
      return h("button." + c.split(" ").join("."), {
        onclick: () => { if (review || hid) return; if (multi) st.v = sel ? st.v.filter(x => x !== i) : st.v.concat(i); else st.v = i; ctx.redraw(); }
      }, h("span.l", LET[i]), h("span", rich(o.t)), spkMini(o.t, ctx));
    }), multi && !review ? h("div.small.muted", { style: "margin-top:6px" }, "Chọn tất cả đáp án đúng.") : null);
  }

  function seqView(q, st, ctx, g, labels, kind) {
    const review = ctx.mode === "review";
    const placed = h("div.answerline", st.v.map((idx, pos) => {
      let c = "chip pick";
      if (review) c = "chip " + (kind === "order" ? (idx === pos ? "k-right" : "k-wrong") : (g.got ? "k-right" : "k-wrong"));
      return h("button." + c.split(" ").join("."), { onclick: () => { if (review) return; st.v.splice(pos, 1); ctx.redraw(); } }, labels[idx]);
    }));
    const pool = h("div.row", { style: "gap:8px" }, st.ord.map(idx => h("button.chip" + (st.v.includes(idx) ? ".used" : ""), { onclick: () => { if (review || st.v.includes(idx)) return; st.v.push(idx); ctx.redraw(); } }, labels[idx])));
    return h("div",
      q.hint ? h("div.small.muted", { style: "margin-bottom:6px" }, "Gợi ý: " + q.hint) : null,
      placed, review ? null : pool,
      review && ctx.showAns && g.got < g.max ? h("div.fb.bad", "Đáp án: ", h("span.ans", kind === "order" ? q.items.join("  →  ") : q.chunks.join(" "))) : null);
  }

  function fillView(q, st, ctx, g, no) {
    const review = ctx.mode === "review";
    let bi = -1;
    const kids = q.parts.map(p => {
      if (p.k === "t") return document.createTextNode(p.s);
      bi++; const i = bi;
      const ok = review ? g.items[i].ok : null;
      const cls = review ? (ok ? ".k-right" : ".k-wrong") : "";
      let node;
      if (p.choose) {
        node = h("select.blank" + cls, { disabled: review, onchange: e => { st.v[i] = e.target.value; } },
          h("option", { value: "" }, "— chọn —"), st.ord[i].map(oi => h("option", { value: p.opts[oi], selected: st.v[i] === p.opts[oi] }, p.opts[oi])));
      } else if (q.type === "fillbank") {
        const sel = ctx.secSt && ctx.secSt.sel && ctx.secSt.sel.q === q.id && ctx.secSt.sel.i === i;
        node = h("span.blank" + cls + (sel ? ".k-sel" : ""), { style: "cursor:pointer;min-width:84px;display:inline-block" + (sel ? ";background:var(--butter)" : ""), onclick: () => {
          if (review) return;
          if (st.v[i]) { ctx.bankFree && ctx.bankFree(q.id, i); st.v[i] = ""; ctx.redraw(); }
          else { ctx.secSt.sel = { q: q.id, i }; ctx.redraw(); }
        } }, st.v[i] || "     ");
      } else {
        const w = Math.max(96, Math.min(280, (p.answers[0].length * 11) + 36));
        node = h("input.blank" + cls, { type: "text", style: "width:" + w + "px", value: st.v[i], disabled: review, placeholder: (st.hnt && st.hnt[i]) || null, autocomplete: "off", autocapitalize: "none", spellcheck: "false", oninput: e => { st.v[i] = e.target.value; } });
      }
      return h("span.fillbox", p.hint ? h("span.bhint", "(" + p.hint + ")") : null, node,
        review && ctx.showAns && !ok ? h("span.small", { style: "color:var(--good);font-weight:800" }, "→ " + p.answers[0]) : null);
    });
    return h("div.stem", { style: "line-height:2.2" }, h("span.qn", "Câu " + no + ". "), kids);
  }

  /* ---------------------------------------------------------------
     5. PHẦN (SECTION) = media + nội dung chung + danh sách câu
     --------------------------------------------------------------- */
  function mediaNode(m) {
    if (!m) return null;
    const out = [];
    if (m.img) out.push(h("img", { src: m.img, alt: "" }));
    if (m.audio) out.push(h("audio", { controls: true, src: m.audio, preload: "none" }));
    const yt = m.yt && (m.yt.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/) || [])[1];
    if (yt) out.push(h("div.yt", h("iframe", { src: "https://www.youtube.com/embed/" + yt, allowfullscreen: true, loading: "lazy" })));
    return out.length ? h("div.media", out) : null;
  }

  /** secRt = {sec, parsed, sts:{qid:state}, secSt:{sel}, order:[qid...]} */
  function buildRuntime(sec, opts) {
    const parsed = parseSection(sec);
    const rt = { sec, parsed, sts: {}, secSt: { sel: null }, qs: parsed.questions.slice() };
    const keep = opts && opts.keepOrder;
    if ((sec.shuffleQ || (opts && opts.shuffleQ)) && !keep) rt.qs = shuffle(rt.qs);
    /* xáo thứ tự đáp án A-B-C-D (chữ cái tự đánh lại theo vị trí mới) */
    if (opts && opts.shuffleOpts && !keep) rt.qs.forEach(q => { if ((q.type === "mcq1" || q.type === "mcqN") && q.opts) q.opts = shuffle(q.opts); });
    rt.qs.forEach(q => rt.sts[q.id] = initState(q));
    if (sec.type === "fillbank") rt.bank = shuffle((parsed.bank || []).map((w, i) => ({ w, i })));
    return rt;
  }
  function keyRuntime(sec) {
    const rt = buildRuntime(sec, { keepOrder: true });
    rt.qs.forEach(q => { rt.sts[q.id] = Object.assign(rt.sts[q.id], keyState(q)); });
    return rt;
  }

  /** vẽ một phần. mode: do|review */
  function renderSection(rt, mode, showAns, startNo, onChange, opts) {
    const wrap = h("div");
    const draw = () => {
      wrap.innerHTML = "";
      const sec = rt.sec;
      const usedBank = {};
      if (rt.bank) rt.qs.forEach(q => rt.sts[q.id].v.forEach(w => { if (w) usedBank[w] = (usedBank[w] || 0) + 1; }));
      const ctx = {
        mode, showAns, sec, secSt: rt.secSt,
        redraw: () => { draw(); onChange && onChange(); },
        bankFree: () => { }
      };
      if (rt.bank && (mode === "do")) {
        const left = Object.assign({}, usedBank);
        wrap.appendChild(h("div.bank", rt.bank.map(b => {
          const k = b.w; const isUsed = left[k] > 0; if (isUsed) left[k]--;
          return h("button.chip" + (isUsed ? ".used" : ""), { onclick: () => {
            let target = null;
            if (rt.secSt.sel) { const q = rt.qs.find(x => x.id === rt.secSt.sel.q); if (q && !rt.sts[q.id].v[rt.secSt.sel.i]) target = { q, i: rt.secSt.sel.i }; }
            if (!target) for (const q of rt.qs) { const i = rt.sts[q.id].v.findIndex(x => !x); if (i >= 0) { target = { q, i }; break; } }
            if (!target) return;
            rt.sts[target.q.id].v[target.i] = k; rt.secSt.sel = null; ctx.redraw();
          } }, k);
        })));
      }
      rt.qs.forEach((q, i) => wrap.appendChild(opts && opts.card ? opts.card(q, rt.sts[q.id], ctx, startNo + i, rt) : view(q, rt.sts[q.id], ctx, startNo + i)));
    };
    draw();
    return wrap;
  }

  /** all = danh sách các phần của bài: phần không có đoạn văn riêng sẽ có nút "Xem lại đoạn văn" của phần trước (nếu phần trước có đoạn văn dài) */
  function sectionHeader(sec, idx, all) {
    let pass = null;
    if (all && !sec.desc && /passage|text|đoạn|bài đọc|read|again|lại/i.test(sec.title || "")) for (let k = idx - 1; k >= 0; k--) { if (all[k] && all[k].desc && String(all[k].desc).length >= 120) { pass = all[k]; break; } }
    return [
      h("div.sec-title", h("span.no", String(idx + 1)), h("h3", sec.title || ("Phần " + (idx + 1))), h("span.pill", (TYPE[sec.type] || {}).label || sec.type)),
      pass ? h("div.row", { style: "margin:4px 0 10px" }, h("button.btn.sm.sky", { type: "button", onclick: () => L.modal(close => h("div",
        h("h3", { style: "margin:0 0 10px" }, "📖 " + (pass.title || "Đoạn văn")), mediaNode(pass.media), h("div.shared", rich(pass.desc)),
        h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn", { type: "button", onclick: close }, "Đóng"))), { wide: true }) }, "📖 Xem lại đoạn văn")) : null,
      sec.desc ? h("div.shared", rich(sec.desc)) : null,
      mediaNode(sec.media)
    ];
  }

  /** Thẻ của một phần. Bài đọc hiểu (có đoạn văn dài + câu trắc nghiệm/đúng sai/trả lời ngắn): đoạn văn được GHIM
      cạnh các câu hỏi (2 cột trên màn hình rộng, dính ở đầu trang trên điện thoại, có nút thu gọn) để học sinh không phải kéo lên kéo xuống.
      Các phần khác giữ nguyên như cũ. body = các node câu hỏi (vd. renderSection(...)). */
  const SPLIT_TYPES = { mcq1: 1, mcqN: 1, tf: 1, tf4: 1, short: 1, match: 1, fill: 1, fillhint: 1, fillchoose: 1, fillbank: 1, wordpick: 1 };
  const SPLIT_MIN = 160;   // đoạn văn từ ngần này ký tự trở lên mới ghim
  function sectionCard(sec, idx, all, ...body) {
    const head = sectionHeader(sec, idx, all);   // [tiêu đề, nút "xem lại đoạn văn", nội dung chung, media]
    const len = String(sec.desc || "").replace(/\s+/g, " ").length;
    if (!SPLIT_TYPES[sec.type] || len < SPLIT_MIN || !head[2]) return h("div.card.sec", head, body);
    const toggle = h("button.pass-toggle", { type: "button", onclick: e => {
      const col = e.currentTarget.closest(".pass-col"); col.classList.toggle("min");
      e.currentTarget.textContent = col.classList.contains("min") ? "▼ Mở đoạn văn" : "▲ Thu gọn";
    } }, "▲ Thu gọn");
    return h("div.card.sec.split", head[0],
      h("div.split-body", h("aside.pass-col", toggle, head[2], head[3]), h("div.q-col", head[1], body)));
  }

  /** chấm cả bài: rts = [runtime]; trả {got,max,secs:[{title,got,max}], items:[{qid,topic,ok,q}]} */
  function gradeAll(rts) {
    let got = 0, max = 0, no = 1; const items = [], secs = [];
    rts.forEach(rt => {
      let sg = 0, sm = 0;
      if (rt.sec.numFresh) no = 1;                    // đánh số câu giống lúc học sinh làm bài
      rt.qs.forEach((q, qi) => {
        const r = grade(q, rt.sts[q.id]);
        sg += r.got; sm += r.max;
        r.items.forEach((it, k) => items.push({
          qid: q.id + "#" + (k + 1), topic: q.topic || rt.sec.topic || "", ok: !!it.ok, q: it.label,
          sec: rt.sec.title || "", no: String(no + qi) + (r.items.length > 1 ? "." + (k + 1) : ""),   // phần nào, câu số mấy (câu nhiều ý: 5.1, 5.2…)
          ans: it.ans == null ? "" : String(it.ans), key: it.key == null ? "" : String(it.key)       // em chọn gì / đáp án đúng
        }));
      });
      no += rt.qs.length;
      got += sg; max += sm; secs.push({ title: rt.sec.title, got: sg, max: sm });
    });
    return { got, max, secs, items };
  }

  /** đếm số ý (điểm tối đa) của một phần, dùng cho meta */
  function countItems(sec) {
    const p = parseSection(sec);
    return p.questions.reduce((a, q) => a + grade(q, keyState(q)).max, 0);
  }

  /* ---------------------------------------------------------------
     6. PROMPT GỬI AI KHÁC (để AI trả đúng cú pháp)
     --------------------------------------------------------------- */
  function aiPrompt(typeId, o) {
    const t = TYPE[typeId]; o = o || {};
    return [
      "Bạn là giáo viên tiếng Anh giàu kinh nghiệm. Hãy soạn " + (o.n || 10) + " câu bài tập dạng \"" + t.label + "\"" +
      (o.topic ? " về chủ điểm: " + o.topic : "") + (o.level ? ", trình độ: " + o.level : "") + ".",
      o.extra ? "Yêu cầu thêm: " + o.extra : "",
      "",
      "QUY TẮC ĐỊNH DẠNG (bắt buộc làm đúng, vì kết quả sẽ được dán thẳng vào hệ thống):",
      t.rule,
      "Chỉ trả về nội dung bài tập dạng văn bản thuần, KHÔNG dùng markdown (không **, không #, không bảng, không khung code), KHÔNG đánh số câu, KHÔNG thêm lời dẫn hay lời giải thích ngoài các dòng EXP: / TOPIC: như mẫu.",
      "Nội dung câu hỏi viết bằng tiếng Anh; phần giải thích (EXP:) viết bằng tiếng Việt, ngắn gọn.",
      "",
      "MẪU ĐỊNH DẠNG:",
      t.sample
    ].filter((x, i) => x !== "" || i > 1).join("\n");
  }

  L.hw = { TYPES, TYPE, parseSection, initState, keyState, grade, view, buildRuntime, keyRuntime, renderSection, sectionHeader, sectionCard, mediaNode, gradeAll, countItems, aiPrompt };
})(window.LSE);
