import json, os
W='/home/claude/little-sprout-english/apps/starters/speaking/_work/'
def load(): return json.load(open(W+'data.json',encoding='utf8'))
def save(d): json.dump(d,open(W+'data.json','w',encoding='utf8'),ensure_ascii=False,indent=2)
def R(x,y,w,h,label): return {'rect':[x,y,w,h],'label':label}
def Z(x,y,w,h,label,at=None):
    z={'rect':[x,y,w,h],'label':label}
    if at: z['at']=at
    return z
def card(sid,key,word,sentence,gen=True):
    c={'w':word,'img':'img/%s/%s.webp'%(sid,key),'s':sentence}
    if gen:c['gen']=True
    return c
def Q(say,vi,ans=None,back='',h=(),free=False,alt=None,note=None,point=None,target=None,check=None):
    q={}
    if point:q['point']=point
    q['say']=say
    if ans is not None:q['ans']=ans
    q['back']=back
    q['vi']=vi
    if free:q['free']=True
    if alt:q['alt']=alt
    if note:q['note']=note
    if check:q['check']=check
    if h:q['hints']=list(h)
    return q
def find(say,target,back,vi,h): return {'say':say,'target':target,'back':back,'vi':vi,'hints':list(h)}
def step(cardkey,pick,place,demo=None):
    s={'card':cardkey,'pick':pick}
    if demo:s['demo']=demo
    s['place']=place
    return s
def pick(say,back,vi,h): return {'say':say,'back':back,'vi':vi,'hints':list(h)}
def place(say,zone,back,vi,h): return {'say':say,'zone':zone,'back':back,'vi':vi,'hints':list(h)}
def demo(say,zone,vi): return {'say':say,'zone':zone,'vi':vi}
def p3(cardkey,qs,check=None):
    c={'card':cardkey}
    if check:c['check']=check
    c['qs']=qs
    return c
HELLO={'say':"Hello! My name's Miss Thao. What's your name?",'ans':["(the child's name)"],'vi':'Chào em! Cô tên là Thảo. Em tên là gì?','gen':True,'hints':["What's your name?",'Say: My name is … / I\'m …']}
TABLE={'say':'Look at these, (name).','vi':'Nhìn những thẻ này nhé.'}
BYE={'say':'Thank you, (name). Bye bye!','vi':'Cảm ơn em. Tạm biệt!'}
def add(d,s):
    ids=[x['id'] for x in d['sets']]
    if s['id'] in ids: d['sets'][ids.index(s['id'])]=s
    else: d['sets'].append(s)
    d['soon']=[x for x in d['soon'] if x['no']!=s['no']]
    d['sets'].sort(key=lambda x:x['no'])
