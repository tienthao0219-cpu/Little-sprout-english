# -*- coding: utf-8 -*-
"""Kiểm thử Movers Speaking: mọi bộ x 4 Part x (laptop, điện thoại) x (Cô BẬT/TẮT): không lỗi console, ảnh tải được, không tràn ngang.
Chạy:  cd <gốc repo> && python3 -m http.server 8765 &   rồi  python3 apps/movers/speaking/_work/pwtest.py"""
import json, os, sys
from playwright.sync_api import sync_playwright
URL = 'http://localhost:8765/apps/movers/speaking/speaking.html'
D = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data.json'), encoding='utf8'))
n_ids = [s['id'] for s in D['sets'] if not s.get('hidden')]; bad = []; checks = 0
with sync_playwright() as p:
    b = p.chromium.launch()
    for (w, h, tag) in ((1280, 800, 'laptop'), (390, 844, 'phone')):
        for teach in (True, False):
            ctx = b.new_context(viewport={'width': w, 'height': h}); pg = ctx.new_page(); errs = []; failed = []
            pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
            pg.on('response', lambda r: failed.append(r.url) if r.status >= 400 else None)
            pg.add_init_script("try{localStorage.setItem('lse_speaking_movers_v1_teach','%s');localStorage.setItem('lse_speaking_movers_v1_tok','%s');localStorage.setItem('lse_speaking_movers_v1_lockSets','0')}catch(e){}" % ('1' if teach else '0', D['tcode']))
            pg.goto(URL); pg.wait_for_timeout(300)
            for i, sid in enumerate(n_ids):
                pg.evaluate("openSet(%s)" % json.dumps(sid))
                for part in range(4):
                    pg.evaluate("startSet(%d)" % part); pg.wait_for_timeout(60)
                    if part == 2: pg.evaluate("document.querySelectorAll('.hbtn.hh1').forEach(b=>b.click())")
                    ov = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
                    imgs = pg.evaluate("[...document.images].filter(i=>i.complete&&i.naturalWidth===0).length")
                    checks += 1
                    if ov > 2: bad.append((tag, teach, sid, part + 1, 'tràn ngang %dpx' % ov))
                    if imgs: bad.append((tag, teach, sid, part + 1, '%d ảnh lỗi' % imgs))
            if errs: bad.append((tag, teach, 'console', 0, errs[:3]))
            if failed: bad.append((tag, teach, 'http', 0, sorted(set(failed))[:5]))
            ctx.close()
    b.close()

def reward_tests():
    out = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport=dict(width=900, height=800)); pg.goto(URL); pg.wait_for_timeout(300); pg.evaluate("localStorage.clear();location.reload()"); pg.wait_for_timeout(500)
        pg.evaluate("goHome()"); pg.evaluate("[...document.querySelectorAll('.sbar .ni')].find(b=>/Cô:/.test(b.textContent)).click()"); dlg = pg.evaluate("!!document.querySelector('.cdlg')")
        pg.fill('.cdlg input', 'sai'); pg.keyboard.press('Enter'); wrong = pg.evaluate("[st.teach,document.querySelector('.cmsg').textContent.length>0]")
        pg.fill('.cdlg input', 'thao2026'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200); right = pg.evaluate("[st.teach,!document.querySelector('.cdlg')]")
        out.append(('code', dlg, wrong == [False, True], right == [True, True]))
        pg2 = b.new_page(viewport=dict(width=900, height=800)); pg2.goto(URL); pg2.evaluate("localStorage.clear();localStorage.setItem('lse_auth_v1',JSON.stringify({name:'An',role:'student'}));location.reload()"); pg2.wait_for_timeout(500)
        pg2.evaluate("goHome()"); out.append(('student', pg2.evaluate("[...document.querySelectorAll('.sbar .ni')].filter(b=>/Cô:/.test(b.textContent)).length"), pg2.evaluate("st.teach")))
        pg3 = b.new_page(viewport=dict(width=900, height=800))
        H = "<iframe id=f src='%s' style='width:900px;height:760px'></iframe><script>window.LSE={prof:{d:{mov:{stars:{},stk:[]}},get(){return this.d},mut(fn){fn(this.d)},sync:{state:'ok'}}}</script>" % URL
        pg3.route('http://localhost:8765/__h.html', lambda r: r.fulfill(body=H, content_type='text/html')); pg3.goto('http://localhost:8765/__h.html'); pg3.wait_for_timeout(1200)
        f = pg3.frames[1]
        f.evaluate("localStorage.clear();localStorage.setItem('lse_auth_v1',JSON.stringify({name:'An',role:'teacher'}));location.reload()"); pg3.wait_for_timeout(1200); f = pg3.frames[1]
        f.evaluate("openSet(SETS[0].id);startSet(0);PARTS.forEach(q=>markDone(q.id));st.part=3;testView();finish()"); pg3.wait_for_timeout(300)
        got = f.evaluate("[document.body.innerText.includes('sao mới'),document.querySelectorAll('.sticker').length,albumView(),document.querySelectorAll('.sticker:not(.lock)').length]")
        remote = pg3.evaluate("[Object.keys(LSE.prof.d.mov.stars),LSE.prof.d.mov.stk]")
        out.append(('reward', got[0], got[1], got[3], len(remote[0]), remote[1]))
        # nút Trang chủ: gửi lệnh nav -> home cho trang web (khung iframe), ở 4 màn hình
        pg4 = b.new_page(viewport=dict(width=900, height=800)); msgs = []
        pg4.expose_function('rec', lambda m: msgs.append(m))
        H4 = "<iframe id=f src='%s' style='width:900px;height:760px'></iframe><script>window.addEventListener('message',e=>{if(e.data&&e.data.lse)rec(JSON.stringify(e.data))})</script>" % URL
        pg4.route('http://localhost:8765/__h4.html', lambda r: r.fulfill(body=H4, content_type='text/html')); pg4.goto('http://localhost:8765/__h4.html'); pg4.wait_for_timeout(1200)
        f4 = pg4.frames[1]; n_ok = 0
        for view in ("goHome()", "openSet(SETS[0].id)", "openSet(SETS[0].id);startSet(0)", "albumView()"):
            f4.evaluate(view); pg4.wait_for_timeout(150); before = len(msgs)
            f4.evaluate("[...document.querySelectorAll('.sbar .ni')].find(b=>/Trang chủ/.test(b.textContent)).click()"); pg4.wait_for_timeout(150)
            n_ok += int(len(msgs) > before and '"nav"' in msgs[-1] and '"home"' in msgs[-1])
        out.append(('home', n_ok))
        b.close()
    return out
rw = reward_tests(); print('đồng bộ:', rw)
if not (rw[0][1] and rw[0][2] and rw[0][3] and rw[1][1] == 0 and rw[1][2] == False and rw[2][1] and rw[2][2] >= 1 and rw[2][3] == 1 and rw[2][4] == 1 and rw[2][5] == [0] and rw[3][1] == 4): bad.append(('sync', rw))
print('phép đo:', checks, '| lỗi:', len(bad))
for x in bad[:30]: print(x)
