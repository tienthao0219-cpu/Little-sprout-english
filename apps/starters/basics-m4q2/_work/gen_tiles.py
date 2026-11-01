import numpy as np, colorsys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
FONT='/mnt/skills/examples/canvas-design/canvas-fonts/Outfit-Bold.ttf'
PAL={'pink':('#FF4F9A','#FFA3CB','#B3205F'),'blue':('#2D9CFF','#9AD7FF','#165FB0'),'orange':('#FF9A12','#FFD27A','#C25F00'),
     'green':('#3FCB30','#B2F59C','#1F8A18'),'purple':('#9D5CFF','#D2B8FF','#6A2FC4'),'yellow':('#FFD40A','#FFF27E','#C79A00')}
NAVY=(24,24,70,255)
def hexrgb(h): return tuple(int(h[i:i+2],16) for i in (1,3,5))
def inpaint(arr,mask,known,iters=500):
    a=arr.astype(float).copy(); m=mask.copy()
    med=np.median(a[known],axis=0)
    a[m]=med
    for _ in range(iters):
        n=(np.roll(a,1,0)+np.roll(a,-1,0)+np.roll(a,1,1)+np.roll(a,-1,1))/4
        a[m]=n[m]
    return a
def clean_base(tile):
    t=tile.resize((tile.width*2,tile.height*2),Image.LANCZOS).convert('RGBA'); W,H=t.size
    a=np.asarray(t).astype(float); rgb=a[:,:,:3]; al=a[:,:,3]
    mx=rgb.max(axis=2); mn=rgb.min(axis=2); sat=(mx-mn)/np.maximum(mx,1); lum=rgb[:,:,0]*.3+rgb[:,:,1]*.59+rgb[:,:,2]*.11
    inner=Image.fromarray((al>128).astype('uint8')*255,'L').filter(ImageFilter.MinFilter(25))   # xa viền mây
    inner=np.asarray(inner)>0
    yy,xx=np.mgrid[0:H,0:W]
    star=(xx<W*.40)&(yy<H*.36)
    band=(xx>W*.20)&(xx<W*.90)&(yy>H*.10)&(yy<H*.80)&(~star)
    rainbow=(yy>H*.74)
    dig=((lum<205)|(sat>.52))&inner&band&(~rainbow)
    dm=Image.fromarray(dig.astype('uint8')*255,'L').filter(ImageFilter.MaxFilter(13))
    dm=np.asarray(dm)>0
    dm&=inner&band&(~rainbow)
    known=inner&(~dm)&(~star)&(~rainbow)&(lum>215)&(sat<.45)
    out=inpaint(rgb,dm,known); a2=np.dstack([out,al]).astype('uint8')
    return Image.fromarray(a2,'RGBA')
def digits_img(text,size,col,fontsize):
    base,light,dark=[hexrgb(x) for x in PAL[col]]
    f=ImageFont.truetype(FONT,fontsize)
    fat=max(2,int(fontsize*.035)); sw=max(5,int(fontsize*.07))
    tmp=Image.new('L',size,0); d=ImageDraw.Draw(tmp)
    bb=d.textbbox((0,0),text,font=f,stroke_width=fat+sw)
    pad=sw*2; Wd,Hd=bb[2]-bb[0]+2*pad,bb[3]-bb[1]+2*pad
    ox,oy=pad-bb[0],pad-bb[1]
    body=Image.new('L',(Wd,Hd),0); ImageDraw.Draw(body).text((ox,oy),text,font=f,fill=255,stroke_width=fat,stroke_fill=255)
    ol=Image.new('L',(Wd,Hd),0); ImageDraw.Draw(ol).text((ox,oy),text,font=f,fill=255,stroke_width=fat+sw,stroke_fill=255)
    out=Image.new('RGBA',(Wd,Hd),(0,0,0,0))
    out.paste(Image.new('RGBA',(Wd,Hd),NAVY),(0,0),ol)
    inner=body.filter(ImageFilter.MinFilter(max(3,int(sw*.6)//2*2+1)))
    ring=ImageChops.subtract(body,inner)
    grad=Image.new('RGBA',(Wd,Hd)); gp=grad.load()
    for y in range(Hd):
        k=y/max(1,Hd-1); c=tuple(int(light[i]*(1-k)+base[i]*k) for i in range(3))+(255,)
        for x in range(Wd): gp[x,y]=c
    out.paste(grad,(0,0),inner)
    out.paste(Image.new('RGBA',(Wd,Hd),dark+(255,)),(0,0),ring)
    hl=Image.new('L',(Wd,Hd),0); ImageDraw.Draw(hl).ellipse((int(Wd*.06),int(Hd*.14),int(Wd*.6),int(Hd*.36)),fill=120)
    hl=ImageChops.multiply(hl,inner)
    out.paste(Image.new('RGBA',(Wd,Hd),(255,255,255,255)),(0,0),hl)
    return out
def make(base_tile,text,col):
    base=clean_base(base_tile); W,H=base.size
    fs=int(H*.50)
    dg=digits_img(text,(W,H),col,fs)
    cx,cy=int(W*.60),int(H*.42)
    base.alpha_composite(dg,(cx-dg.width//2,cy-dg.height//2))
    return base
