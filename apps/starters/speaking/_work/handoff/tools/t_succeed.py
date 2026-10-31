from sethelp import *
from succ_scripts import T
# "Succeed in Cambridge English: Starters" (2018), 8 Practice Tests. Script: Answer Key (bảng Speaking, tr.19–26). Hình: Student's Book, Practice Test n, Speaking (scene + object cards).
# Bảng sách: Part 1 (tìm đồ trong tranh + 3 thẻ đặt vị trí) -> p1;  Part 2 (hỏi về tranh) -> p2;  Part 3 (4 thẻ x 3 câu) -> p3;  Part 4 (câu cá nhân) -> p4.
BOOK='Succeed in Cambridge English: Starters (2018)'
BYE_={'say':'OK. Thank you, (name). Goodbye.','vi':'Được rồi. Cảm ơn em. Tạm biệt!'}
TS={'say':'Now look at these.','vi':'Bây giờ nhìn những thẻ này nhé.'}
def src(n,page): return "%s · Practice Test %d, Speaking (Answer Key tr.%d) · hình: Student's Book, Practice Test %d Speaking"%(BOOK,n,page,n)
def art(w): return 'an' if w[0] in 'aeiou' else 'a'
PLU={'shoes','trousers','beans','sunglasses'}
VIW={'horse':'con ngựa','coconut':'quả dừa','baseball':'quả bóng chày','apple':'quả táo','cow':'con bò','burger':'bánh burger','egg':'quả trứng','basketball':'quả bóng rổ','book':'quyển sách','photo':'bức ảnh','rubber':'cục tẩy','radio':'cái đài','pen':'cây bút','computer':'máy tính','ice cream':'cây kem','shirt':'cái áo sơ mi','car':'chiếc xe hơi','watch':'chiếc đồng hồ đeo tay','armchair':'ghế bành','orange':'quả cam','piano':'đàn piano','giraffe':'con hươu cao cổ','skateboard':'ván trượt','snake':'con rắn','mango':'quả xoài','elephant':'con voi','lizard':'con thằn lằn','robot':'người máy','pineapple':'quả dứa','kite':'con diều','shoe':'chiếc giày','beans':'những hạt đậu','tablet':'máy tính bảng','doll':'con búp bê','grapes':'chùm nho','dog':'con chó','shell':'vỏ sò','hat':'cái mũ','mouse':'con chuột','bear':'con gấu','bike':'xe đạp','toy lorry':'xe tải đồ chơi','camera':'máy ảnh','helicopter':'máy bay trực thăng','ball':'quả bóng','sunglasses':'kính râm','trousers':'quần dài','shoes':'đôi giày','carrot':'củ cà rốt','telephone':'điện thoại','bird':'con chim','T-shirt':'áo thun','watermelon':'quả dưa hấu'}
VIO={'cake':'cái bánh','clock':'cái đồng hồ','door':'cái cửa ra vào','board':'cái bảng','camera':'cái máy ảnh','window':'cái cửa sổ','frog':'con ếch','bird':'con chim','sofa':'cái ghế sofa','mat':'tấm thảm','ball':'quả bóng','apple':'quả táo','girl':'bạn nữ','hat':'cái mũ','rubber':'cục tẩy','milk':'hộp sữa'}
VI={"Now, (name), what's this?":'Đây là gì?',"What colour is it?":'Nó màu gì?',"How many monkeys are there?":'Có bao nhiêu con khỉ?',"What's the girl doing?":'Bạn nữ đang làm gì?',"Tell me about this boy.":'Hãy nói về bạn nam này.',
"Now, (name), what are these?":'Đây là những gì?',"What colour are they?":'Chúng màu gì?',"How many flowers are there?":'Có bao nhiêu bông hoa?',"What's the teacher doing?":'Cô giáo đang làm gì?',"How many boats are there?":'Có bao nhiêu chiếc thuyền?',"Tell me about this girl.":'Hãy nói về bạn nữ này.',
"How many dogs are there?":'Có bao nhiêu con chó?',"What's the boy doing?":'Bạn nam đang làm gì?',"Tell me about this man.":'Hãy nói về người đàn ông này.',"How many cars are there?":'Có bao nhiêu chiếc xe hơi?',"How many birds are there?":'Có bao nhiêu con chim?',"How many people are there?":'Có bao nhiêu người?',"How many apples are there?":'Có bao nhiêu quả táo?',"What's the woman doing?":'Người phụ nữ đang làm gì?',
"What's this?":'Đây là gì?',"What are these?":'Đây là những gì?',"What is this?":'Đây là gì?',
"Do you like eating apples?":'Em có thích ăn táo không?',"Do you have a pet?":'Em có thú cưng không?',"Do you like eating eggs?":'Em có thích ăn trứng không?',"Do you play basketball?":'Em có chơi bóng rổ không?',"Do you have a computer?":'Em có máy tính không?',"Do you have a radio?":'Em có cái đài không?',"Do you take photos?":'Em có chụp ảnh không?',"Do you wear a shirt?":'Em có mặc áo sơ mi không?',
"Do you like drinking orange juice?":'Em có thích uống nước cam không?',"Can you ride a horse?":'Em có biết cưỡi ngựa không?',"Do you like skateboarding?":'Em có thích trượt ván không?',"Do you have an armchair in your living room?":'Phòng khách nhà em có ghế bành không?',"Do you like snakes?":'Em có thích rắn không?',"Have you got a robot?":'Em có người máy không?',"Do you like elephants?":'Em có thích voi không?',
"Do you have a dog?":'Em có con chó không?',"Can you have a tablet at school?":'Em có được dùng máy tính bảng ở trường không?',"Do you eat beans?":'Em có ăn đậu không?',"Do you like shells?":'Em có thích vỏ sò không?',"Do you like mice?":'Em có thích chuột không?',"Can you ride a bike?":'Em có biết đi xe đạp không?',"Do you have a camera?":'Em có máy ảnh không?',"Do you play with toy lorries?":'Em có chơi xe tải đồ chơi không?',
"Do you wear green shoes?":'Em có đi giày màu xanh lá không?',"Do you wear trousers?":'Em có mặc quần dài không?',"Do you have a telephone?":'Em có điện thoại không?',"Do you like birds?":'Em có thích chim không?',"Do you wear a T-shirt?":'Em có mặc áo thun không?',
"What's your favourite fruit?":'Trái cây em thích nhất là gì?',"Which animal do you want to have?":'Em muốn nuôi con vật nào?',"What do you eat for breakfast?":'Em ăn gì vào bữa sáng?',"Which sport do you like playing?":'Em thích chơi môn thể thao nào?',"Is this computer new or old?":'Máy tính này mới hay cũ?',"What colour is this radio?":'Cái đài này màu gì?',"What's your favourite hobby?":'Sở thích em thích nhất là gì?',"What colour is your shirt?":'Áo sơ mi của em màu gì?',
"Which animal would you like to have?":'Em muốn nuôi con vật nào?',"Which is your favourite sport?":'Môn thể thao em thích nhất là gì?',"What colour is your armchair?":'Ghế bành của em màu gì?',"What animals are there in your garden?":'Trong vườn nhà em có những con vật nào?',"What are your favourite toys?":'Đồ chơi em thích nhất là gì?',"What animals are there in the zoo?":'Trong sở thú có những con vật nào?',
"What pets do your friends have?":'Bạn của em nuôi thú cưng gì?',"Who in your family has got a tablet?":'Ai trong gia đình em có máy tính bảng?',"Which is your favourite food?":'Món ăn em thích nhất là gì?',"Where can you find a shell?":'Em có thể tìm thấy vỏ sò ở đâu?',"What colour are the mice?":'Những con chuột màu gì?',"What present do you want for your birthday?":'Em muốn quà gì vào sinh nhật?',
"What colour is your / this camera?":'Máy ảnh của em (cái này) màu gì?',"Which are your favourite toys?":'Đồ chơi em thích nhất là gì?',"What colour are your shoes?":'Giày của em màu gì?',"What's your favourite song?":'Bài hát em thích nhất là gì?',"What photos do you take?":'Em hay chụp những bức ảnh gì?',"What colour are your trousers?":'Quần của em màu gì?',"What colour is your telephone?":'Điện thoại của em màu gì?',
"What pet would you like to have?":'Em muốn nuôi thú cưng nào?',"What colour is your T-shirt?":'Áo thun của em màu gì?',"Which is your favourite animal?":'Con vật em thích nhất là gì?',
"Now, (name), do you have a garden at your house?":'Nhà em có vườn không?',"Where do you live?":'Em sống ở đâu?',"Who do you play with?":'Em chơi với ai?',"Now, (name), how old are you?":'Em bao nhiêu tuổi?',"How many children are there in your class?":'Lớp em có bao nhiêu bạn?',"What's your favourite lesson?":'Môn học em thích nhất là gì?',
"Now, (name), do you like eating meatballs?":'Em có thích ăn thịt viên không?',"Who cooks dinner at your home?":'Ai nấu bữa tối ở nhà em?',"Now, (name), do you like eating sweets?":'Em có thích ăn kẹo không?',"What do you eat on your birthday?":'Em ăn gì vào ngày sinh nhật?',"Where do you go on your birthday?":'Em đi đâu vào ngày sinh nhật?',
"Which is your favourite fruit?":'Loại trái cây em thích nhất là gì?',"Where do you eat dinner?":'Em ăn tối ở đâu?',"Now, (name), is your house big or small?":'Nhà em to hay nhỏ?',"How many bedrooms are there in your house?":'Nhà em có mấy phòng ngủ?',"What colour's the wall in your bedroom?":'Tường phòng ngủ của em màu gì?',
"Now, (name), can you swim?":'Em có biết bơi không?',"Where do you swim?":'Em bơi ở đâu?',"Who do you swim with?":'Em bơi với ai?',"Now, (name), can you ride a bike?":'Em có biết đi xe đạp không?',"Where do you ride your bike?":'Em đi xe đạp ở đâu?',"Who do you ride your bike with?":'Em đi xe đạp với ai?'}
# ---- Gợi ý mức 2 ("A or B?") viết tay. p2: 4 câu đầu (câu 5 "Tell me about…" lấy từ back-up trong sách). p3q3: Q3 của 4 thẻ ('L1|L2' nếu cần đổi mức 1). p4: 3 câu (None = Yes/No tự sinh).
H2={
1:dict(p2=["Is it a monkey or a cat?","Is it brown or black?","Are there two or three?","Is the girl drawing or sleeping?"],p3q3=["Are they pears or apples?","Do you want to have a fish or a cat?","Do you eat an apple or bread?","Do you play table tennis or football?"],p4=[None,"Do you live in Sun Street or in Park Street?","Do you play with your friends or your brothers?"]),
2:dict(p2=["Are these flowers or trees?","Are they red or yellow?","Are there five or six?","Is she holding a ruler or a pen?"],p3q3=["Is this computer old or new?","Is this radio blue or red?","Do you like football?|Is it football or tennis?","Is it blue or red?"],p4=["Are you eight or nine?","Are there 19 or 20 children in your class?","Do you like English or Maths?"]),
3:dict(p2=["Are these boats or cars?","Are they green or red?","Are there two or three?","Is she listening to the radio or watching TV?"],p3q3=["Do you like apples?|Do you like apples or pears?","Would you like to have a cat?|Would you like to have a cat or a fish?","Do you like playing hockey?|Do you like playing hockey or tennis?","Is your armchair red?|Is your armchair red or green?"],p4=[None,"Does your mum cook dinner?|Does your mum or your sister cook dinner?","Do you like chicken with potatoes?|Do you like chicken with potatoes or fish with rice?"]),
4:dict(p2=["Is this a dog or a cat?","Is it black or brown?","Are there two or three?","Is the boy swimming or running?"],p3q3=["Do you have a cat?|Do you have a cat or a dog?","Are they trains?|Are they trains or cars?","Are there giraffes?|Are there giraffes or zebras?","Do you like playing badminton?|Do you like playing badminton or football?"],p4=[None,"Do you eat cake?|Do you eat cake or noodles?","Do you go to the park?|Do you go to the park or to the zoo?"]),
5:dict(p2=["Is this a car or a bus?","Is it blue or green?","Are there three or four?","Is he painting a picture or reading a book?"],p3q3=["Do they have cats?|Do they have cats or fish?","Has your father got a tablet?|Has your father or your mother got a tablet?","Is rice your favourite food?|Is rice or bread your favourite food?","Can you find a shell on the beach?|Can you find a shell on the beach or in the park?"],p4=[None,"Is apple your favourite fruit?|Is apple or banana your favourite fruit?","Do you eat dinner in the dining room?|Do you eat dinner in the dining room or in the kitchen?"]),
6:dict(p2=["Is this a bird or a bee?","Is it blue or green?","Are there two or three?","Is the boy holding balloons or a ball?"],p3q3=["Are they grey?|Are they grey or white?","Do you want a bike?|Do you want a bike or a computer?","Is your camera blue?|Is your camera blue or black?","Are dolls your favourite toys?|Are dolls or cars your favourite toys?"],p4=["Is it big?|Is it big or small?","Are there two bedrooms in your house?|Are there two or three bedrooms in your house?","Is the wall in your bedroom blue?|Is the wall in your bedroom blue or white?"]),
7:dict(p2=["Is it the sea or a river?","Is it blue or green?","Are there two or three people?","Is the boy swimming or running?"],p3q3=["Are they black?|Are they black or white?","Is it Five Small Ducks?|Is it Five Small Ducks or Happy Birthday?","Do you take pictures of animals?|Do you take pictures of animals or your family?","Are they blue?|Are they blue or black?"],p4=[None,"Do you swim in the sea?|Do you swim in the sea or in a pool?","Do you swim with your family?|Do you swim with your family or your friends?"]),
8:dict(p2=["Are these apples or oranges?","Are they red or green?","Are there two or three?","Is she holding a cake or a book?"],p3q3=["Are monkeys your favourite animals?|Are monkeys or elephants your favourite animals?","Is it yellow?|Is it yellow or black?","Would you like to have a cat?|Would you like to have a cat or a dog?","Is it pink?|Is it pink or blue?"],p4=[None,"Do you ride your bike in the garden?|Do you ride your bike in the garden or in the park?","Do you ride your bike with your brother?|Do you ride your bike with your brother or your sister?"])}
# ---- Hình: hot (đối tượng trong tranh, %) và zones (vùng đặt thẻ, %), alt, tên thẻ (key -> (từ hiển thị))
G={
1:dict(alt='A kitchen: a woman cooking, a monkey sitting on the table next to a cake, a monkey hanging upside down, a girl and a boy painting on the floor, a clock on the wall',
 hot={'woman':R(53.5,10.2,15,58.8,'woman'),'cake':R(61,60,10,9.5,'cake'),'clock':R(33.5,6.1,6,8.5,'clock'),'monkey':R(43,55.3,17.5,30,'monkey'),'girl':R(4,61.5,10.5,22.5,'girl'),'boy':R(16,63.7,11,19.8,'boy')},
 zones={'table':Z(39.5,64.4,8,11.7,'on the table',[43.5,70.2]),'chair':Z(36.5,84.2,10.5,10.5,'under the chair',[41.7,89.5]),'bread':Z(79.5,38.4,8.5,6.3,'in front of the bread',[83.7,41.5]),'children':Z(12,68.8,6.5,12.5,'between the two children',[15.2,75])}),
2:dict(alt='A classroom: a teacher holding a ruler by the board, flowers in a vase, a bookcase, a frog and a duck, three pupils at their desks (one with a doll on the desk)',
 hot={'bookcase':R(0,0,22.5,58.5,'bookcase'),'door':R(83,0,17,63,'door'),'board':R(46,0,34,31.4,'board'),'flowers':R(24,32.5,7,28,'flowers'),'teacher':R(27,6.6,17.5,33.6,'teacher'),'boy':R(44.5,71.6,11,28.4,'boy')},
 zones={'desk':Z(30.5,41,11.5,8,"on the teacher's desk",[36.2,45]),'doll':Z(26.2,83.3,5.6,10,'next to the doll',[29,88.3]),'browngirl':Z(69,83.3,12,11.7,'in front of the girl with brown hair',[75,89]),'frogduck':Z(69,48.2,7,6.6,'between the frog and the duck',[72.5,51.5])}),
3:dict(alt='A bedroom: a girl lying on a round purple bed next to a radio, three sailing boats on the wall, a television, a girl painting on the floor, a bookcase, a phone and a camera',
 hot={'television':R(80,33.4,13,15.7,'television'),'camera':R(11,61.3,7.2,7.7,'camera'),'window':R(28.5,8.8,21,17.6,'window'),'boats':R(56.5,28.6,22.5,14.7,'boats'),'girlbed':R(29.5,41.8,16,23.5,'girl on the bed'),'girlfloor':R(84,61.4,11.5,22.9,'girl on the floor')},
 zones={'radio':Z(49,31.5,7,8.5,'next to the radio',[52.5,35.8]),'bed':Z(50,70,18,11,'on the bed',[59,75.5]),'bookcase':Z(0,41.8,8.5,11.7,'in front of the bookcase',[4.2,47.6]),'radiophone':Z(18,31.5,11,10.3,'between the radio and the phone',[23.5,36.6])}),
4:dict(alt='A street: a boy swimming, a lorry, a man on a motorbike, three black dogs, a cat, a frog on a table, a yellow bird on a roof, two boys playing basketball',
 hot={'twoboys':R(34.5,38,9.5,13.6,'two boys'),'frog':R(71.5,61,6.5,6.5,'frog'),'bird':R(83,31.8,6,9.8,'bird'),'dog':R(58.5,65.3,11.5,10,'dog'),'boywater':R(6.5,84.6,18,10,'boy in the water'),'man':R(36,60.3,19.5,30,'man on the motorbike')},
 zones={'table':Z(77.5,61.5,5.5,6,'on the table',[80.2,64.5]),'chair':Z(83.5,71,6.5,8,'under the chair',[86.7,75]),'cat':Z(83,86.8,8,6,'in front of the cat',[87,89.8]),'lorrybike':Z(32,62,4,17,'between the lorry and the motorbike',[34,70.5])}),
5:dict(alt='A living room: a boy painting on the floor, a girl lying on the floor reading, a girl with brown hair sitting reading, a green sofa with blue cars, a window, a basketball, a toy train, a purple mat',
 hot={'window':R(9,0,40,38,'window'),'sofa':R(49,22,51,39.5,'sofa'),'mat':R(38,77.7,27.5,14.7,'mat'),'car':R(67,8,10,8.8,'car'),'boy':R(78,53.5,18,37.4,'boy'),'girlred':R(36.5,48.4,38,28,'girl lying on the floor')},
 zones={'basketball':Z(27,74.5,7,10,'next to the basketball',[30.5,79.5]),'chair':Z(3,49,9,12.5,'under the chair',[7.5,55.2]),'train':Z(36.5,87,7.5,13,'in front of the train',[40.2,93.5]),'browngirl':Z(4,63,8,19,'behind the girl with brown hair',[8,72.5])}),
6:dict(alt='A park: a girl holding an apple, a boy flying a kite, a boy with balloons, a robot, three birds in a tree, a cat, a dog and a ball',
 hot={'robot':R(48.5,60,4.3,13,'robot'),'ball':R(64,87.4,5.5,8,'ball'),'apple':R(5,72,6,5.5,'apple'),'bird':R(13,12,10.5,11,'bird'),'boyballoons':R(79,51.3,14.5,34,'boy with balloons'),'boytrousers':R(55.5,47,11,26.7,'boy in blue trousers')},
 zones={'girlhead':Z(7.5,52.7,11.5,5.8,"on the girl's head",[13.2,55.6]),'girl':Z(4,91.5,16.5,8.3,'in front of the girl',[12.2,95.6]),'kite':Z(77,13,9,14,'next to the kite',[81.5,20]),'catdog':Z(39,83,6.8,11,'between the cat and the dog',[42.4,88.5])}),
7:dict(alt='A beach: an old woman with sunglasses, a girl on a sun lounger under a parasol, two people swimming in the sea, a sun hat, a pink dress, a blue dress, a toy lorry, two birds',
 hot={'oldwoman':R(20.5,44.6,21.5,32,'old woman'),'girl':R(48,45.3,22.5,37,'girl'),'hat':R(13,76,16,12.5,'hat'),'sea':R(0,28.6,100,30,'sea'),'boysea':R(81.5,39.7,13,7.7,'boy in the sea')},
 zones={'hat':Z(13.5,70.5,9,5.6,'next to the hat',[18,73.3]),'birds':Z(1,16.5,21,8,'under the birds',[11.5,20.5]),'toylorry':Z(69,94,19,6,'in front of the toy lorry',[78.5,97]),'dresses':Z(14.5,89.3,12.5,10.5,'between the dresses',[20.8,94.5])}),
8:dict(alt='A kitchen: a woman holding a cake, a girl, a boy reading at a table, a dog on the counter, a milk carton, bananas, a bowl with a mixer, apples',
 hot={'woman':R(63.5,16.4,16.5,53.5,'woman'),'rubber':R(4,31,5,4,'rubber'),'milk':R(89,54,6.5,23,'milk'),'boy':R(12,21,19,42,'boy'),'apples':R(83.5,83.5,14,12,'apples')},
 zones={'dog':Z(38,15.7,9.5,8,'next to the dog',[42.7,19.7]),'chair':Z(21.8,51.5,7.5,10,'under the chair',[25.5,56.5]),'girl':Z(40,70.7,18,10,'in front of the girl',[49,75.7]),'bananas':Z(29,72,9.5,10,'between the bananas',[33.7,77])})}
