# -*- coding: utf-8 -*-
"""Chạy 1 lần: thêm sao + sticker đồng bộ hồ sơ (trường mov) và mã của cô vào template Movers. Lấy khối code từ template Flyers (đã chạy tốt)."""
import re, sys
FL = open('../../../flyers/speaking/_work/template.html', encoding='utf8').read()
P = 'template.html'; t = open(P, encoding='utf8').read()
if 'function awardSet' in t: sys.exit('đã patch rồi')
def rep(old, new, cnt=1):
    global t
    n = t.count(old)
    if n != cnt: sys.exit('LỖI: %r x%d (cần %d)' % (old[:80], n, cnt))
    t = t.replace(old, new)
# ---- khối CSS (từ Flyers)
a = FL.index('@keyframes starpop'); b = FL.index('/* ================= Giao diện chung')
css = FL[a:b]
rep('/* ================= Giao diện chung', css + '/* ================= Giao diện chung')
# ---- paint$
rep('function setName(s) {', "function paint$(...k) { $app.replaceChildren(...k.filter(x => x != null && x !== false)); }\nfunction setName(s) {")
# ---- khối JS mã cô + sao/sticker (từ Flyers), đổi fly -> mov
a = FL.index('/* ---------- mã của cô + quyền bật chế độ Cô ---------- */'); b = FL.index('/* ---------- học viên tự đánh giá')
js = FL[a:b]
js = js.replace("trường fly", "trường mov").replace("pr.fly = mergeProg(pr.fly, pg)", "pr.mov = mergeProg(pr.mov, pg)").replace("pp.get().fly", "pp.get().mov")
js = js.replace("'lsf_prog_v1:'", "'lsm_prog_v1:'")
assert 'fly' not in js.replace('fly-', ''), [m.start() for m in re.finditer('fly', js)][:5]
rep('/* ---------- học viên tự đánh giá', js + '/* ---------- học viên tự đánh giá')
# ---- 3 nút Cô
rep("ni(tchIco(), st.teach ? 'Cô: BẬT' : 'Cô: TẮT', { onclick: () => { st.teach = !st.teach; setTeach(st.teach); homeView(); }, title: 'Bật để xem gợi ý và đáp án của cô' }, st.teach)", "teachBtn(homeView, 'Bật để xem gợi ý và đáp án của cô')")
rep("ni(tchIco(), st.teach ? 'Cô: BẬT' : 'Cô: TẮT', { onclick: () => { st.teach = !st.teach; setTeach(st.teach); introView(); }, title: 'Bật để mở hết các Part' }, st.teach)", "teachBtn(introView, 'Bật để mở hết các Part')")
rep("ni(tchIco(), st.teach ? 'Cô: BẬT' : 'Cô: TẮT', { onclick: () => { st.teach = !st.teach; setTeach(st.teach); testView(); }, title: 'Bật/tắt gợi ý và đáp án của cô' }, st.teach)", "teachBtn(testView, 'Bật/tắt gợi ý và đáp án của cô')")
# ---- replaceChildren -> paint$ ở home / intro / test / finish
for old in ["  $app.replaceChildren(\n    h('header.sbar', h('div.sbar-in', h('div.slogo'", "  $app.replaceChildren(\n    h('header.sbar.intro'", "  $app.replaceChildren(bar, steps, body, st.teach ? scoreBox(P) : selfBox(P), navBox());", "  $app.replaceChildren(h('div.panel.sum', ch,"]:
    rep(old, old.replace('$app.replaceChildren(', 'paint$('))
# ---- home: pill sao/sticker + khoá bộ đề luôn có phần tử (ẩn khi Cô tắt)
rep("h('div.pillrow', h('span.pill', '⭐ ' + SETS.reduce((n, x) => n + PARTS.filter(q => isDone(q.id, x.id)).length, 0) + ' phần đã xong'),", "h('div.pillrow', h('button.pill', { onclick: albumView }, '⭐ ' + Object.keys(loadProg().stars).length + ' sao', h('span', '·'), '🎁 Sticker ' + loadProg().stk.length + '/' + STK.length),")
rep("    st.teach ? h('div', { style: 'margin:-4px 0 12px' }, h('button.pill',", "    h('div', { style: 'margin:-4px 0 12px' + (st.teach ? '' : ';display:none') }, h('button.pill',")
i = t.index("h('div', { style: 'margin:-4px 0 12px' + (st.teach ? '' : ';display:none') }, h('button.pill',"); j = t.index('\n', i)
line = t[i:j]; assert line.rstrip().endswith(': null,'), line[-40:]
t = t[:i] + line.rstrip()[:-len(': null,')] .rstrip() + ',' + t[j:] if False else t
# (dòng gốc kết thúc bằng ') : null,' -> đổi thành '),')
t = re.sub(r"(h\('div', \{ style: 'margin:-4px 0 12px' \+ \(st\.teach \? '' : ';display:none'\) \}, h\('button\.pill', .*?\)\)) : null,", r"\1,", t, count=1, flags=re.S)
# ---- finish: trao sao + sticker
rep("  const R = shieldCalc(st.sc);\n  LSE_REPORT.finish", "  const R = shieldCalc(st.sc), aw = awardSet(st.set.id);\n  LSE_REPORT.finish")
rep(": h('div', h('div.big', 'Giỏi lắm! 🎉'), h('div.muted',", ": h('div', h('div.big', 'Giỏi lắm! 🎉'), h('div', { style: 'font-weight:800;font-size:18px;margin:4px 0;color:var(--butter-d)' }, aw.first ? '⭐ +1 sao mới! Em có ' + aw.now + ' sao' : '⭐ Em đã có ' + aw.now + ' sao'), h('div.muted',")
rep("    h('div.nav', { style: 'justify-content:center;margin-top:14px' },\n      h('button.btn.ghost', { onclick: () => openSet(st.set.id) }, '↺ Làm lại'),", "    aw.newStk.length ? h('div', { style: 'margin:12px 0' }, h('b', { style: 'font-family:var(--fh);font-size:20px' }, '🎁 Em mở được sticker mới!'), h('div', { style: 'display:flex;gap:12px;justify-content:center;margin-top:8px' }, aw.newStk.map(i => stickerEl(i, new Set([i]), true)))) : null,\n    h('div.nav', { style: 'justify-content:center;margin-top:14px' },\n      h('button.btn.ghost', { onclick: albumView }, '🎁 Sticker của em'),\n      h('button.btn.ghost', { onclick: () => openSet(st.set.id) }, '↺ Làm lại'),")
rep("  window.scrollTo(0, 0);\n}\nfunction goHome()", "  if (aw.newStk.length) confetti(60);\n  window.scrollTo(0, 0);\n}\nfunction goHome()")
open(P, 'w', encoding='utf8').write(t); print('OK', len(t))
