# -*- coding: utf-8 -*-
"""Movers Speaking – 5 bộ từ YLE Practice Tests Plus Movers (2nd ed.).
Script giám khảo lấy từ bảng "Speaking frame" của Teacher's Book (đối chiếu từng dòng); hình từ Student's Book.
Quy ước: tiếng Anh trước, tiếng Việt trong ngoặc / sau dấu '='.  dif: b = ô vòng khoanh [x,y,w,h] chuẩn hoá (ước lượng từ ảnh lưới 10%), b2 = vòng riêng trên tranh của em."""
SRC = "YLE Practice Tests Plus Movers (2nd ed.) · Test {n} · script: Teacher's Book (Speaking frame) · hình: Student's Book"
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import crop_info
GROUP = ('ptp', 'Practice Tests Plus (có script)')

def S(n, title, p1, dif, p2, p2c, story, p3, p4, hints):
    return {
        'id': 'ptp-t%d' % n, 'no': n, 'group': 'ptp', 't': n, 'name': 'Practice Tests Plus · Test %d' % n, 'src': SRC.format(n=n), 'title': title,
        'teacher': {
            'p1': {'example': p1[0], 'items': [{'ex': a, 'cand': b, 'back': c} for a, b, c in p1[1]]},
            'p2': {'title': p2[0], 'intro': p2[1], 'pics': [{'n': k, 'say': s, 'back': b} for k, s, b in p2[2]]},
            'p3': {'intro': p3[0], 'sets': [{'n': i + 1, 'odd': o, 'names': nm, 'say': s, 'back': b} for i, (o, nm, s, b) in enumerate(p3[1])]},
        },
        'p4': {'intro': p4[0], 'qs': [{'q': q, 'a': a, 'back': b} for q, a, b in p4[1]]},
        'dif': [{'b': d[0], 'w': d[1], **({'b2': d[2]} if len(d) > 2 else {})} for d in dif],
        'p2c': [{'s': a, 'l': b, 'v': c, 'f': d} for a, b, c, d in p2c],
        'story': story, 'hints': hints,
        **crop_info('ptp-t%d' % n),
    }

SETS = []

