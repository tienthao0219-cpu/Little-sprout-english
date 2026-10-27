# -*- coding: utf-8 -*-
"""Đặc tả 10 bộ test "do Claude soạn" (ảnh tạo bằng ChatGPT): bộ 31-40.
Từ file này sinh ra: (1) prompt tạo ảnh (tranh + tấm 8 thẻ), (2) kịch bản đầy đủ (gen_set.py) khi đã có ảnh.
Mỗi tranh đều có đủ các "vai" để viết đủ 4 Part: 1 vật ví dụ, 2 vật cần tìm, 3 vật làm mốc đặt thẻ,
1 nhóm đếm được (màu + số lượng), 1 em bé đang làm gì, 1 người để "Tell me about ...".
"""
STYLE = ("Flat 2D vector-style children's picture-book illustration for a young learners' English speaking test (similar in spirit to Cambridge YLE Starters pictures, "
         "but an original drawing): bright cheerful colours, clean dark outlines, friendly cartoon children about 6-8 years old, simple shapes, landscape 4:3 ratio, "
         "full-bleed scene, NO border, NO frame. Absolutely no text, letters, numbers, logos or speech bubbles anywhere in the picture.")
RULES = ("Rules: draw each listed item clearly and fully visible, large enough to see easily, and NOT overlapping other listed items. "
         "Use exactly the numbers and colours given. Do not add extra people or animals that are not listed. Keep the background simple (a few plain trees, sky or walls only).")
CARDS_STYLE = ("Create ONE image: an object card sheet on a PURE WHITE background (#FFFFFF). Show 8 separate cartoon clipart objects arranged in a neat grid of 4 columns x 2 rows, "
               "with wide empty white gaps between the objects. Each object is alone, whole (not cropped), centred in its own cell, drawn in a flat bright cartoon style with thick dark outlines, "
               "no ground shadow, no text, no labels, no numbers, no frames, no cell borders, nothing else on the page.")

VI = {'tiger':'con hổ','glasses':'kính','sandwich':'bánh sandwich','drum':'cái trống','bed':'cái giường','banana':'quả chuối','teddy bear':'gấu bông','shoes':'đôi giày','lamp':'cái đèn','car':'chiếc ô tô','pizza':'bánh pizza','jeans':'quần jeans','grapes':'nho','train':'tàu hỏa','cheese':'phô mai','ruler':'cái thước','bag':'cái túi','boat':'con thuyền','horse':'con ngựa','skirt':'cái váy','orange':'quả cam','bread':'bánh mì','spider':'con nhện','sock':'chiếc tất','doll':'búp bê','egg':'quả trứng','bird':'con chim','coat':'áo khoác','cake':'bánh ngọt','bike':'xe đạp','flower':'bông hoa','tomato':'quả cà chua','computer':'máy tính','TV':'tivi','sausage':'xúc xích','rabbit':'con thỏ','shorts':'quần soóc','juice':'nước ép','snake':'con rắn','sweater':'áo len','bus':'xe buýt','milk':'sữa','hippo':'hà mã','ice cream':'kem','crocodile':'cá sấu','rice':'cơm','jacket':'áo khoác','sofa':'ghế sofa','door':'cái cửa','pig':'con heo','pasta':'mì ống','salad':'rau trộn','desk':'bàn học','bear':'con gấu','lemonade':'nước chanh','cow':'con bò','camera':'máy ảnh','chair':'cái ghế','lion':'sư tử','hat':'cái mũ','window':'cửa sổ','plane':'máy bay','monkey':'con khỉ','shirt':'áo sơ mi','chicken':'con gà','bath':'bồn tắm','picture':'bức tranh','rubber':'cục tẩy','lemon':'quả chanh','sheep':'con cừu','kite':'cái diều','watermelon':'dưa hấu'}

def plural(w):
    if w.endswith(('s', 'sh', 'ch', 'x')): return w + 'es'
    if w.endswith('y') and w[-2] not in 'aeiou': return w[:-1] + 'ies'
    return w + 's'

