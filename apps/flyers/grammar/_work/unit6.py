# Unit 6 · Jobs  –  chủ điểm do cô Thảo cung cấp: I'd like / I wouldn't like; like/love/hate + -ing;
# Where questions (Where does a doctor work?); could (possibility)
from ugen import *

L1 = lesson('l1', 'peach', '🌟', "I'd like… / I wouldn't like…", 'Em muốn / không muốn làm gì?',
 "Nói điều em muốn trở thành khi lớn lên nhé! I'd like to be… (em muốn làm…).",
 [when('🧭 Khi nào dùng?', [
    ('🌟', "**I'd like to be + nghề** = Em muốn làm nghề …", "I'd like to be a doctor.", 'Em muốn làm bác sĩ.'),
    ('🙅', "**I wouldn't like to be + nghề** = Em không muốn làm nghề …", "I wouldn't like to be a dentist.", 'Em không muốn làm nha sĩ.'),
    ('❓', "**Would you like to be …?** = Bạn có muốn làm … không?", 'Would you like to be a pilot?', 'Bạn có muốn làm phi công không?')]),
  table('🗂 Ba kiểu câu', ['✅ Muốn', '❌ Không muốn', '❓ Hỏi'], [
    ["I'd like to be a pilot.", "I wouldn't like to be a pilot.", 'Would you like to be a pilot?'],
    ["She'd like to be a nurse.", "She wouldn't like to be a nurse.", 'Would she like to be a nurse?'],
    ["They'd like to be singers.", "They wouldn't like to be singers.", 'Would they like to be singers?']], ['mint', 'rose', 'sky']),
  pattern("1️⃣ Muốn: I'd like to be…", 'peach', [("subject + 'd", 'sub', "I'd, she'd"), ('like to', 'aux', 'muốn'), ('be', 'v', 'là / làm'), ('job', 'obj', 'a doctor')], [
    ("{I'd|sub} {like to|aux} {be|v} {a doctor.|obj}", 'Em muốn làm bác sĩ.', V('doctor')), ("{She'd|sub} {like to|aux} {be|v} {a singer.|obj}", 'Cô ấy muốn làm ca sĩ.', V('singer')),
    ("{We'd|sub} {like to|aux} {be|v} {pilots.|obj}", 'Chúng mình muốn làm phi công.', V('pilot'))]),
  pattern("2️⃣ Không muốn: I wouldn't like to be…", 'rose', [('subject', 'sub', 'I, he, they'), ("wouldn't like to", 'pink', 'không muốn'), ('be', 'v', 'là / làm'), ('job', 'obj', 'a dentist')], [
    ("{I|sub} {wouldn't like to|pink} {be|v} {a dentist.|obj}", 'Em không muốn làm nha sĩ.', V('dentist')), ("{He|sub} {wouldn't like to|pink} {be|v} {a waiter.|obj}", 'Cậu ấy không muốn làm bồi bàn.', V('waiter')),
    ("{They|sub} {wouldn't like to|pink} {be|v} {mechanics.|obj}", 'Họ không muốn làm thợ máy.', V('mechanic'))]),
  dialog('❓ Hỏi và trả lời', '{Would|aux} {you|sub} {like to be|pink} {a …?|obj}', [
    ('{Would|aux} {you|sub} {like to be|pink} {a nurse?|obj}', "{Yes,|sub} {I would.|aux}", 'Bạn có muốn làm y tá không?', 'Có, mình muốn.', V('nurse')),
    ('{Would|aux} {you|sub} {like to be|pink} {a cook?|obj}', "{No,|sub} {I wouldn't.|pink}", 'Bạn có muốn làm đầu bếp không?', 'Không, mình không muốn.', V('cook'))]),
  tip("💡 Mẹo: **I'd like = I would like**. Sau **like to** luôn là **be + nghề** hoặc một động từ nguyên mẫu."),
  mistakes([("I'd like be a pilot.", "I'd like to be a pilot.", 'Thiếu to.'), ("She'd like to be a nurses.", "She'd like to be a nurse.", 'Một người → a nurse.'),
            ("I wouldn't like to being a dentist.", "I wouldn't like to be a dentist.", 'Sau to dùng be.'), ('Would you like to be a doctor? Yes, I like.', 'Would you like to be a doctor? Yes, I would.', 'Trả lời lại bằng would.')]),
  acts('a1')],
 [Mc("I'd like ___ be a doctor.", 'to', 'for', 'at', "I'd like to be…", V('doctor')),
  Mc("She'd like to ___ a singer.", 'be', 'is', 'being', 'Sau to dùng be.', V('singer')),
  Mc("I ___ like to be a dentist. (không muốn)", "wouldn't", "don't", "isn't", "I wouldn't like to be…", V('dentist')),
  Mc('___ you like to be a pilot?', 'Would', 'Are', 'Do', 'Would you like to be…?', V('pilot')),
  Mc("A: Would you like to be a nurse? B: Yes, I ___.", 'would', 'like', 'am', 'Trả lời Yes, I would.', V('nurse')),
  Mc("He'd like to be a ___.", 'cook', 'cooks', 'cooking', 'Sau a dùng danh từ số ít.', V('cook')),
  Mc("They ___ like to be mechanics.", "wouldn't", 'doesn\'t', 'isn\'t', "They wouldn't like to be…", V('mechanic')),
  Mc("We'd like to be ___.", 'astronauts', 'astronaut', 'an astronauts', 'Nhiều người → astronauts.', V('astronaut')),
  Mc('A: Would she like to be a teacher? B: No, she ___.', "wouldn't", "doesn't", "isn't", "Trả lời No, she wouldn't.", V('teacher')),
  Mc("I'd like to be ___ artist.", 'an', 'a', 'the', 'artist bắt đầu bằng nguyên âm → an.', V('artist')),
  Fl("I'd like ___ be a doctor.", 'to', ['to', 'for', 'at'], "I'd like to be…", V('doctor')),
  Fl("She'd like to ___ a nurse.", 'be', ['be', 'is', 'being'], 'Sau to dùng be.', V('nurse')),
  Fl("I ___ like to be a waiter.", "wouldn't", ["wouldn't", "don't", "isn't"], "I wouldn't like to be…", V('waiter'), '(không muốn)'),
  Fl('___ he like to be a pilot?', 'Would', ['Would', 'Is', 'Does'], 'Would he like to be…?', V('pilot')),
  Fl("A: Would you like to be a singer? B: Yes, I ___.", 'would', ['would', 'like', 'am'], 'Trả lời Yes, I would.', V('singer')),
  Fl("They'd like to be ___.", 'engineers', ['engineers', 'engineer', 'an engineers'], 'Nhiều người → engineers.', V('engineer')),
  Fl("He ___ like to be a dentist.", "wouldn't", ["wouldn't", "isn't", "doesn't"], "He wouldn't like to be…", V('dentist'), '(không muốn)'),
  Fl("I'd like to be ___ doctor.", 'a', ['a', 'an', 'the'], 'doctor bắt đầu bằng phụ âm → a.', V('doctor')),
  Fl("We'd like to ___ astronauts.", 'be', ['be', 'are', 'is'], 'Sau to dùng be.', V('astronaut')),
  Fl("A: Would they like to be cooks? B: No, they ___.", "wouldn't", ["wouldn't", "aren't", "don't"], "Trả lời No, they wouldn't.", V('cook'))],
 [Dlg(['Teacher: What would you like to be?'], "Tom: I'd like ___ be a pilot.", 'to', 'for', 'at', "I'd like to be…", V('pilot')),
  Dlg(['Mum: Would you like to be a doctor?'], "Amy: No, I ___.", "wouldn't", "don't", "am not", "Trả lời No, I wouldn't.", V('doctor')),
  Dlg(['Boy: Would you like to be a singer?'], 'Girl: Yes, I ___.', 'would', 'like', 'am', 'Trả lời Yes, I would.', V('singer')),
  Clz(['Ben loves animals.', 'He often helps sick pets.'], "He'd like ___ be a doctor for animals.", 'to', 'for', 'at', "He'd like to be…"),
  Clz(['Amy is afraid of dentists.', 'She does not like teeth.'], "She ___ like to be a dentist.", "wouldn't", "doesn't", "isn't", "She wouldn't like to be…", V('dentist')),
  Clz(['My brother likes planes.', 'He often looks at the sky.'], "He'd like to be a ___.", 'pilot', 'pilots', 'piloting', 'a + danh từ số ít.', V('pilot'))])

