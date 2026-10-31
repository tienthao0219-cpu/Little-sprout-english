# Unit 12 · Past and future  –  chủ điểm do cô Thảo cung cấp: past simple vs present perfect; will & might
# Quy tắc: chỗ trống của câu điền từ chỉ hỏi NGỮ PHÁP, chỉ có một đáp án hợp lý (có từ gợi ý thời gian / mức chắc chắn trong câu).
from ugen import *

L1 = lesson('l1', 'sky', '⏪', 'Past simple vs present perfect', 'Quá khứ đơn hay hiện tại hoàn thành?',
 'Nhìn từ chỉ thời gian để chọn đúng: yesterday → past simple; ever, never, already, just → present perfect.',
 [when('🧭 Khi nào dùng?', [
    ('⏪', '**Past simple** = việc **đã xong** ở một thời điểm **đã nói rõ** (yesterday, last year, in 2010, ago).', 'I rode a racing bike yesterday.', 'Hôm qua mình đã đi xe đạp đua.'),
    ('✅', '**Present perfect** = **trải nghiệm / kết quả đến bây giờ**, **không nói rõ lúc nào** (ever, never, already, just).', 'I have ridden a racing bike.', 'Mình đã từng đi xe đạp đua.'),
    ('🔎', 'Nhìn **từ chỉ thời gian** trong câu để chọn thì.', 'We saw a rocket last night.', 'Tối qua chúng mình thấy một tên lửa.')]),
  compare('🗂 So sánh 2 thì', [
    CI('Past simple (V2)', 'sub', 'đã xong, có thời gian rõ', 'Có từ: **yesterday, last week, in 2010, two days ago**.', [('We saw a rocket yesterday.', 'Hôm qua chúng mình thấy tên lửa.'), ('She visited the pond last week.', 'Tuần trước cô ấy thăm cái ao.')], V('rocket')),
    CI('Present perfect (have / has + V3)', 'pink', 'trải nghiệm, không nói lúc nào', 'Có từ: **ever, never, already, just, so far**.', [('We have seen a rocket.', 'Chúng mình đã từng thấy tên lửa.'), ('She has already visited the pond.', 'Cô ấy đã thăm cái ao rồi.')], V('spaceship'))]),
  table('🗂 Từ gợi ý thời gian', ['Past simple', 'Present perfect', 'Ví dụ'], [
    ['yesterday', 'ever', 'I rode a bike yesterday. / Have you ever ridden a bike?'], ['last week / last year', 'never', 'We saw it last year. / We have never seen it.'],
    ['in 2010', 'already', 'He won in 2010. / He has already won.'], ['two days ago', 'just', 'She came two days ago. / She has just come.']], ['sky', 'mint', 'peach']),
  pattern('1️⃣ Past simple: V2 + thời gian đã qua', 'sky', [('subject', 'sub', 'I, we, she'), ('V2', 'v', 'saw, went, visited'), ('thing / place', 'obj', 'a rocket'), ('past time', 'pre', 'yesterday')], [
    ('{We|sub} {saw|v} {a rocket|obj} {last night.|pre}', 'Tối qua chúng mình thấy tên lửa.', V('rocket')),
    ('{She|sub} {visited|v} {the pond|obj} {last week.|pre}', 'Tuần trước cô ấy thăm cái ao.', V('pond')),
    ('{I|sub} {rode|v} {a racing bike|obj} {yesterday.|pre}', 'Hôm qua mình đi xe đạp đua.', V('racing-bike'))]),
  pattern('2️⃣ Present perfect: have / has + V3', 'mint', [('subject', 'sub', 'I, we, she'), ('have / has', 'aux', ''), ('V3', 'v', 'seen, visited'), ('ever / never / already / just', 'pink', '')], [
    ('{We|sub} {have|aux} {never|pink} {seen|v} {a spaceship.|obj}', 'Chúng mình chưa bao giờ thấy tàu vũ trụ.', X('spaceship')),
    ('{She|sub} {has|aux} {already|pink} {visited|v} {the pond.|obj}', 'Cô ấy đã thăm cái ao rồi.', V('pond')),
    ('{I|sub} {have|aux} {just|pink} {seen|v} {an eagle.|obj}', 'Mình vừa thấy một con đại bàng.', V('eagle'))]),
  dialog('❓ Hỏi và trả lời', '{Did / Have|aux} {you|sub} {+ verb / V3?|v}', [
    ('{Did|aux} {you|sub} {see|v} {the rocket|obj} {yesterday?|pre}', '{Yes,|sub} {I did.|aux}', 'Hôm qua bạn có thấy tên lửa không?', 'Ừ, mình có thấy.', V('rocket')),
    ('{Have|aux} {you|sub} {ever|pink} {seen|v} {an eagle?|obj}', '{Yes,|sub} {I have.|aux}', 'Bạn đã bao giờ thấy đại bàng chưa?', 'Rồi, mình đã từng.', V('eagle'))]),
  tip('💡 Mẹo: **có thời gian rõ (yesterday, ago, last…) → past simple** · **ever, never, already, just → present perfect**.'),
  mistakes([('I have seen a rocket yesterday.', 'I saw a rocket yesterday.', 'Có yesterday → past simple.'), ('Did you ever seen an eagle?', 'Have you ever seen an eagle?', 'ever → present perfect.'),
            ('She visited the pond already.', 'She has already visited the pond.', 'already → present perfect.'), ('We have went to the pond.', 'We have been to the pond.', 'have + V3: been.')]),
  acts('a1')],
 [Mc('We ___ to the pond yesterday.', 'went', 'have been', 'goes', 'yesterday → past simple: went.', V('pond')),
  Mc('I have ___ a rocket.', 'seen', 'saw', 'see', 'have + V3: seen.', V('rocket')),
  Mc('She ___ a racing bike last year.', 'rode', 'has ridden', 'ride', 'last year → past simple: rode.', V('racing-bike')),
  Mc('Have you ever ___ an eagle?', 'seen', 'saw', 'see', 'Have you ever + V3: seen.', V('eagle')),
  Mc('They ___ the spaceship two days ago.', 'saw', 'have seen', 'see', 'two days ago → past simple: saw.', V('spaceship')),
  Mc('I ___ never flown in a spaceship.', 'have', 'did', 'was', 'never → present perfect: have never flown.', V('spaceship')),
  Mc('In 2020 we ___ the pond.', 'visited', 'have visited', 'visit', 'In 2020 → past simple: visited.', V('pond')),
  Mc('What did you do ___?', 'yesterday', 'ever', 'never', 'Câu hỏi quá khứ đơn → yesterday.'),
  Mc('She ___ already landed the plane.', 'has', 'is', 'was', 'already → present perfect: has landed.', V('land')),
  Mc('Look! A spaceship! It ___ just landed.', 'has', 'did', 'was', 'just → present perfect: has landed.', V('spaceship')),
  Fl('We ___ to the pond yesterday. (go)', 'went', ['went', 'have gone', 'go'], 'yesterday → past simple: went.', V('pond')),
  Fl('I have ___ a rocket. (see)', 'seen', ['seen', 'saw', 'see'], 'have + V3: seen.', V('rocket')),
  Fl('She ___ a racing bike last year. (ride)', 'rode', ['rode', 'has ridden', 'ride'], 'last year → past simple: rode.', V('racing-bike')),
  Fl('Have you ever ___ an eagle? (see)', 'seen', ['seen', 'saw', 'see'], 'Have you ever + V3: seen.', V('eagle')),
  Fl('They ___ the spaceship two days ago. (see)', 'saw', ['saw', 'have seen', 'see'], 'two days ago → past simple: saw.', V('spaceship')),
  Fl('I ___ never flown in a spaceship.', 'have', ['have', 'did', 'was'], 'never → present perfect: have.', V('spaceship')),
  Fl('She has ___ landed the plane. (rồi)', 'already', ['already', 'ago', 'yesterday'], 'already đứng giữa has và V3.', V('land')),
  Fl('In 2020 we ___ the pond. (visit)', 'visited', ['visited', 'have visited', 'visit'], 'In 2020 → past simple: visited.', V('pond')),
  Fl('Look! It has ___ landed. (vừa mới)', 'just', ['just', 'ago', 'yesterday'], 'just đứng giữa has và V3.', V('spaceship')),
  Fl('___ you ever ridden a racing bike?', 'Have', ['Have', 'Did', 'Are'], 'ever → Have you ever + V3?', V('racing-bike'))],
 [Dlg(['Mum: When did you see the rocket?'], 'Tom: I ___ it last night.', 'saw', 'have seen', 'see', 'last night → past simple: saw.', V('rocket')),
  Dlg(['Girl: Have you ever been to the pond?'], 'Boy: Yes, I ___ been there twice.', 'have', 'did', 'was', 'Present perfect: have been.', V('pond')),
  Dlg(['Teacher: Did you see an eagle yesterday?'], "Pupil: Yes, I ___.", 'did', 'have', 'was', 'Trả lời Yes, I did.', V('eagle')),
  Clz(['We went to the airport in 2022.', 'It was a great trip.'], 'We ___ a spaceship model there.', 'saw', 'have seen', 'see', 'in 2022 → past simple: saw.', V('spaceship')),
  Clz(['Amy loves bikes.', 'She wants to ride every kind of bike.'], 'She has ___ ridden a racing bike.', 'already', 'ago', 'yesterday', 'already đứng giữa has và V3.', V('racing-bike')),
  Clz(['Ben is not at home.', 'His mum is looking for him.'], 'He ___ just gone to the pond.', 'has', 'did', 'was', 'just → present perfect: has gone.', V('pond')),
  Clz(['Last summer, we went to a science park.', 'It was great.'], 'We ___ a big rocket there.', 'saw', 'have seen', 'see', 'Last summer → past simple: saw.', V('rocket')),
  Clz(['Amy is a bike fan.', 'She loves speed.'], 'She ___ ridden a racing bike. She loves it.', 'has', 'did', 'was', 'Trải nghiệm → has ridden.', V('racing-bike')),
  Clz(['There is an eagle in the sky.', 'Tom looks up.'], 'He has never ___ such a big bird.', 'seen', 'saw', 'see', 'has never + V3: seen.', V('eagle')),
  Clz(['Yesterday was warm and sunny.', 'We went outside.'], 'We ___ the pond and fed the ducks.', 'visited', 'have visited', 'visit', 'Yesterday → past simple: visited.', V('pond')),
  Clz(['The class is reading about space.', 'Ben has a question.'], 'He asks: "___ you ever seen a spaceship?"', 'Have', 'Did', 'Are', 'ever → Have you ever + V3?', V('spaceship'))])

