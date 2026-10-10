/* Thú nuôi: mỗi học sinh chọn 1 bạn đồng hành hiện nhỏ ở góc phải màn hình.
   - Làm đúng: độ cute tăng, lên cấp, có phụ kiện mới. Lâu không học: độ cute giảm dần, thú nằm ngủ.
   - Tranh vẽ bằng SVG (không cần tải file ảnh). Dữ liệu nằm trong hồ sơ (profile.js) nên đồng bộ lên Google Sheets. */
window.LSE = window.LSE || {};
(function (L) {
  const { h } = L;
  const DAY = 86400000;

  /* ---------- các loài ---------- */
  const SP = {
    cat:     { n: "Mèo con",   p: 0,   body: "#FFCBA4", belly: "#FFF1E2", ear: "tri",    inner: "#FFA9BA", tail: "curl", tailC: "#FFB98A", nose: "#F28BA0" },
    dog:     { n: "Cún con",   p: 0,   body: "#EBCB9F", belly: "#FFF3DF", ear: "floppy", inner: "#C99B6B", tail: "short", tailC: "#DDB886", nose: "#4A3A3A" },
    bunny:   { n: "Thỏ bông",  p: 0,   body: "#FFE6F0", belly: "#FFFFFF", ear: "long",   inner: "#FFB5CF", tail: "puff", tailC: "#FFFFFF", nose: "#F28BA0" },
    chick:   { n: "Gà con",    p: 0,   body: "#FFE27A", belly: "#FFF3B0", ear: "none",   tuft: true, beak: "#FF9F43", wing: "#FFD54F", nose: "" },
    panda:   { n: "Gấu trúc",  p: 40,  body: "#FFFFFF", belly: "#F4F4F8", ear: "round",  earC: "#3B3F4E", inner: "", patch: "#3B3F4E", feet: "#3B3F4E", nose: "#3B3F4E" },
    fox:     { n: "Cáo nhỏ",   p: 50,  body: "#FFA766", belly: "#FFF4E8", ear: "tri",    earC: "#FF9250", inner: "#4A3535", cheek: "#FFFFFF", tail: "big", tailC: "#FF9A55", tailTip: "#FFFFFF", nose: "#4A3535" },
    penguin: { n: "Cánh cụt",  p: 60,  body: "#5B6C8F", belly: "#FFFFFF", ear: "none",   face: "#FFFFFF", beak: "#FFA94D", feet: "#FFA94D", nose: "" },
    hamster: { n: "Chuột hamster", p: 70, body: "#FFD9A8", belly: "#FFF6E8", ear: "round", earC: "#FFD09A", inner: "#FFB5C8", wide: true, nose: "#F28BA0" },
    frog:    { n: "Ếch xanh",  p: 80,  body: "#A5E3A8", belly: "#EAFBE4", ear: "none",   eyeBump: true, nose: "" },
    dragon:  { n: "Rồng nhỏ",  p: 150, body: "#8FDDBA", belly: "#FFF3C4", ear: "horn",   inner: "#FFD76B", tail: "spade", tailC: "#79CBA7", wingC: "#FFB8D0", spikes: true, nose: "#5BAE8F" },
    unicorn: { n: "Kỳ lân",    p: 200, body: "#FFFFFF", belly: "#F6F0FF", ear: "tri",    earC: "#FFFFFF", inner: "#F6C6E0", horn: true, mane: true, tail: "mane", nose: "#F28BA0" }
  };
  const LEVELS = [0, 15, 40, 80, 140, 220, 320];
  const TITLES = ["Bé nhỏ", "Bé ngoan", "Cưng xỉu", "Ngôi sao nhỏ", "Siêu sao", "Hoàng gia", "Huyền thoại"];
  const lvOf = xp => { let l = 0; LEVELS.forEach((t, i) => { if (xp >= t) l = i; }); return l; };
  const INK = "#2B3550", STROKE = "rgba(43,53,80,.22)";

  /* ---------- vẽ ---------- */
  function svg(kind, o) {
    o = o || {}; const s = SP[kind]; if (!s) return "";
    const mood = o.mood || "normal", lv = o.level || 0, cute = o.cute == null ? 50 : o.cute;
    const st = `stroke="${STROKE}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`;
    let back = "", front = "";
    // cánh (cấp 6+)
    if (lv >= 5) back += `<g opacity=".95"><ellipse cx="15" cy="62" rx="12" ry="8" transform="rotate(-25 15 62)" fill="#FFE3F1" ${st}/><ellipse cx="85" cy="62" rx="12" ry="8" transform="rotate(25 85 62)" fill="#DDEBFF" ${st}/></g>`;
    if (s.wingC) back += `<ellipse cx="18" cy="60" rx="11" ry="7" transform="rotate(-30 18 60)" fill="${s.wingC}" ${st}/><ellipse cx="82" cy="60" rx="11" ry="7" transform="rotate(30 82 60)" fill="${s.wingC}" ${st}/>`;
    // đuôi
    if (s.tail === "curl") back += `<path d="M72 84 Q96 80 90 60 Q88 54 84 58" fill="none" stroke="${s.tailC}" stroke-width="9" stroke-linecap="round"/>`;
    if (s.tail === "short") back += `<ellipse cx="78" cy="82" rx="7" ry="5" transform="rotate(-30 78 82)" fill="${s.tailC}" ${st}/>`;
    if (s.tail === "puff") back += `<circle cx="76" cy="86" r="8" fill="${s.tailC}" ${st}/>`;
    if (s.tail === "big") back += `<path d="M70 86 Q100 90 92 56 Q82 66 70 76 Z" fill="${s.tailC}" ${st}/><path d="M92 56 Q96 70 90 80 Q84 72 82 64 Z" fill="${s.tailTip}" opacity=".95"/>`;
    if (s.tail === "spade") back += `<path d="M72 86 Q92 92 92 74" fill="none" stroke="${s.tailC}" stroke-width="7" stroke-linecap="round"/><path d="M92 66 l7 8 l-8 4 z" fill="#FFD76B" ${st}/>`;
    if (s.tail === "mane") back += `<path d="M72 80 Q96 78 90 98 Q80 92 74 90 Z" fill="#E7C9FF" ${st}/>`;
    // thân + chân
    const bodyC = s.body, ft = s.feet || s.body;
    back += `<ellipse cx="50" cy="80" rx="23" ry="16" fill="${bodyC}" ${st}/><ellipse cx="50" cy="83" rx="14" ry="10" fill="${s.belly}" opacity=".95"/>`;
    back += `<ellipse cx="36" cy="94" rx="9" ry="5" fill="${ft}" ${st}/><ellipse cx="64" cy="94" rx="9" ry="5" fill="${ft}" ${st}/>`;
    if (s.wing) back += `<ellipse cx="29" cy="78" rx="7" ry="10" transform="rotate(15 29 78)" fill="${s.wing}" ${st}/><ellipse cx="71" cy="78" rx="7" ry="10" transform="rotate(-15 71 78)" fill="${s.wing}" ${st}/>`;
    // tai (phía sau đầu)
    const ec = s.earC || s.body;
    switch (s.ear) {
      case "tri": back += `<path d="M24 38 L26 12 L44 26 Z" fill="${ec}" ${st}/><path d="M76 38 L74 12 L56 26 Z" fill="${ec}" ${st}/><path d="M28 30 L29 19 L38 26 Z" fill="${s.inner}"/><path d="M72 30 L71 19 L62 26 Z" fill="${s.inner}"/>`; break;
      case "floppy": back += `<ellipse cx="22" cy="46" rx="9" ry="16" transform="rotate(12 22 46)" fill="${s.inner}" ${st}/><ellipse cx="78" cy="46" rx="9" ry="16" transform="rotate(-12 78 46)" fill="${s.inner}" ${st}/>`; break;
      case "long": back += `<ellipse cx="36" cy="14" rx="8" ry="19" transform="rotate(-8 36 14)" fill="${ec}" ${st}/><ellipse cx="64" cy="14" rx="8" ry="19" transform="rotate(8 64 14)" fill="${ec}" ${st}/><ellipse cx="36" cy="16" rx="4" ry="13" transform="rotate(-8 36 16)" fill="${s.inner}"/><ellipse cx="64" cy="16" rx="4" ry="13" transform="rotate(8 64 16)" fill="${s.inner}"/>`; break;
      case "round": back += `<circle cx="26" cy="27" r="10" fill="${ec}" ${st}/><circle cx="74" cy="27" r="10" fill="${ec}" ${st}/>` + (s.inner ? `<circle cx="26" cy="28" r="5" fill="${s.inner}"/><circle cx="74" cy="28" r="5" fill="${s.inner}"/>` : ""); break;
      case "horn": back += `<path d="M30 28 L26 10 L40 22 Z" fill="${s.inner}" ${st}/><path d="M70 28 L74 10 L60 22 Z" fill="${s.inner}" ${st}/>`; break;
    }
    if (s.mane) back += `<path d="M26 40 Q16 24 30 14 Q38 22 40 30 Z" fill="#FFB5D8" ${st}/><path d="M74 40 Q84 24 70 14 Q62 22 60 30 Z" fill="#BFD9FF" ${st}/><path d="M38 24 Q50 8 62 24 Q50 18 38 24" fill="#D9C4FF" ${st}/>`;
    // đầu
    const rx = s.wide ? 36 : 33;
    front += `<ellipse cx="50" cy="52" rx="${rx}" ry="29" fill="${bodyC}" ${st}/>`;
    if (s.eyeBump) front += `<circle cx="34" cy="27" r="11" fill="${bodyC}" ${st}/><circle cx="66" cy="27" r="11" fill="${bodyC}" ${st}/>`;
    if (s.face) front += `<path d="M18 52 Q20 30 38 38 Q50 44 62 38 Q80 30 82 52 Q82 76 50 78 Q18 76 18 52 Z" fill="${s.face}"/>`;
    if (s.patch) front += `<ellipse cx="36" cy="52" rx="8" ry="10.5" transform="rotate(20 36 52)" fill="${s.patch}"/><ellipse cx="64" cy="52" rx="8" ry="10.5" transform="rotate(-20 64 52)" fill="${s.patch}"/>`;
    if (s.cheek) front += `<path d="M17 56 Q30 56 40 70 Q24 74 17 56 Z" fill="${s.cheek}"/><path d="M83 56 Q70 56 60 70 Q76 74 83 56 Z" fill="${s.cheek}"/>`;
    if (s.ear === "tri" && !s.mane && kind === "cat") front += `<path d="M44 38 l-1 -7 M50 37 l0 -8 M56 38 l1 -7" stroke="#E79A6B" stroke-width="2.4" stroke-linecap="round"/>`;
    if (s.tuft) front += `<path d="M46 24 Q44 14 48 12 M52 24 Q52 12 57 13 M57 26 Q62 18 66 20" fill="none" stroke="${s.body}" stroke-width="3.4" stroke-linecap="round"/>`;
    if (s.spikes) front += `<path d="M42 25 l4 -9 l4 8 l4 -8 l4 9" fill="#FFD76B" ${st}/>`;
    if (s.horn) front += `<path d="M45 26 L50 2 L55 26 Z" fill="#FFE08A" ${st}/><path d="M46.5 20 l7 -3 M47.5 14 l5.5 -2.4 M48.5 8 l3.6 -1.4" stroke="#F2B64A" stroke-width="1.6" stroke-linecap="round"/>`;
    // mắt + mũi + miệng theo tâm trạng
    const ex1 = s.patch ? 36 : 38, ex2 = s.patch ? 64 : 62, ey = s.eyeBump ? 28 : 51;
    const eyeOpen = x => s.eyeBump ? `<circle cx="${x}" cy="${ey}" r="6.5" fill="#fff"/><circle cx="${x}" cy="${ey}" r="3.6" fill="${INK}"/><circle cx="${x - 1}" cy="${ey - 1.4}" r="1.2" fill="#fff"/>` : `<circle cx="${x}" cy="${ey}" r="4.6" fill="${s.patch ? "#fff" : INK}"/>${s.patch ? `<circle cx="${x}" cy="${ey}" r="3.2" fill="${INK}"/>` : ""}<circle cx="${x - 1.4}" cy="${ey - 1.6}" r="1.5" fill="#fff"/>`;
    const arc = (x, up) => `<path d="M${x - 5} ${ey + (up ? 2 : -1)} Q${x} ${ey + (up ? -6 : 5)} ${x + 5} ${ey + (up ? 2 : -1)}" fill="none" stroke="${s.patch ? "#fff" : INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    const heart = x => `<path d="M${x} ${ey + 5} C${x - 9} ${ey - 2} ${x - 3} ${ey - 8} ${x} ${ey - 3} C${x + 3} ${ey - 8} ${x + 9} ${ey - 2} ${x} ${ey + 5} Z" fill="#FF5C8A"/>`;
    let eyes = "", mouth = "";
    const my = s.beak ? 63 : 62, nose = s.nose ? `<ellipse cx="50" cy="${s.beak ? 56 : 57}" rx="3.2" ry="2.3" fill="${s.nose}"/>` : "";
    const beak = s.beak ? `<path d="M44 57 Q50 53 56 57 Q50 66 44 57 Z" fill="${s.beak}" ${st}/>` : "";
    switch (mood) {
      case "sleep": eyes = arc(ex1, false) + arc(ex2, false); mouth = s.beak ? "" : `<path d="M47 ${my} Q50 ${my + 3} 53 ${my}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`; break;
      case "sad": eyes = eyeOpen(ex1) + eyeOpen(ex2) + `<path d="M31 ${ey - 8} L44 ${ey - 5} M69 ${ey - 8} L56 ${ey - 5}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`; mouth = s.beak ? "" : `<path d="M45 ${my + 3} Q50 ${my - 2} 55 ${my + 3}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`; break;
      case "love": eyes = heart(ex1) + heart(ex2); mouth = s.beak ? "" : `<path d="M44 ${my - 1} Q50 ${my + 9} 56 ${my - 1} Z" fill="#E86B8A" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`; break;
      case "happy": case "cheer": eyes = arc(ex1, true) + arc(ex2, true); mouth = s.beak ? "" : `<path d="M44 ${my - 1} Q50 ${my + 9} 56 ${my - 1} Z" fill="#E86B8A" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`; break;
      default: eyes = eyeOpen(ex1) + eyeOpen(ex2); mouth = s.beak ? "" : (kind === "cat" || kind === "bunny" || kind === "fox" ? `<path d="M45 ${my} Q47.5 ${my + 3.5} 50 ${my} Q52.5 ${my + 3.5} 55 ${my}" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` : `<path d="M45 ${my} Q50 ${my + 5} 55 ${my}" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`);
    }
    if (s.eyeBump) mouth = mood === "sleep" ? `<path d="M40 62 Q50 66 60 62" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` : mood === "sad" ? `<path d="M40 66 Q50 60 60 66" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` : `<path d="M38 60 Q50 72 62 60" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    const cheeks = mood === "sad" || mood === "sleep" ? 0.18 : 0.25 + Math.min(1, cute / 100) * 0.55;
    const blush = `<ellipse cx="${s.wide ? 24 : 28}" cy="60" rx="5.5" ry="3.6" fill="#FF8FB0" opacity="${cheeks.toFixed(2)}"/><ellipse cx="${s.wide ? 76 : 72}" cy="60" rx="5.5" ry="3.6" fill="#FF8FB0" opacity="${cheeks.toFixed(2)}"/>`;
    front += `<g class="p-eyes">${eyes}</g>${beak}${nose}${mouth}${blush}`;
    // phụ kiện theo cấp
    let acc = "";
    if (lv >= 1) acc += `<g transform="translate(66 22) rotate(18)"><path d="M0 0 L-11 -7 L-11 7 Z M0 0 L11 -7 L11 7 Z" fill="#FF7AA8" ${st}/><circle r="3.6" fill="#FF4F8B" ${st}/></g>`;
    if (lv >= 2) acc += `<path d="M30 74 Q50 86 70 74 L72 80 Q50 92 28 80 Z" fill="#8FD0FF" ${st}/><rect x="60" y="78" width="7" height="13" rx="2.5" transform="rotate(-12 63 84)" fill="#6CB8F5" ${st}/>`;
    if (lv >= 5) acc += `<path d="M30 28 L36 10 L43 22 L50 6 L57 22 L64 10 L70 28 Z" fill="#FFD76B" ${st}/><circle cx="50" cy="12" r="2.4" fill="#FF7AA8"/><circle cx="36" cy="15" r="2" fill="#7AD1FF"/><circle cx="64" cy="15" r="2" fill="#7AD1FF"/>`;
    else if (lv >= 3) acc += `<path d="M40 27 L60 27 L50 3 Z" fill="#B9A8F0" ${st}/><circle cx="50" cy="3.5" r="4" fill="#FFE08A"/><circle cx="46" cy="19" r="1.6" fill="#fff"/><circle cx="53" cy="14" r="1.6" fill="#fff"/><circle cx="55" cy="22" r="1.6" fill="#fff"/>`;
    if (lv >= 4) acc += `<g class="p-spark"><path d="M8 24 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#FFE08A"/><path d="M90 34 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" fill="#FFB5D8"/></g>`;
    return `<svg viewBox="0 0 100 100" class="pet-svg" aria-hidden="true">${back}${front}${acc}</svg>`;
  }

  /* ---------- trạng thái ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function petOf() { const p = L.prof.get(); return p.pet && p.pet.kind && SP[p.pet.kind] ? p.pet : null; }
  /** độ cute thực tế = đã lưu trừ đi phần giảm do lâu không học (sau 12 giờ, mỗi ngày −10) */
  function effCute(pet) { if (!pet.last) return pet.cute; const idle = (Date.now() - pet.last) / DAY; return clamp(Math.round(pet.cute - Math.max(0, idle - 0.5) * 10), 0, 100); }
  function away(pet) { return pet.last ? (Date.now() - pet.last) / DAY : 0; }
  let sessionSleep = false, lastEvt = Date.now(), jumpT = null, bubbleT = null;
  function moodOf(pet) {
    if (!pet) return "normal";
    if (sessionSleep || away(pet) >= 1.5) return "sleep";
    const c = effCute(pet);
    return c < 25 ? "sad" : c >= 90 ? "love" : c >= 65 ? "happy" : "normal";
  }

  /* ---------- khung hiển thị ở góc phải ---------- */
  let dock = null, bubble = null, wrap = null, pop = null;
  function posLoad() { try { return JSON.parse(localStorage.getItem("lse_petpos") || "null"); } catch (e) { return null; } }
  function draw() {
    if (!dock) return;
    const pet = petOf();
    if (!pet) { dock.classList.add("hidden"); return; }
    dock.classList.remove("hidden");
    const mood = moodOf(pet), lv = lvOf(pet.xp), cute = effCute(pet);
    wrap.className = "pet-wrap mood-" + mood;
    wrap.innerHTML = svg(pet.kind, { mood: dock.dataset.fx === "cheer" ? "cheer" : mood, level: lv, cute });
    wrap.setAttribute("title", (pet.name || SP[pet.kind].n) + " · Cấp " + (lv + 1) + " · Độ cute " + cute);
    if (mood === "sleep") { const z = h("div.pet-z", h("i", "z"), h("i", "z"), h("i", "Z")); wrap.appendChild(z); }
    if (mood === "love") wrap.appendChild(h("div.pet-hearts", h("i", "♥"), h("i", "♥")));
    dock.classList.toggle("asleep", mood === "sleep");
  }
  function say(txt, ms) {
    if (!bubble) return; bubble.textContent = txt; bubble.classList.add("on"); clearTimeout(bubbleT); bubbleT = setTimeout(() => bubble.classList.remove("on"), ms || 3200);
  }
  function fx(kind) {
    if (!dock) return; dock.dataset.fx = kind === "ok" ? "cheer" : ""; dock.classList.remove("jump", "shake"); void dock.offsetWidth;
    dock.classList.add(kind === "ok" ? "jump" : "shake"); draw(); clearTimeout(jumpT);
    jumpT = setTimeout(() => { dock.classList.remove("jump", "shake"); dock.dataset.fx = ""; draw(); }, 900);
  }

  function mount() {
    if (dock || L.auth.role !== "student") return;
    wrap = h("div.pet-wrap"); bubble = h("div.pet-bubble");
    dock = h("div.pet-dock.hidden", { role: "button", "aria-label": "Thú nuôi" }, bubble, wrap);
    const pos = posLoad(); if (pos && typeof pos.x === "number") { dock.style.right = "auto"; dock.style.bottom = "auto"; dock.style.left = clamp(pos.x, 0, innerWidth - 70) + "px"; dock.style.top = clamp(pos.y, 56, innerHeight - 80) + "px"; }
    // kéo thả để dời chỗ; chạm nhẹ để mở bảng thú nuôi
    let sx = 0, sy = 0, ox = 0, oy = 0, drag = false, moved = false;
    dock.addEventListener("pointerdown", e => { drag = true; moved = false; sx = e.clientX; sy = e.clientY; const r = dock.getBoundingClientRect(); ox = r.left; oy = r.top; dock.setPointerCapture(e.pointerId); });
    dock.addEventListener("pointermove", e => { if (!drag) return; const dx = e.clientX - sx, dy = e.clientY - sy; if (!moved && Math.hypot(dx, dy) < 8) return; moved = true; dock.style.right = "auto"; dock.style.bottom = "auto"; dock.style.left = clamp(ox + dx, 0, innerWidth - 70) + "px"; dock.style.top = clamp(oy + dy, 56, innerHeight - 80) + "px"; });
    dock.addEventListener("pointerup", e => { if (!drag) return; drag = false; if (moved) { try { localStorage.setItem("lse_petpos", JSON.stringify({ x: parseFloat(dock.style.left), y: parseFloat(dock.style.top) })); } catch (x) { } } else openPanel(); });
    document.body.appendChild(dock);
    const touch = () => { lastEvt = Date.now(); if (sessionSleep) { sessionSleep = false; const pet = petOf(); draw(); if (pet && away(pet) < 1.5) say("Mình dậy rồi nè! 🌟", 1800); } };
    ["pointerdown", "keydown", "touchstart", "scroll", "wheel"].forEach(ev => window.addEventListener(ev, touch, { passive: true }));
    setInterval(() => { const pet = petOf(); if (!pet) return; if (!sessionSleep && Date.now() - lastEvt > 120000) { sessionSleep = true; draw(); } else draw(); }, 20000);
    L.prof.onChange(() => draw());
    draw();
    const pet = petOf();
    if (!pet) setTimeout(() => { if (!petOf()) chooser(true); }, 900);
    else if (away(pet) >= 1.5) setTimeout(() => say("Zzz… Làm vài câu để đánh thức mình nha 💤", 5000), 1200);
    else if (effCute(pet) < 25) setTimeout(() => say("Mình nhớ em quá… cùng ôn bài nào! 🥺", 4500), 1200);
  }
  function unmount() { if (dock) { dock.remove(); dock = bubble = wrap = null; } if (pop) { pop.remove(); pop = null; } }

  /* ---------- sự kiện học tập ---------- */
  let streakOk = 0;
  function answer(ok) {
    const pet = petOf(); if (!pet) return;
    if (!ok) { fx("bad"); if (Math.random() < .5) say(["Không sao, thử lại nha! 💪", "Sai là để học mà! 🌱", "Mình tin em làm được! ✨"][Math.floor(Math.random() * 3)], 2200); streakOk = 0; return; }
    streakOk++;
    const before = lvOf(pet.xp), wasAsleep = moodOf(pet) === "sleep" && !sessionSleep;
    L.prof.mut(p => { const c = effCute(p.pet); p.pet.cute = clamp(c + 3, 0, 100); p.pet.xp = (p.pet.xp || 0) + 1; p.pet.last = Date.now(); });
    sessionSleep = false; lastEvt = Date.now();
    const np = petOf(), after = lvOf(np.xp);
    fx("ok");
    if (after > before) { say("Lên cấp " + (after + 1) + " rồi! " + TITLES[after] + " 🎉", 4500); L.confetti && L.confetti(40); L.sfx && L.sfx.win(); }
    else if (wasAsleep) say("Hoaaam… cảm ơn em đã đánh thức mình! 🥰", 3500);
    else if (streakOk % 5 === 0) say(["Giỏi quá đi! 💖", "Em đỉnh thật đó! 🌟", "Cute quá, tiếp nào! ✨", "Mình tự hào về em! 🏆"][Math.floor(Math.random() * 4)], 2600);
  }

  /** nộp bài: cộng một lượt nhiều câu đúng */
  function bulk(right, wrong) {
    const pet = petOf(); if (!pet || right <= 0) return;
    const before = lvOf(pet.xp);
    L.prof.mut(p => { p.pet.cute = clamp(effCute(p.pet) + Math.min(15, right * 2), 0, 100); p.pet.xp = (p.pet.xp || 0) + right; p.pet.last = Date.now(); });
    sessionSleep = false; lastEvt = Date.now(); fx("ok");
    const after = lvOf(petOf().xp);
    if (after > before) { say("Lên cấp " + (after + 1) + " rồi! " + TITLES[after] + " 🎉", 4500); L.confetti && L.confetti(40); } else say("Giỏi quá! Mình cute hơn rồi nè 💖", 3000);
  }

  function feed() {
    const pet = petOf(); if (!pet) return false;
    if (!L.prof.spend(3)) { L.toast("Em cần 3 xu để cho ăn. Làm thêm vài câu nhé!"); return false; }
    L.prof.mut(p => { p.pet.cute = clamp(effCute(p.pet) + 8, 0, 100); p.pet.last = Date.now(); p.pet.fed = (p.pet.fed || 0) + 1; });
    sessionSleep = false; fx("ok"); say("Ngon quá! Cảm ơn em 🍎", 2200); L.sfx && L.sfx.coin(); return true;
  }

  /* ---------- bảng thú nuôi ---------- */
  function closePanel() { if (pop) { pop.remove(); pop = null; } }
  function openPanel() {
    if (pop) { closePanel(); return; }
    const pet = petOf(); if (!pet) { chooser(false); return; }
    const lv = lvOf(pet.xp), nextAt = LEVELS[lv + 1], cute = effCute(pet), mood = moodOf(pet), p = L.prof.get();
    const line = mood === "sleep" ? "Đang ngủ… làm bài đúng để đánh thức mình nha 💤" : mood === "sad" ? "Mình buồn vì lâu rồi chưa học cùng nhau 🥺" : mood === "love" ? "Mình yêu em nhất trên đời! 💖" : mood === "happy" ? "Hôm nay mình vui lắm! ✨" : "Cùng ôn bài nhé! 🌱";
    const body = h("div.card.petpanel",
      h("button.x", { onclick: closePanel, "aria-label": "Đóng" }, "✕"),
      h("div.petbig", { html: svg(pet.kind, { mood: mood === "sleep" ? "sleep" : mood === "normal" ? "happy" : mood, level: lv, cute }) }),
      h("h3", pet.name || SP[pet.kind].n), h("div.small.muted", TITLES[lv] + " · Cấp " + (lv + 1)),
      h("div.small", { style: "margin:8px 0 2px" }, "💗 Độ cute: ", h("b", cute + "/100")), h("div.bar.good", h("i", { style: "width:" + cute + "%" })),
      h("div.small", { style: "margin:8px 0 2px" }, "⭐ Kinh nghiệm: ", h("b", pet.xp + (nextAt ? " / " + nextAt : " (tối đa)"))), h("div.bar", h("i", { style: "width:" + (nextAt ? Math.round(100 * (pet.xp - LEVELS[lv]) / (nextAt - LEVELS[lv])) : 100) + "%" })),
      h("div.hint", { style: "margin:10px 0" }, line),
      h("div.small.muted", "Làm đúng → độ cute tăng. Lâu không học → độ cute giảm dần và bé ngủ."),
      h("div.row", { style: "margin-top:10px;justify-content:center" },
        h("button.btn.sm.peach", { onclick: () => { if (feed()) { closePanel(); openPanel(); } } }, "🍎 Cho ăn (−3 xu)"),
        h("button.btn.sm.ghost", { onclick: () => { closePanel(); chooser(false); } }, "🔄 Đổi / đặt tên")),
      h("div.small.muted", { style: "margin-top:8px" }, "Em đang có " + p.coins + " xu"));
    pop = h("div.petpop", body); document.body.appendChild(pop);
    setTimeout(() => { const off = ev => { if (pop && !pop.contains(ev.target) && !dock.contains(ev.target)) { closePanel(); document.removeEventListener("pointerdown", off, true); } }; document.addEventListener("pointerdown", off, true); }, 50);
  }

  /* ---------- chọn / đổi thú nuôi ---------- */
  function chooser(first) {
    L.modal(close => {
      const box = h("div");
      let pickK = (petOf() || {}).kind || "";
      const nm = h("input", { type: "text", maxlength: 14, placeholder: "Đặt tên cho bé (tuỳ chọn)", value: (petOf() || {}).name || "" });
      const draw = () => {
        box.innerHTML = "";
        const p = L.prof.get();
        box.append(h("h2.center", { style: "font-size:26px" }, first ? "Chọn bạn đồng hành nào! 🐾" : "Thú nuôi của em"),
          h("p.center.muted.small", first ? "Bé sẽ ở góc phải màn hình. Em làm đúng thì bé càng cute, em lười học thì bé ngủ mất đó!" : "Chọn loài khác hoặc đổi tên. Loài đã mua thì đổi lúc nào cũng được (độ cute và cấp của bé được giữ nguyên)."),
          h("div.petgrid", Object.keys(SP).map(k => {
            const s = SP[k], own = s.p === 0 || p.ownedPets.includes(k), cur = pickK === k;
            return h("button.petcard" + (cur ? ".cur" : ""), { onclick: () => { if (own) { pickK = k; draw(); } else if (p.coins >= s.p) { if (L.prof.spend(s.p)) { L.prof.mut(q => { if (!q.ownedPets.includes(k)) q.ownedPets.push(k); }); pickK = k; L.sfx.win(); L.toast("Đã mua " + s.n + "! 🎉"); draw(); } } else L.toast("Em còn thiếu " + (s.p - p.coins) + " xu nữa thôi!"); } },
              h("div", { html: svg(k, { mood: "happy", level: 0, cute: 70 }) }), h("b", s.n), own ? h("span.pill.mint", cur ? "Đã chọn" : "Của em") : h("span.pill.butter", { html: L.coinSvg + " " + s.p }));
          })),
          h("label.field", { style: "margin-top:12px" }, h("span", "Tên của bé"), nm),
          h("div.row", { style: "justify-content:flex-end;margin-top:14px" }, first ? null : h("button.btn.ghost", { onclick: close }, "Đóng"),
            h("button.btn", { onclick: () => {
              if (!pickK) { L.toast("Em chọn một bạn nhé!"); return; }
              const nameV = nm.value.trim().slice(0, 14);
              L.prof.mut(q => { const same = q.pet.kind === pickK; q.pet = Object.assign({}, q.pet, { kind: pickK, name: nameV || SP[pickK].n, last: Date.now() }); if (!same && !q.pet.xp) { q.pet.cute = 50; } });
              close(); sessionSleep = false; draw(); fx("ok"); say("Chào em! Mình là " + (nameV || SP[pickK].n) + " 🥰", 3500);
            } }, first ? "Bắt đầu nào! 🎉" : "Lưu")));
      };
      draw(); return box;
    }, first ? { sticky: true } : {});
  }

  L.pet = { SP, svg, mount, unmount, answer, bulk, feed, chooser, panel: openPanel, lvOf, TITLES, LEVELS, effCute, petOf, draw };
})(window.LSE);