# ---------------------------------------------------------------- Test 1
SETS.append(S(1, "Let's play a game",
 ("Here it's sunny but here it's cloudy.", [
   ("the girl is wearing a green sweater.", "(The girl is wearing a) yellow sweater.", "What colour is the girl's sweater?"),
   ("the dog is big / brown.", "(The dog is) small / white.", "Is the dog small / white?"),
   ("there is one tree.", "(There are) two trees.", "How many trees are there?"),
   ("there is a bird.", "(There is a) cat.", "Is there a cat?")]),
 [([.69, .10, .27, .27], ["sunny (sun)", "cloudy (clouds)"], [.55, .10, .43, .20]),
  ([.20, .42, .21, .20], ["green sweater", "yellow sweater"]),
  ([.46, .52, .40, .27], ["big brown dog", "small white dog"], [.44, .60, .28, .18]),
  ([.76, .20, .22, .34], ["one tree", "two trees"]),
  ([.37, .44, .18, .10], ["a bird", "a cat"])],
 ("Let's play a game", "It's a rainy day. Daisy and Fred can't go out to play. They aren't happy. Their mother is saying, 'Let's play a game.'", [
   (2, "Daisy and Fred start playing a game with their mum.", "What are the children doing? Who is with them?"),
   (3, "Daisy and Fred are enjoying the game. Their mum isn't enjoying it.", "Are the children happy? Is their mum enjoying the game?"),
   (4, "Their mum isn't happy. Now the children are saying, 'Let's play a game.'", "Is their mum happy? What are the children saying?")]),
 [("Daisy = Daisy; Fred = Fred; Mum = mẹ", "in the living room = trong phòng khách; on the sofa = trên ghế sofa", "stand = đứng; look at the rain = nhìn mưa; say 'Let's play a game' = nói 'Chơi trò chơi nào'", "not happy = không vui; bored = chán"),
  ("Daisy and Fred = Daisy và Fred; Mum = mẹ", "in the kitchen = trong bếp; at the table = ở bàn", "play a game = chơi trò chơi; sit at the table = ngồi ở bàn", "happy = vui"),
  ("the children = hai bạn nhỏ; Mum = mẹ", "in the kitchen = trong bếp; at the table = ở bàn", "enjoy the game = thích trò chơi; watch = xem", "happy = vui (hai bạn); not happy = không vui (mẹ)"),
  ("Mum = mẹ; the children = hai bạn nhỏ", "in the living room = trong phòng khách; on the sofa = trên ghế sofa", "sit = ngồi; stand = đứng; say = nói", "not happy = không vui")],
 ["It is a rainy day. Daisy and Fred are at home. Mum says, 'Let's play a game.'", "They play a game with Mum in the kitchen.", "The children like the game. Mum doesn't like it.", "Mum is sad. Now the children say, 'Let's play a game.'"],
 ("Here are four pictures. Which one is different? This one is different (point to the book). A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it. Now, you tell me about these pictures. Which one is different?", [
   (1, ["book = quyển sách", "lemon = quả chanh", "pineapple = quả dứa", "orange = quả cam"], "A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it.", ""),
   (3, ["watching TV = xem TV", "playing a game = chơi trò chơi", "riding bikes = đạp xe", "reading on a sofa = đọc sách trên ghế sofa"], "In this picture the children are outside but in the others they are inside.", "Where are the children here?"),
   (1, ["girl = bé gái", "dog = con chó", "fish = con cá", "cat = con mèo"], "This picture is a girl but the others are animals.", "Are these animals? Is this a girl?"),
   (4, ["nuts = hạt", "chips = khoai tây chiên", "rice = cơm", "milk = sữa"], "This picture is a drink but the others are food.", "Can you eat this? Can you drink it?")]),
 ("Now, (name), let's talk about your friends.", [
   ("How many friends have you got?", "Two", "Have you got two friends?"),
   ("What's your best friend's name?", "Mary", "Is your best friend's name Mary?"),
   ("Is he / she tall or short?", "She's tall.", "Is (Mary) tall?"),
   ("Tell me about your best friend's hobbies.", "She plays tennis, etc.", "Does he / she like playing sports? Does he / she play games?")]),
 {'p1': "sunny = có nắng; cloudy = có mây; sweater = áo len; green = xanh lá; yellow = vàng; dog = con chó; big = to; small = nhỏ; white = trắng; brown = nâu; tree = cái cây; bird = con chim; cat = con mèo",
  'p2': "rainy day = ngày mưa; play a game = chơi trò chơi; kitchen = nhà bếp; living room = phòng khách; enjoy = thích; happy = vui; sad = buồn",
  'p3': "fruit = trái cây; animal = con vật; food = đồ ăn; drink = đồ uống; inside = ở trong nhà; outside = ở ngoài trời",
  'p4': "friend = bạn; tall = cao; short = thấp; hobby = sở thích; play tennis = chơi tennis"}))

