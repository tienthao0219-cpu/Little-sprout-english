# Unit 11 · Our summer holidays  –  chủ điểm do cô Thảo cung cấp: future simple; should / might / can't; imperatives & going to; present perfect (regular & irregular)
# Quy tắc: chỗ trống của câu điền từ chỉ hỏi NGỮ PHÁP, chỉ có một đáp án hợp lý.
from ugen import *

L1 = lesson('l1', 'mint', '🔮', 'Future simple (will)', 'Dự đoán tương lai: will / won\'t',
 'Kỳ nghỉ hè sắp tới, thời tiết sẽ thế nào? Dùng will + động từ để đoán và hứa nhé!',
 [when('🧭 Khi nào dùng?', [
    ('🔮', '**will + verb** = **đoán** việc sẽ xảy ra trong tương lai.', 'It will be sunny tomorrow.', 'Ngày mai trời sẽ nắng.'),
    ('🙅', "**won't + verb** = sẽ **không** xảy ra.", "It won't rain on Sunday.", 'Chủ nhật trời sẽ không mưa.'),
    ('❓', '**Will + chủ ngữ + verb?** = … sẽ … không?', 'Will it snow?', 'Trời sẽ có tuyết không?')]),
  three('🗂 Ba kiểu câu', [('✅', 'Sẽ', 'mint', 'It [[will]] rain.', 'Trời sẽ mưa.'), ('❌', 'Sẽ không', 'rose', "It [[won't]] rain.", 'Trời sẽ không mưa.'), ('❓', 'Hỏi', 'sky', '[[Will]] it rain?', 'Trời sẽ mưa không?')]),
  pattern('1️⃣ Sẽ: will + verb', 'mint', [('subject', 'sub', 'I, it, we, they'), ('will', 'aux', 'sẽ'), ('verb', 'v', 'be, rain'), ('time / thing', 'obj', 'tomorrow')], [
    ('{It|sub} {will|aux} {be|v} {foggy tomorrow.|obj}', 'Ngày mai trời sẽ có sương mù.', V('foggy')),
    ('{It|sub} {will|aux} {rain|v} {on Friday.|obj}', 'Thứ Sáu trời sẽ mưa.', V('raining')),
    ('{We|sub} {will|aux} {need|v} {sunglasses.|obj}', 'Chúng mình sẽ cần kính râm.', V('sunglasses'))]),
  pattern("2️⃣ Sẽ không: won't + verb", 'rose', [('subject', 'sub', 'I, it, we, they'), ("won't", 'pink', 'sẽ không'), ('verb', 'v', 'rain, snow'), ('time / place', 'obj', 'in the desert')], [
    ("{It|sub} {won't|pink} {snow|v} {in the desert.|obj}", 'Trời sẽ không có tuyết ở sa mạc.', V('snowing')),
    ("{It|sub} {won't|pink} {rain|v} {on Sunday.|obj}", 'Chủ nhật trời sẽ không mưa.', V('raining')),
    ("{We|sub} {won't|pink} {need|v} {gloves.|obj}", 'Chúng mình sẽ không cần găng tay.', V('gloves'))]),
  dialog('❓ Hỏi và trả lời', '{Will|aux} {it|sub} {+ verb|v} {…?|obj}', [
    ('{Will|aux} {it|sub} {rain|v} {tomorrow?|obj}', '{Yes,|sub} {it will.|aux}', 'Ngày mai trời sẽ mưa không?', 'Có, sẽ mưa.', V('raining')),
    ('{Will|aux} {it|sub} {snow|v} {in the desert?|obj}', "{No,|sub} {it won't.|pink}", 'Ở sa mạc có tuyết không?', 'Không, sẽ không có.', V('desert'))]),
  tip("💡 Mẹo: **will / won't + động từ nguyên mẫu** cho mọi chủ ngữ (I will, he will, they will…). won't = will not."),
  mistakes([('It will rains tomorrow.', 'It will rain tomorrow.', 'Sau will dùng động từ nguyên mẫu.'), ('It will to be sunny.', 'It will be sunny.', 'Sau will không có to.'),
            ("It doesn't will rain.", "It won't rain.", 'Phủ định: won\'t.'), ('Will it to snow?', 'Will it snow?', 'Will + chủ ngữ + động từ nguyên mẫu?')]),
  acts('a1')],
 [Mc('It ___ be sunny tomorrow.', 'will', 'is', 'does', 'Dự đoán tương lai → will be.', V('sunglasses')),
  Mc('I think it will ___ on Friday.', 'rain', 'rains', 'raining', 'Sau will dùng động từ nguyên mẫu.', V('raining')),
  Mc("It ___ snow in the desert.", "won't", 'will', "doesn't", 'Sa mạc nóng → won\'t snow.', V('desert')),
  Mc('___ it be foggy tomorrow?', 'Will', 'Does', 'Is', 'Hỏi tương lai → Will it be…?', V('foggy')),
  Mc('A: Will it rain? B: No, it ___.', "won't", "doesn't", "isn't", 'Trả lời No, it won\'t.', V('raining')),
  Mc('We ___ need gloves in the desert.', "won't", "don't", "aren't", 'Sa mạc nóng → won\'t need.', V('gloves')),
  Mc('They will ___ a camel tomorrow.', 'ride', 'rides', 'riding', 'Sau will dùng động từ nguyên mẫu.', V('camel')),
  Mc('She ___ take her suitcase.', 'will', 'is', 'does', 'Dự đoán / hứa → will take.', V('suitcase')),
  Mc('A: Will there be a storm? B: Yes, there ___.', 'will', 'is', 'does', 'Trả lời Yes, there will.', V('storm')),
  Mc('I ___ bring my sunglasses.', 'will', 'am', 'do', 'Hứa / quyết định → will bring.', V('sunglasses')),
  Fl('It ___ be sunny tomorrow.', 'will', ['will', 'is', 'does'], 'Dự đoán tương lai → will be.', V('sunglasses')),
  Fl("It ___ snow in the desert.", "won't", ["won't", 'will', "doesn't"], 'Sa mạc nóng → won\'t snow.', V('desert')),
  Fl('___ it rain on Friday?', 'Will', ['Will', 'Does', 'Is'], 'Hỏi tương lai → Will it…?', V('raining')),
  Fl('I think it will ___ foggy. (be)', 'be', ['be', 'is', 'being'], 'Sau will dùng động từ nguyên mẫu: be.', V('foggy')),
  Fl('We ___ need gloves. It is hot.', "won't", ["won't", 'will', "aren't"], 'Trời nóng → won\'t need.', V('gloves')),
  Fl('A: Will it snow? B: No, it ___.', "won't", ["won't", "doesn't", "isn't"], 'Trả lời No, it won\'t.', V('snowing')),
  Fl('She will ___ her suitcase. (pack)', 'pack', ['pack', 'packs', 'packing'], 'Sau will dùng động từ nguyên mẫu.', V('suitcase')),
  Fl('They ___ ride a camel tomorrow.', 'will', ['will', 'are', 'do'], 'Dự đoán / kế hoạch → will ride.', V('camel')),
  Fl('A: Will there be a storm? B: Yes, there ___.', 'will', ['will', 'is', 'does'], 'Trả lời Yes, there will.', V('storm')),
  Fl("It will not rain = It ___ rain.", "won't", ["won't", "doesn't", "isn't"], 'will not = won\'t.')],
 [Dlg(['Mum: What will the weather be like?'], 'Dad: It ___ be sunny.', 'will', 'is', 'does', 'Dự đoán → will be.', V('sunglasses')),
  Dlg(['Girl: Will we need gloves?'], "Boy: No, we ___. It is hot.", "won't", "don't", "aren't", 'Trả lời No, we won\'t.', V('gloves')),
  Dlg(['Teacher: Will it snow in the desert?'], "Pupil: No, it ___.", "won't", "doesn't", "isn't", 'Trả lời No, it won\'t.', V('desert')),
  Clz(['We are planning a trip.', 'The sky is blue.'], 'I think it ___ be sunny tomorrow.', 'will', 'is', 'does', 'Dự đoán → will be.', V('sunglasses')),
  Clz(['There are black clouds.', 'The wind is strong.'], 'There ___ be a storm tonight.', 'will', 'is', 'does', 'Dự đoán → will be.', V('storm')),
  Clz(['The desert is very hot.', 'It is far from the sea.'], "It ___ rain there tomorrow.", "won't", "doesn't", "isn't", 'Dự đoán không xảy ra → won\'t rain.', V('desert'))])

