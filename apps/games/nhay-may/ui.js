/* ui.js: màn hình menu, cửa hàng, tổng kết, câu gõ (bóng cứu hộ / Fix it!), khu giáo viên */
(function (NM) {
  'use strict';
  var $ = NM.$, $$ = NM.$$, esc = NM.esc, G = NM.G;
  var ui = NM.ui = {};
  var LV = ['easy', 'normal', 'hard'];
  var diffMode = 'auto', playMode = 'solo';
  var pendingTeacherTab = 'level';

  function screen(html, cls) {
    var s = $('#screen'); s.hidden = false; s.className = cls || ''; s.innerHTML = html; s.scrollTop = 0;
    $('#stageWrap').hidden = true; ui.closeModal();
  }
  function modal(html, cls) {
    var m = $('#modal'); m.hidden = false; m.className = cls || ''; m.innerHTML = '<div class="mbox">' + html + '</div>';
  }
  ui.closeModal = function () { var m = $('#modal'); m.hidden = true; m.innerHTML = ''; };
  function fmtLv(l) { return NM.LEVEL_NAME[l] || l; }
  function selectedSets() {
    if (window.GAMESET) return ['hub'];   /* chỉ có đúng một bộ từ */
    var p = NM.profile(); return (p.sel || ['u1', 'u2']).filter(function (id) { return NM.SETS.some(function (s) { return s.id === id; }); });
  }
  function autoLevel(ids) {
    var best = 0;
    NM.SETS.forEach(function (s) { if (ids.indexOf(s.id) >= 0) best = Math.max(best, LV.indexOf(NM.setLevel(s))); });
    return LV[best];
  }
  function countItems(ids) { var n = 0; NM.SETS.forEach(function (s) { if (ids.indexOf(s.id) >= 0) n += s.items.length; }); return n; }

  /* ================= Đăng nhập ================= */
  ui.login = function () {
    var names = Object.keys(NM.db.profiles);
    screen('<div class="wrap narrow center"><img class="cover" src="' + NM.asset('cover.jpg') + '" alt="" onerror="this.style.display=\'none\'"><h1 class="title">Nhảy Mây <span>Từ Vựng</span></h1>' +
      '<p class="lead">Em tên là gì?</p><input id="nm" class="inp" maxlength="20" placeholder="Nhập tên của em" autocomplete="off">' +
      (names.length ? '<p class="small">Hoặc chọn tên đã chơi:</p><div class="chips">' + names.map(function (n) { return '<button class="chip" data-act="pickname" data-n="' + esc(n) + '">' + esc(n) + '</button>'; }).join('') + '</div>' : '') +
      '<button class="btn big" data-act="login">Vào chơi ▶</button><button class="link" data-act="teacher">🛠 Khu giáo viên</button></div>');
    setTimeout(function () { var i = $('#nm'); if (i) i.focus(); }, 100);
  };
  function doLogin(name) {
    name = (name || '').trim().slice(0, 20); if (!name) { var i = $('#nm'); if (i) { i.classList.add('shake'); } return; }
    NM.db.cur = name; NM.profile(); NM.save(); NM.audioInit(); ui.home();
  }

  function skinHTML(p) {
    var im = NM.chars;
    if (im && im.ok) {
      var out = '';
      for (var i = 0; i < 9; i++) {
        var col = i % 3, row = Math.floor(i / 3);
        out += '<button class="skin pic9' + (p.skin === i ? ' on' : '') + '" data-act="skin" data-i="' + i + '" style="background-image:url(' + NM.asset('chars.png') + ');background-size:300% 300%;background-position:' + (col * 50) + '% ' + (row * 50) + '%"></button>';
      }
      return out;
    }
    return NM.SKINS.map(function (c, i) { return '<button class="skin' + (p.skin === i ? ' on' : '') + '" data-act="skin" data-i="' + i + '" style="background:' + c + '"></button>'; }).join('');
  }
  ui.refreshArt = function () { };
  ui.refreshSkins = function () { var el = $('.skins'); if (el && NM.db.cur) el.innerHTML = skinHTML(NM.profile()); };

  /* ================= Trang chủ ================= */
  ui.home = function () {
    var p = NM.profile(), sel = selectedSets(), P = countItems(sel), sz = NM.planSize(P), auto = autoLevel(sel);
    var lv = diffMode === 'auto' ? auto : diffMode, key = sel.slice().sort().join('+'), prog = p.progress[key];
    var cards = NM.SETS.map(function (s) {
      var on = sel.indexOf(s.id) >= 0;
      return '<button class="set' + (on ? ' on' : '') + '" data-act="toggle" data-id="' + s.id + '"><span class="ic">' + s.icon + '</span><b>' + esc(s.title) + '</b><small>' + esc(NM.setGroup(s)) + ' · ' + s.items.length + (s.kind === 'vocab' ? ' từ' : ' câu') + '</small><i class="lv lv-' + NM.setLevel(s) + '">' + fmtLv(NM.setLevel(s)) + '</i><span class="tick">' + (on ? '✓' : '') + '</span></button>';
    }).join('');
    var info = !sz ? '⚠️ Mới có ' + P + ' mục. Chọn thêm bài để đủ ít nhất 6 nhé!' : sz.mini ? '🟢 Ván mini: 1 vòng + boss (' + P + ' mục)' : sz.full ? '🟣 Ván đủ: 4 vòng × 15 câu + boss (' + P + ' mục)' : '🔵 Ván vừa: ' + sz.total + ' câu chia 4 vòng + boss (' + P + ' mục)';
    var skins = skinHTML(p);
    var tgt = ['auto', 'easy', 'normal', 'hard'].map(function (m) { return '<button class="seg-b' + (diffMode === m ? ' on' : '') + '" data-act="diff" data-m="' + m + '">' + (m === 'auto' ? 'Tự động (' + fmtLv(auto) + ')' : fmtLv(m)) + '</button>'; }).join('');
    screen('<div class="wrap">' +
      '<header class="bar"><div class="who">👤 <b>' + esc(NM.db.cur) + '</b> <button class="link" data-act="switch">Đổi bạn</button></div><div class="coins">' + NM.icoHTML('coin', 20) + ' ' + p.coins + '</div>' +
      '<div class="tools"><button class="ib" data-act="mute" title="Âm thanh">' + (NM.db.settings.mute ? '🔇' : '🔊') + '</button><button class="ib' + (NM.db.settings.reduce ? ' on' : '') + '" data-act="fx" title="Giảm hiệu ứng">✨</button><button class="ib" data-act="teacher" title="Giáo viên">⚙️</button></div></header>' +
      '<img class="hero" src="' + NM.asset('cover.jpg') + '" alt="" onerror="this.style.display=\'none\'"><h1 class="title">Nhảy Mây <span>Từ Vựng</span> ☁️</h1>' +
      (window.GAMESET ? '<section><div class="sh"><h3>1. Bài học</h3></div><div class="selinfo' + (sz ? '' : ' bad') + '"><b>' + esc(NM.SETS[0].title) + '</b><br>' + info + '</div></section>' : '<section><div class="sh"><h3>1. Chọn bài học</h3><span><button class="link" data-act="all">Chọn hết</button> · <button class="link" data-act="none">Bỏ hết</button></span></div><div class="sets">' + cards + '</div><div class="selinfo' + (sz ? '' : ' bad') + '">' + info + '</div></section>') +
      '<section><h3>2. Mức độ</h3><div class="seg">' + tgt + '</div><p class="small">Mức độ chỉ chỉnh tốc độ game: bục đứng yên hay trôi, và nước dâng nhanh hay chậm.</p></section>' +
      '<section><h3>3. Chế độ chơi</h3><div class="seg">' + [['solo', '🧍 Một mình'], ['duel', '👫 Đấu 1–1'], ['bot', '🤖 Đấu với Bot']].map(function (m) { return '<button class="seg-b' + (playMode === m[0] ? ' on' : '') + '" data-act="pmode" data-m="' + m[0] + '">' + m[1] + '</button>'; }).join('') + '</div>' +
      (playMode === 'duel' ? '<input id="p2" class="inp" maxlength="12" placeholder="Tên bạn thứ 2" value="' + esc(p.p2 || '') + '"><p class="small">Hai bạn dùng chung một máy, thay phiên nhau: mỗi bạn 10 câu khác nhau, ai nhiều điểm hơn thắng. Không bị mất tim.</p>' : '') +
      (playMode === 'bot' ? '<p class="small">Cùng 10 câu với Bot Mây. Bot trả lời đúng nhiều hay ít tuỳ mức độ. Không bị mất tim.</p>' : '') + '</section>' +
      '<section><h3>4. Nhân vật</h3><div class="skins">' + skins + '</div></section>' +
      '<div class="cta">' +
      '<button class="btn big" data-act="play"' + (sz ? '' : ' disabled') + '>▶ ' + ({ solo: 'Chơi ngay', duel: 'Bắt đầu đấu 1–1', bot: 'Đấu với Bot' }[playMode]) + ' · ' + fmtLv(lv) + '</button>' +
      (prog && sz && prog.round > 0 && playMode === 'solo' ? '<button class="btn alt" data-act="cont">⏩ Tiếp tục vòng ' + (prog.round + 1) + '</button>' : '') +
      '<div class="row"><button class="btn sm" data-act="shop">🛒 Cửa hàng</button><button class="btn sm" data-act="fix"' + (p.fix.length ? '' : ' disabled') + '>🛠 Fix it! (' + p.fix.length + ')</button><button class="btn sm" data-act="how">❓ Cách chơi</button></div></div></div>');
  };

  function begin(startRound) {
    var sel = selectedSets(), lv = diffMode === 'auto' ? autoLevel(sel) : diffMode;
    NM.audioInit();
    var p2el = $('#p2'), prof0 = NM.profile();
    if (p2el) { prof0.p2 = p2el.value.trim().slice(0, 12); NM.save(); }
    var go = function () { NM.startGame({ setIds: sel, diff: lv, startRound: playMode === 'solo' ? (startRound || 0) : 0, mode: playMode, p2: prof0.p2 || 'Bạn 2' }); };
    var p = NM.profile();
    if (!p.seenHow) { p.seenHow = 1; NM.save(); ui.how(go); } else go();
  }
  ui.how = function (cb) {
    modal('<h2>Cách chơi ☁️</h2><ol class="how"><li>👆 <b>Kéo ngón tay</b> sang trái / phải để bé đi theo (máy tính: phím ← →). Bé chỉ <b>nảy tại chỗ</b> và đợi em điều khiển.</li>' +
      '<li>⬆ <b>Vuốt lên</b> (hoặc bấm nút ⬆, phím ↑) để <b>nhảy cao</b> lên bục / thanh gỗ phía trên.</li>' +
      '<li>⬇ <b>Vuốt xuống</b> (hoặc bấm nút ⬇, phím ↓) để <b>rơi xuống</b> bục phía dưới nếu muốn chọn lại.</li>' +
      '<li>🪵 Thanh gỗ nâu là chỗ đứng an toàn để lấy đà, không tính đáp án.</li>' +
      '<li>🪙 Nhặt xu trên đường: ⭐ sao +5 điểm, 💎 kim cương +5 xu, ❤️ tim hồi 1 tim. Nhặt 5 xu liên tiếp được thêm “Mưa xu” +2 xu!</li>' +
      '<li>🎯 Muốn chọn đáp án nào: nhảy lên bục đó rồi <b>đứng yên nảy tại chỗ</b>. Mỗi nảy sáng thêm 1 chấm vàng, đủ chấm (Dễ / Vừa: 3, Khó: 2) là chốt. Rời đi trước khi đủ chấm thì huỷ, không bị phạt.</li>' +
      '<li>✅ Đúng → lên tầng mới. ❌ Sai → mất ❤️ và có lời giải thích.</li>' +
      '<li>🌊 Đừng để <b>nước dâng</b> chạm chân! Cá sấu 🐊 sẽ cắn mất các thanh gỗ. Cuối mỗi vòng hãy hạ Quái Mây nhé.</li>' +
      '<li>💡 Nút Gợi ý có 3 mức, nhưng dùng gợi ý thì điểm sẽ ít hơn. Trả lời trong 10 giây được +5 điểm.</li>' +
      '<li>👫 Chế độ <b>Đấu 1–1</b>: hai bạn thay phiên trên một máy. 🤖 <b>Đấu với Bot</b>: thắng Bot bằng điểm cao hơn.</li></ol><div class="row"><button class="btn big" data-act="close-how">Đã hiểu!</button></div>');
    ui._howCb = cb || null;
  };

  /* ================= Cửa hàng ================= */
  ui.shop = function (msg) {
    var p = NM.profile(), pr = NM.db.cfg.prices;
    var rows = NM.EQUIP.map(function (e) {
      var lv = p.equip[e.id], cost = lv < 5 ? pr[e.id][lv] : null;
      var pips = ''; for (var i = 1; i <= 5; i++) pips += '<i class="pip' + (i <= lv ? ' on' : '') + '"></i>';
      return '<div class="shopi"><div class="si">' + e.icon + '</div><div class="sd"><b>' + e.name + '</b><div class="pips">' + pips + '</div><small>' + e.desc(lv) + (lv < 5 ? ' → cấp ' + (lv + 1) + ': ' + e.desc(lv + 1) : '') + '</small></div>' +
        (lv < 5 ? '<button class="btn sm" data-act="buy" data-id="' + e.id + '"' + (p.coins < cost ? ' disabled' : '') + '>🪙 ' + cost + '<br>Mua</button>' : '<span class="max">Tối đa</span>') + '</div>';
    }).join('');
    screen('<div class="wrap narrow"><header class="bar"><button class="btn sm" data-act="home">⬅ Về</button><div class="coins">' + NM.icoHTML('coin', 20) + ' ' + p.coins + '</div></header><h2>🛒 Cửa hàng</h2>' + (msg ? '<div class="selinfo">' + msg + '</div>' : '') + rows + '<p class="small">Xu kiếm được khi chơi. Mỗi ván tối đa 300 xu.</p></div>');
  };

  /* ================= Giữa ván ================= */
  ui.pause = function () {
    modal('<h2>⏸ Tạm dừng</h2><p class="small">Đồng hồ ván và nước đang dừng.</p><div class="col">' +
      '<button class="btn big" data-act="resume">▶ Tiếp tục</button>' +
      '<button class="btn" data-act="mute2">' + (NM.db.settings.mute ? '🔇 Bật âm thanh' : '🔊 Tắt âm thanh') + '</button>' +
      '<button class="btn" data-act="fx2">✨ Giảm hiệu ứng: ' + (NM.db.settings.reduce ? 'BẬT' : 'tắt') + '</button>' +
      '<button class="btn" data-act="how2">❓ Cách chơi</button>' +
      '<button class="btn warn" data-act="quit">🏠 Thoát ván (lưu vòng này)</button></div>');
  };

  ui.feedback = function (info, cb, minSec) {
    var el = $('#fb'), item = info.item;
    var title = info.timeout ? '⏰ Hết giờ rồi!' : '😅 Chưa đúng rồi!';
    var pic = item.type === 'v' ? NM.picHTML(item.w, 64) : '';
    var life = info.duel ? '' : info.absorbed ? '<div class="fb-s">🛡️ Khiên mây đã đỡ 1 tim giúp em!</div>' : '<div class="fb-s bad">Mất 1 tim ❤️ · còn ' + Math.max(0, info.hearts) + ' tim</div>';
    el.hidden = false;
    el.innerHTML = '<div class="fb-card' + (info.timeout ? ' time' : '') + '"><div class="fb-t">' + title + '</div><div class="fb-b">' + (pic ? '<div class="fb-p">' + pic + '</div>' : '') + '<div class="fb-x">' + info.text + '</div></div>' + life + '<button id="fbOk" class="btn big" disabled>Tiếp tục ▶</button></div>';
    var btn = $('#fbOk'), done = false;
    function go() { if (done || btn.disabled) return; done = true; el.hidden = true; el.innerHTML = ''; document.removeEventListener('keydown', key); cb(); }
    function key(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } }
    document.addEventListener('keydown', key);
    btn.addEventListener('click', go);
    G.after(minSec, function () { btn.disabled = false; btn.focus(); });
    if (item.type === 'v' && info.q && info.q.audio) G.after(0.3, function () { NM.speak(item.w.w); });
  };

  ui.handoff = function (name, cb) {
    modal('<h2>🔄 Đến lượt ' + esc(name) + '!</h2><p class="lead">Chuyền máy cho <b>' + esc(name) + '</b> nhé. Bấm khi đã sẵn sàng.</p><div class="row"><button class="btn big" data-act="ready">Sẵn sàng ▶</button></div>');
    ui._readyCb = cb;
  };

  ui.roundResult = function (info, last, cb) {
    var w = G.WORLDS[info.round % 4];
    var lines = info.lines.map(function (l) { return '<li><span>' + l[0] + '</span><b>' + (l[1] ? '+' + l[1] + ' 🪙' : '') + '</b></li>'; }).join('');
    var head = info.beaten ? '🎉 Hạ được Quái Mây!' : '☁️ Quái Mây bỏ chạy mất rồi';
    modal('<h2>Xong vòng ' + (info.round + 1) + ' · ' + w.name + '</h2><p class="lead">' + head + (info.beaten ? ' Em được thêm 1 tim ❤️' : ' Em vẫn qua vòng, chỉ mất quà boss.') + '</p>' +
      (info.timeUp ? '<p class="selinfo bad">⏰ Hết 15 phút rồi!</p>' : '') + '<ul class="lines">' + lines + '</ul><div class="row"><button class="btn big" data-act="rr-next">' + (last ? 'Xem tổng kết ▶' : 'Vòng tiếp theo ▶') + '</button></div>');
    ui._rrCb = cb; NM.sfx.win();
  };

  /* ================= Tổng kết ================= */
  ui.summary = function (r) {
    $('#fb').hidden = true; ui.closeModal();
    var p = NM.profile(), st = r.stats;
    if (r.duel) {
      var D = r.duel, a = D.players[0], b = D.players[1], w = D.winner;
      var big = w === -1 ? ['🤝', 'Hòa nhau!'] : w === 0 ? ['🏆', esc(a.name) + ' thắng!'] : [D.vs === 'bot' ? '🤖' : '🏆', esc(b.name) + ' thắng!'];
      screen('<div class="wrap narrow center"><div class="logo">' + big[0] + '</div><h1 class="title sm">' + big[1] + '</h1>' +
        '<div class="stats duelst"><div class="' + (w === 0 ? 'win' : '') + '"><small>' + esc(a.name) + '</small><b>' + a.score + '</b><small>✅ ' + a.ok + '/' + D.N + '</small></div><div class="' + (w === 1 ? 'win' : '') + '"><small>' + esc(b.name) + '</small><b>' + b.score + '</b><small>✅ ' + b.ok + '/' + D.N + '</small></div></div>' +
        '<p class="small">' + esc(a.name) + ' nhận +' + r.coins + ' 🪙</p>' +
        (r.wrong.length ? '<div class="card left"><h3>' + esc(a.name) + ' cần nhớ</h3><ul class="wl">' + r.wrong.map(function (x) { return '<li>' + NM.shortExplain(x.item) + '</li>'; }).join('') + '</ul></div>' : '') +
        '<div class="col"><button class="btn big" data-act="play">🔁 Đấu lại</button><button class="btn" data-act="home">🏠 Về trang chủ</button></div></div>');
      return;
    }
    var head = { win: ['🏆', 'Chinh phục tất cả!'], lose: ['😢', r.reason ? r.reason + ' rồi, cố lên nhé!' : 'Thua rồi, cố lên!'], timeup: ['⏰', 'Hết 15 phút!'], quit: ['👋', 'Hẹn gặp lại!'] }[r.kind];
    var wl = r.wrong.map(function (x) { return '<li>' + NM.shortExplain(x.item) + (x.n > 1 ? ' <i>(sai ' + x.n + ' lần)</i>' : '') + '</li>'; }).join('');
    var fixN = Math.min(10, uniqIds(r.wrong.map(function (x) { return x.item.id; }).concat(p.fix)).length);
    screen('<div class="wrap narrow center"><div class="logo">' + head[0] + '</div><h1 class="title sm">' + head[1] + '</h1>' +
      '<div class="stats"><div><b>' + r.score + '</b><small>⭐ Điểm</small></div><div><b>+' + r.coins + '</b><small>🪙 Xu</small></div><div><b>' + st.correct + '/' + (st.correct + st.wrong) + '</b><small>✅ Đúng</small></div><div><b>×' + r.bestCombo + '</b><small>🔥 Combo</small></div></div>' +
      '<p class="small">Đã sửa ' + st.fixed + ' từ · Hạ boss ' + st.boss + ' lần · ' + Math.floor(r.secs / 60) + ' phút ' + (r.secs % 60) + ' giây</p>' +
      (r.wrong.length ? '<div class="card left"><h3>Những chỗ cần nhớ</h3><ul class="wl">' + wl + '</ul></div>' : '<p class="lead">Không sai câu nào! 🌟</p>') +
      '<div class="col">' + (fixN ? '<button class="btn big" data-act="fixnow">🛠 Fix it! (' + fixN + ' mục)</button>' : '') +
      (r.kind === 'win' || r.kind === 'lose' || r.kind === 'timeup' ? '<button class="btn" data-act="play">🔁 ' + (r.kind === 'win' ? 'Chơi lại' : 'Chơi lại từ đầu') + '</button>' : '') +
      (r.kind !== 'win' && p.progress[r.sets.slice().sort().join('+')] ? '<button class="btn" data-act="cont">⏩ Chơi tiếp vòng ' + (r.round + 1) + '</button>' : '') +
      '<button class="btn" data-act="home">🏠 Về trang chủ</button></div></div>');
    if (r.kind === 'win') NM.sfx.win();
  };
  function uniqIds(a) { var s = {}; return a.filter(function (x) { if (s[x]) return false; s[x] = 1; return true; }); }

  /* ================= Câu gõ / xếp (bóng cứu hộ, Fix it!) ================= */
  ui.quiz = function (o) {
    var queue = o.items.map(function (i) { return NM.quizQ(i); }), total = queue.length, n = 0, failed = [], fixed = [], hint = 0, cur = null, placed = [], done = false;
    function norm(s) { return String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/[’‘]/g, "'"); }
    function next() {
      if (!queue.length) return finish();
      cur = queue.shift(); hint = 0; placed = []; n++; render();
    }
    function mainHTML(q) {
      var m = q.main ? esc(q.main).replace('___', '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>') : '';
      return (q.pic ? '<div class="qz-pic">' + NM.picHTML(q.pic, 84) + '</div>' : '') + (m ? '<div class="qz-main">' + m + '</div>' : '') +
        (q.audio && NM.canSpeak ? '<button class="btn sm" data-q="say">🔊 Nghe</button>' : '');
    }
    function render() {
      var q = cur, tiles = !!q.tokens;
      var body = mainHTML(q) + '<div class="qz-hint" id="qzHint"></div>';
      if (!tiles) body += '<input id="qzIn" class="inp" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Gõ đáp án…"><div class="row"><button class="btn sm" data-q="hint">💡 Gợi ý 0/3</button><button class="btn" data-q="go">Kiểm tra ✔</button></div>';
      else body += '<div id="qzAns" class="tiles ans"></div><div id="qzPool" class="tiles pool"></div><div class="row"><button class="btn sm" data-q="hint">💡 Gợi ý 0/3</button><button class="btn sm" data-q="clr">↩ Làm lại</button></div>';
      modal('<div class="qz-t">' + o.title + '</div><div class="qz-s">Câu ' + n + '/' + total + '</div><div class="qz-i">' + esc(q.ins) + '</div>' + body + '<div id="qzFb" class="qz-fb" hidden></div>', 'quiz');
      if (tiles) drawTiles();
      var inp = $('#qzIn'); if (inp) setTimeout(function () { inp.focus(); }, 80);
      if (q.audio && q.kind === 'q_listen') setTimeout(function () { NM.speak(q.audio); }, 400);
    }
    function drawTiles() {
      var q = cur;
      $('#qzAns').innerHTML = placed.map(function (i, k) { return '<button class="tile on" data-q="un" data-k="' + k + '">' + esc(q.pool[i]) + '</button>'; }).join('') || '<span class="ph">Chạm vào ' + (q.joiner ? 'từ' : 'chữ') + ' bên dưới</span>';
      $('#qzPool').innerHTML = q.pool.map(function (t, i) { return placed.indexOf(i) >= 0 ? '<span class="tile ghost">' + esc(t) + '</span>' : '<button class="tile" data-q="pk" data-i="' + i + '">' + esc(t) + '</button>'; }).join('');
      if (placed.length === q.pool.length) check(placed.map(function (i) { return q.pool[i]; }).join(q.joiner));
    }
    function check(ans) {
      if (done) return;
      var q = cur, ok;
      if (q.tokens) ok = norm(ans) === norm(q.tokens.join(q.joiner));
      else ok = q.accept.some(function (a) { return norm(a) === norm(ans); });
      if (!ans.trim()) return;
      showResult(ok);
    }
    function showResult(ok) {
      var q = cur, fb = $('#qzFb'), last = !queue.length;
      $$('button, input', $('#modal')).forEach(function (b) { if (!/qzGo2/.test(b.id)) b.disabled = true; });
      var mustStop = !ok && o.mode === 'must';
      fb.hidden = false; fb.className = 'qz-fb ' + (ok ? 'good' : 'bad');
      fb.innerHTML = (ok ? '✅ <b>Đúng rồi!</b>' : '❌ <b>Chưa đúng.</b> ' + q.explain()) + '<div class="row"><button id="qzNext" class="btn big" data-q="next">' + (mustStop || last ? 'Xong ▶' : 'Câu tiếp ▶') + '</button></div>';
      var nb = $('#qzNext'); nb.disabled = false; nb.focus();
      if (ok) { NM.sfx.correct(); if (o.mode === 'practice') fixed.push(q.item); }
      else {
        NM.sfx.wrong(); failed.push(q.item);
        if (o.mode === 'practice' && !q.retried) { var q2 = NM.quizQ(q.item, q.kind); q2.retried = true; queue.push(q2); total++; failed.pop(); q.item._fixfail = true; }
        if (mustStop) queue = [];
      }
      NM.logQ({ id: q.item.id, form: q.kind, ok: ok ? 1 : 0, ms: 0, rep: 0, hint: hint, role: 'quiz' });
    }
    function finish() {
      if (done) return; done = true; document.removeEventListener('keydown', onKey); ui.closeModal();
      o.onDone({ ok: failed.length === 0, failed: failed, fixed: fixed });
    }
    function onKey(e) { if (e.key === 'Enter') { var nb = $('#qzNext'); if (nb) { e.preventDefault(); nb.click(); } else if ($('#qzIn')) { e.preventDefault(); check($('#qzIn').value); } } }
    document.addEventListener('keydown', onKey);
    $('#modal').onclick = function (e) {
      var b = e.target.closest('[data-q]'); if (!b || b.disabled) return;
      var a = b.getAttribute('data-q'), q = cur;
      if (a === 'say') NM.speak(q.audio);
      if (a === 'hint') { if (hint < 3) { hint++; $('#qzHint').textContent = '💡 ' + NM.hintMask(q.hintAns, hint); b.textContent = '💡 Gợi ý ' + hint + '/3'; if (hint >= 3) b.disabled = true; } }
      if (a === 'go') check($('#qzIn').value);
      if (a === 'pk') { placed.push(+b.getAttribute('data-i')); NM.sfx.click(); drawTiles(); }
      if (a === 'un') { placed.splice(+b.getAttribute('data-k'), 1); drawTiles(); }
      if (a === 'clr') { placed = []; drawTiles(); }
      if (a === 'next') next();
    };
    next();
  };

  /* ================= Khu giáo viên ================= */
  function pinGate(cb) {
    modal('<h2>🛠 Khu giáo viên</h2><p class="small">Nhập mã PIN (mặc định 2468)</p><input id="pin" class="inp" type="password" inputmode="numeric" maxlength="8" autocomplete="off"><div class="row"><button class="btn" data-act="pin-cancel">Huỷ</button><button class="btn big" data-act="pin-ok">Vào</button></div>');
    ui._pinCb = cb; setTimeout(function () { var i = $('#pin'); if (i) i.focus(); }, 80);
  }
  function teacherScreen(tab) {
    pendingTeacherTab = tab || pendingTeacherTab;
    var tabs = [['level', 'Mức độ'], ['forms', 'Dạng câu'], ['shop', 'Giá trang bị'], ['report', 'Báo cáo'], ['more', 'Cài đặt']];
    var th = '<nav class="tabs">' + tabs.map(function (t) { return '<button class="tab' + (pendingTeacherTab === t[0] ? ' on' : '') + '" data-act="ttab" data-t="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</nav>';
    var c = NM.db.cfg, body = '';
    if (pendingTeacherTab === 'level') {
      body = '<h3>Mức độ cho từng nhóm</h3><p class="small">Mức độ chỉ chỉnh tốc độ game (bục trôi, nước dâng), không xếp tương đương giữa các giáo trình.</p><table class="tb">' +
        NM.GROUPS.map(function (g) { return '<tr><td>' + g + '</td><td>' + sel('lvg', g, LV, c.groupLevel[g] || 'easy', fmtLv) + '</td></tr>'; }).join('') + '</table>' +
        '<h3>Mỗi bài thuộc nhóm nào</h3><table class="tb">' + NM.SETS.map(function (s) { return '<tr><td>' + s.icon + ' ' + esc(s.title) + '</td><td>' + sel('setg', s.id, NM.GROUPS, NM.setGroup(s), function (x) { return x; }) + '</td></tr>'; }).join('') + '</table>';
    } else if (pendingTeacherTab === 'forms') {
      var all = NM.V_FORMS.concat(NM.G_FORMS);
      body = '<h3>Bật / tắt dạng câu theo bài</h3><p class="small">Bỏ tick để tắt. Câu gõ chữ, xếp chữ của bóng cứu hộ và Fix it! luôn bật.</p><div class="scroll"><table class="tb"><tr><th>Dạng câu</th>' + NM.SETS.map(function (s) { return '<th>' + s.icon + '</th>'; }).join('') + '</tr>' +
        all.map(function (f) { return '<tr><td>' + NM.FORM_LABEL[f] + '</td>' + NM.SETS.map(function (s) {
          var ok = (s.kind === 'vocab') === (NM.V_FORMS.indexOf(f) >= 0); if (!ok) return '<td>–</td>';
          var on = !(c.forms[s.id] && c.forms[s.id][f] === false);
          return '<td><input type="checkbox" data-act="form" data-s="' + s.id + '" data-f="' + f + '"' + (on ? ' checked' : '') + '></td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
    } else if (pendingTeacherTab === 'shop') {
      body = '<h3>Giá trang bị (xu) theo cấp</h3><table class="tb"><tr><th></th><th>Cấp 1</th><th>Cấp 2</th><th>Cấp 3</th><th>Cấp 4</th><th>Cấp 5</th></tr>' +
        NM.EQUIP.map(function (e) { return '<tr><td>' + e.icon + ' ' + e.name + '</td>' + [0, 1, 2, 3, 4].map(function (i) { return '<td><input class="num" type="number" min="0" data-act="price" data-e="' + e.id + '" data-i="' + i + '" value="' + c.prices[e.id][i] + '"></td>'; }).join('') + '</tr>'; }).join('') + '</table>';
    } else if (pendingTeacherTab === 'report') {
      var names = Object.keys(NM.db.profiles), who = ui._who && NM.db.profiles[ui._who] ? ui._who : names[0];
      ui._who = who;
      body = '<h3>Báo cáo từ sai theo học sinh</h3>' + (names.length ? '<select data-act="who" class="inp">' + names.map(function (n) { return '<option' + (n === who ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('') + '</select>' : '<p>Chưa có học sinh nào.</p>');
      if (who) {
        var pw = NM.db.profiles[who].words, rows = Object.keys(pw).filter(function (id) { return NM.ITEMS[id] && pw[id].w > 0; }).sort(function (a, b) { return pw[b].w - pw[a].w; });
        body += '<p class="small">Xu: ' + NM.db.profiles[who].coins + ' · Số ván: ' + NM.db.profiles[who].games + ' · Điểm cao nhất: ' + (NM.db.profiles[who].hi || 0) + ' · Đang cần ôn (Fix it!): ' + NM.db.profiles[who].fix.length + '</p>' +
          '<div class="scroll"><table class="tb"><tr><th>Từ / câu</th><th>Sai</th><th>Lượt</th><th>Chính xác</th></tr>' + (rows.map(function (id) { var x = pw[id]; return '<tr><td>' + NM.shortExplain(NM.ITEMS[id]) + '</td><td>' + x.w + '</td><td>' + x.n + '</td><td>' + Math.round((x.n - x.w) / x.n * 100) + '%</td></tr>'; }).join('') || '<tr><td colspan="4">Chưa có từ sai 🎉</td></tr>') + '</table></div>';
      }
      body += '<div class="row"><button class="btn" data-act="csv">⬇ Tải CSV tất cả câu đã làm</button></div>';
    } else {
      body = '<h3>Cài đặt</h3><label class="small">Đổi mã PIN</label><input id="newpin" class="inp" maxlength="8" value="' + esc(c.pin) + '"><div class="row"><button class="btn" data-act="savepin">Lưu PIN</button></div>' +
        '<h3>Dữ liệu</h3><p class="small">Dữ liệu lưu trên thiết bị này (localStorage). Điểm tổng kết mỗi ván được gửi qua <code>NM.bridge.report()</code> (window.NMHubReport / postMessage) để nối với trang lịch sử.</p><div class="row"><button class="btn warn" data-act="wipe">🗑 Xoá toàn bộ dữ liệu</button></div>';
    }
    screen('<div class="wrap"><header class="bar"><button class="btn sm" data-act="' + (NM.db.cur ? 'home' : 'login') + '">⬅ Thoát</button><h2 style="margin:0">Khu giáo viên</h2><span></span></header>' + th + '<div class="card left">' + body + '</div></div>');
  }
  function sel(act, id, opts, cur, fmt) {
    return '<select class="inp sm" data-act="' + act + '" data-id="' + esc(id) + '">' + opts.map(function (o) { return '<option value="' + esc(o) + '"' + (o === cur ? ' selected' : '') + '>' + esc(fmt(o)) + '</option>'; }).join('') + '</select>';
  }
  function exportCSV() {
    var rows = ['thoi_gian,hoc_sinh,muc,dang_cau,dung,ms,lap,goi_y,vai_tro,het_gio'];
    NM.db.log.forEach(function (r) { rows.push([new Date(r.t).toISOString(), '"' + String(r.who || '').replace(/"/g, '""') + '"', r.id, r.form, r.ok, r.ms, r.rep, r.hint, r.role, r.to || 0].join(',')); });
    var blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'nhay-may-bao-cao.csv'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ================= Sự kiện chung ================= */
  function fixNow() {
    var p = NM.profile(), ids = uniqIds((G.wrongMap ? Object.keys(G.wrongMap) : []).concat(p.fix)).filter(function (id) { return NM.ITEMS[id]; }).slice(0, 10);
    if (!ids.length) return ui.home();
    G.inQuiz = true;
    ui.quiz({ items: ids.map(function (id) { return NM.ITEMS[id]; }), mode: 'practice', title: '🛠 Fix it! Sửa những chỗ đã sai', onDone: function (res) {
      G.inQuiz = false;
      var okIds = res.fixed.map(function (i) { return i.id; });
      p.fix = p.fix.filter(function (id) { return okIds.indexOf(id) < 0 || ids.indexOf(id) < 0 || res.failed.some(function (f) { return f.id === id; }); });
      p.fix = p.fix.filter(function (id) { return !(okIds.indexOf(id) >= 0 && !res.failed.some(function (f) { return f.id === id; })); });
      res.failed.forEach(function (f) { if (p.fix.indexOf(f.id) < 0) p.fix.push(f.id); });
      NM.save();
      modal('<h2>🛠 Fix it! xong rồi</h2><p class="lead">Đã sửa được <b>' + res.fixed.length + '</b> mục. ' + (res.failed.length ? 'Còn ' + res.failed.length + ' mục sẽ vào danh sách ôn buổi sau.' : 'Giỏi quá! 🌟') + '</p><div class="row"><button class="btn big" data-act="home">Về trang chủ</button></div>');
    } });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b || b.disabled) return;
    var a = b.getAttribute('data-act'), p = NM.db.cur ? NM.profile() : null;
    if (a === 'form' || a === 'price' || a === 'lvg' || a === 'setg' || a === 'who') return; // xử lý ở sự kiện change
    NM.audioInit(); if (a !== 'play' && a !== 'cont') NM.sfx.click();
    switch (a) {
      case 'login': doLogin($('#nm').value); break;
      case 'pickname': doLogin(b.getAttribute('data-n')); break;
      case 'switch': NM.db.cur = null; NM.save(); ui.login(); break;
      case 'toggle': var s = selectedSets(), id = b.getAttribute('data-id'), i = s.indexOf(id); if (i >= 0) s.splice(i, 1); else s.push(id); p.sel = s; NM.save(); ui.home(); break;
      case 'all': p.sel = NM.SETS.map(function (x) { return x.id; }); NM.save(); ui.home(); break;
      case 'none': p.sel = []; NM.save(); ui.home(); break;
      case 'pmode': var p2v = $('#p2'); if (p2v) { p.p2 = p2v.value.trim().slice(0, 12); NM.save(); } playMode = b.getAttribute('data-m'); ui.home(); break;
      case 'diff': diffMode = b.getAttribute('data-m'); ui.home(); break;
      case 'skin': p.skin = +b.getAttribute('data-i'); NM.save(); ui.home(); break;
      case 'play': begin(0); break;
      case 'ready': ui.closeModal(); var cbr = ui._readyCb; ui._readyCb = null; if (cbr) cbr(); break;
      case 'cont': var pr = p.progress[selectedSets().slice().sort().join('+')] || p.progress[(G.sets || []).slice().sort().join('+')]; begin(pr ? pr.round : 0); break;
      case 'shop': ui.shop(); break;
      case 'home': ui.home(); break;
      case 'how': ui.how(); break;
      case 'how2': ui.how(function () { NM.ui.pause(); }); break;
      case 'close-how': ui.closeModal(); var cb = ui._howCb; ui._howCb = null; if (cb) cb(); break;
      case 'mute': NM.db.settings.mute = !NM.db.settings.mute; NM.save(); ui.home(); break;
      case 'mute2': NM.db.settings.mute = !NM.db.settings.mute; NM.save(); NM.hudRefresh(); ui.pause(); break;
      case 'fx': NM.db.settings.reduce = !NM.db.settings.reduce; NM.save(); ui.home(); break;
      case 'fx2': NM.db.settings.reduce = !NM.db.settings.reduce; NM.save(); ui.pause(); break;
      case 'fix': fixNow(); break;
      case 'fixnow': fixNow(); break;
      case 'buy':
        var e2 = NM.EQUIP.filter(function (x) { return x.id === b.getAttribute('data-id'); })[0], lv = p.equip[e2.id], cost = NM.db.cfg.prices[e2.id][lv];
        if (lv < 5 && p.coins >= cost) { p.coins -= cost; p.equip[e2.id]++; NM.save(); NM.sfx.coin(); ui.shop('Đã mua ' + e2.icon + ' ' + e2.name + ' cấp ' + p.equip[e2.id] + '!'); }
        break;
      case 'resume': NM.togglePause(); break;
      case 'quit':
        if (!b._armed) { b._armed = true; b.textContent = '⚠️ Bấm lần nữa để thoát (lưu vòng này)'; setTimeout(function () { b._armed = false; b.textContent = '🏠 Thoát ván (lưu vòng này)'; }, 3500); }
        else { G.paused = false; NM.quitGame(); }
        break;
      case 'rr-next': ui.closeModal(); var cb2 = ui._rrCb; ui._rrCb = null; if (cb2) cb2(); break;
      case 'teacher': pinGate(function () { teacherScreen(); }); break;
      case 'pin-cancel': ui.closeModal(); break;
      case 'pin-ok': if ($('#pin').value === NM.db.cfg.pin) { var cbp = ui._pinCb; ui.closeModal(); cbp(); } else { $('#pin').value = ''; $('#pin').classList.add('shake'); } break;
      case 'ttab': teacherScreen(b.getAttribute('data-t')); break;
      case 'csv': exportCSV(); break;
      case 'savepin': var np = $('#newpin').value.trim(); if (np) { NM.db.cfg.pin = np; NM.save(); b.textContent = '✅ Đã lưu PIN mới'; } break;
      case 'wipe':
        if (!b._armed) { b._armed = true; b.textContent = '⚠️ Bấm lần nữa để xoá TẤT CẢ'; setTimeout(function () { b._armed = false; b.textContent = '🗑 Xoá toàn bộ dữ liệu'; }, 3500); }
        else { try { localStorage.removeItem('nhaymay.v2'); } catch (e) { /* bỏ qua */ } location.reload(); }
        break;
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target, a = t.getAttribute && t.getAttribute('data-act'); if (!a) return;
    var c = NM.db.cfg;
    if (a === 'form') { var s = t.getAttribute('data-s'), f = t.getAttribute('data-f'); c.forms[s] = c.forms[s] || {}; c.forms[s][f] = t.checked; }
    if (a === 'price') c.prices[t.getAttribute('data-e')][+t.getAttribute('data-i')] = Math.max(0, +t.value || 0);
    if (a === 'lvg') c.groupLevel[t.getAttribute('data-id')] = t.value;
    if (a === 'setg') c.setGroup[t.getAttribute('data-id')] = t.value;
    if (a === 'who') { ui._who = t.value; NM.save(); return teacherScreen('report'); }
    NM.save();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    if ($('#nm') && document.activeElement === $('#nm')) doLogin($('#nm').value);
    if ($('#pin') && document.activeElement === $('#pin')) $('[data-act="pin-ok"]').click();
  });

  /* HUD: nút trong ván */
  ui.bindStage = function () {
    $('#bPause').addEventListener('click', function () { NM.audioInit(); NM.togglePause(); });
    $('#bMute').addEventListener('click', function () { NM.toggleMute(); });
    $('#actbar').addEventListener('pointerdown', function (e) {      // ⬆ ⬇ phản hồi ngay khi chạm
      var b = e.target.closest('.mv'); if (!b) return;
      e.preventDefault(); NM.audioInit();
      if (b.getAttribute('data-a') === 'jump') NM.jump(); else NM.drop();
    });
    $('#actbar').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b || b.disabled) return;
      var a = b.getAttribute('data-a'); if (a === 'hint') NM.hint(); if (a === 'lens') NM.lens(); if (a === 'replay') NM.replay();
    });
  };

  ui.start = function () {
    NM.initStage(); ui.bindStage();
    if (NM.db.cur && NM.db.profiles[NM.db.cur]) ui.home(); else ui.login();
  };
})(window.NM);
