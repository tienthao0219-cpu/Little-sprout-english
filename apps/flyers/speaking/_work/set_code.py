# Đổi mã của cô cho Flyers Speaking:  python3 _work/set_code.py <mã mới>   (rồi python3 _work/build.py và đẩy lên GitHub)
import json,sys,os
if len(sys.argv)<2 or len(sys.argv[1].strip())<4: sys.exit('Cần mã mới (ít nhất 4 ký tự). Ví dụ: python3 _work/set_code.py maCuaCo2026')
x=2166136261
for c in sys.argv[1].strip().lower(): x^=ord(c); x=(x*16777619)&0xFFFFFFFF
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),'data.json')
d=json.load(open(p,encoding='utf8')); d['tcode']=format(x,'x'); open(p,'w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=0)); print('Đã đổi mã. Nhớ chạy build.py.')
