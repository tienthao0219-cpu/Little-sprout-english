# Unit 3 · Eating out  –  will (offers); conditional & result clauses (If / When)
from ugen import *

L1 = lesson('l1', 'mint', '🍽️', 'will (offers)', "Đề nghị giúp: I'll …",
 "Mời bạn ăn gì đó, hoặc nói 'để mình giúp' thì dùng I'll nhé!",
 [when('🧭 Khi nào dùng?', [
    ('🤝', "**I'll + động từ** = \"Để mình …\" (đề nghị giúp ngay lúc nói). **I'll = I will**.", "I'll get you a drink.", 'Để mình lấy cho bạn đồ uống.'),
    ('🍽️', 'Mời ai ăn / uống: **Will you have + đồ ăn?**', 'Will you have some pizza?', 'Bạn ăn chút pizza nhé?'),
    ('✅', 'Trả lời: **Yes, please.** hoặc **No, thank you.**', 'Yes, please!', 'Vâng, cảm ơn!')]),
  table('🗂 Ba tình huống', ['🎯 Muốn…', '💬 Nói', '✏️ Ví dụ'], [
    ['**Đề nghị giúp**', "I'll + động từ", "I'll get you a fork."], ['**Mời ăn / uống**', 'Will you have …?', 'Will you have some jam?'],
    ['**Trả lời**', 'Yes, please. / No, thank you.', "No, thank you. I'm full."]], ['peach', 'sky', 'mint']),
  pattern("1️⃣ Đề nghị giúp: I'll + động từ", 'sky', [("I'll", 'aux', 'để mình'), ('động từ', 'v', 'get, bring, cut'), ('cho ai', 'sub', 'you'), ('cái gì', 'obj', 'a spoon, some salt')], [
    ("{I'll|aux} {bring|v} {you|sub} {a spoon.|obj}", 'Để mình mang cho bạn cái thìa.', V('spoon')),
    ("{I'll|aux} {get|v} {you|sub} {some salt.|obj}", 'Để mình lấy cho bạn ít muối.', V('salt')),
    ("{I'll|aux} {cut|v} {the pizza|obj} {for you.|sub}", 'Để mình cắt pizza cho bạn.', V('pizza'))]),
  pattern('2️⃣ Mời ăn: Will you have + đồ ăn?', 'rose', [('Will', 'pink', 'mời'), ('you', 'sub', 'bạn'), ('have', 'v', 'dùng / ăn'), ('đồ ăn', 'obj', 'some jam')], [
    ('{Will|pink} {you|sub} {have|v} {some pizza?|obj}', 'Bạn ăn chút pizza nhé?', V('pizza')),
    ('{Will|pink} {you|sub} {have|v} {some honey?|obj}', 'Bạn dùng chút mật ong nhé?', V('honey')),
    ('{Will|pink} {you|sub} {have|v} {a biscuit?|obj}', 'Bạn ăn một cái bánh quy nhé?', V('biscuit'))]),
  dialog('❓ Mời ăn và trả lời', '{Will|pink} {you|sub} {have|v} {some …?|obj}', [
    ('{Will|pink} {you|sub} {have|v} {some pizza?|obj}', '{Yes,|sub} {please!|pink}', 'Bạn ăn chút pizza nhé?', 'Vâng, cảm ơn!', V('pizza')),
    ('{Will|pink} {you|sub} {have|v} {some jam?|obj}', '{No,|sub} {thank you.|pink}', 'Bạn dùng chút mứt nhé?', 'Không, cảm ơn.', V('jam'))]),
  tip("💡 Mẹo: **I'll + động từ nguyên mẫu** (không thêm to, không thêm s). Mời ăn: **Will you have …?**"),
  mistakes([("I'll to get you a drink.", "I'll get you a drink.", "Sau I'll dùng động từ nguyên mẫu, không có to."), ("I'll gets you a spoon.", "I'll get you a spoon.", "I'll + động từ nguyên mẫu (không thêm s)."),
            ('Will you having some jam?', 'Will you have some jam?', 'Will you + động từ nguyên mẫu.'), ('No, please.', 'No, thank you.', 'Từ chối lịch sự → No, thank you.')]),
  acts('a1', 'a2')],
 [Mc("I'll ___ you a spoon.", 'get', 'gets', 'getting', "Sau I'll dùng động từ nguyên mẫu → get.", V('spoon')),
  Mc('___ you have some pizza?', 'Will', 'Are', 'Is', 'Mời ăn → Will you have…?', V('pizza')),
  Mc("I'll ___ you some water.", 'bring', 'brings', 'bringing', "Sau I'll dùng động từ nguyên mẫu → bring."),
  Mc('A: Will you have some jam? B: Yes, ___.', 'please', 'sorry', 'welcome', 'Đồng ý → Yes, please.', V('jam')),
  Mc('A: Will you have a biscuit? B: No, ___ you.', 'thank', 'please', 'sorry', 'Từ chối → No, thank you.', V('biscuit')),
  Mc("I'll ___ the pizza for you.", 'cut', 'cuts', 'cutting', "Sau I'll dùng động từ nguyên mẫu → cut.", V('pizza')),
  Mc('___ get you a fork.', "I'll", "I'm", 'I does', "Đề nghị giúp → I'll get you a fork.", V('fork')),
  Mc('Will you ___ some honey?', 'have', 'has', 'having', 'Sau Will you dùng động từ nguyên mẫu → have.', V('honey')),
  Mc("It is hot! I'll ___ the window.", 'open', 'opens', 'opening', "Sau I'll dùng động từ nguyên mẫu → open."),
  Mc("I'll ___ you a cup of tea.", 'make', 'makes', 'making', "Sau I'll dùng động từ nguyên mẫu → make."),
  Fl('___ get you a knife.', "I'll", ["I'll", "I'm", 'Will'], "Đề nghị giúp → I'll get you a knife.", V('knife'), '(để mình)'),
  Fl("I'll ___ you a drink.", 'get', ['get', 'gets', 'getting'], "Sau I'll dùng động từ nguyên mẫu."),
  Fl('Will you ___ some jam?', 'have', ['have', 'has', 'having'], 'Sau Will you dùng động từ nguyên mẫu.', V('jam')),
  Fl('A: Will you have some pizza? B: Yes, ___!', 'please', ['please', 'sorry', 'welcome'], 'Đồng ý → Yes, please.', V('pizza'), '(vâng, làm ơn)'),
  Fl('No, thank ___.', 'you', ['you', 'your', 'yours'], 'Từ chối → No, thank you.', None, '(cảm ơn bạn)'),
  Fl("I'll ___ you the salt.", 'pass', ['pass', 'passes', 'passing'], "Sau I'll dùng động từ nguyên mẫu.", V('salt')),
  Fl('___ you have some honey?', 'Will', ['Will', 'Are', 'Is'], 'Mời ăn → Will you have…?', V('honey')),
  Fl("I'll ___ the pizza into pieces.", 'cut', ['cut', 'cuts', 'cutting'], "Sau I'll dùng động từ nguyên mẫu.", V('pizza')),
  Fl('I ___ bring you a spoon.', 'will', ['will', 'am', 'do'], 'I will bring… = Để mình mang… (đề nghị).', V('spoon'), '(sẽ)'),
  Fl('A: Will you have a biscuit? B: Yes, ___.', 'please', ['please', 'sorry', 'welcome'], 'Đồng ý → Yes, please.', V('biscuit'))],
 [Dlg(['Girl: I do not have a fork.'], "Boy: ___ get you one.", "I'll", 'I', "I'm", "Đề nghị giúp → I'll."),
  Dlg(['Dad: Will you have some jam?'], 'Tom: Yes, ___!', 'please', 'sorry', 'welcome', 'Đồng ý → Yes, please.', V('jam')),
  Dlg(['Amy: It is too noisy here.'], 'Ben: ___ turn off the TV.', "I'll", "I'm", 'Will', "Đề nghị giúp → I'll."),
  Clz(['We are at a restaurant.', 'The waiter is kind.'], "He says: '___ you have some water?'", 'Will', 'Are', 'Is', 'Mời → Will you have…?'),
  Clz(['My friend drops her fork.', 'It is on the floor.'], "I say: 'Do not worry. ___ get you a new one.'", "I'll", 'I', "I'm", "Đề nghị giúp → I'll."),
  Clz(['The cake is on the table.', 'It is a big cake.'], 'A: Will you have some cake? B: No, ___ you. I am full.', 'thank', 'please', 'sorry', 'Từ chối → No, thank you.')])

