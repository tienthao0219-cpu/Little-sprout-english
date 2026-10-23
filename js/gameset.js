/* ============================================================
   BỘ TỪ DÙNG CHUNG CHO GAME (Trung tâm trò chơi)
   Game chèn <script src="../../js/gameset.js"> ở đầu file. Khi được mở với ?set=<mã bộ từ>
   thì có window.GAMESET = {id, title, items:[{w,vi,ipa?,img?,v2?,v3?}], text(), pics}.
   - ?set=custom : bộ từ cô/em tự dán, lấy từ sessionStorage "lse_custom_set"
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
  if (!d || !Array.isArray(d.items) || !d.items.length) { window.GAMESET_ERROR = "Không đọc được bộ từ \"" + id + "\""; return; }
  d.id = id;
  d.items = d.items.filter(function (it) { return it && it.w; }).map(function (it) {
    var o = Object.assign({}, it);
    if (o.img && !/^(https?:|data:)/.test(o.img)) o.img = new URL(o.img, base).href;
    return o;
  });
  d.pics = d.items.filter(function (it) { return it.img; }).length;
  /* mỗi dòng "từ | nghĩa" (dùng cho Đào Vàng, Xí Ngầu) */
  d.text = function () { return d.items.filter(function (it) { return it.vi; }).map(function (it) { return it.w.replace(/\|/g, "/") + " | " + it.vi.replace(/\|/g, "/"); }).join("\n"); };
  window.GAMESET = d;
})();
