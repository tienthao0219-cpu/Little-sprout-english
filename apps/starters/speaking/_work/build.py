"""Ghép _work/template.html + _work/data.json -> ../speaking.html
   python3 build.py            -> bản dùng trên website (ảnh nằm ở ../img/...)
   python3 build.py --inline   -> bản xem trước 1 file (nhúng ảnh dạng base64) -> preview.html"""
import json,sys,os,re,base64
W=os.path.dirname(os.path.abspath(__file__))+'/'
t=open(W+'template.html',encoding='utf8').read()
d=json.load(open(W+'data.json',encoding='utf8'))
out=t.replace('@@DATA@@',json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
if '--inline' in sys.argv:
    inl={}
    for m in set(re.findall(r'img/[\w\-./]+\.(?:webp|png)',out)):
        p=W+'../'+m
        if os.path.exists(p):
            ext=m.rsplit('.',1)[1]; inl[m]='data:image/%s;base64,'%ext+base64.b64encode(open(p,'rb').read()).decode()
    out=out.replace('<div class="wrap" id="app"></div>','<div class="wrap" id="app"></div>\n<script>window.__INLINE='+json.dumps(inl)+';</script>',1)
    open(W+'../preview.html','w',encoding='utf8').write(out)
else:
    open(W+'../speaking.html','w',encoding='utf8').write(out)
print('built',len(out))
