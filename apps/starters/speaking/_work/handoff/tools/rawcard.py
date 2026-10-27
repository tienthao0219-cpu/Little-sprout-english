"""rawcard.py <sid>... : thẻ nền màu (không tách nền) -> img/<sid>/<tên>.webp 400px, bo góc."""
import sys,glob,os
from PIL import Image,ImageDraw
W='/home/claude/little-sprout-english/apps/starters/speaking/'
for sid in sys.argv[1:]:
    os.makedirs(W+'img/'+sid,exist_ok=True)
    for f in sorted(glob.glob(W+'_work/raw/%s/*.png'%sid)):
        n=os.path.splitext(os.path.basename(f))[0]
        im=Image.open(f).convert('RGB');im.thumbnail((400,400),Image.LANCZOS)
        m=Image.new('L',im.size,0);ImageDraw.Draw(m).rounded_rectangle([0,0,im.width-1,im.height-1],radius=int(im.width*0.1),fill=255)
        o=im.convert('RGBA');o.putalpha(m);o.save(W+'img/%s/%s.webp'%(sid,n),'WEBP',quality=90,method=6)
    print(sid,len(os.listdir(W+'img/'+sid)))
