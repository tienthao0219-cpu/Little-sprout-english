"""Chuẩn hoá tranh cảnh: cắt giữa về đúng tỉ lệ 4:3, rộng 1500px, lưu thành img/<mã bộ>/scene.webp.
    python3 prep_scene.py <mã bộ> <tranh.png>
App hiển thị tranh theo khung 4:3, nên PHẢI cắt trước khi đo toạ độ (nếu không các vùng sẽ lệch).
Cảnh báo nếu phải cắt quá nhiều (tranh mất >10% mép) -> nên tạo lại tranh cho vừa khung.
"""
import os, sys
from PIL import Image
W = os.path.dirname(os.path.abspath(__file__)) + '/../../img/'
sid, src = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB'); w, h = im.size; r = w / h; target = 4 / 3
if abs(r - target) > 0.005:
    if r > target:
        nw = round(h * target); x0 = (w - nw) // 2; lost = 1 - nw / w; im = im.crop((x0, 0, x0 + nw, h))
    else:
        nh = round(w / target); y0 = (h - nh) // 2; lost = 1 - nh / h; im = im.crop((0, y0, w, y0 + nh))
    print('Đã cắt giữa về 4:3 (mất %.0f%% mép).%s' % (lost * 100, ' CẢNH BÁO: cắt nhiều, nên tạo lại tranh đúng khổ ngang 4:3.' if lost > 0.10 else ''))
im = im.resize((1500, 1125), Image.LANCZOS)
os.makedirs(W + sid, exist_ok=True); out = W + sid + '/scene.webp'; im.save(out, 'WEBP', quality=88, method=6)
print('Đã lưu', out, im.size, os.path.getsize(out) // 1024, 'KB')
