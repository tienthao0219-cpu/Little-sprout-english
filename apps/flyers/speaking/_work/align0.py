import json, cv2, numpy as np
IMG='/home/claude/little-sprout-english/apps/flyers/speaking/img/'
W=760
def ld(sid,k):
    im=cv2.imread(IMG+sid+'/'+k+'.webp'); 
    if im is None:
        from PIL import Image
        p=Image.open(IMG+sid+'/'+k+'.webp').convert('RGB'); im=cv2.cvtColor(np.array(p),cv2.COLOR_RGB2BGR)
    h=int(im.shape[0]*W/im.shape[1]); im=cv2.resize(im,(W,h)); return cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
def run(sid,dots):
    a=ld(sid,'p1ex'); b=ld(sid,'p1cand'); H=min(a.shape[0],b.shape[0])
    # global shift
    m=60; tpl=a[m:H-m,m:W-m]
    r=cv2.matchTemplate(b,tpl,cv2.TM_CCOEFF_NORMED); _,sc,_,loc=cv2.minMaxLoc(r)
    gx,gy=0,0
    out=[]
    P=45; S=50
    for (x,y) in dots:
        px,py=int(x*W),int(y*a.shape[0])
        x0,y0=max(0,px-P),max(0,py-P); x1,y1=min(W,px+P),min(a.shape[0],py+P)
        t=a[y0:y1,x0:x1]
        if t.std()<6: out.append((x,y,0,0,0));continue
        sx0,sy0=max(0,x0+gx-S),max(0,y0+gy-S); sx1,sy1=min(W,x1+gx+S),min(b.shape[0],y1+gy+S)
        reg=b[sy0:sy1,sx0:sx1]
        if reg.shape[0]<t.shape[0] or reg.shape[1]<t.shape[1]: out.append((x,y,0,0,0));continue
        r=cv2.matchTemplate(reg,t,cv2.TM_CCOEFF_NORMED); _,sc2,_,l2=cv2.minMaxLoc(r)
        nx=(sx0+l2[0]-x0+px)/W; ny=(sy0+l2[1]-y0+py)/b.shape[0]
        out.append((nx,ny,sc2,gx,gy))
    return out,(gx,gy,sc)
if __name__=='__main__':
    d=json.load(open('data.json')); res={}
    for s in d['sets']:
        dots=[(h[0],h[1]) for h in s['hot']['p1']]
        o,g=run(s['id'],dots); res[s['id']]=(o,g)
        print(s['id'],'global',g)
    json.dump(res,open('align.json','w'))
