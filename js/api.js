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

  /* ---------- bộ nhớ DEMO (cùng giao thức với Apps Script) ---------- */
  const DK = "lse_demo_v1";
  const load = () => { try { return Object.assign({ plays: [], answers: [], hws: {}, subs: [] }, JSON.parse(localStorage.getItem(DK) || "{}")); } catch (e) { return { plays: [], answers: [], hws: {}, subs: [] }; } };
  const store = d => { try { localStorage.setItem(DK, JSON.stringify(d)); } catch (e) { throw new Error("Bộ nhớ trình duyệt đầy"); } };
  const now = () => new Date().toISOString();

  function roleOf(b) {
    if (b.pw === CFG.demoTeacherPassword) return "teacher";
    if (b.pw === CFG.demoStudentPassword) return "student";
    return "";
  }
  function pubMeta(hw, d, name) {
    const mine = d.subs.filter(s => s.hwId === hw.id && s.name === name);
    const best = mine.length ? Math.max(...mine.map(s => s.scaled)) : null;
    return Object.assign({}, hw.meta, { id: hw.id, title: hw.title, curId: hw.curId, unitId: hw.unitId, open: hw.open, created: hw.created, myAttempts: mine.length, myBest: best });
  }
  async function demo(b) {
    const role = roleOf(b);
    const d = load();
    if (b.action === "login") {
      if (!role) return Promise.reject(new Error("Sai mật khẩu"));
      if (role === "student" && !String(b.name || "").trim()) return Promise.reject(new Error("Nhập tên của em nhé"));
      return { ok: true, role };
    }
    if (!role) return Promise.reject(new Error("Sai mật khẩu hoặc phiên đã hết hạn"));
    const teacher = role === "teacher";
    const needT = () => { if (!teacher) throw new Error("Chỉ dành cho cô giáo"); };
    switch (b.action) {
      case "logPlay": {
        const p = b.play; let row = p.sid && d.plays.find(x => x.sid === p.sid && x.name === b.name);
        if (row) Object.assign(row, { score: p.score, max: p.max, durationSec: p.durationSec, updated: now() });
        else { const attempt = d.plays.filter(x => x.name === b.name && x.appId === p.appId).length + 1; row = Object.assign({ time: now(), name: b.name, attempt }, p); d.plays.push(row); }
        (b.answers || []).forEach(a => d.answers.push(Object.assign({ time: now(), name: b.name, source: "app", sourceId: p.appId, attempt: row.attempt }, a)));
        store(d); return { ok: true, attempt: row.attempt };
      }
      case "myPlays": return { ok: true, plays: d.plays.filter(x => x.name === b.name).slice(-200).reverse(), subs: d.subs.filter(x => x.name === b.name).slice(-200).reverse() };
      case "report": needT(); return { ok: true, plays: d.plays, subs: d.subs, answers: d.answers.slice(-8000) };
      case "hwSave": {
        needT(); const hw = b.hw; hw.updated = now(); hw.created = hw.created || hw.updated; d.hws[hw.id] = hw; store(d); return { ok: true, id: hw.id };
      }
      case "hwList": {
        const list = Object.values(d.hws).filter(x => teacher || x.open).map(x => pubMeta(x, d, b.name));
        return { ok: true, list: list.sort((a, c) => String(c.created).localeCompare(String(a.created))) };
      }
      case "hwGet": { const hw = d.hws[b.id]; if (!hw || (!teacher && !hw.open)) throw new Error("Không tìm thấy bài tập"); return { ok: true, hw }; }
      case "hwSubmit": {
        const hw = d.hws[b.id]; if (!hw || (!teacher && !hw.open)) throw new Error("Bài tập đang đóng");
        const mine = d.subs.filter(s => s.hwId === hw.id && s.name === b.name);
        const m = hw.meta || {};
        if (m.maxAttempts && mine.length >= m.maxAttempts && !teacher) throw new Error("Em đã hết lượt làm bài này");
        const attempt = mine.length + 1;
        const scaled = b.max ? L.round2(b.score / b.max * (m.scale || 10)) : 0;
        d.subs.push({ time: now(), name: b.name, hwId: hw.id, hwTitle: hw.title, attempt, score: b.score, max: b.max, scaled, durationSec: b.durationSec || 0 });
        (b.items || []).forEach(a => d.answers.push(Object.assign({ time: now(), name: b.name, source: "hw", sourceId: hw.id, attempt }, a)));
        store(d); return { ok: true, attempt, scaled };
      }
      case "hwMine": return { ok: true, subs: d.subs.filter(s => s.hwId === b.id && s.name === b.name) };
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
