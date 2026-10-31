# -*- coding: utf-8 -*-
"""Cắt ảnh 1 bộ Movers Speaking từ 3 trang sách (Part 1, Part 2, Part 3) -> img/<id>/*.webp
  python3 crop_set.py <id> <pdf> <pg1> <pg2> <pg3> [--rot -90] [--rot1 N --rot2 N --rot3 N]
Trang sách in xoay 90° nên mặc định xoay theo chiều kim đồng hồ (-90): sau khi xoay, tranh CÔ (examiner) ở bên TRÁI.
Part 1: p1ex.webp, p1cand.webp.  Part 2: p2.webp (ảnh ghép dải 4 tranh) + p2box.  Part 3: p3s1..p3s4.webp (mỗi hàng = 1 bộ, 4 ô đều nhau).
Trang scan nền nhiễu: tự thử các ngưỡng 240 → 225 → 205 → 185 cho đến khi nhận đủ khung.
Ghi toạ độ p2box vào sets/_crop/<id>.json (build đọc tự động)."""
import sys, os, json, cv2, numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import pg
from pg import render, panels
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'img'); PAGES = '/home/claude/mv/pages'
THRS = (240, 225, 205, 185)

def save(im, path, maxw=1000, q=80):
    h, w = im.shape[:2]
    if w > maxw: im = cv2.resize(im, (maxw, int(h*maxw/w)), interpolation=cv2.INTER_AREA)
    os.makedirs(os.path.dirname(path), exist_ok=True); cv2.imwrite(path, im, [cv2.IMWRITE_WEBP_QUALITY, q])

def tight(im, thr=240):
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY); ys, xs = np.where(g < thr)
    return xs.min(), ys.min(), xs.max()-xs.min()+1, ys.max()-ys.min()+1

def rows_by_y(ps, tol=60):
    ps = sorted(ps, key=lambda b: (b[1], b[0])); rows = []
    for p in ps:
        if rows and abs(p[1]-rows[-1][0][1]) < tol: rows[-1].append(p)
        else: rows.append([p])
    return [sorted(r, key=lambda b: b[0]) for r in rows]

