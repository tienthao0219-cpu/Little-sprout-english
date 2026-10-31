# -*- coding: utf-8 -*-
"""Movers Speaking – Cambridge Authentic Examination Papers Movers 1 (Tests 1–3).
Script: Answer Booklet (Test n Answers · Speaking); hình: Student's Book. Part 1: sách chỉ liệt kê 4 điểm khác → câu mẫu do Claude viết theo đó.
Part 3: sách không ghi sẵn tranh khác loại; tranh khác loại suy từ câu hỏi gợi ý của sách (sách chấp nhận mọi khác biệt hợp lý)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import S2
GROUP = ('auth', 'Cambridge Authentic Papers')
SRC = "Cambridge Young Learners Authentic Examination Papers Movers 1 · Test {n} · script: Answer Booklet · hình: Student's Book"
NOTE1 = "Part 1: sách chỉ liệt kê 4 điểm khác; câu mẫu do Claude viết theo danh sách đó. Part 3: tranh khác loại và lý do mẫu suy từ câu hỏi gợi ý của sách."
P3DEMO = "Now look at these four pictures. One is different. The book is different. A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it. Now you tell me about these pictures. Which one is different? (Why?)"
SETS = []

SETS.append(S2('m1-t1', 0, 'auth', 'Authentic 1 · Test 1', SRC.format(n=1), "Fred's always dirty",
 ("This is a moon, but this is a star.", [
   ("In my picture the table is round.", "(In your picture the table is) square.", "Here the table is round, but here …"),
   ("In my picture the boy's T-shirt is pink and green.", "(In your picture the boy's T-shirt is) blue and white.", "Here the T-shirt is pink and green, but here …"),
   ("In my picture there are bananas.", "(In your picture there are) no bananas.", "Here there are bananas, but here …"),
   ("In my picture the tractor is on the chair.", "(In your picture the tractor is) on the floor.", "Here the tractor is on the chair, but here …")]),
 [([.80, .06, .18, .20], ["moon", "star"]),
  ([.24, .50, .74, .22], ["round table", "square table"]),
  ([.38, .74, .38, .20], ["pink and green T-shirt", "blue and white T-shirt"]),
  ([.48, .38, .24, .18], ["bananas", "no bananas"]),
  ([.02, .52, .28, .18], ["tractor on the chair", "tractor on the floor"], [.07, .80, .24, .18])],
 ("Fred's always dirty", "Fred's playing football. He's very dirty.", [
   (2, "Fred's having a shower.", "What's Fred doing?"),
   (3, "Fred's going outside. He's saying goodbye to his mother.", "Where's Fred going now? What's Fred saying to his mother?"),
   (4, "Fred's riding his bike and he's dirty again.", "What's Fred doing now? Is Fred dirty again?")]),
 ["Fred is playing football. He is very dirty.", "Fred has a shower.", "Fred goes outside. He says goodbye to his mother.", "Fred rides his bike and he is dirty again."],
 (P3DEMO, [
   (3, "A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it.", ""),
   (1, "This is a sofa. You find it in the living room, but you find the others in the bathroom.", "Where can you find these? (bathroom) And this? (living room)"),
   (3, "This boy is getting up, but the others are sleeping.", "What are these doing? (sleeping) And this boy? (getting up)"),
   (2, "A panda can't fly but the others can fly.", "What can these do? (fly) And this? (can't fly)")]),
 ("Now let's talk about the things you like.", [
   ("What do you like eating?", "ice cream", "Do you like ice cream?"),
   ("What's your favourite animal?", "lion", "Do you like lions?"),
   ("Where do you like going at the weekends?", "cinema", "Do you like going to the cinema?"),
   ("Tell me about your hobbies.", "I like reading. I like reading in bed.", "Do you like reading? Where do you like reading?")]),
 {'p1': "table = cái bàn; round = tròn; square = vuông; T-shirt = áo phông; bananas = chuối; tractor = máy kéo; chair = cái ghế; floor = sàn nhà; moon = mặt trăng; star = ngôi sao",
  'p2': "football = bóng đá; dirty = bẩn; shower = vòi sen; go outside = đi ra ngoài; say goodbye = chào tạm biệt; ride a bike = đạp xe",
  'p3': "fruit = trái cây; sofa = ghế sofa; living room = phòng khách; bathroom = phòng tắm; sleeping = đang ngủ; getting up = thức dậy; fly = bay; panda = gấu trúc",
  'p4': "ice cream = kem; favourite = yêu thích; cinema = rạp phim; hobby = sở thích; reading = đọc sách"},
 note=NOTE1))

SETS.append(S2('m1-t2', 0, 'auth', 'Authentic 1 · Test 2', SRC.format(n=2), "Jane finds the cow",
 ("Here there are four ducks, but here there are five.", [
   ("In my picture the woman is sitting.", "(In your picture the woman is) standing.", "Here the woman is sitting, but here …"),
   ("In my picture the bears are black.", "(In your picture the bears are) brown.", "Here the bears are black, but here …"),
   ("In my picture there is a bag.", "(In your picture there is a) scarf.", "Here there is a bag, but here …"),
   ("In my picture the girl hasn't got a helmet.", "(In your picture the girl has got a) helmet.", "Here the girl hasn't got a helmet, but here …")]),
 [([.00, .50, .32, .24], ["four ducks", "five ducks"]),
  ([.44, .38, .32, .50], ["woman sitting", "woman standing"]),
  ([.15, .35, .34, .20], ["black bears", "brown bears"]),
  ([.68, .60, .20, .17], ["a bag", "a scarf"], [.66, .66, .20, .15]),
  ([.25, .54, .20, .17], ["no helmet", "a helmet"])],
 ("Jane finds the cow", "Jane's dad is a farmer. He is sad because he can't find his cow. Jane wants to look for it.", [
   (2, "Jane is looking in the field but she can't see the cow.", "Can Jane see the cow?"),
   (3, "Now she is on the road and she can see the cow outside the school.", "Where is Jane now? What can she see?"),
   (4, "The cow is in a truck now. Jane's dad is driving the truck. The children are waving.", "Where is the cow now? What are the children doing?")]),
 ["Jane's dad is sad. He can't find his cow.", "Jane looks in the field. She can't see the cow.", "Jane is on the road. She sees the cow outside the school.", "The cow is in a truck. Jane's dad is driving. The children are waving."],
 (P3DEMO, [
   (3, "A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it.", ""),
   (3, "This is a drink but the others are food.", "What are these? (food) And this? (drink)"),
   (4, "This woman is catching a ball but the others are climbing.", "What are these people doing? (climbing) And this woman? (catching)"),
   (3, "This is a kite but the others are clothes.", "What are these? (clothes) And this? (kite)")]),
 ("Now let's talk about your evenings.", [
   ("What do you eat for dinner?", "rice", "Do you eat rice?"),
   ("Who cooks your dinner?", "my dad", "Does your dad cook your dinner?"),
   ("Where do you have dinner?", "(in the) kitchen", "Do you have dinner in the kitchen?"),
   ("Tell me more about your evenings.", "I do my homework. I watch TV.", "Do you do your homework? Do you watch TV?")]),
 {'p1': "duck = con vịt; woman = người phụ nữ; sitting = đang ngồi; standing = đang đứng; bear = con gấu; black = đen; brown = nâu; bag = cái túi; scarf = khăn quàng; helmet = mũ bảo hiểm",
  'p2': "farmer = nông dân; cow = con bò; sad = buồn; field = cánh đồng; road = con đường; school = trường học; truck = xe tải; wave = vẫy tay",
  'p3': "food = đồ ăn; drink = đồ uống; climbing = leo trèo; catching = bắt (bóng); clothes = quần áo; kite = con diều",
  'p4': "dinner = bữa tối; rice = cơm; cook = nấu ăn; kitchen = nhà bếp; homework = bài tập về nhà; evening = buổi tối"},
 note=NOTE1))

SETS.append(S2('m1-t3', 0, 'auth', 'Authentic 1 · Test 3', SRC.format(n=3), "Lily loses her mouse",
 ("Here the boy is standing, but here he's swimming.", [
   ("In my picture the panda is awake.", "(In your picture the panda is) asleep.", "This panda is awake, but this panda …"),
   ("In my picture there are two rocks.", "(In your picture there are) three rocks.", "Here there are two rocks, but here …"),
   ("In my picture it's cloudy.", "(In your picture it's) sunny.", "Here it's cloudy, but here …"),
   ("In my picture the woman is taking a photo.", "(In your picture the woman is) painting a picture.", "Here the woman is taking a photo, but here …")]),
 [([.30, .66, .24, .30], ["boy standing", "boy swimming"], [.30, .80, .40, .15]),
  ([.72, .50, .22, .22], ["panda awake", "panda asleep"], [.70, .60, .30, .14]),
  ([.36, .22, .34, .08], ["two rocks", "three rocks"]),
  ([.30, .00, .40, .10], ["cloudy", "sunny"], [.18, .00, .16, .10]),
  ([.00, .44, .24, .36], ["taking a photo", "painting a picture"])],
 ("Lily loses her mouse", "Lily's got two pets - a cat and a mouse. She's saying goodbye to her pets because she's going to school.", [
   (2, "Lily can't find her mouse.", "Can Lily find her mouse?"),
   (3, "Lily's looking under the chair and her father's looking under the car, but the mouse isn't there.", "Where are they looking for the mouse?"),
   (4, "Now Lily's at school. The mouse is in her school bag. Lily's laughing.", "Is Lily at school now? What's in her bag?")]),
 ["Lily has two pets, a cat and a mouse. She says goodbye because she goes to school.", "Lily can't find her mouse.", "Lily and her father look under the chair and under the car. The mouse isn't there.", "Lily is at school. The mouse is in her school bag. Lily is laughing."],
 (P3DEMO, [
   (3, "A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it.", ""),
   (2, "This is red but the others are grey.", "What colour are these? (grey) And this? (red)"),
   (3, "This is on the river but the others are on the road.", "Where are these? (road) And this? (river)"),
   (3, "A tiger lives in the forest but the others live in the sea.", "Where do these animals live? (sea) And this? (forest)")]),
 ("Now let's talk about your friends.", [
   ("Are your friends boys or girls?", "girls", "Are your friends girls?"),
   ("Where do you play with your friends?", "my house", "Do you play in your house?"),
   ("What do you do with your friends at weekends?", "go shopping", "Do you go shopping?"),
   ("Tell me about your best friend.", "His / her name's … He / she's 10.", "What's his / her name? How old is he / she?")]),
 {'p1': "panda = gấu trúc; awake = thức; asleep = ngủ; rock = hòn đá; cloudy = có mây; sunny = có nắng; take a photo = chụp ảnh; paint a picture = vẽ tranh; swimming = đang bơi; standing = đang đứng",
  'p2': "pet = thú cưng; mouse = con chuột; cat = con mèo; look for = tìm; under the chair = dưới ghế; school bag = cặp sách; laugh = cười",
  'p3': "red = màu đỏ; grey = màu xám; river = con sông; road = con đường; tiger = con hổ; forest = khu rừng; sea = biển",
  'p4': "friend = bạn; best friend = bạn thân; weekend = cuối tuần; go shopping = đi mua sắm; boys = các bạn nam; girls = các bạn nữ"},
 note=NOTE1))
