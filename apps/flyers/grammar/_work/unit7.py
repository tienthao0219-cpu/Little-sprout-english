# Unit 7  –  chủ điểm do cô Thảo cung cấp: will vs going to; past simple
# (tên unit "At the castle" do mình đặt theo bộ từ vựng king/queen/crown/gate… – cô kiểm tra lại với sách)
from ugen import *

L1 = lesson('l1', 'sky', '🔮', 'will vs going to', 'Tương lai: will hay going to?',
 'Cả will và going to đều nói về tương lai. Cùng xem khi nào dùng cái nào nhé!',
 [when('🧭 Khi nào dùng?', [
    ('🔮', '**will** = **đoán** hoặc **quyết định ngay lúc nói**.', 'I think it will rain.', 'Mình nghĩ trời sẽ mưa.'),
    ('🎯', '**going to** = **dự định đã có từ trước**.', 'I am going to visit the castle.', 'Mình định đi thăm lâu đài.'),
    ('👀', '**going to** cũng dùng khi **thấy dấu hiệu** ngay trước mắt.', 'Look! The king is going to speak.', 'Nhìn kìa! Nhà vua sắp nói.')]),
  compare('🗂 So sánh will và going to', [
    CI('will + verb', 'aux', 'đoán / quyết định ngay', 'Em **đoán** hoặc **vừa quyết định** lúc nói.', [("The phone is ringing. I'll answer it!", 'Điện thoại reo. Mình sẽ nghe!'), ('I think it will be sunny tomorrow.', 'Mình nghĩ mai trời nắng.')], EM('🔮')),
    CI('am / is / are going to + verb', 'pink', 'dự định có từ trước', 'Em **đã định từ trước** hoặc **thấy dấu hiệu**.', [('I am going to visit the castle on Sunday.', 'Chủ nhật mình định thăm lâu đài.'), ('Look at the clouds! It is going to rain.', 'Nhìn mây kìa! Trời sắp mưa.')], EM('🎯'))]),
  pattern('1️⃣ will + verb', 'sky', [('subject', 'sub', 'I, he, they'), ('will', 'aux', 'sẽ'), ('verb', 'v', 'go, see'), ('thing / place', 'obj', 'the king')], [
    ('{I|sub} {will|aux} {see|v} {the king tomorrow.|obj}', 'Ngày mai mình sẽ gặp nhà vua.', V('king')), ('{She|sub} {will|aux} {wear|v} {a crown.|obj}', 'Cô ấy sẽ đội vương miện.', V('crown')),
    ("{They|sub} {won't|pink} {go|v} {through the gate.|obj}", 'Họ sẽ không đi qua cổng.', X('gate'))]),
  pattern('2️⃣ am / is / are going to + verb', 'mint', [('subject', 'sub', 'I, she, we'), ('am / is / are going to', 'aux', 'định'), ('verb', 'v', 'visit, wear'), ('thing / place', 'obj', 'the castle')], [
    ('{I|sub} {am going to|aux} {wear|v} {a costume.|obj}', 'Mình định mặc trang phục.', V('costume')), ('{She|sub} {is going to|aux} {meet|v} {the queen.|obj}', 'Cô ấy định gặp nữ hoàng.', V('queen')),
    ('{We|sub} {are going to|aux} {climb|v} {the steps.|obj}', 'Chúng mình định leo cầu thang.', V('steps'))]),
  tip("💡 Mẹo: **đoán / quyết định ngay → will** · **dự định có từ trước / thấy dấu hiệu → going to**. Sau cả hai dùng **động từ nguyên mẫu**."),
  mistakes([('She will goes to the castle.', 'She will go to the castle.', 'Sau will dùng động từ nguyên mẫu.'), ('I going to wear a costume.', 'I am going to wear a costume.', 'Thiếu am.'),
            ('They will to see the king.', 'They will see the king.', 'Sau will không có to.'), ('He is going to sees the queen.', 'He is going to see the queen.', 'Sau going to dùng động từ nguyên mẫu.')]),
  acts('a1')],
 [Mc('I think it ___ rain tomorrow.', 'will', 'is going', 'are going', 'Đoán → will.'),
  Mc('I ___ going to wear a costume. (đã định)', 'am', 'will', 'is', 'Dự định → am going to.', V('costume')),
  Mc('She will ___ the queen.', 'meet', 'meets', 'meeting', 'Sau will dùng động từ nguyên mẫu.', V('queen')),
  Mc('Look at the clouds! It ___ to rain.', 'is going', 'will', 'are going', 'Thấy dấu hiệu → is going to.'),
  Mc("A: The phone is ringing. B: I ___ answer it!", 'will', 'am going to', 'is going to', 'Quyết định ngay lúc nói → will.'),
  Mc('We ___ going to climb the steps.', 'are', 'will', 'is', 'We → are going to.', V('steps')),
  Mc('They ___ go through the gate.', "won't", "isn't", "don't going to", "will not = won't.", V('gate')),
  Mc('He ___ going to meet the king on Friday.', 'is', 'will', 'are', 'He → is going to.', V('king')),
  Mc('I think the king ___ be happy.', 'will', 'is going', 'are going', 'Đoán → will.', V('king')),
  Mc('She ___ going to wear a crown tonight.', 'is', 'will', 'are', 'She → is going to.', V('crown')),
  Fl('I think it ___ be sunny tomorrow.', 'will', ['will', 'is going', 'are going'], 'Đoán → will.'),
  Fl('We ___ going to visit the castle.', 'are', ['are', 'will', 'is'], 'We → are going to.'),
  Fl('She will ___ a crown.', 'wear', ['wear', 'wears', 'wearing'], 'Sau will dùng động từ nguyên mẫu.', V('crown')),
  Fl('They are going ___ see the queen.', 'to', ['to', 'will', 'for'], 'are going to + verb.', V('queen')),
  Fl("A: I'm thirsty. B: I ___ get you some water.", 'will', ['will', 'am going to', 'is going'], 'Quyết định ngay → will.'),
  Fl('He ___ going to climb the steps.', 'is', ['is', 'will', 'are'], 'He → is going to.', V('steps')),
  Fl("They ___ go through the gate. (không)", "won't", ["won't", "isn't", "aren't"], "will not = won't.", V('gate')),
  Fl('Look! The butterfly ___ going to fly away.', 'is', ['is', 'will', 'are'], 'Thấy dấu hiệu → is going to.', V('butterfly')),
  Fl('I ___ going to wear a costume. I planned it.', 'am', ['am', 'will', 'is'], 'Dự định → am going to.', V('costume')),
  Fl('I think she ___ like the ring.', 'will', ['will', 'is going', 'are going'], 'Đoán → will.', V('ring'))],
 [Dlg(['Tom: What are you doing on Sunday?'], 'Amy: I ___ going to visit the castle.', 'am', 'will', 'is', 'Dự định có từ trước → am going to.'),
  Dlg(['Mum: There is no milk!'], "Dad: OK. I ___ buy some.", 'will', 'am going to', 'is going to', 'Quyết định ngay → will.'),
  Dlg(['Girl: Why are you wearing a crown?'], 'Boy: I ___ going to be a king in the play.', 'am', 'will', 'is', 'Đã định từ trước → am going to.', V('crown')),
  Clz(['Look at the dark sky.', 'There are big clouds above the castle.'], 'It ___ going to rain.', 'is', 'will', 'are', 'Thấy dấu hiệu → is going to.'),
  Clz(['Tomorrow is the royal day.', 'The queen is ready.'], 'I think she ___ wear a beautiful ring.', 'will', 'is going', 'are going', 'Đoán → will.', V('ring')),
  Clz(['We bought tickets last week.', 'We planned the trip.'], 'We ___ going to see the king.', 'are', 'will', 'is', 'Đã định từ trước → are going to.', V('king')),
  Clz(['The gate is closed.', 'A man has a big key.'], 'I think he ___ open the gate.', 'will', 'is going', 'are going', 'Đoán → will.', V('gate')),
  Clz(['Amy has a ticket for the castle.', 'She asked her mum last week.'], 'She ___ going to visit the queen on Sunday.', 'is', 'will', 'are', 'Đã định từ trước → is going to.', V('queen')),
  Clz(['The sun is hot.', 'The garden is full of flowers.'], 'I think the butterflies ___ come.', 'will', 'is going', 'are going', 'Đoán → will.', V('butterfly')),
  Clz(['It is a dark night.', 'The wind is very strong.'], 'The ring ___ going to fall from the window!', 'is', 'will', 'are', 'Thấy dấu hiệu → is going to.', V('ring'))])

