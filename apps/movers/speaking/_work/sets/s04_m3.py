# -*- coding: utf-8 -*-
"""Movers Speaking – Cambridge Authentic Examination Papers Movers 3 (Tests 1–3). Script: Answer Booklet; hình: Student's Book."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import S2
GROUP = ('auth', 'Cambridge Authentic Papers')
SRC = "Cambridge Young Learners Authentic Examination Papers Movers 3 · Test {n} · script: Answer Booklet · hình: Student's Book"
NOTE = "Part 1: sách chỉ liệt kê 4 điểm khác; câu mẫu do Claude viết theo danh sách đó. Part 3: tranh khác loại và lý do mẫu suy từ câu hỏi gợi ý của sách (sách chấp nhận mọi khác biệt hợp lý)."
P3DEMO = "Now look at these four pictures. One is different. The book is different. A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it. Now you tell me about these pictures. Which one is different? (Why?)"
def BOOK(k): return (k, "A lemon, a pineapple and an orange are fruit. You eat them. You don't eat a book. You read it.", "")
SETS = []

SETS.append(S2('m3-t1', 0, 'auth', 'Authentic 3 · Test 1', SRC.format(n=1), "Clare and the monkey",
 ("Here the woman's wearing a jacket, but here she's wearing a coat.", [
   ("In my picture there are five trees.", "(In your picture there are) four trees.", "Here there are five trees, but here …"),
   ("In my picture the helmet is purple.", "(In your picture the helmet is) red.", "Here the helmet is purple, but here …"),
   ("In my picture it's sunny.", "(In your picture it's) cloudy.", "Here it's sunny, but here …"),
   ("In my picture the girl is roller skating.", "(In your picture the girl is) running.", "Here the girl is roller skating, but here …")]),
 [([.04, .38, .24, .56], ["jacket", "coat"]),
  ([.00, .08, .45, .35], ["five trees", "four trees"]),
  ([.76, .56, .20, .14], ["purple helmet", "red helmet"]),
  ([.82, .00, .16, .12], ["sunny", "cloudy"], [.00, .00, 1.0, .14]),
  ([.30, .28, .30, .16], ["girl roller skating", "girl running"])],
 ("Clare and the monkey", "Clare is having fun on the beach. She's reading a comic. A monkey is looking at her baseball cap.", [
   (2, "Clare's in the sea now. The monkey is taking Clare's baseball cap.", "Where's Clare now? What's the monkey taking?"),
   (3, "The monkey is wearing the baseball cap. Clare's giving the monkey a banana.", "What's the monkey wearing? What is Clare doing now?"),
   (4, "The monkey is eating the banana. Clare and the monkey are happy.", "What is the monkey doing? Are Clare and the monkey happy now?")]),
 ["Clare is on the beach. She is reading a comic. A monkey is looking at her baseball cap.", "Clare is in the sea. The monkey is taking her baseball cap.", "The monkey is wearing the baseball cap. Clare is giving the monkey a banana.", "The monkey is eating the banana. Clare and the monkey are happy."],
 (P3DEMO, [BOOK(3),
   (3, "This is a hospital but the others are in a circus.", "Where are these people? (in a circus) And this person? (in a hospital)"),
   (1, "This boy is washing but the others are doing sports.", "What are these people doing? (sports) And this person? (washing)"),
   (3, "A cat can't fly but the others can fly.", "These animals can …? (fly) And this animal …? (can't fly)")]),
 ("Now let's talk about school.", [
   ("How do you travel to school in the morning?", "on the bus", "Do you go on the bus?"),
   ("Who do you talk to at school?", "my friends", "Do you talk to your friends?"),
   ("What do you like doing at school?", "reading", "Do you like reading at school?"),
   ("Tell me about your school.", "My school is big. We've got a playground. There are twenty children in my class.", "Is your school big? Has your school got a playground? How many children are there in your class?")]),
 {'p1': "jacket = áo khoác mỏng; coat = áo khoác dày; tree = cái cây; helmet = mũ bảo hiểm; purple = tím; red = đỏ; sunny = có nắng; cloudy = có mây; roller skating = trượt patin; running = đang chạy",
  'p2': "beach = bãi biển; monkey = con khỉ; baseball cap = mũ lưỡi trai; sea = biển; banana = quả chuối; take = lấy; wear = đội, mặc; eat = ăn; happy = vui",
  'p3': "circus = rạp xiếc; hospital = bệnh viện; sports = thể thao; washing = đang rửa; fly = bay; cat = con mèo",
  'p4': "school = trường học; bus = xe buýt; friends = bạn bè; reading = đọc sách; playground = sân chơi; class = lớp học"},
 note=NOTE))

SETS.append(S2('m3-t2', 0, 'auth', 'Authentic 3 · Test 2', SRC.format(n=2), "Don't worry! I've got a map!",
 ("This sun is small, but this sun is big.", [
   ("In my picture there is a dolphin.", "(In your picture there is a) whale.", "Here there is a dolphin, but here …"),
   ("In my picture there is a waterfall.", "(In your picture there is) no waterfall.", "Here there is a waterfall, but here …"),
   ("In my picture the windows are round.", "(In your picture the windows are) square.", "Here the windows are round, but here …"),
   ("In my picture there are three birds in the sky.", "(In your picture there are) five birds.", "Here there are three birds, but here …")]),
 [([.70, .08, .18, .12], ["small sun", "big sun"], [.66, .00, .24, .14]),
  ([.66, .46, .30, .30], ["dolphin", "whale"]),
  ([.72, .38, .16, .18], ["a waterfall", "no waterfall"]),
  ([.30, .58, .24, .18], ["round windows", "square windows"]),
  ([.03, .10, .28, .14], ["three birds", "five birds"], [.06, .10, .30, .22])],
 ("Don't worry! I've got a map!", "Fred and his grandfather are in their car. They want to go for a walk in the city.", [
   (2, "Fred and his grandfather are in the city now. They're standing in a street. Fred's taking a photo with his phone.", "Where are Fred and his grandfather now? What's Fred doing?"),
   (3, "Fred's grandfather isn't happy. They haven't got a map.", "Why isn't Fred's grandfather happy? What haven't they got?"),
   (4, "There's a map on Fred's phone. Fred's grandfather is happy now!", "What's on Fred's phone? Is Fred's grandfather happy?")]),
 ["Fred and his grandfather are in their car. They want to go for a walk in the city.", "They are in the city now. Fred is taking a photo with his phone.", "Fred's grandfather isn't happy. They haven't got a map.", "There is a map on Fred's phone. Fred's grandfather is happy now."],
 (P3DEMO, [BOOK(2),
   (3, "This boy is roller skating but the others are shopping.", "What are these people doing? (shopping) And this boy? (roller skating)"),
   (2, "This is a drink but the others are animals.", "What are these? (animals) And this? (milkshake / drink)"),
   (4, "This girl is hot but the others are cold.", "These girls are …? (cold) And this girl is …? (hot)")]),
 ("Now let's talk about your home.", [
   ("Where do you live?", "in (name of town / city)", "Do you live in (name of town / city)?"),
   ("How many people live in your home?", "four", "Do four people live in your home?"),
   ("What do you like doing at home?", "cooking", "Do you like cooking at home?"),
   ("Tell me about your evenings at home.", "I have dinner. I do my homework. I go to bed at nine o'clock.", "Do you have dinner? Do you do your homework? What time do you go to bed?")]),
 {'p1': "sun = mặt trời; small = nhỏ; big = to; dolphin = cá heo; whale = cá voi; waterfall = thác nước; round = tròn; square = vuông; window = cửa sổ; bird = con chim; sky = bầu trời",
  'p2': "car = xe hơi; city = thành phố; street = con đường; take a photo = chụp ảnh; phone = điện thoại; map = bản đồ; happy = vui; grandfather = ông",
  'p3': "shopping = đi mua sắm; roller skating = trượt patin; animals = con vật; milkshake = sữa lắc; drink = đồ uống; cold = lạnh; hot = nóng",
  'p4': "live = sống; home = nhà; cooking = nấu ăn; evening = buổi tối; dinner = bữa tối; homework = bài tập về nhà; go to bed = đi ngủ"},
 note=NOTE))

SETS.append(S2('m3-t3', 0, 'auth', 'Authentic 3 · Test 3', SRC.format(n=3), "Charlie gets the teddy bear",
 ("Here there are two kites, but here there are three.", [
   ("In my picture there are helmets.", "(In your picture there are) roller skates.", "Here there are helmets, but here …"),
   ("In my picture the woman is wearing a red sweater.", "(In your picture the woman is wearing a) yellow sweater.", "Here the sweater is red, but here …"),
   ("In my picture the little girl is hopping.", "(In your picture the little girl is) skipping.", "Here the girl is hopping, but here …"),
   ("In my picture there is a teddy.", "(In your picture there is a) penguin.", "Here there is a teddy, but here …")]),
 [([.50, .10, .34, .26], ["two kites", "three kites"]),
  ([.02, .68, .26, .12], ["helmets", "roller skates"]),
  ([.02, .30, .20, .26], ["red sweater", "yellow sweater"]),
  ([.30, .48, .40, .38], ["girl hopping", "girl skipping"]),
  ([.58, .70, .22, .18], ["a teddy", "a penguin"])],
 ("Charlie gets the teddy bear", "Charlie is fishing with his dad in a small boat. There's another boat on the sea too. There's a girl in that boat. She's holding a teddy bear.", [
   (2, "The girl's teddy bear is in the sea. Charlie's jumping into the water.", "Where's the girl's teddy bear? What's Charlie doing?"),
   (3, "Charlie's holding the teddy bear.", "What's Charlie holding?"),
   (4, "Charlie's giving the teddy bear to the girl. She's very happy.", "What's Charlie doing? Is the girl happy?")]),
 ["Charlie is fishing with his dad. A girl in another boat is holding a teddy bear.", "The girl's teddy bear is in the sea. Charlie is jumping into the water.", "Charlie is holding the teddy bear.", "Charlie is giving the teddy bear to the girl. She is very happy."],
 (P3DEMO, [BOOK(3),
   (1, "This is something you eat but the others are things you wear.", "These are things you can …? (wear) And this is something you can …? (eat)"),
   (3, "This woman is watching TV but the others are building.", "What are these people doing? (building) And this woman? (watching TV)"),
   (1, "This car is in a car park but the others are on the road.", "Where are these cars? (road) And this car? (car park)")]),
 ("Now let's talk about your school.", [
   ("How do you go to school?", "by (bus)", "Do you go by bus?"),
   ("How many children are there in your class?", "thirty", "Are there twenty? Thirty?"),
   ("Who do you sit next to in class?", "(name)", "Do you sit next to your friend?"),
   ("Tell me about your teacher.", "She's young. She's got brown hair.", "Is she young or old? What colour is her hair?")]),
 {'p1': "kite = con diều; helmet = mũ bảo hiểm; roller skates = giày patin; sweater = áo len; red = đỏ; yellow = vàng; hopping = nhảy lò cò; skipping = nhảy dây; teddy = gấu bông; penguin = chim cánh cụt",
  'p2': "fishing = câu cá; boat = con thuyền; teddy bear = gấu bông; sea = biển; jump = nhảy; water = nước; hold = cầm; give = đưa; happy = vui",
  'p3': "wear = mặc; eat = ăn; building = xây dựng; watching TV = xem ti vi; car park = bãi đỗ xe; road = con đường",
  'p4': "go to school = đến trường; by bus = bằng xe buýt; class = lớp học; sit next to = ngồi cạnh; teacher = giáo viên; young = trẻ; brown hair = tóc nâu"},
 note=NOTE))
