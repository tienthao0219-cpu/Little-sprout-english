"""Tách nền ảnh thẻ đồ vật (clipart nền trắng) -> webp trong suốt, có viền trắng kiểu sticker.

Cách dùng (chạy từ bất kỳ đâu):
    python3 _work/cutout.py            # xử lý mọi ảnh trong _work/raw/<mã bộ>/  ->  img/<mã bộ>/
    python3 _work/cutout.py ptp-t1     # chỉ một bộ

Ảnh gốc (nền trắng hoặc gần trắng) bỏ vào _work/raw/<mã bộ>/<tên>.png|jpg|webp.
KHÔNG xử lý scene.webp (tranh cảnh) và các ảnh khác trong thư mục raw: đặt chúng thẳng vào img/<mã bộ>/.
Cần: Pillow, numpy (pip install pillow numpy).
"""
import os, sys, glob
import numpy as np
from PIL import Image, ImageFilter

W = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT_MAX = 400          # cạnh dài nhất sau khi cắt (px)
PAD = 14               # lề trong suốt quanh vật (px, ở kích thước đã thu)
OUTLINE = 6            # độ dày viền trắng sticker (px)
BG_T = 238             # kênh nhỏ nhất >= ngưỡng này mới coi là nền

def cutout(src):
    im = Image.open(src).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    mn = a.min(axis=2)
    w, h = im.size
    cand = mn >= BG_T                           # ứng viên nền: gần trắng
    # chỉ nền NỐI VỚI MÉP ảnh mới bị xoá (màu trắng bên trong vật, vd. mắt ếch, được giữ)
    bg = np.zeros_like(cand)
    stack = [(y, x) for x in range(w) for y in (0, h - 1)] + [(y, x) for y in range(h) for x in (0, w - 1)]
    while stack:
        y, x = stack.pop()
        if 0 <= y < h and 0 <= x < w and cand[y, x] and not bg[y, x]:
            bg[y, x] = True
            stack += [(y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)]
    obj = Image.fromarray(np.where(bg, 0, 255).astype(np.uint8), 'L').filter(ImageFilter.MedianFilter(3))   # bỏ hạt bụi lẻ
    obj = np.asarray(obj) > 127
    # bỏ các mảnh vụn nhỏ (vd. một góc của vật bên cạnh lọt vào khung cắt): chỉ giữ các mảng >= 8% mảng lớn nhất
    lab = np.zeros(obj.shape, np.int32); sizes = {}; n = 0
    for sy, sx in zip(*np.nonzero(obj)):
        if lab[sy, sx]: continue
        n += 1; lab[sy, sx] = n; stack = [(sy, sx)]; cnt = 0
        while stack:
            y, x = stack.pop(); cnt += 1
            for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                if 0 <= ny < h and 0 <= nx < w and obj[ny, nx] and not lab[ny, nx]:
                    lab[ny, nx] = n; stack.append((ny, nx))
        sizes[n] = cnt
    if sizes:
        big = max(sizes.values()); keep = [k for k, v in sizes.items() if v >= 0.08 * big]
        obj = np.isin(lab, keep)
    # viền mềm: pixel sát nền và sáng -> alpha một phần (xoá quầng trắng)
    alpha = obj.astype(np.float32)
    near_bg = np.asarray(Image.fromarray((~obj * 255).astype(np.uint8), 'L').filter(ImageFilter.MaxFilter(3))) > 127
    near = near_bg & obj
    soft = np.clip((255 - mn) / (255 - 170.0), 0, 1)
    alpha[near] = np.minimum(alpha[near], np.maximum(soft[near], 0.25))
    rgba = np.dstack([a.clip(0, 255).astype(np.uint8), (alpha * 255).astype(np.uint8)])
    img = Image.fromarray(rgba, 'RGBA')
    bbox = img.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox()
    img = img.crop(bbox)
    s = OUT_MAX / max(img.size)
    if s < 1: img = img.resize((max(1, round(img.width * s)), max(1, round(img.height * s))), Image.LANCZOS)
    # viền trắng sticker
    pad = PAD + OUTLINE
    canvas = Image.new('RGBA', (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(img, (pad, pad), img)
    al = canvas.getchannel('A').point(lambda v: 255 if v > 40 else 0)
    ring = al.filter(ImageFilter.MaxFilter(2 * OUTLINE + 1)).filter(ImageFilter.GaussianBlur(1.1))
    white = Image.new('RGBA', canvas.size, (255, 255, 255, 255)); white.putalpha(ring)
    out = Image.alpha_composite(white, canvas)
    return out

def main():
    sets = sys.argv[1:] or [os.path.basename(p) for p in glob.glob(W + 'raw/*') if os.path.isdir(p)]
    for sid in sets:
        os.makedirs(W + '../img/' + sid, exist_ok=True)
        for f in sorted(glob.glob(W + 'raw/%s/*' % sid)):
            if f.rsplit('.', 1)[-1].lower() not in ('png', 'jpg', 'jpeg', 'webp'): continue
            name = os.path.splitext(os.path.basename(f))[0]
            if name.startswith('scene') or name.startswith('_'): continue
            o = cutout(f); dst = W + '../img/%s/%s.webp' % (sid, name)
            o.save(dst, 'WEBP', quality=92, method=6)
            print('cutout', sid, name, o.size, os.path.getsize(dst) // 1024, 'KB')

if __name__ == '__main__':
    main()
