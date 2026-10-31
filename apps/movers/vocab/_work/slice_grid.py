# -*- coding: utf-8 -*-
"""Cắt ảnh lưới (3x3 / 3x2) thành từng ô. Dùng: slice_grid.py <ảnh> <cols> <rows> <thư mục ra> [--qa qa.png]
Trả về danh sách file ô theo thứ tự trái→phải, trên→dưới."""
import sys, os, numpy as np
from PIL import Image, ImageDraw

def bands(mask1d, n, minfrac=0.35):
    on = mask1d > minfrac
    runs, s = [], None
    for i, v in enumerate(on):
        if v and s is None: s = i
        if not v and s is not None: runs.append((s, i)); s = None
    if s is not None: runs.append((s, len(on)))
    runs = [r for r in runs if r[1] - r[0] > 30]
    return runs

def find_cells(im, cols, rows):
    a = np.asarray(im.convert('RGB')).astype(int)
    nonwhite = (a.min(axis=2) < 238)
    cb = bands(nonwhite.mean(axis=0), cols)
    rb = bands(nonwhite.mean(axis=1), rows)
    if len(cb) != cols or len(rb) != rows:
        raise SystemExit('không tách được lưới: %d cột, %d hàng (cần %dx%d) %s %s' % (len(cb), len(rb), cols, rows, cb, rb))
    return [(c0, r0, c1, r1) for (r0, r1) in rb for (c0, c1) in cb]

def trim(im, box, inset_frac=0.028, radius_frac=0.07, out=480):
    c0, r0, c1, r1 = box
    w, h = c1 - c0, r1 - r0
    ins = int(round(min(w, h) * inset_frac))   # bỏ viền khung đen
    cell = im.convert('RGB').crop((c0 + ins, r0 + ins, c1 - ins, r1 - ins))
    cell = cell.resize((out, int(round(out * cell.height / cell.width))), Image.LANCZOS)
    m = Image.new('L', cell.size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, cell.width - 1, cell.height - 1), radius=int(out * radius_frac), fill=255)
    cell.putalpha(m)
    return cell

def main():
    src, cols, rows, outdir = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    im = Image.open(src)
    boxes = find_cells(im, cols, rows)
    os.makedirs(outdir, exist_ok=True)
    res = []
    for i, b in enumerate(boxes):
        t = trim(im, b); p = os.path.join(outdir, 'cell%02d.png' % (i + 1)); t.save(p); res.append(p)
    print(len(res), 'ô', [(b[2]-b[0], b[3]-b[1]) for b in boxes][:3])

if __name__ == '__main__':
    main()
