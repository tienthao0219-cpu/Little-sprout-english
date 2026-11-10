/* Chấm Speaking bằng AI: phần LÕI (không đụng giao diện) — rubric, tính điểm, phân tích âm thanh, soạn tin Zalo.
   Chạy được cả trên trình duyệt (window.LSE.spk) lẫn Node (để kiểm thử). */
(function (root) {
  "use strict";

  /* ============================================================
     RUBRIC 100 điểm (đúng theo bảng của cô Thảo)
     ai   = AI chấm (cô vẫn sửa được)
     auto = app tự tính bằng công thức (không nhờ AI đoán)
     manual = cô tự chấm (không thể chấm từ file mp3)
     ============================================================ */
  const RUBRIC = [
    { id: "pron", label: "Phát âm & trọng tâm IPA", icon: "🎙️", items: [
      { id: "endSounds", label: "Âm trọng tâm của bài & âm đuôi", max: 15, mode: "ai",
        def: "Có bật đúng âm trọng tâm của bài học không? Không nuốt âm cuối (ending sounds như /t/, /d/, /s/, /p/)." },
      { id: "wordStress", label: "Trọng âm từ & nguyên âm", max: 10, mode: "ai",
        def: "Nhấn đúng trọng âm từ (dài hơn - cao hơn - rõ hơn), đọc rõ nguyên âm, không đoán mò theo mặt chữ." },
      { id: "intonation", label: "Ngữ điệu & nối âm nhẹ", max: 5, mode: "ai",
        def: "Có nối âm tự nhiên cơ bản (ví dụ work in an office, check app, nice to meet you); không nói giọng đều đều, có lên/hạ giọng cuối câu." }
    ] },
    { id: "vocab", label: "Từ vựng & collocations", icon: "📚", items: [
      { id: "lessonVocab", label: "Ứng dụng từ vựng của bài", max: 15, mode: "ai",
        def: "Dùng đúng và đủ các từ vựng cốt lõi của chủ đề bài học." },
      { id: "phrases", label: "Cụm từ đắt giá & từ đồng nghĩa", max: 10, mode: "ai",
        def: "Dùng được các cụm từ chất lượng đã dạy; hạn chế lặp lại một từ đơn quá nhiều lần." }
    ] },
    { id: "grammar", label: "Độ chính xác ngữ pháp", icon: "📐", items: [
      { id: "targetGrammar", label: "Đúng cấu trúc trọng tâm của bài", max: 10, mode: "ai",
        def: "Dùng đúng cấu trúc nền tảng của bài học (xem mục ngữ pháp trọng tâm của bài)." },
      { id: "connectors", label: "Nối câu & logic lập luận", max: 10, mode: "ai",
        def: "Dùng từ nối lý do/ví dụ/trình tự (because, for example, so, and then...) để câu không bị cụt lủn." }
    ] },
    { id: "fluency", label: "Độ trôi chảy & phản xạ nói", icon: "⚡", items: [
      { id: "pace", label: "Tốc độ nói & nhịp ngắt nghỉ", max: 10, mode: "ai",
        def: "Tốc độ vừa phải, ngắt nghỉ đúng cụm từ/dấu câu; không nói quá nhanh gây hụt hơi, không quá chậm vì dịch từng từ; hạn chế âm rác uhm/ah/er." },
      { id: "length", label: "Độ dài bài nói", max: 5, mode: "auto",
        def: "Chuẩn 60 đến 90 giây (không dưới 40 giây, không lan man quá 2 phút). App tự tính từ thời lượng." }
    ] },
    { id: "presence", label: "Phong thái & tự tin", icon: "🌟", items: [
      { id: "eyeContact", label: "Giao tiếp ánh mắt", max: 7, mode: "manual",
        def: "Nhìn vào ống kính, hạn chế nhìn xuống giấy đọc. File mp3 không có hình nên cô tự chấm." },
      { id: "expression", label: "Biểu cảm & năng lượng", max: 3, mode: "manual",
        def: "Nét mặt tươi sáng, nụ cười, thể hiện sự tự tin. Cô tự chấm." }
    ] }
  ];
  const ITEMS = [];
  RUBRIC.forEach(g => g.items.forEach(it => ITEMS.push(Object.assign({ group: g.id }, it))));
  const ITEM = {}; ITEMS.forEach(it => { ITEM[it.id] = it; });
  const MAX_TOTAL = ITEMS.reduce((s, it) => s + it.max, 0);                                   // 100
  const MAX_AI_PART = ITEMS.filter(it => it.mode !== "manual").reduce((s, it) => s + it.max, 0); // 90

  /* Cụm từ chung (cô có thể sửa trong app, đây chỉ là giá trị khởi tạo lấy từ rubric của cô) */
  const DEFAULT_SETTINGS = {
    phrases: ["work-life balance", "recharge energy", "highly reliable", "come up with out-of-the-box ideas", "tech-savvy employee"],
    connectors: ["because", "for example", "so", "and then"],
    stressWords: ["reliable", "morning", "office"],
    endSounds: ["/t/", "/d/", "/s/", "/p/"]
  };

  /* Xếp loại theo bảng của cô */
  function bandOf(total) {
    if (total >= 90) return { key: "excellent", icon: "🏆", label: "Xuất sắc", note: "Nói tự tin, chuẩn IPA, từ vựng phong phú, sẵn sàng cho phỏng vấn thực tế." };
    if (total >= 80) return { key: "good", icon: "🥇", label: "Tốt", note: "Trôi chảy, đúng cấu trúc, cần chỉnh nhẹ 1-2 âm đuôi hoặc ngữ điệu." };
    if (total >= 70) return { key: "fair", icon: "🥈", label: "Khá", note: "Hoàn thành đủ ý, còn phụ thuộc kịch bản, cần bật rõ âm trọng tâm hơn." };
    return { key: "improve", icon: "🥉", label: "Cần cải thiện", note: "Cần luyện phát âm lại cùng giáo viên trong 10 phút đầu của buổi học kế tiếp." };
  }

  /* Điểm độ dài (5 điểm). Mốc 60-90s, <40s, >2 phút là của cô; các mức trung gian là đề xuất của app, cô đổi ở đây nếu muốn. */
  function lengthScore(sec) {
    sec = +sec || 0;
    let s, note;
    if (sec >= 60 && sec <= 90) { s = 5; note = "Đúng chuẩn 60-90 giây."; }
    else if (sec >= 50 && sec < 60) { s = 4; note = "Hơi ngắn so với chuẩn 60-90 giây."; }
    else if (sec > 90 && sec <= 105) { s = 4; note = "Hơi dài so với chuẩn 60-90 giây."; }
    else if (sec >= 40 && sec < 50) { s = 3; note = "Ngắn, sát mốc tối thiểu 40 giây."; }
    else if (sec > 105 && sec <= 120) { s = 3; note = "Dài, sát mốc 2 phút."; }
    else if (sec < 40) { s = 1; note = "Quá ngắn (dưới 40 giây)."; }
    else { s = 1; note = "Lan man (quá 2 phút)."; }
    return { score: s, note: note };
  }

  /* ============================================================
     Phân tích âm thanh (đo được thật, không nhờ AI đoán):
     thời lượng nói, tỉ lệ nói, số lần ngắt, ngắt dài nhất.
     x = Float32Array (mono), sr = tần số lấy mẫu.
     ============================================================ */
  function analyzeSamples(x, sr, opt) {
    opt = Object.assign({ frameMs: 20, minPause: 0.5, longPause: 1.2, gapClose: 0.15, minSeg: 0.1 }, opt || {});
    const N = Math.max(1, Math.floor(sr * opt.frameMs / 1000));
    const nf = Math.floor(x.length / N);
    const totalSec = x.length / sr;
    if (nf < 25) return { ok: false, totalSec: totalSec, reason: "Đoạn ghi quá ngắn để phân tích." };
    const db = new Float32Array(nf);
    for (let f = 0; f < nf; f++) {
      let s = 0; const o = f * N;
      for (let i = 0; i < N; i++) { const v = x[o + i]; s += v * v; }
      db[f] = 20 * Math.log10(Math.sqrt(s / N) + 1e-9);
    }
    const sorted = Array.prototype.slice.call(db).sort((a, b) => a - b);
    const q = p => sorted[Math.min(nf - 1, Math.max(0, Math.floor(p * (nf - 1))))];
    const p10 = q(0.10), p95 = q(0.95);
    if (p95 < -55 || p95 - p10 < 10) return { ok: false, totalSec: totalSec, reason: "Không thấy đoạn nói rõ (file im lặng, quá nhỏ hoặc toàn tiếng ồn nền)." };
    const thr = Math.max(p95 - 28, p10 + 6);
    const fs = opt.frameMs / 1000;
    const sp = new Uint8Array(nf);
    for (let f = 0; f < nf; f++) sp[f] = db[f] > thr ? 1 : 0;
    /* lấp khe ngắn (hơi thở/phụ âm tắc) rồi bỏ đoạn quá ngắn (tiếng động đơn lẻ) */
    const segs = [];
    let f = 0;
    while (f < nf) {
      if (!sp[f]) { f++; continue; }
      let e = f; while (e < nf && sp[e]) e++;
      segs.push([f, e]); f = e;
    }
    const merged = [];
    segs.forEach(s => {
      const last = merged[merged.length - 1];
      if (last && (s[0] - last[1]) * fs < opt.gapClose) last[1] = s[1]; else merged.push([s[0], s[1]]);
    });
    const kept = merged.filter(s => (s[1] - s[0]) * fs >= opt.minSeg);
    if (!kept.length) return { ok: false, totalSec: totalSec, reason: "Không thấy đoạn nói rõ." };
    const start = kept[0][0] * fs, end = kept[kept.length - 1][1] * fs;
    const speechSec = kept.reduce((s, k) => s + (k[1] - k[0]) * fs, 0);
    const pauses = [];
    for (let i = 1; i < kept.length; i++) {
      const dur = (kept[i][0] - kept[i - 1][1]) * fs;
      if (dur >= opt.minPause) pauses.push({ at: round1(kept[i - 1][1] * fs), dur: round1(dur) });
    }
    const span = end - start;
    return {
      ok: true,
      totalSec: round1(totalSec), startSec: round1(start), endSec: round1(end),
      spanSec: round1(span), speechSec: round1(speechSec),
      ratio: span > 0 ? Math.round(speechSec / span * 100) / 100 : 0,
      pauseCount: pauses.length,
      longPauseCount: pauses.filter(p => p.dur >= opt.longPause).length,
      longestPause: pauses.reduce((m, p) => Math.max(m, p.dur), 0),
      pauses: pauses.slice(0, 40),
      thresholdDb: Math.round(thr)
    };
  }
  function round1(n) { return Math.round(n * 10) / 10; }

  /* Số liệu từ bản phiên âm */
  const FILLER_RE = /\b(uh+m*|um+|er+m*|erm|ah+|eh|hmm+|mm+)\b/gi;
  function textStats(transcript, spanSec) {
    const t = String(transcript || "");
    const words = (t.match(/[A-Za-z]+(?:['’][A-Za-z]+)*/g) || []);
    const fillers = (t.match(FILLER_RE) || []).length;
    const wordsNoFiller = Math.max(0, words.length - fillers);
    const wpm = spanSec > 0 ? Math.round(wordsNoFiller / (spanSec / 60)) : 0;
    const freq = {};
    words.forEach(w => { const k = w.toLowerCase(); if (k.length > 3 && !STOP[k]) freq[k] = (freq[k] || 0) + 1; });
    const repeated = Object.keys(freq).filter(k => freq[k] >= 4).sort((a, b) => freq[b] - freq[a]).slice(0, 6).map(k => ({ word: k, count: freq[k] }));
    return { words: wordsNoFiller, fillers: fillers, wpm: wpm, repeated: repeated };
  }
  const STOP = {}; "that this with have from they them their there then than what when where which would could should about because very also just like been were your into some more will".split(" ").forEach(w => { STOP[w] = 1; });

  /* ============================================================
     Làm sạch kết quả AI (AI có thể trả thiếu/sai kiểu) và tính điểm
     ============================================================ */
  const arr = v => Array.isArray(v) ? v : [];
  const str = v => v == null ? "" : String(v).trim();
  function half(n) { return Math.round(n * 2) / 2; }
  function clamp(n, lo, hi) { n = +n; if (!isFinite(n)) n = 0; return Math.min(hi, Math.max(lo, n)); }

  function sanitize(raw, measured) {
    raw = raw && typeof raw === "object" ? raw : {};
    const sc = raw.scores && typeof raw.scores === "object" ? raw.scores : {};
    const scores = {}, comments = {};
    ITEMS.forEach(it => {
      if (it.mode !== "ai") return;
      const o = sc[it.id];
      const v = o && typeof o === "object" ? o.score : o;
      scores[it.id] = half(clamp(v, 0, it.max));
      comments[it.id] = str(o && typeof o === "object" ? o.comment : "");
    });
    const m = measured || {};
    const span = m.ok ? m.spanSec : (+raw.estimatedSeconds || 0);
    const len = lengthScore(span);
    scores.length = len.score; comments.length = len.note;
    const tr = str(raw.transcript);
    const out = {
      transcript: tr,
      audioNote: str(raw.audioNote),
      scores: scores,
      comments: comments,
      pronunciationIssues: arr(raw.pronunciationIssues).slice(0, 25).map(x => ({
        word: str(x && x.word), time: str(x && x.time), heard: str(x && x.heard), expected: str(x && x.expected),
        tip: str(x && x.tip), confidence: /^(high|medium|low)$/.test(str(x && x.confidence)) ? str(x.confidence) : "medium"
      })).filter(x => x.word || x.tip),
      vocabUsed: arr(raw.vocabUsed).map(str).filter(Boolean).slice(0, 40),
      vocabMissing: arr(raw.vocabMissing).map(str).filter(Boolean).slice(0, 40),
      phrasesUsed: arr(raw.phrasesUsed).map(str).filter(Boolean).slice(0, 20),
      phrasesMissing: arr(raw.phrasesMissing).map(str).filter(Boolean).slice(0, 20),
      connectorsUsed: arr(raw.connectorsUsed).map(str).filter(Boolean).slice(0, 20),
      grammarErrors: arr(raw.grammarErrors).slice(0, 25).map(x => ({ said: str(x && x.said), better: str(x && x.better), rule: str(x && x.rule) })).filter(x => x.said),
      strengths: arr(raw.strengths).map(str).filter(Boolean).slice(0, 6),
      weaknesses: arr(raw.weaknesses).map(str).filter(Boolean).slice(0, 6),
      improvements: arr(raw.improvements).slice(0, 6).map(x => ({ title: str(x && x.title), how: str(x && x.how), practice: str(x && x.practice) })).filter(x => x.title || x.how),
      naturalPhrasing: arr(raw.naturalPhrasing).slice(0, 6).map(x => ({ said: str(x && x.said), moreNatural: str(x && x.moreNatural), why: str(x && x.why) })).filter(x => x.said && x.moreNatural),
      nextChallenge: { scenario: str(raw.nextChallenge && raw.nextChallenge.scenario), sentences: arr(raw.nextChallenge && raw.nextChallenge.sentences).map(str).filter(Boolean).slice(0, 5) },
      confidence: /^(high|medium|low)$/.test(str(raw.confidence)) ? str(raw.confidence) : "medium"
    };
    out.textStats = textStats(tr, span);
    return out;
  }

  /* Tổng điểm. final = điểm đã chỉnh của cô (nếu có), không thì lấy điểm AI/tự động. manual = {eyeContact, expression} hoặc null chưa chấm */
  function totals(scores, manual) {
    manual = manual || {};
    let part = 0;
    ITEMS.forEach(it => { if (it.mode !== "manual") part += clamp(scores[it.id], 0, it.max); });
    const hasManual = ["eyeContact", "expression"].every(k => manual[k] !== undefined && manual[k] !== null && manual[k] !== "");
    const man = hasManual ? clamp(manual.eyeContact, 0, ITEM.eyeContact.max) + clamp(manual.expression, 0, ITEM.expression.max) : 0;
    const total = Math.round((part + man) * 10) / 10;
    const provisional = !hasManual;
    const basis = provisional ? Math.round(part / MAX_AI_PART * 1000) / 10 : total;   // chưa chấm phong thái: quy về thang 100 để tạm xếp loại
    const groups = RUBRIC.map(g => {
      let got = 0, max = 0;
      g.items.forEach(it => {
        max += it.max;
        const v = it.mode === "manual" ? (hasManual ? clamp(manual[it.id], 0, it.max) : 0) : clamp(scores[it.id], 0, it.max);
        got += v;
      });
      return { id: g.id, label: g.label, icon: g.icon, got: Math.round(got * 10) / 10, max: max };
    });
    return { part: Math.round(part * 10) / 10, total: total, provisional: provisional, basis: basis, band: bandOf(basis), groups: groups };
  }

  /* ============================================================
     Tin nhắn Zalo (Sandwich: khen - góp ý cụ thể - động viên) theo mẫu của cô
     ============================================================ */
  function joinList(a) { a = a.filter(Boolean); if (a.length <= 1) return a.join(""); return a.slice(0, -1).join(", ") + " và " + a[a.length - 1]; }
  function buildZalo(ctx) {
    const r = ctx.result || {}, name = (ctx.student || "").trim() || "em";
    const tot = ctx.totals;
    const lines = [];
    lines.push("Chào " + name + "! Cô Thảo đã nghe kỹ bài nói của em rồi nhé.");
    lines.push("");
    const good = [];
    const vu = arr(r.vocabUsed).slice(0, 3);
    if (arr(r.strengths).length) good.push(arr(r.strengths)[0]);
    if (vu.length) good.push("Em đã áp dụng tốt các từ " + joinList(vu.map(w => "\"" + w + "\"")) + ".");
    if (arr(r.strengths).length > 1) good.push(arr(r.strengths)[1]);
    lines.push("👍 Điểm cô khen: " + (good.length ? good.join(" ") : "Em đã hoàn thành bài nói và rất cố gắng, cô thấy tiến bộ rồi đó."));
    lines.push("");
    lines.push("🔧 Điểm cần hoàn thiện thêm (Chấm điểm: " + (tot.provisional ? "tạm " + tot.part + "/90, chưa tính phong thái" : tot.total + "/100") + "):");
    let k = 0;
    const iss = arr(r.pronunciationIssues).filter(x => x.confidence !== "low")[0] || arr(r.pronunciationIssues)[0];
    if (iss) { k++; lines.push(k + ". Phát âm: " + (iss.word ? "từ \"" + iss.word + "\": " : "") + (iss.tip || (iss.heard && iss.expected ? "em đọc gần giống /" + iss.heard + "/, mình sửa thành /" + iss.expected + "/ nhé." : "mình luyện lại nhé."))); }
    const ge = arr(r.grammarErrors)[0];
    if (ge) { k++; lines.push(k + ". Ngữ pháp: câu \"" + ge.said + "\", em nhớ chỉnh lại thành \"" + ge.better + "\" để câu chuẩn hơn nhé."); }
    const nat = arr(r.naturalPhrasing)[0];
    if (nat) { k++; lines.push(k + ". Nói tự nhiên hơn: thay vì \"" + nat.said + "\", người bản xứ hay nói \"" + nat.moreNatural + "\"."); }
    if (!k) lines.push("1. Em cứ giữ phong độ này và luyện thêm cho tự nhiên hơn nhé.");
    lines.push("");
    const ch = r.nextChallenge || {};
    lines.push("🎯 Thử thách nhỏ buổi sau: " + (ch.scenario ? ch.scenario + " " : "") + "Trong 5 phút đầu buổi học tới, cô trò mình sẽ cùng luyện lại để em nói mượt mà hơn nha! Tiếp tục phát huy nhé em! 💪");
    return lines.join("\n");
  }

  /* Dữ liệu mẫu (chỉ để xem thử giao diện khi chưa nối Apps Script; KHÔNG phải kết quả chấm thật) */
  function sampleResult() {
    return {
      transcript: "Hello, my name is Linh. I work at a bank, in the customer service department. Every morning I check app to see new messages. Because the messages are important, so I answer them quickly. I use my laptop to write emails. For example, I send file to my manager. [sample]",
      audioNote: "ĐÂY LÀ KẾT QUẢ MẪU để xem giao diện, không phải chấm thật.",
      scores: { endSounds: { score: 10, comment: "Mẫu: âm /f/ đã có nhưng /v/ còn yếu." }, wordStress: { score: 7, comment: "Mẫu." }, intonation: { score: 3, comment: "Mẫu." }, lessonVocab: { score: 11, comment: "Mẫu." }, phrases: { score: 5, comment: "Mẫu." }, targetGrammar: { score: 7, comment: "Mẫu." }, connectors: { score: 8, comment: "Mẫu." }, pace: { score: 7, comment: "Mẫu." } },
      pronunciationIssues: [{ word: "video", time: "00:21", heard: "wideo", expected: "/ˈvɪdioʊ/", tip: "Chạm răng trên vào môi dưới để ra âm /v/ (mẫu).", confidence: "medium" }],
      vocabUsed: ["customer service", "laptop", "manager"], vocabMissing: ["tech-savvy"], phrasesUsed: [], phrasesMissing: ["work-life balance"],
      connectorsUsed: ["because", "so", "for example"],
      grammarErrors: [{ said: "I check app", better: "I check the app", rule: "Thiếu mạo từ (mẫu)" }, { said: "I send file", better: "I send the file", rule: "Thiếu mạo từ (mẫu)" }],
      strengths: ["Giọng rõ ràng và bài nói có mở đầu, thân bài (mẫu)."], weaknesses: ["Còn thiếu mạo từ trước danh từ đếm được (mẫu)."],
      improvements: [{ title: "Luyện /f/ - /v/", how: "Đọc cặp file - vile, fan - van 5 lần (mẫu).", practice: "Ghi âm lại 3 câu có từ file, video, app." }],
      naturalPhrasing: [{ said: "I check app", moreNatural: "I check my work apps", why: "Tự nhiên hơn trong ngữ cảnh công sở (mẫu)." }],
      nextChallenge: { scenario: "Gọi điện cho đồng nghiệp để hỏi họ đã nhận file chưa.", sentences: ["Did you get the file I sent?", "Could you check your email, please?"] },
      confidence: "low"
    };
  }

  const api = {
    RUBRIC: RUBRIC, ITEMS: ITEMS, ITEM: ITEM, MAX_TOTAL: MAX_TOTAL, MAX_AI_PART: MAX_AI_PART, DEFAULT_SETTINGS: DEFAULT_SETTINGS,
    bandOf: bandOf, lengthScore: lengthScore, analyzeSamples: analyzeSamples, textStats: textStats,
    sanitize: sanitize, totals: totals, buildZalo: buildZalo, sampleResult: sampleResult, half: half, clamp: clamp
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else { root.LSE = root.LSE || {}; root.LSE.spk = api; }
})(typeof window !== "undefined" ? window : globalThis);