L2 = lesson('l2', 'peach', '⏪', 'Past simple', 'Quá khứ đơn: việc đã xảy ra',
 'Kể chuyện hôm qua nào! Past simple dùng cho việc đã xảy ra và đã xong.',
 [when('🧭 Khi nào dùng?', [
    ('⏪', '**Past simple** = việc **đã xảy ra** và **đã xong** (yesterday, last week, in 2020…).', 'I visited the castle yesterday.', 'Hôm qua mình đã thăm lâu đài.'),
    ('✏️', 'Động từ có quy tắc: thêm **-ed**.', 'We walked to the gate.', 'Chúng mình đã đi bộ đến cổng.'),
    ('🔀', 'Động từ bất quy tắc: **đổi dạng** (go → went, see → saw).', 'She saw the queen.', 'Cô ấy đã gặp nữ hoàng.')]),
  three('🗂 Ba kiểu câu', [('✅', 'Câu có', 'mint', 'I [[visited]] the castle.', 'Mình đã thăm lâu đài.'), ('❌', 'Câu không', 'rose', "I [[didn't visit]] the castle.", 'Mình đã không thăm lâu đài.'), ('❓', 'Câu hỏi', 'sky', '[[Did]] you [[visit]] the castle?', 'Bạn đã thăm lâu đài chưa?')]),
  pattern('1️⃣ Câu có: verb-ed / dạng quá khứ', 'peach', [('subject', 'sub', 'I, she, they'), ('past verb', 'v', 'quá khứ: visited, saw, went'), ('thing / place', 'obj', 'the castle'), ('time', 'pre', 'yesterday')], [
    ('{I|sub} {visited|v} {the castle|obj} {yesterday.|pre}', 'Hôm qua mình đã thăm lâu đài.', V('gate')), ('{She|sub} {saw|v} {the queen|obj} {last week.|pre}', 'Tuần trước cô ấy đã gặp nữ hoàng.', V('queen')),
    ('{They|sub} {went|v} {through the gate|obj} {this morning.|pre}', 'Sáng nay họ đã đi qua cổng.', V('gate'))]),
  pattern("2️⃣ Câu phủ định: didn't + verb", 'rose', [('subject', 'sub', 'I, he'), ("didn't", 'pink', 'đã không'), ('base verb', 'v', 'nguyên mẫu: visit, see'), ('thing', 'obj', 'the king')], [
    ("{I|sub} {didn't|pink} {see|v} {the king.|obj}", 'Mình đã không gặp nhà vua.', X('king')), ("{He|sub} {didn't|pink} {wear|v} {a costume.|obj}", 'Cậu ấy đã không mặc trang phục.', X('costume')),
    ("{We|sub} {didn't|pink} {climb|v} {the steps.|obj}", 'Chúng mình đã không leo cầu thang.', X('steps'))]),
  dialog('❓ Hỏi và trả lời', '{Did|aux} {you|sub} {+ verb|v} {…?|obj}', [
    ('{Did|aux} {you|sub} {see|v} {the queen?|obj}', '{Yes,|sub} {I did.|aux}', 'Bạn đã gặp nữ hoàng chưa?', 'Rồi, mình đã gặp.', V('queen')),
    ('{Did|aux} {she|sub} {wear|v} {a crown?|obj}', "{No,|sub} {she didn't.|pink}", 'Cô ấy đã đội vương miện à?', 'Không, cô ấy không đội.', V('crown'))]),
  tip("💡 Mẹo: câu phủ định và câu hỏi dùng **did / didn't + động từ nguyên mẫu** (không thêm -ed). Câu có thì dùng **quá khứ**: visit → visited, go → went, see → saw."),
  mistakes([("I didn't visited the castle.", "I didn't visit the castle.", "Sau didn't dùng động từ nguyên mẫu."), ('She goed to the gate.', 'She went to the gate.', 'go → went (bất quy tắc).'),
            ('Did you saw the king?', 'Did you see the king?', 'Sau Did dùng động từ nguyên mẫu.'), ('We visit the castle yesterday.', 'We visited the castle yesterday.', 'yesterday → quá khứ.')]),
  acts('a2')],
 [Mc('I ___ the castle yesterday.', 'visited', 'visit', 'visiting', 'yesterday → visited.', V('gate')),
  Mc('She ___ the queen last week.', 'saw', 'see', 'seen', 'see → saw.', V('queen')),
  Mc('They ___ through the gate this morning.', 'went', 'go', 'goes', 'go → went.', V('gate')),
  Mc("I didn't ___ the king.", 'see', 'saw', 'seen', "Sau didn't dùng động từ nguyên mẫu.", V('king')),
  Mc('___ you see the queen?', 'Did', 'Do', 'Were', 'Câu hỏi quá khứ → Did.', V('queen')),
  Mc('We ___ the steps yesterday.', 'climbed', 'climb', 'climbing', 'climb → climbed.', V('steps')),
  Mc('He ___ a crown last night.', 'wore', 'wear', 'wears', 'wear → wore.', V('crown')),
  Mc("She didn't ___ a costume.", 'wear', 'wore', 'worn', "Sau didn't dùng động từ nguyên mẫu.", V('costume')),
  Mc('A: Did he go to the castle? B: Yes, he ___.', 'did', 'does', 'was', 'Trả lời Yes, he did.'),
  Mc('Last year, we ___ a swan at the lake.', 'saw', 'see', 'seeing', 'last year → saw.', V('swan')),
  Fl('I ___ the castle yesterday. (visit)', 'visited', ['visited', 'visit', 'visiting'], 'yesterday → visited.', V('gate')),
  Fl('She ___ the king last week. (see)', 'saw', ['saw', 'see', 'seen'], 'see → saw.', V('king')),
  Fl("They ___ to the gate. (go)", 'went', ['went', 'go', 'goes'], 'go → went.', V('gate')),
  Fl("I didn't ___ the queen. (see)", 'see', ['see', 'saw', 'seen'], "Sau didn't dùng động từ nguyên mẫu.", V('queen')),
  Fl('___ she wear a ring?', 'Did', ['Did', 'Do', 'Was'], 'Câu hỏi quá khứ → Did.', V('ring')),
  Fl('We ___ the steps. (climb)', 'climbed', ['climbed', 'climb', 'climbing'], 'climb → climbed.', V('steps')),
  Fl('He ___ a costume yesterday. (wear)', 'wore', ['wore', 'wear', 'wears'], 'wear → wore.', V('costume')),
  Fl("She didn't ___ a crown. (wear)", 'wear', ['wear', 'wore', 'worn'], "Sau didn't dùng động từ nguyên mẫu.", V('crown')),
  Fl('A: Did you see a butterfly? B: Yes, I ___.', 'did', ['did', 'was', 'do'], 'Trả lời Yes, I did.', V('butterfly')),
  Fl('We ___ a swan yesterday. (see)', 'saw', ['saw', 'see', 'seen'], 'see → saw.', V('swan'))],
 [Dlg(['Mum: What did you do yesterday?'], 'Tom: I ___ the castle.', 'visited', 'visit', 'visiting', 'yesterday → visited.'),
  Dlg(['Girl: Did you see the king?'], 'Boy: No, I ___.', "didn't", "don't", "wasn't", 'Trả lời No, I didn’t.', V('king')),
  Dlg(['Teacher: Where did you go last week?'], 'Pupil: We ___ to the gate of the castle.', 'went', 'go', 'goes', 'go → went.', V('gate')),
  Clz(['Last Saturday, we went to a big castle.', 'There was a long line.'], 'We ___ the steps to the top.', 'climbed', 'climb', 'climbing', 'last Saturday → climbed.', V('steps')),
  Clz(['At the castle party, everyone wore a costume.', 'The queen came too.'], 'I ___ a red crown.', 'wore', 'wear', 'wears', 'wear → wore.', V('crown')),
  Clz(['We walked by the lake.', 'The water was quiet.'], 'We ___ a white swan.', 'saw', 'see', 'seen', 'see → saw.', V('swan')),
  Clz(['Yesterday, I went to a castle party.', 'Everyone was in a costume.'], 'I ___ a blue costume.', 'wore', 'wear', 'wears', 'yesterday → wore.', V('costume')),
  Clz(['The king stood at the gate.', 'We looked at him.'], "We ___ him because he was tall.", 'saw', 'see', 'seen', 'see → saw.', V('king')),
  Clz(['After lunch, we walked to the castle.', 'The hill was high.'], "We ___ go by bus. We walked.", "didn't", "don't", "wasn't", "Việc đã xảy ra → didn't + động từ.", V('steps')),
  Clz(['The queen came into the room.', 'She looked at the table.'], '___ she wear a ring?', 'Did', 'Do', 'Was', 'Câu hỏi quá khứ → Did.', V('ring'))])

