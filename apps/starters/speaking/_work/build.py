"""Ghép _work/template.html + _work/data.json -> ../speaking.html
   python3 build.py            -> bản dùng trên website (ảnh tham chiếu bằng đường dẫn)
   python3 build.py --inline OUT.html -> bản 1 file, nhúng sẵn ảnh (để xem thử/duyệt giao diện)
"""
import json, os, sys, base64, mimetypes, io
W = os.path.dirname(os.path.abspath(__file__)) + '/'
OUT = W + '../speaking.html'
t = open(W + 'template.html', encoding='utf8').read()
d = json.load(open(W + 'data.json', encoding='utf8'))
inline = {}
if '--inline' in sys.argv:
    OUT = sys.argv[sys.argv.index('--inline') + 1]
    from PIL import Image
    def enc(path, maxw=None):
        full = os.path.normpath(os.path.join(W, '..', path))
        im = Image.open(full)
        if maxw and im.width > maxw:
            im = im.resize((maxw, int(im.height * maxw / im.width)))
        buf = io.BytesIO(); fmt = 'WEBP'
        im.save(buf, fmt, quality=82); return 'data:image/webp;base64,' + base64.b64encode(buf.getvalue()).decode()
    paths = set()
    for s in d['sets']:
        if s.get('scene', {}).get('img'): paths.add(s['scene']['img'])
        for c in s['cards'].values(): paths.add(c['img'])
    for p in paths: inline[p] = enc(p)
    for n in ['vay-tay', 'dung', 'chi-bang', 'co-vu', 'nhay-mat', 'reo-ho', 'an-mung']:
        k = '../../../assets/ui/chibi-%s.png' % n
        inline[k] = enc(k, 300)
    inline['../../../assets/chibi.png'] = enc('../../../assets/chibi.png', 160)
j = lambda o: json.dumps(o, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
out = t.replace('@@DATA@@', j(d)).replace('@@INLINE@@', j(inline) if inline else 'null')
open(OUT, 'w', encoding='utf8').write(out)
print('built', OUT, len(out), 'bytes')
