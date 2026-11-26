/* ============================================================
   BỘ TỪ DÙNG CHUNG CHO GAME (Trung tâm trò chơi)
   Game chèn <script src="../../js/gameset.js"> ở đầu file. Khi được mở với ?set=<mã bộ từ>
   thì có window.GAMESET = {id, title, items:[{w,vi,ipa?,img?,v2?,v3?}], text(), pics}.
   - ?set=custom : bộ từ cô/em tự dán, lấy từ sessionStorage "lse_custom_set" (có thể kèm mcq: câu trắc nghiệm lấy từ bài tập)
   - ?set=<id>   : đọc data/wordsets/<id>.json
   Không có ?set thì game chạy như cũ (không có GAMESET).
   ============================================================ */
(function () {
  var q = new URLSearchParams(location.search), id = q.get("set");
  if (!id) return;
  var root = location.pathname.replace(/\/apps\/.*$/, "/");
  var base = location.origin + root + "data/wordsets/";
  var d = null;
  try {
    if (id === "custom") d = JSON.parse(sessionStorage.getItem("lse_custom_set") || "null");
    else { var x = new XMLHttpRequest(); x.open("GET", base + encodeURIComponent(id) + ".json", false); x.send(); if (x.status === 200 || (x.status === 0 && x.responseText)) d = JSON.parse(x.responseText); }
  } catch (e) { d = null; }
  if (d && !Array.isArray(d.items)) d.items = [];
  /* câu trắc nghiệm (từ bài tập): d.mcq = [{q, o:[đáp án đúng, ...nhiễu], why?, img?}], đáp án đúng luôn nằm đầu, tối đa 4 lựa chọn */
  if (d) d.mcq = (Array.isArray(d.mcq) ? d.mcq : []).filter(function (m) { return m && m.q && Array.isArray(m.o) && m.o.length >= 3 && m.o[0]; })
    .map(function (m) { return { q: String(m.q), o: m.o.slice(0, 4).map(String), why: m.why ? String(m.why) : "", img: m.img || "" }; });
  if (!d || (!d.items.length && !d.mcq.length)) { window.GAMESET_ERROR = "Không đọc được bộ từ \"" + id + "\""; return; }
  d.id = id;
  d.items = d.items.filter(function (it) { return it && it.w; }).map(function (it) {
    var o = Object.assign({}, it);
    if (o.img && !/^(https?:|data:)/.test(o.img)) o.img = new URL(o.img, base).href;
    return o;
  });
  d.pics = d.items.filter(function (it) { return it.img; }).length;
  /* mỗi dòng "từ | nghĩa" (dùng cho Đào Vàng, Xí Ngầu) */
  d.text = function () { return d.items.filter(function (it) { return it.vi; }).map(function (it) { return it.w.replace(/\|/g, "/") + " | " + it.vi.replace(/\|/g, "/"); }).join("\n"); };
  /* ---- câu trắc nghiệm dưới dạng văn bản, cho các game nhập "bài học" bằng chữ (mỗi game một kiểu dòng) ---- */
  var sq = function (t) { return String(t).replace(/\/\//g, "/").replace(/=>/g, "→").replace(/\s+/g, " ").trim(); };
  var so = function (t) { return sq(t).replace(/[|\[\]{}]/g, "/").replace(/;/g, ",").trim(); };
  d.hasMcq = d.mcq.length > 0;
  /* kiểu "Câu có ___ [đúng|sai|sai|sai] ... // giải thích": Xí Ngầu, Dap Ruồi, Uno, Dino */
  d.mcqBracket = function () {
    return d.mcq.map(function (m) { var tok = "[" + m.o.map(so).join("|") + "]", q = sq(m.q).replace(/[\[\]{}]/g, "("); q = q.indexOf("___") >= 0 ? q.replace("___", tok) : q + " " + tok; return q + (m.why ? " // " + sq(m.why) : ""); }).join("\n");
  };
  /* kiểu Đào Vàng: mỗi câu là một khối "# tên / Sai: ... / câu có [đúng] | giải thích" */
  d.mcqBlocks = function () {
    return d.mcq.map(function (m, i) { var q = sq(m.q).replace(/[\[\]|]/g, "("); q = q.indexOf("___") >= 0 ? q.replace("___", "[" + so(m.o[0]) + "]") : q + " [" + so(m.o[0]) + "]"; return "# Câu " + (i + 1) + ""+ "\nSai: " + m.o.slice(1).map(function (x) { return so(x).replace(/[,\/]/g, " "); }).join(", ") + "\n" + q; }).join("\n");
  };
  /* kiểu Pirate: mc | câu | a;b;c;d | số thứ tự đáp án đúng | giải thích */
  d.mcqPipe = function () {
    return d.mcq.map(function (m) { return "mc | " + sq(m.q).replace(/\|/g, "/") + " | " + m.o.slice(0, 4).map(function (x) { return so(x); }).join(";") + " | 1 | " + sq(m.why || ""); }).join("\n");
  };
  window.GAMESET = d;
})();
