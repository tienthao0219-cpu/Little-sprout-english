# -*- coding: utf-8 -*-
"""Movers Speaking – Cambridge Authentic Examination Papers Movers 2 (Tests 1–3). Script: Answer Booklet; hình: Student's Book."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import S2
GROUP = ('auth', 'Cambridge Authentic Papers')
SRC = "Cambridge Young Learners Authentic Examination Papers Movers 2 · Test {n} · script: Answer Booklet · hình: Student's Book"
NOTE = "Part 1: sách chỉ liệt kê 4 điểm khác; câu mẫu do Claude viết theo danh sách đó. Part 2: câu hỏi gợi ý từng tranh do Claude soạn theo câu hỏi chung của sách. Part 3: tranh khác loại và lý do mẫu suy từ câu hỏi gợi ý của sách."
P3DEMO = "Now look at these four pictures. One is different. The book is different. A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it. Now you tell me about these pictures. Which one is different? (Why?)"
BOOK = (3, "A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it.", "")
SETS = []

SETS.append(S2('m2-t1', 0, 'auth', 'Authentic 2 · Test 1', SRC.format(n=1), "Clare's birthday",
 ("Here there are two cows, but here there are three cows.", [
   ("In my picture the bus is yellow.", "(In your picture the bus is) red.", "Here the bus is yellow, but here …"),
   ("In my picture the man is standing under the tree.", "(In your picture the man is) sitting under the tree.", "Here the man is standing, but here …"),
   ("In my picture there is a book.", "(In your picture there is a) scarf.", "Here there is a book, but here …"),
   ("In my picture it's cloudy.", "(In your picture it's) sunny.", "Here it's cloudy, but here …")]),
 [([.74, .26, .26, .16], ["two cows", "three cows"], [.60, .26, .38, .16]),
  ([.14, .30, .84, .60], ["yellow bus", "red bus"]),
  ([.04, .28, .20, .26], ["man standing under the tree", "man sitting under the tree"], [.04, .40, .20, .16]),
  ([.00, .68, .16, .12], ["a book", "a scarf"], [.00, .74, .16, .14]),
  ([.40, .02, .40, .16], ["cloudy", "sunny"], [.68, .00, .18, .12])],
 ("Clare's birthday", "It's Clare's birthday today. She's coming home from school. She's thinking about all her presents.", [
   (2, "Clare's at home now. There aren't any presents. She's sad.", "Where is Clare now? Are there any presents? How does she feel?"),
   (3, "All Clare's friends are in the living room. Clare's very surprised.", "Who is in the living room? How does Clare feel?"),
   (4, "Clare's with her friends. She's got lots of presents. She's very happy.", "Who is Clare with? What has she got? Is she happy?")]),
 ["It is Clare's birthday. She is coming home from school. She is thinking about her presents.", "Clare is at home now. There aren't any presents. She is sad.", "Clare's friends are in the living room. Clare is very surprised.", "Clare is with her friends. She has got lots of presents. She is very happy."],
 (P3DEMO, [BOOK,
   (2, "A penguin is black and white but the others are brown.", "What colour are these animals? (brown) And this? (black)"),
   (4, "This girl is sitting but the others are washing.", "What are these people doing? (washing) And this girl? (sitting)"),
   (3, "This boy is outside but the others are inside.", "Where are these people? (inside) And this boy? (outside)")]),
 ("Now let's talk about hobbies and sports.", [
   ("When do you play computer games?", "after school", "Do you play computer games after school?"),
   ("What do you like reading?", "comics", "Do you like reading comics?"),
   ("Where do you watch television?", "(in the) living room", "Do you watch television in the living room?"),
   ("Tell me about your favourite sport.", "I like football. I play with my friends.", "What sport do you like? Who do you play with?")]),
 {'p1': "cow = con bò; bus = xe buýt; yellow = vàng; red = đỏ; man = người đàn ông; standing = đang đứng; sitting = đang ngồi; under the tree = dưới gốc cây; book = quyển sách; scarf = khăn quàng; cloudy = có mây; sunny = có nắng",
  'p2': "birthday = sinh nhật; present = món quà; at home = ở nhà; living room = phòng khách; friends = bạn bè; surprised = ngạc nhiên; sad = buồn; happy = vui",
  'p3': "colour = màu sắc; brown = nâu; black = đen; penguin = chim cánh cụt; washing = đang rửa; sitting = đang ngồi; inside = trong nhà; outside = ngoài trời",
  'p4': "computer games = trò chơi điện tử; after school = sau giờ học; comics = truyện tranh; television = ti vi; favourite sport = môn thể thao yêu thích; football = bóng đá"},
 note=NOTE))

SETS.append(S2('m2-t2', 0, 'auth', 'Authentic 2 · Test 2', SRC.format(n=2), "Fred and the tiger",
 ("This lake is blue, but this lake is green.", [
   ("In my picture there are two rainbows.", "(In your picture there is) one rainbow.", "Here there are two rainbows, but here …"),
   ("In my picture there is a rock.", "(In your picture there is) no rock.", "Here there is a rock, but here …"),
   ("In my picture the bear is big.", "(In your picture the bear is) small.", "Here the bear is big, but here …"),
   ("In my picture the bird is flying.", "(In your picture the bird is) sitting.", "Here the bird is flying, but here …")]),
 [([.00, .34, .70, .20], ["blue lake", "green lake"]),
  ([.00, .00, .62, .34], ["two rainbows", "one rainbow"]),
  ([.70, .64, .28, .20], ["a rock", "no rock"]),
  ([.02, .42, .30, .30], ["big bear", "small bear"]),
  ([.58, .00, .40, .20], ["bird flying", "bird sitting"], [.74, .14, .20, .18])],
 ("Fred and the tiger", "Fred's watching a film about tigers with his dad. He's saying, 'I like their big yellow eyes!'", [
   (2, "Fred's in bed now. He's sleeping, and dreaming about tigers.", "Where's Fred now? What's he dreaming about?"),
   (3, "Now Fred's awake. He can see two big yellow eyes at his window. He's saying, 'It's a tiger! Help!'", "What can Fred see? What is he saying?"),
   (4, "Dad's opening the window. The cat is coming in. Fred's laughing.", "Why is Fred laughing?")]),
 ["Fred is watching a film about tigers with his dad. He likes their big yellow eyes.", "Fred is in bed. He is sleeping and dreaming about tigers.", "Fred is awake. He can see two big yellow eyes at his window. He says, 'It's a tiger! Help!'", "Dad opens the window. The cat comes in. Fred is laughing."],
 (P3DEMO, [BOOK,
   (1, "This man is running but the others are dancing.", "What are these people doing? (dancing) And this man? (running)"),
   (2, "This is a drink but the others are food.", "These are all …? (food) And this? (drink)"),
   (3, "This is square but the others are round.", "These are all …? (round) And this? (square)")]),
 ("Now let's talk about your English lessons.", [
   ("What day do you have your English lessons?", "(on) Monday", "Do you have your English lessons on Mondays?"),
   ("Where do you have your English lessons?", "(at) school", "Do you have your English lessons at school?"),
   ("Is English difficult or easy?", "(It's) easy.", "Is English easy?"),
   ("Tell me about your English teacher.", "His / her name's … He / she gives us a lot of homework.", "What's your English teacher's name? Does he / she give you a lot of homework?")]),
 {'p1': "lake = cái hồ; blue = xanh dương; green = xanh lá; rainbow = cầu vồng; rock = hòn đá; bear = con gấu; big = to; small = nhỏ; bird = con chim; flying = đang bay; sitting = đang ngồi",
  'p2': "film = bộ phim; tiger = con hổ; yellow eyes = đôi mắt vàng; bed = giường; sleeping = đang ngủ; dreaming = đang mơ; window = cửa sổ; cat = con mèo; laugh = cười",
  'p3': "dancing = đang nhảy; running = đang chạy; food = đồ ăn; drink = đồ uống; round = hình tròn; square = hình vuông",
  'p4': "English lessons = giờ học tiếng Anh; Monday = thứ Hai; difficult = khó; easy = dễ; teacher = giáo viên; homework = bài tập về nhà"},
 note=NOTE))

SETS.append(S2('m2-t3', 0, 'auth', 'Authentic 2 · Test 3', SRC.format(n=3), "Who washed the car?",
 ("Here there are glasses, but here there are cups.", [
   ("In my picture the woman has curly hair.", "(In your picture the woman has) straight hair.", "Here the woman has curly hair, but here …"),
   ("In my picture there is a comic.", "(In your picture there is a) fan.", "Here there is a comic, but here …"),
   ("In my picture there is a rainbow.", "(In your picture there is) no rainbow.", "Here there is a rainbow, but here …"),
   ("In my picture the boy is wearing a blue sweater.", "(In your picture the boy is wearing a) red sweater.", "Here the sweater is blue, but here …")]),
 [([.82, .56, .16, .14], ["glasses", "cups"]),
  ([.12, .42, .18, .20], ["curly hair", "straight hair"]),
  ([.02, .34, .20, .10], ["a comic", "a fan"], [.03, .24, .20, .20]),
  ([.55, .06, .30, .24], ["a rainbow", "no rainbow"]),
  ([.32, .50, .30, .22], ["blue sweater", "red sweater"])],
 ("Who washed the car?", "It's a sunny day. Zoe and Charlie are playing ball. Grandpa is washing his car because it's dirty.", [
   (2, "Grandpa is hot and tired. The children are looking at him.", "Who is tired?"),
   (3, "Grandpa is sleeping now. The children are washing his car.", "What's Grandpa doing? What are the children doing?"),
   (4, "Now Grandpa is awake. His car is very clean. He's surprised.", "Why is Grandpa surprised?")]),
 ["It is a sunny day. Zoe and Charlie are playing ball. Grandpa is washing his dirty car.", "Grandpa is hot and tired. The children are looking at him.", "Grandpa is sleeping now. The children are washing his car.", "Grandpa is awake. His car is very clean. He is surprised."],
 (P3DEMO, [BOOK,
   (4, "This is yellow but the others are red.", "What colour are these? (red) And this? (yellow)"),
   (1, "This woman is going downstairs but the others are going upstairs.", "Where are these people going? (upstairs) And this woman? (downstairs)"),
   (4, "This girl is singing but the others are listening.", "What are these people doing? (listening) And this girl? (singing)")]),
 ("Now let's talk about holidays.", [
   ("Where do you like going in the holidays?", "(to the) beach", "Do you like going to the beach?"),
   ("What do you like doing in the holidays?", "swimming", "Do you like swimming?"),
   ("Who do you play with in the holidays?", "my friends", "Do you play with your friends?"),
   ("Tell me about the things you like doing in the holidays.", "I like going to see my grandparents. I like going to the cinema.", "Do you like going to see your grandparents? Do you like going to the cinema?")]),
 {'p1': "glasses = ly (cốc thủy tinh); cups = những cái tách; curly hair = tóc xoăn; straight hair = tóc thẳng; comic = truyện tranh; fan = cái quạt; rainbow = cầu vồng; sweater = áo len; blue = xanh dương; red = đỏ",
  'p2': "wash the car = rửa xe; sunny day = ngày nắng; play ball = chơi bóng; dirty = bẩn; hot = nóng; tired = mệt; sleeping = đang ngủ; clean = sạch; surprised = ngạc nhiên",
  'p3': "red = màu đỏ; yellow = màu vàng; upstairs = lên lầu; downstairs = xuống lầu; listening = đang nghe; singing = đang hát",
  'p4': "holidays = kỳ nghỉ; beach = bãi biển; swimming = bơi lội; grandparents = ông bà; cinema = rạp phim"},
 note=NOTE))
