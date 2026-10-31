import subprocess, cv2, numpy as np, os, sys
def render(pdf, page, out, dpi=170, rot=-90):
    """render one pdf page, rotate (rot degrees CCW positive; -90 = clockwise) and save PNG"""
    base = out[:-4] + '_raw'
    subprocess.run(['pdftoppm','-r',str(dpi),'-png','-f',str(page),'-l',str(page),'-singlefile',pdf,base],check=True)
    im = cv2.imread(base+'.png')
    if rot == -90: im = cv2.rotate(im, cv2.ROTATE_90_CLOCKWISE)
    elif rot == 90: im = cv2.rotate(im, cv2.ROTATE_90_COUNTERCLOCKWISE)
    elif rot == 180: im = cv2.rotate(im, cv2.ROTATE_180)
    cv2.imwrite(out, im); os.remove(base+'.png'); return im
MARGIN = 0.04
def panels(im, min_area=0.004, thr=240, close=5):
    """detect picture panels = large non-white blobs. returns list of (x,y,w,h) sorted reading order"""
    g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    m = (g < thr).astype(np.uint8)*255
    H0, W0 = g.shape; mx, my = int(W0*MARGIN), int(H0*MARGIN)
    m[:, :mx] = 0; m[:, W0-mx:] = 0; m[:my, :] = 0; m[H0-my:, :] = 0      # bỏ bóng/lề trang scan
    k = cv2.getStructuringElement(cv2.MORPH_RECT,(close,close))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, k)
    cs,_ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    H,W = g.shape; out=[]
    for c in cs:
        x,y,w,h = cv2.boundingRect(c)
        if w*h >= min_area*W*H and w>W*0.04 and h>H*0.04: out.append((x,y,w,h))
    return out
if __name__ == '__main__':
    pdf, page, out = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    im = render(pdf, page, out)
    ps = panels(im); print(im.shape, len(ps))
    for p in sorted(ps, key=lambda b:(round(b[1]/50), b[0])): print(p)
