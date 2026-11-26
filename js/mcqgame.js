/* ============================================================
   BÀI TẬP TRẮC NGHIỆM → CÂU HỎI CHO GAME (Global Success 7, 8)
   - Lấy các câu trắc nghiệm 1 đáp án (mcq1) trong bài tập, chuẩn hoá thành {q, o:[đúng, ...nhiễu], why, img}.
   - Câu có gạch chân (<u>) hoặc nhiều đáp án đúng thì bỏ qua (game không hiển thị được đúng).
   - L.mcqCount(hw) = số câu chơi được; từ 4 câu trở lên thì bài được gắn note 🎮.
   - L.mcqSet(hws, title) = bộ dữ liệu đưa vào Trung tâm trò chơi: {title, items (từ vựng nếu có), mcq}.
   ============================================================ */
window.LSE = window.LSE || {};
(function (L) {
  const GAME_CURS = ["gs7", "gs8"];   /* giáo trình có note 🎮 (thêm id vào đây nếu muốn mở rộng) */
  const MIN_Q = 4;                    /* ít nhất bao nhiêu câu thì mới coi là chơi game được */
  const clean = s => String(s == null ? "" : s).replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
  const blank = s => s.replace(/(_{2,}|\.{3,}|…+|\[\s*\])/g, "___");

  function questionsOf(hw) {
    const out = [], seen = new Set();
    ((hw && hw.sections) || []).forEach(sec => {
      if (!sec || sec.type !== "mcq1") return;
      let p; try { p = L.hw.parseSection(sec); } catch (e) { return; }
      (p.questions || []).forEach(q => {
        const ok = (q.opts || []).filter(o => o.ok);
        if (ok.length !== 1) return;
        const raw = [q.stem].concat((q.opts || []).map(o => o.t)).join(" ");
        if (/<\s*\/?\s*u\s*>/i.test(raw) || /<[a-z][^>]*>/i.test(raw)) return;
        const stem = blank(clean(q.stem)), good = clean(ok[0].t);
        const bad = (q.opts || []).filter(o => !o.ok).map(o => clean(o.t)).filter(t => t && t !== good);
        if (!stem || !good || bad.length < 2) return;
        const key = stem.toLowerCase(); if (seen.has(key)) return; seen.add(key);
        out.push({ q: stem, o: [good].concat(bad.slice(0, 3)), why: clean(q.expl || ""), img: q.img || "" });
      });
    });
    return out;
  }
  const isGameCur = id => GAME_CURS.includes(id);
  const mcqCount = hw => questionsOf(hw).length;

  /* từ vựng đi kèm (chỉ lấy cặp từ – nghĩa thật, không lấy câu gợi ý) để các game từ vựng vẫn chơi được */
  function pairsOf(hw) {
    if (!L.mix || !L.mix.vocabPairs) return [];
    const vi = t => /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(t || "");   /* chỉ lấy khi gợi ý là nghĩa tiếng Việt thật */
    try { return L.mix.vocabPairs(hw).filter(p => p.hint && !p.ctx && p.word && vi(p.hint)).map(p => ({ w: p.word, vi: p.hint, img: p.img && !/^img:/i.test(p.img) ? p.img : undefined })); } catch (e) { return []; }
  }
  function mcqSet(hws, title) {
    const mcq = [], items = [], seenQ = new Set(), seenW = new Set();
    hws.forEach(hw => {
      questionsOf(hw).forEach(m => { const k = m.q.toLowerCase(); if (!seenQ.has(k)) { seenQ.add(k); mcq.push(m); } });
      pairsOf(hw).forEach(p => { const k = p.w.toLowerCase(); if (!seenW.has(k)) { seenW.add(k); items.push(p); } });
    });
    return { title: title || "Bài tập trắc nghiệm", items, mcq };
  }

  /* số câu chơi được của một bài trong danh sách: dùng số đã lưu trong bài (meta.gameMcq) nếu có, không thì đọc bài một lần rồi nhớ trong máy */
  const CK = "lse_gmcq:", inflight = {};
  const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
  let queue = Promise.resolve();
  async function gameCount(x) {
    if (!x || !isGameCur(x.curId)) return 0;
    if (typeof x.gameMcq === "number") return x.gameMcq;
    const key = CK + x.id + ":" + (x.created || "") + ":" + (x.nItems || "") + ":" + (x.nSections || "");
    const c = lsGet(key); if (c != null) return +c || 0;
    if (inflight[key]) return inflight[key];
    /* đọc lần lượt từng bài (không dồn dập) để khỏi nặng máy chủ */
    inflight[key] = queue = queue.then(async () => {
      try { const n = mcqCount((await L.api.call("hwGet", { id: x.id })).hw); lsSet(key, String(n)); return n; }
      catch (e) { return 0; }
      finally { delete inflight[key]; }
    });
    return inflight[key];
  }
  const playable = n => n >= MIN_Q;
  /* chip nhỏ "🎮 Chơi game được"; gắn vào phần tử el khi đã biết số câu */
  function badge(x, el, forTeacher) {
    if (!x || !isGameCur(x.curId) || !el) return;
    gameCount(x).then(n => {
      if (!playable(n) || !el.isConnected) return;
      const chip = L.h("span.pill.lilac", { style: "margin-left:6px", title: forTeacher ? "Bài trắc nghiệm này chơi được các game trong Trung tâm trò chơi. Có thể cho học sinh chơi." : "Bài này chơi game được!" }, "🎮 Chơi game được · " + n + " câu");
      el.append(chip);
      if (!forTeacher) el.append(L.h("a.small", { href: hubHref(x), style: "margin-left:8px;font-weight:800" }, "Chơi ngay ▶"));
    });
  }
  const hubHref = x => "#/games?cur=" + encodeURIComponent(x.curId || "") + "&unit=" + encodeURIComponent(x.unitId || "") + "&hw=" + encodeURIComponent(x.id);

  L.mcq = { GAME_CURS, MIN_Q, isGameCur, questionsOf, mcqCount, mcqSet, gameCount, playable, badge, hubHref };
})(window.LSE);
