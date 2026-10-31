# Nội dung 4 bài Unit 1 (phiên bản cụ thể hơn): khối "blocks" theo thứ tự hiển thị.
import json,runpy
pr=runpy.run_path('practice_u1.py') if False else None
d=json.load(open('data.json',encoding='utf8')); U=d['units'][0]
old={l['id']:l for l in U['lessons']}
def B(k,**kw): kw['k']=k; return kw
P=lambda v,a='cat': {'t':'prep','v':v,'a':a}
V=lambda w,n=1: {'t':'vocab','w':w,'n':n}
L={}
L['l1']=[
 B('when',title='🧭 Khi nào dùng?',items=[{'icon':'❓','t':'Dùng để nói **một người / một vật đang Ở ĐÂU**.','ex':'The cat is under the table.','vi':'Mèo ở dưới cái bàn.'}]),
 B('formula',title='🧩 Mẫu câu',rows=[[["The cat","sub","ai / cái gì"],["is","aux","is (số ít) · are (số nhiều)"],["under","pre","giới từ"],["the table","obj","nơi chốn"]]]),
 B('grid',title='📍 6 giới từ cần nhớ',items=[
  {'icon':'📦','en':'in','vi':'bên trong','tip':'nằm TRONG hộp, cặp, phòng'},
  {'icon':'🔝','en':'on','vi':'ở trên, chạm vào','tip':'đặt TRÊN mặt bàn, giường'},
  {'icon':'⬇️','en':'under','vi':'ở dưới','tip':'nằm DƯỚI bàn, ghế'},
  {'icon':'↔️','en':'next to','vi':'bên cạnh','tip':'đứng SÁT BÊN'},
  {'icon':'🔙','en':'behind','vi':'phía sau','tip':'bị vật ở trước che'},
  {'icon':'🔜','en':'in front of','vi':'phía trước','tip':'đứng TRƯỚC mặt vật đó'}]),
 B('cards',title='👀 Xem hình',items=old['l1']['cards']),
 B('mistakes',items=[
  {'bad':'The cat is on front of the sofa.','good':'The cat is in front of the sofa.','why':'Phía trước là in front of (không phải on).'},
  {'bad':'The cat is next the table.','good':'The cat is next to the table.','why':'next to luôn có chữ to.'},
  {'bad':'The cat in the box.','good':'The cat is in the box.','why':'Đừng quên is / are trong câu.'},
  {'bad':'The book is in the table.','good':'The book is on the table.','why':'Đặt lên mặt bàn → on (bàn không có "bên trong").'}]),
 B('acts',items=['a1'])]
L['l2']=[
 B('when',title='🧭 Khi nào dùng?',items=[
  {'icon':'✅','t':'**some-** = **có** (ai đó, cái gì đó). Dùng trong câu **bình thường** (khẳng định).','ex':'Someone is in the kitchen.','vi':'Có ai đó đang ở trong bếp.'},
  {'icon':'❓','t':'**any-** dùng khi **HỎI** hoặc khi câu có **not** (phủ định).','ex':'Is there anyone at home? · I can\'t see anything.','vi':'Có ai ở nhà không? · Mình không thấy gì cả.'},
  {'icon':'🚫','t':'**no-** = **không có**. Nghĩa đã là "không", nên câu **KHÔNG** thêm not.','ex':'No one is in the bathroom.','vi':'Không có ai trong phòng tắm.'},
  {'icon':'🌈','t':'**every-** = **tất cả, mọi**. Động từ dùng **is** (số ít).','ex':'Everyone is here!','vi':'Mọi người đều ở đây!'}]),
 B('table',title='🗂 Bảng 4 nhóm × 3 loại (người · vật · nơi)',head=['','👤 người (-one)','🎁 vật (-thing)','📍 nơi (-where)'],rows=[
  ['some- · có','someone','something','somewhere'],['any- · hỏi / not','anyone','anything','anywhere'],
  ['no- · không có','no one','nothing','nowhere'],['every- · tất cả','everyone','everything','everywhere']],note='Ghép đầu từ (some, any, no, every) + đuôi (one, thing, where).'),
 B('steps',title='🧠 Chọn từ nào? Hỏi mình 4 câu',items=[
  '1️⃣ Muốn nói **tất cả**? → **every-** (everyone, everything, everywhere)',
  '2️⃣ Câu có **not** hoặc là **câu hỏi**? → **any-** (anyone, anything)',
  '3️⃣ Muốn nói **không có** mà **không dùng not**? → **no-** (no one, nothing)',
  '4️⃣ Muốn nói **có** (câu bình thường)? → **some-** (someone, something)']),
 B('cards',title='👀 Xem hình',items=old['l2']['cards']),
 B('mistakes',items=[
  {'bad':"I can't see something.",'good':"I can't see anything.",'why':'Câu có not → dùng any- (anything).'},
  {'bad':"There isn't someone in the room.",'good':"There isn't anyone in the room.",'why':'Câu có not → dùng anyone.'},
  {'bad':'No one isn\'t here.','good':'No one is here.','why':'No one đã có nghĩa "không", không thêm not.'},
  {'bad':'Everyone are happy.','good':'Everyone is happy.','why':'Everyone đi với is (số ít).'}]),
 B('acts',items=['a2','a3'])]