def part1_panels(im):
    H, W = im.shape[:2]
    for thr in THRS:
        ps = [b for b in panels(im, thr=thr) if b[2]*b[3] > 0.08*H*W and b[2] < 0.97*W]
        ps = sorted(ps, key=lambda b: -b[2]*b[3])[:2]
        if len(ps) == 1 and ps[0][2] > 1.2*ps[0][3]:               # hai tranh dính nhau -> tách đôi
            x, y, w, h = ps[0]; ps = [(x, y, w//2 - 3, h), (x + w//2 + 3, y, w//2 - 3, h)]
        if len(ps) == 2:
            cx = [p[0]+p[2]/2 for p in ps]; cy = [p[1]+p[3]/2 for p in ps]
            ps = sorted(ps, key=lambda b: b[1]) if abs(cy[0]-cy[1]) > abs(cx[0]-cx[1]) else sorted(ps, key=lambda b: b[0])
            a, b = ps
            if abs(a[3]-b[3]) < 0.1*a[3] and abs(a[2]-b[2]) < 0.1*a[2]:
                # hai tranh phải bằng nhau: lấy tranh nhỏ hơn (sạch, không dính bóng lề scan) làm chuẩn, neo ở cạnh trong (cạnh sát nhau)
                ref = a if a[2]*a[3] <= b[2]*b[3] else b; w, h = ref[2], ref[3]
                if abs(cy[0]-cy[1]) > abs(cx[0]-cx[1]):    # trên/dưới: neo cạnh trong (đáy tranh trên, đỉnh tranh dưới), cùng cạnh trái của tranh chuẩn
                    top, bot = a, b                         # (đã sắp theo y)
                    top2 = top if top is ref else (ref[0], top[1]+top[3]-h, w, h)
                    bot2 = bot if bot is ref else (ref[0], bot[1], w, h)
                    return [top2, bot2]
                a2 = (a[0]+a[2]-w, ref[1], w, h) if a is not ref else a      # tranh trái: neo cạnh phải
                b2 = (b[0], ref[1], w, h) if b is not ref else b             # tranh phải: neo cạnh trái
                return [a2, b2]
    raise SystemExit('part1: không nhận được 2 tranh')

def part2_panels(win):
    for thr in THRS:
        pp = [b for b in panels(win, close=25, thr=thr) if b[2] < win.shape[1]*0.9 and b[3] > win.shape[0]*0.15 and b[2] > win.shape[1]*0.12]
        if len(pp) == 4: return pp
    raise SystemExit('part2: không nhận được 4 tranh (%d)' % len(pp))


def find_story_panels(im):
    """4 khung tranh kể chuyện. Xử lý: khung bị dính nhau (chia đôi), thiếu 1 khung (suy ra theo khoảng cách đều)."""
    H, W = im.shape[:2]; last = []
    for close, thr in [(c, t) for t in THRS for c in (25, 9, 3)]:
        cand = [b for b in panels(im, close=close, thr=thr) if b[2] < W*0.6 and b[3] > H*0.12 and b[2] > W*0.10]
        last = cand
        if len(cand) == 4: return cand
        if 2 <= len(cand) <= 3:
            ref = min(b[2] for b in cand if b[3] > 0.9*max(c[3] for c in cand)) if cand else 0
            out = []
            for b in cand:
                n = int(round(b[2] / ref)) if ref else 1
                if n >= 2 and b[2] > 1.7*ref:
                    w = b[2] // n
                    out += [(b[0] + k*w, b[1], w - 4, b[3]) for k in range(n)]
                else: out.append(b)
            if len(out) == 4: return out
            if len(out) == 3:                                    # thiếu 1 khung: suy ra từ khoảng cách đều trong cùng hàng
                rows = {}
                for b in out: rows.setdefault(round(b[1]/80), []).append(b)
                full = [r for r in rows.values() if len(r) == 2]
                if full:
                    r = sorted(full[0], key=lambda b: b[0]); sp = r[1][0] - r[0][0]
                    x = r[0][0] - sp
                    if x >= 0: return out + [(x, r[0][1], r[0][2], r[0][3])]
    raise SystemExit('part2: không nhận được 4 tranh (%d)' % len(last))

def part3_rows(im, maxw=0.2, maxh=0.3):
    H, W = im.shape[:2]
    for thr in THRS:
        ps = [b for b in panels(im, min_area=0.002, thr=thr) if b[2] < W*maxw and b[3] < H*maxh]
        rows = rows_by_y(ps)
        if len(rows) == 4 and all(len(r) == 4 for r in rows): return rows
    raise SystemExit('part3: không nhận được 4x4 tranh')

def run(sid, pdf, p1, p2, p3, rot=-90, rot1=None, rot2=None, rot3=None, swap1=False):
    rot1 = rot if rot1 is None else rot1; rot2 = rot if rot2 is None else rot2; rot3 = rot if rot3 is None else rot3
    d = os.path.join(OUT, sid); info = {}
    # ---- Part 1
    im = render(pdf, p1, f'{PAGES}/{sid}_1.png', rot=rot1)
    ps = part1_panels(im)
    if swap1: ps = [ps[1], ps[0]]                              # trang in ngược chiều: tranh cô là tranh bên phải sau khi xoay
    for name, (x, y, w, h) in zip(('p1ex', 'p1cand'), ps): save(im[y:y+h, x:x+w], f'{d}/{name}.webp')
    info['p1_boxes'] = [list(map(int, b)) for b in ps]
    # ---- Part 2 (ảnh ghép dải 4 tranh + tên truyện). Trang quét dạng 2 trang liền nhau (cao hơn rộng): lấy nửa dưới.
    im = render(pdf, p2, f'{PAGES}/{sid}_2.png', rot=rot2)
    if im.shape[0] > im.shape[1]: im = im[im.shape[0]//2:]
    H, W = im.shape[:2]
    pp = find_story_panels(im)
    pp = sorted(pp, key=lambda b: (round(b[1]/80), b[0]))
    ux, uy = min(b[0] for b in pp), min(b[1] for b in pp); ux2, uy2 = max(b[0]+b[2] for b in pp), max(b[1]+b[3] for b in pp)
    x0 = max(0, ux-12); y0 = max(0, uy-int(.075*H)); x1 = min(W, max(ux2, pp[0][0]+pp[0][2]+int(.10*W))+12); y1 = min(H, uy2+12)
    comp = im[y0:y1, x0:x1]; cw, ch = comp.shape[1], comp.shape[0]
    save(comp, f'{d}/p2.webp', maxw=1400)
    info['p2box'] = [[round((b[0]-x0)/cw, 4), round((b[1]-y0)/ch, 4), round(b[2]/cw, 4), round(b[3]/ch, 4)] for b in pp]
    # ---- Part 3: 4 hàng x 4 tranh -> dựng lại mỗi hàng thành 4 ô ĐỀU nhau
    im = render(pdf, p3, f'{PAGES}/{sid}_3.png', rot=rot3)
    rows = part3_rows(im); info['p3_rows'] = [len(r) for r in rows]
    for i, r in enumerate(rows):
        Hc = 300; tiles = [cv2.resize(im[y:y+h, x:x+w], (max(1, int(w*Hc/h)), Hc), interpolation=cv2.INTER_AREA) for (x, y, w, h) in r]
        cw2 = max(t.shape[1] for t in tiles) + 24
        canvas = np.full((Hc + 24, cw2*4, 3), 255, np.uint8)
        for k, t in enumerate(tiles):
            x0 = k*cw2 + (cw2 - t.shape[1])//2; canvas[12:12+Hc, x0:x0+t.shape[1]] = t
        save(canvas, f'{d}/p3s{i+1}.webp', maxw=1100)
    os.makedirs(os.path.join(HERE, '..', 'sets', '_crop'), exist_ok=True)
    json.dump({'p2box': info['p2box']}, open(os.path.join(HERE, '..', 'sets', '_crop', sid + '.json'), 'w'))
    return info

if __name__ == '__main__':
    a = sys.argv
    if '--margin' in a: pg.MARGIN = float(a[a.index('--margin')+1])
    g = lambda k: int(a[a.index(k)+1]) if k in a else None
    print(json.dumps(run(a[1], a[2], int(a[3]), int(a[4]), int(a[5]), g('--rot') if g('--rot') is not None else -90, g('--rot1'), g('--rot2'), g('--rot3'), '--swap1' in a)))