L2 = lesson('l2', 'peach', '🔗', 'Conditional & result clauses', 'Nếu / Khi … thì …',
 'Nếu … thì … Cùng nối hai ý với If và When nhé!',
 [when('🧭 Khi nào dùng?', [
    ('🔗', '**If / When + hiện tại đơn, + hiện tại đơn** = nói điều **thường xảy ra / luôn đúng**.', 'If you drop it, it breaks.', 'Nếu em làm rơi, nó sẽ vỡ.'),
    ('🔁', 'Có thể **đổi chỗ** hai vế. Nếu **If / When** đứng giữa câu thì **không cần dấu phẩy**.', 'I feel ill if I eat too much.', 'Mình thấy mệt nếu ăn quá nhiều.'),
    ('⏱️', '**When** = "khi" (chắc chắn xảy ra). **If** = "nếu" (có thể xảy ra).', 'When it is hot, I drink water.', 'Khi trời nóng, mình uống nước.')]),
  table('🗂 Hai vế của câu', ['📌 Vế 1 (điều kiện)', '👉 Vế 2 (kết quả)', '✏️ Ví dụ'], [
    ['**If** + hiện tại đơn', 'hiện tại đơn', 'If you eat too much, you feel ill.'], ['**When** + hiện tại đơn', 'hiện tại đơn', 'When it is hot, I drink water.'],
    ['(đổi chỗ) kết quả', '**if** + điều kiện', 'I feel ill if I eat too much.']], ['peach', 'sky', 'mint']),
  pattern('1️⃣ If + điều kiện, kết quả', 'sky', [('If', 'pink', 'nếu'), ('điều kiện', 'obj', 'you eat too much,'), ('kết quả', 'v', 'you feel ill.')], [
    ('{If|pink} {you eat too much,|obj} {you feel ill.|v}', 'Nếu em ăn quá nhiều, em sẽ thấy mệt.', V('ill')),
    ('{If|pink} {the pizza is hot,|obj} {I wait.|v}', 'Nếu pizza còn nóng, mình đợi.', V('pizza')),
    ('{If|pink} {you add sugar,|obj} {the tea is sweet.|v}', 'Nếu em thêm đường, trà sẽ ngọt.', V('sugar'))]),
  pattern('2️⃣ When + điều kiện, kết quả', 'rose', [('When', 'pink', 'khi'), ('điều kiện', 'obj', 'it is hot,'), ('kết quả', 'v', 'I drink water.')], [
    ('{When|pink} {the pizza is delicious,|obj} {I smile.|v}', 'Khi pizza ngon, mình mỉm cười.', V('delicious')),
    ('{When|pink} {I taste honey,|obj} {I feel happy.|v}', 'Khi mình nếm mật ong, mình thấy vui.', V('honey')),
    ('{When|pink} {it is hot,|obj} {I drink water.|v}', 'Khi trời nóng, mình uống nước.', EM('🥵'))]),
  tip('💡 Mẹo: cả hai vế đều dùng **hiện tại đơn** (không dùng will). He / She / It → thêm **s**: he eats, it breaks.'),
  mistakes([('If you eat too much, you will to feel ill.', 'If you eat too much, you feel ill.', 'Cả hai vế dùng hiện tại đơn.'), ('If it rains, I staying at home.', 'If it rains, I stay at home.', 'Hiện tại đơn: I stay.'),
            ('If he eat too much, he feels ill.', 'If he eats too much, he feels ill.', 'He + eats (thêm s).'), ('If you drop it it breaks.', 'If you drop it, it breaks.', 'Sau vế If / When đứng đầu câu cần dấu phẩy.')]),
  acts('a3')],
 [Mc('If you eat too much, you ___ ill.', 'feel', 'feeling', 'felt', 'Hiện tại đơn → you feel.', V('ill')),
  Mc('If it is hot, I ___ water.', 'drink', 'drinking', 'drank', 'Hiện tại đơn → I drink.'),
  Mc('When I am hungry, I ___.', 'eat', 'eating', 'ate', 'Hiện tại đơn → I eat.'),
  Mc('If you drop a glass, it ___.', 'breaks', 'break', 'breaking', 'It + động từ thêm s → it breaks.'),
  Mc('If he ___ too much, he feels ill.', 'eats', 'eat', 'eating', 'He + eats (thêm s).'),
  Mc('___ you add sugar, the tea is sweet.', 'If', 'But', 'Or', 'Nếu … thì … → If.', V('sugar')),
  Mc('When the pizza is delicious, I ___.', 'smile', 'smiling', 'smiled', 'Hiện tại đơn → I smile.', V('delicious')),
  Mc('I feel ill ___ I eat too much.', 'if', 'but', 'so', 'Mình thấy mệt nếu ăn quá nhiều → if.'),
  Mc('If it ___, we stay at home.', 'rains', 'raining', 'rained', 'It + động từ thêm s → it rains.'),
  Mc('When it is cold, she ___ a coat.', 'wears', 'wearing', 'wear', 'She + wears (thêm s).'),
  Fl('___ you eat too much, you feel ill.', 'If', ['If', 'Because', 'But'], 'Nếu … thì … → If.', V('ill'), '(nếu)'),
  Fl('If I am thirsty, I ___ water.', 'drink', ['drink', 'drinks', 'drinking'], 'Hiện tại đơn → I drink.'),
  Fl('When she is happy, she ___.', 'smiles', ['smiles', 'smile', 'smiling'], 'She + smiles (thêm s).'),
  Fl('If you drop it, it ___.', 'breaks', ['breaks', 'break', 'breaking'], 'It + breaks (thêm s).'),
  Fl('I feel ill ___ I eat too much.', 'if', ['if', 'but', 'so'], 'Mình thấy mệt nếu ăn quá nhiều → if.', None, '(nếu)'),
  Fl('If it is hot, I ___ ice cream.', 'eat', ['eat', 'eats', 'eating'], 'Hiện tại đơn → I eat.'),
  Fl('___ I get home, I wash my hands.', 'When', ['When', 'If', 'Because'], 'Khi (chắc chắn xảy ra) → When.', None, '(khi — chắc chắn xảy ra)'),
  Fl('If he eats too much, he ___ ill.', 'feels', ['feels', 'feel', 'feeling'], 'He + feels (thêm s).', V('ill')),
  Fl('If you add salt, the soup ___ salty.', 'is', ['is', 'are', 'be'], 'The soup (số ít) → is.', V('salt')),
  Fl('If it ___, we stay at home.', 'rains', ['rains', 'rain', 'raining'], 'It + rains (thêm s).')],
 [Dlg(['Mum: Why is Ben ill?'], 'Dad: If he ___ too much, he feels ill.', 'eats', 'eat', 'eating', 'He + eats (thêm s).', V('ill')),
  Dlg(['Girl: What do you do when you are hot?'], 'Boy: When I am hot, I ___ water.', 'drink', 'drinks', 'drinking', 'Hiện tại đơn → I drink.'),
  Dlg(['Boy: Why is the tea so sweet?'], 'Girl: ___ you add sugar, it is sweet.', 'If', 'Or', 'But', 'Nếu … thì … → If.', V('sugar')),
  Clz(['Tom loves honey.', 'He eats it every day.'], 'If he eats too much, he ___ ill.', 'feels', 'feel', 'feeling', 'He + feels (thêm s).'),
  Clz(['It is a hot day.', 'My ice cream is in my hand.'], 'If it is hot, it ___.', 'melts', 'melt', 'melting', 'It + melts (thêm s).'),
  Clz(['We are in a restaurant.', 'The pizza is on the table.'], 'If the pizza is hot, we ___.', 'wait', 'waits', 'waiting', 'We + wait (không thêm s).', V('pizza'))])

