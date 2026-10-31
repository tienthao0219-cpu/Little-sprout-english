# Tạo trang ngữ pháp cho từng unit:  python3 _work/build.py   ->  apps/flyers/grammar/grammar-<unit>.html
import json,os,re,datetime
W=os.path.dirname(os.path.abspath(__file__))+'/'
S=open(W+'../../../starters/speaking/_work/template.html',encoding='utf8').read()
a=S.index('function kawaii(id){'); b=S.index('function stickerEl(')
KAWAII=S[a:b]
t=open(W+'template.html',encoding='utf8').read().replace('@@KAWAII@@',KAWAII)
d=json.load(open(W+'data.json',encoding='utf8'))
# hộp bao nội dung của ảnh từ vựng (cắt phần trong suốt) để ảnh vừa khít khung
from PIL import Image
IMGROOT=W+'../../../../data/wordsets/img/'
d['bbox']={}
for u in d['units']:
    vd=u['vocabDir']; fd=IMGROOT+vd
    if vd in d['bbox'] or not os.path.isdir(fd): continue
    m={}
    for fn in os.listdir(fd):
        if not fn.endswith('.webp'): continue
        im=Image.open(fd+'/'+fn).convert('RGBA'); Wd,Hd=im.size
        bb=im.getchannel('A').point(lambda v:255 if v>24 else 0).getbbox()
        if not bb: continue
        pad=3; x0,y0,x1,y1=max(0,bb[0]-pad),max(0,bb[1]-pad),min(Wd,bb[2]+pad),min(Hd,bb[3]+pad)
        m[fn[:-5]]=[x0,y0,x1,y1,Wd,Hd]
    d['bbox'][vd]=m
mp=W+'../../../../data/manifest.json'
if True:
    out=t.replace('@@DATA@@',json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
    f='grammar-flyers.html'; open(W+'../'+f,'w',encoding='utf8').write(out); print('built',f,len(out))
    if os.path.exists(mp):
        m=json.loads(open(mp,encoding='utf8').read()); stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
        for x in m.get('apps',[]):
            if x.get('file')=='apps/flyers/grammar/'+f: x['updated']=stamp; print('manifest updated',x['id'])
        open(mp,'w',encoding='utf8').write(json.dumps(m,ensure_ascii=False,indent=2))
