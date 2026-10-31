/* Kết nối dữ liệu: Google Apps Script (thật) hoặc bộ nhớ trình duyệt (demo) */
(function (L) {
  const CFG = window.LSE_CONFIG;
  const AUTH_KEY = "lse_auth_v1";

  /* ---------- đăng nhập ---------- */
  const auth = { name: "", pw: "", role: "" };
  try { Object.assign(auth, JSON.parse(localStorage.getItem(AUTH_KEY) || "{}")); } catch (e) { }
  function saveAuth() { try { localStorage.setItem(AUTH_KEY, JSON.stringify(auth)); } catch (e) { } }
  function logout() { auth.name = auth.pw = auth.role = ""; saveAuth(); }

  const isDemo = () => !CFG.apiUrl;

  /* ---------- gọi API ---------- */
  async function call(action, payload) {
    const body = Object.assign({ action, name: auth.name, pw: auth.pw }, payload || {});
    if (isDemo()) return demo(body);
    let r;
    try {
      r = await fetch(CFG.apiUrl, { method: "POST", body: JSON.stringify(body), redirect: "follow" });
    } catch (e) { throw new Error("Không kết nối được máy chủ. Kiểm tra mạng hoặc địa chỉ Apps Script."); }
    let data;
    try { data = await r.json(); } catch (e) { throw new Error("Máy chủ trả về dữ liệu lạ. Kiểm tra lại cách triển khai Apps Script (Anyone có quyền truy cập)."); }
    if (!data.ok) throw new Error(data.error || "Có lỗi xảy ra");
    return data;
  }
  /** gửi nền khi rời trang (không chờ kết quả) */
  function beacon(action, payload) {
    const body = Object.assign({ action, name: auth.name, pw: auth.pw }, payload || {});
    if (isDemo()) { demo(body); return true; }
    try { return navigator.sendBeacon(CFG.apiUrl, new Blob([JSON.stringify(body)], { type: "text/plain;charset=UTF-8" })); } catch (e) { return false; }
  }

  /* ---------- gộp hồ sơ (bản sao của hàm trong Code.gs, để chế độ DEMO chạy giống thật) ---------- */
  const MAX_COIN_DELTA = 400;   // mỗi lần đồng bộ, số xu tăng thêm tối đa (chặn gian lận kiểu sửa số xu bằng F12)
  function parseObj_(s){ try{ const o=JSON.parse(s||'{}'); return o&&typeof o==='object'&&!Array.isArray(o)?o:{}; }catch(e){return {};} }
  function unionArr_(a, b, max) {
    const out = [];
    (Array.isArray(a) ? a : []).concat(Array.isArray(b) ? b : []).forEach(function (x) { x = String(x).slice(0, 40); if (out.indexOf(x) < 0 && out.length < (max || 80)) out.push(x); });
    return out;
  }
  /** gộp hồ sơ từ máy học sinh (c) vào hồ sơ trên máy chủ (s). bc/be = số xu / tổng xu đã kiếm lúc đồng bộ gần nhất */
  function profileMerge_(s, c, bc, be) {
    const num = function (v, d) { v = +v; return isFinite(v) ? v : d; };
    const out = {};
    const hasS = s && Object.keys(s).length > 0;
    let dc = hasS ? num(c.coins, 0) - num(bc, 0) : num(c.coins, 0);
    let de = hasS ? num(c.earned, 0) - num(be, 0) : num(c.earned, 0);
    if (dc > MAX_COIN_DELTA) { de = Math.min(de, MAX_COIN_DELTA); dc = MAX_COIN_DELTA; }
    if (de > MAX_COIN_DELTA) de = MAX_COIN_DELTA;
    out.coins = Math.max(0, Math.min(1000000, Math.round((hasS ? num(s.coins, 0) : 0) + dc)));
    out.earned = Math.max(0, Math.round((hasS ? num(s.earned, 0) : 0) + de));
    out.owned = unionArr_(s && s.owned, c.owned);
    out.ownedPets = unionArr_(s && s.ownedPets, c.ownedPets);
    out.ownedThemes = unionArr_(s && s.ownedThemes, c.ownedThemes);
    out.avatar = String(c.avatar != null ? c.avatar : (s && s.avatar) || '').slice(0, 40);
    out.theme = String(c.theme != null ? c.theme : (s && s.theme) || '').slice(0, 40);
    // thú nuôi: lấy bản mới hơn, điểm kinh nghiệm lấy số lớn hơn
    const sp = (s && s.pet) || {}, cp = c.pet || {};
    const pick = num(cp.last, 0) >= num(sp.last, 0) ? cp : sp;
    out.pet = { kind: String(pick.kind || cp.kind || sp.kind || '').slice(0, 30), name: String(pick.name || '').slice(0, 24), xp: Math.max(num(sp.xp, 0), num(cp.xp, 0)), cute: Math.max(0, Math.min(100, num(pick.cute, 40))), last: Math.max(num(sp.last, 0), num(cp.last, 0)), fed: Math.max(num(sp.fed, 0), num(cp.fed, 0)) };
    // nhiệm vụ ngày
    const sq = (s && s.quest) || {}, cq = c.quest || {};
    if (String(cq.day || '') > String(sq.day || '')) out.quest = cq;
    else if (String(cq.day || '') < String(sq.day || '')) out.quest = sq;
    else {
      const p = {}; [sq.p, cq.p].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { p[k] = Math.max(num(p[k], 0), num((o || {})[k], 0)); }); });
      out.quest = { day: cq.day || sq.day || '', p: p, done: unionArr_(sq.done, cq.done), bonus: !!(sq.bonus || cq.bonus) };
    }
    // chuỗi ngày
    const ss = (s && s.streak) || {}, cs = c.streak || {};
    const pickS = String(cs.last || '') > String(ss.last || '') ? cs : String(cs.last || '') < String(ss.last || '') ? ss : { last: cs.last || ss.last || '', n: Math.max(num(cs.n, 0), num(ss.n, 0)) };
    out.streak = { last: String(pickS.last || ''), n: num(pickS.n, 0), best: Math.max(num(ss.best, 0), num(cs.best, 0), num(pickS.n, 0)) };
    // ngân hàng câu sai (ôn lặp lại): gộp theo khoá, giữ bản cập nhật sau cùng
    const wb = {};
    [s && s.wb, c.wb].forEach(function (o) { Object.keys(o || {}).forEach(function (k) { const it = o[k]; if (!it || typeof it !== 'object') return; if (!wb[k] || num(it.t, 0) >= num(wb[k].t, 0)) wb[k] = it; }); });
    const wk = Object.keys(wb).filter(function (k) { return !(wb[k].m && num(wb[k].t, 0) < Date.now() - 30 * 86400000); });
    wk.sort(function (a, b2) { return num(wb[b2].t, 0) - num(wb[a].t, 0); });
    out.wb = {}; wk.slice(0, 300).forEach(function (k) { out.wb[k] = wb[k]; });
    // thống kê & bản đồ: lấy số lớn hơn
    const st = {}; [(s && s.st) || {}, c.st || {}].forEach(function (o) { Object.keys(o).forEach(function (k) { st[k] = Math.max(num(st[k], 0), num(o[k], 0)); }); }); out.st = st;
    const mp = {}; [(s && s.map) || {}, c.map || {}].forEach(function (o) { Object.keys(o).forEach(function (k) { if (Object.keys(mp).length < 300 || mp[k] != null) mp[k] = Math.max(num(mp[k], 0), num(o[k], 0)); }); }); out.map = mp;
    out.spk = L.spkMerge(s && s.spk, c.spk);   // Speaking Starters: sao + sticker
    out.fly = L.spkMerge(s && s.fly, c.fly);   // Speaking Flyers: sao + sticker
    return out;
  }
  /** gộp tiến trình Speaking Starters: sao lấy số lớn hơn, sticker lấy hợp (bản sao của spkMerge_ trong Code.gs) */
  L.spkMerge = function (a, b) {
    const stars = {}, stk = [];
    [a, b].forEach(function (o) {
      const m = (o && o.stars && typeof o.stars === 'object') ? o.stars : {};
      Object.keys(m).slice(0, 200).forEach(function (k) {
        const v = m[k] || {}, key = String(k).slice(0, 40), cur = stars[key] || { n: 0, t: 0 };
        stars[key] = { n: Math.max(cur.n, Number(v.n) || 0), t: Math.max(cur.t, Number(v.t) || 0) };
      });
      (o && Array.isArray(o.stk) ? o.stk : []).forEach(function (x) { const n = Number(x); if (isFinite(n) && n >= 0 && n < 100 && stk.indexOf(n) < 0) stk.push(n); });
    });
    stk.sort(function (x, y) { return x - y; });
    return { stars: stars, stk: stk };
  };
  
  /* ---------- bộ nhớ DEMO (cùng giao thức với Apps Script) ---------- */
  const DK = "lse_demo_v1";
  const blank = () => ({ plays: [], answers: [], hws: {}, subs: [], students: [], appAssign: {}, profiles: {} });
  const load = () => { try { return Object.assign(blank(), JSON.parse(localStorage.getItem(DK) || "{}")); } catch (e) { return blank(); } };
  const store = d => { try { localStorage.setItem(DK, JSON.stringify(d)); } catch (e) { throw new Error("Bộ nhớ trình duyệt đầy"); } };
  const now = () => new Date().toISOString();
  const key = s => String(s == null ? "" : s).normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();

  /** giống máy chủ: có học viên trong danh sách = mỗi em một mật khẩu riêng; chưa có = mật khẩu lớp chung */
  function authOf(b, d) {
    const pw = String(b.pw || "").trim(); if (!pw) return null;
    const nm = String(b.name || "").trim();
    if (pw === CFG.demoTeacherPassword) return { role: "teacher", name: nm || CFG.teacherName };
    const act = d.students.filter(s => s.active !== false);
    if (act.length) { const s = act.find(x => L.sameName(x.name, nm) && key(x.code) === key(pw)); return s ? { role: "student", name: s.name } : null; }
    if (pw === CFG.demoStudentPassword) return { role: "student", name: nm };
    return null;
  }
  const allowed = (assigned, name, teacher) => teacher || !assigned || !assigned.length || assigned.some(n => L.sameName(n, name));
  function pubMeta(hw, d, name, teacher) {
    const mine = d.subs.filter(s => s.hwId === hw.id && s.name === name);
    const best = mine.length ? Math.max(...mine.map(s => s.scaled)) : null;
    const meta = Object.assign({}, hw.meta);
    if (!teacher) delete meta.assignedTo;
    return Object.assign({}, meta, { id: hw.id, title: hw.title, curId: hw.curId, unitId: hw.unitId, open: hw.open, created: hw.created, myAttempts: mine.length, myBest: best });
  }
  async function demo(b) {
    const d = load();
    const a = authOf(b, d);
    const rosterOn = d.students.some(s => s.active !== false);
    if (b.action === "login") {
      if (!a) return Promise.reject(new Error(rosterOn ? "Tên hoặc mật khẩu chưa đúng. Em kiểm tra lại nhé." : "Sai mật khẩu"));
      if (a.role === "student" && !a.name) return Promise.reject(new Error("Nhập tên của em nhé"));
      return { ok: true, role: a.role, name: a.name, roster: rosterOn };
    }
    if (!a) return Promise.reject(new Error("Sai mật khẩu hoặc phiên đã hết hạn"));
    const teacher = a.role === "teacher", name = a.name;
    const needT = () => { if (!teacher) throw new Error("Chỉ dành cho cô giáo"); };
    switch (b.action) {
      case "logPlay": {
        const p = b.play; let row = p.sid && d.plays.find(x => x.sid === p.sid && x.name === name);
        if (row) Object.assign(row, { score: p.score, max: p.max, durationSec: p.durationSec, updated: now() });
        else { const attempt = d.plays.filter(x => x.name === name && x.appId === p.appId).length + 1; row = Object.assign({ time: now(), name, attempt }, p); d.plays.push(row); }
        (b.answers || []).forEach(x => d.answers.push(Object.assign({ time: now(), name, source: "app", sourceId: p.appId, attempt: row.attempt }, x)));
        store(d); return { ok: true, attempt: row.attempt };
      }
      case "myPlays": return { ok: true, plays: d.plays.filter(x => x.name === name).slice(-200).reverse(), subs: d.subs.filter(x => x.name === name).slice(-200).reverse() };
      case "report": needT(); return { ok: true, plays: d.plays, subs: d.subs, answers: d.answers.slice(-8000).map(a => { const r = Object.assign({}, a); delete r.sec; delete r.no; delete r.ans; delete r.key; return r; }) };
      /* chi tiết từng câu của MỘT bài nộp: phần, câu, em chọn gì, đáp án đúng (khớp với apps-script hwDetail) */
      case "hwDetail": needT(); return { ok: true, answers: d.answers.filter(a => a.source === "hw" && a.sourceId === b.id && L.sameName(a.name, b.student) && String(a.attempt) === String(b.attempt)) };
      case "studentList": needT(); return { ok: true, roster: rosterOn, list: d.students.map(s => ({ name: s.name, code: s.code, active: s.active !== false, note: s.note || "" })) };
      case "studentSave": {
        needT(); const items = b.list || [];
        if (!items.length) throw new Error("Chưa có học viên nào để lưu");
        const seen = {};
        items.forEach(it => {
          const nm = String(it.name || "").trim().replace(/\s+/g, " "), code = String(it.code || "").trim();
          if (!nm || nm.length > 60) throw new Error("Tên học viên không được để trống (tối đa 60 ký tự)");
          if (!/^[A-Za-z0-9][A-Za-z0-9_-]{3,29}$/.test(code)) throw new Error('Mật khẩu của "' + nm + '" cần 4-30 ký tự, chỉ gồm chữ không dấu, số, gạch nối hoặc gạch dưới');
          if (code === CFG.demoTeacherPassword) throw new Error('Mật khẩu của "' + nm + '" trùng mật khẩu của cô, hãy đặt khác');
          if (seen[L.plain(nm)]) throw new Error('Tên "' + nm + '" bị trùng trong danh sách. Hãy thêm chữ phân biệt (ví dụ "An A", "An B")');
          seen[L.plain(nm)] = true; it._nm = nm; it._code = code;
        });
        items.forEach((it, idx) => {
          const target = idx === 0 && b.oldName ? b.oldName : it._nm;
          let i = d.students.findIndex(s => L.sameName(s.name, target));
          if (i < 0 && idx === 0 && b.oldName) i = d.students.findIndex(s => L.sameName(s.name, it._nm));
          if (idx === 0 && b.oldName && d.students.some(s => L.sameName(s.name, it._nm) && !L.sameName(s.name, b.oldName))) throw new Error('Đã có học viên tên "' + it._nm + '"');
          const row = { name: it._nm, code: it._code, active: it.active === undefined ? true : !!it.active, created: i >= 0 ? d.students[i].created : now(), note: String(it.note || "").slice(0, 200) };
          if (i >= 0) d.students[i] = row; else d.students.push(row);
        });
        store(d); return { ok: true, count: items.length };
      }
      case "studentDelete": needT(); d.students = d.students.filter(s => !L.sameName(s.name, b.name)); store(d); return { ok: true };
      case "profileGet": { const k = L.plain(name); return { ok: true, profile: (d.profiles && d.profiles[k]) || null }; }
      case "profileSave": {
        const k = L.plain(name); if (!k) throw new Error("Thiếu tên học viên");
        if (!b.profile || typeof b.profile !== "object") throw new Error("Hồ sơ không hợp lệ");
        d.profiles = d.profiles || {};
        const merged = profileMerge_(d.profiles[k] || null, b.profile, b.bc, b.be);
        d.profiles[k] = merged; store(d); return { ok: true, profile: merged };
      }
      case "profileList": needT(); return { ok: true, list: Object.keys(d.profiles || {}).map(k => { const p = d.profiles[k], pet = p.pet || {}, st = p.streak || {}; return { name: k, coins: p.coins || 0, earned: p.earned || 0, pet: pet.kind || "", petXp: pet.xp || 0, streak: st.n || 0, lastDay: st.last || "" }; }) };
      case "appAccess": {
        if (teacher) return { ok: true, hidden: [] };
        return { ok: true, hidden: Object.keys(d.appAssign).filter(id => d.appAssign[id].length && !d.appAssign[id].some(n => L.sameName(n, name))) };
      }
      case "appAssignList": needT(); return { ok: true, list: Object.keys(d.appAssign).map(id => ({ appId: id, names: d.appAssign[id] })) };
      case "appAssignSave": {
        needT(); const names = (b.names || []).map(String).filter(Boolean);
        if (names.length) d.appAssign[b.appId] = names; else delete d.appAssign[b.appId];
        store(d); return { ok: true };
      }
      case "hwSave": {
        needT(); const hw = b.hw; hw.updated = now(); hw.created = hw.created || hw.updated; d.hws[hw.id] = hw; store(d); return { ok: true, id: hw.id };
      }
      case "hwList": {
        const list = Object.values(d.hws).filter(x => (teacher || x.open) && allowed((x.meta || {}).assignedTo, name, teacher)).map(x => pubMeta(x, d, name, teacher));
        return { ok: true, list: list.sort((p, c) => String(c.created).localeCompare(String(p.created))) };
      }
      case "hwGet": {
        const hw0 = d.hws[b.id]; if (!hw0 || (!teacher && !hw0.open)) throw new Error("Không tìm thấy bài tập");
        if (!allowed((hw0.meta || {}).assignedTo, name, teacher)) throw new Error("Bài tập này không được giao cho em");
        const hw = JSON.parse(JSON.stringify(hw0)); if (!teacher && hw.meta) delete hw.meta.assignedTo;
        return { ok: true, hw };
      }
      case "hwSubmit": {
        const hw = d.hws[b.id]; if (!hw || (!teacher && !hw.open)) throw new Error("Bài tập đang đóng");
        if (!allowed((hw.meta || {}).assignedTo, name, teacher)) throw new Error("Bài tập này không được giao cho em");
        const mine = d.subs.filter(s => s.hwId === hw.id && s.name === name);
        const m = hw.meta || {};
        if (m.maxAttempts && mine.length >= m.maxAttempts && !teacher) throw new Error("Em đã hết lượt làm bài này");
        const attempt = mine.length + 1;
        const scaled = b.max ? L.round2(b.score / b.max * (m.scale || 10)) : 0;
        d.subs.push({ time: now(), name, hwId: hw.id, hwTitle: hw.title, attempt, score: b.score, max: b.max, scaled, durationSec: b.durationSec || 0 });
        (b.items || []).forEach(x => d.answers.push(Object.assign({ time: now(), name, source: "hw", sourceId: hw.id, attempt }, x)));
        store(d); return { ok: true, attempt, scaled };
      }
      case "hwMine": return { ok: true, subs: d.subs.filter(s => s.hwId === b.id && s.name === name) };
      case "hwResults": needT(); return { ok: true, subs: d.subs.filter(s => s.hwId === b.id) };
      case "hwDelete": needT(); delete d.hws[b.id]; store(d); return { ok: true };
      case "hwSetOpen": needT(); if (d.hws[b.id]) { d.hws[b.id].open = !!b.open; store(d); } return { ok: true };
    }
    throw new Error("Hành động không hợp lệ: " + b.action);
  }

  /* ---------- tổng hợp báo cáo (dùng chung cho demo & thật) ---------- */
  function aggregate(rep) {
    const students = {};
    const S = n => students[n] || (students[n] = { name: n, plays: 0, subs: 0, lastTime: "", topics: {}, wrong: {}, recent: [] });
    (rep.plays || []).forEach(p => { const s = S(p.name); s.plays++; if (String(p.time) > s.lastTime) s.lastTime = String(p.time); });
    (rep.subs || []).forEach(p => { const s = S(p.name); s.subs++; if (String(p.time) > s.lastTime) s.lastTime = String(p.time); });
    (rep.answers || []).forEach(a => {
      const s = S(a.name); const tp = String(a.topic || "Chưa gắn chủ điểm");
      const t = s.topics[tp] || (s.topics[tp] = { topic: tp, right: 0, wrong: 0, hist: [] });
      const ok = a.ok === true || a.ok === "TRUE" || a.ok === 1 || a.ok === "1";
      ok ? t.right++ : t.wrong++;
      t.hist.push(ok ? 1 : 0);
      if (!ok) {
        const k = tp + "||" + (a.q || a.qid);
        const w = s.wrong[k] || (s.wrong[k] = { topic: tp, q: a.q || a.qid, n: 0, src: a.source, srcId: a.sourceId, last: "" });
        w.n++; if (String(a.time) > w.last) w.last = String(a.time);
      }
    });
    Object.values(students).forEach(s => {
      s.topicList = Object.values(s.topics).map(t => {
        const n = t.right + t.wrong, last = t.hist.slice(-6), recent = last.length ? last.reduce((x, y) => x + y, 0) / last.length : 0;
        return Object.assign(t, { n, acc: n ? t.right / n : 0, recentAcc: recent });
      }).sort((a, b) => a.acc - b.acc || b.n - a.n);
      s.weak = s.topicList.filter(t => t.n >= 3 && t.acc < 0.7);
      s.wrongList = Object.values(s.wrong).sort((a, b) => b.n - a.n || String(b.last).localeCompare(String(a.last)));
    });
    return Object.values(students).sort((a, b) => String(b.lastTime).localeCompare(String(a.lastTime)));
  }

  L.auth = auth;
  L.api = { call, beacon, isDemo, saveAuth, logout, aggregate };
})(window.LSE);
