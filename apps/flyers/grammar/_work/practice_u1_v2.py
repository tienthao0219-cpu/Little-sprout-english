# Luyện tập Unit 1 theo dạng bài Cambridge Flyers (Reading & Writing) + mức độ e/m/h.
# fmt: look (nhìn hình chọn) · read (đọc câu chọn) · dlg (hoàn thành hội thoại) · cloze (đọc đoạn ngắn chọn từ) · list (điền từ theo danh sách) · fill (viết một từ)
import json
def M(fmt,q,opts,a,why,art=None,hint=None,pre=None,post=None,lv=None):
    d={'t':'mcq','fmt':fmt,'q':q,'opts':opts,'a':a,'why':why,'lv':lv or {'look':'e','read':'m','dlg':'m','cloze':'h'}[fmt]}
    for k,v in (('art',art),('hint',hint),('pre',pre),('post',post)):
        if v: d[k]=v
    return d
def F(fmt,q,ans,bank,why,art=None,hint=None,pre=None,post=None,lv=None):
    d={'t':'fill','fmt':fmt,'q':q,'ans':ans if isinstance(ans,list) else [ans],'bank':bank,'why':why,'lv':lv or {'list':'m','fill':'h'}[fmt]}
    if fmt=='list': d['bankShow']=True
    for k,v in (('art',art),('hint',hint),('pre',pre),('post',post)):
        if v: d[k]=v
    return d
