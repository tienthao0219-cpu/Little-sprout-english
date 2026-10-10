/* Luyện tập (kiểm tra từng câu, gợi ý, Fix it!), âm thanh, xu, cửa hàng avatar.
   Dữ liệu xu/avatar/thú nuôi lưu trong profile.js (đồng bộ lên Google Sheets). */
window.LSE = window.LSE || {};
(function (L) {
  const { h, shuffle } = L;
  const safe = f => { try { return f(); } catch (e) { return null; } };

  /* ================= Âm thanh (tự tạo bằng WebAudio, không cần file) ================= */
  let ac = null;
  const muted = () => safe(() => localStorage.getItem("lse_mute") === "1");
  function tone(freq, t0, dur, type, vol) {
    if (muted()) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ac = ac || new AC(); if (ac.state === "suspended") ac.resume();
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + t0;
      o.type = type || "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || 0.14, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.02);
    } catch (e) { }
  }
  const sfx = {
    ok() { tone(659, 0, .12, "sine"); tone(880, .1, .2, "sine"); },
    bad() { tone(220, 0, .16, "sawtooth", .09); tone(165, .12, .24, "sawtooth", .08); },
    coin() { tone(988, 0, .08, "square", .06); tone(1319, .07, .22, "square", .06); },
    flip() { tone(420, 0, .05, "triangle", .08); },
    win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .11, .25, "sine", .13)); },
    muted, toggle() { safe(() => localStorage.setItem("lse_mute", muted() ? "0" : "1")); return muted(); }
  };
  L.sfx = sfx;

  const prof = L.prof; /* hồ sơ (xu, avatar...) nằm trong profile.js, đồng bộ lên Google Sheets */
  const SVG_COIN = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FFD66B"/><circle cx="12" cy="12" r="7.2" fill="none" stroke="#F2A93B" stroke-width="1.6"/><path d="M12 7.6v8.8M9.6 10.2c0-1.1 1-1.7 2.4-1.7s2.4.6 2.4 1.7c0 2-4.8 1.1-4.8 3.4 0 1.1 1.1 1.8 2.4 1.8s2.4-.7 2.4-1.8" fill="none" stroke="#C97B12" stroke-width="1.3" stroke-linecap="round"/></svg>';
  L.coinSvg = SVG_COIN;
  L.fly = (txt, from) => {
    const el = h("div.fly", txt); const r = (from && from.getBoundingClientRect && from.getBoundingClientRect()) || { left: innerWidth / 2, top: innerHeight / 2, width: 0 };
    el.style.left = (r.left + r.width / 2) + "px"; el.style.top = r.top + "px"; document.body.appendChild(el); setTimeout(() => el.remove(), 1300);
  };

  /* ================= Gợi ý (tốn xu) ================= */
  const HINT_COST = 2;
  const canHint = q => ["mcq1", "pick", "fill", "fillhint", "short", "scramble", "errfix", "transform"].includes(q.type);
  function applyHint(q, st) {
    switch (q.type) {
      case "mcq1": case "pick": {
        const okIdx = q.type === "pick" ? q.opts.findIndex(o => o.ok) : q.opts.findIndex(o => o.ok);
        const wrong = q.opts.map((o, i) => i).filter(i => i !== okIdx && !(st.hid || []).includes(i) && st.v !== i);
        if (wrong.length < 2) return false; st.hid = (st.hid || []).concat(wrong[Math.floor(Math.random() * wrong.length)]); return true;
      }
      case "fill": case "fillhint": {
        const bs = q.parts.filter(p => p.k === "b"); const i = bs.findIndex((b, k) => !st.v[k]); if (i < 0) return false;
        st.hnt = st.hnt || []; st.hnt[i] = bs[i].answers[0].slice(0, 1) + "…  (" + bs[i].answers[0].length + " chữ cái)"; return true;
      }
      case "short": { st.hnt = q.answers[0].slice(0, 1) + "…  (" + q.answers[0].length + " chữ cái)"; return true; }
      case "transform": {
        if (q.parts) { const bs = q.parts.filter(p => p.k === "b"); const i = bs.findIndex((b, k) => !st.v[k]); if (i < 0) return false; const w0 = bs[i].answers[0].split(/\s+/); st.hnt = st.hnt || []; st.hnt[i] = w0.slice(0, Math.max(1, Math.ceil(w0.length / 3))).join(" ") + " …  (" + w0.length + " từ)"; return true; }
        const w = q.answers[0].split(/\s+/); st.hnt = "Gợi ý: " + w.slice(0, Math.max(2, Math.ceil(w.length / 3))).join(" ") + " …"; return true; }
      case "errfix": { const i = q.toks.findIndex(t => t.ok); if (st.v.pick === i) return false; st.v.pick = i; return true; }
      case "scramble": {
        const want = q.ans.replace(/\s/g, "").split(""); let k = 0;
        while (k < st.v.length && q.lt[st.v[k]].toLowerCase() === want[k].toLowerCase()) k++;
        st.v.length = k; if (k >= want.length) return false;
        const idx = q.lt.findIndex((x, i) => x.toLowerCase() === want[k].toLowerCase() && !st.v.includes(i)); if (idx < 0) return false; st.v.push(idx); return true;
      }
    }
    return false;
  }

  /* ================= Chế độ luyện tập ================= */
  const subRuntime = (rt, qs) => {
    const n = { sec: rt.sec, parsed: rt.parsed, sts: {}, secSt: { sel: null }, qs };
    qs.forEach(q => n.sts[q.id] = L.hw.initState(q));
    if (rt.sec.type === "fillbank") n.bank = shuffle((rt.parsed.bank || []).map((w, i) => ({ w, i })));
    return n;
  };

  async function practiceView(id) {
    const ui = L.ui; ui.show(ui.spinner()); await ui.loadManifest();
    let hw;
    try { hw = (await L.api.call("hwGet", { id })).hw; try { await L.imgs.load(); } catch (e) { } }
    catch (e) { ui.show(h("div.card", h("div.err", e.message), h("p", h("a.btn", { href: "#/hw" }, "← Danh sách bài tập")))); return; }
    let rts = (hw.sections || []).map(sec => L.hw.buildRuntime(sec));
    startPractice(hw.title, rts, { back: "#/hw", hwId: hw.id });
  }

  function startPractice(title, rts, o) {
    const ui = L.ui; const stat = { combo: 0, best: 0, coins: 0 };
    const root = h("div"), summary = h("div");
    const allQ = () => rts.flatMap(rt => rt.qs.map(q => ({ rt, q, st: rt.sts[q.id] })));
    const header = h("div.card.pracbar");
    const paintBar = () => {
      const all = allQ(), done = all.filter(x => x.st.chk).length;
      header.innerHTML = "";
      header.append(h("div.row", h("b", "🎮 Luyện tập"), h("span.pill.mint", done + "/" + all.length + " câu"), stat.combo >= 2 ? h("span.pill.butter.combo", "🔥 x" + stat.combo) : null, h("span.grow"), h("span.pill.butter", { html: L.coinSvg + " " + prof.coins() + " xu" })),
        h("div.bar.good", { style: "margin-top:8px" }, h("i", { style: "width:" + (all.length ? Math.round(100 * done / all.length) : 0) + "%" })));
    };
    const card = (q, st, ctx, no, rt) => {
      if (st.chk) {
        const g = st.chk, ok = g.got === g.max;
        const ctx2 = Object.assign({}, ctx, { mode: "review", showAns: true });
        return h("div", L.hw.view(q, st, ctx2, no), h("div.row.pfeed" + (ok ? ".good" : ".bad"), h("b", ok ? "🎉 Đúng rồi!" + (st.gain ? "  +" + st.gain + " xu" : "") : "Chưa đúng (" + g.got + "/" + g.max + ")"), h("span.grow"),
          h("button.btn.sm.ghost", { onclick: () => { Object.assign(st, L.hw.initState(q), { chk: null, tries: (st.tries || 0) + 1, hid: null, hnt: null }); ctx.redraw(); paintBar(); } }, "↺ Làm lại câu này")));
      }
      const checkBtn = h("button.btn.sm.mint", { onclick: ev => {
        const g = L.hw.grade(q, st); if (!g.max) return;
        const first = !(st.tries), ok = g.got === g.max;
        st.chk = g; if (!ok && !st.wrong1) st.wrong1 = true;
        if (ok) { sfx.ok(); stat.combo++; stat.best = Math.max(stat.best, stat.combo); } else { sfx.bad(); stat.combo = 0; }
        L.rw.answer(ok);
        if (first) { if (o.review) L.wb.result(q.id, ok); else if (!ok && o.hwId) L.wb.add(o.hwId, q); if (ok && (o.fix || o.review)) L.rw.event("fixed"); if (ok && o.review) L.rw.event("review"); }
        else if (ok) L.rw.event("fixed");
        if (ok && stat.combo >= 5) L.rw.combo(stat.combo);
        if (first && g.got > 0) { let gain = g.got + (ok && stat.combo >= 3 ? 1 : 0) - (st.hintUsed ? 1 : 0); gain = Math.max(0, gain); st.gain = gain; if (gain) { prof.add(gain); stat.coins += gain; setTimeout(sfx.coin, 220); L.fly("+" + gain + " 🪙", ev.target); } }
        ctx.redraw(); paintBar(); maybeFinish();
      } }, "Kiểm tra ✓");
      const hintBtn = canHint(q) ? h("button.btn.sm.ghost", { title: "Gợi ý (−" + HINT_COST + " xu)", onclick: () => {
        if (prof.coins() < HINT_COST) { L.toast("Em chưa đủ " + HINT_COST + " xu để xem gợi ý. Làm thêm vài câu nhé!"); return; }
        if (!applyHint(q, st)) { L.toast("Câu này hết gợi ý rồi!"); return; }
        prof.spend(HINT_COST); st.hintUsed = true; stat.coins -= HINT_COST; sfx.coin(); ctx.redraw(); paintBar();
      } }, "💡 Gợi ý (−" + HINT_COST + " xu)") : null;
      return h("div", L.hw.view(q, st, ctx, no), h("div.row.pact", hintBtn, h("span.grow"), checkBtn));
    };

    let finished = false;
    const maybeFinish = () => { if (!finished && allQ().length && allQ().every(x => x.st.chk)) setTimeout(() => finish(), 500); };
    const finish = () => {
      finished = true; summary.innerHTML = "";
      const all = allQ(), tot = all.reduce((a, x) => a + (x.st.chk ? x.st.chk.max : 0), 0);
      const firstOk = all.filter(x => x.st.chk && x.st.chk.got === x.st.chk.max && !x.st.wrong1).length, pct = all.length ? Math.round(100 * firstOk / all.length) : 0;
      let bonus = 0; if (pct >= 80 && all.length >= 3) { bonus = 5; prof.add(bonus); stat.coins += bonus; }
      const wrongs = all.filter(x => x.st.wrong1);
      if (!o.review) L.rw.practiceDone(o.fix ? null : o.hwId, pct); else L.rw.event("practice");
      if (pct >= 80) { sfx.win(); L.confetti(); } else sfx.coin();
      summary.append(h("div.card.result", h("div.muted", "Hoàn thành luyện tập"), h("div.score-big", firstOk + "/" + all.length, h("small", { style: "font-size:22px" }, " câu đúng ngay lần đầu")), h("div.cheer", L.cheer(pct)),
        h("div.row", { style: "justify-content:center;margin:8px 0" }, h("span.pill.butter", { html: L.coinSvg + " +" + stat.coins + " xu lần này" }), bonus ? h("span.pill.mint", "Thưởng ≥80%: +" + bonus) : null, stat.best >= 3 ? h("span.pill.rose", "🔥 chuỗi dài nhất x" + stat.best) : null),
        wrongs.length ? h("div.hint", { style: "text-align:left" }, h("b", "Các câu cần ôn lại (" + wrongs.length + "):"), wrongs.slice(0, 8).map(x => h("div.small", "• " + (x.q.stem || x.q.src || x.q.ans || (x.q.parts ? x.q.parts.map(p => p.k === "t" ? p.s : "___").join("") : "") || x.q.type).toString().slice(0, 90)))) : h("div.hint", "🌟 Không sai câu nào, giỏi quá!"),
        h("div.row", { style: "justify-content:center;margin-top:10px" },
          wrongs.length ? h("button.btn.rose", { onclick: () => { const nr = rts.map(rt => subRuntime(rt, rt.qs.filter(q => rt.sts[q.id].wrong1))).filter(rt => rt.qs.length); startPractice("Fix it! · " + title, nr, Object.assign({}, o, { fix: true })); } }, "🔧 Fix it! (" + wrongs.length + " câu)") : null,
          h("button.btn", { onclick: () => startPractice(title, rts.map(rt => L.hw.buildRuntime(rt.sec)), o) }, "↻ Luyện lại từ đầu"),
          h("a.btn.ghost", { href: o.back || "#/hw" }, "← Quay lại"), h("a.btn.ghost", { href: "#/shop" }, "🛍️ Cửa hàng"))));
      summary.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const secBox = h("div");
    const drawAll = () => {
      secBox.innerHTML = ""; let no = 1;
      rts.forEach((rt, i) => {
        const cardFn = (q, st, ctx, n, r) => card(q, st, ctx, n, r);
        secBox.append(h("div.card.sec", L.hw.sectionHeader(rt.sec, i), L.hw.renderSection(rt, "do", false, no, () => { }, { card: cardFn })));
        no += rt.qs.length;
      });
    };
    drawAll(); paintBar();
    const finishNow = h("div.row", { style: "justify-content:center;margin:14px 0" }, h("button.btn.ghost", { onclick: () => finish() }, "🏁 Kết thúc & xem kết quả"));
    ui.show(h("div.crumbs", h("a", { href: o.back || "#/hw" }, "Bài tập"), " › ", title), header, secBox, finishNow, summary);
    L.coinTick && L.coinTick();
    window.scrollTo(0, 0);
  }

  /* ================= Cửa hàng: avatar · thú nuôi · chủ đề ================= */
  let shopTab = "av";
  async function shopView() {
    const ui = L.ui; const box = h("div");
    const draw = () => {
      const p = prof.get(); box.innerHTML = "";
      const tabs = h("div.tabs", [["av", "🧑‍🎨 Avatar"], ["pet", "🐾 Thú nuôi"], ["theme", "🎨 Chủ đề"]].map(([k, t]) => h("button" + (shopTab === k ? ".on" : ""), { onclick: () => { shopTab = k; draw(); } }, t)));
      const sync = prof.sync.state, st = sync === "ok" ? "☁️ Đã lưu lên Google Sheets" : sync === "pending" ? "⏳ Đang lưu…" : sync === "offline" ? "⚠️ Chưa kết nối được máy chủ, sẽ tự lưu lại sau" : "";
      box.append(h("div.card", h("div.row", h("h1", { style: "font-size:30px" }, "🛍️ Cửa hàng của em"), h("span.grow"), h("span.pill.butter.big", { html: L.coinSvg + " " + p.coins + " xu" })),
        h("div.small.muted", "Làm bài luyện tập, nộp bài, hoàn thành nhiệm vụ để kiếm xu rồi đổi lấy đồ xinh. " + st), tabs));
      if (shopTab === "av") {
        box.append(h("div.avgrid", prof.AV.map(a => {
          const own = p.owned.includes(a.id), cur = p.avatar === a.id || (!p.avatar && a.id === "sprout");
          return h("div.avtile" + (cur ? ".cur" : ""), h("div.avbig", { style: "background:" + a.bg }, a.e), h("b", a.n),
            cur ? h("span.pill.mint", "Đang dùng") : own ? h("button.btn.sm", { onclick: () => { prof.use(a.id); sfx.ok(); draw(); ui.repaint && ui.repaint(); } }, "Chọn") :
              h("button.btn.sm" + (p.coins >= a.p ? ".peach" : ".ghost"), { onclick: () => { if (prof.buy(a.id)) { sfx.win(); L.confetti(40); L.toast("Đã mua " + a.n + "! 🎉"); draw(); ui.repaint && ui.repaint(); } else L.toast("Em chưa đủ xu. Còn thiếu " + (a.p - p.coins) + " xu nữa thôi!"); } }, h("span", { html: L.coinSvg + " " + a.p })));
        })));
      } else if (shopTab === "pet") {
        const ks = Object.keys(L.pet.SP);
        box.append(h("div.avgrid", ks.map(k => {
          const sp = L.pet.SP[k], own = sp.p === 0 || p.ownedPets.includes(k), cur = p.pet.kind === k;
          return h("div.avtile" + (cur ? ".cur" : ""), h("div.avbig.petbg", { html: L.pet.svg(k, { mood: "happy", level: cur ? L.pet.lvOf(p.pet.xp) : 0, cute: 80 }) }), h("b", cur && p.pet.name ? p.pet.name : sp.n),
            cur ? h("span.pill.mint", "Đang nuôi") : own ? h("button.btn.sm", { onclick: () => { L.pet.chooser(false); } }, "Chọn") :
              h("button.btn.sm" + (p.coins >= sp.p ? ".peach" : ".ghost"), { onclick: () => { if (p.coins >= sp.p && prof.spend(sp.p)) { prof.mut(q => { if (!q.ownedPets.includes(k)) q.ownedPets.push(k); }); sfx.win(); L.confetti(40); L.toast("Đã mua " + sp.n + "! 🎉 Bấm Chọn để nuôi nhé"); draw(); } else L.toast("Em chưa đủ xu. Còn thiếu " + (sp.p - p.coins) + " xu nữa thôi!"); } }, h("span", { html: L.coinSvg + " " + sp.p })));
        })), h("div.row", { style: "justify-content:center;margin-top:12px" }, h("button.btn", { onclick: () => L.pet.chooser(false) }, "🐾 Đổi thú nuôi / đặt tên")));
      } else {
        box.append(h("div.avgrid", L.extras.THEMES.map(t => {
          const own = t.p === 0 || p.ownedThemes.includes(t.id), cur = (p.theme || "default") === t.id;
          return h("div.avtile" + (cur ? ".cur" : ""), h("div.avbig.thbig.th-" + t.id, t.e), h("b", t.n), t.season ? h("span.pill.rose", "Mùa " + t.season) : null,
            cur ? h("span.pill.mint", "Đang dùng") : own ? h("button.btn.sm", { onclick: () => { prof.mut(q => { q.theme = t.id; }); L.extras.applyTheme(t.id); sfx.ok(); draw(); } }, "Dùng") :
              h("button.btn.sm" + (p.coins >= t.p ? ".peach" : ".ghost"), { onclick: () => { if (p.coins >= t.p && prof.spend(t.p)) { prof.mut(q => { if (!q.ownedThemes.includes(t.id)) q.ownedThemes.push(t.id); q.theme = t.id; }); L.extras.applyTheme(t.id); sfx.win(); L.confetti(40); L.toast("Đã mua chủ đề " + t.n + "! 🎉"); draw(); } else L.toast("Em chưa đủ xu. Còn thiếu " + (t.p - p.coins) + " xu nữa thôi!"); } }, h("span", { html: L.coinSvg + " " + t.p })));
        })));
      }
    };
    draw(); ui.show(box);
  }

  L.practiceView = practiceView; L.shopView = shopView; L.startPractice = startPractice; L.subRuntime = subRuntime;
})(window.LSE);