# ---------------------------------------------------------------- Test 2
SETS.append(S(2, "The birthday cake",
 ("In this picture there is a picture on the wall but in this picture there is a clock.", [
   ("the boy is not wearing glasses.", "(The boy is) wearing glasses.", "Is the boy wearing glasses?"),
   ("the boy has got straight hair.", "(The boy has got) curly hair.", "Has the boy got straight hair?"),
   ("there are three books.", "(There are) two books.", "How many books are there?"),
   ("the boy has got blue shoes.", "(The boy has got) white shoes.", "Are the boy's shoes blue?")]),
 [([.02, .16, .36, .20], ["a picture on the wall", "a clock"], [.08, .17, .26, .17]),
  ([.52, .30, .14, .08], ["no glasses", "glasses"]),
  ([.50, .25, .22, .16], ["straight hair", "curly hair"], [.45, .25, .22, .16]),
  ([.30, .44, .20, .08], ["three books", "two books"]),
  ([.48, .64, .30, .12], ["blue shoes", "white shoes"])],
 ("The birthday cake", "The family are in the kitchen. Jane and Mary are having breakfast with their mum and dad. It's their dad's birthday today and they want to give him a surprise.", [
   (2, "The girls (Jane and Mary) are making a birthday cake for their dad. Their mum is watching. She isn't happy.", "What are the girls doing? Is their mum happy?"),
   (3, "They are having a birthday party for their dad. There is food and drink on the table.", "Where are the people? What are they doing? Are they enjoying it?"),
   (4, "The girls are bringing their dad's birthday cake. Their father is very surprised.", "What are the girls doing? Is their father surprised?")]),
 [("Jane and Mary = Jane và Mary; Mum and Dad = mẹ và bố", "in the kitchen = trong bếp; at the table = ở bàn", "have breakfast = ăn sáng; talk = nói chuyện", "happy = vui"),
  ("the girls = hai bạn gái; Mum = mẹ", "in the kitchen = trong bếp", "make a cake = làm bánh; watch = xem", "Mum is not happy = mẹ không vui"),
  ("the family = cả nhà; Dad = bố", "at home = ở nhà; at the table = ở bàn", "have a party = tổ chức tiệc; eat and drink = ăn và uống", "happy = vui"),
  ("the girls = hai bạn gái; Dad = bố", "in the kitchen = trong bếp", "bring the cake = mang bánh đến; look at the cake = nhìn bánh", "surprised = ngạc nhiên; happy = vui")],
 ["The family have breakfast. It is Dad's birthday today.", "Jane and Mary make a birthday cake. Mum watches. She is not happy.", "They have a birthday party for Dad. There is food and drink on the table.", "The girls bring the cake. Dad is very surprised."],
 ("Show students the first set of pictures and say: Here are four pictures. Which one is different? This one is different (point to the dog). A lime, an apple and an orange are fruit. You eat them. A dog is not a fruit. It's an animal. Now look at these pictures (show next set). Which one is different? (Why?)", [
   (3, ["lime = quả chanh xanh", "apple = quả táo", "dog = con chó", "orange = quả cam"], "A lime, an apple and an orange are fruit. You eat them. A dog is not a fruit. It's an animal.", ""),
   (3, ["playing football in the park = chơi bóng đá ở công viên", "playing football near a house = chơi bóng đá gần nhà", "reading on a bench = ngồi đọc sách trên ghế", "playing football on the beach = chơi bóng đá trên bãi biển"], "In this picture they are reading but in the others they are playing football.", "What are the children doing here?"),
   (4, ["mug = cái cốc", "glass = cái ly", "cup = cái tách", "hat = cái mũ"], "The hat is clothes but the others are things you drink out of.", "What is this? Is it a drink?"),
   (2, ["dog = con chó", "boy = bé trai", "horse = con ngựa", "tiger = con hổ"], "This is a boy but the others are animals.", "Is this an animal? Is this a boy?")]),
 ("Now, (name), let's talk about your home.", [
   ("How many people live in your house?", "Four", "Have you got two sisters?"),
   ("Where do you eat breakfast?", "(In the) kitchen", "Do you eat breakfast in the kitchen?"),
   ("Which room do you like best?", "My bedroom", ""),
   ("Tell me about your bedroom.", "It's white. It's small. It's got toys.", "Do you like your bedroom? Is it big or small? What colour are the walls?")]),
 {'p1': "picture = bức tranh; wall = bức tường; clock = đồng hồ; glasses = kính; straight hair = tóc thẳng; curly hair = tóc xoăn; book = quyển sách; shoes = giày; blue = xanh dương; white = trắng",
  'p2': "kitchen = nhà bếp; breakfast = bữa sáng; birthday = sinh nhật; make a cake = làm bánh; surprise = bất ngờ; party = bữa tiệc; food = đồ ăn; drink = đồ uống",
  'p3': "fruit = trái cây; animal = con vật; clothes = quần áo; reading = đọc sách; playing football = chơi bóng đá; drink out of = uống bằng",
  'p4': "house = ngôi nhà; kitchen = nhà bếp; bedroom = phòng ngủ; room = căn phòng; toys = đồ chơi; small = nhỏ; big = to"}))

