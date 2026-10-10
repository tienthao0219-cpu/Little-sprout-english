/* Khu giáo viên: upload app, quản lý unit, tạo bài tập, báo cáo học viên, cài đặt */
(function (L) {
  const { $, h, esc, toast, modal, fmtDate, fmtDur, uid, slug } = L;
  const CFG = window.LSE_CONFIG;
  const GK = "lse_gh_v1", MK = "lse_manifest_override_v1";

  /* ============================================================
     GitHub: đọc/ghi file trong kho (kho chứa chính website này)
     ============================================================ */
  const gh = {
    cfg() {
      let saved = {}; try { saved = JSON.parse(localStorage.getItem(GK) || "{}"); } catch (e) { }
      const g = CFG.github || {};
      let owner = saved.owner || g.owner || "", repo = saved.repo || g.repo || "";
      if ((!owner || !repo) && /\.github\.io$/.test(location.hostname)) {
        owner = owner || location.hostname.split(".")[0];
        const seg = location.pathname.split("/")[1] || "";
        repo = repo || (seg && !/\.html?$/.test(seg) ? seg : owner + ".github.io");
      }
      return { owner, repo, branch: saved.branch || g.branch || "main", token: saved.token || "" };
    },
    save(c) { localStorage.setItem(GK, JSON.stringify(c)); },
    configured() { const c = gh.cfg(); return !!(c.owner && c.repo && c.token); },
    async api(path, opts) {
      const c = gh.cfg();
      const r = await fetch("https://api.github.com/repos/" + c.owner + "/" + c.repo + path, Object.assign({
        headers: { Authorization: "Bearer " + c.token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }
      }, opts, opts && opts.body ? { body: JSON.stringify(opts.body) } : {}));
      if (r.status === 404) return null;
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        if (r.status === 401) throw new Error("GitHub từ chối token (sai hoặc hết hạn). Tạo lại token trong Cài đặt.");
        if (r.status === 403) throw new Error("GitHub chặn thao tác: token chưa có quyền 'Contents: Read and write' cho kho này. " + (data.message || ""));
        throw new Error("GitHub: " + (data.message || r.status));
      }
      return data;
    },
    async getFile(path) {
      const c = gh.cfg();
      return gh.api("/contents/" + path.split("/").map(encodeURIComponent).join("/") + "?ref=" + encodeURIComponent(c.branch));
    },
    async putFile(path, base64, message) {
      const c = gh.cfg();
      for (let attempt = 0; attempt < 2; attempt++) {
        const ex = await gh.getFile(path);
        try {
          return await gh.api("/contents/" + path.split("/").map(encodeURIComponent).join("/"), { method: "PUT", body: { message, content: base64, branch: c.branch, sha: ex ? ex.sha : undefined } });
        } catch (e) { if (attempt === 1 || !/409|does not match|sha/i.test(e.message)) throw e; }
      }
    },
    async readManifest() {
      const f = await gh.getFile("data/manifest.json");
      if (!f) throw new Error("Không thấy data/manifest.json trong kho");
      return JSON.parse(L.base64ToText(f.content));
    },
    async writeManifest(m, msg) { return gh.putFile("data/manifest.json", L.textToBase64(JSON.stringify(m, null, 2) + "\n"), msg || "Cập nhật danh mục"); },
    async test() {
      const c = gh.cfg();
      const r = await gh.api("");
      if (!r) throw new Error("Không thấy kho " + c.owner + "/" + c.repo + " (sai tên, hoặc token không có quyền với kho này).");
      if (r.permissions && !r.permissions.push) throw new Error("Token chỉ đọc được. Cần quyền Contents: Read and write.");
      return r;
    }
  };
  L.gh = gh;

  /** sửa manifest: ghi lên GitHub nếu đã nối; nếu chưa thì lưu tạm trên máy này (để thử giao diện) */
  async function editManifest(fn, msg) {
    let m;
    if (gh.configured()) m = await gh.readManifest();
    else m = JSON.parse(JSON.stringify(await L.loadManifest()));
    fn(m);
    if (gh.configured()) await gh.writeManifest(m, msg);
    else { localStorage.setItem(MK, JSON.stringify(m)); }
    L.state.manifest = m;
    return m;
  }
  /* ============================================================
     Khung các tab
     ============================================================ */
  const TABS = [["home", "🌿 Tổng quan"], ["upload", "⬆️ Đăng app"], ["content", "🗂️ Giáo trình & unit"], ["hw", "📝 Bài tập"], ["images", "🖼️ Hình"], ["students", "👥 Học viên"], ["report", "📊 Báo cáo học viên"], ["settings", "⚙️ Cài đặt"]];
  async function teacherView(tab, rest) {
    L.show(h("div.center.muted", h("span.spinner")));
    await L.loadManifest();
    const body = h("div");
    const tabs = h("div.tabs", TABS.map(([id, t]) => h("button" + (tab === id || (tab === "hw-edit" && id === "hw") ? ".on" : ""), { onclick: () => L.go("/teacher/" + id) }, t)));
    L.show(h("h1", { style: "font-size:30px;margin-bottom:12px" }, "Khu của cô " + CFG.teacherName), tabs, body);
    const fn = { home: tHome, upload: tUpload, content: tContent, hw: tHwList, "hw-edit": tHwEdit, students: tStudents, images: tImages, report: tReport, settings: tSettings }[tab];
    if (!fn) { body.append(h("div.card.empty", "Không có mục này.")); return; }
    try { await fn(body, rest || []); } catch (e) { console.error(e); body.append(h("div.card", h("div.err", e.message))); }
  }
  L.teacherView = teacherView;

  const selCur = (m, val, onchange, withEmpty) => h("select", { onchange: e => onchange(e.target.value) }, withEmpty ? h("option", { value: "" }, withEmpty) : null, m.curricula.map(c => h("option", { value: c.id, selected: c.id === val }, c.name)));
  const selUnit = (c, val, onchange) => h("select", { onchange: e => onchange(e.target.value) }, h("option", { value: "", selected: !val }, "Chưa phân unit"), ((c && c.units) || []).map(u => h("option", { value: u.id, selected: u.id === val }, u.name)));

  /* ---------- Tổng quan ---------- */
  async function tHome(body) {
    const m = L.state.manifest;
    let hwList = []; try { hwList = await L.loadHw(true); } catch (e) { }
    const step = (ok, title, text, link) => h("div.item", h("div.ic." + (ok ? "tint0" : "tint3"), ok ? "✅" : "👉"), h("div.grow", h("b", title), h("div.small.muted", text)), link);
    body.append(
      h("div.card", h("h3", { style: "margin-bottom:6px" }, "Thiết lập"),
        step(!L.api.isDemo(), "Kết nối Google Sheets (lưu lịch sử & bài tập)", L.api.isDemo() ? "Đang ở chế độ DEMO: dữ liệu chỉ nằm trong trình duyệt này. Làm theo HUONG-DAN.md bước 3." : "Đã kết nối. Lịch sử chơi và bài nộp được ghi vào Google Sheets của cô."),
        step(gh.configured(), "Kết nối GitHub (đăng app lên web)", gh.configured() ? "Đã nhập token. Cô có thể đăng app ở tab 'Đăng app'." : "Chưa nhập token. Vào Cài đặt để dán token, sau đó cô đăng app ngay trên web.", h("a.btn.sm", { href: "#/teacher/settings" }, "Cài đặt"))),
      h("div.card", h("h3", { style: "margin-bottom:6px" }, "Nội dung hiện có"),
        h("div.row", h("span.pill.sky", m.curricula.length + " giáo trình"), h("span.pill.mint", m.curricula.reduce((a, c) => a + (c.units || []).length, 0) + " unit"), h("span.pill.peach", (m.apps || []).length + " app/game"), h("span.pill.butter", hwList.length + " bài tập")),
        h("div.row", { style: "margin-top:14px" }, h("a.btn", { href: "#/teacher/upload" }, "⬆️ Đăng app mới"), h("a.btn.peach", { href: "#/teacher/hw-edit/new" }, "📝 Tạo bài tập"), h("a.btn.sky", { href: "#/teacher/report" }, "📊 Xem báo cáo"))));
  }

  /* ---------- Đăng app ---------- */
  async function tUpload(body) {
    const m = L.state.manifest;
    const f = { cur: m.curricula[0] && m.curricula[0].id, unit: "", newUnit: "", title: "", kind: "app", desc: "", file: null };
    const status = h("div");
    const drop = h("div.drop", { onclick: () => pick.click() }, h("div", { style: "font-size:34px" }, "📱"), h("b", "Chọn file HTML của app/game"), h("div.small.muted", "Bấm vào đây hoặc kéo thả file .html vào (mỗi lần 1 file)"));
    const pick = h("input", { type: "file", accept: ".html,.htm,text/html", class: "hidden", onchange: e => setFile(e.target.files[0]) });
    drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("over"));
    drop.addEventListener("drop", e => { e.preventDefault(); drop.classList.remove("over"); if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]); });
    const titleIn = h("input", { type: "text", placeholder: "Tên hiển thị cho học viên", oninput: e => f.title = e.target.value });
    async function setFile(file) {
      if (!file) return;
      if (!/\.html?$/i.test(file.name)) { toast("Chỉ nhận file .html"); return; }
      f.file = file;
      drop.innerHTML = ""; drop.append(h("div", { style: "font-size:30px" }, "✅"), h("b", file.name), h("div.small.muted", (file.size / 1048576).toFixed(2) + " MB · bấm để chọn file khác"));
      if (!f.title) {
        let t = file.name.replace(/\.html?$/i, "").replace(/[_-]+/g, " ");
        try { const head = await file.slice(0, 30000).text(); const mm = head.match(/<title[^>]*>([^<]{2,80})<\/title>/i); if (mm) t = mm[1].trim(); } catch (e) { }
        f.title = t; titleIn.value = t;
      }
    }
    const unitBox = h("div");
    const drawUnit = () => {
      unitBox.innerHTML = ""; const c = L.cur(f.cur);
      unitBox.append(h("label.field", h("span", "Unit / chủ đề"), selUnit(c, f.unit, v => { f.unit = v; })),
        h("label.field", { style: "margin-top:8px" }, h("span", "Hoặc tạo unit mới (nếu điền ô này, sẽ dùng unit mới)"), h("input", { type: "text", placeholder: "Ví dụ: Unit 3 – Tên unit do cô đặt", value: f.newUnit, oninput: e => f.newUnit = e.target.value })));
    };
    const doUpload = async () => {
      if (!f.file) { toast("Chọn file HTML trước nhé"); return; }
      if (!f.title.trim()) { toast("Nhập tên hiển thị"); return; }
      if (!gh.configured()) { status.innerHTML = ""; status.append(h("div.err", "Chưa kết nối GitHub nên chưa đăng file lên web được. Vào Cài đặt để nhập token, hoặc dùng 'Cách 2' bên dưới nếu cô đã tự kéo file vào GitHub.")); return; }
      btn.disabled = true; status.innerHTML = ""; status.append(h("div.hint", h("span.spinner"), " Đang đăng lên GitHub… (file lớn có thể mất vài chục giây)"));
      try {
        const m2 = await gh.readManifest();
        const c = m2.curricula.find(x => x.id === f.cur); let unitId = f.unit;
        if (f.newUnit.trim()) { unitId = slug(f.newUnit) + "-" + uid("").slice(-4); c.units = c.units || []; c.units.push({ id: unitId, name: f.newUnit.trim() }); }
        const id = slug(f.title) + "-" + uid("").slice(-4);
        const path = "apps/" + f.cur + "/" + (unitId || "khac") + "/" + id + ".html";
        const b64 = await L.fileToBase64(f.file);
        await gh.putFile(path, b64, "Đăng app: " + f.title.trim());
        m2.apps = m2.apps || []; m2.apps.push({ id, title: f.title.trim(), cur: f.cur, unit: unitId || "", file: path, kind: f.kind, desc: f.desc.trim(), added: new Date().toISOString() });
        await gh.writeManifest(m2, "Thêm vào danh mục: " + f.title.trim());
        L.state.manifest = m2;
        status.innerHTML = ""; status.append(h("div.ok-box", "Đã đăng \"" + f.title.trim() + "\" ✓. GitHub Pages cần khoảng 1–3 phút để cập nhật trang, sau đó học viên mở được. Cô có thể bấm 'Chơi thử' sau ít phút.", h("div", { style: "margin-top:8px" }, h("a.btn.sm", { href: "#/play/" + id }, "Chơi thử ▶"))));
        f.file = null; f.title = ""; f.newUnit = ""; titleIn.value = ""; drop.innerHTML = ""; drop.append(h("div", { style: "font-size:34px" }, "📱"), h("b", "Chọn file HTML tiếp theo"));
        drawUnit();
      } catch (e) { status.innerHTML = ""; status.append(h("div.err", e.message)); }
      btn.disabled = false;
    };
    const btn = h("button.btn", { style: "margin-top:14px", onclick: doUpload }, "⬆️ Đăng lên web");
    body.append(h("div.card", h("h3", { style: "margin-bottom:10px" }, "Đăng app / game HTML"), pick, drop,
      h("div.two", { style: "margin-top:12px" },
        h("label.field", h("span", "Giáo trình"), selCur(m, f.cur, v => { f.cur = v; f.unit = ""; drawUnit(); })),
        h("label.field", h("span", "Loại"), h("select", { onchange: e => f.kind = e.target.value }, h("option", { value: "app" }, "📱 App ôn tập"), h("option", { value: "game" }, "🎮 Game")))),
      h("div", { style: "margin-top:8px" }, unitBox),
      h("label.field", { style: "margin-top:8px" }, h("span", "Tên hiển thị"), titleIn),
      h("label.field", { style: "margin-top:8px" }, h("span", "Mô tả ngắn (không bắt buộc)"), h("input", { type: "text", placeholder: "Ví dụ: Ôn từ vựng và so sánh hơn", oninput: e => f.desc = e.target.value })),
      btn, status));
    drawUnit();

    /* Cách 2: khai báo file đã có sẵn trong kho */
    const g = { title: "", path: "", cur: m.curricula[0] && m.curricula[0].id, unit: "", kind: "app" };
    const unitBox2 = h("div");
    const drawUnit2 = () => { unitBox2.innerHTML = ""; unitBox2.append(h("label.field", h("span", "Unit"), selUnit(L.cur(g.cur), g.unit, v => g.unit = v))); };
    drawUnit2();
    body.append(h("details.fold", h("summary", "Cách 2: cô đã tự kéo file vào GitHub, chỉ cần khai báo"),
      h("p.small.muted", "Dùng khi file quá lớn hoặc cô muốn đăng bằng trang GitHub. Đặt file vào thư mục apps/ của kho, rồi điền đường dẫn (ví dụ apps/gs8/unit2.html)."),
      h("div.two", h("label.field", h("span", "Giáo trình"), selCur(m, g.cur, v => { g.cur = v; g.unit = ""; drawUnit2(); })), unitBox2),
      h("label.field", { style: "margin-top:8px" }, h("span", "Tên hiển thị"), h("input", { type: "text", oninput: e => g.title = e.target.value })),
      h("label.field", { style: "margin-top:8px" }, h("span", "Đường dẫn file trong kho"), h("input", { type: "text", placeholder: "apps/gs8/ten-file.html", oninput: e => g.path = e.target.value.trim() })),
      h("button.btn.sm", { style: "margin-top:10px", onclick: async () => {
        if (!g.title.trim() || !/^apps\/.+\.html?$/i.test(g.path)) { toast("Cần tên và đường dẫn dạng apps/…/….html"); return; }
        await editManifest(mm => { mm.apps = mm.apps || []; mm.apps.push({ id: slug(g.title) + "-" + uid("").slice(-4), title: g.title.trim(), cur: g.cur, unit: g.unit, file: g.path, kind: g.kind, desc: "", added: new Date().toISOString() }); }, "Khai báo app: " + g.title);
        toast("Đã khai báo ✓");
      } }, "Khai báo")));
  }

  /* ---------- Giáo trình & unit ---------- */
  async function tContent(body) {
    let sel = (L.state.manifest.curricula[0] || {}).id;
    let assigns = {}; try { (await L.api.call("appAssignList")).list.forEach(x => assigns[x.appId] = x.names); } catch (e) { console.warn(e); }
    const draw = () => {
      body.innerHTML = "";
      const m = L.state.manifest, c = L.cur(sel);
      const save = async (fn, msg) => { try { await editManifest(fn, msg); toast("Đã lưu ✓"); } catch (e) { toast(e.message, 5000); } draw(); };
      body.append(h("div.card", h("div.row", h("h3", "Giáo trình"), h("span.grow"),
        h("button.btn.sm.ghost", { onclick: () => modal(close => { const n = h("input", { type: "text", placeholder: "Tên giáo trình mới" }), e = h("input", { type: "text", value: "📚", style: "width:70px" }); return h("div", h("h3", { style: "margin-bottom:10px" }, "Thêm giáo trình"), h("label.field", h("span", "Tên"), n), h("label.field", { style: "margin-top:8px" }, h("span", "Biểu tượng (emoji)"), e), h("div.row", { style: "justify-content:flex-end;margin-top:14px" }, h("button.btn.ghost", { onclick: close }, "Huỷ"), h("button.btn", { onclick: () => { if (!n.value.trim()) return; close(); sel = slug(n.value) + "-" + uid("").slice(-3); save(mm => mm.curricula.push({ id: sel, name: n.value.trim(), emoji: e.value || "📚", tint: (() => { const used = new Set(mm.curricula.map(x => x.tint)); for (let k = 0; k < 16; k++) if (!used.has(k)) return k; return mm.curricula.length % 16; })(), units: [] }), "Thêm giáo trình " + n.value); } }, "Thêm"))); }) }, "+ Thêm giáo trình")),
        h("div.tabs", { style: "margin-top:10px" }, m.curricula.map(x => h("button" + (x.id === sel ? ".on" : ""), { onclick: () => { sel = x.id; draw(); } }, (x.emoji || "") + " " + x.name)))));
      if (!c) return;
      /* tên giáo trình */
      body.append(h("div.card", h("div.row", h("input", { type: "text", value: c.name, style: "max-width:320px", id: "curName" }), h("button.btn.sm", { onclick: () => { const v = $("#curName").value.trim(); if (v) save(mm => { mm.curricula.find(x => x.id === sel).name = v; }, "Đổi tên giáo trình"); } }, "Đổi tên"))));
      /* unit */
      const unitCard = h("div.card", h("div.row", h("h3", "Unit / chủ đề của " + c.name), h("span.grow")));
      const nu = h("input", { type: "text", placeholder: "Tên unit mới (do cô đặt)", style: "max-width:340px" });
      unitCard.append(h("div.row", { style: "margin:8px 0" }, nu, h("button.btn.sm", { onclick: () => { const v = nu.value.trim(); if (!v) return; save(mm => { const cc = mm.curricula.find(x => x.id === sel); cc.units = cc.units || []; cc.units.push({ id: slug(v) + "-" + uid("").slice(-4), name: v }); }, "Thêm unit " + v); } }, "+ Thêm unit")));
      (c.units || []).forEach((u, i) => {
        const nameIn = h("input", { type: "text", value: u.name, style: "flex:1;min-width:160px" });
        const nApps = L.appsIn(sel, u.id).length;
        unitCard.append(h("div.item", nameIn, h("span.pill", nApps + " app"),
          h("button.btn.sm.ghost", { title: "Lên", disabled: i === 0, onclick: () => save(mm => { const a = mm.curricula.find(x => x.id === sel).units; [a[i - 1], a[i]] = [a[i], a[i - 1]]; }, "Sắp xếp unit") }, "↑"),
          h("button.btn.sm.ghost", { title: "Xuống", disabled: i === (c.units.length - 1), onclick: () => save(mm => { const a = mm.curricula.find(x => x.id === sel).units; [a[i + 1], a[i]] = [a[i], a[i + 1]]; }, "Sắp xếp unit") }, "↓"),
          h("button.btn.sm", { onclick: () => { const v = nameIn.value.trim(); if (v) save(mm => { mm.curricula.find(x => x.id === sel).units[i].name = v; }, "Đổi tên unit"); } }, "Lưu"),
          h("button.btn.sm.rose", { onclick: async () => { if (nApps && !(await L.confirmBox("Unit này đang có " + nApps + " app. Xoá unit thì các app chuyển về 'Chưa phân unit'. Tiếp tục?", "Xoá unit"))) return; save(mm => { const cc = mm.curricula.find(x => x.id === sel); cc.units.splice(i, 1); (mm.apps || []).forEach(a => { if (a.cur === sel && a.unit === u.id) a.unit = ""; }); }, "Xoá unit"); } }, "Xoá")));
      });
      if (!(c.units || []).length) unitCard.append(h("div.empty", "Chưa có unit. Thêm unit đầu tiên ở trên."));
      body.append(unitCard);
      /* app */
      const apps = L.appsIn(sel);
      const appCard = h("div.card", h("h3", { style: "margin-bottom:6px" }, "App & game trong " + c.name));
      apps.forEach(a => {
        const t = h("input", { type: "text", value: a.title, style: "flex:1;min-width:150px" });
        const un = selUnit(c, a.unit, v => { a._unit = v; });
        appCard.append(h("div.item", { style: "flex-wrap:wrap" }, h("div.ic." + (a.kind === "game" ? "tint1" : "tint2"), a.kind === "game" ? "🎮" : "📱"), t, un,
          h("button.btn.sm", { onclick: () => save(mm => { const x = mm.apps.find(z => z.id === a.id); x.title = t.value.trim() || x.title; if (a._unit !== undefined) x.unit = a._unit; }, "Sửa app") }, "Lưu"),
          h("a.btn.sm.ghost", { href: "#/play/" + a.id }, "Mở"),
          h("button.btn.sm.ghost", { title: "Giao app này cho học viên nào", onclick: () => pickStudents(assigns[a.id] || [], async v => { try { await L.api.call("appAssignSave", { appId: a.id, names: v }); if (v.length) assigns[a.id] = v; else delete assigns[a.id]; toast("Đã lưu ✓"); } catch (e) { toast(e.message, 5000); } draw(); }, "App này chỉ hiện trong danh sách của các học viên được chọn (không chọn ai = tất cả đều thấy). Đây là ẩn trên giao diện, không phải khoá kín.") }, "👥 " + ((assigns[a.id] || []).length ? (assigns[a.id].length + " em") : "Tất cả")),
          h("button.btn.sm.rose", { onclick: async () => { if (await L.confirmBox("Gỡ \"" + a.title + "\" khỏi danh mục? (File vẫn còn trong kho GitHub, lịch sử chơi không bị xoá.)", "Gỡ")) save(mm => { mm.apps = mm.apps.filter(z => z.id !== a.id); }, "Gỡ app " + a.title); } }, "Gỡ")));
      });
      if (!apps.length) appCard.append(h("div.empty", "Chưa có app nào.", h("div", h("a.btn.sm", { style: "margin-top:8px", href: "#/teacher/upload" }, "⬆️ Đăng app"))));
      body.append(appCard);
      if (!gh.configured()) body.append(h("div.hint", { style: "margin-top:14px" }, "Chưa kết nối GitHub nên thay đổi này chỉ lưu trên máy này (để cô thử giao diện). Muốn học viên thấy, hãy nhập token GitHub ở tab Cài đặt."));
    };
    draw();
  }

  /* ---------- Thư viện hình ---------- */
  /** thu nhỏ ảnh (cạnh dài tối đa 640px) và đổi sang WebP để nhẹ kho GitHub */
  async function shrinkImage(file, max) {
    const url = URL.createObjectURL(file);
    try {
      const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Không đọc được ảnh " + file.name)); i.src = url; });
      const k = Math.min(1, (max || 640) / Math.max(im.naturalWidth, im.naturalHeight));
      const w = Math.max(1, Math.round(im.naturalWidth * k)), hh = Math.max(1, Math.round(im.naturalHeight * k));
      const cv = document.createElement("canvas"); cv.width = w; cv.height = hh; cv.getContext("2d").drawImage(im, 0, 0, w, hh);
      let blob = await new Promise(r => cv.toBlob(r, "image/webp", 0.85)), ext = "webp";
      if (!blob || blob.type !== "image/webp") { blob = await new Promise(r => cv.toBlob(r, "image/png")); ext = "png"; }
      return { blob, ext, w, h: hh };
    } finally { URL.revokeObjectURL(url); }
  }
  async function readImages() {
    if (gh.configured()) { const f = await gh.getFile("data/images.json"); if (f) { try { return JSON.parse(L.base64ToText(f.content)).images || {}; } catch (e) { } } return {}; }
    return Object.assign({}, await L.imgs.load(true));
  }
  async function writeImages(mut, msg) {
    const f = await gh.getFile("data/images.json"); let j = { version: 1, images: {} };
    if (f) { try { j = JSON.parse(L.base64ToText(f.content)); } catch (e) { } }
    j.images = j.images || {}; mut(j.images);
    await gh.putFile("data/images.json", L.textToBase64(JSON.stringify(j, null, 2) + "\n"), msg || "Cập nhật thư viện hình");
    L.imgs.setMap(Object.assign({}, j.images)); return j.images;
  }

  async function tImages(body) {
    let lib = {}; try { lib = await readImages(); } catch (e) { body.append(h("div.err", e.message)); }
    L.imgs.setMap(Object.assign({}, lib));
    let staged = [];
    const stagedBox = h("div"), status = h("div"), libBox = h("div");
    const pick = h("input", { type: "file", accept: "image/png,image/jpeg,image/webp,image/gif", multiple: true, class: "hidden", onchange: e => { addFiles(Array.from(e.target.files)); pick.value = ""; } });
    const drop = h("div.drop", { onclick: () => pick.click() }, h("div", { style: "font-size:34px" }, "🖼️"), h("b", "Chọn nhiều ảnh cùng lúc"), h("div.small.muted", "Bấm vào đây hoặc kéo thả. Tên file = từ vựng (apple.png → \"apple\"). Ảnh được tự thu nhỏ để trang tải nhanh."));
    drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("over"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("over"));
    drop.addEventListener("drop", e => { e.preventDefault(); drop.classList.remove("over"); addFiles(Array.from(e.dataTransfer.files)); });
    function addFiles(files) {
      files.filter(f => /^image\//.test(f.type) && f.type !== "image/svg+xml").forEach(f => staged.push({ file: f, key: slug(f.name.replace(/\.[^.]+$/, "")), url: URL.createObjectURL(f) }));
      drawStaged();
    }
    function drawStaged() {
      stagedBox.innerHTML = "";
      if (!staged.length) return;
      stagedBox.append(h("div.imglib", { style: "margin-top:12px" }, staged.map((s, i) => h("div.im", h("img", { src: s.url, alt: "" }),
        h("input", { type: "text", value: s.key, style: "padding:4px 6px;font-size:13px", title: "Từ vựng gắn với ảnh này", oninput: e => { s.key = slug(e.target.value); } }),
        lib[s.key] ? h("div.small", { style: "color:var(--warn)" }, "đã có – sẽ thay") : null,
        h("button.btn.sm.ghost", { style: "margin-top:4px", onclick: () => { staged.splice(i, 1); drawStaged(); } }, "Bỏ")))),
        h("div.row", { style: "margin-top:12px" }, h("button.btn", { onclick: upload }, "⬆️ Tải lên " + staged.length + " hình"), h("button.btn.ghost", { onclick: () => { staged = []; drawStaged(); } }, "Xoá danh sách")));
    }
    async function upload() {
      if (!gh.configured()) { toast("Cần nhập token GitHub ở tab Cài đặt để tải hình lên"); return; }
      status.innerHTML = ""; const done = {}; let n = 0, failed = [];
      const bar = h("div.hint"); status.append(bar);
      for (const s of staged) {
        if (!s.key) { failed.push(s.file.name + " (tên trống)"); continue; }
        bar.textContent = "Đang tải " + (++n) + "/" + staged.length + ": " + s.key + "…";
        try {
          const r = await shrinkImage(s.file, 640);
          const path = "assets/img/" + s.key + "." + r.ext;
          await gh.putFile(path, await L.fileToBase64(r.blob), "Thêm hình " + s.key);
          done[s.key] = path;
        } catch (e) { failed.push(s.key + ": " + e.message); }
      }
      if (Object.keys(done).length) { try { lib = await writeImages(m => Object.assign(m, done), "Thêm " + Object.keys(done).length + " hình vào thư viện"); } catch (e) { failed.push("Ghi danh mục: " + e.message); } }
      status.innerHTML = "";
      status.append(failed.length ? h("div.err", failed.map(x => h("div", "• " + x))) : null, Object.keys(done).length ? h("div.ok-box", "Đã tải " + Object.keys(done).length + " hình ✓. GitHub Pages cần 1–3 phút để học viên thấy ảnh.") : null);
      staged = []; drawStaged(); drawLib();
    }
    let q = "";
    function drawLib() {
      libBox.innerHTML = "";
      const keys = Object.keys(lib).sort().filter(k => !q || k.includes(slug(q)));
      libBox.append(h("div.row", h("h3", "Thư viện (" + Object.keys(lib).length + " hình)"), h("span.grow"), h("input", { type: "text", placeholder: "Tìm từ…", style: "max-width:200px", value: q, oninput: e => { q = e.target.value; drawLib2(); } })));
      libBox.append(h("div#libGrid"));
      drawLib2();
    }
    function drawLib2() {
      const g = $("#libGrid", libBox); if (!g) return; g.innerHTML = "";
      const keys = Object.keys(lib).sort().filter(k => !q || k.includes(slug(q)));
      if (!keys.length) { g.append(h("div.empty", Object.keys(lib).length ? "Không có hình khớp." : "Chưa có hình nào. Tải ảnh ở trên.")); return; }
      g.append(h("div.imglib", { style: "margin-top:10px" }, keys.map(k => h("div.im", h("img", { src: lib[k], alt: k, loading: "lazy" }), h("div", k),
        h("button.btn.sm.rose", { style: "margin-top:4px", onclick: async () => {
          if (!(await L.confirmBox("Xoá hình \"" + k + "\" khỏi thư viện?", "Xoá"))) return;
          try {
            if (gh.configured()) { const f = await gh.getFile(lib[k]); if (f) await gh.api("/contents/" + lib[k].split("/").map(encodeURIComponent).join("/"), { method: "DELETE", body: { message: "Xoá hình " + k, sha: f.sha, branch: gh.cfg().branch } }); }
            lib = await writeImages(m => { delete m[k]; }, "Gỡ hình " + k); drawLib();
          } catch (e) { toast(e.message, 5000); }
        } }, "Xoá")))));
    }
    body.append(
      h("div.card", h("h3", { style: "margin-bottom:6px" }, "Thư viện hình cho từ vựng"),
        h("p.small.muted", { style: "margin:0 0 10px" }, "Cô tải ảnh của mình lên đây (ảnh tự chụp hoặc ảnh cô có quyền dùng). Trong bài tập, viết ", h("code", "IMG: apple"), " thì trang tự lấy ảnh tên \"apple\". Chưa có ảnh thì trang dùng emoji gợi ý nếu có (🍎)."),
        gh.configured() ? null : h("div.hint", { style: "margin-bottom:10px" }, "Cần nhập token GitHub ở tab Cài đặt thì mới tải hình lên được."),
        drop, pick, stagedBox, status),
      h("div.card", libBox));
    drawLib();
  }

  /* ---------- Học viên: tài khoản riêng ---------- */
  const CODE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
  const genCode = () => { let c = ""; const a = new Uint32Array(5); (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => a[i] = Math.floor(Math.random() * 4e9)); a.forEach(v => c += CODE_ALPHABET[v % CODE_ALPHABET.length]); return c; };

  /** hộp chọn học viên (dùng cho giao bài / giao app) */
  function pickStudents(current, onSave, note) {
    modal(close => {
      const box = h("div", h("h3", { style: "margin-bottom:6px" }, "Chọn học viên"), h("div.small.muted", { style: "margin-bottom:10px" }, note || ""), h("div.empty", h("span.spinner")));
      L.api.call("studentList").then(r => {
        const list = r.list.filter(x => x.active);
        const chosen = new Set(current.map(n => L.plain(n)));
        box.innerHTML = "";
        box.append(h("h3", { style: "margin-bottom:6px" }, "Chọn học viên"), h("div.small.muted", { style: "margin-bottom:10px" }, note || ""));
        if (!list.length) { box.append(h("div.hint", "Chưa có học viên nào trong danh sách. Vào tab \"👥 Học viên\" để thêm, rồi quay lại đây."), h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn.ghost", { onclick: close }, "Đóng"))); return; }
        const boxes = list.map(x => { const cb = h("input", { type: "checkbox", style: "width:20px;height:20px", checked: chosen.has(L.plain(x.name)) }); return { x, cb }; });
        box.append(h("div.row", { style: "margin-bottom:8px" },
          h("button.btn.sm.ghost", { onclick: () => boxes.forEach(b => b.cb.checked = true) }, "Chọn tất cả"),
          h("button.btn.sm.ghost", { onclick: () => boxes.forEach(b => b.cb.checked = false) }, "Bỏ chọn hết")),
          h("div", { style: "max-height:48vh;overflow:auto" }, boxes.map(b => h("label.row", { style: "gap:10px;padding:6px 2px;cursor:pointer" }, b.cb, h("span", b.x.name)))),
          h("div.row", { style: "justify-content:flex-end;margin-top:14px" }, h("button.btn.ghost", { onclick: close }, "Huỷ"),
            h("button.btn", { onclick: () => { const v = boxes.filter(b => b.cb.checked).map(b => b.x.name); close(); onSave(v.length === boxes.length ? [] : v); } }, "Lưu")));
      }).catch(e => { box.innerHTML = ""; box.append(h("div.err", e.message), h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn.ghost", { onclick: close }, "Đóng"))); });
      return box;
    });
  }

  async function tStudents(body) {
    let data = await L.api.call("studentList");
    let profs = []; try { profs = (await L.api.call("profileList")).list || []; } catch (e) { }
    const profOf = nm => profs.find(p => L.sameName(p.name, nm));
    const redraw = async () => { data = await L.api.call("studentList"); draw(); };
    const guard = async (fn) => { try { await fn(); } catch (e) { toast(e.message, 5000); } };
    const draw = () => {
      body.innerHTML = "";
      const active = data.list.filter(x => x.active).length;
      body.append(h("div.card",
        h("h3", { style: "margin-bottom:6px" }, "Tài khoản học viên"),
        data.roster
          ? h("div.ok-box", "Đang bật tài khoản riêng: học viên phải nhập đúng tên và mật khẩu của chính mình. Mật khẩu lớp chung không còn dùng để đăng nhập.")
          : h("div.hint", "Chưa có học viên nào trong danh sách, nên hiện vẫn dùng mật khẩu lớp chung. Thêm học viên ở dưới (ít nhất 1 em) để chuyển sang mật khẩu riêng từng em."),
        h("p.small.muted", { style: "margin:8px 0 0" }, "Khi bật mật khẩu riêng: em A chỉ xem được lịch sử và điểm của em A. Cô có thể giao bài tập hoặc app riêng cho từng em (nút \"Giao cho\" ở bài tập và ở tab Giáo trình & unit).")));

      /* thêm hàng loạt */
      const ta = h("textarea", { style: "min-height:110px;font-family:var(--bfont)", placeholder: "Mỗi dòng một học viên. Ví dụ:\nBin\nLan Anh\nMinh, minh2024   (gõ thêm dấu phẩy + mật khẩu nếu cô muốn tự đặt)", spellcheck: "false" });
      body.append(h("div.card", h("h3", { style: "margin-bottom:6px" }, "Thêm học viên"),
        h("div.small.muted", { style: "margin-bottom:8px" }, "Dán danh sách tên, trang tự tạo mật khẩu 5 ký tự dễ gõ (chữ thường và số) cho từng em. Hai em trùng tên thì thêm chữ phân biệt, ví dụ \"An A\" và \"An B\"."),
        ta, h("div.row", { style: "justify-content:flex-end;margin-top:10px" }, h("button.btn", { onclick: () => guard(async () => {
          const items = ta.value.split(/\n/).map(l => l.trim()).filter(Boolean).map(l => { const p = l.split(/[,;\t]/).map(x => x.trim()); return { name: p[0], code: p[1] || genCode(), active: true }; });
          const exist = new Set(data.list.map(x => L.plain(x.name)));
          const fresh = items.filter(x => !exist.has(L.plain(x.name)));
          if (!fresh.length) throw new Error("Các tên này đã có trong danh sách rồi");
          await L.api.call("studentSave", { list: fresh });
          toast("Đã thêm " + fresh.length + " học viên ✓"); await redraw();
        }) }, "Thêm vào danh sách"))));

      /* danh sách */
      const list = h("div.card", h("div.row", h("h3", "Danh sách (" + data.list.length + ")"), h("span.pill.mint", active + " đang hoạt động"), h("span.grow"),
        data.list.length ? h("button.btn.sm.ghost", { onclick: () => L.copyText(data.list.map(x => x.name + ": " + x.code).join("\n")) }, "📋 Sao chép tên + mật khẩu") : null));
      list.append(h("div.small.muted", { style: "margin:6px 0 10px" }, "Gửi mật khẩu riêng cho từng em hoặc phụ huynh. Đừng đăng danh sách này lên nơi công khai."));
      data.list.forEach(x => {
        const nameIn = h("input", { type: "text", value: x.name, style: "flex:1;min-width:130px" });
        const codeIn = h("input", { type: "text", value: x.code, style: "width:130px", spellcheck: "false", autocapitalize: "off" });
        const noteIn = h("input", { type: "text", value: x.note, placeholder: "Ghi chú (tuỳ chọn)", style: "flex:1;min-width:120px" });
        const act = h("input", { type: "checkbox", style: "width:20px;height:20px", checked: x.active, title: "Bỏ tick = tạm khoá, em không đăng nhập được" });
        const collect = () => ({ name: nameIn.value.trim(), code: codeIn.value.trim(), active: act.checked, note: noteIn.value.trim() });
        const pf = profOf(x.name), petN = pf && pf.pet && L.pet.SP[pf.pet] ? L.pet.SP[pf.pet].n : "";
        list.append(h("div.item", { style: "flex-wrap:wrap;gap:8px" }, nameIn, codeIn, noteIn, pf ? h("span.small.muted", { title: "Dữ liệu trong game (xu, chuỗi ngày, thú nuôi)" }, "🪙 " + pf.coins + (pf.streak ? " · 🔥 " + pf.streak + " ngày" : "") + (petN ? " · 🐾 " + petN : "")) : null, h("label.row", { style: "gap:4px;cursor:pointer" }, act, h("span.small", "Hoạt động")),
          h("button.btn.sm", { onclick: () => guard(async () => { await L.api.call("studentSave", { list: [collect()], oldName: x.name }); toast("Đã lưu ✓"); await redraw(); }) }, "Lưu"),
          h("button.btn.sm.ghost", { title: "Tạo mật khẩu mới", onclick: () => { codeIn.value = genCode(); } }, "🔄"),
          h("button.btn.sm.rose", { onclick: async () => { if (await L.confirmBox("Xoá \"" + x.name + "\" khỏi danh sách? (Lịch sử học của em vẫn được giữ.)", "Xoá")) guard(async () => { await L.api.call("studentDelete", { name: x.name }); await redraw(); }); } }, "Xoá")));
      });
      if (!data.list.length) list.append(h("div.empty", "Chưa có học viên nào."));
      body.append(list);
    };
    draw();
  }

  /* ---------- Bài tập: danh sách ---------- */
  async function tHwList(body) {
    const list = await L.loadHw(true);
    const m = L.state.manifest;
    const draw = () => {
      body.innerHTML = "";
      body.append(h("div.card", h("div.row", h("h3", "Bài tập đã tạo"), h("span.grow"), h("button.btn.sky", { onclick: () => ocrModal(secs => { sessionStorage.setItem("lse_hw_draft", JSON.stringify({ title: "", sections: secs })); L.go("/teacher/hw-edit/new"); }) }, "📷 Tạo từ ảnh sách"), h("a.btn", { href: "#/teacher/hw-edit/new" }, "+ Tạo bài tập mới")),
        list.length ? list.map(x => {
          const c = L.cur(x.curId);
          return h("div.item", { style: "flex-wrap:wrap" }, h("div.ic.tint3", "📝"),
            h("div.grow", h("b", x.title), h("div.small.muted", (c ? c.name + (x.unitId ? " · " + L.unitName(c, x.unitId) : "") + " · " : "") + (x.nItems || 0) + " ý · " + (x.nSections || 0) + " phần"), h("span.pill." + (x.open ? "mint" : "rose"), x.open ? "Đang mở" : "Đã đóng")),
            h("button.btn.sm.ghost", { onclick: async () => { try { await L.api.call("hwSetOpen", { id: x.id, open: !x.open }); x.open = !x.open; L.state.hwList = null; draw(); } catch (e) { toast(e.message); } } }, x.open ? "Đóng" : "Mở"),
            h("a.btn.sm", { href: "#/teacher/hw-edit/" + x.id }, "Sửa"),
            h("a.btn.sm.ghost", { href: "#/hw/" + x.id }, "Xem thử"),
            h("a.btn.sm.ghost", { href: "#/print/" + x.id, title: "In phiếu A4 kèm đáp án / lưu PDF" }, "🖨️ In phiếu"),
            h("button.btn.sm.sky", { onclick: () => hwResultsModal(x) }, "Kết quả"),
            h("button.btn.sm.rose", { onclick: async () => { if (await L.confirmBox("Xoá bài tập \"" + x.title + "\"? Bài nộp của học viên vẫn được giữ trong bảng tính.", "Xoá")) { try { await L.api.call("hwDelete", { id: x.id }); list.splice(list.indexOf(x), 1); L.state.hwList = null; draw(); } catch (e) { toast(e.message); } } } }, "Xoá"));
        }) : h("div.empty", "Chưa có bài tập nào.")));
    };
    draw();
  }

  async function hwResultsModal(x) {
    modal(close => {
      const box = h("div", h("h3", { style: "margin-bottom:8px" }, "Kết quả: " + x.title), h("div.empty", h("span.spinner")));
      L.api.call("hwResults", { id: x.id }).then(r => {
        const rule = x.scoreRule || "highest";
        const by = {}; r.subs.forEach(s => (by[s.name] = by[s.name] || []).push(s));
        const rows = Object.keys(by).map(n => {
          const a = by[n].sort((p, q) => p.attempt - q.attempt), sc = a.map(s => +s.scaled);
          const fin = rule === "last" ? sc[sc.length - 1] : rule === "avg" ? L.round2(sc.reduce((p, q) => p + q, 0) / sc.length) : Math.max(...sc);
          return h("tr", h("td", h("b", n)), h("td", a.length), h("td", sc.join(", ")), h("td", h("b", String(fin))), h("td", fmtDate(a[a.length - 1].time)));
        });
        box.innerHTML = ""; box.append(h("h3", { style: "margin-bottom:8px" }, "Kết quả: " + x.title), h("div.small.muted", "Điểm cuối theo cách tính: " + ({ highest: "điểm cao nhất", last: "lần làm cuối", avg: "trung bình" }[rule])),
          rows.length ? h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["Học viên", "Số lần", "Điểm từng lần", "Điểm cuối", "Lần gần nhất"].map(t => h("th", t)))), h("tbody", rows))) : h("div.empty", "Chưa có ai nộp bài."),
          h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn.ghost", { onclick: close }, "Đóng")));
      }).catch(e => { box.innerHTML = ""; box.append(h("div.err", e.message)); });
      return box;
    }, { wide: true });
  }

  /* ---------- Bài tập: trình soạn ---------- */
  const defMeta = { timeLimit: 0, start: "", end: "", maxAttempts: 0, scoreRule: "highest", scale: 10, showAfter: "full", assignedTo: [] };
  const toLocalInput = iso => { if (!iso) return ""; const d = new Date(iso); if (isNaN(d)) return ""; const p = n => String(n).padStart(2, "0"); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + "T" + p(d.getHours()) + ":" + p(d.getMinutes()); };
  const newSection = () => ({ id: "s" + uid("").slice(-5), title: "", type: "mcq1", desc: "", media: { img: "", audio: "", yt: "" }, raw: "", topic: "", shuffleQ: false, tfLabels: "en" });

  async function tHwEdit(body, rest) {
    const id = rest[0] || "new";
    let hw;
    if (id === "new") hw = { id: "hw" + uid("").slice(-6), title: "", desc: "", curId: (L.state.manifest.curricula[0] || {}).id || "", unitId: "", open: true, sections: [newSection()], meta: Object.assign({}, defMeta) };
    else hw = (await L.api.call("hwGet", { id })).hw;
    if (id === "new") { try { const dr = JSON.parse(sessionStorage.getItem("lse_hw_draft") || "null"); if (dr && dr.sections && dr.sections.length) { hw.title = dr.title || ""; hw.sections = dr.sections.map(x => Object.assign(newSection(), x)); } sessionStorage.removeItem("lse_hw_draft"); } catch (e) { } }
    hw.meta = Object.assign({}, defMeta, hw.meta || {});
    const m = L.state.manifest;
    try { await L.imgs.load(); } catch (e) { }
    let dirty = false; const markDirty = () => { dirty = true; };
    const secsBox = h("div"), unitBox = h("div");
    const assignInfo = h("span.pill");
    const paintAssign = () => { const n = (hw.meta.assignedTo || []).length; assignInfo.textContent = n ? "Giao riêng cho " + n + " học viên" : "Tất cả học viên"; assignInfo.className = "pill " + (n ? "peach" : "mint"); };
    const assignRow = () => { paintAssign(); return h("div.row", { style: "margin-top:10px" }, h("b", "Giao cho:"), assignInfo, h("button.btn.sm.ghost", { onclick: () => pickStudents(hw.meta.assignedTo || [], v => { hw.meta.assignedTo = v; markDirty(); paintAssign(); }, "Bài tập này chỉ hiện cho các học viên được chọn. Không chọn ai = tất cả học viên đều thấy.") }, "Chọn học viên…")); };

    const drawUnit = () => { unitBox.innerHTML = ""; unitBox.append(h("label.field", h("span", "Unit / chủ đề"), selUnit(L.cur(hw.curId), hw.unitId, v => { hw.unitId = v; markDirty(); }))); };
    const info = h("div.card", h("h3", { style: "margin-bottom:10px" }, id === "new" ? "Bài tập mới" : "Sửa bài tập"),
      h("label.field", h("span", "Tiêu đề bài tập *"), h("input", { type: "text", value: hw.title, placeholder: "Ví dụ: Present simple – ôn tập", oninput: e => { hw.title = e.target.value; markDirty(); } })),
      h("label.field", { style: "margin-top:8px" }, h("span", "Mô tả / hướng dẫn cho học viên (không bắt buộc)"), h("textarea", { style: "min-height:70px;font-family:var(--bfont)", oninput: e => { hw.desc = e.target.value; markDirty(); } }, hw.desc || "")),
      h("div.two", { style: "margin-top:8px" }, h("label.field", h("span", "Giáo trình"), selCur(m, hw.curId, v => { hw.curId = v; hw.unitId = ""; drawUnit(); markDirty(); })), unitBox),
      h("details.fold", { open: true }, h("summary", "Thời gian, lượt làm và điểm"),
        h("div.two", { style: "margin-top:10px" },
          h("label.field", h("span", "Thời gian làm bài (phút, 0 = không giới hạn)"), h("input", { type: "number", min: 0, value: hw.meta.timeLimit, oninput: e => { hw.meta.timeLimit = +e.target.value || 0; markDirty(); } })),
          h("label.field", h("span", "Số lượt làm tối đa (0 = không giới hạn)"), h("input", { type: "number", min: 0, value: hw.meta.maxAttempts, oninput: e => { hw.meta.maxAttempts = +e.target.value || 0; markDirty(); } })),
          h("label.field", h("span", "Bắt đầu mở (để trống = mở ngay)"), h("input", { type: "datetime-local", value: toLocalInput(hw.meta.start), onchange: e => { hw.meta.start = e.target.value ? new Date(e.target.value).toISOString() : ""; markDirty(); } })),
          h("label.field", h("span", "Hạn nộp (để trống = không giới hạn)"), h("input", { type: "datetime-local", value: toLocalInput(hw.meta.end), onchange: e => { hw.meta.end = e.target.value ? new Date(e.target.value).toISOString() : ""; markDirty(); } })),
          h("label.field", h("span", "Cách lấy điểm cuối cùng"), h("select", { onchange: e => { hw.meta.scoreRule = e.target.value; markDirty(); } }, [["highest", "Điểm cao nhất"], ["last", "Lần làm cuối"], ["avg", "Trung bình các lần"]].map(([v, t]) => h("option", { value: v, selected: hw.meta.scoreRule === v }, t)))),
          h("label.field", h("span", "Thang điểm"), h("input", { type: "number", min: 1, value: hw.meta.scale, oninput: e => { hw.meta.scale = +e.target.value || 10; markDirty(); } }))),
        h("label.field", { style: "margin-top:10px" }, h("span", "Sau khi nộp bài, học viên được xem"), h("select", { onchange: e => { hw.meta.showAfter = e.target.value; markDirty(); } }, [["full", "Điểm + đáp án + giải thích"], ["verdict", "Điểm + biết câu đúng/sai (không hiện đáp án)"], ["score", "Chỉ xem tổng điểm"], ["done", "Chỉ xác nhận hoàn thành"]].map(([v, t]) => h("option", { value: v, selected: hw.meta.showAfter === v }, t)))),
        assignRow(),
        h("label.row", { style: "margin-top:10px;gap:8px;cursor:pointer" }, h("input", { type: "checkbox", style: "width:20px;height:20px", checked: hw.open, onchange: e => { hw.open = e.target.checked; markDirty(); } }), h("b", "Mở bài này cho học viên làm"))));
    drawUnit();

    /* ----- từng phần ----- */
    const drawSecs = () => {
      secsBox.innerHTML = "";
      hw.sections.forEach((sec, i) => secsBox.append(sectionEditor(sec, i)));
    };
    function sectionEditor(sec, i) {
      const T = () => L.hw.TYPE[sec.type];
      const rule = h("div.hint"), prev = h("div.preview.hidden"), status = h("div");
      const ta = h("textarea", { style: "min-height:190px", placeholder: "Dán bài tập (theo cú pháp) vào đây…", spellcheck: "false", oninput: e => { sec.raw = e.target.value; markDirty(); check(); } }, sec.raw || "");
      let showKey = false, timer = null;
      const check = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          status.innerHTML = ""; prev.innerHTML = "";
          if (!sec.raw.trim()) { prev.classList.add("hidden"); return; }
          const p = L.hw.parseSection(sec);
          const n = L.hw.countItems(sec);
          status.append(h("div.row", h("span.pill." + (p.questions.length ? "mint" : "rose"), "Nhận được " + p.questions.length + " câu · " + n + " ý chấm điểm"), p.errors.length ? h("span.pill.peach", p.errors.length + " lỗi cần xem") : null));
          if (p.errors.length) status.append(h("div.err", { style: "margin-top:8px" }, p.errors.slice(0, 8).map(e => h("div", "• " + e)), p.errors.length > 8 ? h("div", "… và " + (p.errors.length - 8) + " lỗi nữa") : null));
          if (p.questions.length) {
            prev.classList.remove("hidden");
            const rt = showKey ? L.hw.keyRuntime(sec) : L.hw.buildRuntime(sec, { keepOrder: true });
            prev.append(h("div.row", { style: "margin-bottom:6px" }, h("b", "Xem trước"), h("span.grow"), h("button.btn.sm.ghost", { onclick: () => { showKey = !showKey; check(); } }, showKey ? "Ẩn đáp án" : "Hiện đáp án")),
              L.hw.renderSection(rt, showKey ? "review" : "do", true, 1, null));
          } else prev.classList.add("hidden");
        }, 250);
      };
      const typeSel = h("select", { onchange: e => { sec.type = e.target.value; markDirty(); fillRule(); check(); } }, L.hw.TYPES.map(t => h("option", { value: t.id, selected: t.id === sec.type }, t.emoji + " " + t.label)));
      const tfSel = h("label.field", h("span", "Nhãn Đúng/Sai"), h("select", { onchange: e => { sec.tfLabels = e.target.value; markDirty(); check(); } }, h("option", { value: "en", selected: sec.tfLabels !== "vi" }, "True / False"), h("option", { value: "vi", selected: sec.tfLabels === "vi" }, "Đúng / Sai")));
      const clsSel = h("label.field", h("span", "Cách làm (Phân loại)"), h("select", { onchange: e => { sec.clsMode = e.target.value; markDirty(); check(); } }, h("option", { value: "drag", selected: sec.clsMode !== "choose" }, "Kéo thẻ vào cột của nhóm (khuyên dùng)"), h("option", { value: "choose", selected: sec.clsMode === "choose" }, "Bấm chọn nhóm cho từng mục")));
      const fillRule = () => {
        clsSel.classList.toggle("hidden", sec.type !== "classify");
        rule.innerHTML = ""; rule.append(h("b", "Cú pháp: "), T().rule, h("div.small", { style: "margin-top:6px" }, h("b", "Gắn hình cho câu: "), "thêm dòng ", h("code", "IMG: apple"), " ngay trước câu (hoặc dòng đầu của khối câu). Sau IMG: có thể là emoji (🍎), tên từ (tra trong tab 🖼️ Hình), hoặc đường dẫn ảnh. ", sec.type === "match" ? h("span", "Ở dạng ghép: vế trái viết ", h("code", "img:dog = con chó"), " để vế trái là hình.") : null));
        tfSel.classList.toggle("hidden", !["tf", "tf4"].includes(sec.type));
      };
      const mediaField = (key, label, ph, accept) => {
        const inp = h("input", { type: "url", value: sec.media[key] || "", placeholder: ph, oninput: e => { sec.media[key] = e.target.value.trim(); markDirty(); } });
        const file = h("input", { type: "file", accept, class: "hidden", onchange: async e => {
          const f = e.target.files[0]; if (!f) return;
          if (!gh.configured()) { toast("Cần nhập token GitHub ở tab Cài đặt để tải file lên"); return; }
          try { toast("Đang tải lên…"); const ext = (f.name.split(".").pop() || "bin").toLowerCase(); const path = "assets/media/" + slug(f.name.replace(/\.[^.]+$/, "")) + "-" + uid("").slice(-4) + "." + ext; await gh.putFile(path, await L.fileToBase64(f), "Tải lên " + f.name); inp.value = sec.media[key] = path; markDirty(); toast("Đã tải lên ✓ (hiện sau 1–3 phút)"); } catch (er) { toast(er.message, 5000); }
        } });
        return h("label.field", h("span", label), h("div.row", { style: "flex-wrap:nowrap" }, h("div.grow", inp), file, key === "yt" ? null : h("button.btn.sm.ghost", { onclick: () => file.click() }, "Tải lên")));
      };
      const box = h("div.secbox",
        h("div.hd", h("span.pill", "Phần " + (i + 1)), h("input", { type: "text", value: sec.title, placeholder: "Tiêu đề phần (ví dụ: Part 1 – Chọn đáp án đúng)", style: "flex:1;min-width:200px", oninput: e => { sec.title = e.target.value; markDirty(); } }),
          h("button.btn.sm.ghost", { disabled: i === 0, onclick: () => { [hw.sections[i - 1], hw.sections[i]] = [hw.sections[i], hw.sections[i - 1]]; markDirty(); drawSecs(); } }, "↑"),
          h("button.btn.sm.ghost", { disabled: i === hw.sections.length - 1, onclick: () => { [hw.sections[i + 1], hw.sections[i]] = [hw.sections[i], hw.sections[i + 1]]; markDirty(); drawSecs(); } }, "↓"),
          h("button.btn.sm.rose", { onclick: async () => { if (hw.sections.length < 2) { toast("Bài cần ít nhất 1 phần"); return; } if (await L.confirmBox("Xoá phần " + (i + 1) + "?", "Xoá")) { hw.sections.splice(i, 1); markDirty(); drawSecs(); } } }, "Xoá")),
        h("div.two", h("label.field", h("span", "Dạng bài"), typeSel), h("label.field", h("span", "Chủ điểm mặc định (dùng cho báo cáo)"), h("input", { type: "text", value: sec.topic, placeholder: "Ví dụ: present simple", oninput: e => { sec.topic = e.target.value; markDirty(); check(); } }))),
        tfSel, clsSel, rule,
        h("label.field", { style: "margin-top:10px" }, h("span", "Nội dung chung của phần (đoạn văn, đề bài chung… không bắt buộc)"), h("textarea", { style: "min-height:80px;font-family:var(--bfont)", oninput: e => { sec.desc = e.target.value; markDirty(); } }, sec.desc || "")),
        h("details.fold", h("summary", "Thêm hình, âm thanh, YouTube"), h("div.stack", { style: "margin-top:8px" }, mediaField("img", "Hình (đường dẫn hoặc link)", "https://… hoặc assets/media/…", "image/*"), mediaField("audio", "Âm thanh MP3", "https://… hoặc assets/media/…", "audio/*"), mediaField("yt", "Video YouTube", "https://youtu.be/…", ""))),
        h("label.row", { style: "margin-top:10px;gap:8px;cursor:pointer" }, h("input", { type: "checkbox", style: "width:20px;height:20px", checked: !!sec.noSpeak, onchange: e => { sec.noSpeak = e.target.checked; markDirty(); } }), "Ẩn các nút 🔊 nghe từ trong phần này (ví dụ bài kiểm tra nghe-viết)"),
        h("label.row", { style: "margin-top:10px;gap:8px;cursor:pointer" }, h("input", { type: "checkbox", style: "width:20px;height:20px", checked: !!sec.shuffleQ, onchange: e => { sec.shuffleQ = e.target.checked; markDirty(); } }), "Xáo thứ tự câu hỏi mỗi lần làm"),
        h("div.row", { style: "margin:12px 0 6px" }, h("b", "Nội dung bài tập (cú pháp)"), h("span.grow"),
          h("button.btn.sm.ghost", { onclick: () => { ta.value = sec.raw = T().sample; markDirty(); check(); } }, "Dùng mẫu"),
          h("button.btn.sm.ghost", { title: "Tự gắn hình (ảnh trong Thư viện hình hoặc emoji) cho các câu có từ vựng cụ thể", onclick: () => {
            const r = L.imgs.suggest(sec.type, sec.raw);
            if (r.unsupported) { toast("Dạng bài này chưa gợi ý hình tự động. Cô thêm dòng IMG: thủ công nhé."); return; }
            if (!r.added) { toast(r.total ? "Không tìm thấy hình phù hợp cho các câu (hoặc đã có IMG:)" : "Chưa có nội dung"); return; }
            ta.value = sec.raw = r.raw; markDirty(); check(); toast("Đã gắn hình cho " + r.added + "/" + r.total + " câu. Cô xem lại và xoá dòng IMG: nếu chưa đúng ý nhé.", 5000);
          } }, "🪄 Gợi ý hình"),
          h("button.btn.sm.sky", { onclick: () => promptModal(sec.type, sec.topic) }, "🤖 Prompt cho AI")),
        ta, status, prev);
      fillRule(); check();
      return box;
    }

    const addBtn = h("div.row", { style: "margin-top:14px" }, h("button.btn.ghost", { onclick: () => { hw.sections.push(newSection()); markDirty(); drawSecs(); } }, "+ Thêm phần (có thể chọn dạng bài khác)"),
      h("button.btn.sky", { onclick: () => ocrModal(secs => { if (hw.sections.length === 1 && !hw.sections[0].raw.trim()) hw.sections = []; secs.forEach(x => hw.sections.push(Object.assign(newSection(), x))); markDirty(); drawSecs(); toast("Đã thêm " + secs.length + " phần từ ảnh. Cô xem lại từng phần nhé."); }) }, "📷 Tạo phần từ ảnh sách"));
    const saveStatus = h("div");
    const doSave = async (after) => {
      saveStatus.innerHTML = "";
      if (!hw.title.trim()) { saveStatus.append(h("div.err", "Nhập tiêu đề bài tập.")); return; }
      let nItems = 0, bad = [];
      hw.sections.forEach((s, i) => { const p = L.hw.parseSection(s); if (!p.questions.length) bad.push("Phần " + (i + 1) + " chưa có câu hỏi hợp lệ"); if (p.errors.length) bad.push("Phần " + (i + 1) + ": " + p.errors.length + " lỗi cú pháp (các câu lỗi sẽ bị bỏ qua)"); nItems += L.hw.countItems(s); });
      if (bad.some(b => /chưa có câu/.test(b))) { saveStatus.append(h("div.err", bad.filter(b => /chưa có câu/.test(b)).map(b => h("div", "• " + b)))); return; }
      if (bad.length && !(await L.confirmBox(bad.join("\n") + "\nVẫn lưu bài?", "Vẫn lưu"))) return;
      hw.meta.nItems = nItems; hw.meta.nSections = hw.sections.length; hw.title = hw.title.trim();
      hw.meta.title = hw.title;
      try {
        const payload = JSON.parse(JSON.stringify(hw));
        await L.api.call("hwSave", { hw: payload });
        L.state.hwList = null; dirty = false; toast("Đã lưu bài tập ✓");
        if (after === "view") L.go("/hw/" + hw.id); else if (id === "new") L.go("/teacher/hw-edit/" + hw.id); else if (after === "list") L.go("/teacher/hw");
      } catch (e) { saveStatus.append(h("div.err", "Chưa lưu được: " + e.message)); }
    };
    body.append(info, h("h3", { style: "margin:20px 2px 0" }, "Các phần của bài"), secsBox, addBtn,
      h("div.card", { style: "position:sticky;bottom:10px" }, saveStatus, h("div.row", h("button.btn.mint", { onclick: () => doSave("stay") }, "💾 Lưu"), h("button.btn", { onclick: () => doSave("view") }, "Lưu & xem thử"), h("a.btn.ghost", { href: "#/teacher/hw" }, "← Danh sách"))));
    drawSecs();
  }

  /* ---------- Ảnh sách -> bài tập (OCR miễn phí) ---------- */
  function ocrModal(onDone) {
    const st = { files: [], rot: 0, enhance: true, vie: false, text: "", urls: [] };
    L.modal(close => {
      const box = h("div");
      const finish = () => { L.ocr.stopWorker(); st.urls.forEach(u => URL.revokeObjectURL(u)); close(); };
      const draw1 = () => {
        box.innerHTML = "";
        const thumbs = h("div.row", { style: "gap:8px" });
        st.urls.forEach(u => thumbs.append(h("img", { src: u, style: "height:90px;border-radius:10px;border:2px solid var(--line,#eee);transform:rotate(" + st.rot + "deg)" })));
        const fi = h("input", { type: "file", accept: "image/*", multiple: true, class: "hidden", onchange: e => { st.files = Array.from(e.target.files); st.urls.forEach(u => URL.revokeObjectURL(u)); st.urls = st.files.map(f => URL.createObjectURL(f)); draw1(); } });
        const prog = h("div"), go = h("button.btn", { disabled: !st.files.length, onclick: async () => {
          go.disabled = true; prog.innerHTML = "";
          const bar = h("div", { style: "height:12px;border-radius:8px;background:#eee;overflow:hidden;margin-top:10px" }, h("div", { style: "height:100%;width:0;background:var(--mint,#8fddba);transition:width .2s" }));
          const msg = h("div.small.muted", { style: "margin-top:6px" }, "Đang chuẩn bị bộ đọc chữ… (lần đầu mất khoảng 10–30 giây để nạp, sau đó nhanh hơn)");
          prog.append(bar, msg);
          try {
            const out = [];
            for (let i = 0; i < st.files.length; i++) {
              const r = await L.ocr.read(st.files[i], { rotate: st.rot, enhance: st.enhance, lang: st.vie ? "eng+vie" : "eng" }, m => {
                if (m.status === "recognizing text") { bar.firstChild.style.width = Math.round(m.progress * 100) + "%"; msg.textContent = "Đang đọc ảnh " + (i + 1) + "/" + st.files.length + "… " + Math.round(m.progress * 100) + "%"; }
                else if (m.status) msg.textContent = "Đang nạp: " + m.status + "…";
              });
              out.push(r.text);
            }
            st.text = L.ocr.clean(out.join("\n\n")); draw2();
          } catch (e) { prog.innerHTML = ""; prog.append(h("div.err", "Chưa đọc được: " + e.message)); go.disabled = false; }
        } }, "🔍 Đọc chữ trong ảnh");
        box.append(h("h3", { style: "margin-top:0" }, "📷 Tạo bài tập từ ảnh sách"),
          h("div.hint", "Chụp (hoặc chọn) ảnh trang sách/phiếu bài tập có chữ in tiếng Anh. Web đọc chữ ngay trên máy cô (miễn phí, ảnh không gửi đi đâu), cô xem và sửa lại, rồi web dựng bài từ chính những chữ đó. ", h("b", "Lưu ý: "), "đọc tốt chữ in tiếng Anh, chụp thẳng – đủ sáng – không nghiêng; nếu có tiếng Việt thì tick ô \"có tiếng Việt\" (vẫn có thể sai dấu); chữ viết tay đọc kém; web không \"hiểu\" bài như AI nên cô cần xem lại."),
          h("div.row", { style: "margin-top:10px" }, h("button.btn.sky", { onclick: () => fi.click() }, "🖼️ Chọn ảnh (có thể chọn nhiều)"), fi,
            h("button.btn.sm.ghost", { onclick: () => { st.rot = (st.rot + 90) % 360; draw1(); } }, "↻ Xoay ảnh"),
            h("label.row", { style: "gap:6px;cursor:pointer" }, h("input", { type: "checkbox", style: "width:18px;height:18px", checked: st.enhance, onchange: e => { st.enhance = e.target.checked; } }), "Làm rõ chữ (khuyên bật với ảnh chụp điện thoại)"),
            h("label.row", { style: "gap:6px;cursor:pointer" }, h("input", { type: "checkbox", style: "width:18px;height:18px", checked: st.vie, onchange: e => { st.vie = e.target.checked; } }), "Trong ảnh có tiếng Việt (nghĩa của từ) – đọc chậm hơn")),
          thumbs, h("div", { style: "margin-top:12px" }, go), prog,
          h("div.row", { style: "justify-content:flex-end;margin-top:14px" }, h("button.btn.ghost", { onclick: finish }, "Đóng")));
      };
      const draw2 = () => {
        box.innerHTML = "";
        const ta = h("textarea", { style: "min-height:260px;font-family:var(--bfont);width:100%", spellcheck: "false", oninput: e => { st.text = e.target.value; upd(); } }, st.text);
        const info = h("div.small.muted");
        const upd = () => { const s = L.ocr.generate(st.text, { types: ["fill", "match", "sentence"] }).stats; info.textContent = "Nhận được " + s.sentences + " câu dùng được · " + s.pairs + " cặp \"từ - nghĩa\" · " + s.words + " từ/cụm từ rời."; };
        const chk = {}; const TY = [["fill", "✏️ Điền từ (bỏ từ trong câu)"], ["fillbank", "🧺 Điền từ có khung từ"], ["sentence", "🧱 Sắp xếp câu"], ["match", "🔗 Ghép từ – nghĩa"], ["mcq1", "🔘 Trắc nghiệm nghĩa của từ"], ["short", "💬 Viết từ tiếng Anh theo nghĩa"], ["meanpick", "🎯 Nhìn nghĩa chọn từ"], ["listen", "🔊 Nghe chọn từ"], ["scramble", "🔤 Xếp chữ cái"], ["memory", "🃏 Lật thẻ ghép cặp"], ["wordsearch", "🔎 Tìm từ trong bảng"]];
        const checks = h("div.stack", TY.map(([id, t]) => h("label.row", { style: "gap:8px;cursor:pointer" }, chk[id] = h("input", { type: "checkbox", style: "width:18px;height:18px", checked: id === "fill" || id === "match" || id === "sentence" }), t)));
        const bl = h("select", [1, 2, 3].map(n => h("option", { value: n }, n + " chỗ trống/câu")));
        const mx = h("select", [8, 12, 20, 30].map(n => h("option", { value: n, selected: n === 12 }, "tối đa " + n + " câu/phần")));
        const topic = h("input", { type: "text", placeholder: "Chủ điểm (dùng cho báo cáo), ví dụ: Unit 2 – animals" });
        const msg = h("div");
        box.append(h("h3", { style: "margin-top:0" }, "Bước 2 · Xem và sửa chữ đã đọc"),
          h("div.hint", "So với ảnh gốc, cô sửa chữ bị đọc sai. ", h("b", "Mẹo: "), "muốn bỏ trống từ nào thì tự bọc ", h("code", "[[từ]]"), " ngay ở đây (web sẽ dùng đúng từ cô chọn thay vì tự chọn). Dòng \"từ - nghĩa\" (ví dụ ", h("code", "dog - con chó"), ") dùng cho bài ghép cặp/trắc nghiệm."),
          h("div.two", { style: "align-items:start;margin-top:8px" },
            h("div", h("b", "Ảnh gốc"), h("div", { style: "max-height:300px;overflow:auto;margin-top:6px;border:1px solid #eee;border-radius:10px" }, st.urls.map(u => h("img", { src: u, style: "width:100%;display:block;transform:rotate(" + st.rot + "deg)" })))),
            h("div", h("b", "Chữ đọc được (sửa tại đây)"), ta, info)),
          h("h4", { style: "margin:14px 0 6px" }, "Bước 3 · Chọn dạng bài muốn tạo"), checks,
          h("div.row", { style: "margin-top:8px" }, bl, mx), h("label.field", { style: "margin-top:8px" }, h("span", "Chủ điểm"), topic), msg,
          h("div.row", { style: "justify-content:flex-end;margin-top:14px" },
            h("button.btn.ghost", { onclick: () => { st.text = ""; draw1(); } }, "← Chọn ảnh khác"), h("button.btn.ghost", { onclick: finish }, "Đóng"),
            h("button.btn.mint", { onclick: () => {
              const types = TY.map(x => x[0]).filter(id => chk[id].checked);
              if (!types.length) { msg.innerHTML = ""; msg.append(h("div.err", "Chọn ít nhất 1 dạng bài.")); return; }
              const r = L.ocr.generate(st.text, { types, blanks: +bl.value, max: +mx.value, topic: topic.value.trim() });
              if (!r.sections.length) { msg.innerHTML = ""; msg.append(h("div.err", r.notes.length ? r.notes.map(n => h("div", "• " + n)) : "Chưa tạo được phần nào.")); return; }
              if (r.notes.length && !(r.sections.length)) return;
              const doneFn = () => { finish(); onDone(r.sections); };
              if (r.notes.length) { msg.innerHTML = ""; msg.append(h("div.hint", r.notes.map(n => h("div", "• " + n)), h("div", "Các dạng còn lại vẫn được tạo."))); setTimeout(doneFn, 1200); } else doneFn();
            } }, "✨ Tạo bài (cô sẽ xem lại)")));
        upd();
      };
      draw1();
      return box;
    }, { wide: true, sticky: true });
  }

  function promptModal(typeId, topic) {
    modal(close => {
      const o = { n: 10, topic: topic || "", level: "", extra: "" };
      const out = h("div.codebox");
      const upd = () => { out.textContent = L.hw.aiPrompt(typeId, o); };
      const f = (label, key, type, ph) => h("label.field", h("span", label), h("input", { type, value: o[key], placeholder: ph || "", oninput: e => { o[key] = type === "number" ? (+e.target.value || 10) : e.target.value; upd(); } }));
      upd();
      return h("div", h("h3", { style: "margin-bottom:6px" }, "Prompt gửi AI khác"), h("p.small.muted", { style: "margin-top:0" }, "Copy prompt này gửi cho ChatGPT/Gemini/NotebookLM…, rồi dán kết quả vào ô nội dung bài tập. Prompt đã kèm quy tắc để AI trả đúng cú pháp."),
        h("div.two", f("Số câu", "n", "number"), f("Chủ điểm", "topic", "text", "Ví dụ: past simple")), h("div.two", { style: "margin-top:8px" }, f("Trình độ", "level", "text", "Ví dụ: Flyers / lớp 7"), f("Yêu cầu thêm", "extra", "text", "Ví dụ: có 3 câu khó")),
        h("div", { style: "margin:12px 0 6px" }, out),
        h("div.row", { style: "justify-content:flex-end" }, h("button.btn.ghost", { onclick: close }, "Đóng"), h("button.btn", { onclick: () => L.copyText(L.hw.aiPrompt(typeId, o)) }, "Sao chép prompt")));
    }, { wide: true });
  }

  /* ---------- Báo cáo học viên ---------- */
  async function tReport(body) {
    body.append(h("div.empty", h("span.spinner"), " Đang tải báo cáo…"));
    const raw = await L.api.call("report");
    let range = 0;                       // 0 = tất cả; số ngày
    const draw = () => {
      body.innerHTML = "";
      const cut = range ? Date.now() - range * 86400000 : 0;
      const inR = x => !cut || +new Date(x.time) >= cut;
      const rep = { plays: raw.plays.filter(inR), subs: raw.subs.filter(inR), answers: raw.answers.filter(inR) };
      const studs = L.api.aggregate(rep).filter(s => s.name !== CFG.teacherName);
      body.append(h("div.row", { style: "margin-bottom:12px" }, h("div.tabs", { style: "margin:0" }, [[0, "Tất cả"], [30, "30 ngày"], [7, "7 ngày"]].map(([d, t]) => h("button" + (range === d ? ".on" : ""), { onclick: () => { range = d; draw(); } }, t))), h("span.grow"), h("span.muted.small", studs.length + " học viên")));
      if (!studs.length) { body.append(h("div.card.empty", "Chưa có dữ liệu. Khi học viên chơi app hoặc nộp bài, kết quả sẽ hiện ở đây.")); return; }
      body.append(h("div.row", { style: "margin-bottom:10px" }, h("button.btn.peach", { onclick: () => parentReportModal(studs.map(x => x.name)) }, "📨 Báo cáo tuần cho phụ huynh (cả lớp)"), h("span.small.muted", "Tự tính từ dữ liệu 7 ngày gần nhất; cô đọc lại và thêm lời nhắn trước khi gửi.")));
      body.append(h("div.hint", { style: "margin-bottom:12px" }, "Chủ điểm \"cần ôn\" = đúng dưới 70% và đã gặp từ 3 ý trở lên. Chủ điểm lấy từ nhãn trong app hoặc dòng TOPIC: của bài tập."));
      studs.forEach(s => body.append(studentCard(s)));
    };
    draw();
  }


  /* ---------- Báo cáo tuần cho phụ huynh ---------- */
  const dmy = d => String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0");
  function weekStats(raw, name, from, to) {
    const inR = x => { const t = +new Date(x.time || x.updated); return t >= from && t < to; };
    const mine = x => L.sameName(x.name, name);
    const rep = { plays: raw.plays.filter(x => mine(x) && inR(x)), subs: raw.subs.filter(x => mine(x) && inR(x)), answers: raw.answers.filter(x => mine(x) && inR(x)) };
    const agg = L.api.aggregate(rep)[0] || null;
    const days = new Set([...rep.plays, ...rep.subs, ...rep.answers].map(x => { const d = new Date(x.time || x.updated); return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }));
    let right = 0, tot = 0; if (agg) agg.topicList.forEach(t => { right += t.right; tot += t.n; });
    return { agg, days: days.size, plays: rep.plays.length, subs: rep.subs.length, right, tot };
  }
  function parentReportText(raw, name, prof) {
    const now = Date.now(), cur = weekStats(raw, name, now - 7 * 86400000, now + 1), prev = weekStats(raw, name, now - 14 * 86400000, now - 7 * 86400000);
    const a = cur.agg, d1 = new Date(now - 6 * 86400000), d2 = new Date(now);
    const L1 = ["BÁO CÁO HỌC TẬP TUẦN · " + name, "Tuần " + dmy(d1) + " – " + dmy(d2) + "/" + d2.getFullYear() + " · " + CFG.siteName + " (cô " + CFG.teacherName.replace(/^Miss\s+/i, "") + ")", ""];
    if (!a || !cur.tot && !cur.plays && !cur.subs) {
      L1.push("Tuần này con chưa có dữ liệu luyện tập trên hệ thống.", "Mỗi ngày chỉ cần 10 phút (làm 1 bài luyện tập hoặc mục \"Ôn lại hôm nay\") là con sẽ nhớ bài tốt hơn rất nhiều. Phụ huynh nhắc con giúp cô nhé!");
      return L1.join("\n");
    }
    L1.push("1) Mức độ chăm chỉ", "- Số ngày con có học trong tuần: " + cur.days + "/7", "- Số lượt chơi app/game: " + cur.plays + " · Số bài tập đã nộp: " + cur.subs, "- Tổng số ý con đã làm: " + cur.tot + (prof && prof.streak ? " · Chuỗi ngày học liên tiếp hiện tại: " + prof.streak + " ngày" : ""), "");
    const acc = cur.tot ? Math.round(100 * cur.right / cur.tot) : null, pacc = prev.tot ? Math.round(100 * prev.right / prev.tot) : null;
    L1.push("2) Kết quả", acc == null ? "- Tuần này con chưa có câu trả lời chi tiết được ghi lại." : "- Tỉ lệ đúng: " + acc + "% (" + cur.right + "/" + cur.tot + " ý)" + (pacc == null ? "" : acc > pacc ? " — tăng so với tuần trước (" + pacc + "%) 🎉" : acc < pacc ? " — thấp hơn tuần trước (" + pacc + "%)" : " — bằng tuần trước"), "");
    const strong = a.topicList.filter(t => t.n >= 3 && t.acc >= 0.8).slice(-3).reverse(), weak = a.weak.slice(0, 3);
    L1.push("3) Điểm mạnh");
    if (strong.length) strong.forEach(t => L1.push("- " + t.topic + ": đúng " + Math.round(t.acc * 100) + "%")); else L1.push("- Con đang làm quen dần; cô sẽ tiếp tục theo dõi.");
    L1.push("", "4) Phần cần ôn thêm");
    if (weak.length) { weak.forEach(t => L1.push("- " + t.topic + ": đúng " + Math.round(t.acc * 100) + "% (" + t.right + "/" + t.n + " ý)")); const ex = a.wrongList.slice(0, 3); if (ex.length) { L1.push("  Một vài câu con hay nhầm:"); ex.forEach(w => L1.push("  • " + w.q)); } }
    else L1.push("- Tuần này con không có chủ điểm nào dưới 70%. Rất tốt!");
    L1.push("", "5) Gợi ý cho phụ huynh", weak.length ? "- Mỗi ngày dành 10 phút cho con vào mục \"Ôn lại hôm nay\" và luyện lại các phần trên; con sai câu nào thì câu đó sẽ tự quay lại đúng lúc để con nhớ lâu." : "- Phụ huynh khen con và khuyến khích con duy trì mỗi ngày một chút nhé.", cur.days < 3 ? "- Tuần này con học chưa đều (" + cur.days + "/7 ngày). Chia nhỏ 10 phút mỗi ngày hiệu quả hơn học dồn một buổi." : "- Con học khá đều, mong gia đình tiếp tục đồng hành cùng con.", "", "Lời nhắn của cô: ………………………………………………");
    return L1.join("\n");
  }
  async function parentReportModal(names) {
    let raw, profs = [];
    try { raw = await L.api.call("report"); } catch (e) { toast(e.message); return; }
    try { profs = (await L.api.call("profileList")).list || []; } catch (e) { }
    const text = names.map(n => parentReportText(raw, n, profs.find(p => L.sameName(p.name, n)))).join("\n\n" + "—".repeat(30) + "\n\n");
    modal(close => {
      const ta = h("textarea", { style: "min-height:380px;font-family:var(--bfont);font-size:15px;line-height:1.5", spellcheck: "false" }); ta.value = text;
      return h("div", h("h3", { style: "margin-bottom:6px" }, "📨 Báo cáo tuần cho phụ huynh"), h("div.small.muted", { style: "margin-bottom:8px" }, "Báo cáo tự tính từ dữ liệu 7 ngày gần nhất. Cô có thể sửa trực tiếp trong khung dưới rồi sao chép gửi Zalo/tin nhắn, hoặc in ra giấy."), ta,
        h("div.row", { style: "justify-content:flex-end;margin-top:12px" }, h("button.btn.ghost", { onclick: close }, "Đóng"),
          h("button.btn.sky", { onclick: () => { L.copyText(ta.value); } }, "📋 Sao chép"),
          h("button.btn", { onclick: () => { const box = h("div.printonly.paper", ta.value.split("\n").map(l => h("div", { style: "min-height:1.2em;white-space:pre-wrap" }, l))); document.body.appendChild(box); document.body.classList.add("printing-extra"); window.print(); setTimeout(() => { box.remove(); document.body.classList.remove("printing-extra"); }, 500); } }, "🖨️ In")));
    });
  }

  function pct(x) { return Math.round(x * 100); }
  function studentCard(s) {
    const tot = s.topicList.reduce((a, t) => a + t.n, 0), right = s.topicList.reduce((a, t) => a + t.right, 0);
    const detail = h("div.hidden");
    const head = h("div.row", { style: "cursor:pointer" }, h("div.grow", h("b", { style: "font-family:var(--hfont);font-size:20px" }, s.name), h("div.small.muted", "Lần cuối: " + fmtDate(s.lastTime) + " · " + s.plays + " lượt chơi app · " + s.subs + " bài nộp" + (tot ? " · đúng " + pct(right / tot) + "% (" + right + "/" + tot + " ý)" : ""))),
      s.weak.length ? h("span.pill.rose", s.weak.length + " chủ điểm cần ôn") : (tot ? h("span.pill.mint", "Ổn") : h("span.pill", "Chưa có dữ liệu")));
    const card = h("div.card", head, s.weak.length ? h("div.row", { style: "margin-top:8px;gap:6px" }, s.weak.slice(0, 5).map(t => h("span.pill.rose", t.topic + " · " + pct(t.acc) + "%"))) : null, detail);
    head.addEventListener("click", () => {
      if (!detail.classList.contains("hidden")) { detail.classList.add("hidden"); return; }
      detail.classList.remove("hidden"); detail.innerHTML = "";
      detail.append(h("h4", { style: "margin:14px 0 4px;font-size:18px" }, "Độ chính xác theo chủ điểm"),
        s.topicList.map(t => h("div.topic-row", h("div", { style: "font-weight:800" }, t.topic, h("div.small.muted", t.n + " ý" + (t.n >= 6 ? " · 6 ý gần nhất " + pct(t.recentAcc) + "%" : ""))), h("div.bar." + (t.n < 3 ? "" : t.acc < .6 ? "bad" : t.acc < .8 ? "" : "good"), h("i", { style: "width:" + pct(t.acc) + "%" })), h("b", pct(t.acc) + "%"))),
        s.wrongList.length ? [h("h4", { style: "margin:16px 0 4px;font-size:18px" }, "Câu/ý sai nhiều nhất"), h("div.scroll-x", h("table.tbl", h("thead", h("tr", ["Nội dung", "Chủ điểm", "Số lần sai"].map(x => h("th", x)))), h("tbody", s.wrongList.slice(0, 15).map(w => h("tr", h("td", w.q), h("td", h("span.pill", w.topic)), h("td", "× " + w.n))))))] : null,
        h("div.row", { style: "margin-top:12px" }, h("button.btn.sm.sky", { onclick: () => L.copyText(reportText(s)) }, "📋 Sao chép báo cáo"), h("button.btn.sm.peach", { onclick: () => parentReportModal([s.name]) }, "📨 Báo cáo tuần cho phụ huynh")));
    });
    return card;
  }
  function reportText(s) {
    const lines = ["BÁO CÁO: " + s.name, "Lần học gần nhất: " + fmtDate(s.lastTime), ""];
    lines.push(s.weak.length ? "Cần ôn lại:" : "Chưa có chủ điểm nào dưới 70%.");
    s.weak.forEach(t => lines.push("- " + t.topic + ": đúng " + pct(t.acc) + "% (" + t.right + "/" + t.n + " ý)"));
    lines.push("", "Chủ điểm khác:");
    s.topicList.filter(t => !s.weak.includes(t)).forEach(t => lines.push("- " + t.topic + ": " + pct(t.acc) + "% (" + t.n + " ý)"));
    if (s.wrongList.length) { lines.push("", "Hay sai:"); s.wrongList.slice(0, 8).forEach(w => lines.push("- " + w.q + " (" + w.topic + ", sai " + w.n + " lần)")); }
    return lines.join("\n");
  }

  /* ---------- Cài đặt ---------- */
  async function tSettings(body) {
    const c = gh.cfg();
    const f = { owner: c.owner, repo: c.repo, branch: c.branch, token: c.token };
    const out = h("div");
    const row = (label, key, type, ph) => h("label.field", h("span", label), h("input", { type, value: f[key], placeholder: ph || "", autocomplete: "off", oninput: e => f[key] = e.target.value.trim() }));
    body.append(
      h("div.card", h("h3", { style: "margin-bottom:6px" }, "Kết nối GitHub (để đăng app lên web)"),
        h("p.small.muted", { style: "margin-top:0" }, "Token chỉ lưu trong trình duyệt của cô trên máy này, không gửi đi đâu ngoài GitHub. Nên tạo token riêng (fine-grained) chỉ cho đúng kho website này, quyền Contents: Read and write. Xem HUONG-DAN.md bước 5."),
        h("div.two", row("Tài khoản GitHub (owner)", "owner", "text", "ten-github-cua-co"), row("Tên kho (repository)", "repo", "text", "little-sprout-english")),
        h("div.two", { style: "margin-top:8px" }, row("Nhánh", "branch", "text", "main"), row("Token", "token", "password", "github_pat_…")),
        h("div.row", { style: "margin-top:12px" }, h("button.btn", { onclick: async () => {
          gh.save(f); out.innerHTML = "";
          try { const r = await gh.test(); out.append(h("div.ok-box", "Kết nối được kho " + r.full_name + " ✓")); L.state.manifest = null; await L.loadManifest(true); } catch (e) { out.append(h("div.err", e.message)); }
        } }, "Lưu & kiểm tra"), h("button.btn.ghost", { onclick: () => { localStorage.removeItem(GK); toast("Đã xoá token khỏi trình duyệt này"); L.route(); } }, "Xoá token")), out),
      h("div.card", h("h3", { style: "margin-bottom:6px" }, "Kết nối Google Sheets (lịch sử & bài tập)"),
        L.api.isDemo() ? h("div.hint", "Đang ở chế độ DEMO. Dán địa chỉ Web App của Apps Script vào file js/config.js (dòng apiUrl) rồi đưa file lên GitHub. Xem HUONG-DAN.md bước 3 và 4.") : h("div.ok-box", "Đã cấu hình: " + CFG.apiUrl.slice(0, 60) + "…"),
        L.api.isDemo() ? h("div.row", { style: "margin-top:10px" }, h("button.btn.sm.rose", { onclick: async () => { if (await L.confirmBox("Xoá toàn bộ dữ liệu DEMO (bài tập, lịch sử) trong trình duyệt này?", "Xoá")) { localStorage.removeItem("lse_demo_v1"); localStorage.removeItem(MK); L.state.hwList = L.state.manifest = null; toast("Đã xoá"); L.route(); } } }, "Xoá dữ liệu demo")) : null),
      h("div.card", h("h3", { style: "margin-bottom:6px" }, "Sao lưu"), h("p.small.muted", { style: "margin-top:0" }, "Tải bản sao danh mục (giáo trình, unit, app) về máy."),
        h("button.btn.sm.ghost", { onclick: () => { const a = h("a", { href: URL.createObjectURL(new Blob([JSON.stringify(L.state.manifest, null, 2)], { type: "application/json" })), download: "manifest-" + new Date().toISOString().slice(0, 10) + ".json" }); document.body.appendChild(a); a.click(); a.remove(); } }, "⬇️ Tải manifest.json")));
  }
})(window.LSE);
