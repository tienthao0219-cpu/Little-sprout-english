"""Succeed in Starters: cắt 8 thẻ (nền trắng, khung xám mảnh) từ trang Student's Book -> _work/raw/succ-tN/<tên>.png (rồi chạy cutout.py).
Dò vật thể bằng mặt nạ 'không trắng' + morphological opening (bỏ khung mảnh), 4 hàng x 2 cột; cột lấy theo khung xám."""
import sys,os,glob,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import numpy as np,cv2
from PIL import Image
from colorcrop import nonwhite,blocks,W_
S='/mnt/user-data/uploads/Downloads/_claude_tmp_speaking3/su/sp/'
COLS={1:[(180,556),(727,1103)],2:[(144,520),(702,1081)],3:[(145,521),(726,1101)],4:[(142,519),(695,1070)],5:[(183,559),(680,1056)],6:[(152,527),(706,1082)],7:[(156,533),(699,1074)],8:[(133,510),(689,1065)]}
NAMES={1:'horse coconut apple baseball cow burger egg basketball',2:'book photo rubber radio pen computer icecream shirt',3:'car watch armchair orange piano giraffe horse skateboard',
       4:'snake mango elephant basketball lizard robot pineapple kite',5:'shoe beans tablet doll baseball grapes dog shell',6:'hat mouse bear snake bike toylorry camera helicopter',
       7:'camera ball photo kite sunglasses trousers shoes radio',8:'carrot horse tablet bird telephone trousers watermelon tshirt'}
def whiten_lines(im):
    """Xoá đường khung xám mảnh (<=5px) nằm sát mép trên/dưới ảnh crop; không đụng vật thể xám/đen dày."""
    a=np.asarray(im).copy();g=a.astype(int);H=a.shape[0]
    gray=(g.max(axis=2)-g.min(axis=2)<30)&(g.max(axis=2)<215)
    fr=gray.mean(axis=1)>0.6;y=0
    while y<H:
        if fr[y]:
            z=y
            while z<H and fr[z]:z+=1
            if z-y<=5 and (y<30 or z>H-30):a[max(0,y-1):z+1]=255
            y=z
        else:y+=1
    return Image.fromarray(a)
SEP={1:[570,945,1325],2:[570,944,1324],3:[590,960,1343],4:[576,956,1322],5:[578,949,1323],6:[549,916,1297],7:[545,925,1311],8:[562,936,1318]}  # đường đứt xanh giữa các hàng
def run(tests=range(1,9),sx=14,sy=22):
    from colorcrop import montage
    for t in tests:
        img=Image.open(glob.glob(S+'s%d_cards-*.png'%t)[0]).convert('RGB');H=img.height
        s1,s2,s3=SEP[t];P=(s3-s1)/2
        edges=[s1-P,s1,s2,s3,s3+P];out=W_+'_work/raw/succ-t%d'%t;shutil.rmtree(out,ignore_errors=True);os.makedirs(out)
        names=NAMES[t].split();ims=[];k=0
        for r in range(4):
            y0=int(edges[r]+sy);y1=int(min(edges[r+1]-sy,0.975*H))
            for c in COLS[t]:
                im=whiten_lines(img.crop((c[0]+sx,y0,c[1]-sx,y1)));im.save(f'{out}/{names[k]}.png');ims.append(im);k+=1
        montage(ims,f'/tmp/succ_t{t}_cards.png',cols=8,w=170,h=170)
        print('succ-t%d'%t,ims[0].size)
if __name__=='__main__':run([int(a) for a in sys.argv[1:]] or range(1,9))
