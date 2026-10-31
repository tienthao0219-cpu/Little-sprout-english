"""ghép các hàng Part 3 (p3s1..4) của vài bộ vào 1 ảnh kiểm tra, có số 1-4 trên mỗi tranh.  python3 rowsmontage.py out.jpg id1 id2 ..."""
import sys, os, cv2, numpy as np
IMG = os.path.join(os.path.dirname(__file__), '..', '..', 'img')
def sheet(sid, w=640):
    rows = []
    for i in range(1, 5):
        im = cv2.imread(f'{IMG}/{sid}/p3s{i}.webp')
        if im is None: continue
        im = cv2.resize(im, (w, int(im.shape[0] * w / im.shape[1])))
        W = im.shape[1]
        for k in range(4): cv2.putText(im, f'{i}.{k+1}', (int(W * (k + .5) / 4) - 18, 20), cv2.FONT_HERSHEY_SIMPLEX, .6, (0, 0, 220), 2)
        rows.append(im); rows.append(np.full((4, w, 3), 255, np.uint8))
    top = np.full((24, w, 3), 255, np.uint8); cv2.putText(top, sid, (4, 18), cv2.FONT_HERSHEY_SIMPLEX, .6, (0, 0, 0), 2)
    return np.vstack([top] + rows)
sheets = [sheet(s) for s in sys.argv[2:]]; H = max(s.shape[0] for s in sheets)
sheets = [np.vstack([s, np.full((H - s.shape[0], s.shape[1], 3), 255, np.uint8)]) for s in sheets]
cv2.imwrite(sys.argv[1], np.hstack(sheets), [cv2.IMWRITE_JPEG_QUALITY, 85])