L2 = lesson('l2', 'peach', '🚀', 'will & might', 'Chắc chắn sẽ · Có thể sẽ',
 'Tương lai sẽ ra sao? Dùng will khi em chắc chắn, might khi em chưa chắc.',
 [when('🧭 Khi nào dùng?', [
    ('🚀', '**will + verb** = **chắc chắn** sẽ xảy ra.', 'People will travel to space.', 'Con người sẽ du hành vào vũ trụ.'),
    ('🤔', '**might + verb** = **có thể** xảy ra (chưa chắc).', 'We might see aliens.', 'Có thể chúng ta sẽ thấy người ngoài hành tinh.'),
    ('🚫', "**won't** = chắc chắn **không**; **might not** = có thể **không**.", "We won't live on the sun. We might not visit Mars.", 'Chúng ta sẽ không sống trên mặt trời. Có thể chúng ta không đến sao Hỏa.')]),
  compare('🗂 So sánh will và might', [
    CI('will / won\'t + verb', 'sub', 'chắc chắn', 'Em **tin chắc** việc đó sẽ (không) xảy ra.', [('People will use rockets.', 'Con người sẽ dùng tên lửa.'), ("We won't live on the sun.", 'Chúng ta sẽ không sống trên mặt trời.')], V('rocket')),
    CI('might / might not + verb', 'pink', 'có thể', 'Em **chưa chắc**, có thể xảy ra hoặc không.', [('We might see aliens.', 'Có thể chúng ta thấy người ngoài hành tinh.'), ('We might not find water.', 'Có thể chúng ta không tìm thấy nước.')], V('planet'))]),
  pattern('1️⃣ Chắc chắn: will + verb', 'sky', [('subject', 'sub', 'people, we, it'), ('will', 'aux', 'chắc chắn sẽ'), ('verb', 'v', 'travel, use'), ('thing / place', 'obj', 'to space')], [
    ('{People|sub} {will|aux} {travel|v} {to space.|obj}', 'Con người sẽ du hành vào vũ trụ.', V('space')),
    ('{We|sub} {will|aux} {use|v} {spaceships.|obj}', 'Chúng ta sẽ dùng tàu vũ trụ.', V('spaceship')),
    ('{Rockets|sub} {will|aux} {land|v} {on other planets.|obj}', 'Tên lửa sẽ hạ cánh trên các hành tinh khác.', V('planet'))]),
  pattern('2️⃣ Có thể: might + verb', 'peach', [('subject', 'sub', 'we, they, it'), ('might', 'aux', 'có thể'), ('verb', 'v', 'see, find'), ('thing / place', 'obj', 'aliens')], [
    ('{We|sub} {might|aux} {see|v} {aliens.|obj}', 'Có thể chúng ta thấy người ngoài hành tinh.', EM('👽')),
    ('{They|sub} {might|aux} {live|v} {on Mars.|obj}', 'Có thể họ sống trên sao Hỏa.', V('planet')),
    ('{It|sub} {might|aux} {rain|v} {in the future.|obj}', 'Có thể trời mưa trong tương lai.', V('future'))]),
  pattern("3️⃣ Không: won't / might not + verb", 'rose', [('subject', 'sub', 'we, they, it'), ("won't / might not", 'pink', 'sẽ không / có thể không'), ('verb', 'v', 'live, visit'), ('place', 'obj', 'on the sun')], [
    ("{We|sub} {won't|pink} {live|v} {on the sun.|obj}", 'Chúng ta sẽ không sống trên mặt trời.', X('planet')),
    ("{We|sub} {might not|pink} {visit|v} {Mars.|obj}", 'Có thể chúng ta không đến sao Hỏa.', X('rocket')),
    ("{They|sub} {might not|pink} {land|v} {on the moon.|obj}", 'Có thể họ không hạ cánh trên mặt trăng.', X('land'))]),
  dialog('❓ Hỏi và trả lời', '{What|pink} {will|aux} {happen|v} {in the future?|obj}', [
    ('{What|pink} {will|aux} {people|sub} {use|v} {in the future?|obj}', '{They|sub} {will|aux} {use|v} {spaceships.|obj}', 'Tương lai con người sẽ dùng gì?', 'Họ sẽ dùng tàu vũ trụ.', V('spaceship')),
    ('{Will|aux} {we|sub} {see|v} {aliens?|obj}', '{We|sub} {might.|aux} {I am not sure.|obj}', 'Chúng ta sẽ thấy người ngoài hành tinh không?', 'Có thể. Mình chưa chắc.', EM('👽'))]),
  tip("💡 Mẹo: **will / won't** = chắc chắn · **might / might not** = chưa chắc. Cả hai + động từ nguyên mẫu, không thêm s."),
  mistakes([('We might to see aliens.', 'We might see aliens.', 'Sau might không có to.'), ('People wills travel to space.', 'People will travel to space.', 'will không thêm s.'),
            ("We don't will live on the sun.", "We won't live on the sun.", 'Phủ định: won\'t.'), ('It might rains tomorrow.', 'It might rain tomorrow.', 'might + động từ nguyên mẫu.')]),
  acts('a2')],
 [Mc('People ___ travel to space. I am sure. (chắc chắn)', 'will', 'might', "can't", 'Chắc chắn → will.', V('space')),
  Mc('We ___ see an alien. Maybe. (có thể)', 'might', 'will', "won't", 'Có thể → might.', EM('👽')),
  Mc('Cars ___ fly in the future. I am not sure. (có thể)', 'might', 'will', "won't", 'Chưa chắc → might.', V('future')),
  Mc('It ___ rain tomorrow. The forecast says 100%. (chắc chắn)', 'will', 'might', 'may not', 'Chắc chắn → will.'),
  Mc("We ___ live on the sun. It is too hot. (chắc chắn không)", "won't", 'might', 'will', 'Chắc chắn không → won\'t.', V('planet')),
  Mc('We ___ visit Mars. I am not sure. (có thể không)', 'might not', "won't", 'will', 'Có thể không → might not.', V('rocket')),
  Mc('Rockets will ___ on other planets.', 'land', 'lands', 'landing', 'Sau will dùng động từ nguyên mẫu.', V('land')),
  Mc('They might ___ water on Mars.', 'find', 'finds', 'finding', 'Sau might dùng động từ nguyên mẫu.', V('planet')),
  Mc('A: Will we see aliens? B: I am not sure. We ___.', 'might', 'will', "won't", 'Chưa chắc → might.', EM('👽')),
  Mc('Spaceships ___ carry many people. I am sure. (chắc chắn)', 'will', 'might', "can't", 'Chắc chắn → will.', V('spaceship')),
  Fl('People ___ travel to space. I am sure. (chắc chắn)', 'will', ['will', 'might', "won't"], 'Chắc chắn → will.', V('space')),
  Fl('We ___ see an alien. Maybe. (có thể)', 'might', ['might', 'will', "won't"], 'Có thể → might.', EM('👽')),
  Fl("We ___ live on the sun. It is too hot. (chắc chắn không)", "won't", ["won't", 'might', 'will'], 'Chắc chắn không → won\'t.', V('planet')),
  Fl('We ___ visit Mars. I am not sure. (có thể không)', 'might not', ['might not', "won't", 'will'], 'Có thể không → might not.', V('rocket')),
  Fl('Rockets will ___ on other planets. (land)', 'land', ['land', 'lands', 'landing'], 'Sau will dùng động từ nguyên mẫu.', V('land')),
  Fl('They might ___ water. (find)', 'find', ['find', 'finds', 'finding'], 'Sau might dùng động từ nguyên mẫu.', V('planet')),
  Fl('It ___ rain tomorrow. The forecast says 100%. (chắc chắn)', 'will', ['will', 'might', "won't"], 'Chắc chắn → will.'),
  Fl('A: Will we see aliens? B: I am not sure. We ___.', 'might', ['might', 'will', "won't"], 'Chưa chắc → might.', EM('👽')),
  Fl('Cars ___ fly in the future. I am not sure. (có thể)', 'might', ['might', 'will', "won't"], 'Chưa chắc → might.', V('future')),
  Fl('Spaceships ___ carry many people. I am sure. (chắc chắn)', 'will', ['will', 'might', "won't"], 'Chắc chắn → will.', V('spaceship'))],
 [Dlg(['Tom: Will people live on Mars?'], 'Amy: I am not sure. They ___.', 'might', 'will', "won't", 'Chưa chắc → might.', V('planet')),
  Dlg(['Girl: Will spaceships be faster?'], 'Boy: Yes, I am sure. They ___ be faster.', 'will', 'might', 'may not', 'Chắc chắn → will.', V('spaceship')),
  Dlg(['Teacher: Will we live on the sun?'], "Pupil: No, we ___. It is too hot.", "won't", 'might', 'will', 'Chắc chắn không → won\'t.'),
  Clz(['Scientists are studying space.', 'They are not sure what is out there.'], 'They ___ find new planets.', 'might', 'will', "won't", 'Chưa chắc → might.', V('planet')),
  Clz(['The rocket is ready.', 'Everything is perfect.'], 'I am sure it ___ land safely.', 'will', 'might', "won't", 'Chắc chắn → will.', V('land')),
  Clz(['Nobody has been to that planet.', 'We know nothing about it.'], 'We ___ find water there. Maybe not.', 'might not', "won't", 'will', 'Có thể không → might not.', V('planet')),
  Clz(['Scientists built a new rocket.', 'It is the best in the world.'], 'I am sure it ___ fly very fast.', 'will', 'might', "can't", 'Chắc chắn → will.', V('rocket')),
  Clz(['Nobody knows the answer.', 'The future is a mystery.'], 'People ___ live on other planets. Who knows?', 'might', 'will', "won't", 'Chưa chắc → might.', V('future')),
  Clz(['The sun is a star.', 'It is extremely hot.'], "We ___ land on the sun.", "won't", 'might', 'will', 'Chắc chắn không → won\'t.', V('planet')),
  Clz(['Amy looks at the calendar.', 'Next year is a big year.'], 'She says: "We ___ visit a new planet!"', 'might', "won't", 'did', 'Còn mơ hồ → might.', V('calendar')),
  Clz(['The class talks about robots.', 'Some people are not sure.'], 'Robots ___ help us in the future. Maybe.', 'might', 'will', "won't", 'Có thể → might.', V('space'))])