# ---------------------------------------------------------------- Test 3
SETS.append(S(3, "Charlie loses his ball",
 ("In this picture there are two windows but in this picture there is one window.", [
   ("the boy has got blond hair.", "(The boy has got) brown hair.", "Has the boy got blond hair?"),
   ("the girl is wearing a yellow sweater.", "(The girl is wearing a) purple sweater.", "Is the girl wearing a yellow sweater?"),
   ("there is a glass of orange juice.", "(There is a glass of) milk.", "Is there a glass of orange juice?"),
   ("there are five flowers.", "(There are) three flowers.", "How many flowers are there?")]),
 [([.22, .15, .50, .24], ["two windows", "one window"], [.34, .15, .30, .24]),
  ([.08, .34, .22, .12], ["blond hair", "brown hair"]),
  ([.74, .38, .24, .32], ["yellow sweater", "purple sweater"]),
  ([.54, .52, .14, .10], ["orange juice", "milk"]),
  ([.40, .45, .22, .12], ["five flowers", "three flowers"])],
 ("Charlie loses his ball", "Charlie is in the park with his dog. He's kicking a ball.", [
   (2, "Charlie kicks the ball and it goes into the lake. He can't get it.", "What did Charlie do? Where is the ball? Can Charlie get his ball?"),
   (3, "The dog is swimming in the lake. He is getting the ball.", "What's the dog doing?"),
   (4, "The dog has got the ball. Charlie is happy. He is giving his dog a biscuit.", "Where is Charlie's ball now? Is Charlie happy?")]),
 [("Charlie = Charlie; the dog = con chó", "in the park = trong công viên", "kick a ball = đá bóng; play = chơi", "happy = vui"),
  ("Charlie = Charlie", "in the park = trong công viên; next to the lake = cạnh hồ", "kick the ball = đá bóng; the ball goes into the lake = bóng rơi xuống hồ", "sad = buồn; worried = lo lắng"),
  ("the dog = con chó", "in the lake = trong hồ", "swim = bơi; get the ball = lấy bóng", "happy = vui"),
  ("Charlie = Charlie; the dog = con chó", "next to the lake = cạnh hồ", "give a biscuit = cho bánh quy; hold the ball = ngậm bóng", "happy = vui")],
 ["Charlie is in the park with his dog. He kicks a ball.", "The ball goes into the lake. Charlie can't get it.", "The dog swims in the lake. He gets the ball.", "The dog has the ball. Charlie is happy. He gives his dog a biscuit."],
 ("Show students the first set of pictures and say: Here are four pictures. Which one is different? This one is different (point to the panda). A dolphin, a shark and a whale all live in the sea. A panda lives on land. Now look at these pictures (show next set). Which one is different? (Why?)", [
   (3, ["dolphin = cá heo", "shark = cá mập", "panda = gấu trúc", "whale = cá voi"], "A dolphin, a shark and a whale all live in the sea. A panda lives on land.", ""),
   (4, ["dancing = nhảy múa", "playing tennis = chơi quần vợt", "running = chạy", "sitting on a chair and reading = ngồi đọc sách trên ghế"], "In this picture she is reading / sitting down but in the others she is doing sport / standing up.", "What is the girl doing in these pictures? In this picture?"),
   (3, ["under the chair = dưới ghế", "under the chair = dưới ghế", "hat on the chair = mũ ở trên ghế", "under the chair = dưới ghế"], "In this picture the hat is on the chair but in the others the things are under the chair.", "Where are the things in these pictures?"),
   (1, ["boy eating = bạn nam đang ăn", "girl cooking = bạn nữ đang nấu ăn", "man cooking = chú đang nấu ăn", "girl making a cake = bạn nữ làm bánh"], "In this picture the boy is eating but in the others the people are cooking.", "What are the people doing? What is the boy doing?")]),
 ("Now, (name), let's talk about your room.", [
   ("Is your room big or small?", "Small", "Is your room big?"),
   ("Have you got a TV in your room?", "No", ""),
   ("Where do you do your homework?", "(At) the desk", "Do you do your homework at the desk?"),
   ("Tell me what is in your room.", "There is a bed, a chair and a desk.", "Have you got a mirror? Are there pictures on the wall?")]),
 {'p1': "window = cửa sổ; blond hair = tóc vàng; brown hair = tóc nâu; sweater = áo len; yellow = vàng; purple = tím; glass = cái ly; orange juice = nước cam; milk = sữa; flowers = bông hoa",
  'p2': "park = công viên; kick a ball = đá bóng; lake = cái hồ; swim = bơi; biscuit = bánh quy; happy = vui",
  'p3': "sea = biển; land = đất liền; sport = thể thao; sit down = ngồi xuống; stand up = đứng lên; on = ở trên; under = ở dưới; cook = nấu ăn",
  'p4': "room = căn phòng; TV = ti vi; homework = bài tập về nhà; desk = bàn học; bed = giường; chair = ghế; mirror = cái gương"}))

