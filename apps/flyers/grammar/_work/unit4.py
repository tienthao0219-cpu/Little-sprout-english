# Unit 4 · At school  –  imperatives; could / couldn't (past ability); question words (What time…?)
from ugen import *

L1 = lesson('l1', 'mint', '📚', 'Imperatives', 'Câu mệnh lệnh trong lớp học',
 'Trong lớp cô giáo hay nói gì nhỉ? Open your book! Listen! Cùng học nhé!',
 [when('🧭 Khi nào dùng?', [
    ('📚', 'Cô giáo dùng **động từ ở đầu câu** để bảo học sinh làm gì.', 'Open your books.', 'Mở sách ra.'),
    ('🚫', 'Không được làm → **Don\'t + động từ**.', "Don't talk in class.", 'Đừng nói chuyện trong lớp.'),
    ('🙏', 'Thêm **please** cho lịch sự.', 'Please sit down.', 'Mời em ngồi xuống.')]),
  grid('📚 6 câu cô giáo hay nói', [
    ('📖', 'Open your book', 'mở sách ra', 'Open + your book'), ('👂', 'Listen', 'lắng nghe', 'Listen to me'), ('✏️', 'Write your name', 'viết tên', 'Write + your name'),
    ('🔁', 'Repeat', 'nhắc lại', 'Repeat after me'), ('🙋', 'Raise your hand', 'giơ tay', 'khi muốn nói'), ('🤫', "Don't talk", 'đừng nói chuyện', "Don't + động từ")]),
  pattern('1️⃣ Bảo làm gì: Động từ + …', 'mint', [('Động từ', 'v', 'Open, Write, Listen'), ('cái gì', 'obj', 'your book, your name'), ('please', 'pink', 'nếu muốn lịch sự')], [
    ('{Open|v} {your dictionary.|obj}', 'Mở từ điển của em ra.', V('dictionary')), ('{Repeat|v} {after me.|obj}', 'Nhắc lại theo cô.', V('repeat')),
    ('{Join|v} {the group.|obj}', 'Tham gia nhóm nhé.', V('join'))]),
  pattern("2️⃣ Đừng làm gì → Don't + động từ", 'rose', [("Don't", 'pink', 'đừng'), ('động từ', 'v', 'talk, run, forget'), ('cái gì / nơi chốn', 'obj', 'in class')], [
    ("{Don't|pink} {talk|v} {in class.|obj}", 'Đừng nói chuyện trong lớp.', EM('🤫')), ("{Don't|pink} {forget|v} {your homework.|obj}", 'Đừng quên bài tập.', EM('📝')),
    ("{Don't|pink} {be|v} {late.|obj}", 'Đừng đến muộn.', EM('⏰'))]),
  dialog('💬 Cô giáo nói – em đáp', '{Động từ|v} {+ …|obj}{!}', [
    ('{Open|v} {your books|obj} {and look at page ten.|sub}', '{Yes,|sub} {Miss Thao!|pink}', 'Mở sách ra và nhìn trang mười.', 'Vâng ạ, cô Thảo!', V('dictionary')),
    ("{Don't|pink} {talk,|v} {please.|obj}", '{Sorry,|sub} {Miss.|pink}', 'Đừng nói chuyện nhé.', 'Em xin lỗi cô ạ.', EM('🤫'))]),
  tip("💡 Mẹo: câu mệnh lệnh **bắt đầu bằng động từ**. Không được làm → **Don't + động từ**."),
  mistakes([('You open your book.', 'Open your book.', 'Câu mệnh lệnh bắt đầu bằng động từ.'), ("Don't talking in class.", "Don't talk in class.", "Sau Don't dùng động từ nguyên mẫu."),
            ('Opens your book.', 'Open your book.', 'Mệnh lệnh không thêm s.'), ('No talk in class.', "Don't talk in class.", "Cấm → Don't + động từ.")]),
  acts('a1')],
 [Mc('___ your dictionary.', 'Open', 'Opens', 'Opening', 'Mệnh lệnh → Open.', V('dictionary')),
  Mc('___ to your teacher.', 'Listen', 'Listens', 'Listening', 'Mệnh lệnh → Listen.', EM('👂')),
  Mc('___ after me, please.', 'Repeat', 'Repeats', 'Repeating', 'Mệnh lệnh → Repeat.', V('repeat')),
  Mc("Don't ___ in class.", 'talk', 'talks', 'talking', "Sau Don't dùng động từ nguyên mẫu → talk."),
  Mc('___ be late for school.', "Don't", "Doesn't", 'Not', "Cấm → Don't be late."),
  Mc('Please ___ down.', 'sit', 'sits', 'sitting', 'Mệnh lệnh → sit.'),
  Mc('___ your hand if you know the answer.', 'Raise', 'Raises', 'Raising', 'Mệnh lệnh → Raise.'),
  Mc("Don't ___ your homework!", 'forget', 'forgets', 'forgetting', "Sau Don't dùng động từ nguyên mẫu → forget.", EM('📝')),
  Mc('___ the group. We have a game.', 'Join', 'Joins', 'Joining', 'Mệnh lệnh → Join.', V('join')),
  Mc('___ your name here.', 'Write', 'Writes', 'Writing', 'Mệnh lệnh → Write.'),
  Fl('___ your book.', 'Open', ['Open', 'Opens', 'Opening'], 'Mệnh lệnh → Open.', None, '(mở)'),
  Fl('___ to me, please.', 'Listen', ['Listen', 'Listens', 'Listening'], 'Mệnh lệnh → Listen.', EM('👂'), '(lắng nghe)'),
  Fl("Don't ___ in the classroom.", 'run', ['run', 'runs', 'running'], "Sau Don't dùng động từ nguyên mẫu.", None, '(chạy)'),
  Fl('___ talk in class.', ["Don't", 'Do not'], ["Don't", 'Not', 'No'], "Cấm → Don't talk.", EM('🤫'), '(đừng)'),
  Fl('Please ___ quiet.', 'be', ['be', 'is', 'are'], 'Mệnh lệnh → be quiet.', None, '(hãy)'),
  Fl('___ after me.', 'Repeat', ['Repeat', 'Repeats', 'Repeating'], 'Mệnh lệnh → Repeat.', V('repeat')),
  Fl('Raise your ___.', 'hand', ['hand', 'hands', 'head'], 'Giơ tay → Raise your hand.', None, '(tay)'),
  Fl("Don't be ___!", 'late', ['late', 'lately', 'lates'], "Đừng đến muộn → Don't be late.", EM('⏰')),
  Fl('___ your homework, please.', ['Do', 'Finish'], ['Do', 'Does', 'Doing'], 'Mệnh lệnh → Do your homework.', None, '(làm)'),
  Fl('___ the group, please.', 'Join', ['Join', 'Joins', 'Joining'], 'Mệnh lệnh → Join.', V('join'))],
 [Dlg(['Teacher: Good morning, class!'], 'Teacher: ___ your books, please.', 'Open', 'Opens', 'Opening', 'Mệnh lệnh → Open.'),
  Dlg(['Boy: Can I talk to Tom?'], "Teacher: No, ___ talk in class.", "don't", "doesn't", 'not', "Cấm → Don't talk."),
  Dlg(['Pupil: What can I do now?'], 'Teacher: ___ your name here.', 'Write', 'Writes', 'Writing', 'Mệnh lệnh → Write.'),
  Clz(['Our teacher is Miss Lan.', 'She is very kind.'], "She says: '___ to me, please.'", 'Listen', 'Listens', 'Listening', 'Mệnh lệnh → Listen.'),
  Clz(['It is nine o\'clock.', 'The lesson starts now.'], '___ be late!', "Don't", "Doesn't", 'Not', "Cấm → Don't be late."),
  Clz(['We have a quiz.', 'Look at question one.'], '___ the answer on your paper.', 'Write', 'Writes', 'Writing', 'Mệnh lệnh → Write.', V('quiz'))])

