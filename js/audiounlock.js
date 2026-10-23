/* Mở khoá âm thanh trên iPhone/iPad (Safari).
   - Web Audio mặc định bị công tắc "im lặng" chặn và chỉ chạy sau khi chạm màn hình.
   - Cách xử lý: đặt audioSession = playback + phát một file im lặng lặp lại (để iOS coi trang là "đang phát nhạc").
   File này dùng chung cho site và cả 3 game (chạy trong iframe), gọi nhiều lần cũng an toàn. */
(function () {
  if (window.__lseAudioUnlock) return; window.__lseAudioUnlock = 1;
  var done = false, el = null;
  function wav() {
    var n = 8000, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
    function w(o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); }
    w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVE"); w(12, "fmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
    for (var i = 0; i < n; i++) v.setInt16(44 + i * 2, (i % 2 ? 1 : -1), true);   // nhiễu cực nhỏ, không nghe thấy
    return URL.createObjectURL(new Blob([b], { type: "audio/wav" }));
  }
  function unlock() {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) { }
    try {
      if (!el) { el = new Audio(wav()); el.loop = true; el.volume = 0.05; el.setAttribute("playsinline", ""); }
      var p = el.play(); if (p && p.catch) p.catch(function () { done = false; });
    } catch (e) { }
    done = true;
  }
  ["touchstart", "touchend", "pointerdown", "click", "keydown"].forEach(function (ev) {
    addEventListener(ev, function () { if (!done) unlock(); }, { passive: true, capture: true });
  });
  document.addEventListener("visibilitychange", function () { if (!document.hidden && el && done) { try { el.play().catch(function () { }); } catch (e) { } } });
})();