CARDS={1:'horse coconut apple baseball cow burger egg basketball',2:'book photo rubber radio pen computer icecream shirt',3:'car watch armchair orange piano giraffe horse skateboard',4:'snake mango elephant basketball lizard robot pineapple kite',5:'shoe beans tablet doll baseball grapes dog shell',6:'hat mouse bear snake bike toylorry camera helicopter',7:'camera ball photo kite sunglasses trousers shoes radio',8:'carrot horse tablet bird telephone trousers watermelon tshirt'}
WORD={'icecream':'ice cream','toylorry':'toy lorry','tshirt':'T-shirt'}
def cw(k): return WORD.get(k,k)
def sent(k):
    w=cw(k)
    return "They're %s."%w if k in PLU else "It's %s %s."%(art(w),w)
def vi(s):
    if s not in VI: raise KeyError('thiếu VI: '+s)
    return VI[s]
def first_part(s): return s.split(' / ')[0] if ' / ' in s and '(' not in s.split(' / ')[0] else s.split(') / ')[0]+(')' if ') / ' in s else '')
def tell_hints(back):
    p=first_part(back)
    if '(' in p: return [p.split('(')[0].strip(),p.split('(')[1].rstrip(') ').strip()]
    parts=back.split(' / ');return [parts[0].strip(),parts[1].strip() if len(parts)>1 else parts[0]]
