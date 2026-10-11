/* Hệ thống thưởng & động lực: nhiệm vụ ngày, chuỗi ngày học, ôn lặp lại câu sai, đánh Boss,
   bản đồ đảo theo unit, nhiều chủ đề giao diện. Dữ liệu nằm trong hồ sơ (profile.js) → đồng bộ Google Sheets. */
window.LSE = window.LSE || {};
(function (L) {
  const { h, shuffle } = L;
  const prof = L.prof;
  const fmtDay = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const addDays = n => { const d = new Date(); d.setDate(d.getDate() + n); return fmtDay(d); };
  const hashStr = s => { let x = 2166136261; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };
  const BIG = { memory: 1, wordsearch: 1, crossword: 1 };          // dạng quá dài để làm từng câu
  const qLabel = q => String(q.src || (q.parts ? q.parts.map(p => p.k === "t" ? p.s : "___").join("") : "") || q.stem || q.ans || q.say || (q.chunks ? q.chunks.join(" ") : "") || (q.full) || q.type).replace(/\s+/g, " ").trim().slice(0, 90);

  /* ================= Nhiệm vụ ngày ================= */
  const QUESTS = [
    { id: "right10", im: "nv-dung", t: "Trả lời đúng 10 câu", m: "right", n: 10, xu: 5, ic: "✅" },
    { id: "right25", im: "nv-dung", t: "Trả lời đúng 25 câu", m: "right", n: 25, xu: 10, ic: "🎯" },
    { id: "practice1", im: "nv-luyentap", t: "Hoàn thành 1 bài luyện tập", m: "practice", n: 1, xu: 5, ic: "🎮" },
    { id: "hw1", im: "nv-nopbai", t: "Nộp 1 bài tập", m: "hw", n: 1, xu: 6, ic: "📝" },
    { id: "review5", im: "nv-onlai", t: "Ôn lại 5 câu ở mục Ôn lại", m: "review", n: 5, xu: 6, ic: "🔁" },
    { id: "fix3", im: "nv-suasai", t: "Sửa đúng 3 câu từng làm sai", m: "fixed", n: 3, xu: 6, ic: "🔧" },
    { id: "combo5", im: "nv-combo", t: "Đạt combo 🔥 x5", m: "combo5", n: 1, xu: 5, ic: "🔥" },
    { id: "boss1", im: "nv-boss", t: "Đánh bại 1 con Boss", m: "boss", n: 1, xu: 8, ic: "👾" },
    { id: "app1", im: "nv-game", t: "Chơi 1 app / game", m: "app", n: 1, xu: 4, ic: "🕹️" }
  ];
  const QBY = Object.fromEntries(QUESTS.map(q => [q.id, q]));
  const BONUS_ALL = 10;
  /** 3 nhiệm vụ của hôm nay: cố định theo (tên + ngày) nên đổi máy vẫn giống nhau */
  function questsFor(p) {
    const seed = hashStr(L.plain(L.auth.name || "") + "|" + prof.today());
    const wbN = Object.values(p.wb || {}).filter(x => !x.m).length;
    const g1 = ["right10", "right25"], g2 = ["practice1", "hw1"].concat(wbN >= 5 ? ["review5"] : [], wbN >= 3 ? ["fix3"] : []), g3 = ["combo5", "boss1", "app1"];
    return [g1[seed % g1.length], g2[(seed >>> 3) % g2.length], g3[(seed >>> 6) % g3.length]].map(id => QBY[id]);
  }
  function ensureDay(p) { if (p.quest.day !== prof.today()) p.quest = { day: prof.today(), p: {}, done: [], bonus: false }; }
  function bump(metric, n, asMax) {
    const newly = []; let bonus = false;
    prof.mut(p => {
      ensureDay(p); const q = p.quest;
      q.p[metric] = asMax ? Math.max(q.p[metric] || 0, n) : (q.p[metric] || 0) + n;
      const qs = questsFor(p);
      qs.forEach(d => { if (!q.done.includes(d.id) && (q.p[d.m] || 0) >= d.n) { q.done.push(d.id); p.coins += d.xu; p.earned += d.xu; newly.push(d); } });
      if (!q.bonus && qs.every(d => q.done.includes(d.id))) { q.bonus = true; p.coins += BONUS_ALL; p.earned += BONUS_ALL; bonus = true; }
    });
    newly.forEach((d, i) => setTimeout(() => { L.toast("🎯 Xong nhiệm vụ: " + d.t + "  +" + d.xu + " xu"); L.sfx.coin(); }, 400 + i * 900));
    if (bonus) setTimeout(() => { L.toast("🏆 Xong cả 3 nhiệm vụ hôm nay! Thưởng thêm +" + BONUS_ALL + " xu", 5000); L.sfx.win(); L.confetti && L.confetti(60); }, 900 + newly.length * 900);
  }
  function questView(p) {
    p = p || prof.get(); const q = p.quest.day === prof.today() ? p.quest : { p: {}, done: [], bonus: false };
    const qs = questsFor(p), doneN = qs.filter(d => q.done.includes(d.id)).length;
    return h("div.card.quests",
      h("div.row", h("h3", "🎯 Nhiệm vụ hôm nay"), h("span.grow"), h("span.pill." + (doneN === 3 ? "mint" : "butter"), doneN + "/3"), q.bonus ? h("span.pill.rose", "+" + BONUS_ALL + " xu thưởng") : h("span.small.muted", L.ei("🎁", 20), " Xong cả 3: +" + BONUS_ALL + " xu")),
      qs.map(d => { const cur = Math.min(d.n, q.p[d.m] || 0), ok = q.done.includes(d.id);
        return h("div.qrow" + (ok ? ".done" : ""), h("span.qi", ok ? L.ico("nv-dung", "✔️", 32) : L.ico(d.im, d.ic, 32)), h("div.grow", h("div", d.t), h("div.bar" + (ok ? ".good" : ""), h("i", { style: "width:" + Math.round(100 * cur / d.n) + "%" }))), h("span.pill.butter", { html: L.coinSvg + " +" + d.xu }), h("span.small.muted", cur + "/" + d.n)); }));
  }

  /* ================= Chuỗi ngày học ================= */
  const STREAK_BONUS = { 3: 5, 7: 15, 14: 30, 30: 60 };
  function streakNow(p) { p = p || prof.get(); const l = p.streak.last; return (l === prof.today() || l === addDays(-1)) ? p.streak.n : 0; }
  function touchStreak() {
    if (prof.get().streak.last === prof.today()) return;
    let got = 0, n = 0;
    prof.mut(p => { p.streak.n = p.streak.last === addDays(-1) ? p.streak.n + 1 : 1; p.streak.last = prof.today(); p.streak.best = Math.max(p.streak.best || 0, p.streak.n); n = p.streak.n; got = STREAK_BONUS[n] || 0; if (got) { p.coins += got; p.earned += got; } });
    setTimeout(() => L.toast("🔥 " + n + " ngày học liên tiếp!" + (got ? "  Thưởng +" + got + " xu" : ""), 4000), 300);
  }

  /* ================= Ôn lặp lại câu sai ================= */
  const INTV = [1, 3, 7, 14, 30];
  const wb = {
    add(hwId, q) {
      if (!hwId || BIG[q.type] || !q.id) return;
      prof.mut(p => { const o = p.wb[q.id]; p.wb[q.id] = { h: hwId, q: q.id, n: qLabel(q), tp: (q.topic || "").slice(0, 60), b: 0, d: addDays(1), t: Date.now(), m: 0, c: ((o && o.c) || 0) + 1 }; });
    },
    result(qid, ok) {
      if (!prof.get().wb[qid]) return;
      prof.mut(p => { const it = p.wb[qid]; if (!it) return; it.t = Date.now(); if (ok) { it.b++; if (it.b >= 5) it.m = 1; else it.d = addDays(INTV[it.b]); } else { it.b = 0; it.d = addDays(1); it.m = 0; } });
    },
    retire(ids) { prof.mut(p => ids.forEach(id => { if (p.wb[id]) { p.wb[id].m = 1; p.wb[id].t = Date.now(); } })); },
    due(p) { p = p || prof.get(); const t = prof.today(); return Object.values(p.wb).filter(x => !x.m && x.d <= t).sort((a, b) => a.d.localeCompare(b.d)); },
    open(p) { p = p || prof.get(); return Object.values(p.wb).filter(x => !x.m); },
    nextDue(p) { const o = wb.open(p).map(x => x.d).sort(); return o[0] || ""; }
  };

  /** dựng lại các câu từ ngân hàng câu sai (tải bài tập về, tìm đúng câu) */
  async function loadEntries(items, opts) {
    opts = opts || {};
    const byHw = {}; items.forEach(it => (byHw[it.h] = byHw[it.h] || []).push(it));
    const out = [], missing = new Set(items.map(i => i.q)); let imgs = false;
    for (const hwId of Object.keys(byHw)) {
      let hw;
      try { hw = (await L.api.call("hwGet", { id: hwId })).hw; if (!imgs) { imgs = true; try { await L.imgs.load(); } catch (e) { } } }
      catch (e) { if (!/Không tìm thấy|không được giao/.test(e.message || "")) byHw[hwId].forEach(it => missing.delete(it.q)); continue; }
      (hw.sections || []).forEach(sec => {
        const rt = L.hw.buildRuntime(sec, { keepOrder: true });
        rt.qs.forEach(q => { if (byHw[hwId].some(it => it.q === q.id) && !BIG[q.type] && !(opts.noBank && q.type === "fillbank")) { out.push({ rt, q, hwId }); missing.delete(q.id); } });
      });
    }
    if (missing.size) wb.retire([...missing]);
    return out;
  }
  const groupRts = entries => { const m = new Map(); entries.forEach(e => { if (!m.has(e.rt)) m.set(e.rt, []); m.get(e.rt).push(e.q); }); return [...m.entries()].map(([rt, qs]) => L.subRuntime(rt, qs)); };

  async function reviewView() {
    const ui = L.ui; ui.show(ui.spinner());
    const due = wb.due();
    if (!due.length) {
      const nd = wb.nextDue();
      ui.show(h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › Ôn lại"),
        h("div.card.empty", h("div", { style: "font-size:54px" }, "🌈"), h("h2", "Hôm nay em không còn câu nào cần ôn!"),
          h("p.muted", wb.open().length ? "Còn " + wb.open().length + " câu đang chờ đến hạn" + (nd ? " (gần nhất: " + nd.split("-").reverse().join("/") + ")" : "") + ". Lịch ôn: sau 1 → 3 → 7 → 14 → 30 ngày thì câu đó được tính là đã nhớ." : "Khi em làm sai ở phần Luyện tập hoặc khi nộp bài, các câu sai sẽ tự vào đây để ôn lại đúng lúc dễ quên."),
          h("div.row", { style: "justify-content:center" }, h("a.btn", { href: "#/hw" }, "📝 Làm bài tập"), wb.open().length ? h("a.btn.rose", { href: "#/boss/wrong" }, "👾 Đánh Boss từ câu sai") : null)));
      return;
    }
    const entries = await loadEntries(shuffle(due).slice(0, 15));
    if (!entries.length) { ui.show(h("div.card.empty", "Các bài chứa câu cần ôn hiện không mở được nên mình tạm cất những câu này đi. Em làm bài khác nhé!", h("div", h("a.btn", { href: "#/" }, "Về trang chủ")))); return; }
    L.startPractice("🔁 Ôn lại hôm nay", groupRts(entries), { back: "#/", review: true });
  }

  /* ================= Đánh Boss ================= */
  const BOSSES = [{ im: "boss-tuvung", e: "👾", n: "Quái Vật Từ Vựng" }, { im: "boss-nguphap", e: "🐙", n: "Bạch Tuộc Ngữ Pháp" }, { im: "boss-luoihoc", e: "🦖", n: "Khủng Long Lười Học" }, { im: "boss-muc", e: "🦑", n: "Mực Khổng Lồ" }, { im: "boss-rong", e: "🐲", n: "Rồng Lửa Quên Bài" }, { im: "boss-chinhta", e: "👹", n: "Yêu Tinh Sai Chính Tả" }, { im: "boss-robot", e: "🤖", n: "Rô-bốt Bắt Lỗi" }];
  async function bossView(arg) {
    const ui = L.ui; ui.show(ui.spinner());
    let entries = [], title = "Boss";
    try {
      if (arg === "wrong") {
        title = "Boss từ câu sai của em";
        const open = wb.open(); if (!open.length) { ui.show(h("div.card.empty", h("div", { style: "font-size:54px" }, "🌟"), h("h2", "Em chưa có câu sai nào để đánh Boss!"), h("p.muted", "Làm bài luyện tập rồi quay lại nhé."), h("a.btn", { href: "#/hw" }, "Làm bài tập"))); return; }
        entries = await loadEntries(shuffle(open).slice(0, 10), { noBank: true });
      } else {
        const hw = (await L.api.call("hwGet", { id: arg })).hw; try { await L.imgs.load(); } catch (e) { }
        title = "Boss · " + hw.title;
        const all = []; (hw.sections || []).forEach(sec => { const rt = L.hw.buildRuntime(sec, { keepOrder: true }); rt.qs.forEach(q => { if (!BIG[q.type] && q.type !== "fillbank") all.push({ rt, q, hwId: hw.id }); }); });
        entries = shuffle(all).slice(0, 10);
      }
    } catch (e) { ui.show(h("div.card", h("div.err", e.message), h("a.btn", { href: "#/hw" }, "← Bài tập"))); return; }
    if (entries.length < 3) { ui.show(h("div.card.empty", "Cần ít nhất 3 câu để đánh Boss. Hãy làm thêm bài luyện tập nhé!", h("div", h("a.btn", { href: "#/hw" }, "Làm bài tập")))); return; }
    startBoss(title, entries);
  }

  function startBoss(title, entries) {
    const ui = L.ui, N = entries.length, boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    entries.forEach(e => { e.st = L.hw.initState(e.q); });
    let queue = entries.slice(), hearts = 3, defeated = 0, combo = 0, best = 0, coins = 0, revive = false, over = false, chk = null;
    const bar = h("div.card.bossbar"), stage = h("div"), root = h("div");
    const heartsStr = () => Array.from({ length: 3 }, (_, i) => L.ei(i < hearts ? "❤️" : "🖤", 30));
    const paintBar = (hit) => {
      bar.innerHTML = "";
      const hp = Math.round(100 * (N - defeated) / N);
      bar.append(h("div.row", h("div.bossface.pic" + (hit === "hit" ? ".hit" : hit === "atk" ? ".atk" : ""), L.ico(boss.im, boss.e, 96)), h("div.grow", h("b", boss.n), h("div.bar.bad.hp", h("i", { style: "width:" + hp + "%" })), h("div.small.muted", "HP " + hp + "% · còn " + (N - defeated) + " câu")),
        h("div.col", { style: "text-align:right" }, h("div.hearts", heartsStr()), combo >= 2 ? h("span.pill.butter.combo", L.ei("🔥", 20), " x" + combo) : null)));
    };
    const finish = win => {
      over = true; bar.classList.toggle("lose", !win); paintBar();
      stage.innerHTML = "";
      if (win) {
        const reward = 8 + N + hearts * 2; prof.add(reward); coins += reward; prof.mut(p => { p.st.bosses = (p.st.bosses || 0) + 1; }); bump("boss", 1); touchStreak();
        L.sfx.win(); L.confetti && L.confetti(90);
        stage.append(h("div.card.result", L.mascot.el({ pose: "win", height: 220, say: "Em đánh bại Boss rồi! 🏆" }), h("h2", "Em đã đánh bại " + boss.n + "!"), h("div.score-big", "★".repeat(hearts) + "☆".repeat(3 - hearts)),
          h("div.row", { style: "justify-content:center;margin:8px 0" }, h("span.pill.butter", { html: L.coinSvg + " +" + coins + " xu" }), best >= 3 ? h("span.pill.rose", L.ei("🔥", 18), " combo cao nhất x" + best) : null),
          h("div.cheer", L.cheer(hearts === 3 ? 95 : hearts === 2 ? 75 : 50)),
          h("div.row", { style: "justify-content:center;margin-top:10px" }, h("button.btn", { onclick: () => startBoss(title, shuffle(entries.map(e => ({ rt: e.rt, q: e.q, hwId: e.hwId }))).slice(0, N)) }, "⚔️ Đánh lại"), h("a.btn.ghost", { href: "#/" }, "← Trang chủ"), h("a.btn.ghost", { href: "#/shop" }, "🛍️ Cửa hàng"))));
      } else {
        L.sfx.bad();
        stage.append(h("div.card.result", L.mascot.el({ pose: "sleepy", height: 200, say: "Không sao, mình thử lại nha!" }), h("h2", boss.n + " thắng lần này…"), h("p.muted", "Không sao! Xem lại những câu vừa sai rồi thử lại, em sẽ thắng thôi."),
          h("div.row", { style: "justify-content:center;margin-top:10px" }, h("button.btn", { onclick: () => startBoss(title, shuffle(entries.map(e => ({ rt: e.rt, q: e.q, hwId: e.hwId })))) }, "⚔️ Đánh lại"), h("a.btn.ghost", { href: "#/review" }, "🔁 Ôn lại câu sai"), h("a.btn.ghost", { href: "#/" }, "← Trang chủ"))));
      }
    };
    const paintQ = () => {
      stage.innerHTML = "";
      if (over) return;
      const e = chk ? chk.e : queue[0]; if (!e) { finish(true); return; }
      const ctx = { mode: "do", showAns: false, sec: e.rt.sec, secSt: e.rt.secSt, redraw: () => paintQ(), bankFree: () => { } };
      if (chk) { // đang xem kết quả câu vừa làm
        const rctx = Object.assign({}, ctx, { mode: "review", showAns: true });
        stage.append(h("div.card", revive ? h("div.hint", "💖 Câu hồi sinh") : null, L.hw.view(e.q, e.st, rctx, defeated + 1),
          h("div.row.pfeed" + (chk.ok ? ".good" : ".bad"), h("b", chk.ok ? "💥 Trúng đòn!" + (chk.crit ? " CHÍ MẠNG!" : "") : "Boss phản công! −1 ❤️ (câu này sẽ quay lại)"), h("span.grow"), h("button.btn.sm", { onclick: () => chk.next() }, "Tiếp tục ▶"))));
        return;
      }
      stage.append(h("div.card", revive ? h("div.hint", "💖 Hết tim! Trả lời đúng câu bổ sung này để hồi sinh 1 tim và đánh tiếp.") : null, L.hw.view(e.q, e.st, ctx, defeated + 1),
        h("div.row.pact", h("span.grow"), h("button.btn.sm.rose", { onclick: attack }, "⚔️ Tấn công!"))));
    };
    const attack = () => {
      const e = queue[0], g = L.hw.grade(e.q, e.st); if (!g.max) return;
      const ok = g.got === g.max;
      L.rw.answer(ok);
      if (ok) {
        combo++; best = Math.max(best, combo); if (combo >= 5) bump("combo5", 1, true);
        const crit = combo >= 3, gain = 1 + (crit ? 1 : 0); prof.add(gain); coins += gain; L.sfx.ok(); setTimeout(L.sfx.coin, 200);
        defeated++; queue.shift(); const wasRevive = revive; if (wasRevive) { hearts = 1; revive = false; }
        paintBar("hit"); L.fly("-" + Math.ceil(100 / N) + "%" + (crit ? " 💥" : ""), bar.querySelector(".bossface"));
        chk = { ok: true, crit, e, next: () => { chk = null; paintBar(); paintQ(); } };
        e.st.chk = g;
      } else {
        combo = 0; L.sfx.bad(); wb.add(e.hwId, e.q);
        queue.shift(); queue.push({ rt: e.rt, q: e.q, hwId: e.hwId, st: L.hw.initState(e.q) });
        if (revive) { over = true; chk = null; finish(false); return; }
        hearts--; paintBar("atk");
        chk = { ok: false, e, next: () => { chk = null; if (hearts <= 0) { revive = true; } paintBar(); paintQ(); } };
        e.st.chk = g;
      }
      paintQ();
    };
    root.append(h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › ", title), bar, stage);
    ui.show(root); paintBar(); paintQ();
  }

  /* ================= Bản đồ đảo ================= */
  async function mapView(cid) {
    const ui = L.ui; ui.show(ui.spinner()); const m = await ui.loadManifest();
    const c = L.cur(cid); if (!c) { ui.show(h("div.card.empty", "Không tìm thấy giáo trình này.")); return; }
    let list = []; try { list = await L.loadHw(); } catch (e) { }
    try { await L.loadMine(); } catch (e) { }
    const p = prof.get(), plays = (L.state.plays || []);
    const units = (c.units || []).map(u => {
      const hws = list.filter(x => x.curId === cid && (x.unitId || "") === u.id), apps = L.appsIn(cid, u.id);
      const items = [];
      hws.forEach(x => { const sc = x.myBest != null ? x.myBest / (x.scale || 10) : 0; items.push(Math.max(sc, (p.map[x.id] || 0) / 100)); });
      apps.forEach(a => { const mine = plays.filter(q => q.appId === a.id); items.push(mine.length ? Math.max(0.35, ...mine.map(q => q.max ? q.score / q.max : 0.35)) : 0); });
      const done = items.filter(v => v > 0).length, avg = items.length ? items.reduce((a, b) => a + b, 0) / items.length : 0;
      const stars = !items.length ? 0 : avg >= .85 ? 3 : avg >= .6 ? 2 : done ? 1 : 0;
      return { u, n: items.length, done, stars, avg, full: items.length > 0 && done === items.length };
    });
    const curIdx = Math.max(0, units.findIndex(x => !x.full && x.n > 0));
    const ISL = ["🏝️", "🌴", "🏔️", "🌋", "🏯", "🎡", "🏰", "🌸", "⛲", "🌈"];
    const you = prof.avatar();
    const node = (x, i) => h("a.isle" + (i % 2 ? ".r" : ".l") + (x.full ? ".full" : "") + (i === curIdx ? ".here" : ""), { href: "#/c/" + cid + "/u/" + x.u.id },
      h("div.isl-ico", ISL[i % ISL.length]),
      i === curIdx ? h("div.isl-you", you ? L.avImg(you, 40) : L.ei("🌱", 30)) : null,
      h("div.isl-name", x.u.name), h("div.isl-stars", [0, 1, 2].map(k => h("span" + (k < x.stars ? ".on" : ""), "★"))),
      h("div.small.muted", x.n ? x.done + "/" + x.n + " hoạt động" : "Chưa có hoạt động"));
    ui.show(h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › ", h("a", { href: "#/c/" + cid }, c.name), " › Bản đồ"),
      h("div.card", h("h1", { style: "font-size:30px" }, [L.ei("🗺️", 34), " Bản đồ đảo · " + c.name]), h("div.small.muted", "Mỗi unit là một hòn đảo. Làm bài tập, luyện tập và chơi game ở unit đó để thắp sáng sao ★. Nhân vật của em đứng ở đảo đang học dở.")),
      units.length ? h("div.isles", units.map(node)) : h("div.card.empty", "Giáo trình này chưa có unit nào."),
      h("div.row", { style: "justify-content:center;margin-top:14px" }, h("a.btn.ghost", { href: "#/c/" + cid }, "☰ Xem dạng danh sách")));
  }

  /* ================= Chủ đề giao diện ================= */
  const THEMES = [
    { im: "th-default", id: "default", n: "Cực quang pastel", p: 0, e: "🌈", fx: ["✨", "⭐", "💫"] },
    { im: "th-candy", id: "candy", n: "Kẹo ngọt", p: 0, e: "🍭", fx: ["🍬", "🍭", "🧁"] },
    { im: "th-ocean", id: "ocean", n: "Biển xanh", p: 0, e: "🌊", fx: ["🫧", "🐠", "🐚"] },
    { im: "th-sakura", id: "sakura", n: "Hoa anh đào", p: 30, e: "🌸", fx: ["🌸", "🌷"] },
    { im: "th-forest", id: "forest", n: "Rừng xanh", p: 30, e: "🌿", fx: ["🍃", "🌿", "🦋"] },
    { im: "th-sunset", id: "sunset", n: "Hoàng hôn", p: 40, e: "🌅", fx: ["☁️", "✨"] },
    { im: "th-summer", id: "summer", n: "Mùa hè", p: 40, e: "☀️", fx: ["☀️", "🍉", "🏖️"] },
    { im: "th-autumn", id: "autumn", n: "Lá thu", p: 40, e: "🍁", fx: ["🍁", "🍂"] },
    { im: "th-mooncake", id: "mooncake", n: "Trung thu", p: 50, e: "🏮", fx: ["🏮", "🌕", "⭐"], season: "Trung thu" },
    { im: "th-xmas", id: "xmas", n: "Giáng sinh", p: 50, e: "🎄", fx: ["❄️", "⛄", "⭐"], season: "Giáng sinh" },
    { im: "th-tet", id: "tet", n: "Tết", p: 50, e: "🧧", fx: ["🌼", "🧧", "🌸"], season: "Tết" },
    { im: "th-twilight", id: "twilight", n: "Chiều tím", p: 60, e: "🔮", fx: ["⭐", "🌙", "✨"] },
    { im: "th-rainbow", id: "rainbow", n: "Cầu vồng", p: 60, e: "🌈", fx: ["🌈", "⭐", "💖"] }
  ];
  const THEME = Object.fromEntries(THEMES.map(t => [t.id, t]));
  let fxLayer = null;
  function applyTheme(id) {
    const t = THEME[id] || THEME.default; document.documentElement.dataset.theme = t.id;
    try { localStorage.setItem("lse_theme", t.id); } catch (e) { }
    if (fxLayer) fxLayer.remove();
    fxLayer = h("div.fxlayer", { "aria-hidden": "true" });
    const nodes = []; const n = 18;
    for (let i = 0; i < n; i++) {
      const sp = h("span", t.fx[i % t.fx.length]);
      sp.style.cssText = "left:" + Math.round((i * 97 / n + (i * 37) % 11)) % 100 + "%;font-size:" + (16 + (i * 7) % 16) + "px;animation-duration:" + (14 + (i * 5) % 12) + "s;animation-delay:-" + ((i * 3) % 14) + "s";
      nodes.push(sp);
    }
    fxLayer.append(...nodes); document.body.appendChild(fxLayer);
  }
  try { applyTheme(localStorage.getItem("lse_theme") || "default"); } catch (e) { applyTheme("default"); }
  /* hiệu ứng rơi tắt khi đang làm bài / đánh Boss / chơi game để học sinh không bị xao nhãng */
  const fxRoute = () => document.documentElement.classList.toggle("nofx", /^#\/(practice|boss|hw|review|app|play)/.test(location.hash));
  window.addEventListener("hashchange", fxRoute); fxRoute();
  function syncTheme() { if (L.auth.role === "student") { const t = prof.get().theme; if (t && THEME[t] && document.documentElement.dataset.theme !== t) applyTheme(t); } }
  prof.onChange(syncTheme);

  /* ================= Khối "Hôm nay" trên trang chủ ================= */
  function homeBlock() {
    const p = prof.get(), due = wb.due(p).length, open = wb.open(p).length, sn = streakNow(p);
    return h("div",
      h("div.row.todaystats", h("span.pill.rose.big", L.ei("🔥", 24), " " + sn + " ngày liên tiếp"), h("span.pill.butter.big", { html: L.coinSvg + " " + p.coins + " xu" }), p.streak.best > sn ? h("span.small.muted", "Kỷ lục: " + p.streak.best + " ngày") : null),
      questView(p),
      h("div.grid.actions",
        h("a.cur.tint1", { href: "#/review" }, h("div.em", L.ei("🔁", 44)), h("h3", "Ôn lại hôm nay"), h("div.meta", due ? due + " câu đến hạn ôn" : open ? "Chưa có câu nào đến hạn" : "Chưa có câu sai nào"), h("span.go", "→")),
        h("a.cur.tint5", { href: "#/boss/wrong" }, h("div.em", L.ei("👾", 44)), h("h3", "Đánh Boss"), h("div.meta", open ? "Đấu với " + Math.min(open, 10) + " câu em từng sai" : "Làm bài rồi quay lại nhé"), h("span.go", "→")),
        h("a.cur.tint4", { href: "#/shop" }, h("div.em", L.ei("🛍️", 44)), h("h3", "Cửa hàng"), h("div.meta", "Avatar · Thú nuôi · Chủ đề"), h("span.go", "→"))));
  }

  /* ================= Cổng thưởng: gọi mỗi khi học sinh trả lời ================= */
  const rw = {
    answer(ok) { if (L.auth.role !== "student") return; prof.mut(p => { ok ? p.st.right++ : p.st.wrong++; }); if (ok) { touchStreak(); bump("right", 1); } L.pet && L.pet.answer(ok); },
    event(name, n) { if (L.auth.role !== "student") return; bump(name, n || 1); if (name === "practice" || name === "hw" || name === "app") touchStreak(); },
    combo(n) { if (n >= 5) bump("combo5", 1, true); },
    practiceDone(hwId, pct) { if (L.auth.role !== "student") return; prof.mut(p => { p.st.practices = (p.st.practices || 0) + 1; if (hwId) p.map[hwId] = Math.max(p.map[hwId] || 0, Math.round(pct)); }); bump("practice", 1); },
    bulk(right, wrong) { if (L.auth.role !== "student") return; prof.mut(p => { p.st.right += right; p.st.wrong += wrong; }); if (right > 0) { touchStreak(); bump("right", right); } L.pet && L.pet.bulk(right, wrong); },
    wrongFromHw(hwId, rts) { if (L.auth.role !== "student") return; rts.forEach(rt => rt.qs.forEach(q => { const g = L.hw.grade(q, rt.sts[q.id]); if (g.max && g.got < g.max) wb.add(hwId, q); })); }
  };

  L.rw = rw; L.wb = wb; L.quests = { questsFor, questView, homeBlock, streakNow };
  L.extras = { reviewView, bossView, mapView, homeBlock, THEMES, THEME, applyTheme, syncTheme, qLabel, BIG };
})(window.LSE);
