/* questions.js: tạo kế hoạch ván chơi, sinh câu hỏi cho bục (pick/order) và câu gõ/xếp (quiz) */
(function (NM) {
  'use strict';
  var shuffle = NM.shuffle, pick = NM.pick, ri = NM.ri;

  NM.FORM_LABEL = {
    pic2en: 'Hình → từ tiếng Anh', en2vi: 'Anh → Việt', vi2en: 'Việt → Anh', def2en: 'Định nghĩa → từ',
    listen2word: 'Nghe chọn từ', listen2pic: 'Nghe chọn hình', tf: 'Đúng / Sai theo hình',
    missing: 'Chữ cái còn thiếu', spell: 'Ghép chữ (nhảy đúng thứ tự)', sent: 'Điền từ vào câu',
    g_fill: 'Ngữ pháp: điền từ', g_mcq: 'Ngữ pháp: chọn câu đúng', g_order: 'Ngữ pháp: sắp xếp câu'
  };
  NM.V_FORMS = ['pic2en', 'en2vi', 'vi2en', 'def2en', 'listen2word', 'listen2pic', 'tf', 'missing', 'spell', 'sent'];
  NM.G_FORMS = ['g_fill', 'g_mcq', 'g_order'];

  /* ---------- Dạng câu hợp lệ cho một mục ---------- */
  function eligible(item, round, boss) {
    var off = NM.db.cfg.forms[item.set.id] || {}, list;
    if (item.type === 'v') {
      var w = item.w, L = w.w.length;
      list = ['pic2en', 'en2vi', 'vi2en', 'def2en', 'tf', 'sent'];
      if (NM.canSpeak) list.push('listen2word', 'listen2pic');
      if (L >= 3) list.push('missing');
      if (!boss && round >= 2 && L >= 3 && L <= 6 && /^[a-z]+$/.test(w.w)) list.push('spell');
      if (window.GAMESET) list = list.filter(function (f) { return !(f === 'def2en' && !w.d) && !(f === 'sent' && !w.s) && !(NM.HUB_NOPIC && (f === 'pic2en' || f === 'tf' || f === 'listen2pic')); });
    } else {
      list = ['g_fill', 'g_mcq'];
      if (!boss && round >= 2 && item.tokens.length >= 3 && item.tokens.length <= 6) list.push('g_order');
    }
    var f = list.filter(function (x) { return off[x] !== false; });
    if (!f.length) f = item.type === 'v' ? ['en2vi'] : ['g_fill'];
    return f;
  }
  NM.eligibleForms = eligible;

  NM.pickForm = function (item, round, used, boss, prev) {
    var list = eligible(item, round, boss);
    var fresh = list.filter(function (f) { return used.indexOf(f) < 0; });
    if (!fresh.length) fresh = list.filter(function (f) { return f !== prev; });
    if (!fresh.length) fresh = list;
    var ws = fresh.map(function (f) {
      var w = 1;
      if (f === 'spell' || f === 'g_order') w = 3;
      if (f === prev) w *= 0.3;
      return w;
    });
    var sum = ws.reduce(function (a, b) { return a + b; }, 0), r = Math.random() * sum;
    for (var i = 0; i < fresh.length; i++) { r -= ws[i]; if (r <= 0) return fresh[i]; }
    return fresh[fresh.length - 1];
  };

  /* ---------- Kế hoạch ván ---------- */
  NM.planSize = function (P) {
    if (P < 6) return null;
    if (P >= 20) return { rounds: 4, total: 60, full: true };
    if (P >= 12) return { rounds: 4, total: 3 * P, full: false };
    return { rounds: 1, total: 15, full: false, mini: true };
  };
  NM.buildPlan = function (items) {
    var P = items.length, sz = NM.planSize(P);
    if (!sz) return null;
    var seq = [], counts = {}, guard = 0;
    while (seq.length < sz.total && guard++ < 10) {
      shuffle(items).forEach(function (it) {
        if (seq.length >= sz.total) return;
        if ((counts[it.id] || 0) >= 3) return;
        counts[it.id] = (counts[it.id] || 0) + 1; seq.push(it);
      });
    }
    var base = Math.floor(seq.length / sz.rounds), extra = seq.length % sz.rounds, pos = 0, used = {}, prev = null, rounds = [];
    for (var r = 0; r < sz.rounds; r++) {
      var n = base + (r < extra ? 1 : 0), arr = [];
      for (var i = 0; i < n; i++) {
        var it = seq[pos++];
        used[it.id] = used[it.id] || [];
        var f = NM.pickForm(it, r, used[it.id], false, prev);
        used[it.id].push(f); prev = f;
        arr.push({ item: it, form: f });
      }
      rounds.push(arr);
    }
    return { rounds: rounds, total: seq.length, mini: !!sz.mini };
  };

  /* ---------- Đáp án nhiễu ---------- */
  function distract(w, pool, n, round, forceFar) {
    function bad(x) { return x === w || x.vi === w.vi || (w.alt || []).indexOf(x.w) >= 0 || (x.alt || []).indexOf(w.w) >= 0; }
    var c = pool.filter(function (x) { return !bad(x); });
    var near = round >= 2 && !forceFar;
    var pref = c.filter(function (x) { return near ? x.topic === w.topic : x.topic !== w.topic; });
    var out = shuffle(pref).concat(shuffle(c.filter(function (x) { return pref.indexOf(x) < 0; })));
    if (out.length < n) out = out.concat(shuffle(NM.ALLWORDS.filter(function (x) { return !bad(x) && out.indexOf(x) < 0; })));
    var seen = {}, res = [];
    out.forEach(function (x) { if (!seen[x.w] && !seen[x.vi]) { seen[x.w] = 1; seen[x.vi] = 1; res.push(x); } });
    return res.slice(0, n);
  }
  function letterDistract(c, n) {
    var vow = 'aeiou', isV = vow.indexOf(c) >= 0;
    var pl = 'abcdefghijklmnopqrstuvwxyz'.split('').filter(function (l) { return l !== c && (vow.indexOf(l) >= 0) === isV; });
    return shuffle(pl).slice(0, n);
  }
  function chosenNote(a, fmt) { return a && a.ref ? ' ' + fmt(a.ref) : ''; }

  /* ---------- Câu hỏi cho bục ---------- */
  NM.makeQ = function (item, form, ctx) {
    var round = ctx.round, na = (ctx.diff === 'easy' && round < 2) ? 3 : 4, pool = ctx.pool;
    var q = { item: item, form: form, kind: 'pick', ins: '', main: '', pic: null, audio: null, auto: false, answers: [], hint: null, explain: null, role: 'main' };
    if (item.type === 'v') {
      var w = item.w;
      var wordAns = function (fn, far) {
        var ds = distract(w, pool, na - 1, round, far);
        return [{ label: fn(w), ok: true, ref: w }].concat(ds.map(function (d) { return { label: fn(d), ok: false, ref: d }; }));
      };
      switch (form) {
        case 'pic2en':
          q.ins = 'Hình này là gì? Chọn từ tiếng Anh'; q.pic = w; q.audio = w.w; q.hint = w.w;
          q.answers = wordAns(function (x) { return x.w; });
          q.explain = function (a) { return 'Hình này là <b>' + w.w + '</b> (' + w.vi + ').' + chosenNote(a, function (r) { return '“' + r.w + '” nghĩa là ' + r.vi + '.'; }); };
          break;
        case 'en2vi':
          q.ins = 'Từ này nghĩa là gì?'; q.main = w.w; q.audio = w.w; q.hint = w.vi;
          q.answers = wordAns(function (x) { return x.vi; });
          q.explain = function (a) { return '“' + w.w + '” nghĩa là <b>' + w.vi + '</b>.' + chosenNote(a, function (r) { return '“' + r.vi + '” là nghĩa của “' + r.w + '”.'; }); };
          break;
        case 'vi2en':
          q.ins = 'Từ tiếng Anh nào có nghĩa là…'; q.main = w.vi; q.hint = w.w;
          q.answers = wordAns(function (x) { return x.w; });
          q.explain = function (a) { return '“' + w.vi + '” trong tiếng Anh là <b>' + w.w + '</b>.' + chosenNote(a, function (r) { return '“' + r.w + '” nghĩa là ' + r.vi + '.'; }); };
          break;
        case 'def2en':
          q.ins = 'Đoán từ theo định nghĩa'; q.main = w.d; q.hint = w.w;
          q.answers = wordAns(function (x) { return x.w; });
          q.explain = function (a) { return '“' + w.d + '” là <b>' + w.w + '</b> (' + w.vi + ').' + chosenNote(a, function (r) { return '“' + r.w + '” nghĩa là ' + r.vi + '.'; }); };
          break;
        case 'listen2word':
          q.ins = 'Nghe và chọn từ đúng'; q.main = '🔊'; q.audio = w.w; q.auto = true; q.hint = w.w;
          q.answers = wordAns(function (x) { return x.w; });
          q.explain = function (a) { return 'Từ em nghe là <b>' + w.w + '</b> (' + w.vi + ').' + chosenNote(a, function (r) { return '“' + r.w + '” nghĩa là ' + r.vi + '.'; }); };
          break;
        case 'listen2pic':
          q.ins = 'Nghe và chọn hình đúng'; q.main = '🔊'; q.audio = w.w; q.auto = true;
          q.answers = wordAns(function (x) { return x.w; }).map(function (a) { a.pic = a.ref; return a; });
          q.explain = function (a) { return 'Từ em nghe là <b>' + w.w + '</b> (' + w.vi + ').' + chosenNote(a, function (r) { return 'Hình em chọn là “' + r.w + '” (' + r.vi + ').'; }); };
          break;
        case 'tf':
          var truth = Math.random() < 0.5, shown = truth ? w : distract(w, pool, 1, round, true)[0] || w;
          if (shown === w) truth = true;
          q.ins = 'Đúng hay sai? Hình và từ có khớp nhau không?'; q.pic = w; q.main = '“' + shown.w + '”';
          q.answers = [{ label: 'Đúng ✓', ok: truth }, { label: 'Sai ✗', ok: !truth }];
          q.explain = function () { return 'Hình này là <b>' + w.w + '</b> (' + w.vi + ')' + (truth ? ', nên “' + shown.w + '” là <b>đúng</b>.' : ', không phải “' + shown.w + '”, nên đáp án là <b>Sai</b>.'); };
          break;
        case 'missing':
          var L = w.w.length, mi = ri(0, L - 1), miss = w.w.charAt(mi);
          q.ins = 'Chọn chữ cái còn thiếu'; q.pic = w;
          q.main = w.w.split('').map(function (c, i) { return i === mi ? '_' : c; }).join(' ');
          q.answers = [{ label: miss, ok: true }].concat(letterDistract(miss, na - 1).map(function (l) { return { label: l, ok: false }; }));
          q.letters = true;
          q.explain = function () { return 'Từ đúng là <b>' + w.w + '</b> (' + w.vi + '). Chữ còn thiếu là <b>' + miss + '</b>.'; };
          break;
        case 'spell':
          q.kind = 'order'; q.ins = 'Nhảy lên từng chữ cái theo đúng thứ tự để ghép từ'; q.pic = w; q.sub = w.vi;
          q.tokens = w.w.split(''); q.letters = true; q.joiner = '';
          q.explain = function (a, pos) { return 'Từ đúng là <b>' + w.w.split('').join('-') + '</b> (' + w.vi + ').' + (a ? ' Chữ tiếp theo phải là “' + w.w.charAt(pos || 0) + '”.' : ''); };
          break;
        case 'sent':
          q.ins = 'Điền từ còn thiếu vào câu'; q.main = w.s; q.hint = w.w;
          q.answers = wordAns(function (x) { return x.w; }, true);
          q.explain = function (a) { return 'Câu đúng: “' + w.s.replace('___', '<b>' + w.w + '</b>') + '” (' + w.w + ' = ' + w.vi + ').' + chosenNote(a, function (r) { return '“' + r.w + '” nghĩa là ' + r.vi + ' nên chưa hợp nghĩa.'; }); };
          break;
      }
    } else {
      var g = item.g, subst = function (o) { return g.q.replace('___', o); };
      switch (form) {
        case 'g_fill':
          q.ins = 'Chọn từ điền vào chỗ trống'; q.main = g.q; q.hint = g.a;
          q.answers = [{ label: g.a, ok: true }].concat(shuffle(g.o).slice(0, na - 1).map(function (o) { return { label: o, ok: false }; }));
          q.explain = function (a) { return 'Đáp án đúng: <b>' + g.full + '</b> ' + g.x + (a ? ' Câu “' + subst(a.label) + '” chưa đúng.' : ''); };
          break;
        case 'g_mcq':
          q.ins = 'Chọn câu đúng ngữ pháp';
          q.answers = [{ label: g.full, ok: true }].concat(shuffle(g.o).slice(0, na - 1).map(function (o) { return { label: subst(o), ok: false }; }));
          q.explain = function () { return 'Câu đúng: <b>' + g.full + '</b> ' + g.x; };
          break;
        case 'g_order':
          q.kind = 'order'; q.ins = 'Nhảy lên từng từ theo đúng thứ tự để ghép câu';
          q.tokens = item.tokens.slice(); q.letters = false; q.joiner = ' ';
          q.explain = function () { return 'Câu đúng: <b>' + g.full + '</b> ' + g.x; };
          break;
      }
    }
    return q;
  };

  /* ---------- Câu gõ / xếp (dùng cho bóng cứu hộ & Fix it!) ---------- */
  NM.quizQ = function (item, avoid) {
    var kinds, q = { item: item };
    if (item.type === 'v') {
      kinds = ['q_type', 'q_fill', 'q_scr'];
      if (NM.canSpeak) kinds.push('q_listen');
      if (!/^[a-z]{3,8}$/.test(item.w.w)) kinds = kinds.filter(function (k) { return k !== 'q_scr'; });
    } else {
      kinds = ['g_type', 'g_scr'];
      if (item.tokens.length < 3 || item.tokens.length > 8) kinds = ['g_type'];
    }
    var ks = kinds.filter(function (k) { return k !== avoid; });
    q.kind = pick(ks.length ? ks : kinds);
    if (item.type === 'v') {
      var w = item.w;
      q.accept = [w.w]; q.hintAns = w.w;
      q.explain = function () { return 'Đáp án đúng: <b>' + w.w + '</b> (' + w.vi + ').'; };
      if (q.kind === 'q_type') { q.ins = 'Gõ từ tiếng Anh'; q.pic = w; q.main = w.vi; q.accept = [w.w].concat(w.alt || []); }
      if (q.kind === 'q_fill') { q.ins = 'Điền từ còn thiếu vào câu'; q.main = w.s; }
      if (q.kind === 'q_listen') { q.ins = 'Nghe rồi gõ lại từ'; q.main = '🔊'; q.audio = w.w; }
      if (q.kind === 'q_scr') {
        q.ins = 'Sắp xếp các chữ cái thành từ'; q.pic = w; q.main = w.vi;
        q.tokens = w.w.split(''); q.joiner = '';
      }
    } else {
      var g = item.g;
      q.accept = [g.a]; q.hintAns = g.a;
      q.explain = function () { return 'Đáp án đúng: <b>' + g.full + '</b> ' + g.x; };
      if (q.kind === 'g_type') { q.ins = 'Điền từ vào chỗ trống'; q.main = g.q; }
      if (q.kind === 'g_scr') { q.ins = 'Sắp xếp các từ thành câu đúng'; q.tokens = item.tokens.slice(); q.joiner = ' '; }
    }
    if (q.tokens) {
      var sh = q.tokens, tries = 0;
      do { sh = shuffle(q.tokens); tries++; } while (sh.join(q.joiner) === q.tokens.join(q.joiner) && tries < 10);
      q.pool = sh;
    }
    return q;
  };
  NM.shortExplain = function (item) {
    if (item.type === 'v') return '<b>' + item.w.w + '</b> = ' + item.w.vi;
    return '<b>' + item.g.full + '</b> — ' + item.g.x;
  };
})(window.NM);