L2 = lesson('l2', 'sky', '❤️', 'like / love / hate + -ing', 'Thích / yêu thích / ghét làm gì',
 'Nói về điều em thích hay ghét làm: like, love, hate + động từ thêm -ing.',
 [when('🧭 Khi nào dùng?', [
    ('👍', '**like + V-ing** = thích làm gì.', 'I like singing.', 'Mình thích hát.'),
    ('❤️', '**love + V-ing** = rất thích làm gì.', 'She loves cooking.', 'Cô ấy rất thích nấu ăn.'),
    ('👎', '**hate + V-ing** = ghét làm gì.', 'He hates waiting.', 'Cậu ấy ghét phải chờ.')]),
  compare('🗂 So sánh like, love và hate', [
    CI('like + V-ing', 'sub', 'thích', 'Thích **vừa phải**.', [('I like singing.', 'Mình thích hát.')], EM('🙂')),
    CI('love + V-ing', 'pink', 'rất thích', 'Thích **rất nhiều**.', [('She loves cooking.', 'Cô ấy rất thích nấu ăn.')], V('cook')),
    CI('hate + V-ing', 'aux', 'ghét', '**Không thích** chút nào.', [('He hates washing up.', 'Cậu ấy ghét rửa chén.')], EM('😖'))]),
  pattern('1️⃣ Công thức: like / love / hate + V-ing', 'sky', [('subject', 'sub', 'I, she'), ('like / love / hate', 'aux', 'thích, ghét'), ('V-ing', 'v', 'singing, cooking'), ('thing', 'obj', 'songs')], [
    ('{I|sub} {like|aux} {singing|v} {songs.|obj}', 'Mình thích hát.', V('singer')), ('{She|sub} {loves|aux} {cooking|v} {dinner.|obj}', 'Cô ấy rất thích nấu bữa tối.', V('cook')),
    ('{He|sub} {hates|aux} {swimming|v} {in cold water.|obj}', 'Cậu ấy ghét bơi nước lạnh.', EM('🏊'))]),
  dialog('❓ Hỏi và trả lời', '{Do|aux} {you|sub} {like|pink} {+ V-ing?|v}', [
    ('{Do|aux} {you|sub} {like|pink} {swimming?|v}', '{Yes,|sub} {I do.|aux}', 'Bạn có thích bơi không?', 'Có, mình thích.', EM('🏊')),
    ('{Does|aux} {he|sub} {like|pink} {cooking?|v}', "{No,|sub} {he doesn't.|pink}", 'Cậu ấy có thích nấu ăn không?', 'Không, cậu ấy không thích.', V('cook'))]),
  tip("💡 Mẹo: sau **like, love, hate** dùng **V-ing**. Quy tắc thêm -ing: swim → **swimming** (gấp đôi chữ cuối), make → **making** (bỏ e)."),
  mistakes([('I like sing.', 'I like singing.', 'Sau like dùng V-ing.'), ('She loves to cooking.', 'She loves cooking.', 'Không thêm to.'),
            ('He hate swimming.', 'He hates swimming.', 'He → hates.'), ('I like swiming.', 'I like swimming.', 'swim gấp đôi m → swimming.')]),
  acts('a2')],
 [Mc('I like ___ songs.', 'singing', 'sing', 'sings', 'Sau like dùng V-ing.', V('singer')),
  Mc('She loves ___ dinner.', 'cooking', 'cook', 'cooks', 'Sau loves dùng V-ing.', V('cook')),
  Mc('He hates ___ in cold water.', 'swimming', 'swim', 'swims', 'Sau hates dùng V-ing; swim → swimming.'),
  Mc('My mum likes ___ pictures.', 'painting', 'paint', 'paints', 'Sau likes dùng V-ing.', V('artist')),
  Mc('They love ___ football.', 'playing', 'play', 'plays', 'Sau love dùng V-ing.'),
  Mc('He ___ waiting for the bus.', 'hates', 'hate', 'hating', 'He → hates.'),
  Mc('Do you like ___ photos?', 'taking', 'take', 'takes', 'Sau like dùng V-ing.', V('photographer')),
  Mc('Tom ___ drawing. He draws every day.', 'loves', 'love', 'loving', 'Tom → loves.'),
  Mc('Amy hates ___ the dishes.', 'washing', 'wash', 'washes', 'Sau hates dùng V-ing.'),
  Mc('A: Does she like dancing? B: Yes, she ___.', 'does', 'do', 'is', 'Trả lời Yes, she does.'),
  Fl('I like ___ songs. (sing)', 'singing', ['singing', 'sing', 'sings'], 'Sau like dùng V-ing.', V('singer')),
  Fl('She loves ___ pictures. (paint)', 'painting', ['painting', 'paint', 'paints'], 'Sau loves dùng V-ing.', V('artist')),
  Fl('He hates ___ at the dentist. (wait)', 'waiting', ['waiting', 'wait', 'waits'], 'Sau hates dùng V-ing.', V('dentist')),
  Fl('They like ___ football. (play)', 'playing', ['playing', 'play', 'plays'], 'Sau like dùng V-ing.'),
  Fl('My dad ___ cooking. (love)', 'loves', ['loves', 'love', 'loving'], 'My dad → loves.', V('cook')),
  Fl('I hate ___ in the rain. (run)', 'running', ['running', 'run', 'runs'], 'run gấp đôi n → running.', None, '(chạy)'),
  Fl('Do you like ___ photos? (take)', 'taking', ['taking', 'take', 'takes'], 'Sau like dùng V-ing.', V('photographer')),
  Fl('She likes ___ the piano. (play)', 'playing', ['playing', 'play', 'plays'], 'Sau likes dùng V-ing.'),
  Fl('He ___ swimming. He is afraid of water. (hate)', 'hates', ['hates', 'hate', 'hating'], 'He → hates.'),
  Fl('A: Do you like dancing? B: Yes, I ___.', 'do', ['do', 'am', 'like'], 'Trả lời Yes, I do.')],
 [Dlg(['Mum: What do you like doing?'], 'Tom: I like ___ football.', 'playing', 'play', 'plays', 'Sau like dùng V-ing.'),
  Dlg(['Girl: Does your sister like cooking?'], 'Boy: Yes, she ___ it.', 'loves', 'love', 'loving', 'Your sister → loves.', V('cook')),
  Dlg(['Teacher: Do you like singing?'], "Pupil: No, I ___ singing.", 'hate', 'hates', 'hating', 'I → hate.', V('singer')),
  Clz(['Ben is a good swimmer.', 'He goes to the pool every day.'], 'He loves ___.', 'swimming', 'swim', 'swims', 'Sau loves dùng V-ing.'),
  Clz(['Amy is afraid of the dentist.', 'She feels nervous in the chair.'], 'She hates ___ to the dentist.', 'going', 'go', 'goes', 'Sau hates dùng V-ing.', V('dentist')),
  Clz(['My dad is a cook.', 'He makes tasty food.'], 'He loves ___ for us.', 'cooking', 'cook', 'cooks', 'Sau loves dùng V-ing.', V('cook'))])

