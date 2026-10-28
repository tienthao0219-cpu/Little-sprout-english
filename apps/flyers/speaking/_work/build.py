import json,sys
import os
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
open(''+W+'../speaking.html','w',encoding='utf8').write(out)
print('built',len(out))
bump_manifest('apps/flyers/speaking/speaking.html')
