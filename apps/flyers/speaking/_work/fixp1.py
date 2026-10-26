import json,sys
from PIL import Image
IMG='/home/claude/little-sprout-english/apps/flyers/speaking/img/'
def load(): return json.load(open('data.json',encoding='utf8'))
def save(d): json.dump(d,open('data.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
def fix(d,sid,fixes):
    s=[x for x in d['sets'] if x['id']==sid][0]
    im=Image.open(f'{IMG}{sid}/p1ex.webp'); W=760; H=im.height*W/im.width
    for lab,px,py in fixes:
        hits=[h for h in s['hot']['p1'] if h[2]==lab]
        assert hits,(sid,lab)
        h=hits[0]; h[0]=round(px/W,3); h[1]=round(py/H,3)
def add(d,sid,items):
    s=[x for x in d['sets'] if x['id']==sid][0]
    im=Image.open(f'{IMG}{sid}/p1ex.webp'); W=760; H=im.height*W/im.width
    for en,vi,px,py in items: s['hot']['p1'].append([round(px/W,3),round(py/H,3),en,vi])
def drop(d,sid,labs):
    s=[x for x in d['sets'] if x['id']==sid][0]
    s['hot']['p1']=[h for h in s['hot']['p1'] if h[2] not in labs]