P=lambda v,a: {'t':'prep','v':v,'a':a}
V=lambda w,n=1,no=False,q=False: {'t':'vocab','w':w,'n':n,'no':no,'q':q}
R=lambda v,a: {'t':'people' if a!='thing' else 'thing','v':v}
T=lambda v: {'t':'thing','v':v}
L1=[
 M('look',"The dog is ___ the box.",["in","on","under"],0,"Chó ở bên trong hộp → in.",P('in','dog')),
 M('look',"The rabbit is ___ the table.",["under","on","next to"],1,"Thỏ ở trên bàn → on.",P('on','bunny')),
 M('look',"The pig is ___ the table.",["on","under","behind"],1,"Heo ở dưới bàn → under.",P('under','pig')),
 F('list',"The frog is ___ the sofa.","behind",["behind","in front of","on","next to"],"Ếch ở phía sau ghế → behind.",P('behind','frog')),
 M('look',"The bear is ___ the sofa.",["in front of","behind","in"],0,"Gấu ở phía trước ghế → in front of.",P('front','bear')),
 F('fill',"The chick is ___ the table.","next to",["next to","in","under"],"Gà con ở bên cạnh bàn → next to.",P('next','chick'),lv='m'),
 M('dlg',"Tom: It's ___ the bag. I can see it inside!",["in","on","under"],0,"Nhìn thấy bên trong → in.",None,None,["Mum: Where is my pen, Tom?"]),
 M('dlg',"Ben: It's ___ the table. Look!",["in","on","under"],2,"Mèo ở dưới bàn → under.",P('under','cat'),None,["Amy: Where's the cat?"]),
 M('read',"The shoes are ___ the bed.",["under","on","in"],0,"Giày ở dưới giường → under.",None,"(bên dưới)"),
 F('fill',"The cup is ___ the table.","on",["in","on","under"],"Cái cốc ở trên bàn → on.",None,"(ở trên mặt bàn)"),
 M('look',"The fox is ___ the table.",["under","on","next to"],1,"Cáo ở trên bàn → on.",P('on','fox')),
 F('list',"The penguin is ___ the box.","in",["in","on","under"],"Cánh cụt ở trong hộp → in.",P('in','penguin')),
 M('look',"The panda is ___ the table.",["next to","on","behind"],0,"Gấu trúc ở bên cạnh bàn → next to.",P('next','panda')),
 F('fill',"The dog is ___ the table.","under",["in","on","under"],"Chó ở dưới bàn → under.",P('under','dog')),
 M('cloze',"The teacher's desk is ___ the board.",["in front of","on","in"],0,"Bàn cô giáo ở phía trước bảng → in front of.",None,None,["Look at my classroom!","The board is on the wall."]),
 F('fill',"The pig is ___ the sofa.","in front of",["behind","in front of","on"],"Heo ở phía trước ghế → in front of.",P('front','pig')),
 M('dlg',"Mum: It's ___ the cooker. They are very close.",["next to","under","in"],0,"Hai thứ sát bên nhau → next to.",None,None,["Dad: Where's the fridge?"]),
 M('read',"The key is ___ the box.",["in","on","under"],0,"Chìa khoá ở bên trong hộp → in.",None,"(ở bên trong)"),
 M('cloze',"She is ___ the sofa.",["behind","on","in front of"],0,"Chỉ thấy cái đuôi → mèo ở phía sau ghế → behind.",None,None,["My cat Mimi loves hiding.","Look! I can only see her tail."]),
 F('fill',"My bag is ___ the desk.","on",["in","on","under"],"Cặp ở trên bàn học → on.",None,"(ở trên mặt bàn)"),
]
L2=[
 M('read',"Look! ___ is in the kitchen. I can see a boy.",["Someone","No one","Anyone"],0,"Có một người (một cậu bé) → Someone."),
 F('fill',"Is there ___ at home?","anyone",["anyone","no one","everyone"],"Câu hỏi 'có ai không' → anyone.",None,"(có ai không?)"),
 M('dlg',"Tom: No, ___ is there. It's empty.",["no one","someone","everyone"],0,"Trống không → no one.",None,None,["Mum: Is anyone in the garden?"]),
 F('list',"It's my birthday and ___ is here! All my friends came.","everyone",["everyone","no one","anyone"],"Tất cả bạn đều đến → everyone."),
 M('read',"I'm hungry, but there isn't ___ in the fridge.",["anything","something","everything"],0,"Câu phủ định (isn't) → anything."),
 F('fill',"There is ___ in the box. It's a toy car.","something",["something","anything","no one"],"Có một thứ trong hộp → something.",None,"(có một thứ gì đó)"),
 M('look',"___ is in the room.",["Someone","No one","Everyone"],0,"Có một người → Someone.",{'t':'people','v':'some'}),
 M('look',"___ is in the room.",["Someone","No one","Everyone"],1,"Phòng trống → No one.",{'t':'people','v':'no'}),
 M('look',"___ is here! All of us are in the room.",["No one","Everyone","Someone"],1,"Có đủ mọi người → Everyone.",{'t':'people','v':'every'}),
 M('dlg',"Mum: I looked ___, but I can't find it.",["everywhere","someone","anything"],0,"Tìm khắp nơi → everywhere.",None,None,["Dad: Where's my phone?"]),
 M('cloze',"I can't hear ___.",["anything","something","everyone"],0,"Câu phủ định (can't) → anything.",None,None,["It is night. The house is dark and very quiet."]),
 F('fill',"We all love pizza. ___ likes pizza.","everyone",["everyone","no one","anyone"],"Ai cũng thích → Everyone."),
 F('list',"I have ___ for you. It's a present!","something",["something","anything","no one"],"Mình có một thứ cho bạn → something."),
 M('dlg',"Boy: I don't have ___ to play with.",["anyone","someone","no one"],0,"Câu phủ định (don't) → anyone.",None,None,["Girl: Are you OK? You look sad."]),
 M('read',"Is there ___ in your bag?",["anything","no one","everywhere"],0,"Câu hỏi 'có gì không' → anything.",None,"(có gì không?)"),
 F('fill',"I can't see ___ in the dark room.","anything",["anything","something","everyone"],"Câu phủ định (can't) → anything.",None,"(không thấy gì cả)"),
 M('cloze',"We looked ___.",["everywhere","someone","anything"],0,"Tìm khắp nơi → everywhere.",None,None,["Our dog is lost!","We looked in the garden and in the street."]),
 M('look',"There is ___ in the box. Look!",["something","anything","no one"],0,"Có một thứ trong hộp → something.",T('some')),
 M('dlg',"Girl: I think ___ is at home. The lights are off.",["no one","someone","everyone"],0,"Đèn tắt → không ai ở nhà → no one.",None,None,["Boy: Hello! Hello!","(Nobody answers.)"]),
 F('fill',"The whole class is here. ___ is here today.","everyone",["everyone","no one","someone"],"Cả lớp có mặt → Everyone."),
]
L3=[
 M('look',"There ___ a cooker in the kitchen.",["is","are","can"],0,"Có 1 cái bếp → There is.",V('cooker',1)),
 M('look',"There ___ two cushions on the sofa.",["is","are","isn't"],1,"Có 2 cái gối (nhiều) → There are.",V('cushion',2)),
 M('look',"There ___ three violins.",["is","are","isn't"],1,"Có 3 cây đàn (nhiều) → There are.",V('violin',3)),
 F('list',"There ___ a shelf on the wall.","is",["is","are"],"Có 1 cái kệ → There is.",V('shelf',1)),
 M('read',"There ___ five apples in the bag.",["is","are","am"],1,"Có 5 quả táo (nhiều) → There are."),
 F('fill',"There ___ a fridge.","isn't",["isn't","aren't"],"Không có 1 cái tủ lạnh → There isn't.",V('fridge',1,True),"(không có)"),
 M('dlg',"Tom: Yes, ___.",["there is","there are","I can"],0,"Trả lời Yes cho Is there…? → there is.",None,None,["Mum: Is there a cooker in the kitchen?"]),
 M('dlg',"Amy: No, ___.",["there aren't","there isn't","they aren't"],0,"Trả lời No cho Are there…? → there aren't.",None,None,["Dad: Are there any cushions on the sofa?"]),
 M('look',"___ there a key on the table?",["Is","Are","Can"],0,"Hỏi về 1 chiếc chìa khoá → Is there…?",V('key',1,False,True)),
 F('fill',"___ there any drums in the music room?","are",["Is","Are"],"Hỏi về nhiều cái trống → Are there any…?",V('drums',2,False,True)),
 M('cloze',"There ___ thirty desks and one board.",["is","are","isn't"],1,"Có nhiều bàn (thirty desks) → There are.",None,None,["This is my classroom.","It is big and bright."]),
 M('read',"There is ___ oven in the kitchen.",["a","an","some"],1,"oven bắt đầu bằng âm nguyên âm → an oven."),
 F('fill',"There ___ any envelopes on the desk.","aren't",["isn't","aren't"],"Không có phong bì nào (nhiều) → There aren't any.",None,"(không có)"),
 M('dlg',"Boy: There ___ two books and a pen.",["are","is","isn't"],0,"Có hai quyển sách (nhiều) → There are.",None,None,["Girl: What's in your bag?"]),
 F('list',"There are ___ cushions on the bed.","some",["some","a","an"],"Nhiều cái gối → some cushions.",None,"(một vài)"),
 M('cloze',"___ there a tree in the garden?",["Is","Are","Can"],0,"Hỏi về 1 cái cây → Is there…? (Yes, there is.)",None,None,["Look at the picture of my house.","It has a small garden."],["Yes, there is."]),
 M('look',"There ___ some stamps in the box.",["is","are","isn't"],1,"Nhiều con tem → There are.",V('stamps',3)),
 F('fill',"Are there two beds? – Yes, there ___.","are",["is","are"],"Trả lời Yes cho Are there…? → there are."),
 M('read',"There ___ three brushes in the bathroom.",["is","are","am"],1,"Có 3 cái bàn chải → There are."),
 M('dlg',"Anna: No, ___. But there is a cooker.",["there isn't","there aren't","there is"],0,"Không có 1 cái tủ lạnh → there isn't.",None,None,["Teacher: Is there a fridge in your kitchen?"]),
]
L4=[
 M('look',"I ___ play the violin.",["can","can't","cans"],0,"Mình biết chơi đàn → can.",V('violin',1),"(biết chơi)"),
 M('look',"I ___ play the drums.",["can","can't","cans"],1,"Mình không biết chơi trống → can't.",V('drums',1,True),"(không biết)"),
 M('read',"A fish ___ swim.",["can","can't","cans"],0,"Cá biết bơi → can."),
 F('fill',"A dog ___ fly.","can't",["can","can't"],"Chó không biết bay → can't.",None,"(không thể)"),
 M('dlg',"Anna: Yes, I ___. It's easy!",["can","can't","am"],0,"Trả lời Yes → Yes, I can.",None,None,["Mum: Can you ride a bike, Anna?"]),
 F('list',"___ you swim? – Yes, I can.","can",["Can","Are","Is"],"Hỏi khả năng → Can you…?"),
 M('read',"He can ___ the piano.",["plays","play","to play"],1,"Sau can dùng động từ nguyên mẫu → play."),
 F('fill',"My mum can ___ delicious food.",["cook","make"],["cook","cooks","to cook"],"Sau can dùng động từ nguyên mẫu → cook.",None,"(nấu ăn)"),
 M('dlg',"Tom: ___ I borrow your pen, please?",["Can","Is","Are"],0,"Xin phép mượn → Can I…? (Yes, you can.)",None,None,None,["Amy: Yes, you can."]),
 F('fill',"Can I open the window? – Yes, you ___.","can",["can","can't"],"Trả lời Yes → Yes, you can."),
 M('look',"Can you play the drums? – No, I ___.",["can't","can","am not"],0,"Trả lời No → No, I can't.",V('drums',1)),
 F('fill',"Birds can ___.","fly",["fly","flies","to fly"],"Sau can dùng động từ nguyên mẫu → fly.",None,"(bay)"),
 M('cloze',"We ___ talk loudly here.",["can't","can","cans"],0,"Thư viện phải yên lặng → can't.",None,None,["This is the school library.","Please be quiet."]),
 F('fill',"Tom ___ run very fast.","can",["can","can't"],"Tom chạy nhanh được → can.",None,"(chạy nhanh được)"),
 M('cloze',"She ___ walk yet.",["can't","can","cans"],0,"Em bé 1 tuổi chưa đi được → can't.",None,None,["Look at the baby! She is only one year old."]),
 F('fill',"Can she ___ the violin?","play",["play","plays","playing"],"Sau Can she… dùng động từ nguyên mẫu → play."),
 M('read',"I can ___ English.",["speak","speaks","speaking"],0,"Sau can dùng động từ nguyên mẫu → speak."),
 M('dlg',"Boy: ___ I help you?",["Can","Are","Do"],0,"Đề nghị giúp → Can I help you?",None,None,["Girl: Oh no! My bag is too heavy."]),
 M('read',"Câu nào đúng?",["She can swim.","She cans swim.","She can swims."],0,"Sau can không thêm s: She can swim."),
 M('dlg',"Tom: No, he ___. But he can play the guitar.",["can't","can","isn't"],0,"Không chơi được trống → he can't.",None,None,["Mum: Can your brother play the drums?"]),
]
# bài tập tổng hợp: gắn mức độ (3 dễ, 4 vừa, 3 khó)
LV=['e','e','e','m','m','m','m','h','h','h']
d=json.load(open('data.json',encoding='utf8')); u=d['units'][0]
u['mix']=[dict(q,topic=l['title']) for l,pr in zip(u['lessons'],[L1,L2,L3,L4]) for q in pr]   # kho câu cho bài TRỘN nhiều unit (dạng Cambridge + mức e/m/h)
for q,lv in zip(u['quiz'],LV): q['lv']=lv; q.setdefault('fmt','look' if q.get('art') else 'read')
open('data.json','w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=1))
import collections
c=collections.Counter(q['lv'] for q in u['mix']); print('kho trộn, mức:',dict(c),'tổng',sum(c.values()))
print(collections.Counter(q['fmt'] for q in u['mix']))