A = [
 bucket('a1', '⚡ Luyện nhanh: will hay going to?', 'Kéo mỗi câu vào ô đúng: will (đoán / quyết định ngay) hoặc going to (dự định / thấy dấu hiệu).', [
   {'id': 'will', 'label': '🔮 will', 'c': 'sky'}, {'id': 'gt', 'label': '🎯 going to', 'c': 'peach'}], [
   {'label': 'I think it will rain tomorrow.', 'g': 'will'}, {'label': 'I am going to visit the castle on Sunday.', 'g': 'gt'},
   {'label': "The phone is ringing. I'll answer it!", 'g': 'will'}, {'label': 'Look at the clouds! It is going to rain.', 'g': 'gt'},
   {'label': 'I think the king will be happy.', 'g': 'will'}, {'label': 'We are going to see the queen. We planned it.', 'g': 'gt'}]),
 bucket('a2', '⚡ Luyện nhanh: quy tắc hay bất quy tắc?', 'Kéo mỗi dạng quá khứ vào ô đúng: thêm -ed (quy tắc) hoặc đổi dạng (bất quy tắc).', [
   {'id': 'reg', 'label': '✏️ thêm -ed (quy tắc)', 'c': 'mint'}, {'id': 'irr', 'label': '🔀 đổi dạng (bất quy tắc)', 'c': 'rose'}], [
   {'label': 'visited', 'g': 'reg'}, {'label': 'went', 'g': 'irr'}, {'label': 'climbed', 'g': 'reg'}, {'label': 'saw', 'g': 'irr'}, {'label': 'walked', 'g': 'reg'}, {'label': 'wore', 'g': 'irr'}])]

u = build_unit(7, 'unit-7', 'At the castle', 'Ở lâu đài', '🏰', 'flyers--unit-7-o88s', [L1, L2], A)
save_unit(u)