# ---------------------------------------------------------------- Test 4
SETS.append(S(4, "Where's Spot?",
 ("The boy is on the horse but in this picture he is next to the horse.", [
   ("the horse is brown.", "(The horse is) white and black.", "Is the horse brown?"),
   ("there are four rabbits.", "There are three rabbits.", "How many rabbits are there?"),
   ("it's raining.", "It isn't raining. / It's cloudy.", "Is it raining?"),
   ("the man has got a beard.", "The man has got a moustache.", "Has he got a beard?")]),
 [([.34, .38, .14, .14], ["boy on the horse", "boy next to the horse"], [.38, .42, .12, .16]),
  ([.30, .45, .30, .18], ["brown horse", "white and black horse"], [.30, .44, .34, .18]),
  ([.12, .58, .12, .09], ["four rabbits", "three rabbits"]),
  ([.08, .04, .85, .45], ["raining", "not raining (cloudy)"]),
  ([.80, .38, .18, .18], ["beard", "moustache"])],
 ("Where's Spot?", "It's a nice, sunny day. Mary goes out to draw a picture. She is with her dog, Spot.", [
   (2, "Mary is drawing a picture of her dog. Spot sees a cat and starts running.", "What is Mary doing? What can Spot see?"),
   (3, "Mary is looking for Spot but she can't see him.", "Who is Mary looking for? Can she see Spot?"),
   (4, "Mary finds Spot. He is sitting next to the cat. They look happy.", "Where is Spot? Is he happy?")]),
 [("Mary = Mary; Spot = Spot (con chó)", "in the park = trong công viên; on a sunny day = trong ngày nắng", "go out = đi ra ngoài; draw a picture = vẽ tranh", "happy = vui"),
  ("Mary = Mary; Spot = Spot; the cat = con mèo", "in the park = trong công viên", "draw a picture = vẽ tranh; see a cat = thấy con mèo; run = chạy", "surprised = ngạc nhiên"),
  ("Mary = Mary", "in the park = trong công viên; near the trees = gần cái cây", "look for Spot = tìm Spot; can't see = không thấy", "worried = lo lắng; sad = buồn"),
  ("Mary = Mary; Spot = Spot; the cat = con mèo", "next to the cat = cạnh con mèo", "find Spot = tìm thấy Spot; sit = ngồi", "happy = vui")],
 ["It is a sunny day. Mary goes out with her dog, Spot. She wants to draw a picture.", "Mary draws a picture of Spot. Spot sees a cat and runs.", "Mary looks for Spot. She can't see him. She is worried.", "Mary finds Spot. He is sitting next to the cat. They look happy."],
 ("Show students the first set of pictures and say: Here are four pictures. Which one is different? This one is different (point to the third boy). He is happy. The other boys have got a headache, an earache and a stomach-ache. Now look at these pictures (show next set). Which one is different? (Why?)", [
   (3, ["headache = đau đầu", "earache = đau tai", "happy boy = bạn nam vui vẻ", "stomach-ache = đau bụng"], "He is happy. The other boys have got a headache, an earache and a stomach-ache.", ""),
   (1, ["kangaroo = con chuột túi", "doctor = bác sĩ", "nurse = y tá", "policewoman = nữ cảnh sát"], "A kangaroo is an animal but the others are different jobs (a doctor, a nurse, a policewoman).", "What are their jobs? What is this?"),
   (2, ["shower = vòi sen", "bed = cái giường", "bath = bồn tắm", "toothbrush = bàn chải đánh răng"], "You find this in a bedroom but you find the others in a bathroom.", "Where can you find these? Where can you find a bed?"),
   (4, ["girl eating = bạn nữ đang ăn", "boy eating = bạn nam đang ăn", "girl eating pizza = bạn nữ ăn pizza", "boy watching TV = bạn nam xem TV"], "This boy is watching TV but the others are eating.", "What are the people doing? What is the boy doing?")]),
 ("Now, (name), let's talk about your weekends.", [
   ("What do you like to do on Sunday?", "Play games", "Do you play games?"),
   ("Who do you play with at the weekend?", "My brother", "Do you play with your friends?"),
   ("When do you do your homework?", "At night", "Do you do your homework in the morning?"),
   ("Tell me about things you like to do at weekends.", "I play football. I go shopping.", "Do you go shopping? When do you go shopping? Do you play sports? What sports do you play?")]),
 {'p1': "horse = con ngựa; next to = bên cạnh; rabbit = con thỏ; rain = mưa; cloudy = có mây; beard = râu cằm; moustache = ria mép; brown = nâu; white = trắng; black = đen",
  'p2': "sunny day = ngày nắng; draw a picture = vẽ tranh; dog = con chó; cat = con mèo; run = chạy; look for = tìm; find = tìm thấy; happy = vui; worried = lo lắng",
  'p3': "headache = đau đầu; earache = đau tai; stomach-ache = đau bụng; kangaroo = con chuột túi; doctor = bác sĩ; nurse = y tá; bedroom = phòng ngủ; bathroom = phòng tắm",
  'p4': "weekend = cuối tuần; Sunday = Chủ nhật; play games = chơi trò chơi; homework = bài tập về nhà; go shopping = đi mua sắm; football = bóng đá"}))

