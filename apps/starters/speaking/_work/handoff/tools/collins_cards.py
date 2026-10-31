"""Collins: cắt 8 thẻ mỗi bộ từ trang Student's Book, xoá nhãn 'Test n/m' ở góc, lưu _work/raw/<sid>/c1..c8.png"""
import sys,os,shutil
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import numpy as np,cv2
from PIL import Image
from colorcrop import *
P='/mnt/user-data/uploads/Downloads/_claude_tmp_speaking3/col/'
# hàng: y0,y1 ; cột: x0,x1 (đo trên trang 1236x1748, đã bỏ viền đứt)
GEO={1:dict(f='b16_p025',cols=[(243,628),(745,1127)],rows=[(171,491),(547,867),(923,1243),(1300,1620)]),
     2:dict(f='b16_p043',cols=[(240,617),(738,1119)],rows=[(170,490),(546,866),(922,1243),(1299,1620)]),
     3:dict(f='b16_p061',cols=[(228,610),(729,1111)],rows=[(171,490),(547,866),(923,1242),(1298,1619)])}
def clean(im):
    a=np.asarray(im.convert('RGB'));h,w=a.shape[:2]
    x0,y0=w-150,h-48
    sub=a[y0:h,x0:w].astype(int);lum=sub.mean(2)
    med=np.median(lum)
    m=((lum<med-45)).astype(np.uint8)*255
    m=cv2.dilate(m,np.ones((5,5),np.uint8))
    mask=np.zeros((h,w),np.uint8);mask[y0:h,x0:w]=m
    return Image.fromarray(cv2.inpaint(a,mask,4,cv2.INPAINT_TELEA))
if __name__=='__main__':
    for t,g in GEO.items():
        sid='collins-t%d'%t;out=W_+'_work/raw/'+sid
        shutil.rmtree(out,ignore_errors=True);os.makedirs(out)
        img=Image.open(P+g['f']+'.png').convert('RGB');k=1
        for r in g['rows']:
            for c in g['cols']:
                clean(img.crop((c[0],r[0],c[1],r[1]))).save(f'{out}/c{k}.png');k+=1
        print(sid,'ok')
