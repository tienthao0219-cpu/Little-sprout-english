"""Cắt tấm 8 thẻ (nền trắng, lưới 4 cột x 2 hàng) thành 8 ảnh thẻ riêng.

    python3 slice_sheet.py <mã bộ> <tấm_thẻ.png> <tên1> ... <tên8>
    tên theo thứ tự: hàng trên từ trái sang phải, rồi hàng dưới từ trái sang phải (đúng thứ tự trong prompt)
Kết quả: ../raw/<mã bộ>/<tên>.png (nền trắng, sẵn sàng cho cutout.py) và ../check/<mã bộ>-cards.png để xem lại.
Tự tìm 8 vật; nếu ảnh không tách được đúng 8 vật thì chia đều lưới 4x2.
"""
import os, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter, ImageDraw

W = os.path.dirname(os.path.abspath(__file__)) + '/../'

def components(im):
    """trả về danh sách bbox (x0,y0,x1,y1, diện tích) trên ảnh gốc, các vật được gộp bằng cách giãn mặt nạ"""
    sw = 520; k = sw / im.width; sh = round(im.height * k)
    small = im.resize((sw, sh), Image.BILINEAR)
    a = np.asarray(small).astype(np.int16)
    nonwhite = (a.min(axis=2) < 232) | ((a.max(axis=2) - a.min(axis=2)) > 28)
    m = Image.fromarray((nonwhite * 255).astype(np.uint8), 'L').filter(ImageFilter.MaxFilter(21))
    mask = np.asarray(m) > 127
    seen = np.zeros_like(mask); comps = []
    for y in range(sh):
        for x in range(sw):
            if mask[y, x] and not seen[y, x]:
                q = deque([(y, x)]); seen[y, x] = True; pts = []
                while q:
                    cy, cx = q.popleft(); pts.append((cy, cx))
                    for ny, nx in ((cy + 1, cx), (cy - 1, cx), (cy, cx + 1), (cy, cx - 1)):
                        if 0 <= ny < sh and 0 <= nx < sw and mask[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True; q.append((ny, nx))
                ys = [p[0] for p in pts]; xs = [p[1] for p in pts]
                comps.append((min(xs) / k, min(ys) / k, (max(xs) + 1) / k, (max(ys) + 1) / k, len(pts)))
    return comps

def order(boxes):
    boxes = sorted(boxes, key=lambda b: (b[1] + b[3]) / 2)
    top, bot = boxes[:4], boxes[4:]
    return sorted(top, key=lambda b: b[0]) + sorted(bot, key=lambda b: b[0])

def main():
    if len(sys.argv) != 11:
        print(__doc__); sys.exit(1)
    sid, sheet, names = sys.argv[1], sys.argv[2], sys.argv[3:]
    im = Image.open(sheet).convert('RGB'); w, h = im.size
    comps = [c for c in components(im) if c[4] > 40]
    comps.sort(key=lambda c: -c[4]); big = comps[:8]
    method = 'tự tìm vật'
    if len(comps) < 8 or (len(comps) > 8 and comps[8][4] > 0.25 * comps[7][4]):
        # không rõ 8 vật: chia đều lưới 4x2
        method = 'chia đều lưới 4x2 (không tách được đúng 8 vật: %d mảng)' % len(comps)
        big = [(i % 4 * w / 4, i // 4 * h / 2, (i % 4 + 1) * w / 4, (i // 4 + 1) * h / 2, 1) for i in range(8)]
    boxes = order([b[:4] for b in big])
    outdir = W + 'raw/%s/' % sid; os.makedirs(outdir, exist_ok=True); os.makedirs(W + 'check', exist_ok=True)
    pad = 14; crops = []
    for name, (x0, y0, x1, y1) in zip(names, boxes):
        c = im.crop((max(0, int(x0) - pad), max(0, int(y0) - pad), min(w, int(x1) + pad), min(h, int(y1) + pad)))
        c.save(outdir + name + '.png'); crops.append((name, c))
    # ảnh kiểm tra: tên + hình
    sheet_im = Image.new('RGB', (4 * 260, 2 * 280), (235, 235, 245)); d = ImageDraw.Draw(sheet_im)
    for i, (name, c) in enumerate(crops):
        t = c.copy(); t.thumbnail((240, 240)); x, y = i % 4 * 260 + 10, i // 4 * 280 + 10
        sheet_im.paste(t, (x, y)); d.text((x, y + 245), '%d. %s' % (i + 1, name), fill=(200, 0, 60))
    sheet_im.save(W + 'check/%s-cards.png' % sid)
    print('%s: cắt 8 thẻ bằng cách "%s" -> raw/%s/ ; xem _work/check/%s-cards.png' % (sid, method, sid, sid))

if __name__ == '__main__':
    main()
