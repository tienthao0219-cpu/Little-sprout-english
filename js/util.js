/* Tiện ích dùng chung */
window.LSE = window.LSE || {};
(function (L) {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /** h('div.card#id', {onclick:fn, class:'x'}, child, 'text', [children]) */
  function h(tag, attrs, ...kids) {
    const m = String(tag).match(/^([a-zA-Z0-9]+)?((?:[.#][\w-]+)*)$/) || [];
    const el = document.createElement(m[1] || "div");
    (m[2] || "").replace(/([.#])([\w-]+)/g, (_, k, v) => { if (k === ".") el.classList.add(v); else el.id = v; });
    if (attrs && (typeof attrs !== "object" || attrs.nodeType || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (k === "class") v.split(" ").filter(Boolean).forEach(c => el.classList.add(c));
      else if (k === "html") el.innerHTML = v;
      else if (k === "value") el.value = v;
      else if (k === "checked" || k === "selected" || k === "disabled") { if (v) el[k] = true; }
      else el.setAttribute(k, v === true ? "" : v);
    }
    (function add(list) {
      for (const c of list) {
        if (c == null || c === false) continue;
        if (Array.isArray(c)) add(c);
        else el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
      }
    })(kids);
    return el;
  }

  /* append() an toàn: bỏ qua null/false và tự trải mảng (trình duyệt gốc sẽ in chữ "null" hoặc "[object ...]") */
  const nativeAppend = Element.prototype.append;
  Element.prototype.append = function (...kids) {
    const self = this;
    (function add(list) { for (const c of list) { if (c == null || c === false) continue; if (Array.isArray(c)) add(c); else nativeAppend.call(self, c); } })(kids);
  };

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = (p) => (p || "id") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const slug = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "item";
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  /** chuẩn hoá để so đáp án: bỏ hoa/thường, dấu nháy cong, khoảng trắng thừa, dấu câu cuối */
  const norm = s => String(s == null ? "" : s).normalize("NFC").toLowerCase().replace(/[’‘`´]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().replace(/[.!?,;:]+$/g, "").trim();
  /** so tên học viên: bỏ hoa/thường, dấu tiếng Việt, khoảng trắng thừa ("Bin", "bin", " BIN " cùng một người) */
  const plain = s => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/\s+/g, " ").trim();
  const sameName = (a, b) => !!plain(a) && plain(a) === plain(b);
  const fmtDate = t => { if (!t) return ""; const d = new Date(t); if (isNaN(d)) return String(t); const p = n => String(n).padStart(2, "0"); return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`; };
  const fmtDur = s => { s = Math.round(s || 0); return s >= 60 ? Math.floor(s / 60) + " phút " + (s % 60) + " giây" : s + " giây"; };
  const round2 = n => Math.round(n * 100) / 100;


  /** pháo giấy mừng điểm cao (không dùng thư viện; tự tắt nếu máy bật "giảm chuyển động") */
  function confetti(n) {
    try { if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return; } catch (e) { }
    const cv = document.createElement("canvas"); cv.className = "confetti";
    const dpr = Math.min(window.devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; document.body.appendChild(cv);
    const ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
    const cols = ["#FF9EBB", "#9ED8FF", "#B9A8F0", "#FFE08A", "#8FDDBA", "#FFB38A"];
    const ps = Array.from({ length: n || 90 }, () => ({ x: W / 2 + (Math.random() - .5) * 120, y: H * .38, vx: (Math.random() - .5) * 13, vy: -Math.random() * 13 - 4, g: .32 + Math.random() * .12, w: 6 + Math.random() * 7, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[(Math.random() * cols.length) | 0], round: Math.random() < .3 }));
    let t0 = performance.now();
    (function tick(now) {
      const dt = now - t0; ctx.clearRect(0, 0, W, H);
      ps.forEach(p => { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.max(0, 1 - dt / 2600); ctx.fillStyle = p.c; if (p.round) { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 7); ctx.fill(); } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (dt < 2600) requestAnimationFrame(tick); else cv.remove();
    })(t0);
  }

  function toast(msg, ms) {
    const t = h("div.toast", msg);
    $("#toastRoot").appendChild(t);
    setTimeout(() => t.remove(), ms || 2600);
  }

  function modal(build, opts) {
    opts = opts || {};
    const bg = h("div.modal-bg");
    const box = h("div.modal" + (opts.wide ? ".wide" : ""));
    const close = () => bg.remove();
    box.appendChild(build(close));
    bg.appendChild(box);
    if (!opts.sticky) bg.addEventListener("mousedown", e => { if (e.target === bg) close(); });
    $("#modalRoot").appendChild(bg);
    return close;
  }

  function confirmBox(text, yes) {
    return new Promise(res => {
      modal(close => h("div", h("p", { style: "font-size:17px;margin-top:0" }, text),
        h("div.row", { style: "justify-content:flex-end" },
          h("button.btn.ghost", { onclick: () => { close(); res(false); } }, "Huỷ"),
          h("button.btn.rose", { onclick: () => { close(); res(true); } }, yes || "Đồng ý"))), { sticky: true });
    });
  }

  function copyText(text) {
    const done = () => toast("Đã sao chép ✓");
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
    function fallback() {
      const ta = h("textarea", { style: "position:fixed;opacity:0" }); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("Không sao chép được, hãy bôi đen và copy thủ công"); }
      ta.remove();
    }
  }

  function fileToBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => { const s = String(r.result); res(s.slice(s.indexOf(",") + 1)); };
      r.onerror = () => rej(r.error);
      r.readAsDataURL(file);
    });
  }
  const textToBase64 = s => { const b = new TextEncoder().encode(s); let bin = ""; b.forEach(x => bin += String.fromCharCode(x)); return btoa(bin); };
  const base64ToText = b => { const bin = atob(b.replace(/\s/g, "")); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return new TextDecoder().decode(u); };

  /** Enter trong ô gõ của một câu: còn ô trống kế tiếp thì nhảy sang ô đó, hết ô trống thì kiểm tra câu (không bắt Enter khi đang gõ dấu tiếng Việt) */
  function enterCheck(root, check) {
    root.addEventListener("keydown", e => {
      if (e.key !== "Enter" || e.isComposing || e.keyCode === 229 || e.shiftKey) return;
      const t = e.target; if (!t || !/^(INPUT|TEXTAREA)$/.test(t.tagName) || t.disabled) return;
      const boxes = [...root.querySelectorAll("input.blank:not([disabled]), textarea.blank:not([disabled])")];
      const i = boxes.indexOf(t); if (i < 0) return;
      e.preventDefault();
      const next = boxes.slice(i + 1).find(x => !x.value.trim());
      if (next) { next.focus(); return; }
      check();
      /* sau khi chấm, đưa con trỏ sang câu kế tiếp còn trống */
      setTimeout(() => { const n = document.querySelector("input.blank:not([disabled]):not(.k-right):not(.k-wrong), textarea.blank:not([disabled]):not(.k-right):not(.k-wrong)"); if (n) n.focus(); }, 80);
    });
  }

  Object.assign(L, { confetti, $, $$, h, esc, uid, slug, shuffle, norm, plain, sameName, fmtDate, fmtDur, round2, toast, modal, confirmBox, copyText, fileToBase64, textToBase64, base64ToText, enterCheck });
})(window.LSE);