L2 = lesson('l2', 'peach', '⏪', "could / couldn't (past ability)", 'Ngày trước làm được / không làm được',
 'Hồi nhỏ em làm được gì? Dùng could và couldn\'t để kể chuyện ngày trước nhé!',
 [when('🧭 Khi nào dùng?', [
    ('⏪', "**could** = ngày trước **đã làm được**, **couldn't** = **không làm được**.", 'I could swim when I was five.', 'Hồi 5 tuổi mình đã biết bơi.'),
    ('🧒', 'Hay đi với **when I was …** (khi mình …) hoặc **last year** (năm ngoái).', "When I was two, I couldn't walk.", 'Hồi 2 tuổi mình chưa đi được.'),
    ('❓', "Hỏi: **Could you …?** Trả lời: **Yes, I could.** / **No, I couldn't.**", 'Could you read when you were four?', 'Lúc 4 tuổi bạn đọc được chưa?')]),
  compare('🗂 So sánh can và could', [
    CI("can / can't", 'sub', 'bây giờ', 'Nói về **bây giờ**: làm được / không làm được.', [('I can read now.', 'Bây giờ mình đọc được.'), ("I can't swim yet.", 'Mình chưa biết bơi.')], EM('⏰')),
    CI("could / couldn't", 'aux', 'ngày trước', 'Nói về **ngày trước**: đã làm được / chưa làm được.', [('I could read when I was five.', 'Hồi 5 tuổi mình đã đọc được.'), ("I couldn't swim last year.", 'Năm ngoái mình chưa biết bơi.')], EM('⏪'))]),
  pattern('1️⃣ could = ngày trước làm được', 'sky', [('Ai', 'sub', 'I, she, we'), ('could', 'aux', 'đã làm được'), ('động từ', 'v', 'swim, read'), ('khi nào', 'obj', 'when I was six')], [
    ('{I|sub} {could|aux} {swim|v} {when I was six.|obj}', 'Hồi 6 tuổi mình biết bơi.', EM('🏊')), ('{She|sub} {could|aux} {ride|v} {a bike last year.|obj}', 'Năm ngoái cô ấy đã biết đi xe đạp.', EM('🚲')),
    ('{We|sub} {could|aux} {study|v} {together.|obj}', 'Chúng mình đã học cùng nhau được.', V('study'))]),
  pattern("2️⃣ couldn't = ngày trước không làm được", 'rose', [('Ai', 'sub', 'I, he, the baby'), ("couldn't", 'pink', 'không làm được'), ('động từ', 'v', 'read, walk'), ('khi nào', 'obj', 'when I was two')], [
    ("{I|sub} {couldn't|pink} {read|v} {when I was two.|obj}", 'Hồi 2 tuổi mình chưa biết đọc.', EM('📖')), ("{The baby|sub} {couldn't|pink} {walk.|v}", 'Em bé chưa đi được.', EM('👶')),
    ("{He|sub} {couldn't|pink} {write|v} {his name.|obj}", 'Cậu ấy chưa viết được tên.', EM('✏️'))]),
  dialog('❓ Hỏi và trả lời với Could', '{Could|aux} {you|sub} {…|v} {when you were …?|obj}', [
    ('{Could|aux} {you|sub} {swim|v} {when you were five?|obj}', '{Yes,|sub} {I could.|aux}', 'Hồi 5 tuổi bạn biết bơi chưa?', 'Rồi, mình biết.', EM('🏊')),
    ('{Could|aux} {you|sub} {read|v} {when you were two?|obj}', "{No,|sub} {I couldn't.|pink}", 'Hồi 2 tuổi bạn đọc được chưa?', 'Chưa, mình chưa đọc được.', EM('📖'))]),
  tip("💡 Mẹo: **could / couldn't + động từ nguyên mẫu** (không thêm s, không có to). Hỏi: đưa **Could** lên đầu câu."),
  mistakes([('I could to swim.', 'I could swim.', 'Sau could không có to.'), ("I couldn't swam.", "I couldn't swim.", "Sau couldn't dùng động từ nguyên mẫu."),
            ('She coulds read.', 'She could read.', 'could không thêm s.'), ('Did you could swim?', 'Could you swim?', 'Hỏi: đưa Could lên đầu câu.')]),
  acts('a2')],
 [Mc('When I was five, I ___ swim.', 'could', 'can', 'am', 'Ngày trước làm được → could.', EM('🏊')),
  Mc('Last year I ___ read English. Now I can!', "couldn't", "can't", "don't", "Năm ngoái chưa đọc được → couldn't."),
  Mc('When he was nine months old, my brother ___ walk. He was too small.', "couldn't", 'could', 'can', "Còn quá nhỏ → couldn't."),
  Mc('___ you ride a bike when you were six?', 'Could', 'Can', 'Are', 'Hỏi ngày trước → Could you…?'),
  Mc('I ___ swim when I was four. I was a good swimmer.', 'could', "couldn't", "can't", 'Bơi giỏi → could.'),
  Mc('She ___ read last year. Now she is learning the letters.', "couldn't", 'could', 'can', "Bây giờ mới học chữ → couldn't."),
  Mc('I could ___ when I was five.', 'swim', 'swam', 'swimming', 'Sau could dùng động từ nguyên mẫu → swim.'),
  Mc("He couldn't ___ his name when he was two.", 'write', 'wrote', 'writing', "Sau couldn't dùng động từ nguyên mẫu → write."),
  Mc('A: Could you swim last year? B: No, I ___.', "couldn't", "can't", "wasn't", "Trả lời No → No, I couldn't."),
  Mc('They ___ run fast when they were young. They were strong.', 'could', "couldn't", 'can', 'Khoẻ → could.'),
  Fl('When I was six, I ___ ride a bike.', 'could', ['could', 'can', 'am'], 'Ngày trước làm được → could.', None, '(đã biết)'),
  Fl('I ___ read last year, but now I can.', "couldn't", ['could', "couldn't", 'can'], "Năm ngoái chưa đọc được → couldn't.", None, '(chưa …được)'),
  Fl('___ you swim when you were five?', 'Could', ['Could', 'Can', 'Are'], 'Hỏi ngày trước → Could you…?'),
  Fl('A: Could you read? B: Yes, I ___.', 'could', ['could', 'can', 'am'], 'Trả lời Yes → Yes, I could.'),
  Fl('A: Could he swim? B: No, he ___.', "couldn't", ['could', "couldn't", "can't"], "Trả lời No → No, he couldn't."),
  Fl('I could ___ when I was five.', 'swim', ['swim', 'swam', 'swimming'], 'Sau could dùng động từ nguyên mẫu.', EM('🏊')),
  Fl("I couldn't ___ a bike when I was three.", 'ride', ['ride', 'rode', 'riding'], "Sau couldn't dùng động từ nguyên mẫu.", None, '(đi xe đạp)'),
  Fl('When I was one, I ___ walk. I was too small.', "couldn't", ['could', "couldn't", 'can'], "Còn quá nhỏ → couldn't.", EM('👶')),
  Fl('We ___ speak English last year, but now we can.', "couldn't", ['could', "couldn't", "can't"], "Năm ngoái chưa nói được → couldn't."),
  Fl('My grandma ___ run fast when she was young.', 'could', ['could', "couldn't", 'can'], 'Hồi trẻ chạy nhanh → could.')],
 [Dlg(['Mum: Could you swim when you were five, Tom?'], 'Tom: Yes, I ___. I loved the water.', 'could', "couldn't", 'can', 'Trả lời Yes → I could.'),
  Dlg(['Girl: Can you read this book?'], 'Boy: Now I can, but last year I ___.', "couldn't", "can't", 'could', "Năm ngoái chưa đọc được → couldn't."),
  Dlg(['Teacher: Could you write when you were three?'], "Pupil: No, I ___. I was too small.", "couldn't", 'could', "can't", "Còn nhỏ → couldn't."),
  Clz(['My grandpa is seventy.', 'He is very strong.'], 'He ___ run fast when he was young.', 'could', "couldn't", 'can', 'Hồi trẻ chạy nhanh → could.'),
  Clz(['Last year, I started English lessons.', 'Now I speak a lot of English.'], 'Before that, I ___ speak English.', "couldn't", "can't", 'could', "Trước đó chưa nói được → couldn't."),
  Clz(['Yesterday I was ill.', 'My head hurt a lot.'], "I ___ go to school.", "couldn't", "can't", 'could', "Hôm qua bị ốm → couldn't.")])

