/* Giao diện học viên: đăng nhập, trang chủ, giáo trình, unit, chơi app, bài tập, lịch sử */
(function (L) {
  const { $, h, esc, toast, modal, fmtDate, fmtDur } = L;
  const CFG = window.LSE_CONFIG;
  const state = { manifest: null, hwList: null, plays: null, subs: null };
  L.state = state;

  const toTitle = s => String(s || "").trim().replace(/\s+/g, " ").replace(/(^|\s)(\S)/g, (_, a, b) => a + b.toUpperCase());
  const isTeacher = () => L.auth.role === "teacher";
  const go = p => { location.hash = p; };
  L.go = go;
  const main = () => $("#view");
  function show(...nodes) { const m = main(); m.classList.remove("view-in"); m.innerHTML = ""; nodes.flat().forEach(n => n && m.appendChild(n)); void m.offsetWidth; m.classList.add("view-in"); window.scrollTo(0, 0); }
  L.show = show;
  const spinner = () => h("div.empty", h("span.spinner"), " Đang tải…");

  /* ---------- dữ liệu ---------- */
  async function loadManifest(force) {
    if (state.manifest && !force) return state.manifest;
    let m = null;
    if (isTeacher() && L.gh && L.gh.configured()) { try { m = await L.gh.readManifest(); } catch (e) { console.warn("gh manifest", e); } }
    else if (isTeacher()) { try { m = JSON.parse(localStorage.getItem("lse_manifest_override_v1") || "null"); } catch (e) { m = null; } }
    if (!m) {
      try { const r = await fetch("data/manifest.json?v=" + Date.now(), { cache: "no-store" }); m = await r.json(); }
      catch (e) { m = { version: 1, curricula: [], apps: [] }; }
    }
    /* học viên: ẩn các app không giao cho mình (cô giao app riêng cho từng em) */
    if (!isTeacher() && L.auth.role) {
      try { const r = await L.api.call("appAccess"); const hid = new Set(r.hidden || []); state.allApps = (m.apps || []).slice(); state.hiddenApps = hid; if (hid.size) m.apps = (m.apps || []).filter(a => !hid.has(a.id)); } catch (e) { console.warn("appAccess", e); }
    }
    state.manifest = m; return m;
  }
  L.loadManifest = loadManifest;
  /* bài tập chỉ hiện cho học viên nào còn thấy được app của giáo trình/unit đó (cô đã ẩn hết app của giáo trình đó với em này thì bài tập cũng ẩn) */
  function hwRelevant(x) {
    if (isTeacher() || !state.hiddenApps || !state.hiddenApps.size) return true;
    const all = (state.allApps || []).filter(a => a.cur === x.curId);
    const inUnit = x.unitId ? all.filter(a => (a.unit || "") === x.unitId) : [];
    const pool = inUnit.length ? inUnit : all;
    return !pool.length || pool.some(a => !state.hiddenApps.has(a.id));
  }
  async function loadHw(force) { if (state.hwList && !force) return state.hwList; try { state.hwList = (await L.api.call("hwList")).list.filter(hwRelevant); } catch (e) { state.hwList = []; throw e; } return state.hwList; }
  L.loadHw = loadHw;
  async function loadMine(force) { if (state.plays && !force) return; const r = await L.api.call("myPlays"); state.plays = r.plays || []; state.subs = r.subs || []; }
  L.loadMine = loadMine;
  const cur = id => (state.manifest.curricula || []).find(c => c.id === id);
  const appsIn = (cid, uid) => (state.manifest.apps || []).filter(a => a.cur === cid && (uid == null || (a.unit || "") === uid));
  const unitName = (c, uid) => { const u = (c.units || []).find(x => x.id === uid); return u ? u.name : ""; };
  L.cur = cur; L.appsIn = appsIn; L.unitName = unitName;

  /* ---------- đăng nhập ---------- */
  function loginModal(teacherMode) {
    return new Promise(resolve => {
      modal(close => {
        let tmode = !!teacherMode;
        const box = h("div"), msg = h("div");
        const draw = () => {
          box.innerHTML = "";
          const name = h("input", { type: "text", placeholder: "Ví dụ: Bin", autocomplete: "name", value: L.auth.name && !isTeacher() ? L.auth.name : "" });
          const pw = h("input", { type: "password", placeholder: tmode ? "Mật khẩu giáo viên" : "Mật khẩu của em", autocomplete: "current-password" });
          const submit = async () => {
            msg.innerHTML = "";
            const nm = tmode ? CFG.teacherName : toTitle(name.value);
            if (!nm) { msg.appendChild(h("div.err", "Em nhập tên của em nhé.")); return; }
            btn.disabled = true; btn.textContent = "Đang vào…";
            L.auth.name = nm; L.auth.pw = pw.value;
            try {
              const r = await L.api.call("login");
              L.auth.role = r.role; if (r.name) L.auth.name = r.name; L.api.saveAuth();
              if (tmode && r.role !== "teacher") throw new Error("Mật khẩu này không phải của cô giáo");
              state.manifest = state.hwList = state.plays = null;
              close(); resolve(true);
            } catch (e) { L.auth.role = ""; btn.disabled = false; btn.textContent = tmode ? "Vào khu giáo viên" : "Vào học"; msg.appendChild(h("div.err", e.message)); }
          };
          pw.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
          name.addEventListener("keydown", e => { if (e.key === "Enter") pw.focus(); });
          const btn = h("button.btn", { style: "width:100%;margin-top:14px", onclick: submit }, tmode ? "Vào khu giáo viên" : "Vào học");
          box.append(
            h("img.chibi", { src: "assets/chibi.png", alt: "" }),
            h("h2.center", { style: "font-size:26px" }, tmode ? "Khu giáo viên" : "Chào mừng đến " + CFG.siteName),
            h("p.center.muted", { style: "margin:4px 0 14px" }, tmode ? "Nhập mật khẩu của cô." : "Nhập tên và mật khẩu của em để bắt đầu nhé!"),
            h("div.stack", tmode ? null : h("label.field", h("span", "Tên của em"), name), h("label.field", h("span", tmode ? "Mật khẩu giáo viên" : "Mật khẩu của em"), pw)),
            msg, btn,
            h("p.center.small.muted", { style: "margin:12px 0 0" }, h("a", { href: "javascript:void 0", style: "cursor:pointer;text-decoration:underline", onclick: () => { tmode = !tmode; draw(); } }, tmode ? "← Quay lại đăng nhập học viên" : "Cô giáo? Vào khu giáo viên")),
            L.api.isDemo() ? h("div.hint", { style: "margin-top:12px" }, "Đang ở chế độ DEMO. Mật khẩu học viên: ", h("b", CFG.demoStudentPassword), " · giáo viên: ", h("b", CFG.demoTeacherPassword)) : null);
          setTimeout(() => (tmode ? pw : name).focus(), 50);
        };
        draw();
        return box;
      }, { sticky: true });
    });
  }

  /* ---------- khung chung ---------- */
  /* avatar: cô = ảnh chibi; học sinh = chữ cái đầu trên nền pastel theo tên */
  function avatarNode() {
    if (isTeacher()) return h("img.av", { src: "assets/chibi.png", alt: "", onerror: e => { e.target.replaceWith(h("span.av", { style: "background:linear-gradient(135deg,#FF9EBB,#B9A8F0)" }, "T")); } });
    const pa = L.prof && L.prof.avatar(); if (pa) return h("span.av.emo.pic", L.avImg(pa, 34));
    const name = String(L.auth.name || "?").trim(), ini = (name.split(/\s+/).pop() || "?").charAt(0).toUpperCase();
    const cols = ["#FF9EBB", "#9ED8FF", "#8FDDBA", "#B9A8F0", "#FFB38A", "#F2C94C"]; let hsh = 0; for (const ch of name) hsh = (hsh * 31 + ch.charCodeAt(0)) >>> 0;
    return h("span.av", { style: "background:" + cols[hsh % cols.length] }, ini);
  }
  function paintChrome() {
    $("#siteName").textContent = CFG.siteName;
    $("#siteTag").textContent = SLOGAN;
    const route = (location.hash || "#/").replace(/^#/, "");
    const nav = $("#nav"); nav.innerHTML = "";
    const link = (href, ico, text, on) => h("a.ni" + (on ? ".on" : ""), { href, title: text }, h("span.nico.n-" + ico, { html: ICONS[ico] }), h("span.nlab", text));
    nav.append(
      link("#/", "home", "Trang chủ", route === "/" || route.startsWith("/c/")),
      link("#/hw", "book", "Bài tập", route.startsWith("/hw")),
      link("#/me", "star", "Lịch sử", route.startsWith("/me")));
    if (isTeacher()) nav.append(link("#/teacher", "sprout", "Khu của cô", route.startsWith("/teacher")));
    if (L.auth.name && !isTeacher()) { nav.append(h("a.ni.coinchip", { href: "#/shop", title: "Cửa hàng" }, h("span.nico", { html: L.coinSvg }), h("span.nlab", String(L.prof.coins()) + " xu"))); }
    if (L.auth.name) nav.append(h("button.ni", { title: "Bật/tắt âm thanh", onclick: e => { const m = L.sfx.toggle(); e.currentTarget.querySelector(".nico").innerHTML = m ? ICONS.mute : ICONS.sound; e.currentTarget.querySelector(".nlab").textContent = m ? "Tắt tiếng" : "Âm thanh"; if (!m) L.sfx.ok(); } }, h("span.nico", { html: L.sfx.muted() ? ICONS.mute : ICONS.sound }), h("span.nlab", L.sfx.muted() ? "Tắt tiếng" : "Âm thanh")));
    if (L.auth.name) nav.append(h("span.who", avatarNode(), L.auth.name), h("button.ni", { title: "Đăng xuất", onclick: () => { endPlay(); L.prof.flushBeacon(); L.pet.unmount(); L.prof.reset(); profP = null; L.api.logout(); state.manifest = state.hwList = state.plays = null; boot(); } }, h("span.nico.n-out", { html: ICONS.out }), h("span.nlab", "Thoát")));
    $("#footer").innerHTML = "";
    $("#footer").append(h("div", "© " + new Date().getFullYear() + " " + CFG.siteName + " · " + CFG.teacherName), isTeacher() ? null : h("div", h("a", { onclick: async () => { L.prof.flushBeacon(); L.pet.unmount(); L.prof.reset(); profP = null; L.api.logout(); await loginModal(true); boot(); } }, "Khu giáo viên")));
  }

  /* ---------- trang chủ ---------- */
  /* số ngày học liên tiếp tính từ lịch sử chơi + bài nộp (giờ máy của em) */
  function streakOf(plays, subs) {
    const day = t => { const d = new Date(t); return isNaN(d) ? null : d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); };
    const set = new Set([...(plays || []), ...(subs || [])].map(x => day(x.updated || x.time)).filter(Boolean));
    let n = 0; const d = new Date();
    if (!set.has(day(d))) d.setDate(d.getDate() - 1); // hôm nay chưa học thì vẫn tính chuỗi đến hôm qua
    while (set.has(day(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const greeting = () => { const hr = new Date().getHours(); return hr < 11 ? "Chào buổi sáng" : hr < 14 ? "Chào buổi trưa" : hr < 18 ? "Chào buổi chiều" : "Chào buổi tối"; };
  /* biểu tượng menu: SVG tự vẽ, tô gradient pastel (không phụ thuộc phông/emoji của máy) */
  const ICONS = {
    home: '<svg viewBox="0 0 32 32"><defs><linearGradient id="gh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF9EBB"/><stop offset="1" stop-color="#B9A8F0"/></linearGradient></defs><path d="M4 15.5 16 5l12 10.5" fill="none" stroke="url(#gh)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 14.5V26a1.5 1.5 0 0 0 1.5 1.5H13V19h6v8.5h4.5A1.5 1.5 0 0 0 25 26V14.5L16 7z" fill="url(#gh)"/><circle cx="24" cy="7" r="1.6" fill="#FFE08A"/></svg>',
    book: '<svg viewBox="0 0 32 32"><defs><linearGradient id="gb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ED8FF"/><stop offset="1" stop-color="#B9A8F0"/></linearGradient></defs><rect x="5" y="5" width="18" height="23" rx="3.5" fill="url(#gb)"/><path d="M9.5 11h9M9.5 15.5h9M9.5 20h5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="m22 21 6-9a1.7 1.7 0 0 1 2.4 2.3L24.5 23.5 21 25z" fill="#FFB38A"/><path d="m22 21 3 2" stroke="#fff" stroke-width="1.2"/></svg>',
    star: '<svg viewBox="0 0 32 32"><defs><linearGradient id="gs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE08A"/><stop offset="1" stop-color="#FF9EBB"/></linearGradient></defs><path d="M16 3.5l3.8 7.7 8.5 1.2-6.15 6 1.45 8.45L16 22.8l-7.6 4 1.45-8.45-6.15-6 8.5-1.2z" fill="url(#gs)" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/><circle cx="26.5" cy="5.5" r="1.5" fill="#B9A8F0"/><circle cx="5" cy="26" r="1.2" fill="#9ED8FF"/></svg>',
    sprout: '<svg viewBox="0 0 32 32"><defs><linearGradient id="gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8FDDBA"/><stop offset="1" stop-color="#9ED8FF"/></linearGradient></defs><path d="M16 28V15" stroke="#5FBF98" stroke-width="3" stroke-linecap="round"/><path d="M16 17C16 10 11 6 4.5 6.5 4.5 13 9 17 16 17z" fill="url(#gp)"/><path d="M16 14c0-6 4.5-9.5 11-9 0 6-4 10-11 9z" fill="#B9F0D4"/></svg>',
    sound: '<svg viewBox="0 0 32 32"><path d="M5 12h5l7-6v20l-7-6H5z" fill="#9ED8FF"/><path d="M21 11.5a6.5 6.5 0 0 1 0 9M24.5 8a11 11 0 0 1 0 16" fill="none" stroke="#B9A8F0" stroke-width="2.6" stroke-linecap="round"/></svg>',
    mute: '<svg viewBox="0 0 32 32"><path d="M5 12h5l7-6v20l-7-6H5z" fill="#CBD2E0"/><path d="m22 12 7 8m0-8-7 8" stroke="#FF9EBB" stroke-width="2.8" stroke-linecap="round"/></svg>',
    out: '<svg viewBox="0 0 32 32"><defs><linearGradient id="go" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC4A8"/><stop offset="1" stop-color="#FF9EBB"/></linearGradient></defs><path d="M12 5h9a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3h-9" fill="none" stroke="url(#go)" stroke-width="3" stroke-linecap="round"/><path d="M5 16h13M13.5 11 18.5 16l-5 5" fill="none" stroke="url(#go)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  const SLOGAN = "Mỗi ngày một chút, mầm nhỏ vươn cao 🌱";
  const TIPS = ["Hôm nay mình ôn gì nào? 🌱", "Mỗi ngày một chút, mầm nhỏ sẽ lớn thật nhanh!", "Sai cũng không sao, làm lại là nhớ lâu hơn nhé!", "Chọn một unit rồi chơi thử một game nào!", "Em giỏi hơn hôm qua một chút rồi đó! ✨", "Cố lên, mỗi câu đúng là một bước lên cao! 🚀", "Học vui thì nhớ lâu, chơi thôi nào! 🎮", "Cô tin là em làm được! 💖", "Chậm mà chắc, từng từ một nhé! 🐢", "Hôm nay thử thách bản thân một bài mới đi! 🌈"];
  const CHEERS = [[90, ["Tuyệt vời quá! Em đúng là siêu sao! 🌟", "Xuất sắc! Cô tự hào về em lắm! 💖", "Quá đỉnh luôn! Giữ phong độ nhé! 🏆"]], [70, ["Giỏi lắm! Thêm chút nữa là đỉnh rồi! ✨", "Làm tốt lắm! Em đang tiến bộ rất nhanh! 🌈", "Hay lắm! Mình luyện thêm để lên điểm tuyệt đối nhé! 🚀"]], [40, ["Khá rồi đó! Xem lại câu sai rồi làm lại là nhớ ngay! 💪", "Cố lên, em đã đi được nửa đường rồi! 🌱", "Không sao đâu, mỗi lần sai là một lần học thêm! 🤗"]], [0, ["Đừng nản nha! Làm lại lần nữa, chắc chắn em sẽ tốt hơn! 🌷", "Mầm nhỏ cần thời gian để lớn, em cứ thử tiếp nhé! 🌱", "Cô luôn ở đây cùng em. Mình cùng ôn lại nào! 💖"]]];
  const cheer = pct => { const g = CHEERS.find(x => pct >= x[0])[1]; return g[Math.floor(Math.random() * g.length)]; };
  L.cheer = cheer;

  const groupId = c => L.slug(c.group || "");
  const groupOf = gid => (state.manifest.curricula || []).filter(c => c.group && groupId(c) === gid);
  const groupCrumb = c => c && c.group ? [h("a", { href: "#/g/" + groupId(c) }, c.group), " › "] : [];
  L.curLabel = c => (c.group ? c.group + " › " : "") + c.name;
  function curCard(c, i) {
    const n = appsIn(c.id).length, u = (c.units || []).length;
    return h("a.cur.tint" + ((c.tint != null ? c.tint : i) % 16), { href: "#/c/" + c.id },
      h("div.em", L.ei(c.emoji || "📚", 44)), h("h3", c.name),
      h("div.meta", u + " unit · " + n + " app/game"), h("span.go", "→"));
  }
  /* trang của một nhóm (thư mục lớn): liệt kê các giáo trình con */
  async function groupView(gid) {
    show(spinner()); await loadManifest();
    const cs = groupOf(gid);
    if (!cs.length) { show(h("div.card.empty", "Không tìm thấy thư mục này.", h("div", h("a.btn", { href: "#/" }, "Về trang chủ")))); return; }
    show(h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › ", cs[0].group),
      h("h1", { style: "font-size:30px;margin-bottom:12px;display:flex;align-items:center;gap:10px" }, L.ei(cs[0].emoji || "📁", 40), cs[0].group),
      h("div.grid", cs.map((c, i) => curCard(c, i))));
  }

  async function homeView() {
    show(spinner());
    await loadManifest();
    const m = state.manifest;
    /* giáo trình có "nhóm" (thư mục lớn, ví dụ Flyers) thì trang chủ chỉ hiện một thẻ cho cả nhóm; bấm vào mới thấy các giáo trình con */
    const cards = [], seenG = new Set();
    (m.curricula || []).forEach((c, i) => {
      if (!c.group) { cards.push(curCard(c, i)); return; }
      const gid = groupId(c); if (seenG.has(gid)) return; seenG.add(gid);
      const cs = groupOf(gid), nu = cs.reduce((a, x) => a + (x.units || []).length, 0), na = cs.reduce((a, x) => a + appsIn(x.id).length, 0);
      cards.push(h("a.cur.tint" + ((c.tint != null ? c.tint : i) % 16), { href: "#/g/" + gid },
        h("div.em", L.ei(c.emoji || "📁", 44)), h("h3", c.group),
        h("div.meta", cs.length + " giáo trình · " + nu + " unit · " + na + " app/game"), h("span.go", "→")));
    });
    const statBox = h("div.stats");
    const who = isTeacher() ? "cô " + L.auth.name : L.auth.name;
    const hero = h("div.card.hero",
      h("div", h("div.bubble", TIPS[Math.floor(Math.random() * TIPS.length)]), h("h1", CFG.siteName), h("p", greeting() + ", " + who + "! Chọn giáo trình, chọn unit rồi chơi và ôn tập thật vui nhé."), statBox,
        h("div.row", h("a.btn", { href: "#/hw" }, "📝 Bài tập của em"), h("a.btn.ghost", { href: "#/me" }, "📈 Lịch sử chơi"))),
      h("div.hero-art", h("div.halo"), h("span.sp", "✨"), h("span.sp", "⭐"), h("span.sp", "🌿"), L.mascot.el({ pose: L.mascot.homePose(), height: 270, idleSleep: 60000 })));
    const hwBox = h("div");
    show(hero, isTeacher() ? null : L.extras.homeBlock(), h("h2", { style: "margin:22px 2px 12px;font-size:24px" }, "Giáo trình"), h("div.grid", cards), hwBox);
    if (!isTeacher()) loadMine().then(() => {
      const st = streakOf(state.plays, state.subs);
      const nPlay = (state.plays || []).length, nHw = (state.subs || []).length;
      if (st) statBox.append(h("span.stat.fire", L.ei("🔥", 20), " ", h("b", String(st)), " ngày học liên tiếp"));
      if (nPlay) statBox.append(h("span.stat", "🎮 ", h("b", String(nPlay)), " lượt chơi"));
      if (nHw) statBox.append(h("span.stat", "📝 ", h("b", String(nHw)), " bài đã nộp"));
    }).catch(() => { });
    loadHw().then(list => {
      const open = list.filter(x => x.open && hwStatus(x).can).slice(0, 3);
      if (!open.length) return;
      hwBox.append(h("h2", { style: "margin:24px 2px 8px;font-size:24px" }, "Bài tập đang mở"), h("div.card", open.map(hwRow)));
    }).catch(() => { });
  }

  /* ---------- giáo trình ---------- */
  async function curView(cid) {
    show(spinner()); await loadManifest();
    const c = cur(cid);
    if (!c) { show(h("div.card.empty", "Không tìm thấy giáo trình này.", h("div", h("a.btn", { href: "#/" }, "Về trang chủ")))); return; }
    const units = (c.units || []).map(u => {
      const n = appsIn(cid, u.id).length;
      return h("a.unit-card", { href: "#/c/" + cid + "/u/" + u.id }, h("div.ic.tint" + ((c.tint || 0) % 16), L.ei(c.emoji || "📘", 32)), h("div.grow", h("b", { style: "font-family:var(--hfont);font-size:18px" }, u.name), h("div.small.muted", n + " app/game")));
    });
    const loose = appsIn(cid, "");
    if (loose.length) units.push(h("a.unit-card", { href: "#/c/" + cid + "/u/_" }, h("div.ic.tint7", "🎒"), h("div.grow", h("b", { style: "font-family:var(--hfont);font-size:18px" }, "Chưa phân unit"), h("div.small.muted", loose.length + " app/game"))));
    show(
      h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › ", groupCrumb(c), c.name),
      h("div.row", { style: "margin-bottom:12px" }, h("div.cur.tint" + (c.tint || 0), { style: "min-height:0;padding:10px 18px;cursor:default;flex-direction:row;align-items:center;gap:10px" }, h("span.em", L.ei(c.emoji, 44)), h("h2", c.name)), h("a.btn.sm.peach", { href: "#/map/" + cid }, [L.ei("🗺️", 20), " Bản đồ đảo"])),
      units.length ? h("div.grid", units) : h("div.card.empty", "Giáo trình này chưa có unit nào.", isTeacher() ? h("div", h("a.btn", { style: "margin-top:10px", href: "#/teacher/content" }, "Thêm unit")) : null));
  }

  /* ---------- unit ---------- */
  /* ---------- loại tài liệu: app/game HTML, PDF, PowerPoint, video, âm thanh, hình, link YouTube/Drive ---------- */
  const FILE_KINDS = { html: "app", htm: "app", pdf: "doc", ppt: "doc", pptx: "doc", doc: "doc", docx: "doc", xls: "doc", xlsx: "doc", mp4: "video", webm: "video", mov: "video", m4v: "video", mp3: "audio", m4a: "audio", wav: "audio", ogg: "audio", png: "image", jpg: "image", jpeg: "image", gif: "image", webp: "image" };
  const extOf = n => { const m = String(n || "").split("?")[0].match(/\.([a-z0-9]+)$/i); return m ? m[1].toLowerCase() : ""; };
  L.extOf = extOf;
  L.fileKind = name => FILE_KINDS[extOf(name)] || "";
  /** loại để hiển thị của một mục trong danh mục: game | app | doc | video | audio | image */
  L.itemKind = a => a.kind && a.kind !== "app" ? a.kind : (a.url ? "video" : (L.fileKind(a.file) || a.kind || "app"));
  const KIND_UI = { game: ["🎮", "tint1", "Chơi ▶", "Chưa chơi", "chơi"], app: ["📱", "tint2", "Chơi ▶", "Chưa chơi", "chơi"], doc: ["📄", "tint3", "Xem ▶", "Chưa xem", "xem"], video: ["🎬", "tint4", "Xem ▶", "Chưa xem", "xem"], audio: ["🎧", "tint5", "Nghe ▶", "Chưa nghe", "nghe"], image: ["🖼️", "tint6", "Xem ▶", "Chưa xem", "xem"] };
  L.kindUI = a => KIND_UI[L.itemKind(a)] || KIND_UI.app;
  /** link YouTube / Google Drive / Google Slides -> địa chỉ nhúng; null nếu không nhận ra */
  L.embedUrl = url => {
    const u = String(url || "").trim(); let m;
    if ((m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{6,})/i))) return "https://www.youtube-nocookie.com/embed/" + m[1];
    if ((m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/i)) || (m = u.match(/drive\.google\.com\/open\?(?:.*&)?id=([\w-]+)/i))) return "https://drive.google.com/file/d/" + m[1] + "/preview";
    if ((m = u.match(/docs\.google\.com\/presentation\/d\/([\w-]+)/i))) return "https://docs.google.com/presentation/d/" + m[1] + "/embed?start=false&loop=false";
    return null;
  };
  function appItem(a) {
    const mine = (state.plays || []).filter(p => p.appId === a.id);
    const best = mine.length ? Math.max(...mine.map(p => p.max ? Math.round(100 * p.score / p.max) : 0)) : null;
    const ui = L.kindUI(a);
    return h("div.item", h("div.ic." + ui[1], ui[0]),
      h("div.grow", h("b", a.title), h("div.small.muted", (a.desc ? a.desc + " · " : "") + (mine.length ? "Đã " + ui[4] + " " + mine.length + " lần" + (best != null && mine.some(p => p.max) ? " · cao nhất " + best + "%" : "") : ui[3]))),
      h("a.btn.sm", { href: "#/play/" + a.id }, ui[2]));
  }
  function hwStatus(x) {
    const now = Date.now();
    if (!x.open) return { can: false, text: "Đã đóng" };
    if (x.start && now < +new Date(x.start)) return { can: false, text: "Chưa mở" };
    if (x.end && now > +new Date(x.end)) return { can: false, text: "Hết hạn" };
    if (x.maxAttempts && x.myAttempts >= x.maxAttempts) return { can: false, text: "Hết lượt" };
    return { can: true, text: "Đang mở" };
  }
  function hwRow(x) {
    const st = hwStatus(x);
    const sub = [x.nItems ? x.nItems + " ý" : "", x.timeLimit ? x.timeLimit + " phút" : "", x.maxAttempts ? "tối đa " + x.maxAttempts + " lượt" : "", x.myAttempts ? "đã làm " + x.myAttempts + " lần" + (x.myBest != null ? " · điểm cao nhất " + x.myBest : "") : ""].filter(Boolean).join(" · ");
    /* một nút chính "Làm bài"; Luyện tập và Boss là hai đường chữ nhỏ bên dưới cho đỡ rối */
    return h("div.item", h("div.ic.tint3", "📝"),
      h("div.grow", h("b", x.title), h("div.small.muted", sub || "Bài tập"), h("span.pill." + (st.can ? "mint" : "rose"), st.text),
        h("div.small", { style: "margin-top:6px;display:flex;gap:14px;flex-wrap:wrap;font-weight:800" },
          h("a", { href: "#/practice/" + x.id, title: "Luyện tập: kiểm tra từng câu, có gợi ý, kiếm xu (không tính điểm)" }, "🎮 Luyện tập"),
          isTeacher() ? null : h("a", { href: "#/boss/" + x.id, title: "Đánh Boss: 10 câu, 3 trái tim" }, "👾 Boss"))),
      h("a.btn" + (x.myAttempts && !st.can ? ".ghost" : ""), { href: "#/hw/" + x.id }, st.can ? (x.myAttempts ? "Làm lại" : "Làm bài") : "Xem"));
  }
  /* ---------- link gửi học sinh (dán vào Zalo, Messenger…) ---------- */
  const hwUrl = id => location.origin + location.pathname + "#/hw/" + id;
  const copyHwLink = x => L.copyText(x.title + "\n" + hwUrl(x.id));
  L.hwUrl = hwUrl; L.copyHwLink = copyHwLink;
  async function unitView(cid, uid) {
    show(spinner()); await loadManifest();
    const c = cur(cid); if (!c) return go("/");
    const real = uid === "_" ? "" : uid;
    const name = real ? unitName(c, real) : "Chưa phân unit";
    if (real && !name) { show(h("div.card.empty", "Không tìm thấy unit này.")); return; }
    try { await loadMine(); } catch (e) { }
    const apps = appsIn(cid, real);
    const box = h("div.card", h("h3", { style: "margin-bottom:4px" }, "App & game"), apps.length ? apps.map(appItem) : h("div.empty", "Chưa có app nào trong unit này."));
    const hwBox = h("div.card", h("h3", { style: "margin-bottom:4px" }, "Bài tập"), h("div.empty", h("span.spinner")));
    show(h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › ", groupCrumb(c), h("a", { href: "#/c/" + cid }, c.name), " › ", name),
      h("h1", { style: "font-size:30px;margin-bottom:12px" }, name), box, hwBox);
    try {
      const list = (await loadHw()).filter(x => x.curId === cid && (x.unitId || "") === real);
      hwBox.innerHTML = ""; hwBox.append(h("h3", { style: "margin-bottom:4px" }, "Bài tập"), list.length ? list.map(hwRow) : h("div.empty", "Chưa có bài tập cho unit này."));
    } catch (e) { hwBox.innerHTML = ""; hwBox.append(h("h3", "Bài tập"), h("div.err", e.message)); }
  }

  /* ---------- chơi app ---------- */
  let playSession = null;
  async function endPlay() {
    const s = playSession; if (!s) return; playSession = null;
    try { const r = await s.flush(false); if (r) { toast("Đã lưu lần chơi thứ " + r.attempt + " ✓"); state.plays = null; } } catch (e) { toast("Chưa lưu được kết quả: " + e.message); }
    s.stop();
  }
  async function playView(aid) {
    show(spinner()); await loadManifest();
    const app = (state.manifest.apps || []).find(a => a.id === aid);
    if (!app) { show(h("div.card.empty", "Không tìm thấy app này.", h("div", h("a.btn", { href: "#/" }, "Về trang chủ")))); return; }
    const c = cur(app.cur);
    const sess = L.adapters.createSession(app); playSession = sess;
    const badge = h("span.pill", "…");
    /* file đã được thay thế (cập nhật) thì thêm ?v= để điện thoại không giữ bản cũ */
    const bust = u => u + (app.updated ? (u.includes("?") ? "&" : "?") + "v=" + encodeURIComponent(app.updated.replace(/\D/g, "").slice(0, 14)) : "");
    const kindF = app.url ? "link" : (L.fileKind(app.file) || "app");
    const absUrl = app.file ? new URL(bust(app.file), location.href).href : app.url;
    const logView = () => { if (!sess.dirty) { sess.dirty = true; sess.schedule(); } };     // tài liệu/video: ghi một lượt xem
    let content, wrapNote = "", openLink = null;
    if (kindF === "app") {
      const iframe = h("iframe", { src: bust(app.file), title: app.title, allow: "autoplay; fullscreen; clipboard-write", allowfullscreen: true });
      content = iframe;
      iframe.addEventListener("load", () => {
        const name = L.adapters.inject(iframe); sess.adapter = name;
        badge.className = "pill " + (name ? "mint" : "butter");
        badge.textContent = name ? "✅ Đang ghi lại kết quả" : "ℹ️ Chỉ ghi lượt chơi";
        badge.title = name ? "Mỗi câu đúng/sai được lưu để cô xem báo cáo" : "App này chưa gửi chi tiết từng câu về trang web";
      });
    } else {
      badge.className = "pill butter"; badge.textContent = "ℹ️ Chỉ ghi lượt xem";
      openLink = h("a.btn.sm.ghost", { href: absUrl, target: "_blank", rel: "noopener" }, kindF === "doc" && /\.pdf$/i.test(app.file || "") ? "📄 Mở PDF ở tab mới" : "↗ Mở ở tab mới");
      if (kindF === "video") { content = h("video", { controls: true, playsinline: true, preload: "metadata", src: bust(app.file), style: "width:100%;max-height:78vh;background:#000;border-radius:14px", onplay: logView }); }
      else if (kindF === "audio") { content = h("div", { style: "padding:30px 14px;text-align:center" }, h("div", { style: "font-size:64px" }, "🎧"), h("audio", { controls: true, preload: "metadata", src: bust(app.file), style: "width:100%;max-width:560px;margin-top:12px", onplay: logView })); }
      else if (kindF === "image") { content = h("img", { src: bust(app.file), alt: app.title, style: "max-width:100%;display:block;margin:0 auto;border-radius:12px", onload: logView }); }
      else if (kindF === "link") {
        const emb = L.embedUrl(app.url);
        content = emb ? h("iframe", { src: emb, title: app.title, allow: "autoplay; fullscreen; encrypted-media; picture-in-picture", allowfullscreen: true }) : h("div.empty", "Link này chưa nhúng được, ", h("a", { href: app.url, target: "_blank", rel: "noopener" }, "bấm để mở"));
        content.addEventListener && content.addEventListener("load", logView);
      } else {   // doc: PDF mở trực tiếp; PowerPoint/Word/Excel mở qua trình xem Office Online (cần file công khai trên web)
        const isPdf = /\.pdf$/i.test(app.file || "");
        content = h("iframe", { src: isPdf ? bust(app.file) : "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(absUrl), title: app.title, allowfullscreen: true });
        content.addEventListener("load", logView);
        wrapNote = isPdf ? "Điện thoại không hiện được PDF trong trang? Bấm nút “Mở PDF ở tab mới”." : "Nếu trang trắng, đợi 1–2 phút (web mới đăng) hoặc bấm “Mở ở tab mới” / tải về.";
      }
    }
    const wrap = h("div.frame-wrap", content);
    if (content.tagName === "VIDEO" || content.tagName === "IMG" || content.tagName === "DIV") wrap.style.height = "auto";
    const exitFull = h("button.btn.sm.ghost.exitfull", { onclick: () => toggle() }, "✕ Thu nhỏ");
    /* chế độ toàn màn hình: hiệu ứng fadeUp của trang làm khung "position:fixed" bị kẹt trong hộp cha (nhất là trên iPhone) → tắt hiệu ứng ở các hộp cha khi mở rộng */
    const toggle = () => {
      const on = wrap.classList.toggle("full");
      for (let e = wrap.parentElement; e && e.id !== "view" && e !== document.body; e = e.parentElement) e.classList.toggle("nofx", on);
      document.documentElement.classList.toggle("noscroll", on);
      if (on) wrap.prepend(exitFull); else exitFull.remove();
    };
    show(
      h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › ", groupCrumb(c), c ? h("a", { href: "#/c/" + c.id }, c.name) : "", c && app.unit ? " › " : "", c && app.unit ? h("a", { href: "#/c/" + c.id + "/u/" + app.unit }, unitName(c, app.unit)) : ""),
      h("div.player",
        h("div.player-bar", h("h2", { style: "font-size:22px" }, app.title), badge, h("span.grow"),
          openLink, h("button.btn.sm.ghost", { onclick: toggle }, "⛶ Toàn màn hình"),
          h("button.btn.sm.mint", { onclick: async () => { await endPlay(); go(c ? "/c/" + c.id + (app.unit ? "/u/" + app.unit : "") : "/"); } }, "Lưu & thoát")),
        wrap,
        wrapNote ? h("div.small.muted", { style: "margin-top:6px" }, wrapNote) : null,
        app.desc ? h("div.small.muted", app.desc) : null));
  }

  /* ---------- bài tập: danh sách ---------- */
  async function hwListView() {
    show(spinner());
    await loadManifest();
    try {
      const list = await loadHw(true);
      /* gom theo giáo trình · unit, bài còn làm được lên trước */
      const groups = [], idx = {};
      list.slice().sort((a, b) => (hwStatus(b).can - hwStatus(a).can)).forEach(x => {
        const c = cur(x.curId), key = (c ? L.curLabel(c) : "Khác") + (c && x.unitId ? " · " + unitName(c, x.unitId) : "");
        if (!(key in idx)) { idx[key] = groups.length; groups.push({ key, items: [] }); }
        groups[idx[key]].items.push(x);
      });
      show(h("h1", { style: "font-size:30px;margin-bottom:12px" }, "Bài tập"),
        groups.length ? groups.map(g => h("div.card", h("h3", { style: "margin-bottom:4px" }, g.key), g.items.map(hwRow))) : h("div.card", h("div.empty", "Chưa có bài tập nào. Chờ cô giao bài nhé!")));
    } catch (e) { show(h("div.card", h("div.err", e.message))); }
  }

  /* ---------- bài tập: làm bài ---------- */
  async function hwRunView(id) {
    show(spinner()); await loadManifest();
    let hw, mine;
    try { hw = (await L.api.call("hwGet", { id })).hw; mine = (await L.api.call("hwMine", { id })).subs || []; try { await L.imgs.load(); } catch (e) { } }
    catch (e) { show(h("div.card", h("div.err", e.message), h("p", h("a.btn", { href: "#/hw" }, "← Danh sách bài tập")))); return; }
    const m = hw.meta || {};
    const used = mine.length;
    let st = hwStatus({ open: hw.open, start: m.start, end: m.end, maxAttempts: m.maxAttempts, myAttempts: isTeacher() ? 0 : used });
    if (isTeacher() && !st.can) st = { can: true, text: "Xem thử (cô)" };
    const histTbl = () => mine.length ? h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["Lần", "Ngày giờ", "Điểm", "Thời gian"].map(x => h("th", x)))),
      h("tbody", mine.slice().reverse().map(s => h("tr", h("td", "Lần " + s.attempt), h("td", fmtDate(s.time)), h("td", h("b", s.scaled + "/" + (m.scale || 10)), " ", h("span.muted.small", "(" + s.score + "/" + s.max + ")")), h("td", fmtDur(s.durationSec))))))) : null;

    const intro = () => {
      const nSec = (hw.sections || []).length;
      show(h("div.crumbs", h("a", { href: "#/hw" }, "Bài tập"), " › ", hw.title),
        h("div.card", h("h1", { style: "font-size:30px" }, hw.title),
          hw.desc ? h("div.shared", hw.desc) : null,
          h("div.row", { style: "margin:12px 0" }, h("span.pill", nSec + " phần"), m.nItems ? h("span.pill.sky", m.nItems + " ý") : null, m.timeLimit ? h("span.pill.butter", "⏱ " + m.timeLimit + " phút") : null,
            m.maxAttempts ? h("span.pill.peach", "Lượt: " + used + "/" + m.maxAttempts) : h("span.pill.mint", "Không giới hạn lượt"), h("span.pill." + (st.can ? "mint" : "rose"), st.text)),
          h("div.row", st.can ? h("button.btn", { onclick: run }, used ? "Làm lại ▶" : "Bắt đầu làm bài ▶") : null, h("a.btn.peach", { href: "#/practice/" + hw.id }, "🎮 Luyện tập (không tính điểm, có gợi ý, kiếm xu)"), isTeacher() ? null : h("a.btn.rose", { href: "#/boss/" + hw.id }, "👾 Đánh Boss")), !st.can ? h("div.hint", st.text === "Hết lượt" ? "Em đã dùng hết số lượt làm bài này." : "Bài này hiện không mở để làm.") : null,
        ),
        mine.length ? h("div.card", h("h3", { style: "margin-bottom:8px" }, "Các lần đã làm"), histTbl()) : null);
    };

    const run = () => {
      /* làm lại bài đã làm: tự xáo thứ tự câu hỏi (và đáp án A-B-C-D nếu cô bật) để em không học vẹt vị trí */
      const mixMode = m.shuffleMode || "retake", doMix = mixMode === "always" || (mixMode === "retake" && used > 0);
      const rts = (hw.sections || []).map(sec => L.hw.buildRuntime(sec, { shuffleQ: doMix, shuffleOpts: doMix && !!m.shuffleOpts }));
      const t0 = Date.now(); let submitted = false, tick = null;
      const timer = h("span.timer", "");
      /* Báo đúng/sai ngay sau mỗi câu (tắt được trong phần sửa bài; không dùng khi cô chọn chỉ cho xem tổng điểm) */
      const afterMode = m.showAfter || "full";
      const instant = m.instant !== false && (afterMode === "full" || afterMode === "verdict");
      const allQs = () => rts.flatMap(rt => rt.qs.map(q => rt.sts[q.id]));
      const counter = h("span.pill.mint", "");
      const paintCount = () => { const a = allQs(); counter.textContent = a.filter(s => s.chk).length + "/" + a.length + " câu đã kiểm tra"; };
      const head = h("div.hw-head", h("div.row", h("b", { style: "font-family:var(--hfont);font-size:19px" }, hw.title), h("span.grow"), instant ? counter : null, m.timeLimit ? timer : null));
      const AUTO = ["mcq1", "tf"];
      const card = (q, st, ctx, n) => {
        if (st.chk) {
          const g = st.chk, ok = g.got === g.max;
          return h("div", L.hw.view(q, st, Object.assign({}, ctx, { mode: "review", showAns: afterMode === "full" }), n),
            h("div.row.pfeed" + (ok ? ".good" : ".bad"), h("b", ok ? "🎉 Đúng rồi!" : g.got > 0 ? "Chưa đủ (" + g.got + "/" + g.max + ")" : "Chưa đúng")));
        }
        const doCheck = () => { const g = L.hw.grade(q, st); if (!g.max) return; st.chk = g; L.sfx && (g.got === g.max ? L.sfx.ok() : L.sfx.bad()); paintCount(); };
        /* trắc nghiệm 1 đáp án / đúng-sai: chọn xong là báo kết quả luôn */
        const cx = Object.assign({}, ctx, { redraw: () => { if (AUTO.includes(q.type) && st.v != null && !st.chk) doCheck(); ctx.redraw(); } });
        const box = h("div", L.hw.view(q, st, cx, n), AUTO.includes(q.type) ? null : h("div.row.pact", h("span.grow"), h("button.btn.sm.mint", { onclick: () => { doCheck(); ctx.redraw(); } }, "Kiểm tra ✓")));
        L.enterCheck(box, () => { doCheck(); ctx.redraw(); });   /* Enter trong ô gõ = Kiểm tra */
        return box;
      };
      const parts = []; let no = 1;
      (hw.sections || []).forEach((sec, i) => {
        const rt = rts[i];
        if (sec.numFresh) no = 1;
        parts.push(L.hw.sectionCard(sec, i, hw.sections, L.hw.renderSection(rt, "do", false, no, null, instant ? { card } : undefined)));
        no += rt.qs.length;
      });
      if (instant) paintCount();
      const submitBtn = h("button.btn.mint", { style: "width:100%;margin-top:16px;font-size:18px", onclick: () => submit(false) }, "Nộp bài ✓");
      const err = h("div");
      if (!rts.some(r => r.qs.length)) { show(h("div.card.empty", "Bài tập này chưa có câu hỏi.")); return; }
      show(head, parts, err, submitBtn);
      if (m.timeLimit) {
        const end = t0 + m.timeLimit * 60000;
        const upd = () => { const left = Math.max(0, end - Date.now()); timer.textContent = "⏱ " + String(Math.floor(left / 60000)).padStart(2, "0") + ":" + String(Math.floor(left / 1000) % 60).padStart(2, "0"); timer.classList.toggle("low", left < 60000); if (left <= 0 && !submitted) { clearInterval(tick); toast("Hết giờ! Bài được nộp tự động."); submit(true); } };
        upd(); tick = setInterval(() => { if (!document.body.contains(timer)) { clearInterval(tick); return; } upd(); }, 1000);
      }
      async function submit(force) {
        if (submitted) return;
        const res = L.hw.gradeAll(rts);
        const blank = rts.reduce((a, rt) => a + rt.qs.filter(q => { const g = L.hw.grade(q, rt.sts[q.id]); return g.got === 0; }).length, 0);
        if (!force && blank > 0 && !(await L.confirmBox("Còn " + blank + " câu chưa có điểm (chưa làm hoặc sai). Em vẫn muốn nộp bài chứ?", "Nộp bài"))) return;
        submitted = true; clearInterval(tick); submitBtn.disabled = true; submitBtn.textContent = "Đang nộp…";
        const dur = Math.round((Date.now() - t0) / 1000);
        try {
          let r;
          if (isTeacher()) r = { attempt: "thử", scaled: res.max ? L.round2(res.got / res.max * (m.scale || 10)) : 0, preview: true };
          else {
            r = await L.api.call("hwSubmit", { id: hw.id, score: res.got, max: res.max, durationSec: dur, items: res.items });
            state.hwList = null;
            mine.push({ attempt: r.attempt, time: new Date().toISOString(), score: res.got, max: res.max, scaled: r.scaled, durationSec: dur });
          }
          if (!r.preview) { const right = res.items.filter(x => x.ok).length; L.rw.bulk(right, res.items.length - right); L.rw.event("hw"); L.rw.wrongFromHw(hw.id, rts); }
          if (!r.preview && res.got > 0) { const c = Math.min(res.got, 40); L.prof.add(c); setTimeout(() => { L.toast("+" + c + " xu 🪙 nhờ nộp bài"); L.sfx.coin(); }, 700); }
          result(rts, res, r, dur);
        } catch (e) { submitted = false; submitBtn.disabled = false; submitBtn.textContent = "Nộp bài ✓"; err.innerHTML = ""; err.appendChild(h("div.err", { style: "margin-top:12px" }, "Chưa nộp được: " + e.message + " — bài làm của em vẫn còn đây, bấm nộp lại nhé.")); }
      }
    };

    const result = (rts, res, r, dur) => {
      const scale = m.scale || 10, after = m.showAfter || "full";
      const pct = res.max ? Math.round(100 * res.got / res.max) : 0;
      if (pct >= 80 || after === "done") setTimeout(() => L.confetti(), 250);
      const top = h("div.card.result",
        h("div.muted", r.preview ? "Chế độ xem thử (không lưu điểm)" : "Kết quả lần " + r.attempt),
        after === "done" ? h("div", { style: "font-size:46px" }, "🎉") : h("div.score-big", String(r.scaled), h("small", { style: "font-size:26px" }, "/" + scale)),
        after === "done" ? h("h2", "Em đã nộp bài!") : h("div", { style: "margin:10px auto;max-width:360px" }, h("div.bar." + (pct >= 70 ? "good" : pct >= 40 ? "" : "bad"), h("i", { style: "width:" + pct + "%" })), h("div.muted", { style: "margin-top:6px" }, res.got + "/" + res.max + " ý đúng · " + fmtDur(dur))),
        h("div.row", { style: "justify-content:center;margin-top:10px" }, (isTeacher() || (hw.open && (!m.maxAttempts || mine.length < m.maxAttempts))) ? h("button.btn", { onclick: () => hwRunView(id) }, "Làm lại ▶") : null, h("a.btn.ghost", { href: "#/hw" }, "← Danh sách bài tập")));
      if (after !== "done") top.insertBefore(h("div.cheer", L.cheer(pct)), top.children[2] || null);
      const out = [h("div.crumbs", h("a", { href: "#/hw" }, "Bài tập"), " › ", hw.title), top];
      if (after === "full" || after === "verdict") {
        let no = 1;
        (hw.sections || []).forEach((sec, i) => {
          const rt = rts[i];
          if (sec.numFresh) no = 1;
          out.push(L.hw.sectionCard(sec, i, hw.sections, h("div.small.muted", "Phần này: " + res.secs[i].got + "/" + res.secs[i].max + " ý"), L.hw.renderSection(rt, "review", after === "full", no, null)));
          no += rt.qs.length;
        });
      }
      show(out);
    };

    intro();
  }

  /* ---------- lịch sử của em ---------- */
  async function meView() {
    show(spinner());
    try { await loadMine(true); } catch (e) { show(h("div.card", h("div.err", e.message))); return; }
    await loadManifest();
    const plays = state.plays, subs = state.subs;
    const appRows = plays.length ? h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["App / game", "Lần", "Ngày giờ", "Kết quả", "Thời gian"].map(x => h("th", x)))),
      h("tbody", plays.map(p => h("tr", h("td", h("a", { href: "#/play/" + p.appId, style: "font-weight:800" }, p.appTitle || p.appId)), h("td", "Lần " + p.attempt), h("td", fmtDate(p.time)), h("td", p.max ? p.score + "/" + p.max + " (" + Math.round(100 * p.score / p.max) + "%)" : "—"), h("td", fmtDur(p.durationSec))))))) : h("div.empty", "Em chưa chơi app nào. Vào một unit và bấm Chơi nhé!");
    const hwRows = subs.length ? h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["Bài tập", "Lần", "Ngày giờ", "Điểm", "Thời gian"].map(x => h("th", x)))),
      h("tbody", subs.map(p => h("tr", h("td", h("a", { href: "#/hw/" + p.hwId, style: "font-weight:800" }, p.hwTitle || p.hwId)), h("td", "Lần " + p.attempt), h("td", fmtDate(p.time)), h("td", h("b", String(p.scaled))), h("td", fmtDur(p.durationSec))))))) : h("div.empty", "Em chưa nộp bài tập nào.");
    show(h("h1", { style: "font-size:30px;margin-bottom:12px" }, "Lịch sử của " + L.auth.name), h("div.card", h("h3", { style: "margin-bottom:6px" }, "App & game"), appRows), h("div.card", h("h3", { style: "margin-bottom:6px" }, "Bài tập"), hwRows));
  }

  /* ---------- router ---------- */
  let routeToken = 0, profP = null;
  /** học sinh: tải hồ sơ (xu, thú nuôi...) từ Google Sheets một lần sau khi đăng nhập (chờ tối đa ~3 giây) */
  async function ensureProfile() {
    if (L.auth.role !== "student") { if (isTeacher()) L.extras.applyTheme("default"); return; }
    if (!profP) profP = L.prof.init().then(() => { L.extras.syncTheme(); L.pet.mount(); paintChrome(); }).catch(() => { L.pet.mount(); });
    await Promise.race([profP, new Promise(r => setTimeout(r, 3000))]);
  }
  async function route() {
    const token = ++routeToken;
    await endPlay();
    if (token !== routeToken) return;
    paintChrome();
    if (!L.auth.name || !L.auth.role) return;
    await ensureProfile();
    if (token !== routeToken) return;
    const p = (location.hash || "#/").replace(/^#/, "").split("?")[0].split("/").filter(Boolean);
    try {
      if (!p.length) return await homeView();
      if (p[0] === "g" && p[1]) return await groupView(p[1]);
      if (p[0] === "c" && p[1] && p[2] === "u") return await unitView(p[1], p[3] || "_");
      if (p[0] === "c" && p[1]) return await curView(p[1]);
      if (p[0] === "play" && p[1]) return await playView(p[1]);
      if (p[0] === "practice" && p[1]) return await L.practiceView(p[1]);
      if (p[0] === "shop") return await L.shopView();
      if (p[0] === "review") return await L.extras.reviewView();
      if (p[0] === "boss" && p[1]) return await L.extras.bossView(p[1]);
      if (p[0] === "map" && p[1]) return await L.extras.mapView(p[1]);
      if (p[0] === "print" && p[1]) { if (!isTeacher()) { show(h("div.card.empty", "Trang in dành cho cô giáo.")); return; } return await L.printView(p[1], p[2]); }
      if (p[0] === "hw" && p[1]) return await hwRunView(p[1]);
      if (p[0] === "hw") return await hwListView();
      if (p[0] === "me") return await meView();
      if (p[0] === "teacher") { if (!isTeacher()) { show(h("div.card.empty", "Khu này dành cho cô giáo.")); return; } return await L.teacherView(p[1] || "home", p.slice(2)); }
      show(h("div.card.empty", "Không tìm thấy trang.", h("div", h("a.btn", { href: "#/" }, "Về trang chủ"))));
    } catch (e) { console.error(e); show(h("div.card", h("div.err", "Có lỗi: " + e.message))); }
  }
  L.prof.onChange(() => { const l = document.querySelector(".coinchip .nlab"); if (l) l.textContent = L.prof.coins() + " xu"; });
  L.route = route;
  L.ui = { show, spinner, loadManifest, repaint: () => paintChrome() };

  async function boot() {
    paintChrome();
    document.title = CFG.siteName;
    if (!L.auth.name || !L.auth.role) await loginModal(false);
    else {
      // kiểm tra phiên còn hợp lệ (mật khẩu có thể đã đổi)
      try { const r = await L.api.call("login"); L.auth.role = r.role; if (r.name) L.auth.name = r.name; L.api.saveAuth(); } catch (e) { L.api.logout(); await loginModal(false); }
    }
    route();
  }
  L.boot = () => {
    window.addEventListener("hashchange", () => { document.documentElement.classList.remove("noscroll"); route(); });
    window.addEventListener("pagehide", () => { if (playSession) playSession.flush(true); });
    boot();
  };
})(window.LSE);