def C(key, word, art, cat, pl=None, meal='lunch'):  # art: a / an / pl / mass ; cat: animal / food / clothes / thing
    return dict(key=key, word=word, art=art, cat=cat, pl=pl or plural(word), meal=meal)

SPECS = [
 dict(id='ai-t1', no=31, theme='At the zoo', themeVi='Ở sở thú', setting='a sunny zoo with green grass and a blue sky',
  objs=["a big grey ELEPHANT standing in the centre",
        "a ZOOKEEPER (a woman in a green uniform and a brown hat) standing on the left of the elephant, giving it a carrot",
        "a brown MONKEY sitting in a big green TREE at the top left",
        "a tall yellow GIRAFFE standing at the back on the right",
        "a girl in a yellow dress holding THREE RED BALLOONS, at the right in front",
        "a boy in a red T-shirt sitting on a blue bench and eating a pink ICE CREAM, at the bottom left",
        "a long brown wooden FENCE across the middle in front of the animals",
        "a green BIN at the bottom, in the middle, with clear empty space on its right"],
  ex=('elephant','elephant','con voi'), finds=[('monkey','monkey',False,'con khỉ'),('giraffe','giraffe',False,'con hươu cao cổ')],
  zones=[('fence','on','the fence','hàng rào'),('tree','under','the tree','cái cây'),('bin','next to','the bin','thùng rác')],
  cluster=('balloons','balloons','balloon','red',3,'bóng bay'), actor=('boy','boy','eating','Eating','sleeping','Cậu bé đang làm gì?'),
  tellme=('keeper','woman',["She's feeding the elephant.","She's got a hat."],"What's she doing? (Is she feeding the elephant?) / What's she got? (Has she got a hat?)",'Hãy nói về cô quản thú.'),
  cards=[C('tiger','tiger','a','animal'),C('glasses','glasses','pl','thing',pl='glasses'),C('sandwich','sandwich','a','food'),C('drum','drum','a','thing'),C('bed','bed','a','thing'),C('banana','banana','a','food'),C('teddy','teddy bear','a','thing'),C('shoes','shoes','pl','clothes')],
  card1='drum', card2='banana', p3=['tiger','sandwich','teddy','shoes'],
  p4=[('Do you like animals?','Em có thích động vật không?',['Yes / No'],'',['Yes or no? Do you like animals?','Do you like dogs?']),
      ("What's your favourite animal at the zoo?",'Con vật em thích nhất ở sở thú?',['Elephant'],'Do you like elephants?',['Do you like elephants?','Do you like elephants or monkeys?']),
      ('Who do you go to the zoo with?','Em đi sở thú cùng ai?',['My family'],'Do you go with your family?',['Do you go with your family?','Do you go with your family or your friend?'])]),
 dict(id='ai-t2', no=32, theme='On the farm', themeVi='Ở nông trại', setting='a sunny farm with green fields and a blue sky',
  objs=["a big red BARN with a white door, on the right",
        "a green TRACTOR at the bottom left",
        "a black-and-white COW standing in the green field in the centre",
        "FOUR WHITE DUCKS swimming on a small blue pond at the bottom in the middle",
        "an APPLE TREE with red apples at the left, with clear empty grass under it",
        "a FARMER (a man in a red shirt and a yellow hat) carrying a basket of apples, standing next to the apple tree (not under it)",
        "a boy in an orange T-shirt riding a brown HORSE at the right in front",
        "a low wooden FENCE along the back"],
  ex=('barn','barn','chuồng trại'), finds=[('cow','cow',False,'con bò'),('tractor','tractor',False,'chiếc máy kéo')],
  zones=[('barn','on','the barn','chuồng trại'),('tree','under','the apple tree','cây táo'),('tractor','next to','the tractor','máy kéo')],
  cluster=('ducks','ducks','duck','white',4,'con vịt'), actor=('boy','boy','riding','Riding a horse','running','Cậu bé đang làm gì?'),
  tellme=('farmer','man',["He's carrying apples.","He's got a yellow hat."],"What's he carrying? (Is he carrying apples?) / What's he got? (Has he got a hat?)",'Hãy nói về người nông dân.'),
  cards=[C('lamp','lamp','a','thing'),C('car','car','a','thing'),C('pizza','pizza','a','food'),C('jeans','jeans','pl','clothes',pl='jeans'),C('grapes','grapes','pl','food',pl='grapes'),C('train','train','a','thing'),C('cheese','cheese','mass','food',pl='cheese'),C('ruler','ruler','a','thing')],
  card1='lamp', card2='car', p3=['pizza','jeans','grapes','cheese'],
  p4=[('Do you have a pet?','Em có thú cưng không?',['Yes / No'],'',['Yes or no? Do you have a pet?','Do you have a dog or a cat?']),
      ('What animals can you see on a farm?','Em thấy những con vật nào ở nông trại?',['Cows'],'Can you see cows?',['Can you see cows?','Can you see cows or lions?']),
      ('Do you like apples?','Em có thích táo không?',['Yes / No'],'',['Yes or no? Do you like apples?','Do you like red apples?'])]),
 dict(id='ai-t3', no=33, theme='In the kitchen', themeVi='Trong nhà bếp', setting='a bright kitchen at home',
  objs=["a big white FRIDGE on the left",
        "a round CLOCK on the wall at the top in the middle",
        "an orange CAT sleeping on the floor at the bottom right (not under the table)",
        "a wooden TABLE in the centre with a bowl of FIVE RED APPLES on it, with clear empty floor under the table",
        "a girl in a pink apron COOKING at the cooker on the right",
        "a man sitting at the table reading a newspaper, wearing GLASSES",
        "a WINDOW with yellow curtains on the back wall, on the left of the clock"],
  ex=('fridge','fridge','tủ lạnh'), finds=[('clock','clock',False,'cái đồng hồ'),('cat','cat',False,'con mèo')],
  zones=[('fridge','on','the fridge','tủ lạnh'),('table','under','the table','cái bàn'),('window','next to','the window','cửa sổ')],
  cluster=('apples','apples','apple','red',5,'quả táo'), actor=('girl','girl','cooking','Cooking','sleeping','Cô bé đang làm gì?'),
  tellme=('man','man',["He's reading.","He's got glasses."],"What's he doing? (Is he reading?) / What's he got? (Has he got glasses?)",'Hãy nói về người đàn ông này.'),
  cards=[C('bag','bag','a','thing'),C('boat','boat','a','thing'),C('horse','horse','a','animal'),C('skirt','skirt','a','clothes'),C('orange','orange','an','food',meal='breakfast'),C('bread','bread','mass','food',pl='bread',meal='breakfast'),C('spider','spider','a','animal'),C('sock','sock','a','clothes')],
  card1='bag', card2='boat', p3=['horse','skirt','orange','bread'],
  p4=[('Do you like cooking?','Em có thích nấu ăn không?',['Yes / No'],'',['Yes or no? Do you like cooking?','Do you help your mum in the kitchen?']),
      ('What do you eat for dinner?','Bữa tối em ăn gì?',['Rice'],'Do you eat rice?',['Do you eat rice?','Do you eat rice or noodles?']),
      ('Who cooks in your house?','Ai nấu ăn ở nhà em?',['My mum'],'Does your mum cook?',['Does your mum cook?','Does your mum or your dad cook?'])]),
 dict(id='ai-t4', no=34, theme='In the bedroom', themeVi='Trong phòng ngủ', setting='a bright children\'s bedroom',
  objs=["a blue BED in the centre, raised on legs so you can clearly see the empty floor under it, with a brown TEDDY BEAR on it",
        "a tall brown WARDROBE on the left",
        "a yellow LAMP on a small table on the right of the bed",
        "a white DOOR on the right wall, with clear empty floor next to it",
        "FOUR RED TOY CARS in a row on the floor at the bottom left",
        "a girl in purple pyjamas JUMPING on the bed",
        "a boy in a blue T-shirt sitting at a small desk on the right, drawing with a RED PENCIL"],
  ex=('bed','bed','cái giường'), finds=[('lamp','lamp',False,'cái đèn'),('teddy','teddy bear',False,'con gấu bông')],
  zones=[('wardrobe','on','the wardrobe','tủ quần áo'),('bed','under','the bed','cái giường'),('door','next to','the door','cánh cửa')],
  cluster=('cars','toy cars','toy car','red',4,'xe đồ chơi'), actor=('girl','girl','jumping','Jumping','sleeping','Cô bé đang làm gì?'),
  tellme=('boy','boy',["He's drawing.","He's got a red pencil."],"What's he doing? (Is he drawing?) / What's he got? (Has he got a red pencil?)",'Hãy nói về cậu bé này.'),
  cards=[C('doll','doll','a','thing'),C('egg','egg','an','food',meal='breakfast'),C('bird','bird','a','animal'),C('coat','coat','a','clothes'),C('cake','cake','a','food'),C('bike','bike','a','thing'),C('flower','flower','a','thing'),C('tomato','tomato','a','food',pl='tomatoes')],
  card1='doll', card2='egg', p3=['bird','coat','cake','flower'],
  p4=[('Do you have your own bedroom?','Em có phòng ngủ riêng không?',['Yes / No'],'',['Yes or no? Do you have your own bedroom?','Is your bedroom big or small?']),
      ("What's in your bedroom?",'Trong phòng ngủ của em có gì?',['A bed'],'Is there a bed in your bedroom?',['Is there a bed in your bedroom?','Is there a bed or a car in your bedroom?']),
      ('What do you do in your bedroom?','Em làm gì trong phòng ngủ?',['Sleep / read'],'Do you sleep in your bedroom?',['Do you sleep in your bedroom?','Do you sleep or play in your bedroom?'])]),
 dict(id='ai-t5', no=35, theme='At the birthday party', themeVi='Ở tiệc sinh nhật', setting='a birthday party in a bright room with a window',
  objs=["a long TABLE in the centre with a big pink birthday CAKE with five candles on it, with clear empty floor under the table",
        "FOUR BLUE BALLOONS tied to a red CHAIR on the left",
        "a girl in a pink dress and a yellow party hat holding a green PRESENT with a red ribbon, on the right",
        "a boy in a green T-shirt playing a GUITAR at the left in front",
        "a brown DOG wearing a party hat sitting at the bottom right, with clear empty space next to it"],
  ex=('cake','cake','bánh sinh nhật'), finds=[('present','present',False,'món quà'),('dog','dog',False,'con chó')],
  zones=[('chair','on','the chair','cái ghế'),('table','under','the table','cái bàn'),('dog','next to','the dog','con chó')],
  cluster=('balloons','balloons','balloon','blue',4,'bóng bay'), actor=('boy','boy','playing the guitar','Playing the guitar','sleeping','Cậu bé đang làm gì?'),
  tellme=('girl','girl',["She's holding a present.","She's got a party hat."],"What's she holding? (Is she holding a present?) / What's she got? (Has she got a party hat?)",'Hãy nói về cô bé này.'),
  cards=[C('computer','computer','a','thing'),C('tv','TV','a','thing'),C('sausage','sausage','a','food'),C('rabbit','rabbit','a','animal'),C('shorts','shorts','pl','clothes',pl='shorts'),C('juice','juice','mass','food',pl='juice'),C('snake','snake','a','animal'),C('sweater','sweater','a','clothes')],
  card1='computer', card2='tv', p3=['sausage','rabbit','shorts','juice'],
  p4=[('How old are you?','Em bao nhiêu tuổi?',['Seven'],'Are you seven?',['Are you seven?','Are you seven or eight?']),
      ('Do you like parties?','Em có thích tiệc không?',['Yes / No'],'',['Yes or no? Do you like parties?','Do you like cake?']),
      ('What do you like at a party?','Em thích gì ở bữa tiệc?',['Cake'],'Do you like cake?',['Do you like cake?','Do you like cake or music?'])]),
 dict(id='ai-t6', no=36, theme='At the sports field', themeVi='Ở sân thể thao', setting='a sunny green sports field',
  objs=["a big green TREE on the right, with clear empty grass under it",
        "a long brown wooden BENCH at the left",
        "a boy in a red shirt kicking a black-and-white FOOTBALL in the centre",
        "a girl in a blue T-shirt RUNNING at the back on the left",
        "FOUR RED BALLS on the grass at the bottom right",
        "a black DOG running at the bottom in the middle, with clear empty space next to it"],
  ex=('tree','tree','cái cây'), finds=[('bench','bench',False,'cái ghế dài'),('dog','dog',False,'con chó')],
  zones=[('bench','on','the bench','ghế dài'),('tree','under','the tree','cái cây'),('dog','next to','the dog','con chó')],
  cluster=('balls','balls','ball','red',4,'quả bóng'), actor=('boy','boy','playing football','Playing football','sleeping','Cậu bé đang làm gì?'),
  tellme=('girl','girl',["She's running.","She's got a blue T-shirt."],"What's she doing? (Is she running?) / What's she got? (Has she got a blue T-shirt?)",'Hãy nói về cô bé này.'),
  cards=[C('bus','bus','a','thing',pl='buses'),C('milk','milk','mass','food',pl='milk',meal='breakfast'),C('hippo','hippo','a','animal'),C('ruler','ruler','a','thing'),C('icecream','ice cream','an','food',pl='ice cream'),C('crocodile','crocodile','a','animal'),C('rice','rice','mass','food',pl='rice'),C('jacket','jacket','a','clothes')],
  card1='bus', card2='ruler', p3=['milk','hippo','icecream','crocodile'],
  p4=[('Do you like sport?','Em có thích thể thao không?',['Yes / No'],'',['Yes or no? Do you like sport?','Do you like football?']),
      ('What sport do you play?','Em chơi môn thể thao nào?',['Football'],'Do you play football?',['Do you play football?','Do you play football or basketball?']),
      ('Who do you play with?','Em chơi cùng ai?',['My friend'],'Do you play with your friend?',['Do you play with your friend?','Do you play with your friend or your brother?'])]),
 dict(id='ai-t7', no=37, theme='At the swimming pool', themeVi='Ở bể bơi', setting='a sunny swimming pool with a blue sky',
  objs=["a big blue SWIMMING POOL in the centre",
        "a girl in a red swimsuit SWIMMING in the pool",
        "a boy in green shorts JUMPING into the water at the left side of the pool",
        "THREE YELLOW RUBBER DUCKS floating in the pool, with clear empty water next to them",
        "a yellow BEACH BALL on the grass at the bottom right",
        "a tall green PALM TREE at the left",
        "a white BENCH at the right with an orange BAG on it, with clear empty space next to the bench"],
  ex=('pool','pool','bể bơi'), finds=[('ball','ball',False,'quả bóng'),('bag','bag',False,'cái túi')],
  zones=[('tree','on','the tree','cái cây'),('pool','in','the pool','bể bơi'),('bench','next to','the bench','ghế dài')],
  cluster=('ducks','rubber ducks','rubber duck','yellow',3,'vịt cao su'), actor=('boy','boy','jumping','Jumping','sleeping','Cậu bé đang làm gì?'),
  tellme=('girl','girl',["She's swimming.","She's in the water."],"What's she doing? (Is she swimming?) / Where is she? (Is she in the water?)",'Hãy nói về cô bé này.'),
  cards=[C('sofa','sofa','a','thing'),C('door','door','a','thing'),C('pig','pig','a','animal'),C('sock','sock','a','clothes'),C('sweater','sweater','a','clothes'),C('pasta','pasta','mass','food',pl='pasta'),C('salad','salad','a','food'),C('desk','desk','a','thing')],
  card1='sofa', card2='door', p3=['pig','sock','pasta','salad'],
  p4=[('Can you swim?','Em có biết bơi không?',['Yes / No'],'',['Yes or no? Can you swim?','Do you like water?']),
      ('Where do you swim?','Em bơi ở đâu?',['In the pool'],'Do you swim in a pool?',['Do you swim in a pool?','Do you swim in a pool or in the sea?']),
      ('Who do you go swimming with?','Em đi bơi cùng ai?',['My dad'],'Do you go with your dad?',['Do you go with your dad?','Do you go with your dad or your friend?'])]),
 dict(id='ai-t8', no=38, theme='At the picnic', themeVi='Đi dã ngoại', setting='a sunny park with green grass',
  objs=["a big green TREE on the left, with clear empty space under it",
        "a red-and-white BLANKET on the grass in the centre, with a PLATE of THREE GREEN APPLES on it",
        "a mother in a blue dress sitting on the blanket, drinking juice",
        "a girl in a yellow dress sitting on the grass at the right, reading a book",
        "a boy in an orange T-shirt RUNNING with a red KITE at the right",
        "a brown DOG lying on the grass at the bottom, with clear empty space next to it"],
  ex=('tree','tree','cái cây'), finds=[('kite','kite',False,'cái diều'),('dog','dog',False,'con chó')],
  zones=[('tree','on','the tree','cái cây'),('blanket','on','the blanket','tấm thảm'),('dog','next to','the dog','con chó')],
  cluster=('apples','apples','apple','green',3,'quả táo'), actor=('boy','boy','running','Running','sleeping','Cậu bé đang làm gì?'),
  tellme=('girl','girl',["She's reading.","She's got a book."],"What's she doing? (Is she reading?) / What's she got? (Has she got a book?)",'Hãy nói về cô bé này.'),
  cards=[C('bear','bear','a','animal'),C('lemonade','lemonade','mass','food',pl='lemonade'),C('cow','cow','a','animal'),C('camera','camera','a','thing'),C('chair','chair','a','thing'),C('lion','lion','a','animal'),C('hat','hat','a','clothes'),C('window','window','a','thing')],
  card1='hat', card2='window', p3=['bear','lemonade','cow','camera'],
  p4=[('Do you like picnics?','Em có thích đi dã ngoại không?',['Yes / No'],'',['Yes or no? Do you like picnics?','Do you like the park?']),
      ('What do you eat at a picnic?','Em ăn gì khi đi dã ngoại?',['Sandwiches'],'Do you eat sandwiches?',['Do you eat sandwiches?','Do you eat sandwiches or soup?']),
      ('Who goes with you?','Ai đi cùng em?',['My family'],'Does your family go with you?',['Does your family go with you?','Does your family or your friend go with you?'])]),
 dict(id='ai-t9', no=39, theme='At the station', themeVi='Ở nhà ga', setting='a bright railway station',
  objs=["a big red TRAIN at the back, with its doors open",
        "a round CLOCK hanging on the wall at the top in the middle, with clear empty space under it",
        "a man with a blue hat sitting on a brown BENCH on the right, reading a book",
        "THREE YELLOW BAGS in a pile at the left",
        "a girl in a yellow jacket WAVING at the train, in the centre in front",
        "a green BIN at the bottom left, with clear empty space next to it"],
  ex=('train','train','tàu hỏa'), finds=[('clock','clock',False,'cái đồng hồ'),('bench','bench',False,'cái ghế dài')],
  zones=[('train','on','the train','đoàn tàu'),('clock','under','the clock','đồng hồ'),('bin','next to','the bin','thùng rác')],
  cluster=('bags','bags','bag','yellow',3,'cái túi'), actor=('girl','girl','waving','Waving','sleeping','Cô bé đang làm gì?'),
  tellme=('man','man',["He's reading.","He's got a blue hat."],"What's he doing? (Is he reading?) / What's he got? (Has he got a blue hat?)",'Hãy nói về người đàn ông này.'),
  cards=[C('plane','plane','a','thing'),C('monkey','monkey','a','animal'),C('shirt','shirt','a','clothes'),C('chicken','chicken','a','animal'),C('bath','bath','a','thing'),C('picture','picture','a','thing'),C('rubber','rubber','a','thing'),C('lemon','lemon','a','food')],
  card1='plane', card2='picture', p3=['monkey','shirt','chicken','lemon'],
  p4=[('Do you like trains?','Em có thích tàu hỏa không?',['Yes / No'],'',['Yes or no? Do you like trains?','Do you like buses?']),
      ('How do you go to school?','Em đến trường bằng gì?',['By bus'],'Do you go to school by bus?',['Do you go to school by bus?','Do you go to school by bus or by bike?']),
      ('Where do you want to go?','Em muốn đi đâu?',['To the beach'],'Do you want to go to the beach?',['Do you want to go to the beach?','Do you want to go to the beach or the zoo?'])]),
 dict(id='ai-t10', no=40, theme='At the market', themeVi='Ở chợ', setting='a sunny outdoor market',
  objs=["a yellow SUN at the top left",
        "a market stall with a red-and-white striped roof and a wooden TABLE in front, in the centre",
        "a seller (a man in a white apron) standing behind the table",
        "FOUR RED TOMATOES in a blue box on the table, next to some oranges and bananas",
        "a boy in a green T-shirt riding a red BIKE at the bottom left, with clear empty space next to the bike",
        "a woman in a blue dress walking at the right, carrying a big green BAG",
        "a white DOG sitting at the bottom in the middle",
        "a big green TREE at the right at the back, with clear empty ground under it"],
  ex=('sun','sun','mặt trời'), finds=[('dog','dog',False,'con chó'),('bag','bag',False,'cái túi')],
  zones=[('table','on','the table','cái bàn'),('tree','under','the tree','cái cây'),('bike','next to','the bike','xe đạp')],
  cluster=('tomatoes','tomatoes','tomato','red',4,'quả cà chua'), actor=('boy','boy','riding a bike','Riding a bike','sleeping','Cậu bé đang làm gì?'),
  tellme=('woman','woman',["She's walking.","She's got a green bag."],"What's she doing? (Is she walking?) / What's she got? (Has she got a green bag?)",'Hãy nói về người phụ nữ này.'),
  cards=[C('cow','cow','a','animal'),C('lion','lion','a','animal'),C('sheep','sheep','a','animal',pl='sheep'),C('kite','kite','a','thing'),C('hat','hat','a','clothes'),C('egg','egg','an','food',meal='breakfast'),C('watermelon','watermelon','a','food'),C('juice','juice','mass','food',pl='juice')],
  card1='kite', card2='hat', p3=['lion','sheep','watermelon','juice'],
  p4=[('Do you go to the market?','Em có đi chợ không?',['Yes / No'],'',['Yes or no? Do you go to the market?','Do you go with your mum?']),
      ('What do you buy at the market?','Em mua gì ở chợ?',['Fruit'],'Do you buy fruit?',['Do you buy fruit?','Do you buy fruit or toys?']),
      ('Who goes to the market with you?','Ai đi chợ cùng em?',['My mum'],'Does your mum go with you?',['Does your mum go with you?','Does your mum or your dad go with you?'])]),
]

