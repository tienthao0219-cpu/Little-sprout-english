import numpy as np, os, json
from PIL import Image, ImageFilter
from seg import runs
def tiles(path):
    im=Image.open(path).convert('RGB'); a=np.asarray(im).astype(int)
    nonwhite=(255*3-a.sum(axis=2))>30*3
    rows=runs(nonwhite.sum(axis=1)>3,mingap=2,minlen=30); out=[]
    for (y0,y1) in rows:
        cols=runs(nonwhite[y0:y1].sum(axis=0)>1,mingap=2,minlen=30)
        out.append([(x0,y0,x1,y1) for x0,x1 in cols])
    return im,out
def flood_border(near):
    """các điểm 'gần trắng' nối được với viền ảnh (lan bằng numpy cho nhanh)"""
    m=np.zeros_like(near); m[0,:]|=near[0,:]; m[-1,:]|=near[-1,:]; m[:,0]|=near[:,0]; m[:,-1]|=near[:,-1]
    while True:
        n=m.copy(); n[1:,:]|=m[:-1,:]; n[:-1,:]|=m[1:,:]; n[:,1:]|=m[:,:-1]; n[:,:-1]|=m[:,1:]; n&=near
        if (n==m).all(): return m
        m=n

def limits(rows,margin=40):
    """vùng cắt của từng ô: mở rộng khung dò được tới giữa khe với ô bên cạnh (ô pastel nhạt bị dò hụt viền)"""
    out={}
    for ri,r in enumerate(rows):
        for ci,(x0,y0,x1,y1) in enumerate(r):
            xl=(r[ci-1][2]+x0)//2 if ci>0 else x0-margin
            xr=(x1+r[ci+1][0])//2 if ci<len(r)-1 else x1+margin
            above=max(b[3] for b in rows[ri-1]) if ri>0 else None; below=min(b[1] for b in rows[ri+1]) if ri<len(rows)-1 else None
            yt=(above+y0)//2 if above is not None else y0-margin
            yb=(y1+below)//2 if below is not None else y1+margin
            out[(ri,ci)]=(max(0,xl),max(0,yt),xr,yb)
    return out

def cut(im,box,lim=None):
    x0,y0,x1,y1=box; W,H=im.size
    xl,yt,xr,yb=lim or (x0-8,y0-8,x1+8,y1+8)
    xl,yt,xr,yb=max(0,xl),max(0,yt),min(W,xr),min(H,yb)
    c=im.crop((xl,yt,xr,yb)).convert('RGB')
    keep=(x0-xl+2,y0-yt+2,x1-xl-2,y1-yt-2)   # vùng lõi của ô
    a=np.asarray(c).astype(int)
    near=(a.min(axis=2)>=238)
    mask=flood_border(near)
    alpha=Image.fromarray(np.where(mask,0,255).astype('uint8'),'L').filter(ImageFilter.GaussianBlur(0.8))
    al=np.asarray(alpha).astype(float); al=np.clip((al-40)*255/(215-40),0,255).astype('uint8')
    rgba=c.convert('RGBA'); rgba.putalpha(Image.fromarray(al,'L'))
    rgba=keep_largest(rgba,keep)
    bb=rgba.getchannel('A').point(lambda v:255 if v>10 else 0).getbbox()
    return rgba.crop(bb) if bb else rgba

def keep_largest(rgba,core=None):
    """giữ lại mảng lớn nhất (bỏ nét thừa của ô bên cạnh)"""
    a=np.asarray(rgba.getchannel('A')); h,w=a.shape; vis=a>10; lab=np.zeros((h,w),int); sizes=[0]; k=0
    for y0 in range(h):
        for x0 in range(w):
            if vis[y0,x0] and not lab[y0,x0]:
                k+=1; lab[y0,x0]=k; st=[(y0,x0)]; n=0
                while st:
                    y,x=st.pop(); n+=1
                    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1),(1,1),(-1,-1),(1,-1),(-1,1)):
                        ny,nx=y+dy,x+dx
                        if 0<=ny<h and 0<=nx<w and vis[ny,nx] and not lab[ny,nx]: lab[ny,nx]=k; st.append((ny,nx))
                sizes.append(n)
    if k<=1: return rgba
    big=max(sizes)
    keepm=np.zeros((h,w),bool)
    for kk in range(1,k+1):
        ys,xs=np.where(lab==kk)
        if core:
            cx0,cy0,cx1,cy1=core
            if not ((xs>=cx0)&(xs<=cx1)&(ys>=cy0)&(ys<=cy1)).any(): continue
        bw,bh=xs.max()-xs.min()+1,ys.max()-ys.min()+1
        if sizes[kk]==big or (min(bw,bh)>=10 and sizes[kk]>=0.004*big): keepm|=(lab==kk)
    out=np.asarray(rgba).copy(); out[~keepm,3]=0
    return Image.fromarray(out,'RGBA')

def split_merged(im,rows):
    """ô dính nhau (không có khe trắng): chia theo các điểm trũng của cột"""
    a=np.asarray(im).astype(int); nw=(255*3-a.sum(axis=2))>30*3; out=[]
    for r in rows:
        ws=sorted(b[2]-b[0] for b in r); med=ws[len(ws)//2]; nr=[]
        for (x0,y0,x1,y1) in r:
            n=round((x1-x0)/med)
            if n<=1 or (x1-x0)<1.5*med: nr.append((x0,y0,x1,y1)); continue
            cp=nw[y0:y1,x0:x1].sum(axis=0); cuts=[0]
            for j in range(1,n):
                e=int(j*(x1-x0)/n); lo=max(cuts[-1]+10,e-int(med*.3)); hi=min(x1-x0-10,e+int(med*.3))
                cuts.append(lo+int(np.argmin(cp[lo:hi])))
            cuts.append(x1-x0)
            for p,q in zip(cuts,cuts[1:]): nr.append((x0+p,y0,x0+q,y1))
        out.append(nr)
    return out
