from sethelp import *
# Collins "Pre A1 Starters" (thư mục PRE/A1 Starters Collins). Script: "Test n: Scripts for Speaking" (Teacher's script, tr.8–9 / 14–15 / 20–21);
# hình: Student's Book, Test n Speaking (scene picture + object cards). Sách chia Speaking thành 5 Part; app gộp Part 1+2 -> p1, Part 3 -> p2, Part 4 -> p3, Part 5 -> p4.
BOOK="Pre A1 Starters (Collins)"
def src(t,pages): return "%s · Test %d: Scripts for Speaking (tr.%s) · hình: Student's Book, Test %d Speaking"%(BOOK,t,pages,t)
def cardsdict(sid,items): return {k:card(sid,k,w,s) for k,w,s in items}
TS={'say':'Now look at these.','vi':'Bây giờ nhìn những thẻ này nhé.'}
BYE_={'say':'OK. Thank you, (name). Goodbye.','vi':'Được rồi. Cảm ơn em. Tạm biệt!'}
NAME='Now, (name), '
def PK(word,vi): return pick('Which is the %s?'%word,'Is this the %s? (pointing to %s)'%(word,word),'Thẻ nào là %s?'%vi,['Look at the cards. Which one is the %s?'%word,'Is this the %s?'%word])
def PL(say,zone,back,vi,h1,h2): return place(say,zone,back,vi,[h1,h2])
def YN(say,vi,h2,h1=None):  # câu Yes/No: tự do
    return Q(say,vi,['Yes / No'],'',[h1 or ('Yes or no? '+say),h2],free=True)

