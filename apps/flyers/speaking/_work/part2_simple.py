# Đơn giản hóa Part 2 theo cách hỏi của Cambridge Flyers (Answer Booklet, Flyers 3):
# câu hỏi ngắn, dùng tên người / "it" thay vì he/she. Chạy một lần trên data.json (có kiểm tra để chạy lại không hỏng).
import json,re
P='data.json'
d=json.load(open(P,encoding='utf8')); S={s['id']:s for s in d['sets']}

# 1) cam3: đúng theo sách Flyers 3 – Test 1/2/3 (Answer Booklet tr.11, 17, 23)
BOOK={'cam3-t1':["What's the teacher's name?","How many students are there?","When is the class?","What does she like painting?","Is she a good artist?"],
      'cam3-t2':["What colour is the car?","How many doors has it got?","How old is it?","Was it cheap or expensive?","Where is it now?"],
      'cam3-t3':["Where is Emma's apartment?","Which floor is it on?","How many bedrooms has it got?","What colour is the kitchen?","Has it got a balcony?"]}
for k,v in BOOK.items(): S[k]['hints']['p2q']=v

# 2) 9 bộ AI: câu hỏi đơn giản. (cue, đáp án A, đáp án B) ; câu hỏi dùng {n}=tên, {p}=she/he, {w}=her/his
AI={
'ai-t2':dict(topic='Favourite shop',
  rows=[('What / sell','toys','sports clothes'),('Name','Toy Town','Sport Star'),('Where','next to the bank','opposite the cinema'),('What time / open','9 a.m.','10 a.m.'),('Big / small','small','big')],
  qs=["What does {n}'s shop sell?","What's the shop called?","Where is it?","What time does it open?","Is it big or small?"],
  hint=["What does the shop sell?","What's the shop called?","Where is it?","What time does it open?","Is it big or small?"],
  w="shop = cửa hàng; sell = bán; toys / sports clothes / books / shoes = đồ chơi / quần áo thể thao / sách / giày; called = tên là; next to / opposite / behind = cạnh / đối diện / phía sau; open = mở cửa; big / small = to / nhỏ"),
'ai-t3':dict(topic='Train trip',
  rows=[('Where / go','to the seaside','to the capital city'),('What time / leave','8.30 a.m.','7.15 a.m.'),('How long','two hours','three hours'),('Who / go with','her aunt','his grandparents'),('What / take','a book','a camera')],
  qs=["Where is {n} going?","What time does the train leave?","How long is the trip?","Who does {p} go with?","What does {p} take?"],
  hint=["Where is {n} going?","What time does the train leave?","How long is the trip?","Who does {p} go with?","What does {p} take?"],
  w="train trip = chuyến đi bằng tàu; seaside = bờ biển; capital city = thủ đô; leave = rời đi; two hours / three hours = 2 giờ / 3 giờ; aunt / grandparents = dì (cô) / ông bà; book / camera = quyển sách / máy ảnh"),
'ai-t4':dict(topic='New book',
  rows=[('Name / book','The Magic Dragon','Football Stars'),('What / about','a dragon','football'),('How many pages','150','90'),('Where / get it','from the library','from his cousin'),('Interesting / boring','interesting','boring')],
  qs=["What's {n}'s book called?","What's it about?","How many pages has it got?","Where did {p} get it?","Is it interesting or boring?"],
  hint=["What's {n}'s book called?","What's it about?","How many pages has it got?","Where did {p} get it?","Is it interesting or boring?"],
  w="book = quyển sách; called = tên là; be about = nói về; dragon / football = rồng / bóng đá; pages = số trang; library = thư viện; cousin = anh chị em họ; interesting / boring = thú vị / chán"),
'ai-t5':dict(topic='School trip',
  rows=[('Where / go','to a science museum','to the zoo'),('What day','Wednesday','Friday'),('What time / start','9 o\'clock','8.30'),('What / see','a robot','pandas'),('What / buy','a postcard','a T-shirt')],
  qs=["Where does the class go?","What day is the trip?","What time does the trip start?","What do they see?","What does {n} buy?"],
  hint=["Where does the class go?","What day is the trip?","What time does the trip start?","What do they see?","What does {n} buy?"],
  w="school trip = chuyến tham quan của trường; science museum / zoo = bảo tàng khoa học / sở thú; Wednesday / Friday = thứ Tư / thứ Sáu; start = bắt đầu; o'clock = giờ đúng; robot / pandas = người máy / gấu trúc; postcard / T-shirt = bưu thiếp / áo phông"),
'ai-t8':dict(topic='Film',
  rows=[('Name / film','The Space Dog','The Big Race'),('What / about','a dog in space','a famous horse'),('When / see it','last Saturday','yesterday'),('Who / go with','her brother','his cousins'),('Funny / sad','funny','exciting')],
  qs=["What's {n}'s film called?","What's it about?","When did {p} see it?","Who did {p} go with?","Was it funny or sad?"],
  hint=["What's {n}'s film called?","What's it about?","When did {p} see it?","Who did {p} go with?","Was it funny or sad?"],
  w="film = bộ phim; called = tên là; be about = nói về; space = vũ trụ; horse / dog = ngựa / chó; last Saturday / yesterday = thứ Bảy tuần trước / hôm qua; brother / cousins = anh em trai / anh chị em họ; funny / sad = hài hước / buồn"),
'ai-t9':dict(topic='Hotel',
  rows=[('Where','by the sea','in a forest'),('How many floors','ten','three'),('Colour','white','green'),('Breakfast time','7.30 a.m.','8 a.m.'),('Room number','fifteen','twenty-two')],
  qs=["Where is {n}'s hotel?","How many floors has it got?","What colour is it?","What time is breakfast?","What's {w} room number?"],
  hint=["Where is {n}'s hotel?","How many floors has it got?","What colour is it?","What time is breakfast?","What's {w} room number?"],
  w="hotel = khách sạn; by the sea / in a forest = cạnh biển / trong rừng; floors = tầng; white / green = trắng / xanh lá; breakfast = bữa sáng; room number = số phòng; fifteen / twenty-two = 15 / 22"),
'ai-t10':dict(topic='Hobby',
  rows=[('What / hobby','painting','chess'),('What day','Saturday','Sunday'),('Where / do it','at home','at school'),('Who / do it with','her grandma','his dad'),('What time','4 o\'clock','5 o\'clock')],
  qs=["What's {n}'s hobby?","What day does {p} do it?","Where does {p} do it?","Who does {p} do it with?","What time does {p} do it?"],
  hint=["What's {n}'s hobby?","What day does {p} do it?","Where does {p} do it?","Who does {p} do it with?","What time does {p} do it?"],
  w="hobby = sở thích; painting / chess = vẽ / cờ vua; Saturday / Sunday = thứ Bảy / Chủ nhật; at home / at school = ở nhà / ở trường; grandma / dad = bà / ba; o'clock = giờ đúng"),
'ai-t11':dict(topic='Party costume',
  rows=[('What / costume','a witch','an astronaut'),('Colour','black and purple','white and silver'),('Who / make it','her mum','his uncle'),('Where / wear it','at a school party','at the carnival'),('How much','ten pounds','twenty pounds')],
  qs=["What's {n}'s costume?","What colour is it?","Who made it?","Where does {p} wear it?","How much was it?"],
  hint=["What's {n}'s costume?","What colour is it?","Who made it?","Where does {p} wear it?","How much was it?"],
  w="costume = trang phục hóa trang; witch / astronaut = phù thủy / phi hành gia; black and purple / white and silver = đen tím / trắng bạc; make – made = làm – đã làm; mum / uncle = mẹ / chú (cậu); carnival = lễ hội hóa trang; pounds = bảng Anh"),
'ai-t12':dict(topic='Cake',
  rows=[('Colour','pink','brown'),('Who / make it','her dad','a baker'),('What / on top','strawberries','orange slices'),('How many candles','eight','twelve'),('When / party','on Sunday','on Friday')],
  qs=["What colour is {n}'s cake?","Who made it?","What's on top?","How many candles has it got?","When is the party?"],
  hint=["What colour is {n}'s cake?","Who made it?","What's on top?","How many candles has it got?","When is the party?"],
  w="cake = bánh kem; pink / brown = hồng / nâu; make – made = làm – đã làm; dad / baker = ba / thợ làm bánh; on top = ở trên cùng; strawberries / orange slices = dâu tây / lát cam; candles = nến; party = bữa tiệc"),
}
PRON={'Zoe':('she','her'),'Sam':('he','his'),'Mia':('she','her'),'Leo':('he','his'),'Kate':('she','her'),'Omar':('he','his'),'Lily':('she','her'),'Max':('he','his'),
      'Grace':('she','her'),'Ryan':('he','his'),'Hana':('she','her'),'Ali':('he','his'),'Isla':('she','her'),'Noah':('he','his'),'Poppy':('she','her'),'Finn':('he','his'),'Anna':('she','her'),'Dan':('he','his')}
