# Chuẩn hoá khung ảnh: mọi ảnh trong cùng một bộ có CÙNG kích thước (tỉ lệ khung theo trung vị của bộ), căn giữa, nền trong suốt, không méo.
import os, statistics
from PIL import Image
IMG = os.path.dirname(os.path.abspath(__file__)) + '/../img/'
SETS = {
    'alphabet': ('alphabet', [c for c in 'abcdefghijklmnopqrstuvwxyz'], 360),
    'numbers-1-20': ('numbers', [str(n) for n in range(1, 21)], 360),
    'colours': ('colours', ['red', 'orange', 'yellow', 'light-green', 'green', 'light-blue', 'blue', 'purple', 'pink', 'brown', 'black', 'white'], 360),
    'numbers-21-100': ('numbers', [str(n) for n in range(21, 101)], 400),
}
def fit_set(folder, names, W):
    paths = [IMG + folder + '/' + n + '.webp' for n in names]
    ims = [Image.open(p).convert('RGBA') for p in paths]
    ratio = statistics.median(i.width / i.height for i in ims)
    H = round(W / ratio)
    for p, im in zip(paths, ims):
        s = min(W / im.width, H / im.height)
        nw, nh = max(1, round(im.width * s)), max(1, round(im.height * s))
        r = im.resize((nw, nh), Image.LANCZOS) if (nw, nh) != im.size else im
        canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0)); canvas.paste(r, ((W - nw) // 2, (H - nh) // 2), r)
        canvas.save(p, 'WEBP', quality=90, method=6)
    return W, H
if __name__ == '__main__':
    for k, (f, n, w) in SETS.items(): print(k, fit_set(f, n, w))
