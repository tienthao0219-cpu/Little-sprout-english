"""Vẽ lưới 10% (có số) lên tranh để đọc toạ độ phần trăm của các vật.
    python3 grid_scene.py <mã bộ> [ảnh]      mặc định ảnh = ../../img/<mã bộ>/scene.webp   ->  ../check/<mã bộ>-grid.png
"""
import os, sys
from PIL import Image, ImageDraw
W = os.path.dirname(os.path.abspath(__file__)) + '/../'
sid = sys.argv[1]; src = sys.argv[2] if len(sys.argv) > 2 else W + '../img/%s/scene.webp' % sid
im = Image.open(src).convert('RGB'); k = 1000 / im.width; im = im.resize((1000, round(im.height * k))); w, h = im.size
d = ImageDraw.Draw(im)
for i in range(1, 10):
    x = w * i / 10; y = h * i / 10
    d.line([(x, 0), (x, h)], fill=(255, 0, 0), width=1); d.line([(0, y), (w, y)], fill=(255, 0, 0), width=1)
    d.text((x + 3, 2), str(i * 10), fill=(255, 0, 0)); d.text((2, y + 2), str(i * 10), fill=(255, 0, 0))
os.makedirs(W + 'check', exist_ok=True); im.save(W + 'check/%s-grid.png' % sid); print('ok', W + 'check/%s-grid.png' % sid, im.size)
