# -*- coding: utf-8 -*-
"""Movers Speaking – Succeed in Cambridge English: Movers (8 Practice Tests). Script: Teacher's key (Speaking – Practice Test n); hình: sách bài thi.
Part 1: sách chỉ liệt kê các điểm khác (câu mẫu do Claude viết theo đó). Part 3: tranh khác loại suy từ câu hỏi gợi ý của sách (sách chấp nhận mọi khác biệt hợp lý)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _common import S2
GROUP = ('suc', 'Succeed in Movers (có script)')
SRC = "Succeed in Cambridge English: Movers · Practice Test {n} · script: Speaking key · hình: sách bài thi"
NOTE = "Part 1: sách chỉ liệt kê điểm khác; câu mẫu do Claude viết theo danh sách đó. Part 3: tranh khác loại và lý do mẫu suy từ câu hỏi gợi ý của sách (sách chấp nhận mọi khác biệt hợp lý)."
TREE = "Now look at these four pictures. One is different. The tree is different. A parrot, a chicken and a duck are birds. They can fly. A tree can't fly. Now you tell me about these pictures. Which one is different? (Why?)"
TREE_SAY = "The tree is different. A parrot, a chicken and a duck are birds. They can fly. A tree can't fly."
def H(a): return "Here the %s, but here …" % a
SETS = []

SETS.append(S2('suc-t1', 0, 'suc', 'Succeed · Test 1', SRC.format(n=1), "Mary at the zoo",
 ("Here the girl is eating an apple, but here she's eating a banana.", [
   ("In my picture the dog is jumping.", "(In your picture the dog is) sleeping.", H("dog is jumping")),
   ("In my picture the scarf is green.", "(In your picture the scarf is) pink.", H("scarf is green")),
   ("In my picture the bottle is on the grass.", "(In your picture the bottle is) on a mat.", H("bottle is on the grass")),
   ("In my picture there is a cat next to the girl.", "(In your picture there is) no cat.", "Here there is a cat next to the girl, but here …")]),
 [([.58, .24, .18, .18], ["eating an apple", "eating a banana"]),
  ([.10, .42, .22, .24], ["jumping dog", "sleeping dog"], [.08, .60, .24, .18]),
  ([.84, .55, .16, .35], ["green scarf", "pink scarf"]),
  ([.38, .72, .14, .22], ["bottle on the grass", "bottle on a mat"], [.28, .72, .28, .22]),
  ([.54, .50, .14, .16], ["a cat next to the girl", "no cat"])],
 ("Mary at the zoo", "Mary is taking the bus to the zoo. She's very happy.", [
   (2, "Now Mary's in front of the elephants. She's drinking a bottle of water.", "Where's Mary? What's she doing?"),
   (3, "Mary's pointing at the pandas. The pandas are sitting on a table.", "What's Mary pointing at? Where are the pandas sitting?"),
   (4, "Now Mary's sitting with the pandas. They're drinking tea and eating cakes.", "Where's Mary now? What are they doing?")]),
 ["Mary is taking the bus to the zoo. She is very happy.", "Mary is in front of the elephants. She is drinking water.", "Mary is pointing at the pandas. They are sitting on a table.", "Mary is sitting with the pandas. They are drinking tea and eating cakes."],
 (TREE, [(3, TREE_SAY, ""),
   (1, "A leaf is different. These are food but a leaf isn't food.", "What are these? (food) And this? (leaf)"),
   (1, "A snake is different. These animals have got legs but a snake hasn't got legs.", "What do these animals have? (legs) And this animal? (no legs)"),
   (3, "A frog is different. These are fruit but a frog is an animal.", "What are these? (fruit) And this? (animal)")]),
 ("Now let's talk about your school.", [
   ("Who do you play with at school?", "friends", "Do you play with friends?"),
   ("What games do you play at school?", "hockey", "Do you play hockey?"),
   ("What do you do after school?", "go to the playground", "Do you go to the playground?"),
   ("Tell me more about your school.", "There is a board on the wall. There are lots of desks.", "What's on the wall? What's in the room?")]),
 {'p1': "apple = quả táo; banana = quả chuối; jumping = đang nhảy; sleeping = đang ngủ; scarf = khăn quàng; green = xanh lá; pink = hồng; bottle = cái chai; mat = tấm thảm; cat = con mèo",
  'p2': "zoo = sở thú; bus = xe buýt; elephant = con voi; panda = gấu trúc; bottle of water = chai nước; point = chỉ; table = cái bàn; tea = trà; cake = bánh",
  'p3': "bird = con chim; fly = bay; tree = cái cây; leaf = chiếc lá; food = đồ ăn; snake = con rắn; legs = đôi chân; fruit = trái cây; frog = con ếch",
  'p4': "school = trường học; play with = chơi với; hockey = khúc côn cầu; playground = sân chơi; board = cái bảng; desk = bàn học"},
 note=NOTE))

SETS.append(S2('suc-t2', 0, 'suc', 'Succeed · Test 2', SRC.format(n=2), "Sue's birthday",
 ("Here the boy has got a robot, but here he's got a monster.", [
   ("In my picture the plane is yellow.", "(In your picture the plane is) red.", H("plane is yellow")),
   ("In my picture the bird is small.", "(In your picture the bird is) big.", H("bird is small")),
   ("In my picture there are three leaves on the plant.", "(In your picture there are) four leaves.", "Here there are three leaves on the plant, but here …"),
   ("In my picture the mat is green.", "(In your picture the mat is) red.", H("mat is green"))]),
 [([.42, .22, .20, .26], ["a robot", "a monster"]),
  ([.00, .24, .24, .16], ["yellow plane", "red plane"]),
  ([.22, .68, .22, .22], ["small bird", "big bird"]),
  ([.24, .18, .26, .20], ["three leaves", "four leaves"]),
  ([.58, .74, .40, .24], ["green mat", "red mat"])],
 ("Sue's birthday", "Sue is having a party. Her friends are in the kitchen.", [
   (2, "Now Sue and her friends are eating cake. They are talking and smiling.", "What's Sue doing? What are her friends doing?"),
   (3, "Sue is opening her presents. There is a map in the box.", "What's Sue doing now? What's in the box?"),
   (4, "Now they're outside. Sue has got the map. They found some treasure in the garden.", "Where are they now? What has Sue got? What did they find?")]),
 ["Sue is having a party. Her friends are in the kitchen.", "Sue and her friends are eating cake. They are talking and smiling.", "Sue is opening her presents. There is a map in the box.", "They are outside. Sue has the map. They found some treasure in the garden."],
 (TREE, [(3, TREE_SAY, ""),
   (2, "In this picture the girl is eating but in the others she is drawing.", "What is the girl doing here? (drawing) And here? (eating)"),
   (4, "A tomato is different. These are balls / toys but a tomato is a vegetable.", "What are these? (balls / toys) And this? (tomato / vegetable)"),
   (4, "It's snowy here but it's sunny in the other pictures.", "What's the weather like here? (sunny) And here? (snowy)")]),
 ("Now let's talk about your mornings.", [
   ("What do you have for breakfast?", "eggs", "Do you have eggs for breakfast?"),
   ("Who cooks your breakfast?", "my mum / mother", "Does your mother cook it?"),
   ("Where do you go after breakfast?", "to school", "Do you go to school?"),
   ("Tell me more about your mornings.", "I get dressed. I wash my face.", "Do you get dressed? Do you wash your face?")]),
 {'p1': "robot = người máy; monster = quái vật; plane = máy bay; yellow = vàng; red = đỏ; bird = con chim; small = nhỏ; big = to; leaves = lá cây; plant = cái cây; mat = tấm thảm",
  'p2': "party = bữa tiệc; kitchen = nhà bếp; cake = bánh; talk = nói chuyện; smile = mỉm cười; open = mở; present = món quà; map = bản đồ; treasure = kho báu; garden = khu vườn",
  'p3': "drawing = đang vẽ; eating = đang ăn; ball = quả bóng; toy = đồ chơi; tomato = quả cà chua; vegetable = rau củ; weather = thời tiết; sunny = có nắng; snowy = có tuyết",
  'p4': "breakfast = bữa sáng; eggs = trứng; cook = nấu ăn; get dressed = mặc quần áo; wash my face = rửa mặt; morning = buổi sáng"},
 note=NOTE))

SETS.append(S2('suc-t3', 0, 'suc', 'Succeed · Test 3', SRC.format(n=3), "A visit to grandparents",
 ("Here there is a green ball, but here there is a purple ball.", [
   ("In my picture a girl is riding a bike.", "(In your picture a) boy is riding a bike.", "Here a girl is riding a bike, but here …"),
   ("In my picture there are clouds above the mountain.", "(In your picture there is) rain above the mountain.", "Here there are clouds above the mountain, but here …"),
   ("In my picture the girl has curly hair.", "(In your picture the girl has) straight hair.", "Here the girl has curly hair, but here …"),
   ("In my picture the woman is reading.", "(In your picture the woman is) writing.", "Here the woman is reading, but here …")]),
 [([.26, .44, .14, .14], ["green ball", "purple ball"]),
  ([.42, .34, .32, .46], ["girl on the bike", "boy on the bike"]),
  ([.00, .00, .60, .20], ["clouds above the mountain", "rain above the mountain"]),
  ([.78, .58, .20, .22], ["curly hair", "straight hair"]),
  ([.02, .55, .28, .38], ["woman reading", "woman writing"])],
 ("A visit to grandparents", "Jim is in his bedroom. He is putting clothes and toys in a bag.", [
   (2, "Now Jim is getting on a plane. He's got a ticket in his hand.", "What's Jim doing? What has he got?"),
   (3, "Jim sees his grandparents. He's going to the car.", "Who does Jim see? Where is he going?"),
   (4, "Now they're in front of a house. There is a dog on the grass. Jim is surprised and happy.", "Where are they now? What's on the grass? Is Jim happy / surprised?")]),
 ["Jim is in his bedroom. He is putting clothes and toys in a bag.", "Jim is getting on a plane. He has got a ticket in his hand.", "Jim sees his grandparents. He is going to the car.", "They are in front of a house. There is a dog on the grass. Jim is surprised and happy."],
 (TREE, [(3, TREE_SAY, ""),
   (2, "A car can't fly but the others can fly.", "What can these do? (fly) And this? (can't fly)"),
   (2, "This woman is listening to music but the others are sleeping.", "What are these people doing? (sleeping) And this woman? (listening to music)"),
   (1, "A mouse is a small animal but the others are big animals.", "What are these? (big animals) And this? (small animal)")]),
 ("Now let's talk about your friends and family.", [
   ("What do you like doing with your friends?", "swimming", "Do you like swimming?"),
   ("Where do you play with your friends?", "in the park", "Do you play in the park?"),
   ("How many people are there in your family?", "four", "Are there four people in your family?"),
   ("Tell me more about your friends and family.", "I have three brothers. My best friend is Vicky.", "How many brothers or sisters have you got? Who's your best friend?")]),
 {'p1': "ball = quả bóng; green = xanh lá; purple = tím; girl = bạn nữ; boy = bạn nam; bike = xe đạp; clouds = những đám mây; rain = mưa; mountain = ngọn núi; curly hair = tóc xoăn; straight hair = tóc thẳng; reading = đang đọc; writing = đang viết",
  'p2': "bedroom = phòng ngủ; bag = cái túi; clothes = quần áo; plane = máy bay; ticket = vé; grandparents = ông bà; car = xe hơi; dog = con chó; grass = cỏ; surprised = ngạc nhiên",
  'p3': "fly = bay; car = xe hơi; sleeping = đang ngủ; listening to music = nghe nhạc; mouse = con chuột; big = to; small = nhỏ",
  'p4': "swimming = bơi lội; park = công viên; family = gia đình; brothers = anh em trai; best friend = bạn thân"},
 note=NOTE))

SETS.append(S2('suc-t4', 0, 'suc', 'Succeed · Test 4', SRC.format(n=4), "A very cold day",
 ("Here there is a red bag, but here there is a blue bag.", [
   ("In my picture the teacher is writing numbers.", "(In your picture the teacher is writing) letters.", "Here the teacher is writing numbers, but here …"),
   ("In my picture the boy is short.", "(In your picture the boy is) tall.", H("boy is short")),
   ("In my picture the girl has got a ruler.", "(In your picture the girl has got a) rubber.", "Here the girl has got a ruler, but here …"),
   ("In my picture there are four students.", "(In your picture there are) five students.", "Here there are four students, but here …")]),
 [([.84, .22, .16, .20], ["red bag", "blue bag"]),
  ([.32, .05, .42, .30], ["writing numbers", "writing letters"]),
  ([.06, .26, .16, .42], ["short boy", "tall boy"]),
  ([.66, .66, .20, .20], ["a ruler", "a rubber"]),
  ([.08, .62, .20, .20], ["four students", "five students"])],
 ("A very cold day", "Bill is inside. He is looking out of the window. He sees snow.", [
   (2, "Now Bill is putting on a coat and a scarf. He's got a camera.", "What's Bill doing? What has he got?"),
   (3, "Bill is outside. He's playing in the snow. His mother is taking a picture of him.", "Where's Bill now? What is he doing? What is his mum doing?"),
   (4, "Bill and his mum are inside. Bill is cold. His mum is giving him a cup of hot tea.", "Where are they now? Is Bill cold? What's Bill's mum doing?")]),
 ["Bill is inside. He looks out of the window. He sees snow.", "Bill is putting on a coat and a scarf. He has got a camera.", "Bill is outside. He is playing in the snow. His mum is taking a picture of him.", "Bill and his mum are inside. Bill is cold. His mum is giving him a cup of hot tea."],
 (TREE, [(3, TREE_SAY, ""),
   (2, "This woman is a grown-up but the others are children.", "What are these? (children) And this person? (a grown-up)"),
   (1, "This man is a pirate but the others are doctors.", "What are these people? (doctors) And this man? (a pirate)"),
   (4, "A watermelon is fruit but the others are clothes.", "What are these? (clothes) And this? (fruit)")]),
 ("Now let's talk about your holiday.", [
   ("Where do you go for holiday?", "to the beach", "Do you go to the beach?"),
   ("Who do you see on your holiday?", "my grandparents", "Do you see your grandparents?"),
   ("What do you like doing on your holiday?", "playing football", "Do you like playing football?"),
   ("Tell me more about your holiday.", "I went to an island. I played in the sea.", "Where did you go? What did you do?")]),
 {'p1': "bag = cái túi; red = đỏ; blue = xanh dương; teacher = giáo viên; writing = đang viết; numbers = các con số; letters = các chữ cái; short = thấp; tall = cao; ruler = cái thước; rubber = cục tẩy; students = học sinh",
  'p2': "inside = ở trong nhà; window = cửa sổ; snow = tuyết; coat = áo khoác; scarf = khăn quàng; camera = máy ảnh; outside = ngoài trời; cold = lạnh; hot tea = trà nóng",
  'p3': "children = trẻ em; grown-up = người lớn; pirate = cướp biển; doctor = bác sĩ; clothes = quần áo; watermelon = quả dưa hấu; fruit = trái cây",
  'p4': "holiday = kỳ nghỉ; beach = bãi biển; grandparents = ông bà; football = bóng đá; island = hòn đảo; sea = biển"},
 note=NOTE))

SETS.append(S2('suc-t5', 0, 'suc', 'Succeed · Test 5', SRC.format(n=5), "Kim is cooking",
 ("Here there is a man in the sea who isn't holding anything but here he is holding a ball.", [
   ("In my picture a boy is playing in the sand.", "(In your picture a) girl is playing in the sand.", "Here a boy is playing in the sand, but here …"),
   ("In my picture the toy boat is blue.", "(In your picture the toy boat is) yellow.", H("toy boat is blue")),
   ("In my picture there is a radio on the towel.", "(In your picture there is a) picnic basket on the towel.", "Here there is a radio on the towel, but here …"),
   ("In my picture there is no girl on the towel.", "(In your picture there is a) girl sitting on the towel.", "Here there is no girl on the towel, but here …")]),
 [([.22, .04, .18, .30], ["man without a ball", "man holding a ball"]),
  ([.08, .60, .24, .36], ["boy playing in the sand", "girl playing in the sand"]),
  ([.40, .78, .28, .16], ["blue toy boat", "yellow toy boat"]),
  ([.52, .40, .34, .20], ["radio on the towel", "picnic basket on the towel"]),
  ([.58, .36, .14, .20], ["no girl on the towel", "girl sitting on the towel"])],
 ("Kim is cooking", "Kim is in the kitchen. There are lots of things.", [
   (2, "Now Kim and her friend are cooking.", "What are Kim and her friend doing now?"),
   (3, "Now Kim's mother and daughter are in the kitchen. They're helping Kim to cook.", "Who is in the kitchen now? What are they doing?"),
   (4, "Kim and her daughter are in the dining room. They're looking at all the food they made.", "Where are Kim and her daughter now? What are they looking at?")]),
 ["Kim is in the kitchen. There are lots of things.", "Kim and her friend are cooking.", "Kim's mother and daughter are in the kitchen. They are helping Kim to cook.", "Kim and her daughter are in the dining room. They are looking at all the food."],
 (TREE, [(3, TREE_SAY, ""),
   (4, "A bottle is different. These are food but a bottle isn't food.", "What are these? (food) And this one? (a bottle)"),
   (1, "A bird lives on trees but the others live in the sea.", "Where do these live? (in the sea) And this? (on trees)"),
   (2, "A goat is an animal but the others are toys.", "What are these? (toys) And this? (an animal)")]),
 ("Now let's talk about your friends.", [
   ("How many friends do you have?", "four", "Do you have four friends?"),
   ("Are your friends boys or girls?", "boys", "Are your friends boys?"),
   ("Where do you play with your friends at weekends?", "playground", "Do you play with your friends at the playground at weekends?"),
   ("Tell me more about your friends.", "They like playing basketball. They go fishing every Sunday.", "What do they like playing? What do they do every Sunday?")]),
 {'p1': "man = người đàn ông; sea = biển; ball = quả bóng; sand = cát; toy boat = thuyền đồ chơi; blue = xanh dương; yellow = vàng; radio = đài radio; picnic basket = giỏ dã ngoại; towel = khăn tắm; sitting = đang ngồi",
  'p2': "kitchen = nhà bếp; cooking = đang nấu ăn; friend = bạn; mother = mẹ; daughter = con gái; help = giúp đỡ; dining room = phòng ăn; food = đồ ăn",
  'p3': "food = đồ ăn; bottle = cái chai; sea = biển; tree = cái cây; toys = đồ chơi; animal = con vật; goat = con dê",
  'p4': "friends = bạn bè; boys = các bạn nam; weekends = cuối tuần; playground = sân chơi; basketball = bóng rổ; fishing = câu cá; Sunday = Chủ nhật"},
 note=NOTE))

SETS.append(S2('suc-t6', 0, 'suc', 'Succeed · Test 6', SRC.format(n=6), "Sam sails his boat",
 ("Here there are clouds in the sky, but here there are no clouds in the sky.", [
   ("In my picture there is no dog.", "(In your picture there is a) dog next to the boy.", "Here there is no dog, but here …"),
   ("In my picture the dolphin is blue.", "(In your picture the dolphin is) purple.", H("dolphin is blue")),
   ("In my picture a girl is sitting on a dolphin.", "(In your picture a girl is holding a) ball.", "Here a girl is sitting on a dolphin, but here …"),
   ("In my picture the small boy is holding a book.", "(In your picture the small boy is holding a) ball.", "Here the small boy is holding a book, but here …")]),
 [([.00, .00, .45, .18], ["clouds in the sky", "no clouds"]),
  ([.84, .50, .16, .28], ["no dog", "a dog next to the boy"]),
  ([.04, .48, .24, .28], ["blue dolphin", "purple dolphin"]),
  ([.06, .48, .20, .22], ["girl sitting on a dolphin", "girl with a ball"], [.00, .78, .16, .20]),
  ([.30, .48, .20, .26], ["small boy holding a book", "small boy holding a ball"])],
 ("Sam sails his boat", "Sam is on his boat. He is very happy. It is a nice sunny day.", [
   (2, "Now the weather is changing. Sam is frightened.", "What's the weather like? Is Sam frightened?"),
   (3, "Sam needs help. A helicopter comes to help him.", "Does Sam need help? What comes to help Sam?"),
   (4, "Sam is inside the helicopter. He is smiling and he is happy again.", "Where is Sam now? Is he smiling? Is he happy?")]),
 ["Sam is on his boat. He is happy. It is a sunny day.", "The weather is changing. Sam is frightened.", "Sam needs help. A helicopter comes to help him.", "Sam is inside the helicopter. He is smiling. He is happy again."],
 (TREE, [(3, TREE_SAY, ""),
   (4, "This man builds houses but the others work at the hospital.", "What do these people do? (work at the hospital) And this man? (builds houses)"),
   (1, "You wear trousers on your legs but you wear the others on your head.", "Where do you wear these things? (on the / my head) And this? (on the / my legs)"),
   (4, "This is meat but the others are fruit.", "What are these? (fruit) And this? (meat)")]),
 ("Now let's talk about where you live.", [
   ("Where do you live?", "in the town", "Do you live in town?"),
   ("What do you like about where you live?", "There is a park and lots of trees.", "Are there parks and trees?"),
   ("What don't you like about where you live?", "There are a lot of cars. There is a lot of noise.", "Are there many cars? Is there a lot of noise?"),
   ("Tell me more about the place where you live.", "My friends live near my house.", "Do your friends live near your house?")]),
 {'p1': "clouds = những đám mây; sky = bầu trời; dog = con chó; dolphin = cá heo; blue = xanh dương; purple = tím; ball = quả bóng; book = quyển sách; boy = bạn nam; girl = bạn nữ; sitting = đang ngồi",
  'p2': "boat = con thuyền; sail = chèo thuyền; sunny day = ngày nắng; weather = thời tiết; frightened = sợ hãi; help = giúp đỡ; helicopter = trực thăng; smile = mỉm cười",
  'p3': "hospital = bệnh viện; builds houses = xây nhà; head = cái đầu; legs = đôi chân; trousers = quần dài; hat = cái mũ; fruit = trái cây; meat = thịt",
  'p4': "town = thị trấn; park = công viên; trees = cây cối; cars = xe hơi; noise = tiếng ồn; near = gần"},
 note=NOTE))

SETS.append(S2('suc-t7', 0, 'suc', 'Succeed · Test 7', SRC.format(n=7), "Daisy's birthday",
 ("Here one of the boys is wearing a hat, but here he isn't wearing a hat.", [
   ("In my picture there is a plane in the sky.", "(In your picture there is a) bird in the sky.", "Here there is a plane in the sky, but here …"),
   ("In my picture the girl is wearing a hat.", "(In your picture the girl is) not wearing a hat.", "Here the girl is wearing a hat, but here …"),
   ("In my picture the girl has got brown hair.", "(In your picture the girl has got) blonde hair.", "Here the girl has got brown hair, but here …"),
   ("In my picture a dog is sitting on the grass.", "(In your picture a) cat is sitting on the grass.", "Here a dog is sitting, but here …")]),
 [([.36, .42, .20, .14], ["a boy wearing a hat", "a boy not wearing a hat"]),
  ([.70, .03, .20, .12], ["plane in the sky", "bird in the sky"], [.76, .10, .18, .10]),
  ([.80, .68, .20, .22], ["girl wearing a hat", "girl not wearing a hat"]),
  ([.74, .66, .26, .30], ["brown hair", "blonde hair"]),
  ([.62, .64, .20, .20], ["a dog sitting", "a cat sitting"])],
 ("Daisy's birthday", "It's Daisy's birthday. She is having a party but she only has an old dress to wear. She is sad.", [
   (2, "Daisy is holding a balloon. Her mum is standing on a chair and is holding a balloon. Her dad is carrying a box.", "What's Daisy doing? What's Daisy's mother doing? What's her dad carrying?"),
   (3, "Daisy is opening her present. There is a puppy in the box. She is very happy.", "What's Daisy doing? What's in the box? Is she happy?"),
   (4, "Daisy's holding her new puppy. There are a lot of children at her birthday party.", "What's Daisy doing now? Are there a lot of children at her birthday party?")]),
 ["It is Daisy's birthday. She is having a party but she only has an old dress. She is sad.", "Daisy is holding a balloon. Her mum is holding a balloon too. Her dad is carrying a box.", "Daisy is opening her present. There is a puppy in the box. She is very happy.", "Daisy is holding her new puppy. There are a lot of children at her party."],
 ("Now look at these four pictures. One is different. The tree is different. These animals can fly. But a tree can't fly. Now you tell me about these pictures. Which one is different? (Why?)", [
   (3, "The tree is different. These animals can fly. But a tree can't fly.", ""),
   (1, "You sit on a chair but you write with the others.", "What do you do with these? (write) And with this? (sit)"),
   (2, "You read a book but you drink from the others.", "What do you do with these? (drink) And with this? (read)"),
   (4, "A cat is an animal but the others are food.", "What are these? (food) And this? (an animal)")]),
 ("Now let's talk about your family.", [
   ("Where does your family live?", "in a city", "Do you live in a city?"),
   ("Who is the youngest in your family?", "me", "Are you the youngest in your family?"),
   ("How many people are there in your family?", "four", "Are there four people in your family?"),
   ("Tell me more about your family.", "I play with my sister / brother. I help my mum cook dinner.", "Do you play with your sister / brother? Do you help your mum cook dinner?")]),
 {'p1': "boy = bạn nam; hat = cái mũ; plane = máy bay; bird = con chim; sky = bầu trời; girl = bạn nữ; brown hair = tóc nâu; blonde hair = tóc vàng; dog = con chó; cat = con mèo; sitting = đang ngồi",
  'p2': "birthday = sinh nhật; party = bữa tiệc; old dress = chiếc váy cũ; sad = buồn; balloon = quả bóng bay; chair = cái ghế; box = cái hộp; present = món quà; puppy = chó con",
  'p3': "write = viết; sit = ngồi; drink = uống; read = đọc; food = đồ ăn; animal = con vật; chair = cái ghế; pencil case = hộp bút",
  'p4': "family = gia đình; city = thành phố; youngest = nhỏ tuổi nhất; sister = chị / em gái; brother = anh / em trai; cook dinner = nấu bữa tối"},
 note=NOTE))

SETS.append(S2('suc-t8', 0, 'suc', 'Succeed · Test 8', SRC.format(n=8), "A bad day",
 ("Here there are two balls but here there are three balls.", [
   ("In my picture there are two boats.", "(In your picture there are) no boats.", "Here there are two boats, but here …"),
   ("In my picture the flowers are white and red.", "(In your picture the flowers are) white and yellow.", "Here the flowers are white and red, but here …"),
   ("In my picture there is a cat next to the swimming pool.", "(In your picture there is) no cat.", "Here there is a cat next to the swimming pool, but here …"),
   ("In my picture the child in the pool is wearing glasses.", "(In your picture the child is) not wearing glasses.", "Here the child is wearing glasses, but here …")]),
 [([.64, .84, .34, .14], ["two balls", "three balls"]),
  ([.05, .28, .65, .14], ["two boats", "no boats"]),
  ([.00, .42, 1.0, .20], ["white and red flowers", "white and yellow flowers"]),
  ([.00, .76, .14, .18], ["a cat next to the pool", "no cat"]),
  ([.42, .62, .24, .22], ["child wearing glasses", "child not wearing glasses"])],
 ("A bad day", "Sally is waiting for a bus. She is wearing nice clothes because she is going to work.", [
   (2, "Sally is looking at her watch. The bus did not come. It's raining.", "What is Sally looking at? What did not come? What's the weather like?"),
   (3, "The bus is coming. Sally is wet and she's angry.", "What's coming? Is Sally wet? Is she angry?"),
   (4, "Sally is in the bus. She wants to change her clothes because they are wet.", "Where is Sally now? Why does she want to change her clothes?")]),
 ["Sally is waiting for a bus. She is wearing nice clothes because she is going to work.", "Sally is looking at her watch. The bus did not come. It is raining.", "The bus is coming. Sally is wet and angry.", "Sally is in the bus. She wants to change her clothes because they are wet."],
 ("Now look at these four pictures. One is different. The glasses are different. You wear socks, shoes and trousers on your body. You wear glasses on your head. Now you tell me about these pictures. Which one is different? (Why?)", [
   (3, "The glasses are different. You wear socks, shoes and trousers on your body. You wear glasses on your head.", ""),
   (3, "A dog lives in the house or garden but the others live in the sea.", "Where do these animals live? (in the sea) And this? (in the garden / in the house)"),
   (1, "A burger is food but the others are glasses.", "What are these? (glasses) And this? (burger / food)"),
   (4, "You write with a pen but you read the others.", "What can we do with these? (read) And this? (write)")]),
 ("Now let's talk about your lessons.", [
   ("What is your favourite lesson?", "drawing", "Is drawing your favourite lesson?"),
   ("Who is your teacher?", "Miss Sky", "Is Miss Sky your teacher?"),
   ("What is she like?", "She's nice.", "Is she nice?"),
   ("Tell me more about your lessons.", "I like History and Maths. I'm very good at Geography.", "Do you like History and Maths? Are you good at Geography?")]),
 {'p1': "balls = những quả bóng; boats = những chiếc thuyền; flowers = hoa; white = trắng; red = đỏ; yellow = vàng; cat = con mèo; swimming pool = bể bơi; glasses = kính; child = đứa trẻ",
  'p2': "wait for a bus = chờ xe buýt; nice clothes = quần áo đẹp; work = đi làm; watch = đồng hồ đeo tay; raining = đang mưa; wet = ướt; angry = tức giận; change clothes = thay quần áo",
  'p3': "socks = tất; shoes = giày; trousers = quần dài; glasses = kính; sea = biển; garden = khu vườn; burger = bánh burger; read = đọc; write = viết; pen = cây bút",
  'p4': "lesson = tiết học; favourite = yêu thích; drawing = vẽ; teacher = giáo viên; History = môn Lịch sử; Maths = môn Toán; Geography = môn Địa lý"},
 note=NOTE))
