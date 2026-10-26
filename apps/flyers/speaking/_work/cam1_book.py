# cam1-t1/t2/t3 (Flyers 1 Authentic Examination Papers) theo "Flyers 1 Answer Booklet" (ảnh cô Thảo chụp):
# Test 1: tr.10-11, Test 2: tr.16-17, Test 3: tr.22-23. Chạy lại được.
import json
P='data.json'; d=json.load(open(P,encoding='utf8')); S={s['id']:s for s in d['sets']}
def D(b,ex,ca): return {'b':b,'w':[ex,ca]}
BOOK={
'cam1-t1':dict(
 dif=[D([.48,.42,.30,.36],'the car is blue','the car is yellow'),
      D([.21,.14,.13,.12],"there's a bat above the tent","there's a butterfly above the tent"),
      D([.84,.74,.14,.22],'the girl is wearing trousers','the girl is wearing a skirt'),
      D([.80,.61,.16,.12],'the girl is holding a torch','the girl is holding a flag'),
      D([.62,.44,.11,.14],"there's a rabbit in the car","there isn't a rabbit in the car"),
      D([.28,.40,.16,.42],'the woman is going into the tent','the woman is coming out of the tent')],
 p1=dict(example="In my picture there are two trees, but in your picture there are three.",
  items=[("In my picture, the car is blue.","In my picture, it's yellow.","What colour is the car?"),
   ("In my picture, there's a bat above the tent.","In my picture, there's a butterfly above the tent.","Is there a bat above the tent?"),
   ("In my picture, the girl's wearing trousers.","In my picture, the girl's wearing a skirt.","Is the girl wearing trousers?"),
   ("In my picture, the girl's holding a torch/flashlight.","In my picture, she's holding a flag.","What's the girl holding?"),
   ("In my picture, there's a rabbit in the car.","In my picture, there isn't a rabbit in the car.","Is there a rabbit in the car?"),
   ("In my picture, the woman's going into the tent.","In my picture, the woman's coming out of the tent.","Is the woman going into the tent?")]),
 p2=dict(intro="Mary's house and Tom's house are in this street. I don't know anything about Mary's house, but you do. So I'm going to ask you some questions.",
  A=("Mary's house",[("How many people live in Mary's house?","8 (people)"),("How old is the house?","5 years old"),("Is Mary's house big or small?","(It's) big"),("What colour is the front door?","(It's) blue"),("Where does Mary do her homework?","(in her) bedroom")]),
  B=("Tom's house",[("Is Tom's house big or small?","It's small"),("How old is the house?","100 years old"),("How many people live there?","4 people"),("Where does Tom do his homework?","in the dining room"),("What colour is the front door?","It's white")])),
 p3=dict(title="Betty's birthday party",intro="It's Betty's birthday today. Her mother's making a cake. Betty's getting some sugar for the cake. She has to stand on a chair.",
  pics=[(2,"Betty has fallen. She has hurt her leg. Betty can't walk. She's going to bed.","What has happened? What has Betty hurt? Why is Betty going to bed?"),
        (3,"She's very sad.","How is she feeling?"),
        (4,"Betty's sleeping. Her friends have come to see her.","What is Betty doing now? Who has come to see her?"),
        (5,"Betty's friends are giving her presents. Her mother's bringing the birthday cake. Everyone's enjoying the party.","What are Betty's friends giving her? What's her mother bringing? Is it a good party?")]),
 p4=dict(intro="Now, let's talk about your school.",qs=[
  ("What time do you go to school?","(at) 8 o'clock","Do you go to school at 8 o'clock?"),
  ("How do you go to school?","by bus","Do you go by bus?"),
  ("What's your favourite lesson?","English","Do you like English?"),
  ("What sports do you play at school?","football","Do you play football?"),
  ("Tell me about your best friend at school.","His/Her name's … He's/She's tall. He/She has short hair.","What's his/her name? Is he/she tall? Does he/she have short hair?")])),
'cam1-t2':dict(
 dif=[D([.72,.50,.21,.38],'there are stripes on the tent','there are spots on the tent'),
      D([.00,.46,.36,.38],'there are four planes','there are five planes'),
      D([.80,.10,.17,.38],'the man with the white hat is selling ice-cream','the man with the white hat is selling burgers'),
      D([.70,.08,.16,.15],'the elephant is behind the trees','the elephant is in front of the trees'),
      D([.48,.64,.20,.32],'the woman with the umbrella is talking to a girl','the woman with the umbrella is talking to a boy'),
      D([.30,.30,.14,.18],"there's a swan on the island","there isn't a swan on the island")],
 p1=dict(example="In my picture the camel's got a short tail, but in your picture it's got a long tail.",
  items=[("In my picture, there are stripes on the tent.","In my picture, there are spots on the tent.","Are there stripes on the tent?"),
   ("In my picture, there are four planes.","In my picture, there are five planes.","How many planes are there?"),
   ("In my picture, I can see a man with a white hat. He's selling ice-cream.","In my picture, the man with the white hat is selling burgers.","What's the man with the white hat selling?"),
   ("In my picture, the elephant is behind the trees.","In my picture, the elephant is in front of the trees.","Where's the elephant?"),
   ("In my picture, the woman with the umbrella is talking to a girl.","In my picture, the woman with the umbrella is talking to a boy.","Who's the woman with the umbrella talking to?"),
   ("In my picture, there's a swan on the island.","In my picture, there isn't a swan on the island.","Is there a swan on the island?")]),
 p2=dict(intro="Charlie and Emma get a magazine every week. I don't know anything about Charlie's magazine, but you do. So I'm going to ask you some questions.",
  A=("Charlie's magazine",[("What day does Charlie get the magazine?","(on) Tuesday"),("What's the name of the magazine?","Our Planet"),("Who buys the magazine for Charlie?","(his) mother"),("Is it expensive?","yes"),("What's it about?","animals")]),
  B=("Emma's magazine",[("What's the name of the magazine?","New Faces"),("What's it about?","music"),("Is it expensive?","No, it isn't"),("What day does Emma get the magazine?","on Friday"),("Who buys the magazine for Emma?","her father")])),
 p3=dict(title="The key",intro="Sarah and her mum have come home from the shops. Mum is looking for the front door key.",
  pics=[(2,"Mum can't find her key. Sarah's saying, 'Look! That window's open.'","Can Mum find the key? What's Sarah saying?"),
        (3,"Sarah's climbing in the window.","What's Sarah doing now?"),
        (4,"Sarah's opening the door.","And what's Sarah doing now?"),
        (5,"Mum has found the key. It was in her pocket. Sarah and her mum are laughing.","Why are they laughing?")]),
 p4=dict(intro="Now let's talk about the things you do.",qs=[
  ("What do you do in the morning before school?","have breakfast","Do you have breakfast?"),
  ("Where do you play after school?","(in the) park","Do you play in the park?"),
  ("What do you like doing at weekends?","shopping","Do you like shopping?"),
  ("What are your hobbies?","computer games","Do you play computer games?"),
  ("Tell me about the things you do in the evenings.","I watch TV. I do my homework. I go to bed at nine o'clock.","Do you watch TV? Do you do your homework? What time do you go to bed?")])),
'cam1-t3':dict(
 dif=[D([.80,.40,.16,.22],"the man's wearing red shorts","the man's wearing white shorts"),
      D([.60,.03,.22,.14],'two parrots are flying in the sky','two butterflies are flying in the sky'),
      D([.18,.42,.20,.30],'the boy in the water has got a rucksack on his back',"the boy in the water hasn't got a rucksack"),
      D([.58,.14,.38,.30],'the car doors are open','the car doors are closed'),
      D([.52,.74,.12,.12],"there's a frog in the girl's pocket","there's a mouse in the girl's pocket"),
      D([.60,.40,.14,.24],'the woman is wearing a spotted dress','the woman is wearing a striped dress')],
 p1=dict(example="In my picture there are three banana trees, but in your picture there are four.",
  items=[("In my picture, the man's wearing red shorts.","In my picture, he's wearing white shorts.","What colour are the man's shorts?"),
   ("In my picture, two parrots are flying in the sky.","In my picture, two butterflies are flying in the sky.","What's flying in the sky?"),
   ("In my picture, the boy in the water has got a rucksack on his back.","In my picture, the boy hasn't got a rucksack.","Has the boy got a rucksack on his back?"),
   ("In my picture, the car doors are open.","In my picture, the car doors are closed.","Are the car doors open?"),
   ("In my picture, there's a frog in the girl's pocket.","In my picture, there's a mouse in the girl's pocket.","What's in the girl's pocket?"),
   ("In my picture, the woman is wearing a spotted dress.","In my picture, she's wearing a striped dress.","Is the woman wearing a spotted dress?")]),
 p2=dict(intro="Betty and David go to different schools. I don't know anything about Betty's school, but you do. So I'm going to ask you some questions.",
  A=("Betty's school",[("What's the name of Betty's school?","Park School"),("What time does school start?","(at) 8.30"),("How many children study there?","500"),("What sport does Betty play there?","tennis"),("Where's the school?","(It's) near the post office")]),
  B=("David's school",[("What's the name of David's school?","Greenhill School"),("Where is it?","It's behind the cinema"),("How many children study there?","450"),("What time does school start?","at 9 o'clock"),("What sport does David play there?","basketball")])),
 p3=dict(title="Charlie and the elephant",intro="Charlie's in the garden with his mother. He's eating some fruit and his mother's reading a book.",
  pics=[(2,"Charlie can see an elephant. It's coming into the garden.","What can Charlie see?"),
        (3,"Charlie is giving the elephant a banana. The elephant likes bananas.","What is Charlie giving the elephant? Does the elephant like bananas?"),
        (4,"A man from the circus has come to get the elephant.","Who has come to the house?"),
        (5,"Charlie and his mother are watching the elephant in the circus. They're very happy.","Where are Charlie and his mother? What are they watching?")]),
 p4=dict(intro="Now let's talk about your holidays.",qs=[
  ("When do you have holidays?","(in the) summer","Do you have holidays in the summer?"),
  ("Where do you like to go on holiday?","(to the) beach","Do you like going to the beach?"),
  ("What do you like doing on holiday?","swimming","Do you like swimming?"),
  ("Who do you go on holiday with?","my family","Do you go with your family?"),
  ("Tell me about your last holiday.","We went to the mountains. I went skiing. I had fun.","Where did you go last holiday? What did you do? Did you have fun?")])),
}
for sid,B in BOOK.items():
  s=S[sid]; s['dif']=B['dif']
  s['teacher']={'p1':{'example':B['p1']['example'],'items':[{'ex':a,'cand':b,'back':c} for a,b,c in B['p1']['items']]},
    'p2':{'intro':B['p2']['intro'],'examinerAsks':{'title':B['p2']['A'][0],'qa':[list(x) for x in B['p2']['A'][1]]},
          'candidateAsks':{'title':B['p2']['B'][0],'qa':[list(x) for x in B['p2']['B'][1]]}},
    'p3':{'title':B['p3']['title'],'intro':B['p3']['intro'],'pics':[{'n':n,'say':a,'back':b} for n,a,b in B['p3']['pics']]}}
  s['hints']['p2q']=[q for q,a in B['p2']['B'][1]]
  s['story']=[B['p3']['intro']]+[a for n,a,b in B['p3']['pics']]
  s.pop('p3open',None)
  s['p4']={'intro':B['p4']['intro'],'qs':[{'q':q,'a':a,'back':b} for q,a,b in B['p4']['qs']]}
open(P,'w',encoding='utf8').write(json.dumps(d,ensure_ascii=False,indent=0))
for sid in BOOK:
  print(sid); [print('  ',i+1,c) for i,c in enumerate(S[sid]['p3c'])]
