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
            pg.add_init_script("try{localStorage.setItem('lse_speaking_movers_v1_teach','%s');localStorage.setItem('lse_speaking_movers_v1_lockSets','0')}catch(e){}" % ('1' if teach else '0'))
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
print('phép đo:', checks, '| lỗi:', len(bad))
for x in bad[:30]: print(x)
