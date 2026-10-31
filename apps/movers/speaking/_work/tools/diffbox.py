"""So sánh p1ex và p1cand -> các vùng khác nhau (ô chuẩn hoá) + ảnh kiểm tra.  python3 diffbox.py <id> [thr] [min_area_frac]"""
import sys, os, cv2, numpy as np, json
IMG = os.path.join(os.path.dirname(__file__), '..', '..', 'img')
def run(sid, thr=60, minf=0.0006, dil=17):
    a = cv2.imread(f'{IMG}/{sid}/p1ex.webp'); b = cv2.imread(f'{IMG}/{sid}/p1cand.webp')
    b = cv2.resize(b, (a.shape[1], a.shape[0]))
    # căn chỉnh nhẹ (dịch vài px) bằng ECC trên ảnh xám
    ga, gb = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY), cv2.cvtColor(b, cv2.COLOR_BGR2GRAY)
    # dịch toàn ảnh: thử nhiều dịch chuyển nhỏ, chọn cái làm số điểm lệch ÍT NHẤT (bền hơn ECC khi có vật khác nhau)
    best = (1e18, 0, 0); H0, W0 = ga.shape
    ca = cv2.GaussianBlur(ga, (0, 0), 2).astype(np.float32); cb = cv2.GaussianBlur(gb, (0, 0), 2).astype(np.float32)
    for dy in range(-24, 25, 2):
        for dx in range(-24, 25, 2):
            M = np.float32([[1, 0, dx], [0, 1, dy]]); w = cv2.warpAffine(cb, M, (W0, H0), borderMode=cv2.BORDER_REPLICATE)
            sc = np.minimum(np.abs(ca - w), 40).mean()
            if sc < best[0]: best = (sc, dx, dy)
    _, dx, dy = best
    for ddy in range(dy - 1, dy + 2):
        for ddx in range(dx - 1, dx + 2):
            M = np.float32([[1, 0, ddx], [0, 1, ddy]]); w = cv2.warpAffine(cb, M, (W0, H0), borderMode=cv2.BORDER_REPLICATE)
            sc = np.minimum(np.abs(ca - w), 40).mean()
            if sc < best[0]: best = (sc, ddx, ddy)
    _, dx, dy = best
    b = cv2.warpAffine(b, np.float32([[1, 0, dx], [0, 1, dy]]), (W0, H0), borderMode=cv2.BORDER_REPLICATE)
    d = cv2.absdiff(cv2.GaussianBlur(a, (5, 5), 0), cv2.GaussianBlur(b, (5, 5), 0)).max(axis=2)
    m = (d > thr).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dil, dil)))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    H, W = a.shape[:2]; out = []
    for c in cs:
        x, y, w, h = cv2.boundingRect(c)
        if w * h >= minf * W * H: out.append((x, y, w, h, cv2.contourArea(c)))
    out.sort(key=lambda t: -t[4])
    vis = np.hstack([a.copy(), b.copy()])
    for i, (x, y, w, h, _) in enumerate(out):
        for off in (0, W):
            cv2.rectangle(vis, (x + off, y), (x + w + off, y + h), (0, 0, 255), 3)
            cv2.putText(vis, str(i), (x + off + 4, y + 28), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 0, 255), 3)
    os.makedirs('/home/claude/mv/qa', exist_ok=True); cv2.imwrite(f'/home/claude/mv/qa/{sid}_diff.jpg', cv2.resize(vis, None, fx=0.5, fy=0.5))
    return [[round(x / W, 4), round(y / H, 4), round(w / W, 4), round(h / H, 4)] for x, y, w, h, _ in out]
if __name__ == '__main__':
    r = run(sys.argv[1], *(float(v) if '.' in v else int(v) for v in sys.argv[2:]))
    print(len(r), json.dumps(r))