L3 = lesson('l3', 'sky', '❓', 'Question words', 'Từ để hỏi',
 'Muốn biết thông tin thì dùng từ để hỏi nào? Cùng xem nhé!',
 [grid('❓ 8 từ để hỏi', [
    ('❓', 'What', 'cái gì', 'What is it?'), ('🕐', 'What time', 'mấy giờ', 'What time is Maths?'), ('👤', 'Who', 'ai', 'Who is your teacher?'), ('📍', 'Where', 'ở đâu', 'Where is the art room?'),
    ('📅', 'When', 'khi nào', 'When is the quiz?'), ('💭', 'Why', 'tại sao', 'Why are you happy?'), ('🛠️', 'How', 'như thế nào', 'How do you go to school?'), ('🔢', 'How many', 'bao nhiêu', 'How many students?')]),
  table('🗂 Hỏi gì → trả lời gì', ['❓ Từ để hỏi', '🎯 Hỏi về', '✏️ Trả lời'], [
    ['**What time**', 'giờ', "At nine o'clock."], ['**Who**', 'người', 'Miss Lan.'], ['**Where**', 'nơi chốn', 'In room five.'],
    ['**When**', 'thời gian', 'On Monday.'], ['**Why**', 'lý do', 'Because it is fun.'], ['**How many**', 'số lượng', 'Thirty.']], ['rose', 'lav', 'butter']),
  pattern('Từ để hỏi + is / are / do + …', 'sky', [('Từ để hỏi', 'pink', 'What time, Where'), ('is / are', 'aux', 'là'), ('chủ ngữ', 'sub', 'Maths, the library'), ('?', 'v', '')], [
    ('{What time|pink} {is|aux} {the music lesson?|sub}', 'Giờ nhạc là mấy giờ?', V('music')), ('{Where|pink} {is|aux} {the art room?|sub}', 'Phòng mỹ thuật ở đâu?', V('art')),
    ('{Who|pink} {is|aux} {your teacher?|sub}', 'Ai là cô giáo của em?', EM('👩‍🏫'))]),
  dialog('❓ Hỏi và trả lời', '{Từ để hỏi|pink} {is|aux} {…|sub}{?}', [
    ('{What time|pink} {is|aux} {Maths?|sub}', "{At|sub} {nine o'clock.|obj}", 'Mấy giờ học Toán?', 'Lúc chín giờ.', V('maths')),
    ('{Where|pink} {is|aux} {the library?|sub}', '{It is|aux} {near the playground.|obj}', 'Thư viện ở đâu?', 'Nó ở gần sân chơi.', EM('📚'))]),
  tip('💡 Mẹo: **Từ để hỏi + is / are / do …?** — nhìn câu trả lời để chọn: người → Who · nơi → Where · giờ → What time · số lượng → How many.'),
  mistakes([('What time Maths is?', 'What time is Maths?', 'Câu hỏi: từ để hỏi + is + chủ ngữ.'), ('Where you are?', 'Where are you?', 'Đặt are trước you.'),
            ('Who is you teacher?', 'Who is your teacher?', 'your = của bạn.'), ('How much students are there?', 'How many students are there?', 'Đếm được → How many.')]),
  acts('a3')],
 [Mc('___ is your teacher? – Miss Lan.', 'Who', 'Where', 'When', 'Hỏi về người → Who.'),
  Mc('___ is the library? – It is next to the gym.', 'Where', 'Who', 'Why', 'Hỏi nơi chốn → Where.'),
  Mc("___ time is Maths? – At nine o'clock.", 'What', 'When', 'Who', 'Hỏi giờ → What time.', V('maths')),
  Mc('___ is the quiz? – On Friday.', 'When', 'Where', 'Who', 'Hỏi thời gian → When.', V('quiz')),
  Mc("___ are you happy? – Because it's my birthday.", 'Why', 'Who', 'Where', 'Hỏi lý do → Why.'),
  Mc('___ students are there? – Thirty.', 'How many', 'How much', 'What', 'Hỏi số lượng đếm được → How many.'),
  Mc('___ do you go to school? – By bus.', 'How', 'Who', 'Why', 'Hỏi cách đi → How.'),
  Mc('___ is that? – It is a dictionary.', 'What', 'Who', 'Where', 'Hỏi vật → What.', V('dictionary')),
  Mc('Where ___ you from?', 'are', 'is', 'do', 'Where are you from? (are đi với you).'),
  Mc('What time ___ the lesson start?', 'does', 'do', 'is', 'What time does the lesson start?'),
  Fl('___ is your teacher?', 'Who', ['Who', 'Where', 'When'], 'Hỏi về người → Who.', None, '(ai)'),
  Fl('___ is the art room?', 'Where', ['Where', 'Who', 'Why'], 'Hỏi nơi chốn → Where.', V('art'), '(ở đâu)'),
  Fl("What ___ is it? – Ten o'clock.", 'time', ['time', 'times', 'timing'], 'Hỏi giờ → What time.', None, '(giờ)'),
  Fl("___ are you sad? – Because I lost my book.", 'Why', ['Why', 'Who', 'When'], 'Hỏi lý do → Why.', None, '(tại sao)'),
  Fl('How ___ students are there?', 'many', ['many', 'much', 'more'], 'Đếm được → How many.', None, '(bao nhiêu)'),
  Fl('___ do you study? – In the library.', 'Where', ['Where', 'Who', 'Why'], 'Hỏi nơi chốn → Where.'),
  Fl('___ do you go to school? – By bike.', 'How', ['How', 'Who', 'Why'], 'Hỏi cách đi → How.'),
  Fl('___ is your birthday? – In May.', 'When', ['When', 'Where', 'Who'], 'Hỏi thời gian → When.', None, '(khi nào)'),
  Fl('What ___ is Music? – At ten.', 'time', ['time', 'times', 'timing'], 'Hỏi giờ → What time.', V('music')),
  Fl('___ is your favourite subject? – Maths.', 'What', ['What', 'Who', 'Where'], 'Hỏi vật / môn → What.', V('maths'))],
 [Dlg(['Ben: Hi! I am new here.'], 'Amy: ___ is your name?', 'What', 'Who', 'Where', 'Hỏi tên (vật) → What.'),
  Dlg(['Boy: I have a quiz today.'], 'Girl: ___ is the quiz? At ten?', 'What time', 'Who', 'How many', 'Hỏi giờ → What time.', V('quiz')),
  Dlg(['Teacher: It is the school trip tomorrow.'], 'Pupil: ___ are we going? To the museum?', 'Where', 'Who', 'Why', 'Hỏi nơi chốn → Where.'),
  Clz(['There are many pupils in my school.', 'Look at the picture.'], '___ pupils are in class one? Twenty-eight.', 'How many', 'How much', 'What', 'Hỏi số lượng đếm được → How many.'),
  Clz(['I like Mondays.', 'We have art and music.'], '___ do you have art? On Monday.', 'When', 'Who', 'How many', 'Hỏi thời gian → When.', V('art')),
  Clz(['Ben is crying.', 'His friend asks him.'], '___ are you sad?', 'Why', 'Who', 'When', 'Hỏi lý do → Why.')])

