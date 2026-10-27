"""crop_cards.py page.png outdir name1 name2 ... [--rot N] : cắt 8 thẻ (khung đen) theo thứ tự trái→phải, trên→dưới."""
import sys, os, numpy as np
from PIL import Image
def runs(mask1d):
    out=[];s=None
    for i,v in enumerate(mask1d):
        if v and s is None:s=i
        if not v and s is not None:out.append((s,i-1));s=None
    if s is not None:out.append((s,len(mask1d)-1))
    return out
def longest_run_per_row(m):
    res=np.zeros(m.shape[0],int)
    for y in range(m.shape[0]):
        r=runs(m[y]);res[y]=max([b-a+1 for a,b in r]) if r else 0
    return res
XW=(0.22,0.30);YH=(0.12,0.17)
def frames(img):
    g=np.asarray(img.convert('L'));m=g<90
    H,W=m.shape
    hr=longest_run_per_row(m);vr=longest_run_per_row(m.T)
    th=lambda arr,n,f:np.where(arr>=f*n)[0]
    ys=runs(np.isin(np.arange(H),th(hr,W,0.19)));xs=runs(np.isin(np.arange(W),th(vr,H,0.12)))
    ys=[(a+b)//2 for a,b in ys];xs=[(a+b)//2 for a,b in xs]
    def pr(c,lo,hi):
        out=[];used=-1
        for i,a in enumerate(c):
            for b in c[i+1:]:
                if a>used and lo<=b-a<=hi:out+=[a,b];used=b;break
        return out
    return pr(xs,XW[0]*W,XW[1]*W),pr(ys,YH[0]*H,YH[1]*H)
if __name__=='__main__':
    a=[x for x in sys.argv[1:] if not x.startswith('--')]
    img=Image.open(a[0]).convert('RGB');out=a[1];names=a[2:]
    xs,ys=frames(img);print('xs',xs,'ys',ys)
    os.makedirs(out,exist_ok=True)
    # khung = cặp (xs[0],xs[1]) (xs[2],xs[3]) ; (ys[0],ys[1]) ...
    cols=[(xs[i],xs[i+1]) for i in range(0,len(xs)-1,2)];rows=[(ys[i],ys[i+1]) for i in range(0,len(ys)-1,2)]
    print(len(cols),'cols',len(rows),'rows')
    k=0
    for r in rows:
        for c in cols:
            if k>=len(names):break
            box=(c[0]+5,r[0]+5,c[1]-4,r[1]-4);img.crop(box).save(f'{out}/{names[k]}.png');k+=1
    print('saved',k)
