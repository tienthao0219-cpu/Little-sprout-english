/* Hồ sơ học sinh: xu, avatar, thú nuôi, chủ đề, nhiệm vụ, câu sai...
   - Lưu tạm trên máy (localStorage) để dùng ngay, rồi đồng bộ lên Google Sheets (trang tính "profiles").
   - Nhiều thiết bị: máy chủ gộp (xu cộng theo phần chênh lệch, danh sách đồ đã mua lấy hợp). */
window.LSE = window.LSE || {};
(function (L) {
  const safe = f => { try { return f(); } catch (e) { return null; } };

  const AV = [
    { im: "av-sprout", id: "sprout", e: "🌱", n: "Mầm nhỏ", p: 0, bg: "#D3F6E6" }, { im: "av-cat", id: "cat", e: "🐱", n: "Mèo con", p: 0, bg: "#FFE0EE" }, { im: "av-dog", id: "dog", e: "🐶", n: "Cún con", p: 0, bg: "#FFE9C9" },
    { im: "av-rabbit", id: "rabbit", e: "🐰", n: "Thỏ bông", p: 20, bg: "#FFD6E8" }, { im: "av-fox", id: "fox", e: "🦊", n: "Cáo nhỏ", p: 30, bg: "#FFD9BF" }, { im: "av-panda", id: "panda", e: "🐼", n: "Gấu trúc", p: 40, bg: "#E3E6EE" },
    { im: "av-frog", id: "frog", e: "🐸", n: "Ếch xanh", p: 50, bg: "#D6F5D6" }, { im: "av-koala", id: "koala", e: "🐨", n: "Koala", p: 60, bg: "#DDE4F2" }, { im: "av-tiger", id: "tiger", e: "🐯", n: "Hổ con", p: 70, bg: "#FFE9A8" },
    { im: "av-lion", id: "lion", e: "🦁", n: "Sư tử", p: 90, bg: "#FFE0A8" }, { im: "av-unicorn", id: "unicorn", e: "🦄", n: "Kỳ lân", p: 120, bg: "#F3D9FF" }, { im: "av-dragon", id: "dragon", e: "🐲", n: "Rồng nhỏ", p: 150, bg: "#CFF3E8" }
  ];

  const blank = () => ({
    coins: 0, earned: 0, owned: ["sprout", "cat", "dog"], avatar: "",
    pet: { kind: "", name: "", xp: 0, cute: 40, last: 0, fed: 0 }, ownedPets: [],
    theme: "default", ownedThemes: ["default"],
    quest: { day: "", p: {}, done: [], bonus: false }, streak: { last: "", n: 0, best: 0 },
    wb: {}, st: { right: 0, wrong: 0, practices: 0, bosses: 0, reviews: 0 }, map: {}, spk: { stars: {}, stk: [] }, fly: { stars: {}, stk: [] },
    _rev: undefined, _bc: 0, _be: 0, _d: 0, _v: 0
  });
  const keyOf = () => "lse_prof_v2:" + L.plain(L.auth && L.auth.name || "");
  const oldKeyOf = () => "lse_prof_v1:" + L.plain(L.auth && L.auth.name || "");
  function norm(o) {
    const b = blank(); o = o && typeof o === "object" ? o : {};
    const r = Object.assign(b, o);
    r.pet = Object.assign(blank().pet, o.pet || {}); r.quest = Object.assign(blank().quest, o.quest || {}); r.streak = Object.assign(blank().streak, o.streak || {});
    r.st = Object.assign(blank().st, o.st || {});
    r.spk = L.spkMerge(o.spk, null);
    r.fly = L.spkMerge(o.fly, null);   // Flyers Speaking: sao + sticker
    ["owned", "ownedPets", "ownedThemes"].forEach(k => { if (!Array.isArray(r[k])) r[k] = blank()[k]; });
    ["sprout", "cat", "dog"].forEach(id => { if (!r.owned.includes(id)) r.owned.push(id); });
    if (!r.ownedThemes.includes("default")) r.ownedThemes.push("default");
    if (!r.wb || typeof r.wb !== "object") r.wb = {}; if (!r.map || typeof r.map !== "object") r.map = {};
    return r;
  }
  let cache = null, cacheKey = "";
  function load() {
    const k = keyOf();
    if (cache && cacheKey === k) return cache;
    let raw = safe(() => JSON.parse(localStorage.getItem(k) || "null"));
    if (!raw) { /* nhận lại dữ liệu bản cũ (chỉ có trên máy) để không mất xu đã kiếm */
      const old = safe(() => JSON.parse(localStorage.getItem(oldKeyOf()) || "null"));
      if (old) { raw = Object.assign({}, old); raw._rev = undefined; raw._d = 1; raw._bc = 0; raw._be = 0; }
    }
    cache = norm(raw); cacheKey = k; return cache;
  }
  const persist = () => { if (cache) safe(() => localStorage.setItem(cacheKey, JSON.stringify(cache))); };
  const listeners = [];
  const notify = () => listeners.forEach(f => safe(() => f(cache)));

  /* ---------- đồng bộ ---------- */
  let timer = null, pushing = false, again = false;
  const sync = { state: "idle", last: 0 };
  function schedule() { clearTimeout(timer); timer = setTimeout(() => push().catch(() => { }), 2500); sync.state = "pending"; }
  const payload = p => { const o = JSON.parse(JSON.stringify(p)); delete o._rev; delete o._bc; delete o._be; delete o._d; delete o._v; return o; };

  async function push() {
    if (!L.auth || !L.auth.name || !L.auth.role) return;
    if (pushing) { again = true; return; }
    pushing = true; clearTimeout(timer);
    const snap = load(), snapV = snap._v, snapCoins = snap.coins, snapEarned = snap.earned;
    try {
      const r = await L.api.call("profileSave", { profile: payload(snap), bc: snap._bc || 0, be: snap._be || 0 });
      const m = norm(r.profile), cur = load();
      m.spk = L.spkMerge(m.spk, snap.spk);   // máy chủ cũ (chưa cập nhật Code.gs) không trả spk: giữ lại phần của máy này
      m.fly = L.spkMerge(m.fly, snap.fly);
      const dC = cur.coins - snapCoins, dE = cur.earned - snapEarned, changed = cur._v !== snapV;
      if (!changed) { cache = Object.assign(m, { _bc: m.coins, _be: m.earned, _d: 0, _v: cur._v, _rev: 1 }); }
      else {
        // trong lúc gửi, em ấy vẫn làm tiếp: giữ phần mới, lấy hợp danh sách đồ đã mua từ máy chủ
        ["owned", "ownedPets", "ownedThemes"].forEach(k => m[k].forEach(x => { if (!cur[k].includes(x)) cur[k].push(x); }));
        cur.coins = Math.max(0, m.coins + dC); cur.earned = m.earned + dE; cur._bc = m.coins; cur._be = m.earned; cur._rev = 1; cur._d = 1;
        cur.pet.xp = Math.max(cur.pet.xp, m.pet.xp);
        cur.spk = L.spkMerge(cur.spk, m.spk);
        cur.fly = L.spkMerge(cur.fly, m.fly);
      }
      persist(); sync.state = "ok"; sync.last = Date.now(); notify();
    } catch (e) { sync.state = "offline"; clearTimeout(timer); timer = setTimeout(() => push().catch(() => { }), 20000); throw e; }
    finally { pushing = false; if (again) { again = false; schedule(); } }
  }
  /** khi đóng trang: gửi nền, không chờ */
  function flushBeacon() {
    if (!L.auth || !L.auth.name || !L.auth.role) return;
    const p = load(); if (!p._d) return;
    if (L.api.beacon("profileSave", { profile: payload(p), bc: p._bc || 0, be: p._be || 0 })) { p._bc = p.coins; p._be = p.earned; p._d = 0; persist(); }
  }
  async function init() {
    cache = null; load();
    const loc = load();
    let r;
    try { r = await L.api.call("profileGet"); } catch (e) { sync.state = "offline"; return loc; }
    if (!r.profile || !Object.keys(r.profile).length) { loc._d = 1; loc._bc = 0; loc._be = 0; persist(); try { await push(); } catch (e) { } return load(); }
    if (loc._d || loc._rev === undefined && (loc.coins > 0 || loc.earned > 0)) {
      if (loc._rev === undefined) { loc._bc = 0; loc._be = 0; }
      // máy này có thay đổi chưa gửi: gửi lên để máy chủ gộp
      persist(); try { await push(); } catch (e) { } return load();
    }
    const m = norm(r.profile); cache = Object.assign(m, { _bc: m.coins, _be: m.earned, _d: 0, _v: loc._v || 0, _rev: 1 }); persist(); sync.state = "ok"; sync.last = Date.now(); notify();
    return cache;
  }

  /* ---------- API dùng trong giao diện ---------- */
  const prof = {
    get: load,
    coins: () => load().coins,
    mut(fn) { const p = load(); fn(p); p._d = 1; p._v = (p._v || 0) + 1; persist(); notify(); schedule(); return p; },
    add(n) { if (!n) return; prof.mut(p => { p.coins = Math.max(0, p.coins + n); if (n > 0) p.earned = (p.earned || 0) + n; }); },
    spend(n) { if (load().coins < n) return false; prof.mut(p => { p.coins -= n; }); return true; },
    buy(id) { const a = AV.find(x => x.id === id), p = load(); if (!a || p.owned.includes(id) || p.coins < a.p) return false; prof.mut(q => { q.coins -= a.p; q.owned.push(id); q.avatar = id; }); return true; },
    use(id) { if (!load().owned.includes(id)) return; prof.mut(p => { p.avatar = id; }); },
    avatar() { const p = load(); return AV.find(x => x.id === p.avatar) || null; },
    onChange(f) { listeners.push(f); },
    init, push, flushBeacon, sync, reset() { cache = null; clearTimeout(timer); },
    today: () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); },
    AV
  };
  L.prof = prof;
  window.addEventListener("pagehide", flushBeacon);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushBeacon(); });
})(window.LSE);
