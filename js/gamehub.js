/* ============================================================
   TRUNG TÂM TRÒ CHƠI: chọn bài (bộ từ của unit, hoặc tự dán) → chọn game → chơi.
   - data/games.json   : danh sách game (mỗi game là 1 file HTML trong apps/games/, đọc bộ từ qua ?set=)
   - data/wordsets/    : bộ từ theo unit (index.json + từng file + hình)
   Route: #/games            trang chính (có thể kèm ?cur=..&unit=.. để chọn sẵn bài)
          #/games/play/<game>/<bộ từ>   chơi
   ============================================================ */
window.LSE = window.LSE || {};
(function (L) {
  const { h, toast } = L;
  let GAMES = null, SETS = null;
  const SELKEY = "lse_hub_sel", PASTE = "lse_paste:";
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };

  async function loadData() {
    if (GAMES && SETS) return;
    const j = async u => { const r = await fetch(u + "?v=" + Date.now(), { cache: "no-store" }); if (!r.ok) throw new Error("Không tải được " + u); return r.json(); };
    const [g, s] = await Promise.all([j("data/games.json"), j("data/wordsets/index.json")]);
    GAMES = g.games || []; SETS = s.sets || [];
  }

  /* ---------- hình poster (tự vẽ, không dùng hình của nơi khác) ---------- */
  const POSTERS = {
    mole: '<svg viewBox="0 0 320 210"><defs><linearGradient id="pm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFC9E0"/><stop offset="1" stop-color="#D9C8FF"/></linearGradient></defs><rect width="320" height="210" fill="url(#pm)"/><g fill="#fff" opacity=".7"><circle cx="30" cy="30" r="3"/><circle cx="290" cy="50" r="3"/><circle cx="260" cy="170" r="3"/><circle cx="50" cy="150" r="3"/></g><path d="M40 40l5 10 11 1-8 7 2 11-10-6-10 6 2-11-8-7 11-1z" fill="#FFE08A"/><path d="M270 30c6-10 18-4 12 6l-12 14-12-14c-6-10 6-16 12-6z" fill="#FF8FBD"/>'
      + [[70, 150], [160, 160], [250, 150]].map(([x, y]) => '<ellipse cx="' + x + '" cy="' + (y + 22) + '" rx="48" ry="14" fill="#8a63b4"/>').join('')
      + '<g><circle cx="150" cy="112" r="12" fill="#CDB9F5"/><circle cx="196" cy="112" r="12" fill="#CDB9F5"/><circle cx="150" cy="112" r="7" fill="#FFB3CF"/><circle cx="196" cy="112" r="7" fill="#FFB3CF"/><ellipse cx="173" cy="134" rx="30" ry="26" fill="#CDB9F5"/><ellipse cx="173" cy="146" rx="17" ry="12" fill="#F1E9FF"/><ellipse cx="162" cy="130" rx="3.6" ry="4.8" fill="#3a2848"/><ellipse cx="184" cy="130" rx="3.6" ry="4.8" fill="#3a2848"/><ellipse cx="173" cy="140" rx="3.5" ry="2.6" fill="#FF6F9F"/><rect x="170" y="145" width="3" height="5" rx="1" fill="#fff"/><rect x="173" y="145" width="3" height="5" rx="1" fill="#fff"/></g>'
      + '<g transform="translate(60 40) rotate(-28 40 50)"><rect x="36" y="38" width="9" height="52" rx="4.5" fill="#FF8FBD" stroke="#5b3b63" stroke-width="3"/><rect x="10" y="4" width="62" height="36" rx="12" fill="#CDBBF7" stroke="#5b3b63" stroke-width="3.2"/></g>'
      + [[70, 172], [160, 182], [250, 172]].map(([x, y]) => '<path d="M' + (x - 50) + ' ' + y + 'q50-30 100 0v12q-50 14-100 0z" fill="#FFB3D1" stroke="#5b3b63" stroke-width="3"/>').join('') + '</svg>',
    gold: '<svg viewBox="0 0 320 210"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9B5"/><stop offset="1" stop-color="#FFC48A"/></linearGradient></defs><rect width="320" height="210" fill="url(#pg)"/><path d="M0 150q60-30 120-8t120-10 80 12v66H0z" fill="#C98F63"/><path d="M0 170q80-24 160-4t160-8v52H0z" fill="#A9714B"/><g fill="#fff" opacity=".6"><circle cx="40" cy="40" r="3"/><circle cx="280" cy="36" r="3"/><circle cx="230" cy="80" r="3"/></g><g stroke="#5b3b63" stroke-width="3.5" stroke-linejoin="round"><path d="M70 150l14-30h46l14 30z" fill="#FFD23F"/><path d="M130 150l12-26h40l12 26z" fill="#FFE27A"/><path d="M185 150l12-24h34l12 24z" fill="#FFD23F"/></g><path d="M58 64l-28 52" stroke="#5b3b63" stroke-width="7" stroke-linecap="round"/><path d="M20 70q34-34 74-18" fill="none" stroke="#5b3b63" stroke-width="7" stroke-linecap="round"/><path d="M246 40l8 16 18 2-13 12 4 18-17-9-17 9 4-18-13-12 18-2z" fill="#FFF3A8" stroke="#5b3b63" stroke-width="3" stroke-linejoin="round"/></svg>',
    dice: '<svg viewBox="0 0 320 210"><defs><linearGradient id="pd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FDBFF"/><stop offset="1" stop-color="#4F9CEB"/></linearGradient></defs><rect width="320" height="210" fill="url(#pd)"/><g fill="#fff" opacity=".55" font-family="Baloo 2,Arial" font-weight="800" font-size="28"><text x="22" y="52">41</text><text x="250" y="48">73</text><text x="262" y="176">9</text><text x="24" y="176">66</text></g><g transform="rotate(-14 100 110)"><rect x="52" y="62" width="92" height="92" rx="20" fill="#fff" stroke="#27407d" stroke-width="4"/><g fill="#27407d"><circle cx="78" cy="88" r="8"/><circle cx="118" cy="88" r="8"/><circle cx="98" cy="108" r="8"/><circle cx="78" cy="128" r="8"/><circle cx="118" cy="128" r="8"/></g></g><g transform="rotate(16 220 100)"><rect x="180" y="52" width="76" height="76" rx="17" fill="#FFD34D" stroke="#27407d" stroke-width="4"/><g fill="#27407d"><circle cx="202" cy="74" r="7"/><circle cx="234" cy="106" r="7"/></g></g></svg>'
  };
  const ICON_BY = { pink: "🔨", yellow: "⛏️", sky: "🎲" };

  /* ---------- lựa chọn hiện tại ---------- */
  const urlQ = () => new URLSearchParams((location.hash.split("?")[1]) || "");
  function loadSel() { try { return JSON.parse(lsGet(SELKEY) || "null") || {}; } catch (e) { return {}; } }
  const setFor = (cur, unit) => SETS.find(s => s.cur === cur && (s.unit || "") === (unit || ""));
  function parsePaste(text) {
    const items = [], seen = new Set();
    String(text || "").split(/\r?\n/).forEach(raw => {
      const line = raw.trim(); if (!line || line[0] === "#") return;
      const parts = (line.includes("\t") ? line.split("\t") : line.includes("|") ? line.split("|") : line.split(/\s+[-–—=:]\s+/)).map(x => x.trim());
      const w = parts[0] || "", vi = parts.slice(1).join(" - ").trim();
      if (!w || !vi || !/[A-Za-z]/.test(w) || seen.has(w.toLowerCase())) return;
      seen.add(w.toLowerCase()); items.push({ w, vi });
    });
    return items;
  }

  /* ---------- trang chính ---------- */
  async function hubView() {
    L.ui.show(L.ui.spinner());
    await Promise.all([loadData(), L.loadManifest()]);
    const m = L.state.manifest, curricula = (m.curricula || []);
    const q = urlQ(), saved = loadSel();
    const sel = { cur: q.get("cur") || saved.cur || "", unit: q.has("unit") ? q.get("unit") : (q.get("cur") ? "" : (saved.unit || "")) };
    if (sel.cur && sel.cur !== "custom" && !curricula.some(c => c.id === sel.cur)) sel.cur = "";
    let cat = "all", term = "";

    const curSel = h("select.gh-sel", { "aria-label": "Giáo trình" });
    const unitSel = h("select.gh-sel", { "aria-label": "Unit" });
    const info = h("div.gh-info"), pasteBox = h("div.gh-paste.hidden");
    const ta = h("textarea", { rows: 6, placeholder: "Mỗi dòng một từ, ví dụ:\napple - quả táo\nbanana - quả chuối\nI am ... " , spellcheck: "false" });
    const grid = h("div.gh-grid");

    curSel.append(h("option", { value: "" }, "— Chọn giáo trình —"));
    curricula.forEach(c => curSel.append(h("option", { value: c.id }, (c.group ? c.group + " › " : "") + c.name)));
    curSel.append(h("option", { value: "custom" }, "✍️ Tự dán từ vựng"));

    const curObj = () => curricula.find(c => c.id === sel.cur);
    function fillUnits() {
      unitSel.innerHTML = "";
      const c = curObj();
      if (!c || !(c.units || []).length) { unitSel.classList.add("hidden"); return; }
      unitSel.classList.remove("hidden");
      unitSel.append(h("option", { value: "" }, "— Chọn unit —"));
      c.units.forEach(u => { const s = setFor(c.id, u.id); unitSel.append(h("option", { value: u.id }, u.name + (s ? " · " + s.title.replace(/^Unit \d+ · /i, "") + " (" + s.n + " từ)" : " (chưa có bộ từ – dán từ vựng)"))); });
      if (!c.units.some(u => u.id === sel.unit)) sel.unit = "";
      unitSel.value = sel.unit;
    }
    function pasteKey() { return PASTE + (sel.cur || "custom") + ":" + (sel.unit || ""); }
    let current = null;                      // {id, title, cur, unit, n, pics, custom?, items?}
    function refresh() {
      lsSet(SELKEY, JSON.stringify(sel));
      curSel.value = sel.cur; fillUnits();
      current = null; info.innerHTML = ""; pasteBox.classList.add("hidden");
      const c = curObj();
      if (sel.cur === "custom") { showPaste("Dán từ vựng của em/cô vào đây (mỗi dòng: từ - nghĩa)"); }
      else if (c) {
        const needUnit = (c.units || []).length > 0;
        if (needUnit && !sel.unit) info.append(h("div.gh-hint", "👆 Chọn unit để lấy từ vựng của unit đó."));
        else {
          const s = setFor(sel.cur, sel.unit);
          if (s) { current = s; info.append(h("div.gh-ok", "📚 ", h("b", s.title), " · " + s.n + " từ" + (s.pics ? " · " + s.pics + " hình" : ""))); }
          else showPaste("Unit này chưa có bộ từ sẵn. Dán từ vựng vào đây để chơi ngay (cô cũng có thể gửi mình ảnh/ file từ vựng để thêm vào).");
        }
      } else info.append(h("div.gh-hint", "👆 Chọn giáo trình và unit mà em muốn chơi nhé."));
      drawGames();
    }
    function showPaste(msg) {
      pasteBox.classList.remove("hidden"); ta.value = lsGet(pasteKey()) || "";
      info.append(h("div.gh-hint", "✍️ " + msg));
      onPaste();
    }
    function onPaste() {
      const items = parsePaste(ta.value); lsSet(pasteKey(), ta.value);
      pasteMsg.textContent = items.length ? "✅ Đọc được " + items.length + " từ" + (items.length < 3 ? " (cần ít nhất 3 từ)" : "") : "Chưa có dòng hợp lệ (cần: từ - nghĩa)";
      current = items.length >= 3 ? { id: "custom", title: (curObj() ? curObj().name + (unitName() ? " · " + unitName() : "") : "Từ vựng tự dán"), cur: sel.cur === "custom" ? "" : sel.cur, unit: sel.unit, n: items.length, custom: true, items } : null;
      drawGames();
    }
    const pasteMsg = h("div.small", { style: "margin-top:4px;font-weight:800" });
    ta.addEventListener("input", onPaste);
    pasteBox.append(ta, pasteMsg);
    const unitName = () => { const c = curObj(); const u = c && (c.units || []).find(x => x.id === sel.unit); return u ? u.name : ""; };
    curSel.addEventListener("change", () => { sel.cur = curSel.value; sel.unit = ""; refresh(); });
    unitSel.addEventListener("change", () => { sel.unit = unitSel.value; refresh(); });

    function play(g) {
      if (!current) { toast("Chọn bài (có ít nhất 3 từ) trước nhé!"); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
      if (current.custom) { try { sessionStorage.setItem("lse_custom_set", JSON.stringify({ title: current.title, items: current.items })); } catch (e) { toast("Máy này không cho lưu tạm bộ từ"); return; } }
      L.go("/games/play/" + g.id + "/" + current.id + "?cur=" + encodeURIComponent(current.cur || "") + "&unit=" + encodeURIComponent(current.unit || ""));
    }
    function drawGames() {
      grid.innerHTML = "";
      const t = term.trim().toLowerCase();
      const list = GAMES.filter(g => (cat === "all" || (g.cats || []).includes(cat)) && (!t || (g.title + " " + g.desc + " " + (g.tags || []).join(" ")).toLowerCase().includes(t)));
      if (!list.length) { grid.append(h("div.empty", "Không tìm thấy game nào.")); return; }
      list.forEach(g => grid.append(h("div.gh-card.c-" + (g.color || "pink"),
        h("div.gh-poster", { html: POSTERS[g.poster] || "" }),
        h("div.gh-body", h("h3", (ICON_BY[g.color] || "🎮") + " " + g.title), h("p", g.desc),
          h("div.gh-tags", (g.tags || []).map(x => h("span.pill", x))),
          h("button.btn.rose" + (current ? "" : ".ghost"), { onclick: () => play(g) }, current ? "Chơi ▶" : "Chọn bài trước ☝️")))));
    }

    const chips = [["all", "Tất cả"], ["vocab", "Từ vựng"], ["speed", "Tốc độ"], ["duo", "Đấu đôi"]].map(([k, t]) => h("button.gh-chip" + (k === "all" ? ".on" : ""), { onclick: e => { cat = k; chips.forEach(c => c.classList.remove("on")); e.currentTarget.classList.add("on"); drawGames(); } }, t));
    const search = h("input.gh-search", { type: "search", placeholder: "🔍 Tìm game…", oninput: e => { term = e.target.value; drawGames(); } });

    L.ui.show(
      h("div.crumbs", h("a", { href: "#/" }, "Trang chủ"), " › Trò chơi"),
      h("div.card.gh-hero", h("span.gh-sp.s1", "✦"), h("span.gh-sp.s2", "♥"), h("span.gh-sp.s3", "★"), h("span.gh-sp.s4", "✿"),
        h("h1", "🎮 Trung tâm trò chơi"),
        h("p", "Ôn từ vựng bằng game! Bài nào cũng chơi được: chọn bài, chọn game rồi chơi và kiếm xu nhé."),
        h("div.gh-steps", h("span", h("b", "1"), " Chọn bài"), h("span", h("b", "2"), " Chọn game"), h("span", h("b", "3"), " Chơi & kiếm xu"))),
      h("div.card.gh-pick", h("h2", "① Chọn bài để chơi"), h("div.gh-row", curSel, unitSel), info, pasteBox),
      h("div.gh-bar", h("h2", "② Chọn game"), h("div.gh-chips", chips), search),
      grid);
    refresh();
  }

  /* ---------- chơi ---------- */
  async function playGame(gid, sid) {
    L.ui.show(L.ui.spinner());
    await Promise.all([loadData(), L.loadManifest()]);
    const g = GAMES.find(x => x.id === gid);
    if (!g) { L.ui.show(h("div.card.empty", "Không tìm thấy game này.", h("div", h("a.btn", { href: "#/games" }, "Về Trung tâm trò chơi")))); return; }
    const q = urlQ();
    let title = "", cur = q.get("cur") || "", unit = q.get("unit") || "";
    if (sid === "custom") { try { title = (JSON.parse(sessionStorage.getItem("lse_custom_set") || "null") || {}).title || ""; } catch (e) { } if (!title) { L.go("/games"); toast("Hãy chọn lại bộ từ nhé"); return; } }
    else { const s = SETS.find(x => x.id === sid); if (!s) { L.ui.show(h("div.card.empty", "Không tìm thấy bộ từ này.", h("div", h("a.btn", { href: "#/games" }, "Về Trung tâm trò chơi")))); return; } title = s.title; cur = s.cur; unit = s.unit || ""; }
    const app = { id: "game-" + gid + "-" + (sid === "custom" ? (cur || "custom") + (unit ? "-" + unit : "") : sid), title: g.title + " · " + title, cur, unit, file: g.file + "?set=" + encodeURIComponent(sid), kind: "game", desc: "", hub: true, hubSet: sid, updated: g.v || "" };
    await L.playApp(app);
  }

  L.gamehub = {
    route: async p => { if (p[0] === "play" && p[1] && p[2]) return playGame(p[1], decodeURIComponent(p[2])); return hubView(); },
    backHref: (cur, unit) => "#/games" + (cur ? "?cur=" + encodeURIComponent(cur) + "&unit=" + encodeURIComponent(unit || "") : "")
  };
})(window.LSE);
