/* Ảnh biểu tượng (assets/ui) + chibi cô Thảo chuyển động.
   - L.ei(emoji, px): trả về ảnh nếu có ảnh thay cho emoji đó, không thì giữ emoji (ảnh thiếu cũng tự quay về emoji).
   - L.mascot.el({pose, height}): chibi nhún nhảy, chạm vào thì nhảy lên và nói; đổi tư thế theo tình huống. */
window.LSE = window.LSE || {};
(function (L) {
  const h = L.h;
  const BASE = "assets/ui/";
  const EMO = { "🌱": "gt-starters", "🚀": "gt-flyers", "🔥": "nv-combo", "❤️": "tim", "🖤": "tim-mat", "🎁": "hop-qua", "🛍️": "o-cuahang", "🗺️": "o-bando",
    "👾": "o-boss", "🔁": "nv-onlai", "✅": "nv-dung", "🎯": "nv-dung", "🔧": "nv-suasai", "🎮": "nv-luyentap", "🕹️": "nv-game", "📝": "nv-nopbai" };
  /** ảnh theo tên file (không đuôi) trong assets/ui; thiếu ảnh thì hiện emoji dự phòng fb */
  function ico(name, fb, px, cls) {
    if (!name) return fb || "";
    const im = h("img.ico" + (cls ? "." + cls : ""), { src: BASE + name + ".png", alt: fb || "", draggable: "false", style: px ? "width:" + px + "px;height:" + px + "px" : null });
    im.addEventListener("error", () => im.replaceWith(document.createTextNode(fb || "")), { once: true });
    return im;
  }
  /* sách Global Success: quyển sách kawaii có mặt cười + số lớp (vẽ bằng SVG, không cần ảnh) */
  const BOOKS = { "📘": ["#8CCBFF", "#4C9BEA", "4"], "📗": ["#9EE6B0", "#43B06A", "5"], "📙": ["#FFCB8A", "#EE9540", "7"], "📕": ["#FFA3B8", "#E05780", "8"] };
  function bookSvg(c) {
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="60" rx="21" ry="3" fill="rgba(80,60,140,.15)"/><rect x="14" y="8" width="42" height="48" rx="6" fill="#fff" stroke="${c[1]}" stroke-width="2"/><rect x="9" y="5" width="42" height="49" rx="7" fill="${c[0]}" stroke="${c[1]}" stroke-width="2.4"/><rect x="9" y="5" width="8" height="49" rx="4" fill="${c[1]}"/><circle cx="29" cy="25" r="3.8" fill="#3A2B4D"/><circle cx="43" cy="25" r="3.8" fill="#3A2B4D"/><circle cx="27.8" cy="23.6" r="1.3" fill="#fff"/><circle cx="41.8" cy="23.6" r="1.3" fill="#fff"/><ellipse cx="24" cy="32" rx="3.6" ry="2.3" fill="#FF8FB0" opacity=".7"/><ellipse cx="48" cy="32" rx="3.6" ry="2.3" fill="#FF8FB0" opacity=".7"/><path d="M32 31.5 Q36 36.5 40 31.5" fill="none" stroke="#3A2B4D" stroke-width="2.2" stroke-linecap="round"/><circle cx="31" cy="45" r="6.6" fill="#fff" stroke="${c[1]}" stroke-width="1.6"/><text x="31" y="48.6" text-anchor="middle" font-size="10" font-weight="800" font-family="Arial,sans-serif" fill="${c[1]}">${c[2]}</text><path d="M46 9 l1.6 3.4 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" fill="#FFE27A" stroke="#F2B64A" stroke-width=".8"/></svg>`;
  }
  function ei(emo, px, cls) {
    if (BOOKS[emo]) return h("span.ico.bk" + (cls ? "." + cls : ""), { role: "img", "aria-label": "Sách", style: px ? "width:" + px + "px;height:" + px + "px" : null, html: bookSvg(BOOKS[emo]) });
    const n = EMO[emo]; return n ? ico(n, emo, px, cls) : emo;
  }

  /* mỗi tư thế có vài kiểu ảnh, chọn ngẫu nhiên và đổi kiểu khi chạm vào */
  const VARS = { guide: ["chibi-chi-bang", "chibi-dung", "chibi-vay-tay"], praise: ["chibi-nhay-mat", "chibi-co-vu"], win: ["chibi-an-mung", "chibi-reo-ho"], sleepy: ["chibi-ngap"] };
  const POSES = { guide: VARS.guide[0], praise: VARS.praise[0], win: VARS.win[0], sleepy: VARS.sleepy[0] };
  const SAY = {
    guide: ["Hôm nay mình ôn gì nào? 🌱", "Chọn một unit rồi chơi thử nhé!", "Cô ở đây nè, em cứ học đi!", "Sai cũng không sao, làm lại là nhớ lâu hơn!"],
    praise: ["Giỏi lắm! Cô khen em nè! 👍", "Em đang tiến bộ thật nhanh!", "Hôm nay em chăm quá, cô vui lắm!"],
    win: ["Hoàn thành rồi! Em đỉnh quá! 🏆", "Cô tự hào về em lắm!", "Ăn mừng thôi nào! 🎉"],
    sleepy: ["Ơ… cô hơi buồn ngủ rồi… học với cô một chút nhé?", "Aaa… em ơi, mình học chút rồi nghỉ nha!"]
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const url = (pose, avoid) => { const v = VARS[pose] || VARS.guide, c = v.filter(x => x !== avoid); return BASE + pick(c.length ? c : v) + ".png"; };
  /** avatar học sinh: ảnh av-<id>, thiếu ảnh thì hiện emoji */
  function avImg(a, px) { return a && a.im ? ico(a.im, a.e, px, "avimg") : (a ? a.e : ""); }
  const reduce = () => { try { return matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };

  /** chibi động. o = { pose, height, idleSleep (bool: lâu không chạm thì ngáp) } */
  function el(o) {
    o = o || {}; let pose = POSES[o.pose] ? o.pose : "guide"; const hgt = o.height || 240;
    let cur = url(pose); const img = h("img", { src: cur, alt: "Cô Thảo", draggable: "false" });
    img.addEventListener("error", () => { img.src = "assets/chibi.png"; img.classList.add("fallback"); }, { once: true });
    const say = h("div.m-say");
    const root = h("div.mascot.pose-" + pose, { style: "height:" + hgt + "px", role: "img", "aria-label": "Cô Thảo" },
      h("span.m-sp", "✨"), h("span.m-sp", "⭐"), h("span.m-sp", "💖"), img, say);
    let sayT = 0, idleT = 0;
    function speak(txt, ms) { say.textContent = txt; say.classList.add("on"); clearTimeout(sayT); sayT = setTimeout(() => say.classList.remove("on"), ms || 3200); }
    function set(p, txt) {
      if (!POSES[p]) return; root.classList.remove("pose-" + pose); pose = p; root.classList.add("pose-" + p);
      root.classList.remove("swap"); void root.offsetWidth; root.classList.add("swap"); cur = url(p, cur.split("/").pop().replace(".png", "")); img.src = cur; img.classList.remove("fallback");
      if (txt !== false) speak(txt || pick(SAY[p]));
    }
    function jump() { if (reduce()) return; root.classList.remove("jump"); void root.offsetWidth; root.classList.add("jump"); }
    root.addEventListener("click", () => { wake(); jump(); speak(pick(SAY[pose])); if ((VARS[pose] || []).length > 1) { cur = url(pose, cur.split("/").pop().replace(".png", "")); img.src = cur; } });
    function wake() { clearTimeout(idleT); if (pose === "sleepy") set("guide", "Cô tỉnh rồi! Mình học tiếp nào!"); arm(); }
    function arm() { if (!o.idleSleep) return; clearTimeout(idleT); idleT = setTimeout(() => { if (document.body.contains(root)) set("sleepy"); }, o.idleSleep); }
    if (o.idleSleep) { arm(); ["pointerdown", "keydown"].forEach(ev => window.addEventListener(ev, function f() { if (!document.body.contains(root)) { window.removeEventListener(ev, f); return; } wake(); }, { passive: true })); }
    root.set = set; root.speak = speak; root.jump = jump;
    if (o.say) setTimeout(() => speak(o.say === true ? pick(SAY[pose]) : o.say), 700);
    return root;
  }
  /** tư thế gợi ý cho trang chủ học sinh */
  function homePose() {
    try {
      if (!L.auth || L.auth.role !== "student") return "guide";
      const p = L.prof.get(), q = p.quest; const t = L.prof.today();
      if (q.day === t && q.bonus) return "win";
      if (p.streak.last === t) return "praise";
    } catch (e) { }
    return "guide";
  }
  L.ei = ei; L.ico = ico; L.avImg = avImg; L.mascot = { el, homePose, POSES, SAY };
})(window.LSE);
