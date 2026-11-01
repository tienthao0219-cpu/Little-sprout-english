# Tách các bảng ảnh cô Thảo gửi (chữ cái, số 1-20, số 21-100, màu) thành từng thẻ webp + vẽ bù số còn thiếu.
# Chạy:  python3 build_images.py   (cần Pillow, numpy; font Outfit cho số vẽ bù: đặt đường dẫn ở gen_tiles.FONT)
import os, json
from PIL import Image
import sheetcut as S, gen_tiles as G
W = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT = W + '../img/'
LETTERS = [chr(65 + i) for i in range(26)]
COLOURS = ['red', 'orange', 'yellow', 'light-green', 'green', 'light-blue', 'blue', 'purple', 'pink', 'brown', 'black', 'white']
# thứ tự từng ô trong bảng 21–100 (None = ô SAI/TRÙNG trong ảnh gốc, bỏ đi): 22 bị lặp (đúng ra là 23), 56 bị lặp (đúng ra là 55)
S21 = [21, 22, None, 24, 25, 26, 27, 28, 30,   31, 32, 33, 34, 35, 36, 37, 39, 40,   41, 42, 43, 44, 45, 47, 48, 49, 50,
       51, 52, 53, 54, None, 56, 57, 59, 60,   61, 62, 63, 64, 65, 66, 68, 69, 70,   71, 72, 73, 74, 75, 76, 77, 78, 80,
       81, 82, 83, 84, 85, 86, 87, 88, 90,   91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
# số thiếu → vẽ bù trên nền mây của ô mẫu (hàng-cột) với màu chữ
MISSING = {23: ('r1c3', 'orange'), 29: ('r1c1', 'pink'), 38: ('r2c1', 'blue'), 46: ('r3c3', 'green'), 55: ('r3c4', 'purple'),
           58: ('r4c4', 'yellow'), 67: ('r5c5', 'pink'), 79: ('r6c1', 'blue'), 89: ('r6c3', 'orange')}

def round_if_leaky(im, r=.12):
    """thẻ nền pastel nhạt có quầng sáng ở góc → bo lại đúng hình chữ nhật bo góc (chỉ áp dụng khi có tràn)"""
    import numpy as np
    from PIL import ImageDraw
    w, h = im.size; rad = int(r * min(w, h))
    m = Image.new('L', (w * 4, h * 4), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w * 4 - 1, h * 4 - 1), radius=rad * 4, fill=255)
    m = m.resize((w, h), Image.LANCZOS); mm = np.asarray(m).astype(int); al = np.asarray(im.getchannel('A')).astype(int)
    if ((al > 40) & (mm < 30)).sum() <= 25: return im
    from PIL import ImageChops
    im = im.copy(); im.putalpha(ImageChops.multiply(im.getchannel('A'), m)); return im

def save(im, path, width):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if im.width != width: im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(path, 'WEBP', quality=84, method=6)
    return os.path.getsize(path)

LIM = {}
def grid(name):
    im, rows = S.tiles(W + 'sheets/' + name + '.webp')
    rows = S.split_merged(im, rows)
    for k, v in S.limits(rows).items(): LIM[rows[k[0]][k[1]]] = v
    return im, rows

total = 0
# chữ cái
im, rows = grid('alphabet'); flat = [b for r in rows for b in r]; assert len(flat) == 26, len(flat)
for L, b in zip(LETTERS, flat): total += save(round_if_leaky(S.cut(im, b, LIM[b])), OUT + 'alphabet/' + L.lower() + '.webp', 360)
# số 1-20
im, rows = grid('num1_20'); flat = [b for r in rows for b in r]; assert len(flat) == 20, len(flat)
for n, b in enumerate(flat, 1): total += save(round_if_leaky(S.cut(im, b, LIM[b])), OUT + 'numbers/%d.webp' % n, 360)
# màu
im, rows = grid('colours'); flat = [b for r in rows for b in r]; assert len(flat) == 12, len(flat)
for c, b in zip(COLOURS, flat): total += save(round_if_leaky(S.cut(im, b, LIM[b])), OUT + 'colours/' + c + '.webp', 360)
# số 21-100
im, rows = grid('num21_100'); flat = [b for r in rows for b in r]; assert len(flat) == len(S21), (len(flat), len(S21))
tile = {}
for ri, r in enumerate(rows):
    for ci, b in enumerate(r): tile['r%dc%d' % (ri + 1, ci + 1)] = S.cut(im, b, LIM[b])
pos = [('r%dc%d' % (ri + 1, ci + 1)) for ri, r in enumerate(rows) for ci in range(len(r))]
have = set()
for n, p in zip(S21, pos):
    if n is None: continue
    t = tile[p]; t = t.resize((t.width * 2, t.height * 2), Image.LANCZOS)
    total += save(t, OUT + 'numbers/%d.webp' % n, 400); have.add(n)
for n, (base, col) in MISSING.items():
    assert n not in have
    total += save(G.make(tile[base], str(n), col), OUT + 'numbers/%d.webp' % n, 400); have.add(n)
assert have == set(range(21, 101)), sorted(set(range(21, 101)) - have)
json.dump({'generated': sorted(MISSING)}, open(W + '../img/_generated.json', 'w'))
print('xong, tổng %.0f KB' % (total / 1024))
