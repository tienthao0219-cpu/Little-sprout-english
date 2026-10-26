# Thay he/she trong câu hỏi gợi ý Part 2 bằng đại từ/tên đúng của người có đáp án trên THẺ CỦA CÔ (đọc từ ảnh p2ex).
import json,re
P='data.json'; d=json.load(open(P,encoding='utf8')); S={s['id']:s for s in d['sets']}
F=('she','her','her'); M=('he','his','him')
WHO={ # set: (tên người em hỏi về, đại từ)
 'cam1-t1':('Tom',M),'cam1-t2':('Emma',F),'cam1-t3':('David',M),'cam2-t1':('Helen',F),'cam2-t3':('Sarah',F),
 'cam4-t1':('Helen',F),'cam4-t2':('Vicky',F),'cam4-t3':('Emma',F),'col-t1':('Helen',F),'col-t2':('Katy',F),'col-t3':('Emma',F),
 'suc-t1':('Jill',F),'suc-t4':('Paul',M),'suc-t5':('Harry',M),'suc-t6':('Paul',M),'suc-t8':('Mr Plant',M),
 'ai-t1':('Ben',M),'ai-t6':('Tim',M),'ai-t7':('Jack',M)}
for sid,(name,pr) in WHO.items():
    q=S[sid]['hints']['p2q']
    S[sid]['hints']['p2q']=[x.replace('he/she',pr[0]).replace('his/her',pr[1]).replace('him/her',pr[2]) for x in q]
# ngoại lệ
S['cam1-t1']['hints']['p2q'][3]='Where does Tom do his homework?'
S['suc-t5']['hints']['p2q'][2]='Why is Harry having a party?'
S['col-t3']['hints']['p2q'][3]="Do Emma's parents like it?"
S['col-t2']['hints']['p2q'][0]='What club does Katy go to?'
S['suc-t7']['hints']['p2q'][2]='How many languages do the parrots speak?'
S['suc-t3']['hints']['p2q'][3]='Where do they go on school holiday?'
# cam2-t2: người được hỏi là cô giáo của Nick (cô Cave)
S['cam2-t2']['hints']['p2q']=["What's her name?","What subject does she teach?","What's her hobby?","Where does she live?","Has she got long or short hair?"]
left=[(sid,x) for sid,s in S.items() for x in s['hints']['p2q'] if re.search(r'he/she|his/her|him/her',x)]
print('còn he/she:',left)
open(P,'w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=0))
