import json,sys
import os
W=os.path.dirname(os.path.abspath(__file__))+'/'
t=open(W+'template.html',encoding='utf8').read()
d=json.load(open(W+'data.json',encoding='utf8'))
out=t.replace('@@DATA@@',json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('</','<\\/'))
open(''+W+'../speaking.html','w',encoding='utf8').write(out)
print('built',len(out))