L3 = lesson('l3', 'mint', '📍', 'Where questions', 'Hỏi nơi làm việc: Where does a … work?',
 'Hỏi xem mỗi nghề làm việc ở đâu: Where does a doctor work?',
 [when('🧭 Khi nào dùng?', [
    ('❓', '**Where does a / an + nghề + work?** = Một … làm việc ở đâu?', 'Where does a doctor work?', 'Bác sĩ làm việc ở đâu?'),
    ('📍', 'Trả lời: **A / An + nghề + works + in / at + nơi chốn.**', 'A doctor works in a hospital.', 'Bác sĩ làm việc ở bệnh viện.'),
    ('👥', 'Nhiều người: **Where do + nghề (số nhiều) + work?**', 'Where do pilots work?', 'Phi công làm việc ở đâu?')]),
  table('🗂 Hỏi và trả lời', ['❓ Hỏi', '✅ Trả lời'], [
    ['Where does a doctor work?', 'A doctor works in a hospital.'], ['Where does a pilot work?', 'A pilot works on a plane.'],
    ['Where does a teacher work?', 'A teacher works at a school.'], ['Where do cooks work?', 'Cooks work in a kitchen.']], ['sky', 'mint']),
  pattern('1️⃣ Hỏi: Where does a … work?', 'mint', [('Where', 'pink', 'ở đâu'), ('does', 'aux', ''), ('a + job', 'sub', 'a doctor'), ('work?', 'v', 'làm việc')], [
    ('{Where|pink} {does|aux} {a doctor|sub} {work?|v}', 'Bác sĩ làm việc ở đâu?', V('doctor')), ('{Where|pink} {does|aux} {a teacher|sub} {work?|v}', 'Giáo viên làm việc ở đâu?', V('teacher')),
    ('{Where|pink} {does|aux} {a nurse|sub} {work?|v}', 'Y tá làm việc ở đâu?', V('nurse'))]),
  pattern('2️⃣ Trả lời: A … works in / at …', 'peach', [('a + job', 'sub', 'a doctor'), ('works', 'v', 'làm việc'), ('in / at', 'pre', 'ở'), ('place', 'obj', 'a hospital')], [
    ('{A doctor|sub} {works|v} {in|pre} {a hospital.|obj}', 'Bác sĩ làm việc ở bệnh viện.', V('doctor')), ('{A teacher|sub} {works|v} {at|pre} {a school.|obj}', 'Giáo viên làm việc ở trường.', V('teacher')),
    ('{A cook|sub} {works|v} {in|pre} {a kitchen.|obj}', 'Đầu bếp làm việc trong bếp.', V('cook'))]),
  tip('💡 Mẹo: **does** + **a doctor (một người)** → động từ **work** không thêm s. Câu trả lời mới thêm **works**. Nhiều người → **do … work**.'),
  mistakes([('Where do a doctor work?', 'Where does a doctor work?', 'a doctor (một người) → does.'), ('Where does a doctor works?', 'Where does a doctor work?', 'Sau does dùng work.'),
            ('A doctor work in a hospital.', 'A doctor works in a hospital.', 'a doctor → works.'), ('Where does pilots work?', 'Where do pilots work?', 'pilots (nhiều người) → do.')]),
  acts('a3')],
 [Mc('Where ___ a doctor work?', 'does', 'do', 'is', 'a doctor (một người) → does.', V('doctor')),
  Mc('A doctor works ___ a hospital.', 'in', 'on', 'under', 'in a hospital.', V('doctor')),
  Mc('Where do pilots ___?', 'work', 'works', 'working', 'Sau do dùng work.', V('pilot')),
  Mc('A teacher works ___ a school.', 'at', 'on', 'under', 'at a school.', V('teacher')),
  Mc('A: Where does a cook work? B: A cook works in a ___.', 'kitchen', 'hospital', 'plane', 'Đầu bếp làm việc trong bếp.', V('cook')),
  Mc('Where ___ nurses work?', 'do', 'does', 'is', 'nurses (nhiều người) → do.', V('nurse')),
  Mc('A nurse ___ in a hospital.', 'works', 'work', 'working', 'a nurse → works.'),
  Mc('Where does an engineer ___?', 'work', 'works', 'working', 'Sau does dùng work.', V('engineer')),
  Mc('A pilot works ___ a plane.', 'on', 'in', 'under', 'on a plane.', V('pilot')),
  Mc('A: Where does a waiter work? B: A waiter works in a ___.', 'restaurant', 'hospital', 'school', 'Bồi bàn làm việc ở nhà hàng.', V('waiter')),
  Fl('Where ___ a nurse work?', 'does', ['does', 'do', 'is'], 'a nurse → does.', V('nurse')),
  Fl('A doctor ___ in a hospital.', 'works', ['works', 'work', 'working'], 'a doctor → works.', V('doctor')),
  Fl('Where do teachers ___?', 'work', ['work', 'works', 'working'], 'Sau do dùng work.', V('teacher')),
  Fl('A teacher works ___ a school.', 'at', ['at', 'on', 'under'], 'at a school.', V('teacher')),
  Fl('Where ___ pilots work?', 'do', ['do', 'does', 'is'], 'pilots (nhiều người) → do.', V('pilot')),
  Fl('A pilot works ___ a plane.', 'on', ['on', 'in', 'at'], 'on a plane.', V('pilot')),
  Fl('A cook works in a ___.', 'kitchen', ['kitchen', 'hospital', 'plane'], 'Đầu bếp làm việc trong bếp.', V('cook')),
  Fl('Where does a mechanic ___?', 'work', ['work', 'works', 'working'], 'Sau does dùng work.', V('mechanic')),
  Fl('A doctor works ___ a hospital.', 'in', ['in', 'on', 'at the'], 'in a hospital.', V('doctor')),
  Fl('A: Where does a singer work? B: A singer works on a ___.', 'stage', ['stage', 'plane', 'bed'], 'Ca sĩ làm việc trên sân khấu.', V('singer'))],
 [Dlg(['Tom: Where does a doctor work?'], 'Amy: A doctor works ___ a hospital.', 'in', 'on', 'under', 'in a hospital.', V('doctor')),
  Dlg(['Mum: Where do pilots work?'], 'Ben: They work ___ planes.', 'on', 'in', 'under', 'on planes.', V('pilot')),
  Dlg(['Girl: Where does your uncle work?'], 'Boy: He ___ at a school. He is a teacher.', 'works', 'work', 'working', 'He → works.', V('teacher')),
  Clz(['My mum is a nurse.', 'She helps sick people.'], 'She works ___ a hospital.', 'in', 'on', 'under', 'in a hospital.', V('nurse')),
  Clz(['Look at the man in white.', 'He makes food for us.'], 'He works in a ___.', 'kitchen', 'hospital', 'plane', 'Đầu bếp làm việc trong bếp.', V('cook')),
  Clz(['My dad flies in the sky.', 'He is a pilot.'], 'Where does he ___?', 'work', 'works', 'working', 'Sau does dùng work.', V('pilot'))])