L2 = lesson('l2', 'peach', '🤔', "should / might / can't", 'Nên làm · Có thể · Không thể nào',
 'Ba từ này đều đứng trước động từ nguyên mẫu nhưng ý nghĩa khác nhau: nên, có thể, không thể nào.',
 [when('🧭 Khi nào dùng?', [
    ('👍', '**should + verb** = **nên** làm gì (lời khuyên).', 'You should take sunglasses.', 'Bạn nên mang kính râm.'),
    ('🤔', '**might + verb** = **có thể** (không chắc chắn).', 'It might rain tomorrow.', 'Ngày mai có thể mưa.'),
    ('🚫', "**can't + verb** = **không thể nào** (chắc chắn không).", "It can't snow in the desert.", 'Ở sa mạc không thể có tuyết.')]),
  compare('🗂 So sánh should, might và can\'t', [
    CI('should + verb', 'sub', 'nên', '**Lời khuyên** cho người khác.', [('You should take gloves.', 'Bạn nên mang găng tay.'), ('We should pack our suitcase.', 'Chúng mình nên xếp vali.')], V('suitcase')),
    CI('might + verb', 'pink', 'có thể (không chắc)', 'Việc **có thể** xảy ra, em **chưa chắc**.', [('It might rain.', 'Có thể trời mưa.'), ('We might see a camel.', 'Có thể chúng mình sẽ thấy lạc đà.')], V('camel')),
    CI("can't + verb", 'aux', 'không thể nào', 'Em **chắc chắn** việc đó không thể xảy ra.', [("It can't snow in the desert.", 'Ở sa mạc không thể có tuyết.'), ("He can't be cold.", 'Cậu ấy không thể lạnh.')], V('desert'))]),
  pattern('1️⃣ Nên / có thể: should / might + verb', 'peach', [('subject', 'sub', 'you, it, we'), ('should / might', 'aux', 'nên / có thể'), ('verb', 'v', 'take, rain'), ('thing / time', 'obj', 'sunglasses')], [
    ('{You|sub} {should|aux} {take|v} {sunglasses.|obj}', 'Bạn nên mang kính râm.', V('sunglasses')),
    ('{It|sub} {might|aux} {rain|v} {tomorrow.|obj}', 'Ngày mai có thể mưa.', V('raining')),
    ('{We|sub} {might|aux} {see|v} {a storm.|obj}', 'Có thể chúng mình thấy bão.', V('storm'))]),
  pattern("2️⃣ Không thể nào: can't + verb", 'rose', [('subject', 'sub', 'it, he, she, they'), ("can't", 'pink', 'không thể nào'), ('verb', 'v', 'snow, be'), ('place / thing', 'obj', 'in the desert')], [
    ("{It|sub} {can't|pink} {snow|v} {in the desert.|obj}", 'Ở sa mạc không thể có tuyết.', V('desert')),
    ("{He|sub} {can't|pink} {be|v} {cold. He has gloves.|obj}", 'Cậu ấy không thể lạnh. Cậu ấy có găng tay.', V('gloves')),
    ("{It|sub} {can't|pink} {be|v} {foggy. I can see the hill.|obj}", 'Không thể có sương mù. Mình thấy ngọn đồi.', V('foggy'))]),
  dialog('❓ Hỏi và trả lời', '{What|pink} {might|aux} {happen|v} {tomorrow?|obj}', [
    ('{What|pink} {might|aux} {happen|v} {tomorrow?|obj}', '{It|sub} {might|aux} {rain.|v}', 'Ngày mai có thể xảy ra gì?', 'Có thể trời mưa.', V('raining')),
    ('{Should|aux} {we|sub} {take|v} {sunglasses?|obj}', '{Yes,|sub} {we should.|aux}', 'Mình có nên mang kính râm không?', 'Ừ, nên mang.', V('sunglasses'))]),
  tip("💡 Mẹo: **should, might, can't** + động từ nguyên mẫu, không thêm s. should = nên · might = có thể (chưa chắc) · can't = không thể nào (chắc chắn)."),
  mistakes([('It mights rain.', 'It might rain.', 'might không thêm s.'), ("It can't to snow here.", "It can't snow here.", "Sau can't không có to."),
            ('You should to take a suitcase.', 'You should take a suitcase.', 'Sau should không có to.'), ('It might be rains.', 'It might rain.', 'might + động từ nguyên mẫu.')]),
  acts('a2')],
 [Mc('You ___ take sunglasses. It is sunny. (nên)', 'should', 'might', "can't", 'Lời khuyên → should.', V('sunglasses')),
  Mc('I am not sure. It ___ rain tomorrow.', 'might', 'should', "can't", 'Chưa chắc → might.', V('raining')),
  Mc('It is forty degrees! It ___ snow today.', "can't", 'might', 'should', 'Chắc chắn không → can\'t.', V('snowing')),
  Mc('It might ___ foggy.', 'be', 'is', 'being', 'might + động từ nguyên mẫu: be.', V('foggy')),
  Mc('We ___ pack our suitcase now. (nên)', 'should', 'might', "can't", 'Lời khuyên → should.', V('suitcase')),
  Mc('He has a thick coat. He ___ be cold. (chắc chắn không)', "can't", 'might', 'should', 'Chắc chắn không → can\'t be.'),
  Mc('There are black clouds. There ___ be a storm.', 'might', 'should', "can't", 'Có thể → might.', V('storm')),
  Mc('It ___ snow in the desert. It is too hot.', "can't", 'might', 'should', 'Chắc chắn không → can\'t.', V('desert')),
  Mc('You should ___ gloves in the snow.', 'wear', 'wears', 'wearing', 'Sau should dùng động từ nguyên mẫu.', V('gloves')),
  Mc('We ___ see a camel. Maybe.', 'might', 'should', "can't", 'Có thể → might.', V('camel')),
  Fl('You ___ take sunglasses. It is sunny. (nên)', 'should', ['should', 'might', "can't"], 'Lời khuyên → should.', V('sunglasses')),
  Fl('I am not sure. It ___ rain.', 'might', ['might', 'should', "can't"], 'Chưa chắc → might.', V('raining')),
  Fl("It is very hot. It ___ snow.", "can't", ["can't", 'might', 'should'], 'Chắc chắn không → can\'t.', V('snowing')),
  Fl('It might ___ foggy. (be)', 'be', ['be', 'is', 'being'], 'might + động từ nguyên mẫu: be.', V('foggy')),
  Fl('We ___ pack our suitcase now. (nên)', 'should', ['should', 'might', "can't"], 'Lời khuyên → should.', V('suitcase')),
  Fl('There are black clouds. There ___ be a storm.', 'might', ['might', 'should', "can't"], 'Có thể → might.', V('storm')),
  Fl("He is wearing a thick coat. He ___ be cold. (chắc chắn không)", "can't", ["can't", 'might', 'should'], 'Chắc chắn không → can\'t be.'),
  Fl('You should ___ gloves. (wear)', 'wear', ['wear', 'wears', 'wearing'], 'Sau should dùng động từ nguyên mẫu.', V('gloves')),
  Fl('We ___ see a camel. Maybe.', 'might', ['might', 'should', "can't"], 'Có thể → might.', V('camel')),
  Fl('It ___ rain in the desert. It is very dry. (chắc chắn không)', "can't", ["can't", 'might', 'should'], 'Sa mạc khô → can\'t rain.', V('desert'))],
 [Dlg(['Mum: Should I take my gloves?'], 'Dad: Yes, you ___. It will be cold.', 'should', 'might', "can't", 'Lời khuyên → should.', V('gloves')),
  Dlg(['Boy: Will it rain tomorrow?'], 'Girl: I am not sure. It ___.', 'might', 'should', "can't", 'Chưa chắc → might.', V('raining')),
  Dlg(['Girl: Look! Snow in the desert!'], "Boy: That ___ be snow. It is too hot!", "can't", 'might', 'should', 'Chắc chắn không → can\'t be.', V('desert')),
  Clz(['The sky is dark.', 'The wind is strong.'], 'There ___ be a storm.', 'might', 'should', "can't", 'Có thể → might.', V('storm')),
  Clz(['I love the sun.', 'My eyes hurt in the light.'], 'You ___ wear sunglasses. (nên)', 'should', 'might', "can't", 'Lời khuyên → should.', V('sunglasses')),
  Clz(['The desert is sandy and dry.', 'There is no water.'], "It ___ rain here every day. (chắc chắn không)", "can't", 'might', 'should', 'Chắc chắn không → can\'t.', V('desert'))])

