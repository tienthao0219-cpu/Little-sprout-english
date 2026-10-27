import sys,os
from PIL import Image,ImageDraw
from crop_cards import frames
from scene_crop import make
W='/home/claude/little-sprout-english/apps/starters/speaking/'
def prep(sid,cardpage,scenepage,rot=90):
    img=Image.open(cardpage).convert('RGB');xs,ys=frames(img)
    cols=[(xs[i],xs[i+1]) for i in range(0,len(xs)-1,2)];rows=[(ys[i],ys[i+1]) for i in range(0,len(ys)-1,2)]
    print(sid,len(cols),'x',len(rows))
    out=W+'_work/raw/'+sid;os.makedirs(out,exist_ok=True);os.makedirs(W+'img/'+sid,exist_ok=True)
    k=1;ims=[]
    for r in rows:
        for c in cols:
            im=img.crop((c[0]+5,r[0]+5,c[1]-4,r[1]-4));im.save(f'{out}/c{k}.png');ims.append(im);k+=1
    S=Image.new('RGB',(4*220,2*190),'white');d=ImageDraw.Draw(S)
    for i,im in enumerate(ims[:8]):
        t=im.resize((220,180));S.paste(t,((i%4)*220,(i//4)*190));d.text(((i%4)*220+6,(i//4)*190+2),'c%d'%(i+1),fill=(255,0,0))
    S.save(f'/tmp/{sid}_cards.png')
    print(make(scenepage,W+'img/%s/scene.webp'%sid,rot))
if __name__=='__main__':
    prep(sys.argv[1],sys.argv[2],sys.argv[3],int(sys.argv[4]) if len(sys.argv)>4 else 90)
