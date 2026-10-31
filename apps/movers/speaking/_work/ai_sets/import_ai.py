# -*- coding: utf-8 -*-
"""Nhập ảnh AI của 1 bộ vào app.   python3 import_ai.py <id> [thư_mục_ảnh]     (mặc định thư mục _work/ai_in)
Cần: <id>_p1a.png (tranh cô), <id>_p1b.png (tranh em), <id>_p2.png (lưới 2x2), <id>_p3.png (lưới 4x4)  HOẶC <id>_p3_row1..4.png (mỗi hàng 4 tranh).
Kết quả: img/<id>/{p1ex,p1cand,p2,p3s1..4}.webp, sets/_crop/<id>.json (p2box), thêm id vào sets/_ai_ready.json (bộ hiện ra khi chạy build.py).
Sau đó: xem ảnh lưới (tools/gridpair.py <id>) rồi ghi vòng khoanh Part 1 vào sets/_crop/<id>.json khoá "dif": [{"b":[x,y,w,h],"w":["...","..."],"b2":[...]}, ...]"""
import sys, os, json, cv2, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(HERE, '..')
sys.path.insert(0, os.path.join(W, 'tools'))
import pg; pg.MARGIN = 0.0
from pg import panels
from crop_set import save, find_story_panels, part3_rows, rows_by_y, THRS
def rd(p):
    im = cv2.imread(p); assert im is not None, 'không đọc được ' + p; return im
def tile_row(im, r, d, i):
    Hc = 300; tiles = [cv2.resize(im[y:y+h, x:x+w], (max(1, int(w*Hc/h)), Hc), interpolation=cv2.INTER_AREA) for (x, y, w, h) in r]
    cw = max(t.shape[1] for t in tiles) + 24; canvas = np.full((Hc + 24, cw*4, 3), 255, np.uint8)
    for k, t in enumerate(tiles): x0 = k*cw + (cw - t.shape[1])//2; canvas[12:12+Hc, x0:x0+t.shape[1]] = t
    save(canvas, f'{d}/p3s{i}.webp', maxw=1100)
def run(sid, src):
    d = os.path.join(W, '..', 'img', sid); f = lambda n: os.path.join(src, f'{sid}_{n}.png')
    a, b = rd(f('p1a')), rd(f('p1b')); save(a, f'{d}/p1ex.webp'); save(cv2.resize(b, (a.shape[1], a.shape[0])), f'{d}/p1cand.webp')
    im = rd(f('p2')); pp = find_story_panels(im); pp = sorted(pp, key=lambda b: (round(b[1]/80), b[0]))
    x0 = max(0, min(b[0] for b in pp)-12); y0 = max(0, min(b[1] for b in pp)-12); x1 = min(im.shape[1], max(b[0]+b[2] for b in pp)+12); y1 = min(im.shape[0], max(b[1]+b[3] for b in pp)+12)
    comp = im[y0:y1, x0:x1]; cw, ch = comp.shape[1], comp.shape[0]; save(comp, f'{d}/p2.webp', maxw=1400)
    p2box = [[round((b[0]-x0)/cw, 4), round((b[1]-y0)/ch, 4), round(b[2]/cw, 4), round(b[3]/ch, 4)] for b in pp]
    if os.path.exists(f('p3')): img3 = rd(f('p3')); rows = part3_rows(img3, 0.30, 0.30); [tile_row(img3, r, d, i+1) for i, r in enumerate(rows)]
    else:
        for i in range(1, 5):
            im3 = rd(f(f'p3_row{i}')); ps = [b for b in panels(im3, min_area=0.01, thr=240) if b[3] > im3.shape[0]*0.4]
            ps = sorted(ps, key=lambda b: b[0])[:4]; assert len(ps) == 4, f'hàng {i}: nhận {len(ps)} tranh'; tile_row(im3, ps, d, i)
    cj = os.path.join(W, 'sets', '_crop'); os.makedirs(cj, exist_ok=True); cp = os.path.join(cj, sid + '.json')
    old = json.load(open(cp)) if os.path.exists(cp) else {}; old['p2box'] = p2box; json.dump(old, open(cp, 'w'))
    rp = os.path.join(W, 'sets', '_ai_ready.json'); ready = json.load(open(rp)) if os.path.exists(rp) else []
    if sid not in ready: ready.append(sid); json.dump(ready, open(rp, 'w'))
    print('OK', sid, 'p2box', len(p2box))
if __name__ == '__main__': run(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else os.path.join(W, 'ai_in'))
