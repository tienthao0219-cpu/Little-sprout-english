# -*- coding: utf-8 -*-
"""Movers Speaking – Cambridge Authentic Examination Papers Movers 4 (Tests 1–3).
Hình: Student's Book (Speaking, Part 1–3). Sách Movers 4 KHÔNG kèm script Speaking -> script Part 1–4 do Claude soạn theo khung chuẩn Cambridge
(đối chiếu cấu trúc Authentic 1–3). Vòng khoanh Part 1 ước lượng từ ảnh. Cô kiểm tra giúp."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import S2
GROUP = ('auth', 'Cambridge Authentic Papers')
SRC = "Cambridge Young Learners Authentic Examination Papers Movers 4 · Test {n} · hình: Student's Book (sách không kèm script Speaking)"
NOTE = "Sách Movers 4 không có script Speaking: câu giám khảo, câu kể chuyện, tranh khác loại và lý do mẫu, Part 4 đều do Claude soạn theo khung Cambridge; cô kiểm tra giúp. Vòng khoanh Part 1 ước lượng từ ảnh."
P3DEMO = "Now look at these four pictures. One is different. The book is different. A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it. Now you tell me about these pictures. Which one is different? (Why?)"
BOOK = (3, "A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it.", "")
SETS = []

SETS.append(S2('m4-t1', 0, 'auth', 'Authentic 4 · Test 1', SRC.format(n=1), "Jack finds his kitten",
 ("In my picture it's sunny, but in your picture it's cloudy.", [
   ("In my picture the car is red.", "(In your picture the car is) yellow.", "Here the car is red, but here …"),
   ("In my picture there is one rabbit.", "(In your picture there are) two rabbits.", "Here there is one rabbit, but here …"),
   ("In my picture the bottle is on the blanket.", "(In your picture the bottle is) next to the basket.", "Here the bottle is on the blanket, but here …")]),
 [([.12, .00, .16, .12], ["sunny", "cloudy"], [.00, .00, 1.0, .12]),
  ([.66, .28, .34, .30], ["red car", "yellow car"]),
  ([.00, .70, .14, .24], ["one rabbit", "two rabbits"]),
  ([.46, .60, .20, .30], ["bottle on the blanket", "bottle next to the basket"])],
 ("Jack finds his kitten", "It's Jack's birthday. His mum and dad are giving him a kitten.", [
   (2, "Jack and his dad are in the garden. They can't find the kitten. Jack is worried.", "Where are Jack and his dad? Can they see the kitten?"),
   (3, "It's night. Jack is in bed. He can hear a noise.", "Where is Jack now? What can he hear?"),
   (4, "Jack is awake. His dad is at the door. The kitten is in Jack's room. Jack is happy.", "Who is at the door? Where is the kitten? Is Jack happy?")]),
 ["It is Jack's birthday. His mum and dad give him a kitten.", "Jack and his dad are in the garden. They can't find the kitten.", "It is night. Jack is in bed. He can hear a noise.", "Jack finds the kitten in his room. He is happy."],
 (P3DEMO, [BOOK,
   (2, "This girl isn't wearing a coat but the others are wearing coats or jackets.", "What are these people wearing? And this girl?"),
   (1, "This boy is watching TV but the others are playing sports.", "What are these people doing? And this boy?"),
   (4, "This is the sea but the others are in the sky.", "Where can you see these? Where can you see this?")]),
 ("Now let's talk about your family.", [
   ("How many people are there in your family?", "Four", "Are there four people in your family?"),
   ("Who do you live with?", "My mum and dad", "Do you live with your mum and dad?"),
   ("What do you do with your family at the weekend?", "We go to the park", "Do you go to the park?"),
   ("Tell me about your mother (or father).", "She's kind. She likes cooking.", "Is she kind? What does she like doing?")]),
 {'p1': "sunny = có nắng; cloudy = có mây; car = xe hơi; red = đỏ; yellow = vàng; rabbit = con thỏ; bottle = cái chai; blanket = tấm trải; basket = cái giỏ",
  'p2': "birthday = sinh nhật; kitten = mèo con; garden = khu vườn; worried = lo lắng; night = ban đêm; bed = giường; noise = tiếng động; door = cửa ra vào; happy = vui",
  'p3': "coat = áo khoác; jacket = áo khoác mỏng; watching TV = xem ti vi; sports = thể thao; sky = bầu trời; sea = biển; moon = mặt trăng; star = ngôi sao; cloud = đám mây; wave = con sóng",
  'p4': "family = gia đình; live with = sống cùng; weekend = cuối tuần; park = công viên; kind = tốt bụng; cooking = nấu ăn"},
 note=NOTE, draft=True, origin='claude'))

SETS.append(S2('m4-t2', 0, 'auth', 'Authentic 4 · Test 2', SRC.format(n=2), "Sally helps a kitten",
 ("In my picture it's sunny, but in your picture it's cloudy.", [
   ("In my picture the kite is in the sky.", "(In your picture the kite is) on the ground.", "Here the kite is in the sky, but here …"),
   ("In my picture there is a rabbit.", "(In your picture there is) no rabbit.", "Here there is a rabbit, but here …"),
   ("In my picture the blanket is blue.", "(In your picture the blanket is) yellow.", "Here the blanket is blue, but here …"),
   ("In my picture there are two trees.", "(In your picture there are) three trees.", "Here there are two trees, but here …")]),
 [([.02, .00, .16, .10], ["sunny", "cloudy"], [.00, .00, 1.0, .14]),
  ([.22, .00, .22, .20], ["kite in the sky", "kite on the ground"], [.60, .28, .24, .14]),
  ([.38, .74, .16, .14], ["a rabbit", "no rabbit"]),
  ([.50, .72, .50, .18], ["blue blanket", "yellow blanket"]),
  ([.60, .06, .32, .22], ["two trees", "three trees"])],
 ("Sally helps a kitten", "Sally and her mum are in the kitchen. Sally can hear a noise in the garden.", [
   (2, "Sally is in the garden. She can see a kitten in the tree. It can't get down.", "Where is Sally? What can she see?"),
   (3, "Sally is climbing the tree. She wants to help the kitten.", "What is Sally doing? Why?"),
   (4, "Sally has got the kitten. Her mum is bringing a bowl of food. They are happy.", "What has Sally got? What is her mum bringing?")]),
 ["Sally and her mum are in the kitchen. Sally can hear a noise.", "Sally is in the garden. She sees a kitten in the tree.", "Sally is climbing the tree. She wants to help the kitten.", "Sally has the kitten. Her mum brings a bowl of food. They are happy."],
 (P3DEMO, [BOOK,
   (2, "In this picture the people are shopping but in the others they are sitting.", "What are these people doing? And these people?"),
   (3, "This is cold but the others are hot.", "Is this food hot or cold? And this?"),
   (1, "A bed is in a bedroom but the others are in a bathroom.", "Where can you find these? And this?")]),
 ("Now let's talk about your free time.", [
   ("What do you like doing in your free time?", "Playing games", "Do you like playing games?"),
   ("Who do you play with?", "My friends", "Do you play with your friends?"),
   ("Where do you play?", "(In the) park", "Do you play in the park?"),
   ("Tell me about your favourite game.", "I like football. I play it on Sundays.", "What game do you like? When do you play it?")]),
 {'p1': "sunny = có nắng; cloudy = có mây; kite = con diều; in the sky = trên trời; on the ground = trên mặt đất; rabbit = con thỏ; blanket = tấm trải; blue = xanh dương; yellow = vàng; tree = cái cây",
  'p2': "kitchen = nhà bếp; garden = khu vườn; kitten = mèo con; tree = cái cây; climb = trèo; help = giúp đỡ; bowl = cái bát; food = đồ ăn; happy = vui",
  'p3': "shopping = đi mua sắm; sitting = đang ngồi; hot = nóng; cold = lạnh; ice cream = kem; bed = giường; bedroom = phòng ngủ; bathroom = phòng tắm",
  'p4': "free time = thời gian rảnh; playing games = chơi trò chơi; friends = bạn bè; park = công viên; favourite = yêu thích; football = bóng đá; Sunday = Chủ nhật"},
 note=NOTE, draft=True, origin='claude'))

SETS.append(S2('m4-t3', 0, 'auth', 'Authentic 4 · Test 3', SRC.format(n=3), "Charlie writes his homework",
 ("In my picture the roof is brown, but in your picture it's red.", [
   ("In my picture the man on the motorbike is wearing a yellow scarf.", "(In your picture the man is wearing a) blue jacket.", "Here the man is wearing a yellow scarf, but here …"),
   ("In my picture there are no flowers on the ground.", "(In your picture there are) flowers on the ground.", "Here there are no flowers, but here …")]),
 [([.02, .25, .80, .15], ["brown roof", "red roof"]),
  ([.60, .60, .26, .20], ["yellow scarf and orange top", "blue jacket"]),
  ([.80, .56, .18, .18], ["no flowers on the ground", "flowers on the ground"])],
 ("Charlie writes his homework", "Charlie is at the computer. He's doing his homework about the sea. He's thinking. His grandpa is next to him.", [
   (2, "Charlie and Grandpa are in a boat on the sea. Grandpa is pointing.", "Where are Charlie and Grandpa? What is Grandpa doing?"),
   (3, "They can see a whale. Charlie is taking a photo.", "What can they see? What is Charlie doing?"),
   (4, "Charlie is at home with Grandpa. He's writing his homework about the whale. They're happy.", "Where is Charlie now? What is he writing about?")]),
 ["Charlie is doing his homework about the sea. His grandpa is next to him.", "Charlie and Grandpa are in a boat on the sea. Grandpa is pointing.", "They see a whale. Charlie is taking a photo.", "Charlie is at home. He is writing his homework about the whale. They are happy."],
 (P3DEMO, [BOOK,
   (4, "This man is washing a car but the others are doing sports.", "What are these people doing? And this man?"),
   (3, "A dolphin can't fly but the others can fly.", "Which animals can fly? Which animal can't fly?"),
   (1, "In this picture the children are inside but in the others they are outside.", "Where are the children in these pictures? And in this picture?")]),
 ("Now let's talk about your friends.", [
   ("What's your best friend's name?", "Tom", "Is your best friend's name Tom?"),
   ("Where do you play with your friends?", "(At) school", "Do you play at school?"),
   ("What do you do together?", "We play football", "Do you play football?"),
   ("Tell me about your best friend.", "He's tall. He likes computer games.", "Is he tall or short? What does he like?")]),
 {'p1': "roof = mái nhà; brown = nâu; red = đỏ; motorbike = xe máy; scarf = khăn quàng; jacket = áo khoác; flowers = hoa; ground = mặt đất",
  'p2': "homework = bài tập về nhà; computer = máy tính; sea = biển; boat = con thuyền; point = chỉ; whale = cá voi; take a photo = chụp ảnh; write = viết",
  'p3': "sport = thể thao; washing a car = rửa xe; fly = bay; dolphin = cá heo; bat = con dơi; bee = con ong; inside = trong nhà; outside = ngoài trời",
  'p4': "best friend = bạn thân; play = chơi; together = cùng nhau; tall = cao; short = thấp; computer games = trò chơi điện tử"},
 note=NOTE, draft=True, origin='claude'))
