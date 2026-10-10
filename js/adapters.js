/* ============================================================
   BỘ BÁO KẾT QUẢ TỪ APP HTML VỀ TRANG WEB
   - App cùng "họ" với Countryside Hub: trang tự gắn mã báo (không cần sửa file app).
   - App mới: thêm 1 dòng gọi window.parent.postMessage (xem docs/lse-report.js).
   Giao thức tin nhắn: {lse:1, kind:'answer', qid, topic, ok, q} và {lse:1, kind:'finish', score, max}
   ============================================================ */
(function (L) {
  /* mã chạy BÊN TRONG app (đưa vào qua eval cùng nguồn gốc) */
  const HUB_SOURCE = `(function(){
    if (window.__lseHooked) return; window.__lseHooked = true;
    var send = function(o){ try{ parent.postMessage(Object.assign({lse:1}, o), '*'); }catch(e){} };
    var strip = function(s){ return String(s==null?'':s).replace(/<[^>]*>/g,' ').replace(/\\s+/g,' ').trim().slice(0,120); };
    var GK = {prep:'So sánh hơn của trạng từ (game)', def:'Định nghĩa → từ vựng (game)', ving:'Trạng từ, than, trợ động từ (game)', syn:'Viết lại câu & lời khen (game)'};
    var topicOf = function(q){
      try {
        var id = String(q.id||'');
        if (/^g:/.test(id) && typeof G !== 'undefined') { var gid = id.split(':')[1]; var g = G.find(function(x){ return x.id === gid; }); if (g) return strip(g.short || g.title); }
        if (q.lesson && typeof LBY !== 'undefined' && LBY[q.lesson]) { var lb = LBY[q.lesson]; return 'Từ vựng – ' + strip(lb.name + (lb.sub && String(lb.sub).length < 40 ? ' (' + lb.sub + ')' : '')); }
        if (/^v:book/.test(id)) return 'Từ vựng trong sách';
      } catch(e){}
      return String(q.kind || q.cat || 'Chưa gắn chủ điểm');
    };
    var labelOf = function(q){
      var t = q.q || q.def || q.ctx || q.prompt || (q.tiles && q.tiles.join(' ')) || (q.segs && q.segs.join(' ')) || q.ans || q.id;
      return (q.kind ? '[' + q.kind + '] ' : '') + strip(t);
    };
    if (typeof bankUpdate === 'function' && typeof qMax === 'function') {
      var ob = window.bankUpdate;
      window.bankUpdate = function(q, st){
        try {
          if (q && st && st.done) {
            var max = qMax(q), sc = st.score || 0;
            send({kind:'answer', qid:String(q.id||''), topic:topicOf(q), ok: sc === max, q: labelOf(q)});
          }
        } catch(e){}
        return ob.apply(this, arguments);
      };
    }
    if (typeof gameAns === 'function') {
      var og = window.gameAns;
      window.gameAns = function(d){
        try {
          var b = (typeof GBANK !== 'undefined') ? GBANK.find(function(x){ return 'gm:'+x.id === d.id; }) : null;
          send({kind:'answer', qid:String(d.id), topic: b ? (GK[b.k] || b.k) : 'Game', ok: !!d.ok, q: b ? strip(b.q) : String(d.id)});
        } catch(e){}
        return og.apply(this, arguments);
      };
    }
    send({kind:'ready', adapter:'hub'});
  })();`;

  const ADAPTERS = [
    { name: "hub", detect: w => typeof w.bankUpdate === "function" && typeof w.qMax === "function", source: HUB_SOURCE }
  ];

  /** gắn vào iframe cùng nguồn gốc; trả về tên adapter hoặc null */
  function inject(iframe) {
    let w;
    try { w = iframe.contentWindow; void w.document; } catch (e) { return null; }
    for (const a of ADAPTERS) {
      try { if (a.detect(w)) { w.eval(a.source); return a.name; } } catch (e) { console.warn("adapter", a.name, e); }
    }
    return null;
  }

  /** Bộ thu thập: nghe tin nhắn từ iframe, gom câu trả lời, tự lưu về máy chủ (gửi phần mới, không gửi lặp) */
  function createSession(app) {
    const s = { app, sid: L.uid("p"), answers: [], startedAt: Date.now(), finishScore: null, sent: 0, dirty: false, timer: null, adapter: null, attempt: null };
    s.onMessage = e => {
      const d = e.data;
      if (!d || d.lse !== 1) return;
      if (d.kind === "answer" && L.auth.role === "student") {
        if (!s.rewarded) { s.rewarded = true; L.rw && L.rw.event("app"); }
        L.rw && L.rw.answer(!!d.ok);
        if (d.ok && (s.xu = s.xu || 0) < 30) { s.xu++; L.prof.add(1); }   // mỗi lượt chơi app: tối đa 30 xu
      }
      if (d.kind === "answer") { s.answers.push({ qid: String(d.qid || ""), topic: String(d.topic || ""), ok: !!d.ok, q: String(d.q || "").slice(0, 160) }); s.dirty = true; s.schedule(); }
      if (d.kind === "finish") { s.finishScore = { score: +d.score || 0, max: +d.max || 0 }; s.dirty = true; s.schedule(); }
    };
    window.addEventListener("message", s.onMessage);
    s.schedule = () => { clearTimeout(s.timer); s.timer = setTimeout(() => s.flush(false).catch(() => { }), 10000); };
    s.payload = () => {
      const right = s.answers.filter(a => a.ok).length;
      const sc = s.finishScore || { score: right, max: s.answers.length };
      return {
        play: { sid: s.sid, appId: app.id, appTitle: app.title, cur: app.cur, unit: app.unit, score: sc.score, max: sc.max, durationSec: Math.round((Date.now() - s.startedAt) / 1000) },
        answers: s.answers.slice(s.sent, s.sent + 600)
      };
    };
    /** gửi phần mới; viaBeacon=true khi đang đóng trang */
    s.flush = async viaBeacon => {
      clearTimeout(s.timer);
      if (!s.dirty) return null;
      const p = s.payload(), upto = s.sent + p.answers.length;
      s.dirty = false;
      if (viaBeacon) { L.api.beacon("logPlay", p); s.sent = upto; return null; }
      try { const r = await L.api.call("logPlay", p); s.sent = upto; s.attempt = r.attempt; return r; }
      catch (e) { s.dirty = true; throw e; }
    };
    s.stop = () => { clearTimeout(s.timer); window.removeEventListener("message", s.onMessage); };
    return s;
  }

  L.adapters = { inject, createSession };
})(window.LSE);