A = [
 slot('a1', '⚡ Luyện nhanh: kéo đúng chữ vào lời cô giáo', 'Nhìn hình rồi kéo chữ vào chỗ trống (hoặc chạm chữ rồi chạm câu).', [
   Sl('s1', '___ your dictionary.', 'Open', V('dictionary')), Sl('s2', '___ after me.', 'Repeat', V('repeat')), Sl('s3', '___ the group.', 'Join', V('join')),
   Sl('s4', "___ talk in class.", "Don't", EM('🤫')), Sl('s5', '___ to the teacher.', 'Listen', EM('👂'))], ['Open', 'Repeat', 'Join', "Don't", 'Listen']),
 bucket('a2', "⚡ Luyện nhanh: bây giờ hay ngày trước?", 'Kéo mỗi câu vào ô đúng: bây giờ (can / can\'t) hoặc ngày trước (could / couldn\'t).', [
   {'id': 'now', 'label': '⏰ Bây giờ (can / can\'t)', 'c': 'mint'}, {'id': 'past', 'label': '⏪ Ngày trước (could / couldn\'t)', 'c': 'peach'}], [
   {'label': 'I can swim now.', 'g': 'now'}, {'label': 'I could swim last year.', 'g': 'past'}, {'label': "He can't read yet.", 'g': 'now'},
   {'label': "She couldn't walk when she was one.", 'g': 'past'}, {'label': 'We can play chess.', 'g': 'now'}, {'label': 'They could run fast when they were six.', 'g': 'past'}]),
 bucket('a3', '⚡ Luyện nhanh: câu trả lời này cho từ để hỏi nào?', 'Kéo mỗi câu trả lời vào ô đúng: Who? · Where? · What time?', [
   {'id': 'who', 'label': '👤 Who? (ai)', 'c': 'peach'}, {'id': 'where', 'label': '📍 Where? (ở đâu)', 'c': 'sky'}, {'id': 'time', 'label': '🕐 What time? (mấy giờ)', 'c': 'mint'}], [
   {'label': 'Miss Lan.', 'g': 'who'}, {'label': 'My mum.', 'g': 'who'}, {'label': 'In room five.', 'g': 'where'}, {'label': 'At the library.', 'g': 'where'},
   {'label': "At nine o'clock.", 'g': 'time'}, {'label': 'At half past ten.', 'g': 'time'}])]

u = build_unit(4, 'unit-4', 'At school', 'Ở trường', '📚', 'flyers--unit-4-5yam', [L1, L2, L3], A)
save_unit(u)