L4 = lesson('l4', 'rose', '🤔', 'could (possibility)', 'Có thể là… (đoán)',
 'Đoán xem đó là ai nhé! Dùng could để nói "có thể là…".',
 [when('🧭 Khi nào dùng?', [
    ('🤔', '**could + be + nghề** = **có thể là** … (chưa chắc chắn).', 'He could be a doctor.', 'Anh ấy có thể là bác sĩ.'),
    ('🔍', 'Dùng khi **đoán** dựa vào dấu hiệu em thấy.', 'She has a uniform. She could be a nurse.', 'Cô ấy mặc đồng phục. Cô ấy có thể là y tá.'),
    ('❓', 'Hỏi: **Who could he be?** = Anh ấy có thể là ai?', 'Who could she be?', 'Cô ấy có thể là ai?')]),
  compare('🗂 So sánh could và is', [
    CI('is', 'sub', 'chắc chắn', 'Em **biết chắc chắn**.', [('He is a doctor.', 'Anh ấy là bác sĩ.')], V('doctor')),
    CI('could be', 'pink', 'có thể là', 'Em **đoán**, chưa chắc chắn.', [('He could be a doctor.', 'Anh ấy có thể là bác sĩ.')], EM('🤔'))]),
  pattern('1️⃣ Đoán: could be…', 'rose', [('subject', 'sub', 'he, she, it'), ('could be', 'aux', 'có thể là'), ('job', 'obj', 'a doctor')], [
    ('{He|sub} {could be|aux} {a doctor.|obj}', 'Anh ấy có thể là bác sĩ.', V('doctor')), ('{She|sub} {could be|aux} {a singer.|obj}', 'Cô ấy có thể là ca sĩ.', V('singer')),
    ('{They|sub} {could be|aux} {pilots.|obj}', 'Họ có thể là phi công.', V('pilot'))]),
  pattern('2️⃣ Hỏi: Who could … be?', 'sky', [('Who', 'pink', 'ai'), ('could', 'aux', 'có thể'), ('subject', 'sub', 'he, she'), ('be?', 'v', 'là')], [
    ('{Who|pink} {could|aux} {he|sub} {be?|v}', 'Anh ấy có thể là ai?', EM('🤔')), ('{Who|pink} {could|aux} {she|sub} {be?|v}', 'Cô ấy có thể là ai?', EM('🧐'))]),
  dialog('❓ Đoán nghề', '{Who|pink} {could|aux} {he|sub} {be?|v}', [
    ('{Who|pink} {could|aux} {he|sub} {be?|v}', '{He|sub} {could be|aux} {a pilot.|obj}', 'Anh ấy có thể là ai?', 'Anh ấy có thể là phi công.', V('pilot')),
    ('{Who|pink} {could|aux} {she|sub} {be?|v}', '{She|sub} {could be|aux} {a nurse.|obj}', 'Cô ấy có thể là ai?', 'Cô ấy có thể là y tá.', V('nurse'))]),
  tip('💡 Mẹo: **could + be** — **không thêm s** (she could be, không phải she coulds be). Dùng khi **chưa chắc chắn**.'),
  mistakes([('He coulds be a doctor.', 'He could be a doctor.', 'could không thêm s.'), ('She could is a nurse.', 'She could be a nurse.', 'Sau could dùng be.'),
            ('He could be doctor.', 'He could be a doctor.', 'Thiếu a trước nghề.'), ('Who he could be?', 'Who could he be?', 'could đứng trước he.')]),
  acts('a4')],
 [Mc('He ___ be a doctor. (có thể)', 'could', 'coulds', 'is', 'could + be.', V('doctor')),
  Mc('She could ___ a singer.', 'be', 'is', 'being', 'Sau could dùng be.', V('singer')),
  Mc('Who ___ she be?', 'could', 'coulds', 'is', 'Who could she be?'),
  Mc('He wears a uniform. He ___ be a pilot.', 'could', 'coulds', 'does', 'Đoán → could be.', V('pilot')),
  Mc('They could be ___.', 'cooks', 'cook', 'a cooks', 'Nhiều người → cooks.', V('cook')),
  Mc('He ___ be a waiter. (có thể)', 'could', 'coulds', 'couldn', 'could + be.', V('waiter')),
  Mc('She has a camera. She could be a ___.', 'photographer', 'photograph', 'photographs', 'Máy ảnh → photographer.', V('photographer')),
  Mc('He could be ___ engineer.', 'an', 'a', 'the', 'engineer bắt đầu bằng nguyên âm → an.', V('engineer')),
  Mc('She could be a nurse. She is not ___.', 'sure', 'sorry', 'nurse', 'could = chưa chắc → not sure.'),
  Mc('Who ___ they be?', 'could', 'coulds', 'do', 'Who could they be?'),
  Fl('He ___ be a doctor.', 'could', ['could', 'coulds', 'is'], 'could + be.', V('doctor'), '(có thể)'),
  Fl('She could ___ a nurse.', 'be', ['be', 'is', 'being'], 'Sau could dùng be.', V('nurse')),
  Fl('Who ___ he be?', 'could', ['could', 'coulds', 'is'], 'Who could he be?'),
  Fl('They could be ___.', 'pilots', ['pilots', 'pilot', 'a pilots'], 'Nhiều người → pilots.', V('pilot')),
  Fl('He wears white clothes. He could ___ a dentist.', 'be', ['be', 'is', 'being'], 'Sau could dùng be.', V('dentist')),
  Fl('She sings on the stage. She ___ be a singer.', 'could', ['could', 'coulds', 'does'], 'Đoán → could be.', V('singer')),
  Fl('He could be ___ artist.', 'an', ['an', 'a', 'the'], 'artist bắt đầu bằng nguyên âm → an.', V('artist')),
  Fl('He has a big hat. He could be a ___.', 'cook', ['cook', 'cooks', 'cooking'], 'a + danh từ số ít.', V('cook')),
  Fl('Who ___ she be?', 'could', ['could', 'coulds', 'does'], 'Who could she be?'),
  Fl('She ___ be a teacher. I am not sure.', 'could', ['could', 'coulds', 'is'], 'Chưa chắc → could be.', V('teacher'))],
 [Dlg(['Tom: Who is that man?'], 'Amy: I am not sure. He ___ be a pilot.', 'could', 'coulds', 'does', 'Chưa chắc → could be.', V('pilot')),
  Dlg(['Mum: Who could she be?'], 'Ben: She ___ be a nurse.', 'could', 'coulds', 'does', 'Đoán → could be.', V('nurse')),
  Dlg(['Girl: What does he do?'], 'Boy: I think he could ___ a mechanic.', 'be', 'is', 'being', 'Sau could dùng be.', V('mechanic')),
  Clz(['Look at that woman.', 'She has a camera and takes photos.'], 'She ___ be a photographer.', 'could', 'coulds', 'does', 'Đoán → could be.', V('photographer')),
  Clz(['The man wears a big white hat.', 'He is in the kitchen.'], 'He could be a ___.', 'cook', 'cooks', 'cooking', 'a + danh từ số ít.', V('cook')),
  Clz(['I see a woman with a stethoscope.', 'She is at the hospital.'], 'Who ___ she be?', 'could', 'coulds', 'does', 'Who could she be?', V('doctor'))])