# ---------- Test 1 : girl's bedroom
sid='collins-t1'
s1={'id':sid,'no':18,'group':'collins','origin':'book','title':'Collins · Test 1','theme':"A girl's bedroom",'themeVi':'Phòng ngủ của bạn gái','src':src(1,'8–9'),
 'scene':{'img':'img/%s/scene.webp'%sid,'alt':"A girl's bedroom: a girl reading a book on a red bed, a doll and a teddy bear on the bed, a mirror, a basketball and a robot on a bookcase, a lamp, a girl doll on a chair, a bird in a cage by the window"},
 'hot':{'girl':R(50.5,43,12.5,27,'girl'),'mirror':R(65.5,14.7,12.3,33.6,'mirror'),'books':R(66.5,51,19,12,'books'),'doll':R(43,49.5,7.5,18,'doll'),'bird':R(3.5,23.7,7.5,7,'bird')},
 'zones':{'bed':Z(38,78,14,11,'under the bed',[45,83.5]),'ballrobot':Z(67.7,45.5,8.2,4.7,'between the ball and the robot',[71.8,47.8]),'lamp':Z(30.6,59,5.6,6,'next to the lamp',[33.4,62]),'chair':Z(4.5,62,6.5,16.5,'behind the chair',[7.7,70])},
 'cards':cardsdict(sid,[('plane','plane',"It's a plane."),('chicken','chicken',"It's a chicken."),('lemon','lemon',"It's a lemon."),('bath','bath',"It's a bath."),('rubber','rubber',"It's a rubber."),('shoe','shoe',"It's a shoe."),('elephant','elephant',"It's an elephant."),('football','football',"It's a football.")]),
 'p1':{'hello':HELLO,
  'intro':{'say':"Look at this picture. This is a girl's bedroom. The girl is reading a book.",'vi':'Nhìn bức tranh này. Đây là phòng ngủ của một bạn gái. Bạn gái đang đọc sách.'},
  'example':{'say':"Here's the girl.",'target':'girl','vi':'Đây là bạn gái. (cô chỉ vào tranh)'},
  'find':[find("Where's the mirror?",'mirror','Is this a mirror? (pointing to mirror)','Cái gương ở đâu?',['Look at the wall. Where is the mirror?','Is this a mirror?']),
          find('Where are the books?','books','Are these books? (pointing to books)','Những quyển sách ở đâu?',['Look at the bookcase. Where are the books?','Are these books?'])],
  'tableSay':TS,'order':['plane','chicken','lemon','bath','rubber','shoe','elephant','football'],
  'cardSteps':[
   step('chicken',PK('chicken','con gà'),
        PL('Now you put the chicken between the ball and the robot.','ballrobot',"Where's the chicken? It's between the ball and the robot.",'Bây giờ em đặt con gà vào giữa quả bóng và con robot.',"Look at the picture. Where are the ball and the robot?","Where's the chicken? It's between the ball and the robot."),
        demo("I'm putting the chicken under the bed.",'bed','Cô đặt con gà dưới gầm giường.')),
   step('lemon',PK('lemon','quả chanh'),
        PL('Put the lemon next to the lamp.','lamp',"Where's the lemon? It's next to the lamp.",'Đặt quả chanh bên cạnh cái đèn.',"Look at the picture. Where's the lamp?","Where's the lemon? It's next to the lamp.")),
   step('shoe',PK('shoe','chiếc giày'),
        PL('Put the shoe behind the chair.','chair',"Where's the shoe? It's behind the chair.",'Đặt chiếc giày ở phía sau cái ghế.',"Look at the picture. Where's the chair?","Where's the shoe? It's behind the chair."))]},
 'p2':[Q(NAME+"what's this?",'Đây là gì?',['(A) doll'],'Is it a doll?',['Is it a doll?','Is it a doll or a teddy bear?'],point='doll',note='Sách ghi: "Point to the doll on the bed".'),
       Q('What colour is it?','Nó màu gì?',['Pink'],'Is it pink or blue?',['Is it pink?','Is it pink or blue?'],point='doll'),
       Q('How many dolls are there?','Có bao nhiêu con búp bê?',['Two'],'Are there two or three?',['Are there two?','Are there two or three?'],point='doll'),
       Q("What's the bird doing?",'Con chim đang làm gì?',['Singing'],'Is it singing?',['Is it singing?','Is it singing or sleeping?'],point='bird'),
       Q('Tell me about the girl.','Hãy nói về bạn gái.',["She's reading a book."],"What's she doing?",["What's she doing?",'Is she reading or sleeping?'],point='girl')],
 'p3':[p3('rubber',[Q("What's this?",'Đây là gì?',['(A) rubber'],'Is it a rubber?',['Is it a rubber?','Is it a rubber or a pencil?']),
                    Q('Have you got a rubber?','Em có cục tẩy không?',['Yes / No'],'',['Yes or no? Have you got a rubber?','Have you got a pencil?'],free=True),
                    Q('What colour is it?','Nó màu gì?',['Blue','Red'],'Is it blue or red?',['Is it blue?','Is it blue or red?'],free=True,note='Sách: "Blue./Red. etc." — màu của chính cục tẩy trong thẻ là xanh dương.')]),
       p3('elephant',[Q('What is this?','Đây là gì?',['(An) elephant'],'Is it an elephant?',['Is it an elephant?','Is it an elephant or a horse?']),
                      Q('Do you like elephants?','Em có thích voi không?',['Yes / No'],'',['Yes or no? Do you like elephants?','Do you like animals?'],free=True),
                      Q("What's your favourite animal?",'Con vật em thích nhất là gì?',['A tiger','A horse'],'Do you like tigers?',['Do you like tigers?','Do you like tigers or horses?'],free=True)]),
       p3('football',[Q("What's this?",'Đây là gì?',['(A) football'],'Is it a football?',['Is it a football?','Is it a football or a basketball?'],
                        note='Sách in câu back-up "Is it a television?" cho thẻ football — có vẻ là lỗi in; app dùng "Is it a football?".',
                        check='Sách (Test 1, Part 4, thẻ football) in back-up "Is it a television?". Cô xác nhận đây là lỗi in? App đang dùng "Is it a football?" cho gợi ý.'),
                      Q('Do you play football?','Em có chơi bóng đá không?',['Yes / No'],'',['Yes or no? Do you play football?','Do you like football?'],free=True),
                      Q('What sport do you play at school?','Ở trường em chơi môn thể thao nào?',['Basketball'],'Do you play basketball?',['Do you play basketball?','Do you play basketball or tennis?'],free=True)])],
 'p4':[Q(NAME+'how old are you?','Em bao nhiêu tuổi?',['Eight'],'Are you eight, nine?',['Are you eight?','Are you eight or nine?'],free=True),
       Q('How many brothers and sisters have you got?','Em có bao nhiêu anh chị em?',['Two sisters and one brother'],'Have you got a sister / a brother?',['Have you got a sister?','Have you got a brother or a sister?'],free=True),
       Q('Is your house big or small?','Nhà em to hay nhỏ?',['Small','Big'],'Is your house big?',['Is your house big?','Is your house big or small?'],free=True)],
 'bye':BYE_}
