"""scene_crop.py page.png out.webp [rot_deg_clockwise=90] [--pad N]: cắt tranh cảnh theo khung đen, xoay, thu về rộng 1500px, lưu webp + lưới kiểm tra."""
import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont
from crop_cards import runs
def find_frame(img):
    g=np.asarray(img.convert('L'));m=g<90;H,W=m.shape
    def lr(a):
        out=np.zeros(a.shape[0],int)
        for i in range(a.shape[0]):
            r=runs(a[i]);out[i]=max([b-x+1 for x,b in r]) if r else 0
        return out
    hr=lr(m);vr=lr(m.T)
    ys=np.where(hr>=0.4*W)[0];xs=np.where(vr>=0.3*H)[0]
    return xs.min(),ys.min(),xs.max(),ys.max()
def make(page,out,rot=90):
    img=Image.open(page).convert('RGB')
    x0,y0,x1,y1=find_frame(img)
    c=img.crop((x0+3,y0+3,x1-2,y1-2))
    if rot: c=c.rotate(-rot,expand=True)
    s=1500/c.width;c=c.resize((1500,round(c.height*s)),Image.LANCZOS)
    c.save(out,'WEBP',quality=88,method=6)
    g=c.copy();d=ImageDraw.Draw(g)
    for i in range(1,10):
        x=c.width*i/10;y=c.height*i/10
        d.line([(x,0),(x,c.height)],fill=(255,0,0),width=2);d.line([(0,y),(c.width,y)],fill=(255,0,0),width=2)
        d.text((x+4,4),str(i*10),fill=(255,0,0));d.text((4,y+4),str(i*10),fill=(255,0,0))
    g.resize((1000,round(g.height*1000/g.width))).save('/tmp/grids/'+out.split('/')[-2]+'.png')
    return c.size
if __name__=='__main__':
    print(make(sys.argv[1],sys.argv[2],int(sys.argv[3]) if len(sys.argv)>3 else 90))