L['l3']=[
 B('when',title='🧭 Khi nào dùng?',items=[
  {'icon':'1️⃣','t':'Có **1 thứ** → **There is** + a / an + danh từ.','ex':'There is a cooker in the kitchen.','vi':'Trong bếp có một cái bếp nấu.'},
  {'icon':'🔢','t':'Có **2 thứ trở lên** → **There are** + số / some + danh từ **số nhiều**.','ex':'There are two cushions on the sofa.','vi':'Trên ghế có hai cái gối.'},
  {'icon':'🔤','t':'**a hay an?** Dùng **an** trước a, e, i, o, u (an oven). Còn lại dùng **a** (a cooker).','ex':'There is an oven. · There is a fridge.','vi':'Có một cái lò nướng. · Có một cái tủ lạnh.'}]),
 B('table',title='🗂 Ba kiểu câu',head=['','✅ Có','❌ Không có','❓ Hỏi'],rows=[
  ['1 thứ','There is a cooker.',"There isn't a fridge.","Is there a shelf?\nYes, there is. / No, there isn't."],
  ['Nhiều thứ','There are two cushions.',"There aren't any chairs.","Are there any violins?\nYes, there are. / No, there aren't."]]),
 B('cards',title='👀 Xem hình',items=old['l3']['cards']),
 B('mistakes',items=[
  {'bad':'There is two cushions.','good':'There are two cushions.','why':'2 cái → There are.'},
  {'bad':'There are a cooker.','good':'There is a cooker.','why':'1 cái → There is.'},
  {'bad':'There is a oven.','good':'There is an oven.','why':'oven bắt đầu bằng o → an.'},
  {'bad':"There aren't a chair.",'good':"There isn't a chair.",'why':'1 cái → isn\'t (không dùng aren\'t).'}]),
 B('acts',items=['a4'])]
L['l4']=[
 B('when',title='🧭 Khi nào dùng?',items=[
  {'icon':'💪','t':'Nói ai **biết / có thể** làm gì.','ex':'I can play the violin.','vi':'Mình biết chơi đàn vi-ô-lông.'},
  {'icon':'🚫','t':'Nói **không biết / không thể** → **can\'t**.','ex':'A dog can\'t fly.','vi':'Chó không bay được.'},
  {'icon':'🙋','t':'**Xin phép** hoặc **nhờ giúp** → **Can I…? / Can you…?**','ex':'Can I borrow your key?','vi':'Mình mượn chìa khoá của bạn được không?'}]),
 B('formula',title='🧩 Mẫu câu',rows=[[["I / He / She","sub","chủ ngữ"],["can / can't","aux","có thể / không thể"],["play","v","động từ nguyên mẫu"],["the violin","obj","tân ngữ"]]]),
 B('table',title='🗂 Ba kiểu câu',head=['','✅ Có','❌ Không','❓ Hỏi'],rows=[
  ['can','She can swim.',"She can't swim.","Can she swim?\nYes, she can. / No, she can't."]]),
 B('cards',title='👀 Xem hình',items=old['l4']['cards']),
 B('mistakes',items=[
  {'bad':'She cans swim.','good':'She can swim.','why':'can không thêm s.'},
  {'bad':'She can swims.','good':'She can swim.','why':'Sau can dùng động từ nguyên mẫu (không thêm s).'},
  {'bad':'I can to swim.','good':'I can swim.','why':'Sau can không có to.'},
  {'bad':'Does she can swim?','good':'Can she swim?','why':'Câu hỏi: đưa can lên trước chủ ngữ.'}]),
 B('acts',items=['a5'])]
