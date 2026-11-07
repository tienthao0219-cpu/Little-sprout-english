/* core.js: tiện ích, lưu trữ, âm thanh, đọc từ (TTS), hình minh họa */
window.NM = window.NM || {};
(function (NM) {
  'use strict';

  NM.$ = function (s, r) { return (r || document).querySelector(s); };
  NM.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  NM.rnd = function (a, b) { return a + Math.random() * (b - a); };
  NM.ri = function (a, b) { return Math.floor(NM.rnd(a, b + 1)); };
  NM.pick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
  NM.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  NM.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  NM.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- Đường dẫn ảnh (bản 1 file HTML nhúng sẵn ảnh qua window.NM_ASSETS) ---------- */
  NM.asset = function (name) { return (window.NM_ASSETS && window.NM_ASSETS[name]) || ('assets/' + name); };
  NM.loadImg = function (name) {
    var im = new Image();
    im.onload = function () { im.ok = true; if (NM.ui && NM.ui.refreshArt) NM.ui.refreshArt(); };
    im.onerror = function () { im.ok = false; };
    im.src = NM.asset(name);
    return im;
  };

  /* ---------- Lưu trữ ---------- */
  var KEY = 'nhaymay.v2' + (window.GAMESET ? ':hub:' + window.GAMESET.id : '');
  function defaults() {
    return {
      v: 2, profiles: {}, cur: null,
      settings: { mute: false, reduce: false },
      cfg: { prices: { shield: [30, 60, 100, 150, 220], lens: [25, 50, 80, 120, 180], slow: [30, 60, 100, 150, 220] }, pin: '2468', setGroup: {}, groupLevel: JSON.parse(JSON.stringify(NM.GROUP_LEVEL)), forms: {} },
      log: []
    };
  }
  NM.db = null;
  try { NM.db = JSON.parse(localStorage.getItem(KEY)); } catch (e) { NM.db = null; }
  if (!NM.db || NM.db.v !== 2) NM.db = defaults();
  NM.save = function () { try { localStorage.setItem(KEY, JSON.stringify(NM.db)); } catch (e) { /* chế độ riêng tư */ } };

  NM.profile = function () {
    var n = NM.db.cur;
    if (!n) return null;
    if (!NM.db.profiles[n]) NM.db.profiles[n] = { coins: 0, equip: { shield: 0, lens: 0, slow: 0 }, skin: 0, words: {}, fix: [], progress: {}, games: 0, hi: 0 };
    return NM.db.profiles[n];
  };
  NM.logQ = function (rec) {
    rec.t = Date.now(); rec.who = NM.db.cur;
    NM.db.log.push(rec);
    if (NM.db.log.length > 3000) NM.db.log.splice(0, NM.db.log.length - 3000);
  };

  /* ---------- Chỉ mục dữ liệu ---------- */
  NM.ITEMS = {};
  NM.ALLWORDS = [];
  NM.SETS.forEach(function (set) {
    set.cols = 3;
    if (set.kind === 'vocab') {
      set.items = set.words.map(function (w, i) {
        w.set = set; w.idx = i; w.id = set.id + ':' + w.w;
        var it = { id: w.id, type: 'v', set: set, w: w };
        NM.ITEMS[it.id] = it; NM.ALLWORDS.push(w);
        return it;
      });
    } else {
      set.items = set.items.map(function (g, i) {
        g.id = set.id + ':' + i; g.full = g.q.replace('___', g.a);
        var it = { id: g.id, type: 'g', set: set, g: g, tokens: g.full.split(' ') };
        NM.ITEMS[it.id] = it;
        return it;
      });
    }
    set.rows = Math.ceil(set.items.length / 3);
  });
  NM.setLevel = function (set) {
    var c = NM.db.cfg, g = c.setGroup[set.id] || set.group;
    return c.groupLevel[g] || 'easy';
  };
  NM.setGroup = function (set) { return NM.db.cfg.setGroup[set.id] || set.group; };
  NM.LEVEL_NAME = { easy: 'Dễ', normal: 'Vừa', hard: 'Khó' };

  /* ---------- Trang bị ---------- */
  NM.EQUIP = [
    { id: 'shield', name: 'Khiên mây', icon: '🛡️', desc: function (l) { return l ? 'Chặn mất tim ' + NM.charges(l) + ' lần mỗi ván' : 'Chặn mất tim 1 / 2 / 3 lần mỗi ván (cấp 1 / 3 / 5)'; } },
    { id: 'lens', name: 'Kính hiển hình', icon: '🔍', desc: function (l) { return l ? 'Hiện hình minh họa ' + NM.charges(l) + ' lần mỗi vòng' : 'Hiện hình của từ đang hỏi 1 / 2 / 3 lần mỗi vòng'; } },
    { id: 'slow', name: 'Nước chậm', icon: '🌊', desc: function (l) { return l ? 'Nước dâng chậm hơn ' + (l * 10) + '%' : 'Nước dâng chậm hơn 10% mỗi cấp'; } }
  ];
  NM.charges = function (l) { return [0, 1, 1, 2, 2, 3][l] || 0; };

  /* ---------- Âm thanh ---------- */
  var ac = null, unlocked = false;
  NM.audioInit = function () {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ac = null; } }
    if (ac && ac.state !== 'running') { try { ac.resume(); } catch (e) { /* bỏ qua */ } }
    if (ac && !unlocked) {   // iOS/Safari: phát 1 tiếng im lặng trong lần chạm đầu tiên để mở khoá âm thanh
      try { var b = ac.createBuffer(1, 1, 22050), s = ac.createBufferSource(); s.buffer = b; s.connect(ac.destination); s.start(0); unlocked = true; } catch (e) { /* bỏ qua */ }
    }
    if (NM.canSpeak && !NM._ttsUnlocked) {
      try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); NM._ttsUnlocked = true; } catch (e) { /* bỏ qua */ }
    }
  };
  ['touchend', 'pointerup', 'click', 'keydown'].forEach(function (n) { document.addEventListener(n, function () { NM.audioInit(); }, { passive: true }); });
  var lastTone = 0;
  function tone(f, d, type, vol, delay, slideTo) {
    if (!ac || NM.db.settings.mute) return;
    if (ac.state !== 'running') { try { ac.resume(); } catch (e) { /* bỏ qua */ } return; }
    try {
      var t0 = ac.currentTime + (delay || 0) + 0.01, o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + d);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol || 0.12, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + d + 0.05);
    } catch (e) { /* bỏ qua */ }
  }
  NM.sfx = {
    bounce: function () { },   // nảy liên tục nên không phát tiếng (tránh ù ù); chỉ phát khi nảy lên bục đáp án
    land: function () { tone(420, 0.07, 'sine', 0.05, 0, 600); },
    select: function () { tone(660, 0.1, 'triangle', 0.09); },
    correct: function () { tone(523, 0.12, 'triangle', 0.11); tone(659, 0.12, 'triangle', 0.11, 0.1); tone(784, 0.2, 'triangle', 0.11, 0.2); },
    step: function () { tone(740, 0.12, 'triangle', 0.1); },
    wrong: function () { tone(330, 0.18, 'triangle', 0.1); tone(262, 0.28, 'triangle', 0.1, 0.16); },
    coin: function () { tone(988, 0.06, 'triangle', 0.07); tone(1319, 0.12, 'triangle', 0.07, 0.06); },
    hit: function () { tone(200, 0.16, 'triangle', 0.1, 0, 110); },
    win: function () { [523, 659, 784, 1047].forEach(function (f, i) { tone(f, 0.18, 'triangle', 0.11, i * 0.12); }); },
    lose: function () { [392, 330, 262, 196].forEach(function (f, i) { tone(f, 0.22, 'sine', 0.1, i * 0.15); }); },
    click: function () { tone(500, 0.05, 'sine', 0.06); },
    chomp: function () { tone(170, 0.07, 'square', 0.07); tone(120, 0.1, 'square', 0.07, 0.08); }
  };

  /* ---------- Đọc từ (TTS) ---------- */
  NM.canSpeak = ('speechSynthesis' in window) && ('SpeechSynthesisUtterance' in window);
  var voice = null;
  function findVoice() {
    if (!NM.canSpeak) return;
    var vs = speechSynthesis.getVoices() || [];
    voice = vs.filter(function (v) { return /^en[-_]US/i.test(v.lang); })[0] || vs.filter(function (v) { return /^en/i.test(v.lang); })[0] || null;
  }
  if (NM.canSpeak) { findVoice(); try { speechSynthesis.onvoiceschanged = findVoice; } catch (e) { /* bỏ qua */ } }
  var speakTimer = 0;
  NM.speak = function (text) {
    if (!NM.canSpeak || NM.db.settings.mute) return;
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
      clearTimeout(speakTimer);
      speakTimer = setTimeout(function () {
        try {
          var u = new SpeechSynthesisUtterance(text);
          u.lang = 'en-US'; u.rate = 0.85; u.pitch = 1; u.volume = 1;
          if (!voice) findVoice();
          if (voice) u.voice = voice;
          speechSynthesis.resume(); speechSynthesis.speak(u);
        } catch (e) { /* bỏ qua */ }
      }, 120);
    } catch (e) { /* bỏ qua */ }
  };

  /* ---------- Ảnh nhân vật (tuỳ chọn): assets/chars.png, lưới 3x3 = 9 nhân vật ---------- */
  NM.chars = new Image();
  NM.chars.onload = function () { NM.chars.ok = true; if (NM.ui && NM.ui.refreshSkins) NM.ui.refreshSkins(); };
  NM.chars.onerror = function () { NM.chars.ok = false; };
  NM.chars.src = NM.asset('chars.png');

  /* ---------- Ảnh đồ hoạ trong game (nếu có file thì dùng, không có thì vẽ bằng code) ---------- */
  NM.ART = {
    croc: NM.loadImg('croc.png'), plank: NM.loadImg('plank.png'), pads: NM.loadImg('pads.png'), icons: NM.loadImg('icons.png'),
    bgs: [NM.loadImg('bg1.jpg'), NM.loadImg('bg2.jpg'), NM.loadImg('bg3.jpg'), NM.loadImg('bg4.jpg')], cover: NM.loadImg('cover.jpg')
  };
  NM.SPR = { croc: { n: 6, cw: 300, ch: 193 }, plank: { n: 3, cw: 300, ch: 78 }, pads: { n: 6, cw: 300, ch: 96 } };
  NM.ICON = { coin: 0, heart: 1, broken: 2, shield: 3, star: 4, lens: 5, bulb: 6, speaker: 7, trophy: 8 };
  NM.EMO = ['🪙', '❤️', '🖤', '🛡️', '⭐', '🔍', '💡', '🔊', '🏆'];
  NM.drawIcon = function (ctx, i, cx, cy, size) {
    var im = NM.ART.icons; if (!im.ok) return false;
    var k = im.naturalWidth / 3; ctx.drawImage(im, (i % 3) * k, Math.floor(i / 3) * k, k, k, cx - size / 2, cy - size / 2, size, size); return true;
  };
  NM.icoHTML = function (name, size) {
    var i = NM.ICON[name], im = NM.ART.icons;
    if (im.ok) return '<i class="ico" style="width:' + size + 'px;height:' + size + 'px;background-image:url(' + NM.asset('icons.png') + ');background-position:' + ((i % 3) * 50) + '% ' + (Math.floor(i / 3) * 50) + '%"></i>';
    return '<span class="emo" style="font-size:' + Math.round(size * 0.85) + 'px">' + NM.EMO[i] + '</span>';
  };

  /* ---------- Hình minh họa: sprite sheet 3x3, không có thì dùng emoji ---------- */
  NM.imgs = {};
  NM.loadSheets = function (setIds) {
    setIds.forEach(function (id) {
      var set = NM.SETS.filter(function (s) { return s.id === id; })[0];
      if (!set || !set.sheet || NM.imgs[set.sheet]) return;
      var im = new Image();
      im.onload = function () { im.ok = true; };
      im.onerror = function () { im.ok = false; };
      im.src = NM.asset(set.sheet + '.png');
      NM.imgs[set.sheet] = im;
    });
  };
  NM.wimg = function (w) {
    if (!w.img) return null;
    if (!w._im) { var im = new Image(); im.onload = function () { im.ok = true; }; im.onerror = function () { im.ok = false; }; im.src = w.img; w._im = im; }
    return w._im;
  };
  NM.drawPic = function (ctx, w, cx, cy, size) {
    if (w.img) { var wi = NM.wimg(w); if (wi && wi.ok) { var k = Math.min(size / wi.naturalWidth, size / wi.naturalHeight), dw = wi.naturalWidth * k, dh = wi.naturalHeight * k; ctx.drawImage(wi, cx - dw / 2, cy - dh / 2, dw, dh); } return; }
    var set = w.set, im = set && set.sheet ? NM.imgs[set.sheet] : null;
    if (im && im.ok) {
      var cw = im.naturalWidth / set.cols, ch = im.naturalHeight / set.rows;
      ctx.drawImage(im, (w.idx % set.cols) * cw, Math.floor(w.idx / set.cols) * ch, cw, ch, cx - size / 2, cy - size / 2, size, size);
    } else {
      ctx.save();
      ctx.font = Math.round(size * 0.78) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(w.e, cx, cy + size * 0.04);
      ctx.restore();
    }
  };
  NM.picHTML = function (w, size) {
    if (w.img) { NM.wimg(w); return '<span class="pic" style="width:' + size + 'px;height:' + size + 'px;background-image:url(' + w.img + ');background-size:contain;background-repeat:no-repeat;background-position:center"></span>'; }
    var set = w.set, im = set && set.sheet ? NM.imgs[set.sheet] : null;
    if (im && im.ok) {
      var col = w.idx % set.cols, row = Math.floor(w.idx / set.cols);
      var px = set.cols > 1 ? col / (set.cols - 1) * 100 : 0, py = set.rows > 1 ? row / (set.rows - 1) * 100 : 0;
      return '<span class="pic" style="width:' + size + 'px;height:' + size + 'px;background-image:url(' + NM.asset(set.sheet + '.png') + ');background-size:' + (set.cols * 100) + '% ' + (set.rows * 100) + '%;background-position:' + px + '% ' + py + '%"></span>';
    }
    return '<span class="pic emo" style="font-size:' + Math.round(size * 0.8) + 'px;width:' + size + 'px;height:' + size + 'px;line-height:' + size + 'px">' + w.e + '</span>';
  };

  /* ---------- Gợi ý: 1 = chữ đầu, 2 = đầu + giữa, 3 = đầu + giữa + cuối ---------- */
  NM.hintMask = function (ans, level) {
    var chars = ans.split(''), n = chars.length, keep = {};
    var letters = []; chars.forEach(function (c, i) { if (/[^\s\-'’.,!?\/]/.test(c)) letters.push(i); });
    if (!letters.length) return ans;
    var first = letters[0], last = letters[letters.length - 1], mid = letters[Math.floor((letters.length - 1) / 2)];
    if (level >= 1) keep[first] = 1;
    if (level >= 2) keep[mid] = 1;
    if (level >= 3) keep[last] = 1;
    return chars.map(function (c, i) {
      if (keep[i] || letters.indexOf(i) < 0) return c;
      return '_';
    }).join('').split('').join(' ').replace(/ {3,}/g, '   ');
  };

  /* ---------- Cầu nối báo điểm sang website / hub ---------- */
  NM.bridge = {
    report: function (payload) {
      try {
        if (typeof window.NMHubReport === 'function') window.NMHubReport(payload);
        if (window.parent && window.parent !== window) window.parent.postMessage({ source: 'nhay-may-tu-vung', type: 'result', payload: payload }, '*');
      } catch (e) { /* bỏ qua */ }
    }
  };
})(window.NM);