L3 = lesson('l3', 'sky', '📣', 'Imperatives & going to', 'Ra lệnh / dặn dò và dự định',
 'Khi sắp đi chơi, em vừa dặn nhau (Pack your suitcase!) vừa nói dự định (We are going to fly tomorrow).',
 [when('🧭 Khi nào dùng?', [
    ('📣', '**Imperative** (câu mệnh lệnh) = **dặn / ra lệnh**: động từ nguyên mẫu, không có chủ ngữ.', 'Pack your suitcase!', 'Hãy xếp vali đi!'),
    ('🚫', "**Don't + verb** = đừng làm gì.", "Don't forget your sunglasses!", 'Đừng quên kính râm!'),
    ('🎯', '**am / is / are going to + verb** = **dự định** sắp làm.', 'We are going to fly tomorrow.', 'Ngày mai chúng mình sẽ đi máy bay.')]),
  compare('🗂 So sánh: dặn dò hay dự định?', [
    CI('Imperative (verb / Don\'t + verb)', 'sub', 'dặn dò', '**Bảo ai làm gì**, không có chủ ngữ.', [('Take your sunglasses!', 'Hãy mang kính râm!'), ("Don't forget your gloves!", 'Đừng quên găng tay!')], V('sunglasses')),
    CI('am / is / are going to + verb', 'pink', 'dự định', 'Nói **mình dự định** làm gì, có chủ ngữ.', [('We are going to visit the desert.', 'Chúng mình định đi thăm sa mạc.'), ('She is going to ride a camel.', 'Cô ấy định cưỡi lạc đà.')], V('camel'))]),
  pattern('1️⃣ Dặn dò: verb + thing / Don\'t + verb', 'sky', [("Don't", 'pink', 'đừng (nếu cấm)'), ('verb', 'v', 'pack, take'), ('thing', 'obj', 'your suitcase')], [
    ('{Pack|v} {your suitcase!|obj}', 'Hãy xếp vali đi!', V('suitcase')),
    ('{Take|v} {your sunglasses!|obj}', 'Hãy mang kính râm!', V('sunglasses')),
    ("{Don't|pink} {forget|v} {your gloves!|obj}", 'Đừng quên găng tay!', X('gloves'))]),
  pattern('2️⃣ Dự định: am / is / are going to + verb', 'mint', [('subject', 'sub', 'I, she, we'), ('am / is / are going to', 'aux', 'định'), ('verb', 'v', 'visit, ride'), ('place / thing', 'obj', 'the desert')], [
    ('{We|sub} {are going to|aux} {visit|v} {the desert.|obj}', 'Chúng mình định đi thăm sa mạc.', V('desert')),
    ('{She|sub} {is going to|aux} {ride|v} {a camel.|obj}', 'Cô ấy định cưỡi lạc đà.', V('camel')),
    ('{I|sub} {am going to|aux} {wear|v} {my sunglasses.|obj}', 'Mình định đeo kính râm.', V('sunglasses'))]),
  dialog('❓ Hỏi và trả lời', '{What|pink} {are|aux} {you|sub} {going to|aux} {do?|v}', [
    ('{What|pink} {are|aux} {you|sub} {going to|aux} {do|v} {tomorrow?|obj}', '{We|sub} {are going to|aux} {visit|v} {the desert.|obj}', 'Ngày mai bạn định làm gì?', 'Chúng mình định thăm sa mạc.', V('desert')),
    ('{What|pink} {is|aux} {she|sub} {going to|aux} {do|v} {there?|obj}', '{She|sub} {is going to|aux} {ride|v} {a camel.|obj}', 'Cô ấy định làm gì ở đó?', 'Cô ấy định cưỡi lạc đà.', V('camel'))]),
  tip("💡 Mẹo: câu mệnh lệnh **không có chủ ngữ**: Pack…! Don't forget…! · còn **going to** thì **có chủ ngữ** và am / is / are."),
  mistakes([('You pack your suitcase!', 'Pack your suitcase!', 'Câu mệnh lệnh không có chủ ngữ.'), ("Not forget your gloves!", "Don't forget your gloves!", 'Cấm đoán: Don\'t + verb.'),
            ('We going to visit the desert.', 'We are going to visit the desert.', 'Thiếu are.'), ('She is going to rides a camel.', 'She is going to ride a camel.', 'going to + động từ nguyên mẫu.')]),
  acts('a3')],
 [Mc('___ your suitcase!', 'Pack', 'Packs', 'Packing', 'Câu mệnh lệnh dùng động từ nguyên mẫu: Pack.', V('suitcase')),
  Mc("___ forget your sunglasses!", "Don't", 'Not', "Doesn't", "Cấm đoán → Don't + verb.", V('sunglasses')),
  Mc('We ___ going to visit the desert.', 'are', 'is', 'am', 'We → are going to.', V('desert')),
  Mc('She is going to ___ a camel.', 'ride', 'rides', 'riding', 'going to + động từ nguyên mẫu.', V('camel')),
  Mc('___ your gloves, please. It is cold.', 'Take', 'Takes', 'Taking', 'Câu mệnh lệnh dùng động từ nguyên mẫu: Take.', V('gloves')),
  Mc("I ___ going to wear my sunglasses.", 'am', 'is', 'are', 'I → am going to.', V('sunglasses')),
  Mc("___ touch the camel! It is dangerous.", "Don't", 'Not', "Doesn't", "Cấm đoán → Don't + verb.", V('camel')),
  Mc('They ___ going to fly tomorrow.', 'are', 'is', 'am', 'They → are going to.'),
  Mc('Look at the dark sky! It ___ going to rain.', 'is', 'are', 'am', 'It → is going to. (thấy dấu hiệu)', V('storm')),
  Mc('___ you going to ride a camel?', 'Are', 'Is', 'Do', 'You → Are you going to…?', V('camel')),
  Fl('___ (pack) your suitcase!', 'Pack', ['Pack', 'Packs', 'Packing'], 'Câu mệnh lệnh dùng động từ nguyên mẫu.', V('suitcase')),
  Fl("___ forget your gloves!", "Don't", ["Don't", 'Not', "Doesn't"], "Cấm đoán → Don't + verb.", V('gloves')),
  Fl('We ___ going to visit the desert.', 'are', ['are', 'is', 'am'], 'We → are going to.', V('desert')),
  Fl('She is ___ to ride a camel.', 'going', ['going', 'go', 'goes'], 'is going to + verb.', V('camel')),
  Fl('___ (take) your sunglasses!', 'Take', ['Take', 'Takes', 'Taking'], 'Câu mệnh lệnh dùng động từ nguyên mẫu.', V('sunglasses')),
  Fl('I ___ going to wear my gloves.', 'am', ['am', 'is', 'are'], 'I → am going to.', V('gloves')),
  Fl("___ touch the camel! It is dangerous.", "Don't", ["Don't", 'Not', "Doesn't"], "Cấm đoán → Don't + verb.", V('camel')),
  Fl('They are going ___ fly tomorrow.', 'to', ['to', 'for', 'at'], 'are going to + verb.'),
  Fl('___ she going to ride a camel?', 'Is', ['Is', 'Are', 'Do'], 'She → Is she going to…?', V('camel')),
  Fl('He is going to ___ the desert. (visit)', 'visit', ['visit', 'visits', 'visiting'], 'going to + động từ nguyên mẫu.', V('desert'))],
 [Dlg(['Mum: It is cold in the mountains.'], 'Dad: ___ your gloves!', 'Take', 'Takes', 'Taking', 'Câu mệnh lệnh: Take.', V('gloves')),
  Dlg(['Girl: What are you going to do?'], 'Boy: I am going ___ ride a camel.', 'to', 'for', 'at', 'am going to + verb.', V('camel')),
  Dlg(['Teacher: It is dangerous here.'], "Pupil: OK! We ___ touch it.", "won't", "don't going", "aren't going", 'Hứa không làm → won\'t.'),
  Clz(['We are packing for the trip.', 'It will be sunny.'], '___ your sunglasses!', 'Take', 'Takes', 'Taking', 'Câu mệnh lệnh: Take.', V('sunglasses')),
  Clz(['Look at the map.', 'The desert is in the south.'], 'We ___ going to visit it tomorrow.', 'are', 'is', 'am', 'We → are going to.', V('desert')),
  Clz(['The sky is grey.', 'The wind is cold.'], 'It ___ going to snow.', 'is', 'are', 'am', 'It → is going to. (thấy dấu hiệu)', V('snowing'))])

