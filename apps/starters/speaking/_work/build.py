"""Ghép _work/template.html + _work/data.json -> ../speaking.html
   python3 build.py            -> bản dùng trên website (ảnh nằm ở ../img/...)
   python3 build.py --inline   -> bản xem trước 1 file (nhúng ảnh dạng base64) -> preview.html"""
import json,sys,os,re,base64
W=os.path.dirname(os.path.abspath(__file__))+'/'

def bump_manifest(app_file):
    """Ghi ngày giờ build vào manifest (trường "updated"): website thêm ?v=<ngày giờ> vào đường dẫn app, nên điện thoại/iPad tải bản mới."""
    import datetime
    mp = W + '../../../../data/manifest.json'
    if not os.path.exists(mp): return
    raw = open(mp, encoding='utf8').read()
    m = json.loads(raw)
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    n = 0
    for a in m.get('apps', []):
        if a.get('file') == app_file: a['updated'] = stamp; n += 1
    if n:
        open(mp, 'w', encoding='utf8').write(json.dumps(m, ensure_ascii=False, indent=2))
        print('manifest: updated =', stamp, '(%d app)' % n)
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
    bump_manifest('apps/starters/speaking/speaking.html')
print('built',len(out))
