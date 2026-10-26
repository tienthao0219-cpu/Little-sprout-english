import json,sys
from PIL import Image, ImageDraw, ImageFont
IMG='/home/claude/little-sprout-english/apps/flyers/speaking/img/'
d=json.load(open('data.json')); import os; os.makedirs('rev',exist_ok=True)
F=ImageFont.load_default()
def hotfor(q,side):
    if len(q)>5 and q[5]=='ca': return q if side=='ca' else None
    if side!='ca' or len(q)<5 or q[4] is None and False: return q
    c=q[4] if len(q)>4 else None
    if len(q)<5: return q
    if not c: return None
    return [c[2] if len(c)>2 else q[0], c[3] if len(c)>3 else q[1], c[0], c[1]]
def render(s):
    ims=[]
    for side,k in(('ex','p1ex'),('ca','p1cand')):
        im=Image.open(IMG+s['id']+'/'+k+'.webp').convert('RGB'); W=560; im=im.resize((W,int(im.height*W/im.width)))
        dr=ImageDraw.Draw(im)
        for q0 in s['hot']['p1']:
            q=hotfor(q0,side)
            if not q: continue
            x,y=q[0]*W,q[1]*im.height; col='blue' if side=='ex' else 'red'
            dr.ellipse([x-4,y-4,x+4,y+4],fill=col); 
            dr.text((x+6,y-5),q[2],fill='white'); dr.text((x+5,y-6),q[2],fill=col)
        ims.append(im)
    H=max(i.height for i in ims); o=Image.new('RGB',(1130,H+14),'white')
    ImageDraw.Draw(o).text((4,0),s['id'],fill='black')
    o.paste(ims[0],(0,14)); o.paste(ims[1],(570,14)); return o
if __name__=='__main__':
    ids=sys.argv[1:]
    for s in d['sets']:
        if s['id'] in ids: render(s).save('rev/'+s['id']+'.jpg',quality=78)