L4 = lesson('l4', 'rose', '🐪', 'Present perfect (regular & irregular)', 'Đã từng làm gì: have / has + V3',
 'Em đã từng cưỡi lạc đà chưa? Động từ quy tắc thêm -ed, bất quy tắc phải nhớ dạng V3.',
 [when('🧭 Khi nào dùng?', [
    ('✅', '**have / has + V3** = **đã từng** làm gì, không nói rõ lúc nào.', 'I have visited the desert.', 'Mình đã từng đến sa mạc.'),
    ('✏️', 'Động từ **quy tắc**: V3 = thêm **-ed**.', 'She has visited a farm.', 'Cô ấy đã từng thăm một trang trại.'),
    ('🔀', 'Động từ **bất quy tắc**: V3 phải nhớ (ride → ridden).', 'He has ridden a camel.', 'Cậu ấy đã từng cưỡi lạc đà.')]),
  compare('🗂 So sánh: V3 quy tắc và bất quy tắc', [
    CI('Quy tắc (+ -ed)', 'sub', 'thêm -ed', 'V3 giống quá khứ đơn: thêm **-ed**.', [('I have visited the desert.', 'Mình đã từng đến sa mạc.'), ('We have packed our suitcase.', 'Chúng mình đã xếp vali.')], V('suitcase')),
    CI('Bất quy tắc', 'pink', 'đổi dạng', 'V3 **phải nhớ**, thường khác quá khứ đơn.', [('He has ridden a camel.', 'Cậu ấy đã từng cưỡi lạc đà.'), ('They have flown to the desert.', 'Họ đã bay đến sa mạc.')], V('camel'))]),
  table('🗂 V3 cần nhớ', ['Nguyên mẫu', 'V3', 'Ví dụ'], [
    ['visit (quy tắc)', 'visited', 'I have visited the desert.'], ['pack (quy tắc)', 'packed', 'She has packed her suitcase.'], ['ride (bất quy tắc)', 'ridden', 'He has ridden a camel.'],
    ['see (bất quy tắc)', 'seen', 'We have seen a storm.'], ['fly (bất quy tắc)', 'flown', 'They have flown to Egypt.'], ['wear (bất quy tắc)', 'worn', 'I have worn sunglasses.'], ['take (bất quy tắc)', 'taken', 'She has taken photos.']], ['sky', 'mint', 'peach']),
  pattern('1️⃣ Đã từng: have / has + V3', 'rose', [('subject', 'sub', 'I, you, she, we'), ('have / has', 'aux', ''), ('V3', 'v', 'visited, ridden'), ('thing / place', 'obj', 'the desert')], [
    ('{I|sub} {have|aux} {visited|v} {the desert.|obj}', 'Mình đã từng đến sa mạc.', V('desert')),
    ('{He|sub} {has|aux} {ridden|v} {a camel.|obj}', 'Cậu ấy đã từng cưỡi lạc đà.', V('camel')),
    ('{We|sub} {have|aux} {seen|v} {a storm.|obj}', 'Chúng mình đã từng thấy bão.', V('storm'))]),
  pattern("2️⃣ Chưa từng: haven't / hasn't + V3", 'sky', [('subject', 'sub', 'I, you, he, we'), ("haven't / hasn't", 'pink', 'chưa'), ('V3', 'v', 'visited, ridden'), ('thing / place', 'obj', 'the desert')], [
    ("{I|sub} {haven't|pink} {visited|v} {the desert.|obj}", 'Mình chưa từng đến sa mạc.', V('desert')),
    ("{She|sub} {hasn't|pink} {ridden|v} {a camel.|obj}", 'Cô ấy chưa từng cưỡi lạc đà.', V('camel')),
    ("{We|sub} {haven't|pink} {seen|v} {snow.|obj}", 'Chúng mình chưa từng thấy tuyết.', V('snowing'))]),
  dialog('❓ Hỏi và trả lời', '{Have|aux} {you|sub} {ever|pink} {+ V3?|v}', [
    ('{Have|aux} {you|sub} {ever|pink} {ridden|v} {a camel?|obj}', '{Yes,|sub} {I have.|aux}', 'Bạn đã bao giờ cưỡi lạc đà chưa?', 'Rồi, mình đã từng.', V('camel')),
    ('{Has|aux} {she|sub} {ever|pink} {seen|v} {snow?|obj}', "{No,|sub} {she hasn't.|pink}", 'Cô ấy đã bao giờ thấy tuyết chưa?', 'Chưa, cô ấy chưa.', V('snowing'))]),
  tip('💡 Mẹo: **I / you / we / they + have** · **he / she / it + has** · rồi V3. Quy tắc thêm -ed; bất quy tắc phải học thuộc (ride → ridden, see → seen, fly → flown).'),
  mistakes([('He has rode a camel.', 'He has ridden a camel.', 'V3 của ride là ridden.'), ('I have flew to the desert.', 'I have flown to the desert.', 'V3 của fly là flown.'),
            ('She have visited a farm.', 'She has visited a farm.', 'She → has.'), ('Have you ever see snow?', 'Have you ever seen snow?', 'Dùng V3: seen.')]),
  acts('a4')],
 [Mc('I have ___ a camel.', 'ridden', 'rode', 'ride', 'have + V3: ridden.', V('camel')),
  Mc('She has ___ to the desert.', 'been', 'went', 'go', 'has + V3: been.', V('desert')),
  Mc('We have ___ on a plane.', 'flown', 'flew', 'fly', 'have + V3: flown.'),
  Mc('He has ___ photos.', 'taken', 'took', 'take', 'has + V3: taken.'),
  Mc('They have ___ the desert.', 'visited', 'visit', 'visiting', 'Quy tắc: visit → visited.', V('desert')),
  Mc('Have you ever ___ snow?', 'seen', 'saw', 'see', 'Have you ever + V3: seen.', V('snowing')),
  Mc('I have never ___ a storm.', 'seen', 'saw', 'see', 'have never + V3: seen.', V('storm')),
  Mc('She has ___ sunglasses today.', 'worn', 'wore', 'wear', 'has + V3: worn.', V('sunglasses')),
  Mc('My dad has ___ his suitcase.', 'packed', 'pack', 'packing', 'Quy tắc: pack → packed.', V('suitcase')),
  Mc('___ she ever ridden a camel?', 'Has', 'Have', 'Is', 'She → Has she ever…?', V('camel')),
  Fl('I have ___ a camel. (ride)', 'ridden', ['ridden', 'rode', 'ride'], 'have + V3: ridden.', V('camel')),
  Fl('She has ___ to the desert. (be)', 'been', ['been', 'was', 'be'], 'has + V3: been.', V('desert')),
  Fl('We have ___ on a plane. (fly)', 'flown', ['flown', 'flew', 'fly'], 'have + V3: flown.'),
  Fl('He has ___ photos. (take)', 'taken', ['taken', 'took', 'take'], 'has + V3: taken.'),
  Fl('They have ___ the desert. (visit)', 'visited', ['visited', 'visit', 'visiting'], 'Quy tắc: visited.', V('desert')),
  Fl('Have you ever ___ snow? (see)', 'seen', ['seen', 'saw', 'see'], 'Have you ever + V3: seen.', V('snowing')),
  Fl('She ___ never seen a storm.', 'has', ['has', 'have', 'is'], 'She → has never seen.', V('storm')),
  Fl('___ you ever worn gloves in summer?', 'Have', ['Have', 'Has', 'Are'], 'You → Have you ever…?', V('gloves')),
  Fl('I ___ packed my suitcase.', 'have', ['have', 'has', 'am'], 'I → have packed.', V('suitcase')),
  Fl('My dad has ___ his sunglasses. (wear)', 'worn', ['worn', 'wore', 'wear'], 'has + V3: worn.', V('sunglasses'))],
 [Dlg(['Tom: Have you ever ridden a camel?'], 'Amy: Yes, I ___.', 'have', 'has', 'am', 'Trả lời Yes, I have.', V('camel')),
  Dlg(['Girl: Has your brother seen snow?'], "Boy: No, he ___.", "hasn't", "haven't", "isn't", "He → hasn't.", V('snowing')),
  Dlg(['Teacher: Have you flown on a plane?'], 'Pupil: Yes, we have ___ to Egypt.', 'flown', 'flew', 'fly', 'have + V3: flown.'),
  Clz(['Ben loves the desert.', 'He goes there every summer.'], 'He has ___ the desert many times.', 'visited', 'visit', 'visiting', 'has + V3: visited.', V('desert')),
  Clz(['Amy is afraid of animals.', 'She is staying away from the camels.'], "She ___ ridden a camel.", "hasn't", "haven't", "isn't", "She → hasn't ridden.", V('camel')),
  Clz(['It is very bright here.', 'Everyone is wearing dark glasses.'], 'We have all ___ sunglasses.', 'worn', 'wore', 'wear', 'have + V3: worn.', V('sunglasses'))])