A = [
 bucket('a1', '⚡ Luyện nhanh: từ chỉ thời gian → chọn thì', 'Kéo mỗi từ vào ô đúng: dùng past simple hoặc present perfect.', [
   {'id': 'ps', 'label': '⏪ Past simple', 'c': 'sky'}, {'id': 'pp', 'label': '✅ Present perfect', 'c': 'mint'}], [
   {'label': 'yesterday', 'g': 'ps'}, {'label': 'ever', 'g': 'pp'}, {'label': 'last week', 'g': 'ps'}, {'label': 'never', 'g': 'pp'}, {'label': 'two days ago', 'g': 'ps'}, {'label': 'already', 'g': 'pp'},
   {'label': 'in 2010', 'g': 'ps'}, {'label': 'just', 'g': 'pp'}]),
 bucket('a2', "⚡ Luyện nhanh: chắc chắn hay chưa chắc?", "Kéo mỗi câu vào ô đúng: chắc chắn (will / won't) hoặc chưa chắc (might / might not).", [
   {'id': 'sure', 'label': "✅ chắc chắn (will / won't)", 'c': 'sky'}, {'id': 'maybe', 'label': '🤔 chưa chắc (might)', 'c': 'peach'}], [
   {'label': 'People will travel to space.', 'g': 'sure'}, {'label': 'We might see aliens.', 'g': 'maybe'}, {'label': "We won't live on the sun.", 'g': 'sure'},
   {'label': 'They might live on Mars.', 'g': 'maybe'}, {'label': 'Rockets will land on planets.', 'g': 'sure'}, {'label': 'We might not visit Mars.', 'g': 'maybe'}])]

u = build_unit(12, 'unit-12', 'Past and future', 'Quá khứ và tương lai', '🚀', 'flyers--unit-12-2nzv', [L1, L2], A)
save_unit(u)
