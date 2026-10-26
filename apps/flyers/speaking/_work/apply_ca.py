import json, statistics, sys
sys.path.insert(0,'.')
from ops import OPS
try:
    from ops_pos import POS   # manual position overrides: sid -> list of ('m'|'mx', i, x, y)
except Exception: POS={}
d=json.load(open('data.before_ca.json'))
al=json.load(open('align0.json'))
cl=lambda v:round(min(.97,max(.03,v)),3)
for s in d['sets']:
    sid=s['id']; hot=s['hot']['p1']; a=al[sid]
    # chuẩn hoá: bỏ trường ca cũ
    hot[:]=[h[:4] for h in hot]
    good=[(nx-h[0],ny-h[1]) for h,(nx,ny,sc,_,_) in zip(hot,a) if sc>=.7]
    mdx=statistics.median([g[0] for g in good]) if len(good)>=3 else 0
    mdy=statistics.median([g[1] for g in good]) if len(good)>=3 else 0
    n0=len(hot)
    ca=[]   # vị trí tranh em cho từng chấm
    for h,(nx,ny,sc,_,_) in zip(hot,a):
        if sc>=.75: x,y=nx,ny
        else: x,y=h[0]+mdx,h[1]+mdy
        ca.append([cl(x),cl(y)])
    ex_pos=[[h[0],h[1]] for h in hot]
    names=[[h[2],h[3]] for h in hot]
    state=['both']*n0
    for op in OPS.get(sid,[]):
        k=op[0]
        if k=='r': names[op[1]]=[op[2],op[3]]
        elif k=='rr': hot[op[1]][2]=op[2]; hot[op[1]][3]=op[3]; names[op[1]]=[op[4],op[5]]
        elif k=='x': state[op[1]]='ex'
        elif k=='c': state[op[1]]='ca'
    for k,i,x,y in POS.get(sid,[]):
        if k=='m': ca[i]=[x,y]
        elif k=='mx': ex_pos[i]=[x,y]; hot[i][0]=x; hot[i][1]=y
    for i,h in enumerate(hot): h[0],h[1]=ex_pos[i]
    for op in OPS.get(sid,[]):
        if op[0]=='dw': s['dif'][op[1]-1]['w']=[op[2],op[3]]
    extra=[]
    EP={(k,i):(x,y) for k,i,x,y in POS.get(sid,[]) if k=='me'}
    for op in OPS.get(sid,[]):
        k=op[0]
        if k in('ac','ae','p'):
            D=op[1]; b=s['dif'][D-1]['b']; ei=len(extra)
            fx,fy=op[-2],op[-1]; x=b[0]+b[2]*fx; y=b[1]+b[3]*fy
            cx,cy=EP.get(('me',ei),(cl(x+mdx),cl(y+mdy)))
            if k=='ae': extra.append([cl(x),cl(y),op[2],op[3],0])
            elif k=='ac': extra.append([cx,cy,op[2],op[3],None,'ca'])
            else: extra.append([cl(x),cl(y),op[2],op[3],[op[4],op[5],cx,cy]])
    out=[]
    for i,h in enumerate(hot):
        if state[i]=='ex': out.append([h[0],h[1],h[2],h[3],0])
        elif state[i]=='ca': out.append([ca[i][0],ca[i][1],names[i][0],names[i][1],None,'ca'])
        else:
            out.append([h[0],h[1],h[2],h[3],[names[i][0],names[i][1],ca[i][0],ca[i][1]]])
    s['hot']['p1']=out+extra
json.dump(d,open('data.json','w'),ensure_ascii=False,indent=0)
print('done')