ACT={
 'a1':{'id':'a1','mode':'slot','title':'⚡ Luyện nhanh: kéo giới từ vào đúng hình','instr':'Chạm giữ một chữ rồi kéo vào chỗ trống dưới mỗi hình (hoặc chạm chữ rồi chạm hình).',
  'slots':[{'id':'s1','art':P('in','dog'),'text':'The dog is ___ the box.','ans':'in'},{'id':'s2','art':P('on','bunny'),'text':'The rabbit is ___ the table.','ans':'on'},
   {'id':'s3','art':P('under','pig'),'text':'The pig is ___ the table.','ans':'under'},{'id':'s4','art':P('next','chick'),'text':'The chick is ___ the table.','ans':'next to'},
   {'id':'s5','art':P('behind','frog'),'text':'The frog is ___ the sofa.','ans':'behind'},{'id':'s6','art':P('front','bear'),'text':'The bear is ___ the sofa.','ans':'in front of'}],
  'chips':['in','on','under','next to','behind','in front of']},
 'a2':{'id':'a2','mode':'bucket','title':'⚡ Luyện nhanh 1: xếp từ vào đúng nhóm (người · vật · nơi)','instr':'Kéo mỗi từ vào đúng cột. Mẹo: nhìn phần đuôi của từ (-one, -thing, -where).',
  'buckets':[{'id':'p','label':'👤 người (-one)','c':'peach'},{'id':'t','label':'🎁 vật (-thing)','c':'sky'},{'id':'w','label':'📍 nơi (-where)','c':'mint'}],
  'chips':[{'label':'someone','g':'p'},{'label':'no one','g':'p'},{'label':'everyone','g':'p'},{'label':'something','g':'t'},{'label':'anything','g':'t'},{'label':'nothing','g':'t'},{'label':'everywhere','g':'w'},{'label':'somewhere','g':'w'},{'label':'anywhere','g':'w'}]},
 'a3':{'id':'a3','mode':'slot','title':'⚡ Luyện nhanh 2: kéo đúng từ vào câu','instr':'Đọc câu rồi kéo từ hợp nghĩa vào chỗ trống. Mỗi từ dùng một lần.',
  'slots':[{'id':'s1','text':'Is there ___ at home?','hint':'câu hỏi','ans':'anyone'},{'id':'s2','text':'___ is at the door. I can see a girl.','hint':'có một người','ans':'someone'},
   {'id':'s3','text':'The room is empty. ___ is here.','hint':'không có ai','ans':'no one'},{'id':'s4','text':'My whole class is here! ___ is happy.','hint':'tất cả mọi người','ans':'everyone'}],
  'chips':['someone','anyone','no one','everyone']},
 'a4':{'id':'a4','mode':'bucket','title':'⚡ Luyện nhanh: There is hay There are?','instr':'Đếm số lượng trong hình. Có 1 → There is. Có nhiều → There are. Kéo hình vào đúng ô.',
  'buckets':[{'id':'is','label':'There is (1 thứ)','c':'sky'},{'id':'are','label':'There are (nhiều thứ)','c':'rose'}],
  'chips':[{'label':'a cooker','art':V('cooker',1),'g':'is'},{'label':'two cushions','art':V('cushion',2),'g':'are'},{'label':'a shelf','art':V('shelf',1),'g':'is'},{'label':'three violins','art':V('violin',3),'g':'are'},{'label':'a key','art':V('key',1),'g':'is'},{'label':'two drums','art':V('drums',2),'g':'are'}]},
 'a5':{'id':'a5','mode':'bucket','title':'⚡ Luyện nhanh: can hay can\'t?','instr':'Con vật này làm được việc đó không? Kéo vào ô can (làm được) hoặc can\'t (không làm được).',
  'buckets':[{'id':'can','label':'✅ can (làm được)','c':'mint'},{'id':'cant','label':"❌ can't (không làm được)",'c':'rose'}],
  'chips':[{'label':'A fish – swim','emo':'🐟','g':'can'},{'label':'A bird – fly','emo':'🐦','g':'can'},{'label':'A dog – fly','emo':'🐶','g':'cant'},{'label':'A baby – drive a car','emo':'👶','g':'cant'},{'label':'A cat – climb a tree','emo':'🐱','g':'can'},{'label':'A turtle – run fast','emo':'🐢','g':'cant'}]}}
for l in U['lessons']:
    l['blocks']=L[l['id']]
    for k in ('formula','cards','tip'): l.pop(k,None)
U['acts']=ACT
open('data.json','w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=1))
print('ok',[len(l['blocks']) for l in U['lessons']],list(ACT))