def scene_prompt(s):
    items = "\n".join("%d. %s." % (i + 1, o) for i, o in enumerate(s['objs']))
    return "%s\n\nScene: %s. Draw exactly these items:\n%s\n\n%s" % (STYLE, s['setting'], items, RULES)

def cards_prompt(s):
    w = [c['word'] for c in s['cards']]
    top = ", ".join("%d) %s" % (i + 1, w[i]) for i in range(4))
    bot = ", ".join("%d) %s" % (i + 5, w[i + 4]) for i in range(4))
    return "%s\n\nTop row, left to right: %s.\nBottom row, left to right: %s." % (CARDS_STYLE, top, bot)

if __name__ == '__main__':
    import json, os
    here = os.path.dirname(os.path.abspath(__file__)) + '/'
    out = [dict(id=s['id'], no=s['no'], theme=s['theme'], themeVi=s['themeVi'], scene_file='%s-scene.png' % s['id'], cards_file='%s-cards.png' % s['id'],
                scene_prompt=scene_prompt(s), cards_prompt=cards_prompt(s), cards=[c['word'] for c in s['cards']], objs=s['objs']) for s in SPECS]
    json.dump(out, open(here + 'prompts.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print(len(out), 'bộ; ví dụ prompt tranh:\n'); print(out[0]['scene_prompt']); print('\n--- prompt thẻ ---\n'); print(out[0]['cards_prompt'])
