# Thay nội dung cam3-t1/t2/t3 (Flyers 3 Authentic Examination Papers) bằng kịch bản Speaking thật trong
# "Flyers 3 Answer Booklet" (Test 1: tr.10-11, Test 2: tr.16-17, Test 3: tr.22-23). Chạy lại được.
import json
P='data.json'; d=json.load(open(P,encoding='utf8')); S={s['id']:s for s in d['sets']}
def D(b,ex,ca,b2=None):
    r={'b':b,'w':[ex,ca]}
    if b2: r['b2']=b2
    return r
BOOK={
'cam3-t1':dict(
 dif=[D([.49,.09,.12,.30],'a small tree behind the house','a big tree behind the house'),
      D([.16,.34,.16,.26],"the boy on the snowboard isn't wearing gloves",'the boy on the snowboard is wearing gloves'),
      D([.54,.57,.19,.24],'the dog is lying in the snow','the dog is running in the snow'),
      D([.29,.23,.23,.10],'some traffic on the road','no traffic on the road'),
      D([.42,.34,.13,.25],'a girl holding a hat, wearing boots','a girl wearing trainers'),
      D([.19,.04,.20,.14],'an eagle flying on the left','an eagle flying on the right',[.84,.02,.15,.14])],
 p1=dict(example="In my picture two penguins are by the water, but in your picture there is only one penguin by the water.",
  items=[("In my picture, there's a tree behind the house. It's smaller than the house.","In my picture, the tree is bigger than the house.","Is the tree behind the house small?"),
   ("In my picture, the boy on the snowboard isn't wearing gloves.","In my picture, the boy's wearing gloves.","Is the boy on the snowboard wearing gloves?"),
   ("In my picture, the dog is lying in the snow.","In my picture, the dog's running in the snow.","What's the dog doing?"),
   ("In my picture, there's some traffic on the road.","In my picture, there's no traffic on the road.","Can you see any traffic on the road?"),
   ("In my picture, there's a girl holding a hat. She's wearing boots.","In my picture, she's wearing trainers.","What's the girl wearing?"),
   ("In my picture, there's an eagle flying in the sky. It's on the left.","In my picture, the eagle's on the right.","Where's the eagle?")]),
 p2=dict(intro="John and Daisy both go to an art class. I don't know anything about John's art class, but you do. So I'm going to ask you some questions.",
  A=("John's art class",[("What's the teacher's name?","Miss Bird"),("When is the class?","on Saturday"),("How many students are there in the class?","ten"),("Is John a good artist?","Yes, he's very good"),("What does he like painting?","people")]),
  B=("Daisy's art class",[("What's the teacher's name?","Mr Black"),("How many students are there in the class?","eight"),("When is the class?","on Friday"),("What does she like painting?","animals"),("Is she a good artist?","She's not bad")])),
 p3=dict(title="Vicky's strange day",intro="Vicky's mum is a doctor. She's saying to Vicky, 'I've got to go to work. Be quick! You're late for school!'",
  pics=[(2,"Vicky is running to her school.","What is Vicky doing?"),
        (3,"She's fallen over. She's crying because her leg hurts. A teacher is coming to help her.","Why is Vicky crying? Who's coming to help her?"),
        (4,"Now the teacher is taking Vicky to the hospital.","Where's Vicky now?"),
        (5,"Now a doctor is looking after Vicky – and the doctor is her mum! Now Vicky feels better and she's smiling.","Who is looking after Vicky? How does Vicky feel now?")],
  story=["Vicky's mum is a doctor. She says, 'I've got to go to work. Be quick! You're late for school!'","Vicky is running to her school.","She's fallen over. She's crying because her leg hurts. A teacher is coming to help her.","Now the teacher is taking Vicky to the hospital.","Now a doctor is looking after Vicky – and the doctor is her mum! Now Vicky feels better and she's smiling."]),
 p4=dict(intro="Now let's talk about your best friend.",qs=[
  ("What's your best friend's name?","He's / She's called …","Is your best friend's name …?"),
  ("Where do you see him/her?","(at) school","Do you see him/her at school?"),
  ("Is he/she tall or short?","He's / She's tall.","Is he/she tall?"),
  ("What do you like doing with your friend?","playing computer games","Do you like playing computer games with him/her?"),
  ("Tell me about your best friend's family.","He / She lives with his / her mum and dad. They live in … They've got two cats.","Who does he/she live with? / Where do they live? / Have they got any pets?")])),
'cam3-t2':dict(
 dif=[D([.59,.17,.15,.30],'the guitars on the wall are different','the guitars on the wall are the same'),
      D([.13,.43,.13,.16],'the teacher has a beard','the teacher has a moustache'),
      D([.72,.17,.14,.20],'a poster of a building on the wall','a poster of a pop star on the wall'),
      D([.58,.50,.15,.35],'the girl with the violin has a blue belt','the girl with the violin has a yellow belt'),
      D([.44,.74,.12,.13],'a laptop on the rug','a magazine on the rug'),
      D([.02,.52,.14,.42],'four children are playing instruments','five children are playing instruments')],
 p1=dict(example="In my picture the smaller drums are green, but in your picture they're red.",
  items=[("In my picture, the guitars on the wall are different.","In my picture, the guitars are the same.","Do the guitars look different?"),
   ("In my picture, the teacher has got a beard.","In my picture, he's got a moustache.","Has the teacher got a beard?"),
   ("In my picture, there's a poster of a building on the wall.","In my picture, there's a poster of a pop star on the wall.","What can you see on the poster?"),
   ("In my picture, the girl with the violin is wearing a blue belt.","In my picture, her belt is yellow.","What colour is the girl's belt?"),
   ("In my picture, there's a laptop on the rug.","In my picture, there's a magazine on the rug.","What's on the rug?"),
   ("In my picture, four children are playing instruments.","In my picture, five children are playing instruments.","How many children are playing instruments?")]),
 p2=dict(intro="Katy and Robert are friends. Their mums have just bought cars. I don't know anything about Katy's mum's car, but you do. So I'm going to ask you some questions.",
  A=("Katy's mum's car",[("What colour is the car?","silver"),("How old is it?","two years old"),("How many doors has it got?","three"),("Where's the car now?","at home"),("Was it cheap or expensive?","It was cheap")]),
  B=("Robert's mum's car",[("What colour is the car?","black"),("How many doors has it got?","five"),("How old is it?","six months old"),("Was it cheap or expensive?","It was expensive"),("Where is it now?","at the station")])),
 p3=dict(title="The goat and the coconuts",intro="Alex and Lucy want to get some coconuts. The coconut tree is very tall so Alex is bringing a chair.",
  pics=[(2,"Alex still can't get the coconuts. A goat's watching him.","Can Alex get the coconuts now? What's watching Alex?"),
        (3,"The goat's hitting the tree with its head. Some coconuts are falling.","What's the goat doing?"),
        (4,"Now Alex and Lucy have a lot of coconuts. They're very happy.","How are Alex and Lucy feeling? Why?"),
        (5,"Alex is drinking from a coconut. Lucy's eating some coconut and giving some to the goat.","What are the children doing now?")],
  story=["Alex and Lucy want to get some coconuts. The coconut tree is very tall so Alex is bringing a chair.","Alex still can't get the coconuts. A goat's watching him.","The goat's hitting the tree with its head. Some coconuts are falling.","Now Alex and Lucy have a lot of coconuts. They're very happy.","Alex is drinking from a coconut. Lucy's eating some coconut and giving some to the goat."]),
 p4=dict(intro="Now let's talk about your school.",qs=[
  ("How many children are there in your class?","thirty","Are there thirty children in your class?"),
  ("What time does school start?","(at) 7:30","Does school start at 7:30?"),
  ("What subject do you like best?","science","Do you like science best?"),
  ("What games do you play at school?","football","Do you play football at school?"),
  ("Tell me about your best friend at school.","His / Her name's … He / She sits next to me. He's / She's ten years old.","What's his/her name? / Does he/she sit next to you? / How old is he/she?")])),
'cam3-t3':dict(
 dif=[D([.74,.48,.18,.17],'a green and white umbrella','a red and white umbrella'),
      D([.16,.63,.20,.14],'the man on the towel is wearing sunglasses',"the man on the towel isn't wearing sunglasses"),
      D([.09,.80,.14,.14],'four steps down to the beach','three steps down to the beach'),
      D([.28,.48,.14,.17],'no one is sitting in the striped chair','a woman is sitting in the striped chair'),
      D([.22,.86,.09,.10],'the bin is empty','the bin is full'),
      D([.46,.50,.15,.14],'the girl in the white T-shirt is playing with a boat','the girl in the white T-shirt is making a sand castle',[.62,.50,.18,.16])],
 p1=dict(example="In my picture, the helicopter is on the hill but in your picture it's in the air.",
  items=[("In my picture, the umbrella's green and white.","In my picture, the umbrella's red and white.","What colour is the umbrella?"),
   ("In my picture, there's a man lying on a towel. He's wearing sunglasses.","In my picture, the man isn't wearing sunglasses.","Is the man on the towel wearing sunglasses?"),
   ("In my picture, there are four steps down to the beach.","In my picture, there are three steps.","How many steps are there down to the beach?"),
   ("In my picture, no one is sitting in the striped chair.","In my picture, a woman is sitting in the striped chair.","Is someone sitting in the striped chair?"),
   ("In my picture, the bin's empty.","In my picture, the bin's full.","Is the bin empty?"),
   ("In my picture, the girl in the white T-shirt is playing with a boat.","In my picture, she's making a sand castle.","What's the girl in the white T-shirt doing?")]),
 p2=dict(intro="Robert and Emma both live in apartments. I don't know anything about Robert's apartment, but you do. So I'm going to ask you some questions.",
  A=("Robert's apartment",[("How many bedrooms has Robert's apartment got?","three"),("What colour is the kitchen?","blue"),("Where is the apartment?","in Winter Street"),("Which floor is it on?","on the fourth floor"),("Has Robert's apartment got a balcony?","Yes, it has")]),
  B=("Emma's apartment",[("Where is Emma's apartment?","in River Road"),("Which floor is it on?","on the fifth floor"),("How many bedrooms has the apartment got?","four"),("What colour is the kitchen?","yellow"),("Has Emma's apartment got a balcony?","No, it hasn't")])),
 p3=dict(title="A frog goes to school",intro="Charlie is walking to school. He can see a frog. The frog is jumping into his pocket. Charlie is going to take the frog to school.",
  pics=[(2,"Charlie is in his classroom now. The teacher has seen the frog. She's saying, 'Put that frog outside!'","Where's Charlie now? What's the teacher saying?"),
        (3,"The frog's outside the school now. It's sad. It's waiting for Charlie.","Where's the frog now? Why is it sad?"),
        (4,"Charlie's coming out of school. The frog's jumping into his pocket again.","Has school finished? What's the frog doing?"),
        (5,"Charlie's going home. The frog's on the lake. Charlie's saying, 'Goodbye, frog!'","Where's Charlie going? What's he saying?")],
  story=["Charlie is walking to school. He can see a frog. The frog is jumping into his pocket. Charlie is going to take the frog to school.","Charlie is in his classroom now. The teacher has seen the frog. She's saying, 'Put that frog outside!'","The frog's outside the school now. It's sad. It's waiting for Charlie.","Charlie's coming out of school. The frog's jumping into his pocket again.","Charlie's going home. The frog's on the lake. Charlie's saying, 'Goodbye, frog!'"]),
 p4=dict(intro="Now let's talk about holidays.",qs=[
  ("When do you have holidays?","(in the) summer","Do you have holidays in the summer?"),
  ("Where do you like going on holiday?","(to) the beach","Do you like going to the beach?"),
  ("Who do you go on holiday with?","my family","Do you go with your family?"),
  ("What weather do you like on holiday?","sunny weather","Do you like sunny weather?"),
  ("Tell me about what you do on holiday.","We go swimming. We eat in restaurants. We go shopping.","Do you go swimming? / Do you eat in restaurants? / Do you go shopping?")])),
}
for sid,B in BOOK.items():
  s=S[sid]
  s['dif']=B['dif']
  t={'p1':{'example':B['p1']['example'],'items':[{'ex':a,'cand':b,'back':c} for a,b,c in B['p1']['items']]},
     'p2':{'intro':B['p2']['intro'],
           'examinerAsks':{'title':B['p2']['A'][0],'qa':[list(x) for x in B['p2']['A'][1]]},
           'candidateAsks':{'title':B['p2']['B'][0],'qa':[list(x) for x in B['p2']['B'][1]]}},
     'p3':{'title':B['p3']['title'],'intro':B['p3']['intro'],'pics':[{'n':n,'say':a,'back':b} for n,a,b in B['p3']['pics']]}}
  s['teacher']=t
  s['hints']['p2q']=[q for q,a in B['p2']['B'][1]]
  s['story']=B['p3']['story']
  s.pop('p3open',None)
  s['p4']={'intro':B['p4']['intro'],'qs':[{'q':q,'a':a,'back':b} for q,a,b in B['p4']['qs']]}
# chỉnh nhỏ gợi ý Part 3 cho khớp truyện
S['cam3-t1']['p3c'][2]['v']='cry = khóc; fall down = ngã; hold her leg = ôm chân; come out = đi ra'
S['cam3-t2']['p3c'][2]['v']='hit the tree = húc vào cây; fall = rơi; watch = nhìn'
S['cam3-t3']['p3c'][2]['f']='sad = buồn'
open(P,'w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=0))
print('ok')
