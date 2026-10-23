/* Lớp bảo vệ phần đọc giọng nói (dùng chung cho mọi app/game).
   Mục tiêu: máy chỉ đọc ĐÚNG TỪ VỰNG, không đọc kèm ký hiệu phiên âm, chú thích (n)/(v), emoji hay dòng "rác";
   không để hàng đợi tích tụ khi bấm liên tiếp (bấm nhanh = đọc chồng nhiều lần); luôn chọn giọng tiếng Anh nếu máy có.
   Chỉ can thiệp vào câu tiếng Anh; câu có chữ tiếng Việt giữ nguyên. Gọi nhiều lần cũng an toàn. */
(function () {
  if (window.__lseTtsGuard) return; window.__lseTtsGuard = 1;
  if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return;
  var ss = window.speechSynthesis, orig = ss.speak.bind(ss);
  var VI = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
  var IPA = /[ˈˌəɪʊæɔʃʒŋθðɑɜɒʌː]/;
  var lastText = "", lastAt = 0, voice = null;
  function rank(v) {
    var r = 0, n = v.name || "";
    if (/en[-_]GB/i.test(v.lang)) r += 30; else if (/en[-_]US/i.test(v.lang)) r += 20; else if (/en[-_](AU|IE|CA|NZ)/i.test(v.lang)) r += 10;
    if (/google uk english female|sonia|libby|natural|samantha|serena|kate|karen|moira|ava|susan/i.test(n)) r += 10;
    if (/espeak|compact|novelty|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|trinoids|whisper|zarvox|albert|fred|junior|kathy|ralph/i.test(n)) r -= 50;
    return r;
  }
  function enVoice() {
    if (voice) return voice;
    var vs = []; try { vs = ss.getVoices() || []; } catch (e) { }
    var en = vs.filter(function (v) { return /^en([-_]|$)/i.test(v.lang); }).sort(function (a, b) { return rank(b) - rank(a); });
    voice = en[0] || null; return voice;
  }
  try { ss.addEventListener("voiceschanged", function () { voice = null; }); } catch (e) { }
  function clean(t) {
    t = String(t == null ? "" : t);
    t = t.replace(/[\/\[]([^\/\]\n]{1,40})[\/\]]/g, function (m, inner) { return IPA.test(inner) ? " " : m; });   // /ˈsɪnəmə/ , [kɪn]
    t = t.replace(/\((?:n|v|adj|adv|prep|conj|pron|phr|pl|sing|noun|verb|adjective|adverb)\.?\)/gi, " ");             // (n) (v) (adj)
    t = t.replace(/[←-⯿☀-➿️‍]|[\uD83C-\uD83E][\uDC00-\uDFFF]/g, " ");                  // emoji, mũi tên, ký hiệu
    t = t.replace(/[•·▪■□●○★☆✓✔✗✘✅❌→←↑↓…]/g, " ");
    return t.replace(/\s+/g, " ").trim();
  }
  ss.speak = function (u) {
    try {
      if (!u || typeof u.text !== "string") return orig(u);
      if (VI.test(u.text)) return orig(u);                       // tiếng Việt: không đụng vào
      var txt = clean(u.text);
      if (!txt) return;                                          // không còn gì để đọc
      var now = Date.now();
      /* bấm đúp/chạm+click cùng lúc → bỏ lần trùng, tránh đọc chồng */
      if (txt === lastText && now - lastAt < 350) return;
      lastText = txt; lastAt = now;
      if (txt !== u.text) u.text = txt;
      var v = u.voice;
      if (!v || !/^en([-_]|$)/i.test(v.lang || "")) { var e = enVoice(); if (e) { u.voice = e; u.lang = e.lang; } else if (!u.lang || !/^en/i.test(u.lang)) u.lang = "en-GB"; }
      /* hàng đợi cũ còn kẹt (thiết bị bị treo giọng đọc) → xoá trước khi đọc câu mới */
      if (ss.pending && !ss.speaking && now - (ss.__lseQ || 0) > 1500) { try { ss.cancel(); } catch (e2) { } }
      ss.__lseQ = now;
    } catch (e) { }
    return orig(u);
  };
})();
