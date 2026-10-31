"""1 ảnh kiểm tra cho 1 bộ: lưới 2 tranh Part 1 + 4 hàng Part 3 (có số).  python3 qa_set.py <id>  -> /home/claude/mv/qa/<id>_qa.jpg"""
import sys, os, cv2, numpy as np
sys.path.insert(0, os.path.dirname(__file__))
IMG = os.path.join(os.path.dirname(__file__), '..', '..', 'img')
def grid(im, w):
    h = int(im.shape[0] * w / im.shape[1]); im = cv2.resize(im, (w, h)); o = im.copy()
    for k in range(1, 10):
        x = int(w * k / 10); y = int(h * k / 10)
        cv2.line(o, (x, 0), (x, h), (255, 0, 255), 1); cv2.line(o, (0, y), (w, y), (255, 0, 255), 1)
        cv2.putText(o, str(k), (x + 2, 13), cv2.FONT_HERSHEY_SIMPLEX, .45, (200, 0, 200), 1); cv2.putText(o, str(k), (2, y - 3), cv2.FONT_HERSHEY_SIMPLEX, .45, (200, 0, 200), 1)
    return cv2.addWeighted(o, .75, im, .25, 0)
def run(sid, W=1000):
    d = f'{IMG}/{sid}'
    a = cv2.imread(f'{d}/p1ex.webp'); b = cv2.imread(f'{d}/p1cand.webp'); b = cv2.resize(b, (a.shape[1], a.shape[0]))
    ga, gb = grid(a, W // 2 - 3), grid(b, W // 2 - 3); top = np.hstack([ga, np.full((ga.shape[0], 6, 3), 255, np.uint8), gb])
    rows = []
    for i in range(1, 5):
        r = cv2.imread(f'{d}/p3s{i}.webp')
        if r is None: continue
        r = cv2.resize(r, (W, int(r.shape[0] * W / r.shape[1])))
        for k in range(4): cv2.putText(r, f'{i}.{k+1}', (int(W * (k + .5) / 4) - 20, 22), cv2.FONT_HERSHEY_SIMPLEX, .7, (0, 0, 220), 2)
        rows += [r, np.full((3, W, 3), 200, np.uint8)]
    p2 = None if os.environ.get('NOP2') else cv2.imread(f'{d}/p2.webp')
    if p2 is not None: p2 = cv2.resize(p2, (W, int(p2.shape[0] * W / p2.shape[1]))); rows += [p2]
    m = np.vstack([top] + rows); k = 1.0 if m.shape[0] < 1700 else 1700 / m.shape[0]
    m = cv2.resize(m, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
    os.makedirs('/home/claude/mv/qa', exist_ok=True); cv2.imwrite(f'/home/claude/mv/qa/{sid}_qa.jpg', m, [cv2.IMWRITE_JPEG_QUALITY, 80]); print(sid, m.shape)
if __name__ == '__main__':
    for s in sys.argv[1:]: run(s)
