import json,sys
from PIL import Image,ImageDraw,ImageFont
IMG='/home/claude/little-sprout-english/apps/flyers/speaking/img/'
d=json.load(open('data.json',encoding='utf8'))
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',12)
def render(s):
    ims=[]
    for k in ('p1ex','p1cand'):
        im=Image.open(f'{IMG}{s["id"]}/{k}.webp').convert('RGB'); w=760; im=im.resize((w,int(im.height*w/im.width)))
        dr=ImageDraw.Draw(im,'RGBA')
        for i,(x,y,en,vi,*_) in enumerate(s['hot'].get('p1') or []):
            px,py=x*im.width,y*im.height
            dr.ellipse([px-5,py-5,px+5,py+5],fill=(230,40,40,255),outline=(255,255,255,255),width=2)
            tw=dr.textlength(en,font=f); dr.rectangle([px+7,py-8,px+10+tw,py+8],fill=(255,255,255,215)); dr.text((px+8,py-8),en,fill=(200,0,0),font=f)
        for i,dd in enumerate(s.get('dif') or []):
            bx,by,bw,bh=dd['b']; dr.rectangle([bx*im.width,by*im.height,(bx+bw)*im.width,(by+bh)*im.height],outline=(0,120,255,255),width=2)
            dr.text((bx*im.width+2,by*im.height+2),str(i+1),fill=(0,90,255),font=f)
        ims.append(im)
    H=max(i.height for i in ims); out=Image.new('RGB',(1530,H),'white'); out.paste(ims[0],(0,0)); out.paste(ims[1],(770,0))
    out.save(f'p1ov/{s["id"]}.jpg',quality=85)
for s in d['sets']:
    if len(sys.argv)<2 or s['id'] in sys.argv[1:]: render(s)
