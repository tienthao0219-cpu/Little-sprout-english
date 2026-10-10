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
  const TABS = [["home", "🌿 Tổng quan"], ["upload", "⬆️ Đăng app"], ["content", "🗂️ Giáo trình & unit"], ["hw", "📝 Bài tập"], ["report", "📊 Báo cáo học viên"], ["settings", "⚙️ Cài đặt"]];
  async function teacherView(tab, rest) {
    L.show(h("div.center.muted", h("span.spinner")));
    await L.loadManifest();
    const body = h("div");
    const tabs = h("div.tabs", TABS.map(([id, t]) => h("button" + (tab === id || (tab === "hw-edit" && id === "hw") ? ".on" : ""), { onclick: () => L.go("/teacher/" + id) }, t)));
    L.show(h("h1", { style: "font-size:30px;margin-bottom:12px" }, "Khu của cô " + CFG.teacherName), tabs, body);
    const fn = { home: tHome, upload: tUpload, content: tContent, hw: tHwList, "hw-edit": tHwEdit, report: tReport, settings: tSettings }[tab];
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
    const draw = () => {
      body.innerHTML = "";
      const m = L.state.manifest, c = L.cur(sel);
      const save = async (fn, msg) => { try { await editManifest(fn, msg); toast("Đã lưu ✓"); } catch (e) { toast(e.message, 5000); } draw(); };
      body.append(h("div.card", h("div.row", h("h3", "Giáo trình"), h("span.grow"),
        h("button.btn.sm.ghost", { onclick: () => modal(close => { const n = h("input", { type: "text", placeholder: "Tên giáo trình mới" }), e = h("input", { type: "text", value: "📚", style: "width:70px" }); return h("div", h("h3", { style: "margin-bottom:10px" }, "Thêm giáo trình"), h("label.field", h("span", "Tên"), n), h("label.field", { style: "margin-top:8px" }, h("span", "Biểu tượng (emoji)"), e), h("div.row", { style: "justify-content:flex-end;margin-top:14px" }, h("button.btn.ghost", { onclick: close }, "Huỷ"), h("button.btn", { onclick: () => { if (!n.value.trim()) return; close(); sel = slug(n.value) + "-" + uid("").slice(-3); save(mm => mm.curricula.push({ id: sel, name: n.value.trim(), emoji: e.value || "📚", tint: mm.curricula.length % 8, units: [] }), "Thêm giáo trình " + n.value); } }, "Thêm"))); }) }, "+ Thêm giáo trình")),
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
          h("button.btn.sm.rose", { onclick: async () => { if (await L.confirmBox("Gỡ \"" + a.title + "\" khỏi danh mục? (File vẫn còn trong kho GitHub, lịch sử chơi không bị xoá.)", "Gỡ")) save(mm => { mm.apps = mm.apps.filter(z => z.id !== a.id); }, "Gỡ app " + a.title); } }, "Gỡ")));
      });
      if (!apps.length) appCard.append(h("div.empty", "Chưa có app nào.", h("div", h("a.btn.sm", { style: "margin-top:8px", href: "#/teacher/upload" }, "⬆️ Đăng app"))));
      body.append(appCard);
      if (!gh.configured()) body.append(h("div.hint", { style: "margin-top:14px" }, "Chưa kết nối GitHub nên thay đổi này chỉ lưu trên máy này (để cô thử giao diện). Muốn học viên thấy, hãy nhập token GitHub ở tab Cài đặt."));
    };
    draw();
  }

  /* ---------- Bài tập: danh sách ---------- */
  async function tHwList(body) {
    const list = await L.loadHw(true);
    const m = L.state.manifest;
    const draw = () => {
      body.innerHTML = "";
      body.append(h("div.card", h("div.row", h("h3", "Bài tập đã tạo"), h("span.grow"), h("a.btn", { href: "#/teacher/hw-edit/new" }, "+ Tạo bài tập mới")),
        list.length ? list.map(x => {
          const c = L.cur(x.curId);
          return h("div.item", { style: "flex-wrap:wrap" }, h("div.ic.tint3", "📝"),
            h("div.grow", h("b", x.title), h("div.small.muted", (c ? c.name + (x.unitId ? " · " + L.unitName(c, x.unitId) : "") + " · " : "") + (x.nItems || 0) + " ý · " + (x.nSections || 0) + " phần"), h("span.pill." + (x.open ? "mint" : "rose"), x.open ? "Đang mở" : "Đã đóng")),
            h("button.btn.sm.ghost", { onclick: async () => { try { await L.api.call("hwSetOpen", { id: x.id, open: !x.open }); x.open = !x.open; L.state.hwList = null; draw(); } catch (e) { toast(e.message); } } }, x.open ? "Đóng" : "Mở"),
            h("a.btn.sm", { href: "#/teacher/hw-edit/" + x.id }, "Sửa"),
            h("a.btn.sm.ghost", { href: "#/hw/" + x.id }, "Xem thử"),
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
  const defMeta = { timeLimit: 0, start: "", end: "", maxAttempts: 0, scoreRule: "highest", scale: 10, showAfter: "full" };
  const toLocalInput = iso => { if (!iso) return ""; const d = new Date(iso); if (isNaN(d)) return ""; const p = n => String(n).padStart(2, "0"); return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + "T" + p(d.getHours()) + ":" + p(d.getMinutes()); };
  const newSection = () => ({ id: "s" + uid("").slice(-5), title: "", type: "mcq1", desc: "", media: { img: "", audio: "", yt: "" }, raw: "", topic: "", shuffleQ: false, tfLabels: "en" });

  async function tHwEdit(body, rest) {
    const id = rest[0] || "new";
    let hw;
    if (id === "new") hw = { id: "hw" + uid("").slice(-6), title: "", desc: "", curId: (L.state.manifest.curricula[0] || {}).id || "", unitId: "", open: true, sections: [newSection()], meta: Object.assign({}, defMeta) };
    else hw = (await L.api.call("hwGet", { id })).hw;
    hw.meta = Object.assign({}, defMeta, hw.meta || {});
    const m = L.state.manifest;
    let dirty = false; const markDirty = () => { dirty = true; };
    const secsBox = h("div"), unitBox = h("div");

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
      const fillRule = () => {
        rule.innerHTML = ""; rule.append(h("b", "Cú pháp: "), T().rule);
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
        tfSel, rule,
        h("label.field", { style: "margin-top:10px" }, h("span", "Nội dung chung của phần (đoạn văn, đề bài chung… không bắt buộc)"), h("textarea", { style: "min-height:80px;font-family:var(--bfont)", oninput: e => { sec.desc = e.target.value; markDirty(); } }, sec.desc || "")),
        h("details.fold", h("summary", "Thêm hình, âm thanh, YouTube"), h("div.stack", { style: "margin-top:8px" }, mediaField("img", "Hình (đường dẫn hoặc link)", "https://… hoặc assets/media/…", "image/*"), mediaField("audio", "Âm thanh MP3", "https://… hoặc assets/media/…", "audio/*"), mediaField("yt", "Video YouTube", "https://youtu.be/…", ""))),
        h("label.row", { style: "margin-top:10px;gap:8px;cursor:pointer" }, h("input", { type: "checkbox", style: "width:20px;height:20px", checked: !!sec.shuffleQ, onchange: e => { sec.shuffleQ = e.target.checked; markDirty(); } }), "Xáo thứ tự câu hỏi mỗi lần làm"),
        h("div.row", { style: "margin:12px 0 6px" }, h("b", "Nội dung bài tập (cú pháp)"), h("span.grow"),
          h("button.btn.sm.ghost", { onclick: () => { ta.value = sec.raw = T().sample; markDirty(); check(); } }, "Dùng mẫu"),
          h("button.btn.sm.sky", { onclick: () => promptModal(sec.type, sec.topic) }, "🤖 Prompt cho AI")),
        ta, status, prev);
      fillRule(); check();
      return box;
    }

    const addBtn = h("button.btn.ghost", { style: "margin-top:14px", onclick: () => { hw.sections.push(newSection()); markDirty(); drawSecs(); } }, "+ Thêm phần (có thể chọn dạng bài khác)");
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
      body.append(h("div.hint", { style: "margin-bottom:12px" }, "Chủ điểm \"cần ôn\" = đúng dưới 70% và đã gặp từ 3 ý trở lên. Chủ điểm lấy từ nhãn trong app hoặc dòng TOPIC: của bài tập."));
      studs.forEach(s => body.append(studentCard(s)));
    };
    draw();
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
        h("div.row", { style: "margin-top:12px" }, h("button.btn.sm.sky", { onclick: () => L.copyText(reportText(s)) }, "📋 Sao chép báo cáo")));
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