# ---------------------------------------------------------------- Test 5
SETS.append(S(5, "The birthday party",
 ("In this picture there are three children but in this there are four.", [
   ("the girl has got long hair.", "(The girl has got) short hair.", "Has the girl got long hair?"),
   ("there is a map.", "(There is) a window.", "Is there a map?"),
   ("the desk is blue.", "(The desk is) green.", "Is the desk blue?"),
   ("the teacher is standing.", "(The teacher is) sitting.", "Is the teacher standing?")]),
 [([.68, .42, .14, .18], ["three children", "four children"]),
  ([.58, .45, .22, .17], ["long hair", "short hair"]),
  ([.26, .10, .46, .26], ["a map", "a window"]),
  ([.26, .52, .28, .12], ["blue desk", "green desk"]),
  ([.04, .20, .34, .78], ["teacher standing", "teacher sitting"])],
 ("The birthday party", "Today Bill is going to a birthday party. He is getting dressed.", [
   (2, "Bill is very happy. He is playing games. The mum is bringing the birthday cake.", "Is Bill happy? What is he doing? What has the mum got?"),
   (3, "Bill eats the cake. He likes it a lot.", "Does he like the cake?"),
   (4, "Bill is at the doctor's. He has a stomach-ache because he ate three pieces of cake.", "Where is Bill now? Why? Is Bill happy now?")]),
 [("Bill = Bill", "in his bedroom = trong phòng ngủ", "get dressed = mặc quần áo; go to a party = đi dự tiệc", "happy = vui"),
  ("Bill = Bill; the mum = mẹ", "at the party = ở bữa tiệc", "play games = chơi trò chơi; bring a cake = mang bánh đến", "very happy = rất vui"),
  ("Bill = Bill", "at the party = ở bữa tiệc; at the table = ở bàn", "eat the cake = ăn bánh; like the cake = thích bánh", "happy = vui"),
  ("Bill = Bill; the doctor = bác sĩ", "at the doctor's = ở chỗ bác sĩ", "have a stomach-ache = đau bụng; sit = ngồi", "sad = buồn; ill = ốm")],
 ["Bill is going to a birthday party. He is getting dressed.", "Bill is happy. He plays games. Mum brings the birthday cake.", "Bill eats the cake. He likes it a lot.", "Bill is at the doctor's. He has a stomach-ache because he ate three pieces of cake."],
 ("Show students the first set of pictures and say: Here are four pictures. Which one is different? This one is different (point to the nurse). She helps people who are sick. The other pictures are of people who are ill. Now look at these pictures (show next set). Which one is different? (Why?)", [
   (3, ["boy coughing = bạn nam ho", "girl with a headache = bạn nữ đau đầu", "nurse = y tá", "girl in bed = bạn nữ nằm trên giường"], "She helps people who are sick. The other pictures are of people who are ill.", ""),
   (3, ["girl at a waterfall = bạn nữ ở thác nước", "boy fishing = bạn nam câu cá", "person in a supermarket = người ở siêu thị", "girl in the park = bạn nữ trong công viên"], "In this picture the person is indoors but the others are all outside.", "Where are the people in these pictures?"),
   (2, ["scarf under the bed = khăn dưới giường", "scarf on the sofa = khăn trên ghế sofa", "scarf under the chair = khăn dưới ghế", "scarf under the desk = khăn dưới bàn"], "In this picture, the scarf is on the sofa, but in the others it is under the bed, chair and desk.", "Where is the scarf in these pictures?"),
   (1, ["girl = bạn nữ", "boy = bạn nam", "old man = ông", "boy = bạn nam"], "This is a girl but the others are boys or men.", "Are these all pictures of men? What about this one?")]),
 ("Now, (name), let's talk about your school.", [
   ("Do you like your school?", "Yes.", "Is it a good school?"),
   ("Is your school big or small?", "It's big.", "Are there lots of students?"),
   ("How do you get to school?", "I walk.", "Do you go by bus?"),
   ("Tell me about your teacher.", "Her name is Kim. She's tall. I like her. She's nice.", "Is your teacher a man or a woman? Is he / she young or old?")]),
 {'p1': "children = các bạn nhỏ; long hair = tóc dài; short hair = tóc ngắn; map = bản đồ; window = cửa sổ; desk = bàn học; blue = xanh dương; green = xanh lá; teacher = giáo viên; standing = đang đứng; sitting = đang ngồi",
  'p2': "get dressed = mặc quần áo; birthday party = tiệc sinh nhật; cake = bánh; play games = chơi trò chơi; doctor = bác sĩ; stomach-ache = đau bụng; ate = đã ăn",
  'p3': "nurse = y tá; sick / ill = ốm; indoors = trong nhà; outside = ngoài trời; scarf = khăn quàng; under = ở dưới; on = ở trên; boy = bạn nam; girl = bạn nữ; man = đàn ông",
  'p4': "school = trường học; big = to; small = nhỏ; walk = đi bộ; by bus = bằng xe buýt; teacher = giáo viên; tall = cao; nice = tốt bụng"}))
