# cam1-t1/t2/t3 (Flyers 1 Authentic Examination Papers) theo "Flyers 1 Answer Booklet" (ảnh cô Thảo chụp):
# Test 1: tr.10-11, Test 2: tr.16-17, Test 3: tr.22-23. Chạy lại được.
import json
P='data.json'; d=json.load(open(P,encoding='utf8')); S={s['id']:s for s in d['sets']}
def D(b,ex,ca,b2=None):
    r={'b':b,'w':[ex,ca]}
    if b2: r['b2']=b2
    return r
BOOK={
'cam2-t1':dict(
 dif=[D([.86,.68,.13,.25],'there are three butterflies near the flowers','there are two butterflies near the flowers'),
      D([.12,.45,.17,.35],"a man's getting off the boat","the man's getting on the boat"),
      D([.05,.51,.11,.14],'the swan is on the left','the swan is on the right',[.86,.51,.11,.14]),
      D([.38,.68,.22,.24],'the children are playing with a puppy','the children are playing with a kitten'),
      D([.87,.36,.11,.18],'the boy with blond hair is taking a photo',"the boy with blond hair isn't taking a photo"),
      D([.52,.02,.17,.22],'the leaves on the biggest tree are brown','the leaves on the biggest tree are yellow')],
 p1=dict(example="In my picture it's a cloudy day, but in your picture it's a sunny day.",
  items=[("In my picture, there are three butterflies near the flowers.","In my picture, there are two butterflies near the flowers.","How many butterflies are there?"),
   ("In my picture, a man's getting off the boat.","In my picture, he's getting on the boat.","Is the man getting off the boat?"),
   ("In my picture, I can see a swan on the left.","In my picture, the swan's on the right.","Is the swan on the left?"),
   ("In my picture, the children are playing with a puppy.","In my picture, the children are playing with a kitten.","Are the children playing with a puppy?"),
   ("In my picture, a boy with blond hair is sitting by the water. He's taking a photo.","In my picture, he isn't taking a photo.","Is the boy with blond hair taking a photo?"),
   ("In my picture, the leaves on the biggest tree are brown.","In my picture, the leaves on the biggest tree are yellow.","What colour are the leaves on the biggest tree?")]),
 p2=dict(intro="Oliver and Helen both go to a sports club. I don't know anything about Oliver's sports club, but you do. So I'm going to ask you some questions.",
  A=("Oliver's sports club",[("Where's Oliver's sports club?","(It's in) Park Street"),("Who does he go there with?","(his) cousin"),("What does he play there?","golf"),("When does he go there?","(at) weekends"),("Is it expensive?","Yes (it is)")]),
  B=("Helen's sports club",[("Where's Helen's sports club?","It's in Long Road"),("When does she go there?","on Monday evenings"),("Who does she go with?","her sister"),("What does she play?","She plays football"),("Is it expensive?","No, it isn't")])),
 p3=dict(title="The aliens go for a ride",intro="The astronauts want to go home. Some aliens are helping them with their things. Two aliens would like to go with them in their rocket.",
  pics=[(2,"The astronauts are saying goodbye to the aliens. Two aliens are going into the rocket.","What are the astronauts doing? Where are two aliens going?"),
        (3,"Now the rocket is going up into space. The astronauts are waving to the aliens on the ground.","What are the astronauts doing?"),
        (4,"Now the astronauts are back on their planet. Lots of people have come to see them. One boy has seen the aliens inside the rocket.","Where are the astronauts now? What has the boy seen?"),
        (5,"Now the astronauts have seen the two aliens. They are very surprised.","What have the astronauts seen? How do they feel?")]),
 p4=dict(intro="Now let's talk about your mornings.",qs=[
  ("What time do you wake up?","(at) 6.30","Do you wake up at 6.30?"),
  ("What do you do first?","I have a shower.","Do you have a shower?"),
  ("What do you have for breakfast?","cereal","Do you have cereal for breakfast?"),
  ("How do you go to school?","(by) car","Do you go to school by car?"),
  ("Tell me about your lunch.","I go home for lunch. I have lunch with my mum. I usually have a sandwich and a drink.","Where do you have lunch? Who do you have lunch with? What do you usually have to eat?")])),
'cam2-t2':dict(
 dif=[D([.10,.19,.12,.17],"there's a boy at the window","there's a girl at the window"),
      D([.86,.17,.13,.20],"there's a photo of a butterfly on the wall","there's a photo of a swan on the wall"),
      D([.46,.32,.18,.28],'the old man is reading a letter','the old man is reading a newspaper',[.43,.32,.18,.28]),
      D([.66,.47,.32,.16],'there are no knives and forks on the green table','there are some knives and forks on the green table'),
      D([.71,.82,.15,.12],'I can see some money on the floor',"there isn't any money on the floor"),
      D([.01,.02,.38,.10],'some windows are open','all the windows are closed')],
 p1=dict(example="In my picture there are two children under the blue table, but in your picture there's only one child.",
  items=[("In my picture, there's a boy at the window.","In my picture, there's a girl at the window.","Is there a boy at the window?"),
   ("In my picture, there's a photo of a butterfly on the wall.","In my picture, there's a photo of a swan on the wall.","Is there a photo of a butterfly on the wall?"),
   ("In my picture, the old man is reading a letter.","In my picture, the old man is reading a newspaper.","What's the old man reading?"),
   ("In my picture, there are no knives and forks on the green table.","In my picture, there are some knives and forks on the green table.","Are there any knives and forks on the green table?"),
   ("In my picture, I can see some money on the floor.","In my picture, there isn't any money on the floor.","Can you see any money on the floor?"),
   ("In my picture, some windows are open.","In my picture, all the windows are closed.","Are any windows open?")]),
 p2=dict(intro="Jill and Nick go to the same school. I don't know anything about Jill's favourite teacher, but you do. So I'm going to ask you some questions.",
  A=("Jill's favourite teacher",[("What's Jill's teacher's name?","Mr May"),("Where does he live?","(in) West Street"),("Is his hair long or short?","short"),("What's his hobby?","cycling"),("What subject does he teach?","history")]),
  B=("Nick's favourite teacher",[("What's her name?","She's called Miss Cave"),("What subject does she teach?","geography"),("What's her hobby?","She likes doing puzzles"),("Where does she live?","in Park Road"),("Is her hair long or short?","It's long")])),
 p3=dict(title="A very good dog",intro="Frank's dad is working in the garden, but he has lost one of his gloves. The dog has found the glove. He's bringing it to Dad.",
  pics=[(2,"Frank's putting on his shoes, but he can't find one. The dog's bringing him the shoe.","What's Frank doing? What's the dog bringing him?"),
        (3,"Mum's looking for the newspaper. The dog's bringing it to her.","What's Mum looking for? What's the dog got?"),
        (4,"Now the dog's in the garden. He's looking for his ball. Dad's got the ball.","What's the dog looking for? Who's got the ball?"),
        (5,"The family are all playing ball with the dog.","What are the family doing now?")]),
 p4=dict(intro="Now let's talk about your home.",qs=[
  ("Where do you live?","in … Street","What's the name of your street?"),
  ("Who do you live with?","my parents","Do you live with your parents?"),
  ("How many rooms are there in your home?","three","Are there three rooms?"),
  ("Where do you play?","in my bedroom","Do you play in your bedroom?"),
  ("Tell me about your living room.","It's big. It's white and brown. There's a TV in it.","Is it big or small? What colour is it? Is there a TV in it?")])),
'cam2-t3':dict(
 dif=[D([.46,.15,.28,.38],'the bridge is green','the bridge is white'),
      D([.10,.12,.18,.14],'a man in the boat near the waterfall is wearing a striped hat','a woman in the boat near the waterfall is wearing a striped hat'),
      D([.80,.02,.18,.30],'I can see three swings','I can see two swings'),
      D([.40,.19,.12,.13],'there are moons on the flags','there are stars on the flags'),
      D([.01,.84,.13,.15],"there's a swan on the left","there's a swan on the right",[.83,.82,.14,.17]),
      D([.69,.12,.12,.14],'the man under the tree is reading a newspaper',"the man under the tree isn't reading a newspaper")],
 p1=dict(example="In my picture it's sunny, but in your picture it's cloudy.",
  items=[("In my picture, the bridge is green.","In my picture, it's white.","What colour is the bridge?"),
   ("In my picture, there's a man in the boat near the waterfall. He's wearing a striped hat.","In my picture, a woman is wearing a striped hat.","Who's wearing the striped hat in the boat near the waterfall?"),
   ("In my picture, I can see three swings.","In my picture, I can see two swings.","How many swings are there?"),
   ("In my picture, there are moons on the flags.","In my picture, there are stars on the flags.","Are there moons on the flags?"),
   ("In my picture, there's a swan on the left.","In my picture, there's a swan on the right.","Is the swan on the left?"),
   ("In my picture, I can see a man under the tree. He's reading a newspaper.","In my picture, he isn't reading a newspaper.","Is the man under the tree reading a newspaper?")]),
 p2=dict(intro="William and Sarah both went on holiday last year. I don't know anything about William's holiday, but you do. So I'm going to ask you some questions.",
  A=("William's holiday",[("Who did William go on holiday with?","his grandparents"),("What was the weather like?","(It was) windy"),("When did he go?","(in) August"),("What did he buy on holiday?","trainers"),("Where did he go?","(to the) beach")]),
  B=("Sarah's holiday",[("Where did Sarah go?","She went to the mountains"),("Who did she go with?","her cousins"),("When did she go?","in January"),("What did she buy?","She bought a bracelet"),("What was the weather like?","It was sunny")])),
 p3=dict(title="Grandma and Grandpa come to help",intro="David, Emma and their mum and dad are going to have a picnic in the countryside. Grandma and Grandpa are going to stay at home.",
  pics=[(2,"David and Emma are leaving in the car with their parents. Grandma's saying, 'They have forgotten the picnic!'","Where are David and Emma? What's Grandma saying?"),
        (3,"The family have stopped in a field. Mum's saying, 'Where's our picnic?' Everyone is hungry.","What's Mum saying? Is everyone hungry?"),
        (4,"Grandma and Grandpa have arrived in their car. They have brought the picnic.","Who's arrived now? What have they brought?"),
        (5,"Everyone is eating now. They are all happy.","What are they doing now?")]),
 p4=dict(intro="Now let's talk about your city/town/village.",qs=[
  ("Where do you live?","(name of town)","Do you live in …?"),
  ("How do you go to school?","(by) car","Do you go to school by car?"),
  ("What's your favourite place in your city/town/village?","park","Do you like the park?"),
  ("Tell me about what you do at weekends in your city/town/village.","I go shopping. I go with my mum. She buys food and I buy comics.","Where do you go at weekends? Who do you go with? What do you do there?")])),
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