A = [
 bucket('a1', "⚡ Luyện nhanh 1: đề nghị giúp hay mời ăn?", "Kéo mỗi câu vào ô đúng: đề nghị giúp (I'll…) hoặc mời ăn / uống (Will you have…?).", [
   {'id': 'off', 'label': "🤝 Đề nghị giúp: I'll…", 'c': 'sky'}, {'id': 'inv', 'label': '🍽️ Mời ăn: Will you have…?', 'c': 'rose'}], [
   {'label': "I'll get you some water.", 'g': 'off'}, {'label': 'Will you have some jam?', 'g': 'inv'}, {'label': "I'll bring you a fork.", 'g': 'off'},
   {'label': 'Will you have a biscuit?', 'g': 'inv'}, {'label': "I'll cut the pizza.", 'g': 'off'}, {'label': 'Will you have some honey?', 'g': 'inv'}]),
 bucket('a2', '⚡ Luyện nhanh 2: đồng ý hay từ chối?', 'Kéo câu trả lời vào đúng ô.', [
   {'id': 'yes', 'label': '👍 Đồng ý', 'c': 'mint'}, {'id': 'no', 'label': '🙅 Từ chối lịch sự', 'c': 'peach'}], [
   {'label': 'Yes, please.', 'g': 'yes'}, {'label': 'No, thank you.', 'g': 'no'}, {'label': 'Yes, please! It looks delicious.', 'g': 'yes'},
   {'label': "No, thank you. I'm full.", 'g': 'no'}, {'label': 'Yes, I would love some!', 'g': 'yes'}, {'label': "No, thank you. I'm OK.", 'g': 'no'}]),
 bucket('a3', '⚡ Luyện nhanh: vế điều kiện hay vế kết quả?', 'Kéo mỗi nửa câu vào ô đúng: điều kiện (If / When…) hoặc kết quả.', [
   {'id': 'cond', 'label': '🔗 Điều kiện (If / When …)', 'c': 'sky'}, {'id': 'res', 'label': '👉 Kết quả', 'c': 'rose'}], [
   {'label': 'If you eat too much', 'g': 'cond'}, {'label': 'you feel ill', 'g': 'res'}, {'label': 'When it is hot', 'g': 'cond'},
   {'label': 'I drink water', 'g': 'res'}, {'label': 'If you drop it', 'g': 'cond'}, {'label': 'it breaks', 'g': 'res'}])]

u = build_unit(3, 'unit-3', 'Eating out', 'Đi ăn ngoài', '🍽️', 'flyers--unit-3-6gj1', [L1, L2], A)
save_unit(u)
