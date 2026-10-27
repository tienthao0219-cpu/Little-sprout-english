import numpy as np, os
from PIL import Image, ImageDraw
from crop_cards import runs
def blocks(count,thr,minlen,gap=0):
    r=runs(count>thr);m=[]
    for a,b in r:
        if m and a-m[-1][1]<=gap:m[-1]=(m[-1][0],b)
        else:m.append((a,b))
    return [(a,b) for a,b in m if b-a+1>=minlen]
def nonwhite(img,t=225,sat=14):
    a=np.asarray(img.convert('RGB')).astype(int);return (a.min(axis=2)<t)|((a.max(axis=2)-a.min(axis=2))>sat)
def card_boxes(img,thr_row=0.12,thr_col=0.25,minlen=0.08):
    m=nonwhite(img);H,W=m.shape
    rows=blocks(m.sum(1),thr_row*W,int(minlen*H))
    # merge nothing; columns computed over the union of row bands
    sub=m[rows[0][0]:rows[-1][1]+1]
    cols=blocks(sub.sum(0),thr_col*(rows[-1][1]-rows[0][0]),int(0.06*W))
    return rows,cols
def crop_cards(page,out,names,shrink=4,**kw):
    img=Image.open(page).convert('RGB');rows,cols=card_boxes(img,**kw)
    print('rows',rows,'cols',cols)
    os.makedirs(out,exist_ok=True);k=0;ims=[]
    for r in rows:
        for c in cols:
            if k>=len(names):break
            im=img.crop((c[0]+shrink,r[0]+shrink,c[1]-shrink,r[1]-shrink));ims.append(im)
            if names[k]:im.save(f'{out}/{names[k]}.png')
            k+=1
    return ims
def scene_box(img):
    g=np.asarray(img.convert('L'));m=g<120;H,W=m.shape
    def lr(a):
        out=np.zeros(a.shape[0],int)
        for i in range(a.shape[0]):
            r=runs(a[i]);out[i]=max([b-x+1 for x,b in r]) if r else 0
        return out
    ys=np.where(lr(m)>=0.45*W)[0];xs=np.where(lr(m.T)>=0.3*H)[0]
    if len(ys)>1 and len(xs)>1 and (ys.max()-ys.min())>0.3*H and (xs.max()-xs.min())>0.4*W:
        return int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())
    return scene_box_old(img)
def scene_box_old(img):
    m=nonwhite(img,235);H,W=m.shape
    rows=blocks(m.sum(1),0.3*W,int(0.1*H),gap=int(0.03*H));a,b=max(rows,key=lambda t:t[1]-t[0])
    cols=blocks(m[a:b+1].sum(0),0.3*(b-a),int(0.1*W),gap=int(0.03*W));c,d=max(cols,key=lambda t:t[1]-t[0])
    return c,a,d,b
def crop_scene(page,out,rot=90,border=2,box=None):
    img=Image.open(page).convert('RGB');x0,y0,x1,y1=box or scene_box(img)
    c=img.crop((x0+border,y0+border,x1-border,y1-border))
    if rot:c=c.rotate(-rot,expand=True)
    s=1500/c.width;c=c.resize((1500,round(c.height*s)),Image.LANCZOS)
    c.save(out,'WEBP',quality=88,method=6)
    g=c.copy();d=ImageDraw.Draw(g)
    for i in range(1,10):
        x=c.width*i/10;y=c.height*i/10
        d.line([(x,0),(x,c.height)],fill=(255,0,0),width=2);d.line([(0,y),(c.width,y)],fill=(255,0,0),width=2)
        d.text((x+4,4),str(i*10),fill=(255,0,0));d.text((4,y+4),str(i*10),fill=(255,0,0))
    g.resize((1000,round(g.height*1000/g.width))).save('/tmp/grids/'+out.split('/')[-2]+'.png')
    return c.size,(x0,y0,x1,y1)
def montage(ims,path,cols=4,w=220,h=190,labels=True):
    n=len(ims);rows=(n+cols-1)//cols;S=Image.new('RGB',(cols*w,rows*h),'white');d=ImageDraw.Draw(S)
    for i,im in enumerate(ims):
        t=im.copy();t.thumbnail((w-4,h-4));S.paste(t,((i%cols)*w,(i//cols)*h))
        if labels:d.text(((i%cols)*w+4,(i//cols)*h+2),'c%d'%(i+1),fill=(255,0,0))
    S.save(path)

W_='/home/claude/little-sprout-english/apps/starters/speaking/'
def prep2(sid,cardpage,scenepage,rot=90,**kw):
    ims=crop_cards(cardpage,W_+'_work/raw/'+sid,['c%d'%i for i in range(1,9)],**kw)
    montage(ims,f'/tmp/{sid}_cards.png')
    os.makedirs(W_+'img/'+sid,exist_ok=True)
    print(sid,crop_scene(scenepage,W_+'img/%s/scene.webp'%sid,rot))
