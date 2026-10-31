# Bài 3 (There is/are) và bài 4 (can): công thức có màu + hội thoại chibi. Chạy lại được.
import json
d=json.load(open('data.json',encoding='utf8')); U=d['units'][0]; L={l['id']:l for l in U['lessons']}
V=lambda w,n=1,no=False: {'t':'vocab','w':w,'n':n,'no':no}
class CK(dict):
    def __add__(self,o): r=CK(self); r.update(o); return r
def ck(t,c=None): return CK({'t':t,'c':c})
def B(k,**kw): kw['k']=k; return kw
L['l3']['say']='Nhà em có gì? Nhìn số lượng nhé: có MỘT thì dùng is, có NHIỀU thì dùng are!'
L['l3']['blocks']=[
 B('when',title='🧭 There is / There are nghĩa là gì?',items=[{'icon':'👀','t':'**There is / There are** = **Có …** (ở đâu đó). Đếm số lượng để chọn **is** hay **are**.','ex':'There is a cooker. · There are two cushions.','vi':'Có một cái bếp. · Có hai cái gối.'}]),
 B('pattern',title='1️⃣ Có MỘT thứ → There is',color='sky',
   parts=[ck('There is','aux')+{'s':'có 1 thứ'},ck('a / an','pre')+{'s':'một'},ck('danh từ số ít','obj')+{'s':'cooker, oven…'},ck('nơi chốn','v')+{'s':'in the kitchen'}],
   exs=[{'c':[ck('There is','aux'),ck('a','pre'),ck('cooker','obj'),ck('in the kitchen.','v')],'vi':'Trong bếp có một cái bếp nấu.','art':V('cooker')},
        {'c':[ck('There is','aux'),ck('an','pre'),ck('oven','obj'),ck('in the kitchen.','v')],'vi':'Trong bếp có một cái lò nướng. (oven bắt đầu bằng o → an)','art':V('oven')},
        {'c':[ck('There is','aux'),ck('a','pre'),ck('shelf','obj'),ck('on the wall.','v')],'vi':'Trên tường có một cái kệ.','art':V('shelf')}]),
 B('pattern',title='2️⃣ Có NHIỀU thứ → There are',color='rose',
   parts=[ck('There are','pink')+{'s':'có 2 thứ trở lên'},ck('số / some','v')+{'s':'two, three, some'},ck('danh từ số nhiều','obj')+{'s':'cushions, violins…'},ck('nơi chốn','sub')+{'s':'on the sofa'}],
   exs=[{'c':[ck('There are','pink'),ck('two','v'),ck('cushions','obj'),ck('on the sofa.','sub')],'vi':'Trên ghế có hai cái gối.','art':V('cushion',2)},
        {'c':[ck('There are','pink'),ck('three','v'),ck('violins','obj'),ck('in the room.','sub')],'vi':'Trong phòng có ba cây đàn vi-ô-lông.','art':V('violin',3)},
        {'c':[ck('There are','pink'),ck('some','v'),ck('stamps','obj'),ck('in the box.','sub')],'vi':'Trong hộp có một vài con tem.','art':V('stamps',3)}]),
 B('pattern',title='3️⃣ KHÔNG có → isn\'t / aren\'t',color='mint',
   parts=[ck("There isn't",'aux')+{'s':'1 thứ'},ck('a / an','pre')+{'s':''},ck("There aren't",'pink')+{'s':'nhiều thứ'},ck('any','v')+{'s':'nào'}],
   exs=[{'c':[ck("There isn't",'aux'),ck('a','pre'),ck('fridge.','obj')],'vi':'Không có cái tủ lạnh nào.','art':V('fridge',1,True)},
        {'c':[ck("There aren't",'pink'),ck('any','v'),ck('drums.','obj')],'vi':'Không có cái trống nào.','art':V('drums',2,True)}]),
 B('dialog',title='❓ Hỏi và trả lời',askFormula=[ck('Is there','aux'),ck('a / an','pre'),ck('danh từ số ít','obj'),ck('?')],
   rounds=[{'q':[ck('Is there','aux'),ck('a','pre'),ck('shelf','obj'),ck('?')],'a':[ck('Yes,','sub'),ck('there is.','aux')],'qvi':'Có cái kệ không?','avi':'Có.','art':V('shelf')},
           {'q':[ck('Is there','aux'),ck('a','pre'),ck('fridge','obj'),ck('?')],'a':[ck('No,','sub'),ck("there isn't.",'aux')],'qvi':'Có cái tủ lạnh không?','avi':'Không.'}]),
 B('dialog',title='❓ Hỏi nhiều thứ',askFormula=[ck('Are there','pink'),ck('any','v'),ck('danh từ số nhiều','obj'),ck('?')],
   rounds=[{'q':[ck('Are there','pink'),ck('any','v'),ck('violins','obj'),ck('?')],'a':[ck('Yes,','sub'),ck('there are.','pink')],'qvi':'Có cây đàn vi-ô-lông nào không?','avi':'Có.','art':V('violin',3)},
           {'q':[ck('Are there','pink'),ck('any','v'),ck('drums','obj'),ck('?')],'a':[ck('No,','sub'),ck("there aren't.",'pink')],'qvi':'Có cái trống nào không?','avi':'Không.'}]),
 B('tip2',t='💡 Mẹo: **1 → is · nhiều → are**. Muốn hỏi? Đưa **Is / Are** lên đầu câu!'),
 B('mistakes',items=L['l3']['blocks'][-2]['items']),
 B('acts',items=['a4'])]