fmt=lambda t,n:t.format(n=n,p=PRON[n][0],w=PRON[n][1])
for sid,c in AI.items():
  s=S[sid]; tb=s['p2tbl']; A,B=tb['a']['name'],tb['b']['name']
  tb['topic']=c['topic']
  tb['a']['rows']=[[r[0],r[1]] for r in c['rows']]; tb['b']['rows']=[[r[0],r[2]] for r in c['rows']]
  t=s['teacher']['p2']; low=c['topic'].lower()
  for who,key,idx in ((A,'examinerAsks',1),(B,'candidateAsks',2)):
    t[key]['title']=f"{who}'s {low}"
    t[key]['qa']=[[fmt(q,who),r[idx]] for q,r in zip(c['qs'],c['rows'])]
  s['hints']['p2q']=[fmt(q,B) for q in c['hint']]
  s['hints']['p2w']=c['w']

# 3) bộ có tên rõ trong dữ liệu: thay he/she bằng đại từ đúng
def pron_of(s):
  t=(s.get('teacher') or {}).get('p2')
  if not t: return None
  txt=' '.join(q for q,a in t['candidateAsks']['qa'])
  if re.search(r'\b(she|her)\b',txt): return ('she','her','her')
  if re.search(r'\b(he|his)\b',txt): return ('he','his','him')
  return None
for sid in ('ptp-t1','ptp-t2','ptp-t3','ptp-t4','ptp-t5'):
  s=S[sid]; pr=pron_of(s)
  if not pr: continue
  rep=lambda q:q.replace('he/she',pr[0]).replace('his/her',pr[1]).replace('him/her',pr[2])
  s['hints']['p2q']=[rep(q) for q in s['hints']['p2q']]
# 4) tiêu đề trong dữ liệu AI cũ còn "'s a ..."
for s in d['sets']:
  t=(s.get('teacher') or {}).get('p2')
  if t:
    for k in ('examinerAsks','candidateAsks'): t[k]['title']=re.sub(r"'s (a|an) ","'s ",t[k]['title'])
open(P,'w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=0))
print('ok')