s1['p1']['cardSteps'][2]['place']['note']='Vùng "behind the chair" đặt ở khoảng trống bên trái-sau ghế (tranh nhìn thẳng nên không có chỗ "sau" rõ ràng).'
# ---------- Test 2 : farm
sid='collins-t2'
s2={'id':sid,'no':19,'group':'collins','origin':'book','title':'Collins · Test 2','theme':'On the farm','themeVi':'Ở nông trại','src':src(2,'14–15'),
 'scene':{'img':'img/%s/scene.webp'%sid,'alt':'A farm: a man carrying carrots in a bucket, two ducks, two hens, a goat eating a flower, a sleeping dog, a boy, a horse in a stable, a bike, a cow, a sheep with a chick, a flower pot, a hen on a nest in the barn'},
 'hot':{'man':R(58.5,22.5,12,53,'man'),'sheep':R(0,71,20,29,'sheep'),'ducks':R(43.5,52,17,22,'ducks'),'bike':R(6,38,36,33,'bike'),'goat':R(63.5,69,22,27,'goat'),'dog':R(83.5,49,14,8.5,'dog')},
 'zones':{'cow':Z(7,60,10.5,7,'on the cow',[12.2,63.5]),'dog':Z(81.1,41.2,9,7.5,'next to the dog',[85.6,45]),'cowsheep':Z(13.6,69.6,9.2,5.9,'between the cow and the sheep',[18.2,72.6]),'boy':Z(84,58.5,6,11,'behind the young boy',[87,64])},
 'cards':cardsdict(sid,[('motorbike','motorbike',"It's a motorbike."),('shell','shell',"It's a shell."),('mango','mango',"It's a mango."),('guitar','guitar',"It's a guitar."),('socks','socks',"They're socks."),('television','television',"It's a television."),('car','car',"It's a car."),('doll','doll',"It's a doll.")]),
 'p1':{'hello':HELLO,
  'intro':{'say':'Look at this picture. There are some animals. The man is carrying some carrots.','vi':'Nhìn bức tranh này. Có một vài con vật. Người đàn ông đang mang mấy củ cà rốt.'},
  'example':{'say':"Here's the man.",'target':'man','vi':'Đây là người đàn ông. (cô chỉ vào tranh)'},
  'find':[find("Where's the sheep?",'sheep','Is this a sheep? (pointing to sheep)','Con cừu ở đâu?',['Look at the picture. Where is the sheep?','Is this a sheep?']),
          find('Where are the ducks?','ducks','Are these ducks? (pointing to ducks)','Những con vịt ở đâu?',['Look at the picture. Where are the ducks?','Are these ducks?'])],
  'tableSay':TS,'order':['motorbike','shell','mango','guitar','socks','television','car','doll'],
  'cardSteps':[
   step('shell',PK('shell','cái vỏ sò'),
        PL('Now you put the shell next to the dog.','dog',"Where's the shell? It's next to the dog.",'Bây giờ em đặt vỏ sò bên cạnh con chó.',"Look at the picture. Where's the dog?","Where's the shell? It's next to the dog."),
        demo("I'm putting the shell on the cow.",'cow','Cô đặt vỏ sò lên con bò.')),
   step('guitar',PK('guitar','cây đàn guitar'),
        PL('Put the guitar between the cow and the sheep.','cowsheep',"Where's the guitar? It's between the cow and the sheep.",'Đặt cây đàn guitar vào giữa con bò và con cừu.',"Look at the picture. Where are the cow and the sheep?","Where's the guitar? It's between the cow and the sheep.")),
   step('motorbike',PK('motorbike','chiếc xe máy'),
        PL('Put the motorbike behind the young boy.','boy',"Where's the motorbike? It's behind the boy.",'Đặt chiếc xe máy ở phía sau cậu bé.',"Look at the picture. Where's the boy?","Where's the motorbike? It's behind the boy."))]},
 'p2':[Q(NAME+"what's this?",'Đây là gì?',['(A) bike'],'Is it a bike?',['Is it a bike?','Is it a bike or a car?'],point='bike'),
       Q('What colour is it?','Nó màu gì?',['Orange'],'Is it orange or brown?',['Is it orange?','Is it orange or brown?'],point='bike'),
       Q('How many bikes are there?','Có bao nhiêu chiếc xe đạp?',['One'],'Is there one or two?',['Is there one?','Is there one or two?'],point='bike'),
       Q("What's the goat doing?",'Con dê đang làm gì?',['Eating'],'Is he eating?',['Is he eating?','Is he eating or sleeping?'],point='goat'),
       Q('Tell me about the dog.','Hãy nói về con chó.',["It's sleeping."],"What's it doing?",["What's it doing?",'Is it sleeping or running?'],point='dog')],
 'p3':[p3('mango',[Q("What's this?",'Đây là gì?',['(A) mango'],'Is it a mango?',['Is it a mango?','Is it a mango or an apple?']),
                   Q('Do you like mangoes?','Em có thích xoài không?',['Yes / No'],'',['Yes or no? Do you like mangoes?','Do you like fruit?'],free=True),
                   Q("What's your favourite fruit?",'Trái cây em thích nhất là gì?',['Bananas','Apples'],'Do you like mangoes?',['Do you like mangoes?','Do you like bananas or apples?'],free=True)]),
       p3('socks',[Q('What are these?','Đây là gì?',['Socks'],'Are they socks?',['Are they socks?','Are they socks or shoes?']),
                   Q('Are you wearing socks?','Em có đang đi tất không?',['Yes / No'],'',['Yes or no? Are you wearing socks?','Are you wearing shoes?'],free=True),
                   Q('What colour are your socks?','Tất của em màu gì?',['White','Blue'],'Are they white?',['Are they white?','Are they white or blue?'],free=True)]),
       p3('television',[Q("What's this?",'Đây là gì?',['(A) television'],'Is it a television?',['Is it a television?','Is it a television or a computer?']),
                        Q('Have you got a television?','Nhà em có tivi không?',['Yes / No'],'',['Yes or no? Have you got a television?','Is there a television in your house?'],free=True),
                        Q('Do you like watching television?','Em có thích xem tivi không?',['Yes / No'],'',['Yes or no? Do you like watching television?','Do you like cartoons?'],free=True)])],
 'p4':[Q(NAME+'how old are you?','Em bao nhiêu tuổi?',['Nine'],'Are you eight, nine?',['Are you eight?','Are you eight or nine?'],free=True),
       Q('Is your grandpa old or young?','Ông của em già hay trẻ?',['Old'],'Is your grandpa old?',['Is your grandpa old?','Is your grandpa old or young?'],free=True),
       Q('What colour are your eyes?','Mắt em màu gì?',['Brown','Blue','Green','Grey'],'Are your eyes blue?',['Are your eyes blue?','Are your eyes blue or brown?'],free=True),
       Q('Do you like badminton or basketball?','Em thích cầu lông hay bóng rổ?',['Badminton','Basketball'],'Do you like badminton?',['Do you like badminton?','Do you like badminton or basketball?'],free=True)],
 'bye':BYE_}
