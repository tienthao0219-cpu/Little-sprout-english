/* Các dạng bài kiểu trò chơi: Nghe chọn từ, Nhìn nghĩa chọn từ, Xếp chữ cái, Lật thẻ, Tìm từ, Ô chữ, Thám tử bắt lỗi.
   Nối vào engine.js qua L.gx (parse / init / key / grade / VIEW). */
window.LSE = window.LSE || {};
(function (L) {
  const { h, norm, shuffle } = L;

  /* ---------- tiện ích ---------- */
  const RE = {
    topic: /^\s*(?:TOPIC|CHỦ ĐIỂM|CHU DIEM)\s*[:：]\s*(.+?)\s*$/i,
    expl: /^\s*(?:EXP|EXPL|EXPLAIN|GIẢI THÍCH|GIAI THICH)\s*[:：]\s*(.+?)\s*$/i,
    task: /^\s*(?:TASK|YÊU CẦU|YEU CAU)\s*[:：]\s*(.+?)\s*$/i,
    img: /^\s*(?:IMG|HÌNH|HINH|PIC)\s*[:：]\s*(.+?)\s*$/i,
    audio: /^\s*(?:AUDIO|MP3|ÂM THANH|AM THANH)\s*[:：]\s*(.+?)\s*$/i,
    level: /^\s*(?:LEVEL|CẤP ĐỘ|CAP DO|MỨC|MUC)\s*[:：]\s*(.+?)\s*$/i
  };
  const levelOf = s => { const k = L.plain(s); return /^(3|hard|kho|nang cao)/.test(k) ? "hard" : /^(2|medium|vua|trung binh)/.test(k) ? "medium" : "easy"; };
  const lines = raw => String(raw || "").replace(/\r/g, "").split("\n");
  const stripNum = s => String(s).replace(/^\s*(?:Câu|Cau|Question|Q)\s*\d*\s*[\.\):：]\s*/i, "").replace(/^\s*\d+\s*[\.\)]\s+/, "").trim();
  function blocks(raw) {
    const out = []; let cur = [];
    lines(raw).forEach(l => { if (!l.trim()) { if (cur.length) out.push(cur); cur = []; } else cur.push(l); });
    if (cur.length) out.push(cur);
    return out;
  }
  function hashSeed(s) { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const letters = s => String(s).toUpperCase().replace(/[^A-Z]/g, "");
  const cls = c => c.split(" ").filter(Boolean).join(".");

  let lastUtter = null;
  function speak(text, audio) {
    try {
      if (audio) { const a = new Audio(audio); a.play().catch(() => L.toast("Không phát được file âm thanh")); return; }
      if (!window.speechSynthesis) { L.toast("Thiết bị này chưa hỗ trợ đọc từ"); return; }
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text); u.lang = "en-US"; u.rate = 0.85;
      const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
      const v = vs.find(x => /en-US/i.test(x.lang)) || vs[0]; if (v) u.voice = v;
      lastUtter = u; speechSynthesis.speak(u);
    } catch (e) { L.toast("Không đọc được từ này"); }
  }
  const speakBtn = (text, audio, big) => h("button.speak" + (big ? ".big" : ""), { type: "button", title: "Nghe", onclick: () => speak(text, audio) }, "🔊" + (big ? " Nghe" : ""));

  /** đọc các dòng meta trong 1 khối, trả {rest, topic, expl, task, img, audio} */
  function meta(ls, keys) {
    const m = { rest: [], topic: "", expl: "", task: "", img: "", audio: "", level: "" };
    ls.forEach(l => { for (const k of (keys || ["topic", "expl", "task", "img", "audio", "level"])) { const r = l.match(RE[k]); if (r) { m[k] = r[1]; return; } } m.rest.push(l); });
    return m;
  }

  /* =====================================================================
     TYPES (bổ sung vào danh sách của engine)
     ===================================================================== */
  const TYPES = [
    { id: "listen", label: "Nghe chọn từ", emoji: "🔊", color: "sky",
      rule: "Mỗi dòng: từ cần đọc | các đáp án nhiễu, ngăn bằng dấu phẩy. Từ đầu tiên là đáp án đúng (hệ thống tự xáo vị trí). Bỏ phần sau dấu | thì hệ thống tự lấy đáp án nhiễu từ các từ khác trong phần (cần ít nhất 4 dòng). Học sinh bấm nút 🔊 để nghe từ rồi chọn. Muốn dùng file MP3 của cô thay cho giọng đọc máy, thêm dòng AUDIO: đường-dẫn ngay trước dòng đó.",
      sample: "dog | cat, bird, fish\napple | banana, orange, grape\nTOPIC: animals & fruit\nbook | bag, pen, ruler\nrabbit" },
    { id: "meanpick", label: "Nhìn nghĩa chọn từ", emoji: "🎯", color: "sky",
      rule: "Mỗi dòng: gợi ý => đáp án đúng | các đáp án nhiễu (ngăn bằng dấu phẩy). Gợi ý có thể là nghĩa tiếng Việt (con chó => dog) hoặc định nghĩa. Bỏ phần sau dấu | thì hệ thống tự lấy đáp án nhiễu từ các đáp án khác trong phần (cần ít nhất 4 dòng). Thêm dòng IMG: ngay trước dòng để hiện hình.",
      sample: "con chó => dog | cat, bird, fish\ncon mèo => cat\nIMG: 🐰\nWhat is this? => rabbit\ncon cá => fish\nan animal that says meow => cat | dog, cow, hen" },
    { id: "scramble", label: "Xếp chữ cái (Unscramble)", emoji: "🔤", color: "peach",
      rule: "Mỗi dòng một từ (hoặc cụm từ): từ đúng | gợi ý (không bắt buộc, ví dụ nghĩa tiếng Việt). Hệ thống tự xáo các chữ cái; học sinh chạm từng chữ để xếp lại. Thêm dòng IMG: ngay trước dòng để hiện hình.",
      sample: "dog | con chó\nrabbit | con thỏ\nIMG: 🍎\napple\nice cream | kem" },
    { id: "memory", label: "Lật thẻ ghép cặp (Memory)", emoji: "🃏", color: "lav",
      rule: "Cả phần là MỘT bàn thẻ: mỗi dòng một cặp, dạng vế 1 = vế 2 (tối đa 15 cặp, tức 30 thẻ; nên 8–12 cặp). Vế 1 có thể là hình: img:dog = dog hoặc img:🍎 = apple. Học sinh lật từng 2 thẻ để tìm các cặp. Điểm: mỗi cặp được 1 điểm nếu ghép được mà không lật nhầm quá 1 lần (bàn trên 8 cặp: quá 2 lần).",
      sample: "TASK: Lật thẻ, tìm hình và từ giống nhau.\nimg:🐶 = dog\nimg:🐱 = cat\nimg:🐦 = bird\nimg:🐟 = fish\nimg:🐰 = rabbit\nimg:🍎 = apple\nimg:🍌 = banana\nimg:🍇 = grape\nimg:🍓 = strawberry\nimg:🍊 = orange" },
    { id: "wordsearch", label: "Tìm từ trong bảng (Word search)", emoji: "🔎", color: "mint",
      rule: "Mỗi ván là một nhóm dòng, các ván cách nhau 1 dòng trống. Mỗi dòng một từ, hoặc từ | gợi ý nghĩa. Có thể viết nhiều từ trên một dòng, ngăn bằng dấu phẩy. Từ chỉ gồm chữ cái, dài tối đa 14. Bảng tự tạo. Học sinh tự chọn mức chơi: Dễ (từ đọc ngang/dọc, thấy cả từ), Vừa (thêm chéo, chỉ thấy gợi ý nghĩa), Khó (đọc ngược mọi hướng, chỉ thấy chữ đầu + số chữ). Cô đặt mức mặc định bằng dòng LEVEL: dễ / vừa / khó.",
      sample: "TASK: Tìm 5 con vật.\nLEVEL: dễ\ndog | con chó\ncat | con mèo\nbird | con chim\nfish | con cá\nrabbit | con thỏ" },
    { id: "crossword", label: "Ô chữ (Crossword)", emoji: "📰", color: "butter",
      rule: "Mỗi ván là một nhóm dòng, các ván cách nhau 1 dòng trống. Mỗi dòng: đáp án | gợi ý. Hệ thống tự xếp ô chữ (các từ cần có chữ cái chung mới nối được; nên 5–8 từ). Nếu có từ không xếp được, hệ thống sẽ báo.",
      sample: "TASK: Điền ô chữ.\napple | a red or green fruit\nanimal | a dog is an ...\nelephant | a very big grey animal\nlion | king of the jungle\nbanana | a long yellow fruit" },
    { id: "transform", label: "Viết lại câu (đồng nghĩa)", emoji: "✍️", color: "rose",
      rule: "Mỗi dòng: câu gốc | gợi ý bắt đầu (không bắt buộc) => đáp án 1 / đáp án 2 (các cách viết đúng, ngăn bằng dấu /). Học sinh viết lại cả câu sao cho nghĩa không đổi. Hệ thống không phân biệt hoa/thường, bỏ qua dấu câu cuối và coi \"isn't\" = \"is not\", \"I'm\" = \"I am\". Thêm dòng EXP: ngay sau câu để giải thích.",
      sample: "She is taller than her sister. | Her sister => Her sister is shorter than her. / Her sister is not as tall as her.\nEXP: Đổi so sánh hơn sang so sánh không bằng.\nI haven't seen him for two years. | The last time => The last time I saw him was two years ago.\n\"Where do you live?\" he asked me. | He asked me => He asked me where I lived.\nIt is too cold to go out. | It is so cold => It is so cold that we can't go out. / It is so cold that we cannot go out." },
    { id: "errfix", label: "Thám tử bắt lỗi (Error detective)", emoji: "🕵️", color: "rose",
      rule: "Mỗi dòng một câu có đúng 1 lỗi: bọc phần sai trong [[ ]], rồi => phần sửa đúng (nhiều cách sửa chấp nhận thì ngăn bằng dấu /). Ví dụ: She [[go]] to school every day. => goes. Học sinh chạm vào chỗ sai rồi gõ cách sửa; chấm 2 ý (tìm lỗi + sửa lỗi). Thêm dòng EXP: giải thích ngay sau câu (hiện khi xem đáp án).",
      sample: "She [[go]] to school every day. => goes\nEXP: Chủ ngữ số ít (She) thì động từ thêm -es.\nThere [[is]] three cats in the garden. => are\nI [[am have]] a new bike. => have / 've got\nHe didn't [[went]] to school. => go" }
  ];
  const IDS = {};
  TYPES.forEach(t => IDS[t.id] = 1);
  const Q_TYPES = { transform: 1, pick: 1, scramble: 1, memory: 1, wordsearch: 1, crossword: 1, errfix: 1 };

  /* =====================================================================
     PARSE
     ===================================================================== */
  function parsePick(raw, mode) {
    const qs = [], errors = []; let pend = { img: "", audio: "" };
    const entries = [];
    lines(raw).forEach((l, i) => {
      if (!l.trim()) return;
      let m;
      if ((m = l.match(RE.img))) { pend.img = m[1]; return; }
      if ((m = l.match(RE.audio))) { pend.audio = m[1]; return; }
      if ((m = l.match(RE.topic))) { if (entries.length) entries[entries.length - 1].topic = m[1]; return; }
      if ((m = l.match(RE.expl))) { if (entries.length) entries[entries.length - 1].expl = m[1]; return; }
      let prompt = "", rest = l;
      if (mode === "mean") {
        const k = l.indexOf("=>");
        if (k < 0) { errors.push("Dòng " + (i + 1) + ": thiếu dấu => giữa gợi ý và đáp án"); pend = { img: "", audio: "" }; return; }
        prompt = stripNum(l.slice(0, k)); rest = l.slice(k + 2);
      }
      const p = rest.split("|"); const ans = (mode === "listen" ? stripNum(p[0]) : p[0]).trim();
      if (!ans) { errors.push("Dòng " + (i + 1) + ": chưa có đáp án"); pend = { img: "", audio: "" }; return; }
      const wrong = (p[1] || "").split(/[,;]/).map(s => s.trim()).filter(Boolean);
      entries.push({ prompt, ans, wrong, img: pend.img, audio: pend.audio, topic: "", expl: "" }); pend = { img: "", audio: "" };
    });
    const pool = []; entries.forEach(e => { if (!pool.some(x => norm(x) === norm(e.ans))) pool.push(e.ans); });
    entries.forEach((e, n) => {
      const wr = e.wrong.filter(w => norm(w) !== norm(e.ans));
      for (let j = 1; wr.length < 3 && j <= pool.length; j++) { const c = pool[(n + j) % pool.length]; if (norm(c) !== norm(e.ans) && !wr.some(x => norm(x) === norm(c))) wr.push(c); }
      if (wr.length < 1) { errors.push("Dòng '" + e.ans + "': cần ít nhất 1 đáp án nhiễu (thêm sau dấu |, hoặc thêm các dòng khác để hệ thống tự lấy)"); return; }
      const opts = wr.slice(0, 3).map(t => ({ t, ok: false }));
      opts.splice(n % (opts.length + 1), 0, { t: e.ans, ok: true });
      const q = { type: "pick", mode, say: e.ans, prompt: e.prompt, opts, topic: e.topic, expl: e.expl, audio: e.audio };
      q.stem = mode === "listen" ? "Nghe và chọn từ đúng." : (e.prompt || "Chọn đáp án đúng.");
      if (e.img) q.img = e.img;
      qs.push(q);
    });
    return { questions: qs, errors };
  }

  function parseScramble(raw) {
    const questions = [], errors = []; let pend = "";
    lines(raw).forEach((l, i) => {
      if (!l.trim()) return;
      let m; if ((m = l.match(RE.img))) { pend = m[1]; return; }
      if ((m = l.match(RE.topic))) { if (questions.length) questions[questions.length - 1].topic = m[1]; return; }
      if ((m = l.match(RE.expl))) { if (questions.length) questions[questions.length - 1].expl = m[1]; return; }
      const p = l.split("|"); const ans = stripNum(p[0]).replace(/\s+/g, " ").trim();
      const lt = ans.replace(/\s/g, "").split("");
      if (lt.length < 2) { errors.push("Dòng " + (i + 1) + ": từ quá ngắn"); pend = ""; return; }
      if (lt.length > 24) { errors.push("Dòng " + (i + 1) + ": quá dài (tối đa 24 chữ cái)"); pend = ""; return; }
      const q = { type: "scramble", stem: "Sắp xếp các chữ cái thành từ đúng.", ans, lt, hint: (p[1] || "").trim() };
      if (pend) { q.img = pend; pend = ""; } questions.push(q);
    });
    return { questions, errors };
  }

  /** Lật thẻ: TOÀN BỘ các dòng của phần là MỘT bàn thẻ (tối đa 15 cặp = 30 thẻ) */
  function parseMemory(raw) {
    const questions = [], errors = [], pairs = []; let task = "", topic = "", expl = "";
    blocks(raw).forEach(b => {
      const m = meta(b, ["topic", "expl", "task"]); task = task || m.task; topic = topic || m.topic; expl = expl || m.expl;
      m.rest.forEach(l => { const r = l.match(/^\s*(.+?)\s*(?:=>|->|=|\|)\s*(.+?)\s*$/); if (r) pairs.push({ l: r[1], r: r[2] }); else errors.push("Dòng không có dấu = : " + l.trim().slice(0, 40)); });
    });
    if (pairs.length < 2) { errors.push("Cần ít nhất 2 cặp (mỗi dòng một cặp: vế 1 = vế 2)"); return { questions, errors }; }
    if (pairs.length > 15) { errors.push("Có " + pairs.length + " cặp, tối đa 15 cặp (30 thẻ) cho một bàn. Các cặp thừa bị bỏ qua."); pairs.length = 15; }
    questions.push({ type: "memory", stem: task || "Lật từng 2 thẻ để tìm các cặp giống nhau.", pairs, topic, expl });
    return { questions, errors };
  }

  function parseSearch(raw) {
    const questions = [], errors = [];
    blocks(raw).forEach((b, i) => {
      const m = meta(b); const words = [];
      m.rest.forEach(l => {
        const parts = l.includes("|") ? [l] : (l.includes(",") ? l.split(",") : [l]);
        parts.forEach(pt => { const p = pt.split("|"); const w = letters(p[0]); if (!w) return; if (w.length < 2) { errors.push("Ván " + (i + 1) + ": từ '" + p[0].trim() + "' quá ngắn"); return; } if (w.length > 14) { errors.push("Ván " + (i + 1) + ": từ '" + p[0].trim() + "' dài hơn 14 chữ cái"); return; } if (!words.some(x => x.w === w)) words.push({ w, clue: (p[1] || "").trim() }); });
      });
      if (words.length < 2) { errors.push("Ván " + (i + 1) + ": cần ít nhất 2 từ"); return; }
      if (words.length > 12) errors.push("Ván " + (i + 1) + ": nhiều hơn 12 từ, nên chia thành 2 ván");
      questions.push({ type: "wordsearch", stem: m.task || "Tìm các từ trong bảng chữ cái.", words, level: m.level ? levelOf(m.level) : "easy", topic: m.topic, expl: m.expl });
    });
    return { questions, errors };
  }

  /* --- thuật toán xếp ô chữ --- */
  function layoutCross(items) {
    const list = items.slice().sort((a, b) => b.w.length - a.w.length);
    const grid = new Map(), dirAt = new Map(), placed = [];
    const K = (r, c) => r + "," + c;
    const put = (it, r, c, dir) => {
      for (let k = 0; k < it.w.length; k++) { const rr = r + (dir ? k : 0), cc = c + (dir ? 0 : k); grid.set(K(rr, cc), it.w[k]); const s = dirAt.get(K(rr, cc)) || []; s.push(dir); dirAt.set(K(rr, cc), s); }
      placed.push({ it, r, c, dir });
    };
    const fits = (w, r, c, dir) => {
      const dr = dir ? 1 : 0, dc = dir ? 0 : 1; let cross = 0;
      if (grid.has(K(r - dr, c - dc)) || grid.has(K(r + dr * w.length, c + dc * w.length))) return -1;
      for (let k = 0; k < w.length; k++) {
        const rr = r + dr * k, cc = c + dc * k, ex = grid.get(K(rr, cc));
        if (ex) { if (ex !== w[k] || (dirAt.get(K(rr, cc)) || []).includes(dir)) return -1; cross++; }
        else if (grid.has(K(rr + dc, cc + dr)) || grid.has(K(rr - dc, cc - dr))) return -1;
      }
      return cross;
    };
    put(list[0], 0, 0, 0);
    let left = list.slice(1), progress = true;
    while (left.length && progress) {
      progress = false; const next = [];
      left.forEach(it => {
        let best = null;
        placed.forEach(p => {
          for (let i = 0; i < p.it.w.length; i++) for (let j = 0; j < it.w.length; j++) {
            if (p.it.w[i] !== it.w[j]) continue;
            const dir = p.dir ? 0 : 1;
            const r = p.dir ? p.r + i : p.r - j, c = p.dir ? p.c - j : p.c + i;
            const cr = fits(it.w, r, c, dir); if (cr < 1) continue;
            let r0 = 1e9, r1 = -1e9, c0 = 1e9, c1 = -1e9;
            grid.forEach((_, key) => { const [a, b] = key.split(",").map(Number); r0 = Math.min(r0, a); r1 = Math.max(r1, a); c0 = Math.min(c0, b); c1 = Math.max(c1, b); });
            r0 = Math.min(r0, r); c0 = Math.min(c0, c); r1 = Math.max(r1, r + (dir ? it.w.length - 1 : 0)); c1 = Math.max(c1, c + (dir ? 0 : it.w.length - 1));
            const score = cr * 100 - Math.max(r1 - r0 + 1, c1 - c0 + 1) * 3 - (r1 - r0 + 1) * (c1 - c0 + 1) * 0.2;
            if (!best || score > best.score) best = { r, c, dir, score };
          }
        });
        if (best) { put(it, best.r, best.c, best.dir); progress = true; } else next.push(it);
      });
      left = next;
    }
    let r0 = 1e9, c0 = 1e9, r1 = -1e9, c1 = -1e9;
    placed.forEach(p => { r0 = Math.min(r0, p.r); c0 = Math.min(c0, p.c); r1 = Math.max(r1, p.r + (p.dir ? p.it.w.length - 1 : 0)); c1 = Math.max(c1, p.c + (p.dir ? 0 : p.it.w.length - 1)); });
    const words = placed.map(p => ({ w: p.it.w, clue: p.it.clue, r: p.r - r0, c: p.c - c0, dir: p.dir }));
    const starts = new Map(); let n = 0;
    const order = words.slice().sort((a, b) => (a.r - b.r) || (a.c - b.c));
    order.forEach(w => { const key = w.r + "," + w.c; if (!starts.has(key)) starts.set(key, ++n); w.n = starts.get(key); });
    return { rows: r1 - r0 + 1, cols: c1 - c0 + 1, words: words.sort((a, b) => a.n - b.n || a.dir - b.dir), left };
  }

  function parseCross(raw) {
    const questions = [], errors = [];
    blocks(raw).forEach((b, i) => {
      const m = meta(b); const items = [];
      m.rest.forEach(l => {
        const p = l.split("|"); const w = letters(p[0]); const clue = (p[1] || "").trim();
        if (!w) return;
        if (w.length < 2) { errors.push("Ô chữ " + (i + 1) + ": từ '" + p[0].trim() + "' quá ngắn"); return; }
        if (w.length > 14) { errors.push("Ô chữ " + (i + 1) + ": từ '" + p[0].trim() + "' dài hơn 14 chữ cái"); return; }
        if (!clue) { errors.push("Ô chữ " + (i + 1) + ": từ '" + p[0].trim() + "' chưa có gợi ý sau dấu |"); return; }
        if (!items.some(x => x.w === w)) items.push({ w, clue });
      });
      if (items.length < 3) { errors.push("Ô chữ " + (i + 1) + ": cần ít nhất 3 từ có gợi ý"); return; }
      const lay = layoutCross(items);
      if (lay.left.length) errors.push("Ô chữ " + (i + 1) + ": không xếp được " + lay.left.map(x => x.w.toLowerCase()).join(", ") + " (không có chữ cái chung với các từ khác). Thử đổi từ hoặc thêm từ nối.");
      if (lay.words.length < 2) return;
      questions.push({ type: "crossword", stem: m.task || "Điền ô chữ theo gợi ý.", rows: lay.rows, cols: lay.cols, words: lay.words, topic: m.topic, expl: m.expl });
    });
    return { questions, errors };
  }

  function parseErr(raw) {
    const questions = [], errors = [];
    lines(raw).forEach((l, i) => {
      if (!l.trim()) return;
      let m;
      if ((m = l.match(RE.topic))) { if (questions.length) questions[questions.length - 1].topic = m[1]; return; }
      if ((m = l.match(RE.expl))) { if (questions.length) questions[questions.length - 1].expl = m[1]; return; }
      if ((m = l.match(RE.img))) return;
      const k = l.lastIndexOf("=>");
      if (k < 0) { errors.push("Dòng " + (i + 1) + ": thiếu dấu => rồi phần sửa đúng"); return; }
      const text = stripNum(l.slice(0, k)); const fixes = l.slice(k + 2).split("/").map(s => s.trim()).filter(Boolean);
      const marks = text.match(/\[\[(.+?)\]\]/g) || [];
      if (marks.length !== 1) { errors.push("Dòng " + (i + 1) + ": cần đúng 1 chỗ sai bọc trong [[ ]]"); return; }
      if (!fixes.length) { errors.push("Dòng " + (i + 1) + ": chưa có phần sửa đúng"); return; }
      const toks = []; const re = /\[\[(.+?)\]\]|([A-Za-zÀ-ỹ0-9'’\-]+)|(\s+)|([^\sA-Za-zÀ-ỹ0-9'’\-])/g; let r;
      while ((r = re.exec(text))) {
        if (r[1] !== undefined) toks.push({ w: r[1], ok: true, pick: true });
        else if (r[2] !== undefined) toks.push({ w: r[2], ok: false, pick: true });
        else toks.push({ w: r[0], pick: false });
      }
      questions.push({ type: "errfix", stem: "Tìm chỗ sai trong câu, chạm vào đó rồi gõ cách sửa đúng.", toks, fixes, wrong: marks[0].slice(2, -2), full: text.replace(/\[\[|\]\]/g, "") });
    });
    return { questions, errors };
  }

  function parseTransform(raw) {
    const questions = [], errors = [];
    lines(raw).forEach((l, i) => {
      if (!l.trim()) return;
      let m;
      if ((m = l.match(RE.topic))) { if (questions.length) questions[questions.length - 1].topic = m[1]; return; }
      if ((m = l.match(RE.expl))) { if (questions.length) questions[questions.length - 1].expl = m[1]; return; }
      const k = l.indexOf("=>");
      if (k < 0) { errors.push("Dòng " + (i + 1) + ": thiếu dấu => rồi đáp án"); return; }
      const left = l.slice(0, k).split("|"); const src = stripNum(left[0]); const starter = (left[1] || "").trim();
      const answers = l.slice(k + 2).split(" / ").map(s => s.trim()).filter(Boolean);
      if (!src || !answers.length) { errors.push("Dòng " + (i + 1) + ": thiếu câu gốc hoặc đáp án (nhiều đáp án ngăn bằng dấu / có khoảng trắng hai bên)"); return; }
      questions.push({ type: "transform", stem: "Viết lại câu sao cho nghĩa không đổi.", src, starter, answers });
    });
    return { questions, errors };
  }
  /** chuẩn hoá để so câu: hoa/thường, dấu câu, viết tắt (isn't = is not, I'm = I am) */
  function tnorm(s) {
    let t = String(s || "").normalize("NFC").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[“”]/g, '"');
    [[/\bwon't\b/g, "will not"], [/\bcan't\b/g, "can not"], [/\bcannot\b/g, "can not"], [/\bshan't\b/g, "shall not"], [/n't\b/g, " not"], [/'m\b/g, " am"], [/'re\b/g, " are"], [/'ll\b/g, " will"], [/'ve\b/g, " have"], [/'s\b/g, " is"]].forEach(([a, b]) => t = t.replace(a, b));
    return t.replace(/[^a-z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ' ]/g, " ").replace(/'/g, "").replace(/\s+/g, " ").trim();
  }

  function parse(type, raw) {
    switch (type) {
      case "transform": return parseTransform(raw);
      case "listen": return parsePick(raw, "listen");
      case "meanpick": return parsePick(raw, "mean");
      case "scramble": return parseScramble(raw);
      case "memory": return parseMemory(raw);
      case "wordsearch": return parseSearch(raw);
      case "crossword": return parseCross(raw);
      case "errfix": return parseErr(raw);
    }
    return null;
  }

  /* =====================================================================
     TRẠNG THÁI / ĐÁP ÁN / CHẤM
     ===================================================================== */
  /** tạo bảng tìm từ (xác định theo q.id để mỗi lần xem giống nhau) */
  const DIRS_BY = { easy: [[0, 1], [1, 0]], medium: [[0, 1], [1, 0], [1, 1]], hard: [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]] };
  function ensureSearch(q, level) {
    level = level || q.level || "easy";
    q.gens = q.gens || {};
    if (q.gens[level]) return q.gens[level];
    const words = q.words.map(x => x.w).sort((a, b) => b.length - a.length);
    const DIRS = DIRS_BY[level];
    const rand = rng(hashSeed((q.id || "x") + level + words.join(",")));
    const base = Math.max(words[0].length + 1, Math.ceil(Math.sqrt(words.reduce((a, w) => a + w.length, 0) * 2.2)), 8);
    const start = Math.min(18, base + (level === "hard" ? 3 : level === "medium" ? 1 : 0));
    for (let size = start; size <= 18; size++) {
      const g = Array.from({ length: size }, () => Array(size).fill("")), pos = {}; let okAll = true;
      for (const w of words) {
        let done = false;
        for (let t = 0; t < 400 && !done; t++) {
          const d = DIRS[(rand() * DIRS.length) | 0], r = (rand() * size) | 0, c = (rand() * size) | 0;
          const er = r + d[0] * (w.length - 1), ec = c + d[1] * (w.length - 1);
          if (er < 0 || ec < 0 || er >= size || ec >= size) continue;
          let fine = true; for (let k = 0; k < w.length; k++) { const x = g[r + d[0] * k][c + d[1] * k]; if (x && x !== w[k]) { fine = false; break; } }
          if (!fine) continue;
          for (let k = 0; k < w.length; k++) g[r + d[0] * k][c + d[1] * k] = w[k];
          pos[w] = { r, c, dr: d[0], dc: d[1] }; done = true;
        }
        if (!done) { okAll = false; break; }
      }
      if (!okAll) continue;
      const AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", pool = words.join("");
      for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!g[r][c]) g[r][c] = (level === "hard" && rand() < 0.65) ? pool[(rand() * pool.length) | 0] : AB[(rand() * 26) | 0];
      return (q.gens[level] = { size, grid: g, pos });
    }
    return (q.gens[level] = { size: 0, grid: [], pos: {} });
  }
  const cellsOf = (p, len) => Array.from({ length: len }, (_, k) => [p.r + p.dr * k, p.c + p.dc * k]);

  function init(q) {
    switch (q.type) {
      case "pick": return { v: null, ord: shuffle(q.opts.map((_, i) => i)) };
      case "scramble": {
        let ord = q.lt.map((_, i) => i), tries = 0;
        const same = o => o.map(i => q.lt[i]).join("") === q.lt.join("");
        do { ord = shuffle(ord); tries++; } while (same(ord) && tries < 30 && new Set(q.lt).size > 1);
        return { v: [], ord };
      }
      case "memory": return { v: [], open: [], miss: q.pairs.map(() => 0), lock: false, ord: shuffle(Array.from({ length: q.pairs.length * 2 }, (_, i) => i)) };
      case "wordsearch": ensureSearch(q, q.level); return { v: [], sel: null, level: q.level };
      case "crossword": return { v: {} };
      case "errfix": return { v: { pick: null, fix: "" } };
      case "transform": return { v: "" };
    }
  }
  function key(q, st) {
    switch (q.type) {
      case "pick": st.v = q.opts.findIndex(o => o.ok); break;
      case "scramble": { const used = []; st.v = q.ans.replace(/\s/g, "").split("").map(ch => { const i = q.lt.findIndex((x, k) => x === ch && !used.includes(k)); used.push(i); return i; }); break; }
      case "memory": st.v = q.pairs.map((_, i) => i); st.miss = q.pairs.map(() => 0); break;
      case "wordsearch": st.v = q.words.map((_, i) => i); break;
      case "crossword": { const o = {}; q.words.forEach(w => { for (let k = 0; k < w.w.length; k++) o[(w.r + (w.dir ? k : 0)) + "," + (w.c + (w.dir ? 0 : k))] = w.w[k]; }); st.v = o; break; }
      case "errfix": st.v = { pick: q.toks.findIndex(t => t.ok), fix: q.fixes[0] }; break;
      case "transform": st.v = q.answers[0]; break;
    }
    return st;
  }
  const lab = s => String(s).replace(/\s+/g, " ").slice(0, 90);
  function grade(q, st) {
    const v = st.v;
    switch (q.type) {
      case "pick": { const ok = v != null && !!q.opts[v] && q.opts[v].ok; return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: (q.mode === "listen" ? "🔊 " : lab(q.prompt || q.stem) + " → ") + q.say }] }; }
      case "scramble": { const ok = v.length === q.lt.length && v.map(i => q.lt[i]).join("").toLowerCase() === q.ans.replace(/\s/g, "").toLowerCase(); return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: q.ans }] }; }
      case "memory": { const items = q.pairs.map((p, i) => ({ ok: v.includes(i) && st.miss[i] <= (q.pairs.length > 8 ? 2 : 1), label: lab(p.l) + " = " + p.r })); return { got: items.filter(x => x.ok).length, max: items.length, items }; }
      case "wordsearch": { const items = q.words.map((w, i) => ({ ok: v.includes(i), label: w.w.toLowerCase() + (w.clue ? " (" + w.clue + ")" : "") })); return { got: items.filter(x => x.ok).length, max: items.length, items }; }
      case "crossword": { const items = q.words.map(w => { let ok = true; for (let k = 0; k < w.w.length; k++) { const x = (v[(w.r + (w.dir ? k : 0)) + "," + (w.c + (w.dir ? 0 : k))] || "").toUpperCase(); if (x !== w.w[k]) { ok = false; break; } } return { ok, label: w.n + (w.dir ? " Down" : " Across") + " · " + lab(w.clue) + " → " + w.w.toLowerCase() }; }); return { got: items.filter(x => x.ok).length, max: items.length, items }; }
      case "transform": { const ok = !!v && q.answers.some(a => tnorm(a) === tnorm(v)); return { got: ok ? 1 : 0, max: 1, items: [{ ok, label: lab(q.src) + " → " + lab(q.answers[0]) }] }; }
      case "errfix": {
        const a = v.pick != null && q.toks[v.pick] && q.toks[v.pick].ok, b = !!v.fix && q.fixes.some(f => norm(f) === norm(v.fix));
        return { got: (a ? 1 : 0) + (b ? 1 : 0), max: 2, items: [{ ok: a, label: "Tìm lỗi: " + lab(q.full) }, { ok: b, label: "Sửa lỗi: " + q.wrong + " → " + q.fixes[0] }] };
      }
    }
    return { got: 0, max: 0, items: [] };
  }

  /* =====================================================================
     GIAO DIỆN
     ===================================================================== */
  const LET = "ABCDEFGH";
  const isEn = t => /[A-Za-z]/.test(t || "") && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t || "");
  const picNodeIs = s => /^\s*img\s*:/i.test(s);
  const picNode = s => { const m = String(s).match(/^\s*img\s*:\s*(.+)$/i); return m && L.imgs ? L.imgs.node(m[1]) : null; };

  const VIEW = {
    pick(q, st, ctx) {
      const review = ctx.mode === "review";
      const head = [];
      if (q.mode === "listen") head.push(h("div.row", { style: "margin-bottom:8px" }, speakBtn(q.say, q.audio, true), review && ctx.showAns ? h("span.small.muted", "Từ: " + q.say) : null));
      return h("div", head, h("div.opts", st.ord.map((oi, pos) => {
        const o = q.opts[oi]; let c = "opt"; const sel = st.v === oi; if (sel) c += " sel"; const hid = st.hid && st.hid.includes(oi); if (hid) c += " dim";
        if (review) { if (sel) c += o.ok ? " k-right" : " k-wrong"; else if (o.ok && ctx.showAns) c += " k-miss"; }
        return h("button." + cls(c), { onclick: () => { if (review || hid) return; st.v = oi; if (q.mode === "mean" && L.gx) speak(o.t); ctx.redraw(); } }, h("span.l", LET[pos]), h("span", o.t));
      })));
    },
    scramble(q, st, ctx, g) {
      const review = ctx.mode === "review";
      let k = -1;
      const boxes = h("div.lboxes", q.ans.split("").map(ch => {
        if (ch === " ") return h("span.lgap");
        k++; const i = k, idx = st.v[i];
        let c = "lbox"; if (idx != null) c += " fill"; if (review) c += g.got ? " k-right" : " k-wrong";
        return h("button." + cls(c), { type: "button", onclick: () => { if (review || idx == null) return; st.v.splice(i, 1); ctx.redraw(); } }, idx != null ? q.lt[idx] : "");
      }));
      const pool = h("div.row", { style: "gap:8px;margin-top:10px" }, st.ord.map(idx => h("button.chip.big" + (st.v.includes(idx) ? ".used" : ""), { type: "button", onclick: () => { if (review || st.v.includes(idx) || st.v.length >= q.lt.length) return; st.v.push(idx); ctx.redraw(); } }, q.lt[idx])));
      return h("div", q.hint ? h("div.small.muted", { style: "margin-bottom:6px" }, "Gợi ý: " + q.hint) : null, boxes,
        review ? null : h("div", pool, h("div.row", { style: "margin-top:8px" }, h("button.btn.sm.ghost", { onclick: () => { st.v.length = 0; ctx.redraw(); } }, "↺ Xếp lại"))),
        review && ctx.showAns && !g.got ? h("div.fb.bad", "Đáp án: ", h("span.ans", q.ans)) : null);
    },
    memory(q, st, ctx, g) {
      const review = ctx.mode === "review";
      const face = (cid) => { const p = q.pairs[cid >> 1], left = !(cid & 1); const t = left ? p.l : p.r; return picNode(t) || h("span", t); };
      const onFlip = cid => {
        if (review || st.lock || st.v.includes(cid >> 1) || st.open.includes(cid)) return;
        st.open.push(cid);
        { const p = q.pairs[cid >> 1], t = (cid & 1) ? p.r : p.l; if (isEn(t) && !picNodeIs(t)) speak(t); L.sfx && L.sfx.flip(); }
        if (st.open.length === 2) {
          st.moves = (st.moves || 0) + 1;
          const a = st.open[0] >> 1, b = st.open[1] >> 1;
          if (a === b) { st.v.push(a); st.open = []; L.sfx && L.sfx.ok(); }
          else { L.sfx && L.sfx.bad(); st.miss[a]++; st.miss[b]++; st.lock = true; ctx.redraw(); setTimeout(() => { st.open = []; st.lock = false; ctx.redraw(); }, 950); return; }
        }
        ctx.redraw();
      };
      const done = st.v.length, total = q.pairs.length;
      return h("div",
        review ? null : h("div.small.muted", { style: "margin-bottom:8px" }, "Đã ghép " + done + "/" + total + " cặp · " + (st.moves || 0) + " lượt lật" + (done === total ? " 🎉" : "")),
        h("div.mgrid" + (total > 8 ? ".sm" : ""), st.ord.map(cid => {
          const pi = cid >> 1, up = review || st.open.includes(cid) || st.v.includes(pi);
          let c = "mcard"; if (up) c += " up"; if (st.v.includes(pi) && !review) c += " done";
          if (review) c += g.items[pi].ok ? " k-right" : " k-wrong";
          return h("button." + cls(c), { type: "button", onclick: () => onFlip(cid) }, h("span.mback", "❔"), h("span.mfront", face(cid)));
        })));
    },
    wordsearch(q, st, ctx, g) {
      const review = ctx.mode === "review", level = st.level || q.level || "easy", gen = ensureSearch(q, level);
      if (!gen.size) return h("div.err", "Không tạo được bảng, hãy bớt từ hoặc rút ngắn từ.");
      const foundCells = {}, missCells = {};
      q.words.forEach((w, wi) => { const p = gen.pos[w.w]; if (!p) return; const cs = cellsOf(p, w.w.length); if (st.v.includes(wi)) cs.forEach(([r, c]) => foundCells[r + "," + c] = wi % 6); else if (review && ctx.showAns) cs.forEach(([r, c]) => missCells[r + "," + c] = 1); });
      const tap = (r, c) => {
        if (review) return;
        if (!st.sel) { st.sel = { r, c }; ctx.redraw(); return; }
        const s = st.sel; st.sel = null;
        const dr = Math.sign(r - s.r), dc = Math.sign(c - s.c), n = Math.max(Math.abs(r - s.r), Math.abs(c - s.c));
        if ((s.r === r && s.c === c) || !(r === s.r || c === s.c || Math.abs(r - s.r) === Math.abs(c - s.c))) { ctx.redraw(); return; }
        let str = ""; for (let k = 0; k <= n; k++) str += gen.grid[s.r + dr * k][s.c + dc * k];
        const rev = str.split("").reverse().join("");
        const wi = q.words.findIndex((w, i) => !st.v.includes(i) && (w.w === str || w.w === rev));
        if (wi >= 0) { st.v.push(wi); L.sfx && L.sfx.ok(); speak(q.words[wi].w.toLowerCase()); }
        ctx.redraw();
      };
      const grid = h("div.wsgrid", { style: "grid-template-columns:repeat(" + gen.size + ",1fr)" }, gen.grid.map((row, r) => row.map((ch, c) => {
        const k = r + "," + c; let cc = "wscell"; if (foundCells[k] != null) cc += " f f" + foundCells[k]; else if (missCells[k]) cc += " miss"; if (st.sel && st.sel.r === r && st.sel.c === c) cc += " sel";
        return h("button." + cls(cc), { type: "button", onclick: () => tap(r, c) }, ch);
      })));
      const shown = w => level === "easy" ? (w.clue ? w.w.toLowerCase() + " (" + w.clue + ")" : w.w.toLowerCase())
        : level === "medium" ? (w.clue || w.w.toLowerCase())
        : (w.clue ? w.clue + " · " : "") + w.w[0].toLowerCase() + " " + "_ ".repeat(w.w.length - 1).trim() + " (" + w.w.length + ")";
      const list = h("div.wlist", q.words.map((w, i) => h("span.wchip" + (st.v.includes(i) ? ".done" : ""), (st.v.includes(i) ? "✓ " : "") + shown(w))));
      const LV = [["easy", "🌱 Dễ"], ["medium", "🌿 Vừa"], ["hard", "🌳 Khó"]];
      const lvBar = review ? null : h("div.row", { style: "gap:6px;margin-bottom:8px" }, h("b.small", "Mức chơi:"), LV.map(([k, t]) => h("button.chip" + (k === level ? ".pick" : ""), { type: "button", onclick: () => { if (k === level) return; st.level = k; st.v = []; st.sel = null; ctx.redraw(); } }, t)));
      const hint = { easy: "Từ đọc ngang → hoặc dọc ↓.", medium: "Từ đọc ngang, dọc hoặc chéo ↘. Bảng chỉ cho gợi ý nghĩa.", hard: "Từ có thể đọc ngược và chéo mọi hướng. Chỉ có chữ cái đầu và số chữ cái." }[level];
      return h("div", lvBar, h("div.small.muted", { style: "margin-bottom:6px" }, review ? "" : "Chạm chữ cái ĐẦU rồi chạm chữ cái CUỐI của từ. " + hint), list, h("div.wsbox", grid),
        review && ctx.showAns && g.got < g.max ? h("div.fb.bad", "Các từ: ", h("span.ans", q.words.map(w => w.w.toLowerCase()).join(", "))) : null);
    },
    crossword(q, st, ctx, g) {
      const review = ctx.mode === "review";
      const cellMap = {}, nums = {};
      q.words.forEach(w => { if (!nums[w.r + "," + w.c]) nums[w.r + "," + w.c] = w.n; for (let k = 0; k < w.w.length; k++) cellMap[(w.r + (w.dir ? k : 0)) + "," + (w.c + (w.dir ? 0 : k))] = w.w[k]; });
      const inputs = {};
      const focusNext = (r, c, kk) => { const d = cellMap[r + "," + (c + 1)] ? [0, 1] : (cellMap[(r + 1) + "," + c] ? [1, 0] : null); if (!d) return; const el = inputs[(r + d[0]) + "," + (c + d[1])]; if (el) { el.focus(); el.select && el.select(); } };
      const rows = [];
      for (let r = 0; r < q.rows; r++) for (let c = 0; c < q.cols; c++) {
        const k = r + "," + c, ans = cellMap[k];
        if (!ans) { rows.push(h("span.xcell.blk")); continue; }
        const val = (st.v[k] || "").toUpperCase();
        const inp = h("input", { type: "text", maxlength: 1, value: val, disabled: review, autocomplete: "off", autocapitalize: "characters", spellcheck: "false",
          oninput: e => { const x = e.target.value.replace(/[^A-Za-z]/g, "").slice(-1).toUpperCase(); e.target.value = x; st.v[k] = x; if (x) focusNext(r, c); },
          onfocus: e => e.target.select() });
        inputs[k] = inp;
        let cc = "xcell"; if (review) cc += val === ans ? " k-right" : " k-wrong";
        rows.push(h("span." + cls(cc), nums[k] ? h("i", String(nums[k])) : null, inp));
      }
      const clueList = dir => h("div", h("b", dir ? "⬇ Down" : "➡ Across"), q.words.filter(w => w.dir === dir).map(w => h("div.small", { style: "margin:2px 0" }, h("b", w.n + ". "), w.clue)));
      return h("div", h("div.wsbox", h("div.xgrid", { style: "grid-template-columns:repeat(" + q.cols + ",34px)" }, rows)),
        h("div.xclues", clueList(0), clueList(1)),
        review && ctx.showAns && g.got < g.max ? h("div.fb.bad", "Đáp án: ", h("span.ans", q.words.map(w => w.n + (w.dir ? "↓ " : "→ ") + w.w.toLowerCase()).join(" · "))) : null);
    },
    transform(q, st, ctx, g) {
      const review = ctx.mode === "review";
      const ta = h("textarea.blank" + (review ? (g.got ? ".k-right" : ".k-wrong") : ""), { style: "width:100%;min-height:64px;text-align:left;font-family:var(--bfont);font-size:17px;border-radius:12px", value: st.v, disabled: review, spellcheck: "false", autocomplete: "off", placeholder: st.hnt || (q.starter ? q.starter + " …" : "Viết lại cả câu ở đây…"), oninput: e => { st.v = e.target.value; } });
      return h("div", h("div.srcbox", q.src, speakBtn(q.src)), q.starter ? h("div.small", { style: "margin:6px 0" }, "Bắt đầu bằng: ", h("b.pill.lav", q.starter)) : null, ta,
        review && ctx.showAns && !g.got ? h("div.fb.bad", "Đáp án: ", q.answers.map((a, i) => h("div", h("span.ans", a)))) : null);
    },
    errfix(q, st, ctx, g) {
      const review = ctx.mode === "review";
      const wi = q.toks.findIndex(t => t.ok);
      const sent = h("div", { style: "font-size:19px;line-height:2.1;white-space:pre-wrap" }, q.toks.map((t, i) => {
        if (!t.pick) return document.createTextNode(t.w);
        const sel = st.v.pick === i; let c = "tok"; if (sel) c += " sel";
        if (review) { c = "tok"; if (sel) c += t.ok ? " k-right" : " k-wrong"; else if (t.ok && ctx.showAns) c += " k-miss"; }
        return h("span." + cls(c), { onclick: () => { if (review) return; st.v.pick = sel ? null : i; ctx.redraw(); } }, t.w);
      }));
      const fixOk = review ? g.items[1].ok : null;
      const inp = h("input.blank" + (review ? (fixOk ? ".k-right" : ".k-wrong") : ""), { type: "text", style: "width:100%;max-width:340px;text-align:left", value: st.v.fix, disabled: review, autocomplete: "off", autocapitalize: "none", spellcheck: "false",
        placeholder: st.v.pick != null ? "Sửa \"" + q.toks[st.v.pick].w + "\" thành…" : "Chạm vào chỗ sai trước, rồi gõ cách sửa", oninput: e => { st.v.fix = e.target.value; } });
      return h("div", sent, h("div", { style: "margin-top:8px" }, inp),
        review && ctx.showAns && g.got < g.max ? h("div.fb.bad", "Lỗi: ", h("span.ans", q.wrong), " → ", h("span.ans", q.fixes.join(" / "))) : null);
    }
  };

  /* Phân loại kéo-thả: kéo thẻ vào cột của nhóm (chuột hoặc ngón tay); hoặc chạm thẻ rồi chạm cột. Chạm thẻ đã xếp để trả về. */
  function classifyDrag(q, st, ctx, g) {
    const review = ctx.mode === "review", ss = ctx.secSt || {};
    const selKey = q.id, sel = ss.clsSel && ss.clsSel.q === selKey ? ss.clsSel.i : null;
    const put = (i, ci) => { st.v[i] = ci; ss.clsSel = null; ctx.redraw(); };
    const chip = (i, placedIn) => {
      const it = q.items[i]; let c = "cchip"; if (sel === i) c += " sel";
      if (review) c += st.v[i] === it.c ? " k-right" : " k-wrong";
      const el = h("div." + cls(c), { "data-i": i }, it.t);
      if (review) return el;
      el.style.touchAction = "none";
      el.addEventListener("pointerdown", e => {
        if (e.button != null && e.button > 0) return;
        const sx = e.clientX, sy = e.clientY; let ghost = null, drag = false, hot = null;
        const colAt = (x, y) => { const t = document.elementFromPoint(x, y); return t && t.closest ? t.closest("[data-cat]") : null; };
        const move = ev => {
          if (!drag && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 7) {
            drag = true; ghost = el.cloneNode(true); ghost.classList.add("ghost");
            const r = el.getBoundingClientRect(); ghost.style.cssText = "position:fixed;z-index:9999;pointer-events:none;width:" + r.width + "px;left:0;top:0;opacity:.92;transform:scale(1.06) rotate(-3deg)";
            document.body.appendChild(ghost); el.classList.add("lifted");
          }
          if (drag) { ghost.style.left = (ev.clientX - 40) + "px"; ghost.style.top = (ev.clientY - 22) + "px"; const c = colAt(ev.clientX, ev.clientY); if (hot && hot !== c) hot.classList.remove("hot"); hot = c; if (hot) hot.classList.add("hot"); ev.preventDefault(); }
        };
        const up = ev => {
          document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", up);
          if (hot) hot.classList.remove("hot"); if (ghost) ghost.remove(); el.classList.remove("lifted");
          if (drag) { const c = colAt(ev.clientX, ev.clientY); if (c) { put(i, +c.getAttribute("data-cat")); } else if (placedIn != null) put(i, -1); else ctx.redraw(); return; }
          if (placedIn != null) { if (sel != null && sel !== i) put(sel, placedIn); else put(i, -1); } else { ss.clsSel = sel === i ? null : { q: selKey, i }; ctx.redraw(); }
        };
        document.addEventListener("pointermove", move, { passive: false }); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", up);
      });
      return el;
    };
    const pool = st.ord.filter(i => st.v[i] === -1);
    const cols = q.cats.map((name, ci) => {
      const inside = st.ord.filter(i => st.v[i] === ci);
      return h("div.ccol.c" + (ci % 6), { "data-cat": ci, onclick: e => { if (review || e.target.closest(".cchip")) return; if (sel != null) put(sel, ci); } },
        h("div.chead", name), h("div.cbody", inside.map(i => chip(i, ci)), !inside.length && !review ? h("span.cempty", sel != null ? "Chạm để thả vào đây" : "Kéo thẻ vào đây") : null),
        review && ctx.showAns ? h("div.small", { style: "color:var(--good);font-weight:800;padding:0 6px 6px" }, q.items.filter((it, i) => it.c === ci && st.v[i] !== ci).map(it => "+ " + it.t).join("  ")) : null);
    });
    return h("div",
      review ? null : h("div.small.muted", { style: "margin-bottom:6px" }, "Kéo từng thẻ vào đúng cột (hoặc chạm thẻ rồi chạm cột). Chạm thẻ đã xếp để lấy ra."),
      !review || pool.length ? h("div.cpool" + (review ? ".bad" : ""), pool.map(i => chip(i, null)), !pool.length ? h("span.cempty", "🎉 Đã xếp hết!") : null) : null,
      h("div.ccols", { style: "grid-template-columns:repeat(" + Math.min(q.cats.length, 3) + ",1fr)" }, cols));
  }

  L.gx = {
    classifyDrag, speakBtn, isEn, tnorm,
    TYPES, VIEW, IDS, Q_TYPES, parse, init, key, grade, speak,
    has: t => !!IDS[t], hasQ: t => !!Q_TYPES[t]
  };
})(window.LSE);
