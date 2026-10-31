# -*- coding: utf-8 -*-
"""Movers Speaking – Collins A1 Movers practice tests (Tests 1–3). Script: Teacher's Guide (Scripts for Speaking); hình: sách bài thi."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import S2
GROUP = ('col', 'Collins A1 Movers (có script)')
SRC = "Collins A1 Movers practice tests · Test {n} · script: Teacher's Guide (Scripts for Speaking) · hình: sách bài thi"
NOTE = None
SETS = []

SETS.append(S2('col-t1', 0, 'col', 'Collins · Test 1', SRC.format(n=1), "A new hat",
 ("The man in the picture on the wall here is playing football, but the man in the picture on the wall there is playing tennis.", [
   ("The boy here is wearing a red sweater.", "(The boy there is wearing a) green sweater.", "The boy here is wearing a red sweater …"),
   ("He's listening to music here.", "(But) he's reading a comic there.", "He's listening to music here …"),
   ("There's a black cat here.", "(But there's a) brown cat there.", "There's a black cat here …"),
   ("There's a camera on the desk here.", "(But there's a camera) under the desk there.", "There's a camera on the desk here …")]),
 [([.50, .05, .26, .20], ["picture on the wall: football", "picture on the wall: tennis"]),
  ([.34, .28, .26, .24], ["red sweater", "green sweater"]),
  ([.44, .28, .16, .14], ["listening to music", "reading a comic"], [.40, .32, .22, .16]),
  ([.12, .72, .20, .20], ["black cat", "brown cat"]),
  ([.70, .72, .16, .10], ["camera on the desk", "camera under the desk"], [.74, .90, .14, .08])],
 ("A new hat", "This woman is at the market. She's buying a new hat. The hat has got fruit on it. The woman is happy.", [
   (2, "The woman is in a park. She's tired. She's sitting in a chair. It's very sunny. There's a bird in the tree that is watching the woman.", "Where is the woman? Is she tired? What is she doing? What's that bird doing?"),
   (3, "The woman is sleeping. The bird is sitting on the hat. The bird is eating the fruit.", "What's the woman doing now? What's the bird doing?"),
   (4, "The woman is awake now. Her hat hasn't got any fruit on it now. She's very angry with the bird. She's shouting at the bird.", "Is the woman sleeping now? Has her hat got any fruit on it? Is the woman happy? What's she doing?")]),
 ["A woman is at the market. She is buying a new hat with fruit on it. She is happy.", "The woman is in a park. She is tired. A bird is watching her.", "The woman is sleeping. The bird is eating the fruit on her hat.", "The woman is awake. Her hat hasn't got any fruit now. She is angry. She is shouting at the bird."],
 ("Now look at these four pictures. One is different. The bed is different. You can find a toothbrush, a towel and a shower in the bathroom. But you can't find a bed there. You find a bed in the bedroom. Now you tell me about these pictures. Which one is different? Why?", [
   (3, "The bed is different. You can find a toothbrush, a towel and a shower in the bathroom. But you can't find a bed there. You find a bed in the bedroom.", ""),
   (3, "The shark is different. The shark lives in the sea. The lion, the dog and the bear don't live in the sea.", "What are these animals? Which animal do people have as a pet?"),
   (3, "The boy who is happy is different. The boy who has earache isn't happy. The boy who has a headache isn't happy. The boy who has stomach-ache isn't happy.", "Is this boy happy and well? Is he happy and well here? What's the matter with him here? And here? And here?"),
   (4, "The sandwich is different. You drink milk, juice and lemonade. You eat a sandwich.", "Which things can you drink? Which can you eat?")]),
 ("Now let's talk about your home.", [
   ("Do you live in the country or a city?", "I live in a city.", "Do you live in the country?"),
   ("How many bedrooms does your house have?", "It has three bedrooms.", "Are there two bedrooms in your house?"),
   ("What do you like doing in your living room?", "I like watching TV and playing on the computer.", "Do you like watching TV in the living room?"),
   ("Tell me about your bedroom.", "It has red walls. There's a bed and a desk in it. I like it.", "What colour are the walls of your bedroom? Is there a bed / desk? Do you like it?")]),
 {'p1': "picture on the wall = bức tranh trên tường; football = bóng đá; tennis = quần vợt; sweater = áo len; listening to music = nghe nhạc; comic = truyện tranh; cat = con mèo; camera = máy ảnh; desk = bàn học; under = ở dưới",
  'p2': "market = chợ; hat = cái mũ; fruit = trái cây; park = công viên; tired = mệt; bird = con chim; sleeping = đang ngủ; awake = tỉnh dậy; angry = tức giận; shout = la hét",
  'p3': "bathroom = phòng tắm; bedroom = phòng ngủ; shower = vòi sen; towel = khăn tắm; shark = cá mập; sea = biển; earache = đau tai; headache = đau đầu; stomach-ache = đau bụng; sandwich = bánh sandwich",
  'p4': "country = miền quê; city = thành phố; bedroom = phòng ngủ; living room = phòng khách; watching TV = xem ti vi; walls = bức tường"},
 note=NOTE))

SETS.append(S2('col-t2', 0, 'col', 'Collins · Test 2', SRC.format(n=2), "Clever Fred",
 ("This man is reading a book, but this man is sleeping.", [
   ("There's a mountain here.", "(But there's a) town there.", "There's a mountain here …"),
   ("This man is wearing his hat.", "(But this man) isn't wearing his hat.", "This man is wearing his hat …"),
   ("This girl is wearing red shoes.", "(But this girl is wearing) orange shoes.", "The girl is wearing red shoes here …"),
   ("The woman is holding a baby here.", "(But the woman is holding a) box there.", "The woman is holding a baby here …")]),
 [([.55, .44, .45, .30], ["man reading a book", "man sleeping"]),
  ([.12, .26, .62, .22], ["a mountain", "a town"]),
  ([.14, .38, .22, .16], ["man wearing his hat", "man not wearing his hat"]),
  ([.50, .66, .18, .10], ["red shoes", "orange shoes"]),
  ([.02, .48, .26, .20], ["woman holding a baby", "woman holding a box"])],
 ("Clever Fred", "It's a sunny day. The two boys are playing football next to the lake. They have a picnic too. The dog is watching the ducks in the lake.", [
   (2, "The ball is in the lake. The ducks are swimming near the ball. The boys are sad.", "Where is the ball now? Are the boys happy?"),
   (3, "The dog is going in the lake. The dog is taking the ball to the boys. The boys are watching the dog.", "What is the dog doing? What are the boys doing?"),
   (4, "One boy is holding the ball. One boy is giving the dog some food. The boys are very happy.", "Point to the boy. What's that boy doing? Point to the other boy. What's that boy doing? Are they happy?")]),
 ["It is a sunny day. Two boys are playing football next to the lake. The dog is watching the ducks.", "The ball is in the lake. The boys are sad.", "The dog is going in the lake. He is taking the ball to the boys.", "One boy is holding the ball. One boy is giving the dog some food. The boys are very happy."],
 ("Now look at these four pictures. One is different. This one is different. In these pictures, the woman is playing sports – football, tennis and basketball. But she's not playing a sport in this picture. She's sitting on a sofa and she's watching TV. Now you tell me about these pictures. Which one is different? Why?", [
   (3, "In these pictures, the woman is playing sports – football, tennis and basketball. But she's not playing a sport in this picture. She's sitting on a sofa and she's watching TV.", ""),
   (4, "The kangaroo is different. The kangaroo is an animal. The skirt, the sweater and the scarf are clothes.", "What things can you wear? Point to the kangaroo. Can you wear that?"),
   (1, "The horse is different. The horse doesn't live in the sea. The dolphin, the shark and the whale live in the sea.", "Where do these animals live? Which animals live in the sea? Which animal doesn't live in the sea?"),
   (3, "The hospital is different. You can travel in a train, a car and a bus. You can't travel in a hospital.", "Which picture is a place? Which things do we travel in?")]),
 ("Now let's talk about you and your school.", [
   ("What's your school called?", "My school is called City School.", "Is your school called City School?"),
   ("How do you get to school?", "I go by bus.", "Do you go to school by car?"),
   ("What do you do in the playground?", "I play football with my friends.", "Do you play games with your friends?"),
   ("Tell me about your teacher.", "My teacher is called Mrs Tell. She's nice. She's young and she doesn't shout very often.", "Is your teacher a man or woman? What's his / her name? Is he / she young or old? Is he / she nice? Does he / she often shout?")]),
 {'p1': "man = người đàn ông; reading a book = đọc sách; sleeping = đang ngủ; mountain = ngọn núi; town = thị trấn; hat = cái mũ; red shoes = giày đỏ; orange shoes = giày cam; baby = em bé; box = cái hộp",
  'p2': "sunny day = ngày nắng; football = bóng đá; lake = cái hồ; picnic = buổi dã ngoại; dog = con chó; duck = con vịt; ball = quả bóng; sad = buồn; happy = vui",
  'p3': "sports = thể thao; sofa = ghế sofa; watching TV = xem ti vi; kangaroo = con chuột túi; clothes = quần áo; horse = con ngựa; sea = biển; hospital = bệnh viện; travel = đi lại",
  'p4': "school = trường học; by bus = bằng xe buýt; playground = sân chơi; teacher = giáo viên; nice = tốt bụng; young = trẻ"},
 note=NOTE))

SETS.append(S2('col-t3', 0, 'col', 'Collins · Test 3', SRC.format(n=3), "Kite comes home",
 ("It's sunny here, but it's cloudy there.", [
   ("There's a waterfall here.", "(But there's a) river there.", "There's a waterfall here …"),
   ("There are lots of leaves on the trees here.", "(But there are) no leaves on the trees there.", "There are lots of leaves on the trees here …"),
   ("This man is sitting on his bike.", "(But this man is) standing next to his bike.", "This man is sitting on his bike …"),
   ("There's a woman swimming here.", "(But there's a) boy fishing there.", "There's a woman swimming here …")]),
 [([.20, .04, .16, .16], ["sunny", "cloudy"], [.05, .00, .90, .22]),
  ([.02, .30, .30, .30], ["a waterfall", "a river"]),
  ([.30, .22, .50, .30], ["lots of leaves on the trees", "no leaves on the trees"]),
  ([.46, .36, .50, .52], ["man sitting on his bike", "man standing next to his bike"]),
  ([.24, .46, .22, .10], ["woman swimming", "boy fishing"], [.00, .46, .14, .16])],
 ("Kite comes home", "The girl and the man are at the park. She is holding a blue kite. It's a very windy day. She's happy.", [
   (2, "The wind is strong. The girl loses her kite. She isn't holding the kite now. The kite is flying in the sky. The man is jumping. He is trying to catch the kite, but he can't get it. The girl is waving goodbye to her kite. She is sad.", "Where is the kite? Has the girl got the kite now? Is the wind strong? What's the girl doing? What's the man doing?"),
   (3, "The girl and the man are walking down the road. The girl is sad. The man has his arm on the girl's shoulder. He's trying to make the girl happy.", "Where are they now? What are they doing? Is the girl happy? What's the man doing?"),
   (4, "The girl and the man get home. The girl's kite is in the tree outside her house. The girl is pointing at her kite. She is very happy. The man is surprised to see the kite again.", "Where are they now? What's that in the tree? What's the girl doing? Is she happy now?")]),
 ["A girl and a man are at the park. She is holding a blue kite. It is windy.", "The girl loses her kite. The man is jumping but he can't get it. The girl is sad.", "The girl and the man are walking down the road. The man is trying to make the girl happy.", "They get home. The kite is in the tree outside the house. The girl is very happy."],
 ("Now look at these four pictures. One is different. The sweater is different because it's a thing you wear. These three pictures are all places in a town. Now you tell me about these pictures. Which one is different? Why?", [
   (2, "The sweater is different because it's a thing you wear. These three pictures are all places in a town.", ""),
   (1, "The fish is different because it's an animal. These three pictures are school things.", "Which things do you use to write or draw? Point to the fish. Do you write or draw with this?"),
   (2, "The car is different. The bird, bat and kangaroo are all animals.", "Which things can fly? Point to the car. Can this fly?"),
   (4, "The milk is different because it's a drink. These three pictures are all foods.", "What things can you eat? Point to the glass of water. Can you eat this?")]),
 ("Now let's talk about you and your hobbies.", [
   ("What hobbies do you do?", "I play tennis.", "Do you play tennis?"),
   ("How often do you do that?", "Every Saturday.", "Do you play tennis at the weekends?"),
   ("Why do you like it?", "Because it's exciting.", "Is tennis exciting?"),
   ("Tell me what hobby your best friend does.", "My best friend goes horse riding every weekend.", "What's your best friend's name? Does (friend's name) have a hobby? What is it? How often does he / she do it?")]),
 {'p1': "sunny = có nắng; cloudy = có mây; waterfall = thác nước; river = con sông; leaves = lá cây; tree = cái cây; bike = xe đạp; sitting = đang ngồi; standing = đang đứng; swimming = đang bơi; fishing = đang câu cá",
  'p2': "kite = con diều; windy = có gió; lose = làm mất; fly = bay; jump = nhảy; catch = bắt; wave goodbye = vẫy chào tạm biệt; sad = buồn; point = chỉ; surprised = ngạc nhiên",
  'p3': "sweater = áo len; places in a town = địa điểm trong thị trấn; fish = con cá; school things = đồ dùng học tập; car = xe hơi; fly = bay; milk = sữa; drink = đồ uống; food = đồ ăn",
  'p4': "hobby = sở thích; every Saturday = mỗi thứ Bảy; exciting = thú vị; best friend = bạn thân; horse riding = cưỡi ngựa"},
 note=NOTE))
