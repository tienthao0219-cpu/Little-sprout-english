# Tạo trang ngữ pháp cho từng unit:  python3 _work/build.py   ->  apps/flyers/grammar/grammar-<unit>.html
import json,os,re,datetime
W=os.path.dirname(os.path.abspath(__file__))+'/'
S=open(W+'../../../starters/speaking/_work/template.html',encoding='utf8').read()
a=S.index('function kawaii(id){'); b=S.index('function stickerEl(')
KAWAII=S[a:b]
t=open(W+'template.html',encoding='utf8').read().replace('@@KAWAII@@',KAWAII)
d=json.load(open(W+'data.json',encoding='utf8'))
mp=W+'../../../../data/manifest.json'
for u in d['units']:
    out=t.replace('@@DATA@@',json.dumps(u,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
    f='grammar-%s.html'%u['id']; open(W+'../'+f,'w',encoding='utf8').write(out); print('built',f,len(out))
    if os.path.exists(mp):
        m=json.loads(open(mp,encoding='utf8').read()); stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
        for x in m.get('apps',[]):
            if x.get('file')=='apps/flyers/grammar/'+f: x['updated']=stamp; print('manifest updated',x['id'])
        open(mp,'w',encoding='utf8').write(json.dumps(m,ensure_ascii=False,indent=2))
