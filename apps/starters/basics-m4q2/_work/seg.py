import numpy as np
from PIL import Image
def runs(mask, mingap=3, minlen=20):
    out=[]; start=None; gap=0
    for i,v in enumerate(mask):
        if v:
            if start is None: start=i
            gap=0; last=i
        else:
            if start is not None:
                gap+=1
                if gap>mingap: 
                    if last-start+1>=minlen: out.append((start,last+1))
                    start=None
    if start is not None and last-start+1>=minlen: out.append((start,last+1))
    return out
def boxes(path, thr=14):
    im=Image.open(path).convert('RGB'); a=np.asarray(im).astype(int)
    nonwhite=(255*3-a.sum(axis=2))>thr*3
    rows=runs(nonwhite.sum(axis=1)>2)
    res=[]
    for (y0,y1) in rows:
        cols=runs(nonwhite[y0:y1].sum(axis=0)>1, mingap=4)
        res.append([(x0,y0,x1,y1) for x0,x1 in cols])
    return im,res
if __name__=='__main__':
    import sys
    for n in ['colours','num1_20','alphabet','num21_100']:
        im,res=boxes(f'sheets/{n}.png')
        print(n,[len(r) for r in res])
        print('  sample',res[0][:2])
