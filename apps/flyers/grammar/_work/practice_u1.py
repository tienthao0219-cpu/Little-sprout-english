# 4 bài luyện tập (mỗi bài 20 câu: 10 trắc nghiệm + 10 điền từ) cho Unit 1. Chạy lại được: python3 _work/practice_u1.py
import json
def M(q,opts,a,why,art=None,hint=None): 
    d={'t':'mcq','q':q,'opts':opts,'a':a,'why':why}
    if art: d['art']=art
    if hint: d['hint']=hint
    return d
def F(q,ans,bank,why,art=None,hint=None):
    d={'t':'fill','q':q,'ans':ans if isinstance(ans,list) else [ans],'bank':bank,'why':why}
    if art: d['art']=art
    if hint: d['hint']=hint
    return d
P=lambda v,a: {'t':'prep','v':v,'a':a}
V=lambda w,n=1,no=False,q=False: {'t':'vocab','w':w,'n':n,'no':no,'q':q}
L1=[
 M("The dog is ___ the box.",["in","on","under"],0,"Chó ở bên trong hộp → in.",P('in','dog')),
 F("The rabbit is ___ the table.","on",["in","on","under"],"Thỏ ở trên bàn → on.",P('on','bunny')),
 M("The pig is ___ the table.",["on","under","behind"],1,"Heo ở dưới bàn → under.",P('under','pig')),
 F("The frog is ___ the sofa.","behind",["behind","in front of","on"],"Ếch ở phía sau ghế → behind.",P('behind','frog')),
 M("The bear is ___ the sofa.",["in front of","behind","in"],0,"Gấu ở phía trước ghế → in front of.",P('front','bear')),
 F("The chick is ___ the table.","next to",["next to","in","under"],"Gà con ở bên cạnh bàn → next to.",P('next','chick')),
 M("The pen is ___ the bag.",["in","on","under"],0,"Bút ở bên trong cặp → in.",None,"(bên trong)"),
 F("The cup is ___ the table.","on",["in","on","under"],"Cái cốc ở trên bàn → on.",None,"(bên trên, chạm vào bàn)"),
 M("The shoes are ___ the bed.",["under","on","in"],0,"Giày ở dưới giường → under.",None,"(bên dưới)"),
 F("The cat is ___ the door.","behind",["behind","in front of","in"],"Mèo ở phía sau cánh cửa → behind.",None,"(phía sau)"),
 M("The fox is ___ the table.",["under","on","next to"],1,"Cáo ở trên bàn → on.",P('on','fox')),
 F("The penguin is ___ the box.","in",["in","on","under"],"Cánh cụt ở trong hộp → in.",P('in','penguin')),
 M("The panda is ___ the table.",["next to","on","behind"],0,"Gấu trúc ở bên cạnh bàn → next to.",P('next','panda')),
 F("The dog is ___ the table.","under",["in","on","under"],"Chó ở dưới bàn → under.",P('under','dog')),
 M("The cat is ___ the sofa.",["in front of","behind","under"],1,"Mèo ở phía sau ghế → behind.",P('behind','cat')),
 F("The pig is ___ the sofa.","in front of",["behind","in front of","on"],"Heo ở phía trước ghế → in front of.",P('front','pig')),
 M("The fridge is ___ the cooker.",["next to","under","in"],0,"Tủ lạnh ở bên cạnh bếp → next to.",None,"(bên cạnh)"),
 F("The key is ___ the box.","in",["in","on","under"],"Chìa khoá ở trong hộp → in.",None,"(ở bên trong)"),
 M("The ball is ___ the chair.",["on","under","behind"],1,"Quả bóng ở dưới ghế → under.",None,"(bên dưới)"),
 F("My bag is ___ the desk.","on",["in","on","under"],"Cặp ở trên bàn học → on.",None,"(ở trên mặt bàn)"),
]
L2=[
 M("Look! ___ is in the kitchen. I can see a boy.",["Someone","No one","Anyone"],0,"Có một người (một cậu bé) → Someone."),
 F("Is there ___ at home?","anyone",["anyone","no one","everyone"],"Câu hỏi 'có ai không' → anyone.",None,"(có ai không?)"),
 M("The classroom is empty. ___ is here.",["No one","Everyone","Someone"],0,"Lớp trống → No one (không ai)."),
 F("It's my birthday party and ___ is here! All my friends came.","everyone",["everyone","no one","anyone"],"Tất cả bạn đều đến → everyone."),
 M("I'm hungry, but there isn't ___ in the fridge.",["anything","something","everything"],0,"Câu phủ định (isn't) → anything."),
 F("There is ___ in the box. It's a toy car.","something",["something","anything","no one"],"Có một thứ trong hộp → something."),
 M("I can't find my key. I looked ___!",["everywhere","someone","anything"],0,"Tìm khắp mọi nơi → everywhere."),
 F("Can you see ___?","anything",["anything","everyone","no one"],"Câu hỏi 'có thấy gì không' → anything.",None,"(có thấy gì không?)"),
 M("___ is knocking at the door. Let's open it!",["Someone","No one","Anyone"],0,"Có người gõ cửa → Someone."),
 F("There isn't ___ in the bathroom. It's empty.","anyone",["anyone","someone","everyone"],"Câu phủ định (isn't) → anyone."),
 M("Did you see ___ in the garden?",["anyone","no one","everyone"],0,"Câu hỏi 'có thấy ai không' → anyone.",None,"(có thấy ai không?)"),
 F("We all love pizza. ___ likes pizza.","everyone",["everyone","no one","anyone"],"Ai cũng thích → Everyone."),
 M("I have ___ for you. It's a present!",["something","anything","no one"],0,"Mình có một thứ cho bạn → something."),
 F("The shop is closed. ___ is in the shop.","no one",["no one","everyone","anyone"],"Cửa hàng đóng → No one (không ai)."),
 M("Is there ___ in your bag?",["anything","no one","everywhere"],0,"Câu hỏi 'có gì không' → anything.",None,"(có gì không?)"),
 F("I can't see ___ in the dark room.","anything",["anything","something","everyone"],"Câu phủ định (can't) → anything.",None,"(không thấy gì cả)"),
 M("Our dog is lost! We looked ___.",["everywhere","someone","anything"],0,"Tìm khắp nơi → everywhere."),
 F("Look! ___ is on the roof. It's a cat!","something",["something","anything","no one"],"Có một vật trên mái nhà → Something."),
 M("Hello? Is ___ there?",["anyone","no one","everywhere"],0,"Hỏi 'có ai ở đó không' → anyone.",None,"(có ai ở đó không?)"),
 F("The whole class is here. ___ is here today.","everyone",["everyone","no one","someone"],"Cả lớp có mặt → Everyone."),
]
L3=[
 M("There ___ a cooker in the kitchen.",["is","are","can"],0,"Có 1 cái bếp → There is.",V('cooker',1)),
 F("There ___ two cushions on the sofa.","are",["is","are"],"Có 2 cái gối (nhiều) → There are.",V('cushion',2)),
 M("There ___ three violins.",["is","are","isn't"],1,"Có 3 cây đàn (nhiều) → There are.",V('violin',3)),
 F("There ___ a shelf on the wall.","is",["is","are"],"Có 1 cái kệ → There is.",V('shelf',1)),
 M("There ___ a cat in the garden.",["is","are","aren't"],0,"Có 1 con mèo → There is."),
 F("There ___ five apples in the bag.","are",["is","are"],"Có 5 quả táo (nhiều) → There are."),
 M("There ___ a fridge. (không có)",["isn't","aren't","is"],0,"Không có 1 cái tủ lạnh → There isn't.",V('fridge',1,True)),
 F("There ___ any chairs in the room. (không có)","aren't",["isn't","aren't"],"Không có cái ghế nào (nhiều) → There aren't any.",None,"(không có)"),
 M("___ there a key on the table?",["Is","Are","Can"],0,"Hỏi về 1 chiếc chìa khoá → Is there…?",V('key',1,False,True)),
 F("___ there any drums in the music room?","are",["Is","Are"],"Hỏi về nhiều cái trống → Are there any…?",V('drums',1,False,True)),
 M("Is there a cooker? – Yes, ___.",["there is","there are","I can"],0,"Trả lời ngắn cho Is there…? → Yes, there is."),
 F("Are there any violins? – No, there ___.","aren't",["isn't","aren't"],"Trả lời ngắn cho Are there…? → No, there aren't."),
 M("There ___ some stamps in the box.",["is","are","isn't"],1,"Stamps là nhiều → There are."),
 F("There ___ a diary on the shelf.","is",["is","are"],"Có 1 quyển nhật ký → There is."),
 M("There ___ three brushes in the bathroom.",["is","are","am"],1,"Có 3 cái bàn chải → There are."),
 F("___ there a brush in the bathroom?","is",["Is","Are"],"Hỏi về 1 cái bàn chải → Is there…?",None,"(1 cái)"),
 M("There is ___ oven in the kitchen.",["a","an","some"],1,"oven bắt đầu bằng âm nguyên âm → an oven."),
 F("There are ___ cushions on the bed.","some",["some","a","an"],"Nhiều cái gối → some cushions.",None,"(một vài)"),
 M("There ___ any envelopes on the desk. (không có)",["isn't","aren't","is"],1,"Phong bì là nhiều → There aren't any."),
 F("Are there two beds? – Yes, there ___.","are",["is","are"],"Trả lời Yes cho Are there…? → Yes, there are."),
]
L4=[
 M("I ___ play the violin.",["can","can't","cans"],0,"Mình biết chơi đàn → can.",V('violin',1),"(biết chơi)"),
 F("I ___ play the drums.","can't",["can","can't"],"Mình không biết chơi trống → can't.",V('drums',1,True),"(không biết)"),
 M("A fish ___ swim.",["can","can't","cans"],0,"Cá biết bơi → can."),
 F("A dog ___ fly.","can't",["can","can't"],"Chó không biết bay → can't.",None,"(không thể)"),
 M("She ___ ride a bike. She is only two.",["can","can't","cans"],1,"Em bé 2 tuổi chưa đi xe đạp được → can't."),
 F("___ you swim? – Yes, I can.","can",["Can","Are","Is"],"Hỏi khả năng → Can you…?"),
 M("He can ___ the piano.",["plays","play","to play"],1,"Sau can dùng động từ nguyên mẫu → play."),
 F("My mum can ___ delicious food.",["cook","make"],["cook","cooks","to cook"],"Sau can dùng động từ nguyên mẫu → cook.",None,"(nấu ăn)"),
 M("___ I borrow your key?",["Can","Is","Are"],0,"Xin phép mượn → Can I…?",V('key',1,False,True),"(xin phép)"),
 F("Can I open the window? – Yes, you ___.","can",["can","can't"],"Trả lời Yes → Yes, you can."),
 M("Can you play the drums? – No, I ___.",["can't","can","am not"],0,"Trả lời No → No, I can't."),
 F("Birds can ___.","fly",["fly","flies","to fly"],"Sau can dùng động từ nguyên mẫu → fly.",None,"(bay)"),
 M("We ___ talk in the library. (không được phép)",["can't","can","cans"],0,"Không được phép → can't."),
 F("Tom ___ run very fast.","can",["can","can't"],"Tom chạy nhanh được → can.",None,"(chạy nhanh được)"),
 M("A baby ___ walk. (chưa biết đi)",["can't","can","cans"],0,"Em bé chưa biết đi → can't."),
 F("Can she ___ the violin?","play",["play","plays","playing"],"Sau Can she… dùng động từ nguyên mẫu → play."),
 M("I can ___ English.",["speak","speaks","speaking"],0,"Sau can dùng động từ nguyên mẫu → speak."),
 F("___ you help me, please?","can",["Can","Are","Is"],"Nhờ giúp đỡ lịch sự → Can you…?"),
 M("Câu nào đúng?",["She can swim.","She cans swim.","She can swims."],0,"Sau can không thêm s: She can swim."),
 F("Can your brother play the drums? – No, he ___.","can't",["can","can't"],"Trả lời No → No, he can't."),
]
d=json.load(open('data.json',encoding='utf8'))
u=d['units'][0]
for l,pr in zip(u['lessons'],[L1,L2,L3,L4]):
    assert len(pr)==20, (l['id'],len(pr)); l['practice']=pr
open('data.json','w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=1))
print('ok',[len(l['practice']) for l in u['lessons']])