L['l4']['say']='Em làm được gì? Em có thể mượn đồ không? Từ can giúp em nói điều đó!'
L['l4']['blocks']=[
 B('grid',title='🇻🇳 Nghĩa của can',items=[
   {'icon':'✅','en':'can','vi':'có thể · biết (làm gì)','tip':'I can swim.'},
   {'icon':'❌','en':"can't",'vi':'không thể · không biết · không được','tip':"A dog can't fly."},
   {'icon':'🙋','en':'Can …?','vi':'… được không? (xin phép, nhờ giúp)','tip':'Can I borrow your key?'}]),
 B('pattern',title='1️⃣ can = có thể / biết',color='mint',
   parts=[ck('I / He / She','sub')+{'s':'ai'},ck('can','aux')+{'s':'có thể / biết'},ck('động từ','v')+{'s':'nguyên mẫu'},ck('tân ngữ','obj')+{'s':'the violin'}],
   exs=[{'c':[ck('I','sub'),ck('can','aux'),ck('play','v'),ck('the violin.','obj')],'vi':'Mình biết chơi đàn vi-ô-lông.','art':V('violin')},
        {'c':[ck('She','sub'),ck('can','aux'),ck('swim.','v')],'vi':'Cô ấy biết bơi.'},
        {'c':[ck('A bird','sub'),ck('can','aux'),ck('fly.','v')],'vi':'Chim bay được.'}]),
 B('pattern',title="2️⃣ can't = không thể / không biết",color='rose',
   parts=[ck('I / He / She','sub')+{'s':'ai'},ck("can't",'pink')+{'s':'không thể'},ck('động từ','v')+{'s':'nguyên mẫu'},ck('tân ngữ','obj')+{'s':'the drums'}],
   exs=[{'c':[ck('I','sub'),ck("can't",'pink'),ck('play','v'),ck('the drums.','obj')],'vi':'Mình không biết chơi trống.','art':V('drums',1,True)},
        {'c':[ck('A dog','sub'),ck("can't",'pink'),ck('fly.','v')],'vi':'Chó không bay được.'}]),
 B('dialog',title='❓ Hỏi và trả lời với Can',askFormula=[ck('Can','aux'),ck('you / he / she','sub'),ck('động từ','v'),ck('…?')],
   rounds=[{'q':[ck('Can','aux'),ck('you','sub'),ck('play','v'),ck('the violin?','obj')],'a':[ck('Yes,','sub'),ck('I can.','aux')],'qvi':'Bạn chơi đàn vi-ô-lông được không?','avi':'Được.','art':V('violin')},
           {'q':[ck('Can','aux'),ck('you','sub'),ck('play','v'),ck('the drums?','obj')],'a':[ck('No,','sub'),ck("I can't.",'pink')],'qvi':'Bạn chơi trống được không?','avi':'Không.','art':V('drums')},
           {'q':[ck('Can','aux'),ck('I','sub'),ck('borrow','v'),ck('your key?','obj')],'a':[ck('Yes,','sub'),ck('you can.','aux')],'qvi':'Mình mượn chìa khoá của bạn được không?','avi':'Được, bạn mượn đi.','art':V('key')}]),
 B('tip2',t='💡 Mẹo: **can + động từ nguyên mẫu** (không thêm s, không có to). Hỏi: đưa **Can** lên đầu câu!'),
 B('mistakes',items=L['l4']['blocks'][-2]['items']),
 B('acts',items=['a5'])]
# ghép ck()+{} : ck trả dict -> hợp nhất để mỗi phần có thêm 's' (chú thích)
def fix(o):
    if isinstance(o,list): return [fix(x) for x in o]
    return o
open('data.json','w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=1))