def yn_hints(say):
    s=say.lower()
    fr="Say: Yes, I can. / No, I can't." if 'can you' in s else "Say: Yes, I have. / No, I haven't." if 'have you got' in s else "Say: Yes, I do. / No, I don't."
    return ['Yes or no? '+say.replace('Now, (name), ',''),fr]
def pk(card):
    w=cw(card);return pick('Which is the %s?'%w,'Is this the %s? (pointing to %s)'%(w,w),'Thẻ nào là %s?'%VIW[w],['Look at the cards. Which one is the %s?'%w,'Is this the %s?'%w])
def mk(n):
    t=T[n];g=G[n];h=H2[n];sid='succ-t%d'%n;keys=CARDS[n].split()
    cards={k:card(sid,k,cw(k),sent(k)) for k in keys}
    find_=[find(sy,tg,bk,'%s ở đâu?'%VIO[tg][0].upper()+VIO[tg][1:] if False else '%s ở đâu?'%(VIO[tg][0].upper()+VIO[tg][1:]),['Look at the picture. '+sy,bk]) for sy,tg,bk in t['find']]
    steps=[]
    for card_,word,psay,zone,pback,pvi,dsay,dzone,dvi in t['steps']:
        hint1='Look at the picture. '+pback.split('? ')[0]+'?'
        pl=place(psay,zone,pback,pvi,[hint1,pback])
        steps.append(step(card_,pk(card_),pl,demo(dsay,dzone,dvi) if dsay else None))
    p2=[]
    for i,(say,ans,back,pt) in enumerate(t['p2']):
        hs=tell_hints(back) if say.startswith('Tell me about') else [back.split('?')[0]+'?' if not back.startswith('Are there') or True else back,h['p2'][i]]
        if not say.startswith('Tell me about'):
            hs=[back.replace(' Three?',' Three?'),h['p2'][i]]
            if '? ' in back and back.startswith('Are there'): hs[0]=back.split('? ')[0]+'?'   # "Are there two? Three?" -> mức 1 "Are there two?"
        q=Q(say,vi(say),ans,back,hs,point=pt)
        if i==0 and 'cards' in t.get('noteq',''): pass
        p2.append(q)
    p3=[]
    for ci,(ck,qs) in enumerate(t['p3']):
        out=[];others=[k for k in keys if k!=ck]
        # Q1: nhận diện thẻ
        s1,a1,b1=qs[0];w=cw(ck);dis=cw(others[0]) if cw(others[0])!=w else cw(others[1])
        pl_=ck in PLU
        h1=[b1,('Are they %s or %s?'%(w,dis)) if pl_ else 'Is it %s %s or %s %s?'%(art(w),w,art(dis),dis)]
        out.append(Q(s1,vi(s1),a1,b1,h1))
        # Q2: yes/no
        s2,a2,b2=qs[1];out.append(Q(s2,vi(s2),a2,'',yn_hints(s2),free=True))
        # Q3: tự do (back-up + A or B)
        s3,a3,b3=qs[2];ov=h['p3q3'][ci];l1,l2=(ov.split('|')+[None])[:2] if '|' in ov else (b3,ov)
        out.append(Q(s3,vi(s3),a3,b3,[l1,l2],free=True))
        p3.append(p3_(ck,out))
    p4=[]
    for i,(say,ans,back) in enumerate(t['p4']):
        ov=h['p4'][i]
        if ans==['Yes / No']: hs=yn_hints(say)
        else:
            l1,l2=ov.split('|') if '|' in ov else (back,ov);hs=[l1,l2]
        p4.append(Q(say,vi(say),ans,back,hs,free=True))
    s={'id':sid,'no':22+n,'group':'succ','origin':'book','title':'Succeed · Test %d'%n,'theme':t['theme'],'themeVi':t['themeVi'],'src':src(n,t['page']),
     'scene':{'img':'img/%s/scene.webp'%sid,'alt':g['alt']},'hot':g['hot'],'zones':g['zones'],'cards':cards,
     'p1':{'hello':HELLO,'intro':{'say':t['intro'][0],'vi':t['intro'][1]},'example':{'say':t['ex'][0],'target':t['ex'][1],'vi':t['ex'][2]},'find':find_,'tableSay':TS,'order':keys,'cardSteps':steps},
     'p2':p2,'p3':p3,'p4':p4,'bye':BYE_}
    return s