A = [
 bucket('a1', "⚡ Luyện nhanh: muốn hay không muốn?", "Kéo mỗi câu vào ô đúng: I'd like to be… (muốn) hoặc I wouldn't like to be… (không muốn).", [
   {'id': 'yes', 'label': "🌟 I'd like to be…", 'c': 'mint'}, {'id': 'no', 'label': "🙅 I wouldn't like to be…", 'c': 'rose'}], [
   {'label': "I'd like to be a pilot.", 'g': 'yes'}, {'label': "I wouldn't like to be a dentist.", 'g': 'no'}, {'label': "She'd like to be a nurse.", 'g': 'yes'},
   {'label': "He wouldn't like to be a waiter.", 'g': 'no'}, {'label': "We'd like to be singers.", 'g': 'yes'}, {'label': "They wouldn't like to be mechanics.", 'g': 'no'}]),
 bucket('a2', '⚡ Luyện nhanh: like, love hay hate?', 'Kéo mỗi câu vào ô đúng: thích (like) · rất thích (love) · ghét (hate).', [
   {'id': 'like', 'label': '🙂 like (thích)', 'c': 'sky'}, {'id': 'love', 'label': '❤️ love (rất thích)', 'c': 'peach'}, {'id': 'hate', 'label': '😖 hate (ghét)', 'c': 'rose'}], [
   {'label': 'I like singing.', 'g': 'like'}, {'label': 'She loves cooking.', 'g': 'love'}, {'label': 'He hates waiting.', 'g': 'hate'},
   {'label': 'They like playing football.', 'g': 'like'}, {'label': 'My dad loves swimming.', 'g': 'love'}, {'label': 'Amy hates washing up.', 'g': 'hate'}]),
 slot('a3', '⚡ Luyện nhanh: nghề làm việc ở đâu?', 'Nhìn hình rồi kéo từ vào chỗ trống: nơi làm việc của mỗi nghề.', [
   Sl('s1', 'A doctor works in a ___.', 'hospital', V('doctor')), Sl('s2', 'A cook works in a ___.', 'kitchen', V('cook')), Sl('s3', 'A teacher works at a ___.', 'school', V('teacher')),
   Sl('s4', 'A pilot works on a ___.', 'plane', V('pilot')), Sl('s5', 'A singer works on a ___.', 'stage', V('singer'))], ['hospital', 'kitchen', 'school', 'plane', 'stage']),
 bucket('a4', '⚡ Luyện nhanh: chắc chắn hay đoán?', 'Kéo mỗi câu vào ô đúng: biết chắc (is) hoặc đoán (could be).', [
   {'id': 'sure', 'label': '✅ Chắc chắn (is)', 'c': 'mint'}, {'id': 'guess', 'label': '🤔 Đoán (could be)', 'c': 'rose'}], [
   {'label': 'He is a doctor.', 'g': 'sure'}, {'label': 'She could be a nurse.', 'g': 'guess'}, {'label': 'They are pilots.', 'g': 'sure'},
   {'label': 'He could be a cook.', 'g': 'guess'}, {'label': 'She is a singer.', 'g': 'sure'}, {'label': 'They could be teachers.', 'g': 'guess'}])]

u = build_unit(6, 'unit-6', 'Dream jobs', 'Nghề mơ ước', '💼', 'flyers--unit-6-5365', [L1, L2, L3, L4], A)
save_unit(u)
