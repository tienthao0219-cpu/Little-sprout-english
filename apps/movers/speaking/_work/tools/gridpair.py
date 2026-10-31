"""Ảnh kiểm tra: tranh cô | tranh em, có lưới 10% (nhãn 1-9) để đọc toạ độ.  python3 gridpair.py <id> [<id>...]  -> /home/claude/mv/qa/<id>_grid.jpg"""
import sys, os, cv2, numpy as np
IMG = os.path.join(os.path.dirname(__file__), '..', '..', 'img')
def grid(im, w=520):
    h = int(im.shape[0] * w / im.shape[1]); im = cv2.resize(im, (w, h)); o = im.copy()
    for k in range(1, 10):
        x = int(w * k / 10); y = int(h * k / 10)
        cv2.line(o, (x, 0), (x, h), (255, 0, 255), 1); cv2.line(o, (0, y), (w, y), (255, 0, 255), 1)
        cv2.putText(o, str(k), (x + 2, 14), cv2.FONT_HERSHEY_SIMPLEX, .5, (200, 0, 200), 1); cv2.putText(o, str(k), (2, y - 3), cv2.FONT_HERSHEY_SIMPLEX, .5, (200, 0, 200), 1)
    return cv2.addWeighted(o, .75, im, .25, 0)
for sid in sys.argv[1:]:
    a = cv2.imread(f'{IMG}/{sid}/p1ex.webp'); b = cv2.imread(f'{IMG}/{sid}/p1cand.webp')
    b = cv2.resize(b, (a.shape[1], a.shape[0])); ga, gb = grid(a), grid(b); m = np.hstack([ga, np.full((ga.shape[0], 6, 3), 255, np.uint8), gb])
    os.makedirs('/home/claude/mv/qa', exist_ok=True); cv2.imwrite(f'/home/claude/mv/qa/{sid}_grid.jpg', m, [cv2.IMWRITE_JPEG_QUALITY, 82])