def p3_(ck,qs): return {'card':ck,'qs':qs}
sets=[mk(n) for n in range(1,9)]
# ---- ghi chú / điểm cần cô xác nhận
S={s['id']:s for s in sets}
S['succ-t2']['p1']['cardSteps'][1]['place']['check']='Sách ghi "Put the book in front of the girl with the brown hair". Trong tranh có 2 bạn nữ ở hàng ghế dưới: bạn bên trái tóc vàng-cam, bạn bên phải tóc đen/nâu đậm. App chọn bạn bên phải (tóc nâu đậm) — cô xác nhận giúp.'
S['succ-t2']['hot']['door']['check']='Bên phải tranh có một tấm cửa nâu (có tay nắm tròn) và ô cửa sổ có rèm lá sách ở trên; app khoanh cả tấm. Cô kiểm tra "the door" có đúng vùng này không.'
S['succ-t6']['hot']['apple']['check']='Quả táo rất nhỏ (cô bé đang cầm trên tay) — vùng chạm hơi nhỏ.'
S['succ-t3']['p1']['cardSteps'][2]['place']['note']='"Between the radio and the phone": vùng đặt trên tường, giữa cái đài (giữa tranh) và điện thoại (bên trái).'
S['succ-t7']['p1']['cardSteps'][2]['place']['note']='Hai cái váy nằm hai bên cái mũ; vùng đặt ở khoảng cát ngay dưới cái mũ, giữa hai cái váy.'
S['succ-t4']['p1']['cardSteps'][2]['place']['note']='Giữa xe tải và xe máy chỉ có khoảng hẹp; vùng đặt phủ nhẹ lên mép hai xe.'
S['succ-t7']['p1']['cardSteps'][1]['place']['note']='Xe tải đồ chơi quay đầu sang phải; vùng "in front of" đặt ở phía trước-dưới xe (hướng về người xem).'
S['succ-t6']['p1']['cardSteps'][0]['place']['note']='Bạn nữ nhìn thẳng; "in front of the girl" đặt ở phần cỏ phía dưới chân bạn.'
S['succ-t5']['p1']['cardSteps'][2]['place']['note']='Bạn tóc nâu ngồi quay mặt sang phải; "behind" đặt ở khoảng sàn bên trái-sau lưng bạn.'
d=load()
for s in sets:add(d,s)
save(d);print('ok',len(d['sets']))