s2['p1']['cardSteps'][2]['place']['note']='Tranh nhìn thẳng nên "behind the young boy" đặt ở khoảng đất phía sau-bên trái cậu bé.'
# ---------- Test 3 : hall in a house
sid='collins-t3'
s3={'id':sid,'no':20,'group':'collins','origin':'book','title':'Collins · Test 3','theme':'A hall in a house','themeVi':'Hành lang trong nhà','src':src(3,'20–21'),
 'scene':{'img':'img/%s/scene.webp'%sid,'alt':'A hall in a house: a dog sleeping in a basket, a table with flowers and shoes under it, a mirror, a clock, a hat, a brown jacket and a blue coat on hooks, the open door of the kitchen'},
 'hot':{'dog':R(58.5,73,16,25,'dog'),'hat':R(75,22.5,5.5,11,'hat'),'flowers':R(17,42,11.5,13,'flowers'),'jacket':R(81.5,24.5,9.5,35,'brown jacket'),'shoes':R(11,78,15.5,21,'shoes')},
 'zones':{'mirror':Z(8.5,39.4,9,6.6,'under the mirror',[13,42.7]),'flowers':Z(10,47.3,6.5,11,'next to the flowers',[13.3,53]),'hatjacket':Z(77.5,32.1,5.8,12.8,'between the hat and the jacket',[80.4,38.5]),'table':Z(10.5,64.5,22,10.5,'on the table',[21.5,70])},
 'cards':cardsdict(sid,[('bus','bus',"It's a bus."),('game','game',"It's a game."),('coconut','coconut',"It's a coconut."),('sofa','sofa',"It's a sofa."),('glasses','glasses',"They're glasses."),('pencil','pencil',"It's a pencil."),('photo','photo',"It's a photo."),('onion','onion',"It's an onion.")]),
 'p1':{'hello':HELLO,
  'intro':{'say':'Look at this picture. This is a hall in a house. The door of the kitchen is open.','vi':'Nhìn bức tranh này. Đây là hành lang trong một ngôi nhà. Cửa nhà bếp đang mở.'},
  'example':{'say':"Here's the dog.",'target':'dog','vi':'Đây là con chó. (cô chỉ vào tranh)'},
  'find':[find("Where's the hat?",'hat','Is this a hat? (pointing to hat)','Cái mũ ở đâu?',['Look at the wall. Where is the hat?','Is this a hat?']),
          find('Where are the flowers?','flowers','Are these flowers? (pointing to flowers)','Những bông hoa ở đâu?',['Look at the table. Where are the flowers?','Are these flowers?'])],
  'tableSay':TS,'order':['bus','game','coconut','sofa','glasses','pencil','photo','onion'],
  'cardSteps':[
   step('onion',PK('onion','củ hành'),
        PL('Now you put the onion next to the flowers.','flowers',"Where's the onion? It's next to the flowers.",'Bây giờ em đặt củ hành bên cạnh những bông hoa.',"Look at the picture. Where are the flowers?","Where's the onion? It's next to the flowers."),
        demo("I'm putting the onion under the mirror.",'mirror','Cô đặt củ hành dưới cái gương.')),
   step('bus',PK('bus','chiếc xe buýt'),
        PL('Put the bus between the hat and the jacket.','hatjacket',"Where's the bus? It's between the hat and the jacket.",'Đặt chiếc xe buýt vào giữa cái mũ và cái áo khoác.',"Look at the wall. Where are the hat and the jacket?","Where's the bus? It's between the hat and the jacket.")),
   step('photo',PK('photo','tấm ảnh'),
        PL('Put the photo on the table.','table',"Where's the photo? It's on the table.",'Đặt tấm ảnh lên cái bàn.',"Look at the picture. Where's the table?","Where's the photo? It's on the table."))]},
 'p2':[Q(NAME+"what's this?",'Đây là gì?',['(A) jacket'],'Is it a jacket?',['Is it a jacket?','Is it a jacket or a hat?'],point='jacket',note='Sách ghi: "Point to the brown jacket". (Back-up in trong sách: "Is it a bike?" — có vẻ là lỗi in; app dùng "Is it a jacket?".)',
        check='Sách (Test 3, Part 3, câu 1) in back-up "Is it a bike?" cho cái áo khoác. Cô xác nhận đây là lỗi in? App đang dùng "Is it a jacket?" cho gợi ý.'),
       Q('What colour is it?','Nó màu gì?',['Brown'],'Is it brown or black?',['Is it brown?','Is it brown or black?'],point='jacket'),
       Q('How many jackets are there?','Có bao nhiêu cái áo khoác?',['Two'],'Is there one or two?',['Are there two?','Is there one or two?'],point='jacket'),
       Q("What's the dog doing?",'Con chó đang làm gì?',['Sleeping'],'Is he sleeping?',['Is he sleeping?','Is he sleeping or eating?'],point='dog'),
       Q('Tell me about the shoes.','Hãy nói về những đôi giày.',["They're under the table."],'Where are they?',['Where are they?','Are they under the table or on the table?'],point='shoes')],
 'p3':[p3('glasses',[Q('What are these?','Đây là gì?',['Glasses'],'Are they glasses?',['Are they glasses?','Are they glasses or shoes?']),
                     Q('Do you wear glasses?','Em có đeo kính không?',['Yes / No'],'',['Yes or no? Do you wear glasses?','Do you wear a hat?'],free=True),
                     Q('Does your dad wear glasses?','Bố em có đeo kính không?',['Yes / No'],'',['Yes or no? Does your dad wear glasses?','Does your mum wear glasses?'],free=True)]),
       p3('game',[Q('What is this?','Đây là gì?',['(A) game'],'Is it a game?',['Is it a game?','Is it a game or a book?']),
                  Q('Do you like playing games?','Em có thích chơi trò chơi không?',['Yes / No'],'',['Yes or no? Do you like playing games?','Do you like playing football?'],free=True),
                  Q('Who do you play games with?','Em chơi trò chơi với ai?',['My brother','My friend'],'Do you play games with your friend?',['Do you play games with your friend?','Do you play games with your friend or your brother?'],free=True)]),
       p3('pencil',[Q("What's this?",'Đây là gì?',['(A) pencil'],'Is it a pencil?',['Is it a pencil?','Is it a pencil or a pen?']),
                    Q('Have you got a pencil?','Em có bút chì không?',['Yes / No'],'',['Yes or no? Have you got a pencil?','Have you got a pen?'],free=True),
                    Q('What colour is your pencil?','Bút chì của em màu gì?',['Blue','Red'],'Is it blue or red?',['Is it blue?','Is it blue or red?'],free=True)])],
 'p4':[Q(NAME+'can you play tennis?','Em có biết chơi tennis không?',['Yes / No'],'',['Yes or no? Can you play tennis?','Do you like tennis?'],free=True),
       Q("What's your favourite food?",'Món ăn em thích nhất là gì?',['Chips','Ice cream'],'Is your favourite food ice cream?',['Is your favourite food ice cream?','Is your favourite food chips or ice cream?'],free=True),
       Q('How do you go to school?','Em đến trường bằng gì?',['Bus','Car','Walk'],'Do you walk to school?',['Do you walk to school?','Do you go to school by bus or by car?'],free=True)],
 'bye':BYE_}
d=load()
for s in (s1,s2,s3):add(d,s)
save(d);print('ok',len(d['sets']))
