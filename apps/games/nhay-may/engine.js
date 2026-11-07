/* engine.js: vòng lặp game, vật lý, bục đáp án, mây đen, boss, vẽ canvas */
(function (NM) {
  'use strict';
  var $ = NM.$, rnd = NM.rnd, ri = NM.ri, pick = NM.pick, shuffle = NM.shuffle, clamp = NM.clamp;
  var W = 360;
  var CFG = {
    GRAV: 950, CONFIRM: { easy: 3, normal: 3, hard: 2 }, JUMP_H: 130, HOP_H: 28, CLOCK: 900, FAST_SEC: 10, COIN_CAP: 300, PICK_CAP: 72,
    BOSS_HP: 3, BOSS_TURNS: 5, CLOUD: { easy: 60, normal: 45, hard: 30 }, EXPLAIN_MIN: 2
  };
  NM.CFG = CFG;
  var V0 = Math.sqrt(2 * CFG.GRAV * CFG.JUMP_H), VH = Math.sqrt(2 * CFG.GRAV * CFG.HOP_H);   // V0: nhảy cao; VH: nảy tại chỗ
  var WORLDS = [
    { name: 'Đồng cỏ', sky: ['#6fd0ff', '#d8f5ff'], ground: '#5fcf6e', gtop: '#8be07a', dark: '#2f9e4f' },
    { name: 'Rừng mây', sky: ['#ffc6ea', '#b4f1e6'], ground: '#a78bfa', gtop: '#c4b5fd', dark: '#7c5ce0' },
    { name: 'Núi tuyết', sky: ['#bfe0ff', '#f6fcff'], ground: '#e8f4ff', gtop: '#ffffff', dark: '#9dc4e6' },
    { name: 'Không gian', sky: ['#120a3a', '#46258a'], ground: '#5b4b9a', gtop: '#8b78d6', dark: '#37296e' }
  ];
  var SKINS = ['#ffcc33', '#4ecdc4', '#b388ff', '#ff8a65'];
  var PLAT_COLORS = ['#ffa94d', '#38c6d9', '#b980e8', '#6fcf7f', '#ff7aa8', '#6ea8fe'];

  var cv, ctx, stage, scale = 1, dpr = 1, H = 640, raf = 0, lastT = 0, fpsAcc = 0, fpsN = 0, timeAcc = 0;
  var G = NM.G = { active: false, paused: true };
  var keys = { l: 0, r: 0 };

  function groundY() { return H - 56; }

  /* ================= Khởi tạo sân khấu ================= */
  NM.initStage = function () {
    cv = $('#cv'); ctx = cv.getContext('2d'); stage = $('#stage');
    fit();
    window.addEventListener('resize', fit);
    window.addEventListener('orientationchange', function () { setTimeout(fit, 200); });
    var dragging = false, lastX = 0, lastY = 0, accX = 0, accY = 0;
    function px(e) { var r = cv.getBoundingClientRect(); return (e.clientX - r.left) * (W / r.width); }
    function py(e) { var r = cv.getBoundingClientRect(); return (e.clientY - r.top) * (H / r.height); }
    cv.addEventListener('pointerdown', function (e) { dragging = true; lastX = px(e); lastY = py(e); accX = accY = 0; NM.audioInit(); try { cv.setPointerCapture(e.pointerId); } catch (x) { /* bỏ qua */ } e.preventDefault(); });
    cv.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var x = px(e), y = py(e), dx = x - lastX, dy = y - lastY; lastX = x; lastY = y;
      accX = accX * 0.85 + Math.abs(dx); accY = accY * 0.85 + dy;
      if (G.active && !G.paused && G.canMove) {
        movePlayer(dx * 1.25);
        if (accY < -20 && -accY > accX * 0.9) { NM.jump(); accX = accY = 0; }       // vuốt lên = nhảy cao
        else if (accY > 20 && accY > accX * 0.9) { NM.drop(); accX = accY = 0; }    // vuốt xuống = rơi xuống bục dưới
      }
      e.preventDefault();
    });
    function up() { dragging = false; }
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    // chỉ chặn cuộn / zoom trên canvas (không chặn các nút ⏸ 💡 🔊 ⬆ ⬇ trong khung game)
    ['touchstart', 'touchmove'].forEach(function (n) { cv.addEventListener(n, function (e) { e.preventDefault(); }, { passive: false }); });
    window.addEventListener('keydown', function (e) {
      if (/input|textarea/i.test((e.target.tagName || ''))) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { keys.l = 1; e.preventDefault(); }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { keys.r = 1; e.preventDefault(); }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') { NM.jump(); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') { NM.drop(); e.preventDefault(); }
      if (e.key === 'Escape' || e.key === 'p') { if (G.active) NM.togglePause(); }
    });
    window.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.l = 0;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.r = 0;
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden && G.active && !G.paused && !G.inQuiz) NM.togglePause(true); });
    window.addEventListener('blur', function () { if (G.active && !G.paused && !G.inQuiz) NM.togglePause(true); });
    lastT = performance.now();
    raf = requestAnimationFrame(frame);
  };
  function fit() {
    var iw = window.innerWidth, ih = window.innerHeight;
    if (!G.active) H = clamp(Math.round(W * ih / iw), 600, 720);
    scale = Math.min(iw / W, ih / H); dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * scale * dpr); cv.height = Math.round(H * scale * dpr);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    stage.style.width = W + 'px'; stage.style.height = H + 'px';
    stage.style.transform = 'translate(' + ((iw - W * scale) / 2) + 'px,' + ((ih - H * scale) / 2) + 'px) scale(' + scale + ')';
  }
  NM.fit = fit;
  NM.jump = function () { if (G.active && !G.paused && G.phase === 'ask') { G.jumpBuf = 0.6; G.dropBuf = 0; } };
  NM.drop = function () { if (G.active && !G.paused && G.phase === 'ask') { G.dropBuf = 0.6; G.jumpBuf = 0; } };
  function movePlayer(dx) {
    var p = G.p; p.x += dx; p.face = dx > 0 ? 1 : dx < 0 ? -1 : p.face;
    wrapX(p);
  }
  function wrapX(p) {
    if (G.diff === 'hard') { if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; }
    else p.x = clamp(p.x, 18, W - 18);
  }

  /* ================= Bắt đầu ván ================= */
  NM.startGame = function (o) {
    var prof = NM.profile();
    var items = [];
    o.setIds.forEach(function (id) { NM.SETS.forEach(function (s) { if (s.id === id) items = items.concat(s.items); }); });
    var plan = NM.buildPlan(items);
    if (!plan) return false;
    G.sets = o.setIds; G.key = o.setIds.slice().sort().join('+'); G.items = items; G.plan = plan; G.diff = o.diff;
    G.pool = items.filter(function (i) { return i.type === 'v'; }).map(function (i) { return i.w; });
    if (G.pool.length < 4) G.pool = NM.ALLWORDS.slice();
    G.R = plan.rounds.length; G.round = o.startRound || 0;
    G.hearts = 3; G.score = 0; G.coins = 0; G.combo = 0; G.bestCombo = 0;
    G.clock = CFG.CLOCK; G.forceBoss = false; G.mainCount = 0; G.reviewQ = []; G.rescueUsed = {};
    G.appear = {}; G.itemOk = {}; G.wrongMap = {}; G.fixedList = []; G.fixList = [];
    G.stats = { correct: 0, wrong: 0, fixed: 0, boss: 0 };
    G.equip = prof.equip; G.shield = NM.charges(prof.equip.shield);
    G.slow = 1 + 0.1 * prof.equip.slow;
    G.skin = SKINS[prof.skin % SKINS.length]; G.skinIdx = prof.skin || 0;
    G.particles = []; G.timers = []; G.over = false; G.capShown = false;
    G.t = 0; G.shake = 0; G.fade = 0; G.trans = null; G.scene = null; G.phase = 'idle';
    G.p = { x: W / 2, y: 0, vy: 0, face: 1, squash: 0 };
    G.startedAt = Date.now();
    G.duel = null;
    if (o.mode === 'bot' || o.mode === 'duel') {
      var flat = []; plan.rounds.forEach(function (r) { flat = flat.concat(r); });
      var N = 10;
      G.duel = { vs: o.mode, k: 0, N: N, turn: 0, entries: flat.slice(0, o.mode === 'duel' ? N * 2 : N),
        players: [{ name: NM.db.cur, score: 0, ok: 0, time: 0 }, { name: o.mode === 'bot' ? 'Bot Mây 🤖' : (o.p2 || 'Bạn 2'), score: 0, ok: 0, time: 0 }] };
      G.R = 1; G.round = 0;
    }
    fit();
    NM.loadSheets(o.setIds);
    $('#screen').hidden = true; $('#stageWrap').hidden = false;
    G.active = true; G.paused = false; G.inQuiz = false;
    if (G.duel) beginDuel(); else beginRound();
    return true;
  };

  G.after = function (sec, fn) { G.timers.push({ t: sec, fn: fn }); };

  /* ================= Vòng & câu hỏi ================= */
  function beginRound() {
    var r = G.round;
    G.world = WORLDS[r % 4]; G.mode = 'main'; G.qi = 0; G.flushed = 0; G.roundWrong = 0; G.pickSpawned = 0; G.pickGot = 0;
    G.roundAsked = 0; G.bossDone = false; G.boss = null;
    G.lens = NM.charges(G.equip.lens);
    G.roundPlan = G.plan.rounds[r];
    G.scene = null; G.phase = 'intro'; G.canMove = false;
    G.p.y = groundY(); G.p.vy = 0; G.p.x = W / 2;
    G.banner = { text: 'Vòng ' + (r + 1) + ' · ' + G.world.name, t: 2.2 };
    hud();
    G.after(1.6, function () { advance('fade'); });
  }

  /* ================= Chế độ đấu: 1-1 (chuyền máy) và đấu với Bot ================= */
  function beginDuel() {
    G.world = WORLDS[0]; G.mode = 'duel'; G.qi = 0; G.roundWrong = 0; G.pickSpawned = 0; G.roundPlan = []; G.boss = null;
    G.lens = NM.charges(G.equip.lens);
    G.scene = null; G.phase = 'intro'; G.canMove = false; G.p.y = groundY(); G.p.vy = 0; G.p.x = W / 2;
    G.banner = { text: G.duel.vs === 'bot' ? '🤖 Đấu với Bot!' : '👫 Đấu 1–1!', t: 2.2 };
    hud();
    G.after(1.6, function () { advance('fade'); });
  }
  function curIdx() { return G.duel && G.duel.vs === 'duel' ? G.duel.turn : 0; }
  function duelAdvance(trKind) {
    var D = G.duel;
    if (D.k >= D.N) { duelEnd(); return; }
    var idx = D.vs === 'duel' ? D.k * 2 + D.turn : D.k, e = D.entries[idx];
    var q = NM.makeQ(e.item, e.form, { round: 0, diff: G.diff, pool: G.pool, boss: false });
    q.role = 'duel'; q.rev = null;
    var sc = buildScene(q, false);
    if (trKind === 'up' && G.scene) { G.trans = { u: 0, dur: 1.25, kind: 'up', from: G.scene, to: sc, px: G.p.x, py: G.p.y, rocket: false }; }
    else { G.trans = { u: 0, dur: 0.7, kind: 'fade', from: null, to: sc, swapped: false }; }
    G.phase = 'trans'; G.canMove = false;
  }
  function duelDone(ok, tr) {
    var D = G.duel;
    if (D.vs === 'bot') {
      var acc = { easy: 0.6, normal: 0.75, hard: 0.88 }[G.diff] || 0.7, tmax = { easy: 22, normal: 17, hard: 13 }[G.diff] || 17;
      var t = rnd(5, tmax), bok = Math.random() < acc, pts = bok ? 10 + (t <= CFG.FAST_SEC ? 5 : 0) : 0, b = D.players[1];
      b.score += pts; if (bok) b.ok++; b.time += t; D.k++;
      G.banner = { text: '🤖 Bot: ' + (bok ? '✅ +' + pts : '❌ sai') + ' (' + Math.round(t) + ' giây)', t: 1.8 };
      hud();
      G.after(1.7, function () { advance(tr); });
    } else if (D.turn === 0) {
      D.turn = 1; hud(); NM.ui.handoff(D.players[1].name, function () { advance('fade'); });
    } else {
      D.turn = 0; D.k++; hud();
      if (D.k >= D.N) duelEnd(); else NM.ui.handoff(D.players[0].name, function () { advance('fade'); });
    }
  }
  function duelEnd() {
    var D = G.duel, a = D.players[0], b = D.players[1];
    D.winner = a.score > b.score ? 0 : a.score < b.score ? 1 : (a.time < b.time ? 0 : a.time > b.time ? 1 : -1);
    if (D.vs === 'bot' || true) G.coins = D.winner === 0 ? 20 : D.winner === -1 ? 15 : 10;
    NM.sfx.win(); finish('duel');
  }

  function reviewDue() {
    for (var i = 0; i < G.reviewQ.length; i++) { var r = G.reviewQ[i]; if (!r.atEnd && r.due <= G.mainCount) return r; }
    return null;
  }
  function pickNext() {
    if (G.mode === 'boss') {
      if (G.boss.hp <= 0 || G.boss.turns >= CFG.BOSS_TURNS) return { kind: 'roundEnd' };
      G.boss.turns++;
      return { kind: 'boss' };
    }
    if (G.clock <= 0) G.forceBoss = true;
    if (!G.forceBoss) {
      var rv = reviewDue();
      if (rv) return { kind: 'review', rev: rv };
      if (G.qi < G.roundPlan.length) return { kind: 'main', entry: G.roundPlan[G.qi++] };
      if (G.reviewQ.length && G.flushed < 4) { G.flushed++; return { kind: 'review', rev: G.reviewQ[0] }; }
    }
    G.mode = 'boss'; G.boss = { hp: CFG.BOSS_HP, turns: 0, shake: 0, flash: 0, dead: 0 };
    G.canMove = false;
    G.banner = { text: '⚡ Quái Mây xuất hiện!', t: 1.8 };
    G.boss.turns = 1;
    return { kind: 'boss' };
  }
  function lowestAppear(avoidId) {
    var best = [], bv = 1e9;
    G.items.forEach(function (it) {
      if (it.id === avoidId) return;
      var v = G.appear[it.id] || 0;
      if (v < bv) { bv = v; best = [it]; } else if (v === bv) best.push(it);
    });
    return pick(best);
  }
  function advance(trKind) {
    if (G.over) return;
    if (G.duel) { duelAdvance(trKind); return; }
    var d = pickNext(), item, form, role = d.kind, q;
    if (d.kind === 'roundEnd') { endRound(); return; }
    var ctxq = { round: G.round, diff: G.diff, pool: G.pool, boss: d.kind === 'boss' };
    if (d.kind === 'main') { item = d.entry.item; form = d.entry.form; }
    else if (d.kind === 'review') {
      item = d.rev.item; d.rev.tries++;
      form = NM.pickForm(item, G.round, [], false, d.rev.lastForm); form = form === 'spell' || form === 'g_order' ? NM.pickForm(item, 0, [], false, d.rev.lastForm) : form;
    } else {
      item = lowestAppear(); form = NM.pickForm(item, G.round, [], true, null);
    }
    G.appear[item.id] = (G.appear[item.id] || 0) + 1;
    q = NM.makeQ(item, form, ctxq); q.role = role; q.rev = d.rev || null;
    if (d.rev) d.rev.lastForm = form;
    if (role === 'main' || role === 'review') G.roundAsked++;
    var sc = buildScene(q, role === 'boss');
    if (trKind === 'up' && G.scene) { G.trans = { u: 0, dur: 1.25, kind: 'up', from: G.scene, to: sc, px: G.p.x, py: G.p.y, rocket: G.combo >= 8 }; G.phase = 'trans'; G.canMove = false; }
    else { G.trans = { u: 0, dur: 0.7, kind: 'fade', from: null, to: sc, swapped: false }; G.phase = 'trans'; G.canMove = false; }
    G.pending = sc;
  }
  function startFloor(sc) {
    G.scene = sc; G.phase = 'ask'; G.canMove = true; G.trans = null;
    G.sel = null; G.selN = 0; G.pos = 0; G.qTime = 0; G.hintLevel = 0; G.lensOn = false; G.hintText = '';
    G.p.y = groundY(); G.p.vy = -VH; G.p.x = clamp(G.p.x, 22, W - 22); G.p.noLand = null; G.jumpBuf = 0; G.dropBuf = 0;
    G.croc = { x: rnd(60, W - 60), patrol: rnd(60, W - 60), dir: Math.random() < 0.5 ? -1 : 1, bite: 0, target: null, face: 1 };
    if (sc.q.auto) G.after(0.5, function () { NM.speak(sc.q.audio); });
    actbar(); hud();
  }

  /* ================= Dựng cảnh (bục, xu) ================= */
  function buildScene(q, boss) {
    var diff = G.diff, round = G.round, gy = groundY();
    var items = q.kind === 'order' ? shuffle(q.tokens.map(function (t) { return { label: t, tok: t, ok: false }; })) : shuffle(q.answers);
    var n = items.length;
    var yBot = gy - 97, yTop = boss ? 288 : 222;
    var step = n > 1 ? Math.min(100, (yBot - yTop) / (n - 1)) : 0;
    var tierOrder = shuffle(items.map(function (_, i) { return i; }));
    var spd = 0;
    if (diff === 'normal') spd = round >= 1 ? 24 : 0;
    if (diff === 'hard') spd = [26, 40, 52, 58][Math.min(round, 3)];
    if (q.kind === 'order') spd *= 0.6;
    var plats = [], side = Math.random() < 0.5 ? 0 : 1, colors = shuffle(PLAT_COLORS), lanes = shuffle([0, 1, 2]);
    items.forEach(function (a, i) {
      var tier = tierOrder[i], y = yBot - tier * step;
      var isPic = !!a.pic, long = !isPic && String(a.label).length > 14, w, h = 30;
      if (isPic) { w = 86; h = 54; } else if (long) { w = 140; h = 42; } else if (q.letters) w = 66; else if (q.kind === 'order') w = 84; else w = diff === 'easy' ? 124 : 110;
      var x;
      if (q.kind === 'order') {            // 3 làn: bục cùng làn cách nhau >= 3 tầng nên không chắn nhau
        var ln = lanes[tier % 3];
        x = ln === 0 ? w / 2 + 10 : ln === 2 ? W - w / 2 - 10 : W / 2;
        x += rnd(-6, 6);
      } else {                              // zig-zag trái / phải
        var sd = (tier + side) % 2, lo, hi;
        if (q.kind === 'order') { if (sd === 0) { lo = w / 2 + 8; hi = Math.max(lo, 176 - w / 2 - 4); } else { lo = Math.min(W - w / 2 - 8, 184 + w / 2 + 4); hi = W - w / 2 - 8; } }
        else if (sd === 0) { lo = w / 2 + 8; hi = Math.max(lo, 148 - w / 2); }      // cột giữa (x 148-212) dành cho thang gỗ
        else { lo = Math.min(W - w / 2 - 8, 212 + w / 2); hi = W - w / 2 - 8; }
        x = rnd(lo, Math.max(lo, hi));
      }
      plats.push({ kind: 'ans', x: x, y: y, w: w, h: h, label: String(a.label), pic: a.pic || null, ok: !!a.ok, ref: a.ref || null, tok: a.tok,
        col: colors[i % colors.length], vx: spd ? (Math.random() < 0.5 ? -1 : 1) * spd * rnd(0.8, 1.1) : 0, glow: 0, used: false, broken: 0, shake: 0, spring: 0, sel: 0 });
    });
    var coins = [];
    var ansP = plats.slice(), ladder = q.kind === 'pick' && !ansP.some(function (a) { return a.w > 150; });
    if (ladder) {   // THANG GỖ ở giữa: bé đứng yên ở giữa vẫn leo lên được, không cần đạp lên bục đáp án để lấy đà
      var ys = [gy - 66];
      for (var lt = 0; lt < n - 1; lt++) ys.push(yBot - lt * step - step / 2);
      ys.forEach(function (yy2, li) {
        if (li > 0 && diff === 'hard' && Math.random() < 0.15) return;
        var lp = { kind: 'reg', x: W / 2 + rnd(-6, 6), y: yy2, w: 74, h: 14, col: '#c9a66b', vx: 0, vanish: diff === 'hard' && round >= 3, gone: 0, hit: 0, glow: 0 };
        plats.push(lp);
        if (G.pickSpawned < CFG.PICK_CAP && Math.random() < 0.25) { G.pickSpawned++; coins.push({ x: lp.x, y: lp.y - 28, got: false, ph: rnd(0, 6), follow: lp }); }
      });
    } else if (step >= 40) {
      for (var t = 0; t < n - 1; t++) {
        if (Math.random() < (diff === 'hard' ? 0.7 : 0.95)) {
          var yy = yBot - t * step - step / 2, rx = null;
          for (var k = 0; k < 20 && rx === null; k++) {   // bục thường không được nằm ngay trên bục đáp án (sẽ cản việc đứng yên 2 nảy)
            var cx = rnd(40, W - 40), okx = true;
            ansP.forEach(function (ap) { if (ap.y > yy && ap.y - yy < 150 && Math.abs(ap.x - cx) < ap.w / 2 + 29 + 16) okx = false; });
            if (okx) rx = cx;
          }
          if (rx === null) continue;
          var rp = { kind: 'reg', x: rx, y: yy, w: 58, h: 14, col: '#c9a66b', vx: 0, vanish: diff === 'hard' && round >= 3, gone: 0, hit: 0, glow: 0 };
          plats.push(rp);
          if (G.pickSpawned < CFG.PICK_CAP && Math.random() < 0.6) { G.pickSpawned++; coins.push({ x: rp.x, y: rp.y - 26, got: false, ph: rnd(0, 6), follow: rp }); }
        }
      }
    }
    if (!G.duel) spawnPickups(plats, coins, yTop, gy);
    plats.push({ kind: 'ground', x: W / 2, y: gy, w: W + 40, h: 60 });
    return { q: q, plats: plats, coins: coins, boss: boss, n: n };
  }

  /* ====== Vật phẩm nhặt: xu theo vòng cung, sao (+điểm), kim cương (+5 xu), tim (+1 tim) ====== */
  function freeSpot(plats, x, y) {
    for (var i = 0; i < plats.length; i++) {
      var p = plats[i]; if (p.kind !== 'ans') continue;
      if (Math.abs(x - p.x) < p.w / 2 + 14 && y > p.y - 34 && y < p.y + p.h + 14) return false;
    }
    return x > 16 && x < W - 16;
  }
  function spawnPickups(plats, coins, yTop, gy) {
    var tries = 0, made = 0;
    while (made < 2 && tries++ < 30 && G.pickSpawned < CFG.PICK_CAP - 3) {
      if (made === 1 && Math.random() > 0.25) break;     // luôn có 1 hàng xu, thỉnh thoảng có hàng thứ 2
      var n = ri(3, 5), x0 = rnd(30, W - 30 - n * 24), yb = rnd(yTop - 10, gy - 70), arc = rnd(12, 26), ok = true, pts = [];
      for (var k = 0; k < n; k++) {
        var px = x0 + k * 24, py = yb - Math.sin(k / (n - 1) * Math.PI) * arc;
        if (!freeSpot(plats, px, py)) { ok = false; break; }
        pts.push([px, py]);
      }
      if (!ok) continue;
      pts.forEach(function (q) { coins.push({ x: q[0], y: q[1], got: false, ph: rnd(0, 6), type: 'coin' }); });
      G.pickSpawned += n; made++;
    }
    function special(type, prob) {
      if (Math.random() > prob) return;
      for (var t2 = 0; t2 < 20; t2++) { var sx = rnd(34, W - 34), sy = rnd(yTop - 20, gy - 90); if (freeSpot(plats, sx, sy)) { coins.push({ x: sx, y: sy, got: false, ph: rnd(0, 6), type: type }); return; } }
    }
    special('star', 0.55); special('gem', 0.3);
    if (G.hearts < 3) special('heart', 0.25);
  }

  /* ================= Cập nhật ================= */
  function update(dt) {
    G.t += dt;
    var i;
    for (i = G.timers.length - 1; i >= 0; i--) { G.timers[i].t -= dt; if (G.timers[i].t <= 0) { var f = G.timers[i].fn; G.timers.splice(i, 1); f(); } }
    if (G.banner) { G.banner.t -= dt; if (G.banner.t <= 0) G.banner = null; }
    if (G.shake > 0) G.shake -= dt;
    // đồng hồ ván (chạy cả khi hỏi bóng cứu hộ / giải thích)
    if (G.phase !== 'intro' && G.clock > 0 && !G.duel) { G.clock -= dt; if (G.clock <= 0) { G.clock = 0; G.forceBoss = true; } hudClock(); }
    updateParticles(dt);
    if (G.boss) { if (G.boss.shake > 0) G.boss.shake -= dt; if (G.boss.flash > 0) G.boss.flash -= dt; if (G.boss.dead > 0) G.boss.dead -= dt; }
    if (G.phase === 'ask') updateAsk(dt);
    else if (G.phase === 'celebrate') { updatePlatforms(dt, true); }
    else if (G.phase === 'fb') { updatePlatforms(dt, true); var fp = G.p; fp.vy += CFG.GRAV * dt; fp.y = Math.min(groundY(), fp.y + fp.vy * dt); if (fp.y >= groundY()) { fp.vy = 0; } }
    else if (G.phase === 'trans') updateTrans(dt);
    else if (G.phase === 'bossHit') updateBossHit(dt);
    else if (G.phase === 'fall') { var p = G.p; p.vy += CFG.GRAV * dt; p.y += p.vy * dt; }
  }

  function updatePlatforms(dt, still) {
    var sc = G.scene; if (!sc) return;
    sc.plats.forEach(function (pl) {
      if (pl.kind === 'ground') return;
      if (pl.glow > 0) pl.glow -= dt * 0.8;
      if (pl.shake > 0) pl.shake -= dt;
      if (pl.spring > 0) pl.spring -= dt;
      if (pl.broken > 0 && pl.broken < 1) pl.broken = Math.min(1, pl.broken + dt * 2.5);
      if (pl.gone > 0 && pl.gone < 1) pl.gone = Math.min(1, pl.gone + dt * 3);
      if (pl.hit > 0) { pl.hit -= dt; if (pl.hit <= 0 && pl.vanish) pl.gone = 0.01; }
      if (!still && pl.vx) {
        pl.x += pl.vx * dt;
        var lo = pl.w / 2 + 4, hi = W - pl.w / 2 - 4;
        if (pl.x < lo) { pl.x = lo; pl.vx = Math.abs(pl.vx); } else if (pl.x > hi) { pl.x = hi; pl.vx = -Math.abs(pl.vx); }
      }
    });
    sc.coins.forEach(function (c) { if (c.follow) { c.x = c.follow.x; } });
  }

  function cloudDur() { return CFG.CLOUD[G.diff] * G.slow; }
  function cloudY() { return (H + 160) - ((H + 160) - 170) * Math.min(1, G.qTime / cloudDur()); }

  function updateCroc(dt) {
    var c = G.croc, sc = G.scene; if (!c || !sc) return;
    var wy = cloudY();
    if (c.burp > 0) c.burp -= dt;
    if (c.bite > 0) { c.bite -= dt; if (c.bite <= 0) c.burp = 0.8; }
    if (!c.target || c.target.eaten) {
      c.target = null; var best = null;
      sc.plats.forEach(function (pl) { if (pl.kind === 'reg' && !pl.eaten && pl.gone < 1 && pl.y > wy - 170) { if (!best || pl.y > best.y) best = pl; } });
      c.target = best;
    }
    var tx;
    if (c.target) tx = c.target.x; else { c.patrol += c.dir * 38 * dt; if (c.patrol < 40) c.dir = 1; if (c.patrol > W - 40) c.dir = -1; tx = c.patrol; }
    var d = tx - c.x, sp = c.target ? 200 : 38;
    if (Math.abs(d) > 2) { c.x += clamp(d, -sp * dt, sp * dt); c.face = d >= 0 ? 1 : -1; }
    else if (c.target && c.bite <= 0 && c.target.y > wy - 30) {      // GẠP! cá sấu cắn mất thanh gỗ
      c.bite = 0.5; c.target.eaten = true; c.target.gone = 0.01;
      NM.sfx.chomp(); burst(c.target.x, c.target.y, '#c9a66b', 14); floatText('GẠP!', c.target.x, c.target.y - 22, '#2b8a3e', 20); c.target = null;
    }
  }

  function updateAsk(dt) {
    var p = G.p, sc = G.scene;
    G.qTime += dt;
    if (keys.l || keys.r) movePlayer((keys.r - keys.l) * 250 * dt);
    updatePlatforms(dt, false);
    if (G.jumpBuf > 0) G.jumpBuf -= dt;
    if (G.dropBuf > 0) G.dropBuf -= dt;
    var prev = p.y;
    p.vy += CFG.GRAV * dt; p.y += p.vy * dt;
    if (p.noLand && p.y > p.noLand.y + 14) p.noLand = null;
    if (p.squash > 0) p.squash -= dt * 5;
    if (p.vy > 0) {
      var hit = null;
      sc.plats.forEach(function (pl) {
        if (pl.broken || pl.gone >= 1 || pl.eaten || pl === p.noLand) return;
        if (prev <= pl.y + 3 && p.y >= pl.y && Math.abs(p.x - pl.x) < pl.w / 2 + 9) { if (!hit || pl.y < hit.y) hit = pl; }
      });
      if (hit) land(hit);
    }
    // nhặt vật phẩm
    sc.coins.forEach(function (c) {
      if (c.got) return;
      var dx = c.x - p.x, dy = c.y - (p.y - 20);
      if (dx * dx + dy * dy >= 30 * 30) return;
      c.got = true; G.pickGot++;
      var ty = c.type || 'coin';
      if (ty === 'coin') {
        addCoins(1); NM.sfx.coin(); burst(c.x, c.y, '#ffd34d', 6); floatText('+1', c.x, c.y - 10, '#b7791f');
        if (G.t - (G.lastCoinT || -9) < 1.3) G.coinStreak = (G.coinStreak || 1) + 1; else G.coinStreak = 1;
        G.lastCoinT = G.t;
        if (G.coinStreak % 5 === 0) { addCoins(2); floatText('Mưa xu! +2', W / 2, 200, '#e8590c', 22); burst(c.x, c.y, '#ffe066', 16); }
      } else if (ty === 'star') { G.score += 5; NM.sfx.step(); burst(c.x, c.y, '#fff3a0', 12); floatText('+5 điểm', c.x, c.y - 12, '#e67700', 18); }
      else if (ty === 'gem') { addCoins(5); NM.sfx.correct(); burst(c.x, c.y, '#74d7ff', 18); floatText('+5 xu!', c.x, c.y - 12, '#1c7ed6', 20); }
      else if (ty === 'heart') {
        if (G.hearts < 3) { G.hearts++; floatText('+1 tim!', c.x, c.y - 12, '#e03131', 20); } else { addCoins(3); floatText('+3 xu', c.x, c.y - 12, '#b7791f', 18); }
        NM.sfx.win(); burst(c.x, c.y, '#ff8fa3', 16);
      }
      hud();
    });
    updateCroc(dt);
    // nước dâng chạm chân
    if (G.phase === 'ask' && p.y > cloudY() + 12) { cloudHit(); }
  }

  function land(pl) {
    var p = G.p;
    if (G.dropBuf > 0 && pl.kind !== 'ground') {           // vuốt xuống: rơi xuyên bục xuống tầng dưới
      G.dropBuf = 0; p.noLand = pl; p.y = pl.y; p.vy = 180; G.sel = null; G.selN = 0; return;
    }
    var big = G.jumpBuf > 0; if (big) G.jumpBuf = 0;
    p.y = pl.y; p.vy = -(big ? V0 : VH); p.squash = 1;
    if (NM._ev) NM._ev.push('land ' + pl.kind + ':' + (pl.label || '') + (pl.ok ? '*' : '') + ' x=' + Math.round(p.x) + ' y=' + Math.round(pl.y));
    if (pl.kind === 'ans' && !pl.used) NM.sfx.land();
    if (pl.kind === 'ans' && !pl.used) {
      if (G.sel === pl) G.selN++; else { G.sel = pl; G.selN = 1; NM.sfx.select(); }
      pl.glow = 1; pl.sel = G.selN; pl.shake = 0.15;
      if (G.selN >= CFG.CONFIRM[G.diff]) { confirm(pl); }
    } else {
      G.sel = null; G.selN = 0;
      if (pl.kind === 'reg' && pl.vanish && !pl.hit) pl.hit = 0.25;
    }
  }

  function confirm(pl) {
    var q = G.scene.q;
    G.sel = null; G.selN = 0;
    if (q.kind === 'order') {
      if (pl.tok === q.tokens[G.pos]) {
        pl.used = true; pl.sel = 0; G.pos++; NM.sfx.step(); burst(pl.x, pl.y, '#7be08a', 8);
        if (G.pos >= q.tokens.length) correct(pl);
      } else wrong(pl, false);
    } else {
      if (pl.ok) correct(pl); else wrong(pl, false);
    }
  }

  function cloudHit() {
    G.shake = 0.35; NM.sfx.hit();
    if (G.croc) { G.croc.x = G.p.x; G.croc.bite = 0.7; NM.sfx.chomp(); }
    wrong(null, true);
  }

  /* ================= Đúng ================= */
  function addCoins(n) {
    var before = G.coins;
    G.coins = Math.min(CFG.COIN_CAP, G.coins + n);
    if (G.coins >= CFG.COIN_CAP && before < CFG.COIN_CAP && !G.capShown) { G.capShown = true; G.banner = { text: '🪙 Đủ 300 xu của ván này! Em cứ chơi tiếp lấy điểm nhé', t: 3 }; }
  }
  function mastered(item) { var w = NM.profile().words[item.id]; return w && w.s >= 3; }

  function correct(pl) {
    var q = G.scene.q, item = q.item;
    G.phase = 'celebrate'; G.canMove = false;
    var fast = G.qTime <= CFG.FAST_SEC && G.hintLevel === 0;
    G.combo++; G.bestCombo = Math.max(G.bestCombo, G.combo);
    var duel = G.duel, ci = curIdx(), mine = ci === 0;
    var mult = duel ? 1 : G.combo >= 8 ? 4 : G.combo >= 5 ? 3 : G.combo >= 3 ? 2 : 1;
    var base = Math.max(4, 10 - 2 * G.hintLevel);
    var pts = base * mult + (fast ? 5 : 0);
    if (mine) G.score += pts;
    if (duel) { var pp = duel.players[ci]; pp.score += pts; pp.ok++; pp.time += G.qTime; }
    var halve = mastered(item) ? 0.5 : 1, coin = 0;
    if (q.role === 'main') { coin = (1 + (fast ? 1 : 0)) * halve; }
    if (q.role === 'review') { coin = 2; G.stats.fixed++; G.fixedList.push(item.id); removeReview(q.rev); }
    if (coin) addCoins(coin);
    if (mine) {
      G.stats.correct++;
      if (G.itemOk[item.id] === undefined) G.itemOk[item.id] = true;
      var prof = NM.profile(); var ws = prof.words[item.id] = prof.words[item.id] || { s: 0, n: 0, w: 0 }; ws.n++;
      NM.logQ({ id: item.id, form: q.form, ok: 1, ms: Math.round(G.qTime * 1000), rep: q.rev ? q.rev.tries : 0, hint: G.hintLevel, role: q.role });
    }
    NM.sfx.correct();
    pl.glow = 1.5; pl.spring = 0.5; pl.ok = true;
    burst(pl.x, pl.y - 10, '#ffe066', 22); burst(pl.x, pl.y - 10, '#7be08a', 12);
    floatText('+' + pts, G.p.x, G.p.y - 50, '#e8590c', 22);
    if (mult > 1 && (G.combo === 3 || G.combo === 5 || G.combo === 8)) floatText('Combo ×' + mult + '!', W / 2, 190, '#d6336c', 26);
    if (q.role === 'review') floatText('Đã sửa! +2 🪙', W / 2, 215, '#2b8a3e', 20);
    if (q.role === 'main') G.mainCount++;
    hud();
    G.after(0.5, function () {
      if (G.duel) duelDone(true, 'up'); else if (G.mode === 'boss') bossStrike(); else advance('up');
    });
  }
  function removeReview(r) { if (!r) return; var i = G.reviewQ.indexOf(r); if (i >= 0) G.reviewQ.splice(i, 1); }

  /* ================= Sai / hết giờ ================= */
  function wrong(pl, timeout) {
    var q = G.scene.q, item = q.item;
    G.phase = 'fb'; G.canMove = false;
    var duel = G.duel, ci = curIdx(), mine = ci === 0;
    G.combo = 0; G.roundWrong++;
    if (mine) { G.stats.wrong++; G.itemOk[item.id] = false; }
    if (duel) duel.players[ci].time += G.qTime;
    var pa = pl && q.kind === 'pick' ? pl : (pl && q.kind === 'order' ? { label: pl.label } : null);
    var absorbed = false;
    if (!duel) { if (G.shield > 0) { G.shield--; absorbed = true; } else G.hearts--; }
    if (pl) { pl.broken = 0.01; burst(pl.x, pl.y, pl.col || '#999', 16); G.shake = 0.25; }
    G.scene.plats.forEach(function (o) { if (o.kind === 'ans' && o.ok && q.kind === 'pick') o.glow = 2; });
    NM.sfx.wrong();
    if (mine) {
      var prof = NM.profile(); var ws = prof.words[item.id] = prof.words[item.id] || { s: 0, n: 0, w: 0 }; ws.n++; ws.w++;
      NM.logQ({ id: item.id, form: q.form, ok: 0, ms: Math.round(G.qTime * 1000), rep: q.rev ? q.rev.tries : 0, hint: G.hintLevel, role: q.role, to: timeout ? 1 : 0 });
      var wm = G.wrongMap[item.id] = G.wrongMap[item.id] || { item: item, n: 0 }; wm.n++;
    }
    // hàng chờ ôn
    if (duel) { /* chế độ đấu: không có hàng chờ ôn */ }
    else if (q.role === 'review') {
      var r = q.rev;
      if (r.tries >= 2) { removeReview(r); toFix(item); } else { r.atEnd = true; r.due = 1e9; }
    } else if (q.role === 'main' || q.role === 'boss') {
      var ex = G.reviewQ.filter(function (x) { return x.item === item; })[0];
      if (!ex) G.reviewQ.push({ item: item, tries: 0, due: G.mainCount + (q.role === 'main' ? 6 : 5), atEnd: false, lastForm: q.form });
    }
    if (q.role === 'main') G.mainCount++;
    var text = q.explain(pa ? (q.kind === 'order' ? { label: pl.label } : pa) : null, G.pos);
    hud();
    G.after(0.7, function () {
      NM.ui.feedback({ timeout: timeout, text: text, item: item, q: q, absorbed: absorbed, hearts: G.hearts, duel: !!duel }, function () {
        if (duel) duelDone(false, 'fade');
        else if (G.hearts <= 0) rescueOrOver();
        else if (G.mode === 'boss') { bossAfterWrong(); } else advance('fade');
      }, CFG.EXPLAIN_MIN);
    });
  }
  function toFix(item) {
    if (G.fixList.indexOf(item.id) < 0) G.fixList.push(item.id);
  }
  function bossAfterWrong() { advance('fade'); }

  /* ================= Hết tim: bóng cứu hộ ================= */
  function rescueOrOver() {
    G.phase = 'fall'; G.canMove = false; G.p.vy = -200;
    G.after(1.1, function () {
      if (G.rescueUsed[G.round]) { gameOver('Hết tim'); return; }
      var failedId = G.scene.q.item.id;
      var cand = shuffle(G.items.filter(function (i) { return i.id !== failedId; }));
      var two = cand.slice(0, 2);
      G.inQuiz = true;
      NM.ui.quiz({ items: two, mode: 'must', title: '🛟 Bóng cứu hộ: trả lời đúng cả 2 câu để hồi 1 tim', onDone: function (res) {
        G.inQuiz = false;
        if (res.ok) {
          G.rescueUsed[G.round] = true; G.hearts = 1; hud();
          NM.sfx.win(); G.p.y = groundY(); G.p.vy = 0;
          if (G.mode === 'boss') bossAfterWrong(); else advance('fade');
        } else {
          res.failed.forEach(toFix);
          gameOver('Hết tim');
        }
      } });
    });
  }

  /* ================= Boss ================= */
  function bossStrike() {
    var b = G.boss, p = G.p;
    G.phase = 'bossHit'; G.bh = { u: 0, x0: p.x, y0: p.y };
  }
  function updateBossHit(dt) {
    var h = G.bh, p = G.p; h.u += dt / 0.7;
    var bx = W / 2, by = 232;
    if (h.u < 1) {
      var u = h.u;
      p.x = h.x0 + (bx - h.x0) * u; p.y = h.y0 + (by - h.y0) * u - Math.sin(u * Math.PI) * 70; p.vy = -100;
    } else if (!h.hitDone) {
      h.hitDone = true;
      var b = G.boss; b.hp--; b.shake = 0.6; b.flash = 0.4; G.shake = 0.3; NM.sfx.hit();
      burst(bx, by - 30, '#fff', 18); burst(bx, by - 30, '#ffd34d', 10);
      floatText('-1 ❤', bx, 190, '#e03131', 24);
      if (b.hp <= 0) { b.dead = 1.2; NM.sfx.win(); burst(bx, 200, '#ffd34d', 40); G.after(1.5, function () { G.phase = 'idle'; advance('fade'); }); }
      else { p.vy = 150; G.after(0.8, function () { advance('fade'); }); }
    }
    if (h.hitDone && h.u >= 1) { p.vy += CFG.GRAV * dt; p.y += p.vy * dt; if (p.y > groundY()) { p.y = groundY(); p.vy = 0; } }
  }

  /* ================= Hết vòng ================= */
  function endRound() {
    G.phase = 'idle'; G.canMove = false;
    var b = G.boss, beaten = b && b.hp <= 0, info = { round: G.round, lines: [], total: 0 };
    var add = function (txt, n) { info.lines.push([txt, n]); info.total += n; addCoins(n); };
    add('Hoàn thành vòng', 10);
    if (G.roundWrong === 0) add('Vòng hoàn hảo ⭐', 10);
    if (beaten) { add('Hạ Quái Mây ☁️', 10); G.stats.boss++; G.hearts = Math.min(3, G.hearts + 1); }
    var gifts = [5, 8, 12, 15], g = gifts[Math.min(G.round, 3)];
    if (G.round === 3) { G.shield++; info.lines.push(['Hộp quà: Khiên mây +1 🛡️', 0]); }
    add('Hộp quà 🎁', g);
    info.beaten = beaten; info.fled = !beaten; info.timeUp = G.forceBoss && G.clock <= 0;
    G.mode = 'main'; G.boss = null;
    var last = (G.round >= G.R - 1) || info.timeUp;
    if (!info.timeUp) { var prof = NM.profile(); prof.progress[G.key] = { round: Math.min(G.round + 1, G.R - 1), at: Date.now() }; NM.save(); }
    hud();
    NM.ui.roundResult(info, last, function () {
      if (last) { finish(info.timeUp && G.round < G.R - 1 ? 'timeup' : 'win'); return; }
      G.round++; beginRound();
    });
  }

  /* ================= Kết thúc ================= */
  function gameOver(reason) {
    G.over = true; NM.sfx.lose();
    finish('lose', reason);
  }
  function finish(kind, reason) {
    G.over = true; G.active = false; G.paused = true;
    var prof = NM.profile();
    Object.keys(G.itemOk).forEach(function (id) {
      var w = prof.words[id] = prof.words[id] || { s: 0, n: 0, w: 0 };
      w.s = G.itemOk[id] ? w.s + 1 : 0;
    });
    prof.fix = prof.fix.filter(function (id) { return G.fixedList.indexOf(id) < 0; });
    G.fixList.forEach(function (id) { if (prof.fix.indexOf(id) < 0) prof.fix.push(id); });
    var earned = Math.floor(G.coins);
    prof.coins += earned; prof.games++; prof.hi = Math.max(prof.hi || 0, G.score);
    if (G.duel) { /* đấu: không lưu tiến độ vòng */ }
    else if (kind === 'win') delete prof.progress[G.key];
    else if (kind === 'lose' || kind === 'quit' || kind === 'timeup') prof.progress[G.key] = { round: G.round, at: Date.now() };
    NM.save();
    var res = { kind: kind, reason: reason, score: G.score, coins: earned, stats: G.stats, bestCombo: G.bestCombo, round: G.round, R: G.R,
      wrong: Object.keys(G.wrongMap).map(function (k) { return G.wrongMap[k]; }), fix: G.fixList.slice(), secs: Math.round((Date.now() - G.startedAt) / 1000), sets: G.sets, diff: G.diff, duel: G.duel };
    NM.bridge.report({ student: NM.db.cur, mode: G.duel ? G.duel.vs : 'solo', opponent: G.duel ? G.duel.players[1].name : null, opponentScore: G.duel ? G.duel.players[1].score : null, score: G.score, coins: earned, correct: G.stats.correct, wrong: G.stats.wrong, seconds: res.secs, level: G.diff, sets: G.sets, result: kind });
    NM.ui.summary(res);
  }
  NM.quitGame = function () { if (G.active) finish('quit'); };

  /* ================= Tạm dừng, gợi ý, kính ================= */
  NM.togglePause = function (force) {
    if (!G.active) return;
    if (G.paused && !force) { G.paused = false; NM.ui.closeModal(); return; }
    if (G.paused) return;
    G.paused = true; NM.ui.pause();
    try { if (NM.canSpeak) speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ }
  };
  NM.hint = function () {
    var q = G.scene && G.scene.q;
    if (G.phase !== 'ask' || !q || !q.hint || G.hintLevel >= 3) return;
    G.hintLevel++; G.hintText = NM.hintMask(q.hint, G.hintLevel); NM.sfx.click(); actbar();
  };
  NM.lens = function () {
    var q = G.scene && G.scene.q;
    if (G.phase !== 'ask' || !q || G.lens <= 0 || G.lensOn || q.pic || q.item.type !== 'v') return;
    G.lens--; G.lensOn = true; NM.sfx.click(); actbar();
  };
  NM.replay = function () { var q = G.scene && G.scene.q; if (q && q.audio) NM.speak(q.audio); };
  NM.toggleMute = function () { NM.db.settings.mute = !NM.db.settings.mute; NM.save(); hud(); };

  /* ================= HUD (DOM) ================= */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function hudClock() {
    var el = $('#hClock'); if (!el) return;
    var s = Math.ceil(G.clock), txt = '⏱ ' + Math.floor(s / 60) + ':' + pad(s % 60);
    if (el.textContent !== txt) el.textContent = txt;
    el.className = G.clock < 60 ? 'warn' : '';
  }
  function hud() {
    if (G.duel) {
      var D = G.duel, ci = curIdx(), nm = function (s) { return NM.esc(String(s).slice(0, 9)); };
      $('#hHearts').innerHTML = '<span class="duel"><b' + (ci === 0 ? ' class="on"' : '') + '>' + nm(D.players[0].name) + ' ' + D.players[0].score + '</b><i>⚔</i><b' + (ci === 1 ? ' class="on"' : '') + '>' + D.players[1].score + ' ' + nm(D.players[1].name) + '</b></span>';
      $('#hScore').innerHTML = NM.icoHTML('star', 16) + ' ' + D.players[ci].score; $('#hCoin').style.display = 'none';
      $('#hRound').textContent = 'Câu ' + Math.min(D.k + 1, D.N) + '/' + D.N + ' · Lượt: ' + D.players[ci].name;
      $('#hClock').textContent = ''; $('#bMute').innerHTML = NM.db.settings.mute ? '🔇' : NM.icoHTML('speaker', 20);
      return;
    }
    $('#hCoin').style.display = '';
    var hs = ''; for (var i = 0; i < 3; i++) hs += '<span class="' + (i < G.hearts ? 'hf' : 'he') + '">' + NM.icoHTML(i < G.hearts ? 'heart' : 'broken', 20) + '</span>';
    if (G.shield > 0) hs += '<span class="sh">' + NM.icoHTML('shield', 16) + G.shield + '</span>';
    $('#hHearts').innerHTML = hs;
    $('#hScore').innerHTML = NM.icoHTML('star', 16) + ' ' + G.score;
    $('#hCoin').innerHTML = NM.icoHTML('coin', 16) + ' ' + Math.floor(G.coins);
    var lab = 'Vòng ' + (G.round + 1) + (G.mode === 'boss' ? ' · Boss ' + (G.boss ? Math.max(0, G.boss.turns) + '/' + CFG.BOSS_TURNS : '') : ' · Câu ' + Math.min(G.qi, G.roundPlan ? G.roundPlan.length : 0) + '/' + (G.roundPlan ? G.roundPlan.length : 0));
    if (G.combo >= 2) lab += ' · 🔥×' + G.combo;
    $('#hRound').textContent = lab;
    $('#bMute').innerHTML = NM.db.settings.mute ? '🔇' : NM.icoHTML('speaker', 20);
    hudClock();
  }
  function actbar() {
    var q = G.scene && G.scene.q, bar = $('#actbar');
    if (!q) { bar.innerHTML = ''; return; }
    var h = '<button class="mv" data-a="drop" aria-label="Rơi xuống">⬇</button><div class="mid">';
    if (q.audio && NM.canSpeak) h += '<button data-a="replay">' + NM.icoHTML('speaker', 18) + ' Nghe</button>';
    if (q.hint) h += '<button data-a="hint"' + (G.hintLevel >= 3 ? ' disabled' : '') + '>' + NM.icoHTML('bulb', 18) + ' ' + G.hintLevel + '/3</button>';
    if (G.equip.lens > 0 && !q.pic && q.item.type === 'v') h += '<button data-a="lens"' + (G.lens <= 0 || G.lensOn ? ' disabled' : '') + '>' + NM.icoHTML('lens', 18) + ' ' + G.lens + '</button>';
    h += '</div><button class="mv" data-a="jump" aria-label="Nhảy cao">⬆</button>';
    bar.innerHTML = h;
  }
  NM.hudRefresh = hud;

  /* ================= Hạt & chữ bay ================= */
  function burst(x, y, col, n) {
    if (NM.db.settings.reduce) n = Math.ceil(n / 3);
    for (var i = 0; i < n; i++) { var a = rnd(0, 6.28), s = rnd(60, 220); G.particles.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 90, life: rnd(0.5, 1.0), t: 0, col: col, r: rnd(2, 5) }); }
  }
  function floatText(txt, x, y, col, size) { G.particles.push({ x: x, y: y, vx: 0, vy: -40, life: 1.3, t: 0, txt: txt, col: col, size: size || 16 }); }
  function updateParticles(dt) {
    var ps = G.particles;
    for (var i = ps.length - 1; i >= 0; i--) {
      var p = ps[i]; p.t += dt;
      if (p.t >= p.life) { ps.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; if (!p.txt) p.vy += 500 * dt;
    }
  }

  /* ================= Chuyển cảnh ================= */
  function updateTrans(dt) {
    var tr = G.trans, p = G.p; tr.u += dt / tr.dur;
    if (tr.kind === 'fade') {
      if (tr.u >= 0.5 && !tr.swapped) { tr.swapped = true; G.scene = tr.to; G.p.y = groundY(); G.p.vy = 0; G.p.x = clamp(G.p.x, 22, W - 22); }
      if (tr.u >= 1) { startFloor(tr.to); }
    } else {
      var u = clamp(tr.u, 0, 1);
      if (u < 0.4) { var k = u / 0.4; p.y = tr.py - (tr.py + 70) * k * k; }
      else { var m = (u - 0.4) / 0.6; p.y = -70 + (groundY() + 70) * m * m; p.x = tr.px; }
      if (tr.u >= 1) { p.y = groundY(); startFloor(tr.to); }
    }
  }

  /* ================= Vẽ ================= */
  function rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  var FONT = '"Baloo 2","Nunito","Segoe UI",system-ui,sans-serif';
  function font(sz, wt) { return (wt || 800) + ' ' + sz + 'px ' + FONT; }

  function drawBG(off) {
    var bgim = NM.ART.bgs[(G.round || 0) % 4];
    if (G.duel) bgim = NM.ART.bgs[0];
    if (bgim && bgim.ok) {   // nền vẽ sẵn: phủ kín, neo phía dưới, dịch nhẹ khi chuyển tầng
      var k = Math.max(W / bgim.naturalWidth, H * 1.08 / bgim.naturalHeight), dw = bgim.naturalWidth * k, dh = bgim.naturalHeight * k;
      ctx.drawImage(bgim, (W - dw) / 2, H - dh + Math.min(off * 0.1, dh - H), dw, dh);
      return;
    }
    var w = G.world || WORLDS[0], gr = ctx.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, w.sky[0]); gr.addColorStop(1, w.sky[1]);
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    var wi = (G.round || 0) % 4, t = G.t || 0;
    if (wi === 3) {
      ctx.fillStyle = '#fff';
      for (var i = 0; i < 40; i++) { var sx = (i * 97) % W, sy = ((i * 53 + off * 0.3) % H + H) % H, tw = 0.5 + 0.5 * Math.sin(t * 2 + i); ctx.globalAlpha = 0.3 + 0.7 * tw; ctx.fillRect(sx, sy, 2, 2); }
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#ff9f43'; ctx.beginPath(); ctx.arc(290, 120 + off * 0.2, 26, 0, 7); ctx.fill();
      ctx.fillStyle = '#ffc078'; ctx.beginPath(); ctx.arc(282, 114 + off * 0.2, 7, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(290, 120 + off * 0.2, 42, 9, -0.3, 0, 7); ctx.stroke();
      ctx.fillStyle = '#74c0fc'; ctx.beginPath(); ctx.arc(60, 330 + off * 0.2, 14, 0, 7); ctx.fill();
    } else {
      ctx.fillStyle = wi === 0 ? '#ffe066' : 'rgba(255,255,255,.85)';
      if (wi !== 2) { ctx.beginPath(); ctx.arc(300, 110 + off * 0.2, 28, 0, 7); ctx.fill(); }
      for (var c = 0; c < 4; c++) {
        var cx = ((c * 130 + t * (6 + c * 2)) % (W + 120)) - 60, cy = 120 + c * 110 + off * (0.15 + c * 0.05);
        cy = ((cy % (H + 60)) + H + 60) % (H + 60) - 30;
        ctx.fillStyle = 'rgba(255,255,255,.75)';
        ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 7); ctx.arc(cx + 18, cy - 8, 20, 0, 7); ctx.arc(cx + 40, cy, 15, 0, 7); ctx.fill();
      }
      var gy = groundY() + off;
      if (wi === 0) { ctx.fillStyle = '#9be37f'; ctx.beginPath(); ctx.moveTo(0, gy); ctx.quadraticCurveTo(90, gy - 70, 190, gy); ctx.quadraticCurveTo(280, gy - 50, W, gy); ctx.lineTo(W, gy + 5); ctx.lineTo(0, gy + 5); ctx.fill(); }
      if (wi === 1) { ctx.fillStyle = '#ff8fc7'; for (var m = 0; m < 4; m++) { var mx = 30 + m * 100; ctx.fillRect(mx - 4, gy - 50, 8, 50); ctx.beginPath(); ctx.arc(mx, gy - 54, 26, Math.PI, 0); ctx.fill(); } }
      if (wi === 2) { ctx.fillStyle = '#a5c8e8'; ctx.beginPath(); ctx.moveTo(-20, gy); ctx.lineTo(80, gy - 150); ctx.lineTo(180, gy); ctx.fill(); ctx.beginPath(); ctx.moveTo(120, gy); ctx.lineTo(250, gy - 190); ctx.lineTo(380, gy); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(250, gy - 190); ctx.lineTo(222, gy - 145); ctx.lineTo(278, gy - 145); ctx.fill(); ctx.beginPath(); ctx.moveTo(80, gy - 150); ctx.lineTo(58, gy - 115); ctx.lineTo(102, gy - 115); ctx.fill(); }
    }
  }

  function wrapText(txt, maxW, sz) {
    ctx.font = font(sz); var words = String(txt).split(' '), lines = [], cur = '';
    words.forEach(function (wd) { var t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = t; });
    if (cur) lines.push(cur);
    return lines;
  }

  function drawCard(sc, off) {
    var q = sc.q, x = 12, y = 62 + off, w = 336, h = 100;
    ctx.save();
    ctx.shadowColor = 'rgba(40,20,90,.25)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
    ctx.fillStyle = 'rgba(255,255,255,.96)'; rr(ctx, x, y, w, h, 18); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#7c4dff'; ctx.save(); rr(ctx, x, y, w, 22, 18); ctx.clip(); ctx.fillRect(x, y, w, 22); ctx.restore();
    ctx.fillStyle = '#fff'; ctx.font = font(12, 800); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(q.ins, x + w / 2, y + 12, w - 16);
    var cy = y + 22 + (h - 22) / 2;
    var hint = (sc === G.scene && G.hintText) ? 'Gợi ý: ' + G.hintText : null;
    if (hint) cy -= 8;
    ctx.fillStyle = '#2b2160';
    var lens = (sc === G.scene && G.lensOn);
    if (q.kind === 'order') {
      var asm = sc === G.scene ? q.tokens.slice(0, G.pos) : [], rest = q.tokens.length - asm.length, line;
      if (q.letters) {
        var n = q.tokens.length, bw = Math.min(34, (w - 150) / n), sx = x + 100 + ((w - 110) - n * bw) / 2;
        NM.drawPic(ctx, q.pic, x + 46, cy - 4, 52);
        ctx.font = font(11, 700); ctx.fillStyle = '#6b5fb5'; ctx.fillText(q.sub, x + 46, cy + 32, 86);
        for (var i = 0; i < n; i++) {
          ctx.fillStyle = i < asm.length ? '#d3f9d8' : '#f1ecff'; rr(ctx, sx + i * bw, cy - 18, bw - 4, 36, 8); ctx.fill();
          ctx.fillStyle = '#2b2160'; ctx.font = font(22); ctx.fillText(i < asm.length ? asm[i] : '', sx + i * bw + (bw - 4) / 2, cy + 1);
        }
      } else {
        line = asm.join(' ') + (rest ? ' ' + new Array(rest + 1).join('___ ') : '');
        var ls = wrapText(line.trim(), w - 30, 18);
        ctx.font = font(18); ls.forEach(function (l, i) { ctx.fillText(l, x + w / 2, cy - (ls.length - 1) * 11 + i * 22, w - 24); });
      }
    } else if (q.pic && q.main) {
      NM.drawPic(ctx, q.pic, x + 62, cy, 62);
      ctx.fillStyle = '#2b2160'; ctx.font = font(q.main.length > 10 ? 22 : 28);
      ctx.fillText(q.main, x + 62 + (w - 62 - 40) / 2 + 40, cy, w - 150);
    } else if (q.pic) {
      NM.drawPic(ctx, q.pic, x + w / 2, cy, 66);
    } else if (q.main === '🔊') {
      ctx.font = '44px "Apple Color Emoji","Segoe UI Emoji",sans-serif'; ctx.fillText('🔊', x + w / 2, cy + 2);
    } else {
      var big = q.main.length <= 12, ls2 = wrapText(q.main, w - 40, big ? 30 : 17);
      ctx.font = font(big ? 30 : 17);
      ls2.forEach(function (l, i) { ctx.fillText(l, x + w / 2, cy - (ls2.length - 1) * (big ? 17 : 11) + i * (big ? 34 : 22), w - 24); });
    }
    if (hint) { ctx.fillStyle = '#e8590c'; ctx.font = font(15, 800); ctx.fillText('💡 ' + hint, x + w / 2, y + h - 12, w - 20); }
    if (lens && q.item.type === 'v') {
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + w - 36, y + 66, 28, 0, 7); ctx.fill(); ctx.stroke();
      NM.drawPic(ctx, q.item.w, x + w - 36, y + 66, 40);
    }
  }

  function drawPlat(pl, off, sc) {
    if (pl.kind === 'ground') {
      var w = G.world, gy = pl.y + off;
      ctx.fillStyle = w.ground; ctx.fillRect(0, gy, W, H - gy + 4);
      ctx.fillStyle = w.gtop; ctx.fillRect(0, gy, W, 9);
      ctx.fillStyle = w.dark; ctx.globalAlpha = 0.25; ctx.fillRect(0, gy + 9, W, 4); ctx.globalAlpha = 1;
      return;
    }
    if (pl.gone >= 1) return;
    var y = pl.y + off, a = 1 - (pl.gone || 0);
    var shk = pl.shake > 0 ? Math.sin(G.t * 90) * 2 : 0;
    var sel = pl.glow > 0 || (G.sel === pl);
    if (pl.broken) {
      var b = pl.broken; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - b);
      ctx.translate(pl.x, y + b * 60); ctx.rotate(b * 0.5);
      ctx.fillStyle = '#999'; rr(ctx, -pl.w / 2, 0, pl.w, pl.h, 8); ctx.fill(); ctx.restore();
      return;
    }
    ctx.save(); ctx.globalAlpha = a; ctx.translate(shk, 0);
    var x0 = pl.x - pl.w / 2;
    var PL = NM.ART.plank, PD = NM.ART.pads;
    if (pl.kind === 'reg' && PL.ok) {
      var fr = pl.eaten ? 2 : (pl.vanish && pl.hit > 0) ? 1 : 0, ph = pl.w * NM.SPR.plank.ch / NM.SPR.plank.cw;
      ctx.drawImage(PL, fr * NM.SPR.plank.cw, 0, NM.SPR.plank.cw, NM.SPR.plank.ch, x0, y - 3, pl.w, ph);
      ctx.restore(); return;
    }
    if (pl.kind === 'reg') {
      ctx.fillStyle = '#b78c4b'; rr(ctx, x0, y, pl.w, pl.h, 7); ctx.fill();
      ctx.fillStyle = '#e3c58a'; rr(ctx, x0, y, pl.w, 5, 4); ctx.fill();
      ctx.restore(); return;
    }
    // bục đáp án
    var correctFlash = pl.glow > 1;
    if (sel) { ctx.shadowColor = correctFlash ? '#69db7c' : '#ffe066'; ctx.shadowBlur = 20; }
    var useSprite = PD.ok && !pl.pic;
    if (useSprite) {
      var pi = (pl.used || correctFlash) ? 3 : Math.max(0, PLAT_COLORS.indexOf(pl.col));
      ctx.drawImage(PD, pi * NM.SPR.pads.cw, 0, NM.SPR.pads.cw, NM.SPR.pads.ch, x0 - 2, y - 2, pl.w + 4, pl.h + 5); ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = pl.used ? '#8ce99a' : correctFlash ? '#69db7c' : pl.col;
      rr(ctx, x0, y, pl.w, pl.h, 12); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.38)'; rr(ctx, x0 + 4, y + 3, pl.w - 8, 7, 4); ctx.fill();
    }
    if (sel || pl.used) { ctx.lineWidth = 3; ctx.strokeStyle = pl.used ? '#2f9e44' : '#fff'; rr(ctx, x0, y, pl.w, pl.h, 12); ctx.stroke(); }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (pl.pic) {
      var s = sel ? 1.12 : 1; ctx.fillStyle = 'rgba(255,255,255,.85)'; rr(ctx, x0 + 8, y + 5, pl.w - 16, pl.h - 10, 9); ctx.fill();
      NM.drawPic(ctx, pl.pic, pl.x, y + pl.h / 2, 38 * s);
    } else {
      var zoom = sel && !pl.used ? 1.3 : 1, sz = 15 * zoom, lines = [pl.label], maxw = pl.w - 14;
      if (pl.h >= 40 && pl.label.indexOf(' ') > 0) {   // nhãn dài: chia 2 dòng ở khoảng trắng gần giữa nhất
        var mid = pl.label.length / 2, bi = -1, bd = 1e9;
        for (var ci = 0; ci < pl.label.length; ci++) if (pl.label.charAt(ci) === ' ' && Math.abs(ci - mid) < bd) { bd = Math.abs(ci - mid); bi = ci; }
        lines = [pl.label.slice(0, bi), pl.label.slice(bi + 1)]; sz = 13 * Math.min(zoom, 1.1);
      }
      ctx.font = font(sz, 800);
      var widest = function () { return Math.max.apply(null, lines.map(function (l) { return ctx.measureText(l).width; })); }, tw = widest();
      while (tw > maxw && sz > 8) { sz -= 1; ctx.font = font(sz, 800); tw = widest(); }
      ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 3;
      lines.forEach(function (l, li) { ctx.fillText(l, pl.x, y + pl.h / 2 + 1 + (li - (lines.length - 1) / 2) * (sz + 2), maxw); });
      ctx.shadowBlur = 0;
    }
    if (pl.spring > 0) { ctx.fillStyle = '#ff6b6b'; var sh = 12 * Math.sin(pl.spring / 0.5 * 3.14); ctx.fillRect(pl.x - 10, y - sh, 20, sh); }
    ctx.restore();
    // chấm xác nhận
    if (!pl.used && sc === G.scene && G.sel === pl) {
      for (var d = 0, nd = CFG.CONFIRM[G.diff]; d < nd; d++) { ctx.fillStyle = d < G.selN ? '#ffd43b' : 'rgba(255,255,255,.55)'; ctx.strokeStyle = '#7c4dff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(pl.x - (nd - 1) * 9 + d * 18, y - 12, 6, 0, 7); ctx.fill(); ctx.stroke(); }
    }
  }

  function drawScene(sc, off) {
    if (!sc) return;
    ctx.save();
    sc.plats.forEach(function (pl) { drawPlat(pl, off, sc); });
    sc.coins.forEach(function (c) {
      if (c.got) return;
      var bob = Math.sin(G.t * 4 + c.ph) * 3;
      var ty2 = c.type || 'coin';
      if (ty2 !== 'coin') {
        var cy2 = c.y + off + bob, pulse = 1 + 0.12 * Math.sin(G.t * 6 + c.ph);
        ctx.save(); ctx.shadowColor = ty2 === 'gem' ? '#74d7ff' : ty2 === 'heart' ? '#ff8fa3' : '#ffe066'; ctx.shadowBlur = 14;
        if (ty2 === 'gem') {
          ctx.translate(c.x, cy2); ctx.scale(pulse, pulse); ctx.fillStyle = '#4dc3ff'; ctx.strokeStyle = '#1c7ed6'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(-11, -4); ctx.lineTo(-6, -11); ctx.lineTo(6, -11); ctx.lineTo(11, -4); ctx.lineTo(0, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,.65)'; ctx.beginPath(); ctx.moveTo(-6, -9); ctx.lineTo(-2, -9); ctx.lineTo(-5, -4); ctx.closePath(); ctx.fill();
        } else if (!NM.drawIcon(ctx, ty2 === 'star' ? NM.ICON.star : NM.ICON.heart, c.x, cy2, 28 * pulse)) {
          ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ty2 === 'star' ? '⭐' : '❤️', c.x, cy2);
        }
        ctx.restore(); return;
      }
      if (!NM.drawIcon(ctx, NM.ICON.coin, c.x, c.y + off + bob, 24)) {
        ctx.fillStyle = '#ffd43b'; ctx.strokeStyle = '#e8a317'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c.x, c.y + off + bob, 9, 0, 7); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#e8a317'; ctx.font = font(11); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', c.x, c.y + off + bob + 1);
      }
    });
    if (sc.boss) drawBoss(off);
    drawCard(sc, off);
    ctx.restore();
  }

  function drawBoss(off) {
    var b = G.boss; if (!b) return;
    var bx = W / 2, by = 205 + off, sh = b.shake > 0 ? Math.sin(G.t * 70) * 5 : 0, al = b.dead > 0 ? b.dead / 1.2 : (b.hp <= 0 ? 0 : 1);
    if (al <= 0) return;
    ctx.save(); ctx.globalAlpha = al; ctx.translate(bx + sh, by + Math.sin(G.t * 2) * 4);
    ctx.fillStyle = b.flash > 0 ? '#ffd6d6' : '#6c5ce7';
    ctx.beginPath(); ctx.arc(-44, 6, 24, 0, 7); ctx.arc(-18, -14, 32, 0, 7); ctx.arc(24, -10, 30, 0, 7); ctx.arc(48, 8, 22, 0, 7); ctx.rect(-48, 6, 98, 24); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-14, 0, 9, 0, 7); ctx.arc(16, 0, 9, 0, 7); ctx.fill();
    ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(-12, 2, 4, 0, 7); ctx.arc(18, 2, 4, 0, 7); ctx.fill();
    ctx.strokeStyle = '#222'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-26, -12); ctx.lineTo(-6, -7); ctx.moveTo(28, -12); ctx.lineTo(8, -7); ctx.stroke();
    ctx.beginPath(); ctx.arc(1, 22, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    ctx.restore();
    ctx.font = '18px "Apple Color Emoji","Segoe UI Emoji",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (var i = 0; i < CFG.BOSS_HP; i++) { ctx.globalAlpha = i < b.hp ? 1 : 0.25; ctx.fillText('❤️', bx - 26 + i * 26, by + 42); }
    ctx.globalAlpha = 1;
  }

  function drawCrocSprite(c, wy) {
    var im = NM.ART.croc, S = NM.SPR.croc, fr;
    if (c.bite > 0) fr = c.bite > 0.28 ? 3 : 4;
    else if (c.burp > 0) fr = 5;
    else if (c.target) fr = 2;
    else fr = Math.floor(G.t * 1.6) % 2;
    var dw = 112, dh = dw * S.ch / S.cw, lift = fr === 3 ? 14 : 0;
    ctx.save(); ctx.translate(c.x, wy + 12 - lift); ctx.scale(c.face || 1, 1);
    ctx.drawImage(im, fr * S.cw, 0, S.cw, S.ch, -dw / 2, -dh, dw, dh);
    ctx.restore();
  }
  function drawCroc(c, wy) {
    if (NM.ART.croc.ok) { drawCrocSprite(c, wy); return; }
    var open = c.bite > 0 ? Math.sin(Math.min(1, c.bite / 0.5) * Math.PI) : 0, lift = open * 20;
    ctx.save(); ctx.translate(c.x, wy + 6 - lift * 0.6); ctx.scale(c.face || 1, 1);
    ctx.beginPath(); ctx.rect(-90, -70, 180, 70 + lift * 0.6 + 2); ctx.clip();     // chỉ thấy phần nhô lên khỏi mặt nước
    ctx.fillStyle = '#43a047'; ctx.beginPath(); ctx.ellipse(0, 4, 34, 15, 0, 0, 7); ctx.fill();                  // thân
    ctx.fillStyle = '#2e7d32'; for (var k = -2; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(k * 12 - 5, -8); ctx.lineTo(k * 12, -17); ctx.lineTo(k * 12 + 5, -8); ctx.fill(); }
    ctx.fillStyle = '#43a047'; ctx.beginPath(); ctx.moveTo(-30, 2); ctx.lineTo(-62, -4 + Math.sin(G.t * 5) * 4); ctx.lineTo(-30, 14); ctx.fill();   // đuôi
    ctx.save(); ctx.translate(26, 0); ctx.rotate(-open * 0.5);                                                    // hàm trên
    ctx.fillStyle = '#66bb6a'; rr(ctx, -4, -14, 44, 14, 6); ctx.fill();
    ctx.fillStyle = '#fff'; for (var t = 0; t < 4; t++) { ctx.beginPath(); ctx.moveTo(4 + t * 9, 0); ctx.lineTo(8 + t * 9, 6); ctx.lineTo(12 + t * 9, 0); ctx.fill(); }
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(6, -16, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(8, -16, 3.2, 0, 7); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.translate(26, 2); ctx.rotate(open * 0.35);                                                    // hàm dưới
    ctx.fillStyle = '#58a85c'; rr(ctx, -4, 0, 40, 9, 5); ctx.fill();
    ctx.fillStyle = '#fff'; for (var u = 0; u < 3; u++) { ctx.beginPath(); ctx.moveTo(6 + u * 10, 0); ctx.lineTo(10 + u * 10, -5); ctx.lineTo(14 + u * 10, 0); ctx.fill(); }
    ctx.restore();
    ctx.restore();
  }

  var WATER = [['#58c4ff', '#1b78d8'], ['#43dcc4', '#12908a'], ['#a6e3ff', '#4a9fd8'], ['#b894ff', '#6a3fd0']];
  function drawCloud(up) {      // (tên cũ) vẽ NƯỚC DÂNG + cá sấu
    if (!G.scene || (!up && G.phase !== 'ask' && G.phase !== 'celebrate' && G.phase !== 'fb')) return;
    var cy = up ? (G.cloudKeep || H + 100) + up : G.phase === 'ask' ? cloudY() : G.cloudKeep || H + 100;
    if (G.phase === 'ask') G.cloudKeep = cy;
    var t = G.t, danger = G.p.y > cy - 110 && G.phase === 'ask', col = WATER[(G.round || 0) % 4];
    ctx.save();
    if (G.croc) drawCroc(G.croc, cy);
    var gr = ctx.createLinearGradient(0, cy - 10, 0, cy + 160); gr.addColorStop(0, col[0]); gr.addColorStop(1, col[1]);
    ctx.globalAlpha = 0.93; ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(0, H + 5); ctx.lineTo(0, cy);
    for (var x = 0; x <= W; x += 12) ctx.lineTo(x, cy + Math.sin(t * 2.2 + x * 0.06) * 4);
    ctx.lineTo(W, H + 5); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 3; ctx.beginPath();
    for (var x2 = 0; x2 <= W; x2 += 12) { var yy = cy + Math.sin(t * 2.2 + x2 * 0.06) * 4; if (x2 === 0) ctx.moveTo(x2, yy); else ctx.lineTo(x2, yy); }
    ctx.stroke();
    if (!NM.db.settings.reduce) { ctx.fillStyle = 'rgba(255,255,255,.35)'; for (var b = 0; b < 8; b++) { var bx = (b * 53 + t * 12) % W, by = cy + 20 + ((b * 37 + t * 30) % 120); if (by < H) { ctx.beginPath(); ctx.arc(bx, by, 2 + (b % 3), 0, 7); ctx.fill(); } } }
    if (danger) { ctx.font = font(18); ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#e03131'; ctx.lineWidth = 4; var ty = cy - 52 - Math.abs(Math.sin(t * 8)) * 4; ctx.strokeText('⚠️ Nước đang dâng!', W / 2, ty); ctx.fillText('⚠️ Nước đang dâng!', W / 2, ty); }
    ctx.restore();
  }

  function drawPlayer() {
    var p = G.p; if (G.phase === 'idle' || G.phase === 'intro') return;
    var sq = p.squash > 0 ? p.squash : 0, st = clamp(Math.abs(p.vy) / 2600, 0, 0.14);
    var sx = 1 + sq * 0.18 - st * 0.6, sy = 1 - sq * 0.18 + st;
    ctx.save(); ctx.translate(p.x, p.y); ctx.scale(sx, sy);
    var cim = NM.chars;
    if (cim && cim.ok) {    // nhân vật từ ảnh assets/chars.png (lưới 3x3)
      var ci = (G.skinIdx || 0) % 9, cw = cim.naturalWidth / 3, ch = cim.naturalHeight / 3;
      ctx.drawImage(cim, (ci % 3) * cw, Math.floor(ci / 3) * ch, cw, ch, -30, -58, 60, 60);
      ctx.restore(); return;
    }
    var rocket = G.trans && G.trans.rocket && G.phase === 'trans';
    if (rocket) { ctx.fillStyle = '#ff922b'; ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(0, 34); ctx.lineTo(8, 4); ctx.fill(); ctx.fillStyle = '#ffe066'; ctx.beginPath(); ctx.moveTo(-4, 4); ctx.lineTo(0, 22); ctx.lineTo(4, 4); ctx.fill(); }
    ctx.fillStyle = 'rgba(0,0,0,.18)';
    ctx.fillStyle = G.skin; ctx.beginPath(); ctx.arc(0, -20, 20, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.arc(-7, -28, 6, 0, 7); ctx.fill();
    ctx.fillStyle = '#51cf66'; ctx.beginPath(); ctx.ellipse(-3, -42, 4, 8, -0.5, 0, 7); ctx.ellipse(5, -42, 4, 8, 0.5, 0, 7); ctx.fill();
    var f = p.face || 1;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-7, -22, 6, 0, 7); ctx.arc(7, -22, 6, 0, 7); ctx.fill();
    ctx.fillStyle = '#2b2160'; ctx.beginPath(); ctx.arc(-7 + f * 1.5, -21, 3, 0, 7); ctx.arc(7 + f * 1.5, -21, 3, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,105,135,.55)'; ctx.beginPath(); ctx.arc(-13, -13, 3.5, 0, 7); ctx.arc(13, -13, 3.5, 0, 7); ctx.fill();
    ctx.strokeStyle = '#2b2160'; ctx.lineWidth = 2; ctx.beginPath();
    if (G.phase === 'fb' && G.hearts < 3 && G.combo === 0) ctx.arc(0, -8, 4, Math.PI * 1.1, Math.PI * 1.9); else ctx.arc(0, -13, 5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#2b2160'; ctx.beginPath(); ctx.ellipse(-8, -1, 6, 3, 0, 0, 7); ctx.ellipse(8, -1, 6, 3, 0, 0, 7); ctx.fill();
    ctx.restore();
  }

  function drawParticles() {
    G.particles.forEach(function (p) {
      var a = 1 - p.t / p.life; ctx.globalAlpha = Math.max(0, a);
      if (p.txt) { ctx.fillStyle = p.col; ctx.font = font(p.size); ctx.textAlign = 'center'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.strokeText(p.txt, p.x, p.y); ctx.fillText(p.txt, p.x, p.y); }
      else { ctx.fillStyle = p.col; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
    });
    ctx.globalAlpha = 1;
  }

  function render() {
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var sx = G.shake > 0 ? rnd(-3, 3) : 0, sy = G.shake > 0 ? rnd(-3, 3) : 0;
    ctx.translate(sx, sy);
    var tr = G.trans, off = 0;
    if (tr && tr.kind === 'up') off = ease(clamp(tr.u, 0, 1)) * H;
    drawBG(off);
    if (tr && tr.kind === 'up') { drawScene(tr.from, off); drawScene(tr.to, off - H); }
    else if (tr && tr.kind === 'fade') { drawScene(G.scene, 0); }
    else drawScene(G.scene, 0);
    if (!tr || tr.kind === 'fade') drawCloud(); else if (tr.kind === 'up') drawCloud(off * 0.6);
    drawPlayer();
    drawParticles();
    if (tr && tr.kind === 'fade') { var u = tr.u, a = u < 0.5 ? u * 2 : (1 - u) * 2; ctx.fillStyle = 'rgba(30,20,70,' + clamp(a, 0, 1) + ')'; ctx.fillRect(-10, -10, W + 20, H + 20); }
    if (G.banner) {
      var bt = G.banner.t, ba = clamp(Math.min(bt, 2.0 - Math.max(0, 2.2 - bt - 0.2)) * 3, 0, 1);
      ctx.save(); ctx.globalAlpha = clamp(bt * 2, 0, 1);
      ctx.fillStyle = 'rgba(43,33,96,.88)'; rr(ctx, 20, H / 2 - 40, W - 40, 70, 20); ctx.fill();
      ctx.fillStyle = '#ffe066'; ctx.font = font(G.banner.text.length > 24 ? 16 : 24); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(G.banner.text, W / 2, H / 2 - 5, W - 60); ctx.restore();
    }
  }
  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
    if (G.active) {
      if (!G.paused) {
        update(dt);
        // tự giảm hiệu ứng khi khung hình chậm
        fpsAcc += dt; fpsN++;
        if (fpsN >= 120) { if (fpsAcc / fpsN > 0.034 && !NM.db.settings.reduce) { NM.db.settings.reduce = true; NM.save(); G.banner = { text: 'Đã giảm hiệu ứng cho mượt hơn', t: 2 }; } fpsAcc = 0; fpsN = 0; }
      }
      render();
    } else if (G.scene && !$('#stageWrap').hidden) render();
  }
  NM.G.WORLDS = WORLDS; NM.SKINS = SKINS;
  NM._tick = function (dt) { if (G.active && !G.paused) update(dt); };  // dùng cho kiểm thử tự động
})(window.NM);