A = [
 bucket('a1', "⚡ Luyện nhanh: will hay won't?", "Kéo mỗi câu vào ô đúng: sẽ xảy ra (will) hoặc sẽ không xảy ra (won't).", [
   {'id': 'will', 'label': '✅ will (sẽ)', 'c': 'mint'}, {'id': 'wont', 'label': "❌ won't (sẽ không)", 'c': 'rose'}], [
   {'label': 'It will rain on Friday.', 'g': 'will', 'art': V('raining')}, {'label': "It won't snow in the desert.", 'g': 'wont', 'art': V('desert')}, {'label': 'We will need sunglasses.', 'g': 'will', 'art': V('sunglasses')},
   {'label': "We won't need gloves.", 'g': 'wont', 'art': V('gloves')}, {'label': 'There will be a storm.', 'g': 'will', 'art': V('storm')}, {'label': "It won't be foggy.", 'g': 'wont', 'art': V('foggy')}]),
 bucket('a2', "⚡ Luyện nhanh: should, might hay can't?", "Kéo mỗi câu vào ô đúng: lời khuyên (should) · có thể (might) · không thể nào (can't).", [
   {'id': 'should', 'label': '👍 should (nên)', 'c': 'mint'}, {'id': 'might', 'label': '🤔 might (có thể)', 'c': 'sky'}, {'id': 'cant', 'label': "🚫 can't (không thể nào)", 'c': 'rose'}], [
   {'label': 'You should take sunglasses.', 'g': 'should'}, {'label': 'It might rain tomorrow.', 'g': 'might'}, {'label': "It can't snow in the desert.", 'g': 'cant'},
   {'label': 'We should pack our suitcase.', 'g': 'should'}, {'label': 'We might see a camel.', 'g': 'might'}, {'label': "He can't be cold. He has gloves.", 'g': 'cant'}]),
 bucket('a3', '⚡ Luyện nhanh: dặn dò hay dự định?', 'Kéo mỗi câu vào ô đúng: câu mệnh lệnh (dặn dò) hoặc going to (dự định).', [
   {'id': 'imp', 'label': '📣 dặn dò (imperative)', 'c': 'sky'}, {'id': 'gt', 'label': '🎯 dự định (going to)', 'c': 'peach'}], [
   {'label': 'Pack your suitcase!', 'g': 'imp'}, {'label': 'We are going to visit the desert.', 'g': 'gt'}, {'label': "Don't forget your gloves!", 'g': 'imp'},
   {'label': 'She is going to ride a camel.', 'g': 'gt'}, {'label': 'Take your sunglasses!', 'g': 'imp'}, {'label': 'I am going to fly tomorrow.', 'g': 'gt'}]),
 bucket('a4', '⚡ Luyện nhanh: V3 quy tắc hay bất quy tắc?', 'Kéo mỗi dạng V3 vào ô đúng: thêm -ed (quy tắc) hoặc đổi dạng (bất quy tắc).', [
   {'id': 'reg', 'label': '✏️ thêm -ed (quy tắc)', 'c': 'mint'}, {'id': 'irr', 'label': '🔀 đổi dạng (bất quy tắc)', 'c': 'rose'}], [
   {'label': 'visited', 'g': 'reg'}, {'label': 'ridden', 'g': 'irr'}, {'label': 'packed', 'g': 'reg'}, {'label': 'flown', 'g': 'irr'}, {'label': 'walked', 'g': 'reg'}, {'label': 'worn', 'g': 'irr'}])]

u = build_unit(11, 'unit-11', 'Our summer holidays', 'Kỳ nghỉ hè', '✈️', 'flyers--unit-11-toth', [L1, L2, L3, L4], A)
save_unit(u)
