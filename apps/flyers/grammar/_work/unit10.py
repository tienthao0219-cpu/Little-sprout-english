# Unit 10 · A good year!  –  chủ điểm do cô Thảo cung cấp: -ing forms; if clauses
# Quy tắc: chỗ trống của câu điền từ chỉ hỏi NGỮ PHÁP, chỉ có một đáp án hợp lý.
from ugen import *

L1 = lesson('l1', 'sky', '⛷️', '-ing forms', 'Động từ thêm -ing: go + V-ing, enjoy + V-ing…',
 'Mùa đông em thích làm gì? Nhiều động từ đi với dạng V-ing: go sledging, enjoy making…',
 [when('🧭 Khi nào dùng V-ing?', [
    ('⛷️', '**go + V-ing** = đi (chơi môn thể thao, hoạt động).', 'We go sledging in winter.', 'Mùa đông chúng mình đi trượt xe tuyết.'),
    ('❤️', '**like / love / enjoy / hate + V-ing** = thích / ghét làm gì.', 'I enjoy making snowmen.', 'Mình thích làm người tuyết.'),
    ('📌', '**V-ing làm chủ ngữ** = việc làm gì đó (đứng đầu câu).', 'Collecting leaves is fun.', 'Nhặt lá là việc vui.')]),
  compare('🗂 So sánh 3 cách dùng V-ing', [
    CI('go + V-ing', 'sub', 'đi làm hoạt động', 'Đi chơi một môn thể thao hay hoạt động ngoài trời.', [('They go snowboarding.', 'Họ đi trượt ván tuyết.')], V('snowboard')),
    CI('like / love / enjoy / hate + V-ing', 'pink', 'thích / ghét', 'Nói em **thích hay ghét** làm việc gì.', [('She enjoys making a snowman.', 'Cô ấy thích làm người tuyết.')], V('snowman')),
    CI('V-ing ở đầu câu', 'aux', 'V-ing làm chủ ngữ', 'V-ing đứng **đầu câu** như một danh từ.', [('Collecting leaves is fun.', 'Nhặt lá là việc vui.')], V('collect'))]),
  table('🗂 Cách thêm -ing', ['Quy tắc', 'Nguyên mẫu → V-ing', 'Ví dụ'], [
    ['Thêm -ing', 'collect → collecting · push → pushing', 'I enjoy collecting leaves.'], ['Bỏ e rồi thêm -ing', 'make → making · sledge → sledging', 'We go sledging.'],
    ['Gấp đôi chữ cuối (1 nguyên âm + 1 phụ âm)', 'run → running · swim → swimming', 'He loves running.']], ['sky', 'mint', 'peach']),
  pattern('1️⃣ go + V-ing', 'sky', [('subject', 'sub', 'I, we, they'), ('go / goes', 'aux', 'đi'), ('V-ing', 'v', 'sledging, snowboarding'), ('place / time', 'obj', 'in winter')], [
    ('{We|sub} {go|aux} {sledging|v} {in winter.|obj}', 'Mùa đông chúng mình đi trượt xe tuyết.', V('sledge')),
    ('{They|sub} {go|aux} {snowboarding|v} {on the hill.|obj}', 'Họ đi trượt ván tuyết trên đồi.', V('snowboard')),
    ('{She|sub} {goes|aux} {skating|v} {every Sunday.|obj}', 'Chủ nhật nào cô ấy cũng đi trượt băng.', EM('⛸️'))]),
  pattern('2️⃣ like / love / enjoy / hate + V-ing', 'peach', [('subject', 'sub', 'I, she, they'), ('like / love / enjoy / hate', 'aux', 'thích, ghét'), ('V-ing', 'v', 'making, collecting'), ('thing', 'obj', 'a snowman')], [
    ('{I|sub} {enjoy|aux} {making|v} {snowmen.|obj}', 'Mình thích làm người tuyết.', V('snowman')),
    ('{She|sub} {loves|aux} {collecting|v} {leaves.|obj}', 'Cô ấy rất thích nhặt lá.', V('leaf')),
    ('{He|sub} {hates|aux} {pulling|v} {the sledge.|obj}', 'Cậu ấy ghét kéo xe trượt.', V('pull'))]),
  dialog('❓ Hỏi và trả lời', '{What|pink} {do|aux} {you|sub} {enjoy|aux} {doing?|v}', [
    ('{What|pink} {do|aux} {you|sub} {enjoy|aux} {doing|v} {in winter?|obj}', '{I|sub} {enjoy|aux} {making|v} {snowmen.|obj}', 'Mùa đông bạn thích làm gì?', 'Mình thích làm người tuyết.', V('winter')),
    ('{What|pink} {does|aux} {she|sub} {like|aux} {doing|v} {in autumn?|obj}', '{She|sub} {likes|aux} {collecting|v} {leaves.|obj}', 'Mùa thu cô ấy thích làm gì?', 'Cô ấy thích nhặt lá.', V('autumn'))]),
  tip('💡 Mẹo: sau **go, like, love, enjoy, hate** dùng **V-ing**. Nhớ quy tắc: bỏ e (make → making) · gấp đôi chữ cuối (run → running).'),
  mistakes([('We go sledge in winter.', 'We go sledging in winter.', 'go + V-ing.'), ('I enjoy make snowmen.', 'I enjoy making snowmen.', 'enjoy + V-ing.'),
            ('He loves runing.', 'He loves running.', 'run gấp đôi n → running.'), ('She likes to collecting leaves.', 'She likes collecting leaves.', 'like + V-ing (không có to).')]),
  acts('a1')],
 [Mc('We go ___ in winter.', 'sledging', 'sledge', 'sledges', 'go + V-ing: sledging.', V('sledge')),
  Mc('I enjoy ___ snowmen.', 'making', 'make', 'makes', 'enjoy + V-ing: making.', V('snowman')),
  Mc('She likes ___ leaves.', 'collecting', 'collect', 'collects', 'likes + V-ing: collecting.', V('leaf')),
  Mc('___ snowballs is fun.', 'Making', 'Make', 'Makes', 'V-ing làm chủ ngữ: Making.', V('snowball')),
  Mc('He loves ___ in the snow.', 'running', 'runing', 'runs', 'run gấp đôi n → running.'),
  Mc('They go ___ on the hill.', 'snowboarding', 'snowboard', 'snowboards', 'go + V-ing: snowboarding.', V('snowboard')),
  Mc('We hate ___ in cold weather.', 'waiting', 'wait', 'waits', 'hate + V-ing: waiting.'),
  Mc('My brother enjoys ___ the sledge.', 'pulling', 'pull', 'pulls', 'enjoys + V-ing: pulling.', V('pull')),
  Mc('I like ___ flowers in spring.', 'growing', 'grow', 'grows', 'like + V-ing: growing.', V('grow')),
  Mc('___ leaves in autumn is fun.', 'Collecting', 'Collect', 'Collects', 'V-ing làm chủ ngữ: Collecting.', V('autumn')),
  Fl('We go ___ in winter. (sledge)', 'sledging', ['sledging', 'sledge', 'sledges'], 'go + V-ing; bỏ e: sledging.', V('sledge')),
  Fl('I enjoy ___ snowmen. (make)', 'making', ['making', 'make', 'makes'], 'enjoy + V-ing; bỏ e: making.', V('snowman')),
  Fl('She likes ___ leaves. (collect)', 'collecting', ['collecting', 'collect', 'collects'], 'likes + V-ing: collecting.', V('leaf')),
  Fl('___ snowballs is fun. (make)', 'Making', ['Making', 'Make', 'Makes'], 'V-ing làm chủ ngữ: Making.', V('snowball')),
  Fl('He loves ___ in the snow. (run)', 'running', ['running', 'runing', 'runs'], 'run gấp đôi n → running.'),
  Fl('They go ___ on the hill. (snowboard)', 'snowboarding', ['snowboarding', 'snowboard', 'snowboards'], 'go + V-ing: snowboarding.', V('snowboard')),
  Fl('We hate ___ in the cold. (wait)', 'waiting', ['waiting', 'wait', 'waits'], 'hate + V-ing: waiting.'),
  Fl('He enjoys ___ the sledge up the hill. (pull)', 'pulling', ['pulling', 'pull', 'pulls'], 'enjoys + V-ing: pulling.', V('pull')),
  Fl('I like ___ flowers in spring. (grow)', 'growing', ['growing', 'grow', 'grows'], 'like + V-ing: growing.', V('grow')),
  Fl('She is good at ___. (swim)', 'swimming', ['swimming', 'swim', 'swims'], 'at + V-ing; swim gấp đôi m → swimming.')],
 [Dlg(['Mum: What do you enjoy doing in winter?'], 'Tom: I enjoy ___ snowmen.', 'making', 'make', 'makes', 'enjoy + V-ing: making.', V('snowman')),
  Dlg(['Girl: Do you go sledging?'], 'Boy: Yes, we go ___ every winter.', 'sledging', 'sledge', 'sledges', 'go + V-ing: sledging.', V('sledge')),
  Dlg(['Teacher: What does Amy like doing?'], 'Pupil: She likes ___ leaves.', 'collecting', 'collect', 'collects', 'likes + V-ing: collecting.', V('leaf')),
  Clz(['It is autumn.', 'The park is full of orange leaves.'], 'Children love ___ leaves.', 'collecting', 'collect', 'collects', 'love + V-ing: collecting.', V('autumn')),
  Clz(['There is a lot of snow.', 'The hill is white.'], 'We go ___ on the hill.', 'sledging', 'sledge', 'sledges', 'go + V-ing: sledging.', V('sledge')),
  Clz(['Ben is a good runner.', 'He runs every morning.'], 'He is good at ___.', 'running', 'run', 'runs', 'at + V-ing: running.'),
  Clz(['Amy and her dad are on the hill.', 'They have a long wooden sledge.'], 'They love ___ the sledge up the hill.', 'pulling', 'pull', 'pulls', 'love + V-ing: pulling.', V('pull')),
  Clz(['Tom is in the garden.', 'It is a warm spring day.'], 'He enjoys ___ flowers.', 'growing', 'grow', 'grows', 'enjoy + V-ing: growing.', V('grow')),
  Clz(['The snow is deep today.', 'The children are very excited.'], '___ a snowman is their favourite game.', 'Making', 'Make', 'Makes', 'V-ing làm chủ ngữ: Making.', V('snowman')),
  Clz(['Mum has a big bag of snowballs.', 'The children are laughing.'], 'My brother hates ___ cold snowballs.', 'throwing', 'throw', 'throws', 'hate + V-ing: throwing.', V('snowball'))])

L2 = lesson('l2', 'peach', '❄️', 'If clauses', 'Nếu … thì sẽ …',
 'Nếu mai có tuyết, em sẽ làm gì? Dùng If + hiện tại đơn, will + động từ nhé!',
 [when('🧭 Khi nào dùng?', [
    ('❄️', '**If + present simple, will + verb** = nếu việc này xảy ra thì sẽ có kết quả.', 'If it snows, we will make a snowman.', 'Nếu có tuyết thì chúng mình sẽ làm người tuyết.'),
    ('🙅', 'Phủ định: **If … doesn\'t, … won\'t …**.', "If it doesn't snow, we won't go sledging.", 'Nếu không có tuyết thì chúng mình sẽ không đi trượt.'),
    ('↔️', 'Có thể đổi chỗ hai vế (bỏ dấu phẩy).', 'We will make a snowman if it snows.', 'Chúng mình sẽ làm người tuyết nếu có tuyết.')]),
  compare('🗂 So sánh với Unit 3', [
    CI('If + present, present', 'sub', 'điều luôn đúng', 'Sự thật, **thói quen** (If it is hot, I drink water).', [('If it is hot, I drink water.', 'Nếu trời nóng, mình uống nước.')], EM('💧')),
    CI('If + present, will + verb', 'pink', 'có thể xảy ra', 'Việc **có thể xảy ra** trong tương lai, nói kết quả sẽ có.', [('If it snows, we will make a snowman.', 'Nếu có tuyết, chúng mình sẽ làm người tuyết.')], V('snowman'))]),
  pattern('1️⃣ Công thức: If + present simple, will + verb', 'peach', [('If', 'pink', 'nếu'), ('condition (present simple)', 'sub', 'it snows'), ('will + verb', 'aux', 'sẽ'), ('result', 'obj', 'make a snowman')], [
    ('{If|pink} {it snows,|sub} {we will|aux} {make a snowman.|obj}', 'Nếu có tuyết, chúng mình sẽ làm người tuyết.', V('snowman')),
    ('{If|pink} {it snows a lot,|sub} {we will|aux} {go sledging.|obj}', 'Nếu tuyết rơi nhiều, chúng mình sẽ đi trượt.', V('sledge')),
    ('{If|pink} {she has a snowboard,|sub} {she will|aux} {go snowboarding.|obj}', 'Nếu cô ấy có ván trượt tuyết, cô ấy sẽ đi trượt.', V('snowboard'))]),
  pattern("2️⃣ Phủ định: If … doesn't / don't, … won't …", 'rose', [('If', 'pink', 'nếu'), ("condition (doesn't / don't)", 'sub', "it doesn't snow"), ("won't + verb", 'pink', 'sẽ không'), ('result', 'obj', 'go sledging')], [
    ("{If|pink} {it doesn't snow,|sub} {we won't|pink} {go sledging.|obj}", 'Nếu không có tuyết, chúng mình sẽ không đi trượt.', V('sledge')),
    ("{If|pink} {you don't push,|sub} {the sledge won't|pink} {move.|obj}", 'Nếu bạn không đẩy, xe trượt sẽ không chạy.', V('push')),
    ("{If|pink} {it isn't winter,|sub} {we won't|pink} {make a snowman.|obj}", 'Nếu không phải mùa đông, chúng mình sẽ không làm người tuyết.', V('snowman'))]),
  join('🧩 Từ 2 câu đơn → 1 câu ghép', [
    (('It snows.', 'Trời có tuyết.'), ('We will make a snowman.', 'Chúng mình sẽ làm người tuyết.'), 'If', '[[If]] it snows, we will make a snowman.', 'Nếu có tuyết, chúng mình sẽ làm người tuyết.', V('snowman')),
    (('You push the sledge.', 'Bạn đẩy xe trượt.'), ('It will move.', 'Nó sẽ chạy.'), 'If', '[[If]] you push the sledge, it will move.', 'Nếu bạn đẩy xe trượt, nó sẽ chạy.', V('push')),
    (('We collect leaves.', 'Chúng mình nhặt lá.'), ('We will make a picture.', 'Chúng mình sẽ làm một bức tranh.'), 'If', '[[If]] we collect leaves, we will make a picture.', 'Nếu chúng mình nhặt lá, chúng mình sẽ làm một bức tranh.', V('collect'))],
    note='Vế có If dùng present simple (không dùng will); vế kết quả dùng will + verb.'),
  tip("💡 Mẹo: vế **If** dùng **present simple** (If it snows) · vế kết quả dùng **will + verb**. Không nói If it will snow."),
  mistakes([('If it will snow, we will make a snowman.', 'If it snows, we will make a snowman.', 'Vế If không dùng will.'), ("If it doesn't snow, we will go sledging.", "If it doesn't snow, we won't go sledging.", 'Không có tuyết → không đi trượt: won\'t.'),
            ('If it snows, we make a snowman tomorrow.', 'If it snows, we will make a snowman.', 'Việc tương lai dùng will.'), ('If I will win, I will be happy.', 'If I win, I will be happy.', 'Vế If dùng present simple.')]),
  acts('a2')],
 [Mc('If it snows, we ___ a snowman.', 'will make', 'make', 'made', 'Kết quả tương lai → will make.', V('snowman')),
  Mc('If it ___, we will go sledging.', 'snows', 'will snow', 'snowed', 'Vế If dùng present simple: snows.', V('sledge')),
  Mc("If it doesn't snow, we ___ go sledging.", "won't", 'will', "don't", 'Không có tuyết → won\'t go.', V('sledge')),
  Mc('If you push the sledge, it ___ move.', 'will', "won't", 'is', 'Đẩy thì xe sẽ chạy → will move.', V('push')),
  Mc('If she ___ a snowboard, she will go snowboarding.', 'has', 'will have', 'had', 'Vế If dùng present simple: has.', V('snowboard')),
  Mc('We will collect leaves if it ___ sunny.', 'is', 'will be', 'was', 'Vế If dùng present simple: is.', V('leaf')),
  Mc('___ it rains, we will stay at home.', 'If', 'Or', 'But', 'If = nếu → mệnh đề điều kiện.'),
  Mc("If you don't pull the sledge, it ___ move.", "won't", 'will', "doesn't", 'Không kéo thì không chạy → won\'t move.', V('pull')),
  Mc('What will you do if it ___ tomorrow?', 'snows', 'will snow', 'snowed', 'Vế If dùng present simple: snows.', V('winter')),
  Mc('If I win the race, I ___ happy.', 'will be', 'being', 'was', 'Kết quả tương lai → will be.'),
  Fl('If it snows, we ___ make a snowman.', 'will', ['will', 'would', 'are'], 'Kết quả tương lai → will + verb.', V('snowman')),
  Fl('If it ___ (snow), we will go sledging.', 'snows', ['snows', 'snow', 'will snow'], 'Vế If dùng present simple: it snows.', V('sledge')),
  Fl("If it doesn't snow, we ___ go sledging.", "won't", ["won't", 'will', "don't"], 'Không có tuyết → won\'t go.', V('sledge')),
  Fl('If I ___ (win), I will be happy.', 'win', ['win', 'wins', 'will win'], 'Vế If dùng present simple: I win.'),
  Fl('If we ___ (collect) leaves, we will make a picture.', 'collect', ['collect', 'collects', 'will collect'], 'Vế If dùng present simple: we collect.', V('collect')),
  Fl('If it rains, we ___ stay at home.', 'will', ['will', 'would', 'are'], 'Kết quả tương lai → will stay.'),
  Fl('We ___ go sledging if it snows.', 'will', ['will', 'would', 'are'], 'Kết quả tương lai → will go.', V('sledge')),
  Fl("If you push, the sledge ___ move.", 'will', ['will', "won't", 'is'], 'Đẩy thì xe sẽ chạy → will move.', V('push')),
  Fl('If he ___ the sledge, it will move. (push)', 'pushes', ['pushes', 'push', 'will push'], 'Vế If dùng present simple: he pushes.', V('push')),
  Fl('___ it snows, we will make a snowman.', 'If', ['If', 'Or', 'But'], 'If = nếu → mệnh đề điều kiện.', V('snowman'))],
 [Dlg(['Mum: What will we do if it snows?'], "Tom: If it snows, we ___ a snowman.", 'will make', 'make', 'made', 'Kết quả tương lai → will make.', V('snowman')),
  Dlg(['Girl: What will you do if it is sunny?'], 'Boy: If it ___ sunny, I will collect leaves.', 'is', 'will be', 'was', 'Vế If dùng present simple: is.', V('leaf')),
  Dlg(['Teacher: What will happen if you push the sledge?'], 'Pupil: If I push it, it ___ move.', 'will', "won't", 'is', 'Đẩy thì xe sẽ chạy → will move.', V('push')),
  Clz(['Look at the sky.', 'There are big grey clouds.'], 'If it ___ , we will make a snowman.', 'snows', 'will snow', 'snowed', 'Vế If dùng present simple: snows.', V('winter')),
  Clz(['The hill is bare.', 'There is no snow.'], "If it doesn't snow, we ___ go sledging.", "won't", 'will', "don't", 'Không có tuyết → won\'t go.', V('sledge')),
  Clz(['Amy loves autumn.', 'Leaves fall from the trees.'], 'If she ___ leaves, she will make a picture.', 'collects', 'will collect', 'collected', 'Vế If dùng present simple: she collects.', V('leaf')),
  Clz(['It is a snowy day.', 'The children want to play outside.'], 'If they ___ warm clothes, they will not feel cold.', 'wear', 'will wear', 'wore', 'Vế If dùng present simple: they wear.', V('winter')),
  Clz(['The sledge is at the top of the hill.', 'Dad is next to it.'], 'If he ___ the sledge, we will go down fast.', 'pushes', 'will push', 'pushed', 'Vế If dùng present simple: he pushes.', V('push')),
  Clz(['Tom wants to go snowboarding.', 'The weather is not good.'], "If it ___ snow, we won't go.", "doesn't", "won't", "isn't", "Vế If phủ định: doesn't snow.", V('snowboard')),
  Clz(['It is spring.', 'The garden is ready.'], 'If we ___ the seeds, they will grow.', 'plant', 'will plant', 'planted', 'Vế If dùng present simple: we plant.', V('grow'))])

A = [
 bucket('a1', '⚡ Luyện nhanh: cách thêm -ing', 'Kéo mỗi từ vào ô đúng: thêm -ing · bỏ e · gấp đôi chữ cuối.', [
   {'id': 'add', 'label': '➕ thêm -ing', 'c': 'sky'}, {'id': 'drop', 'label': '✂️ bỏ e + -ing', 'c': 'mint'}, {'id': 'dbl', 'label': '✌️ gấp đôi chữ cuối', 'c': 'peach'}], [
   {'label': 'collect', 'g': 'add'}, {'label': 'push', 'g': 'add'}, {'label': 'make', 'g': 'drop'}, {'label': 'sledge', 'g': 'drop'}, {'label': 'run', 'g': 'dbl'}, {'label': 'swim', 'g': 'dbl'}]),
 bucket('a2', "⚡ Luyện nhanh: vế If hay vế kết quả?", "Kéo mỗi cụm vào ô đúng: vế If (present simple) hoặc vế kết quả (will / won't + verb).", [
   {'id': 'if', 'label': '❄️ vế If (present simple)', 'c': 'sky'}, {'id': 'res', 'label': '🎯 vế kết quả (will + verb)', 'c': 'rose'}], [
   {'label': 'it snows', 'g': 'if'}, {'label': 'we will make a snowman', 'g': 'res'}, {'label': "it doesn't snow", 'g': 'if'}, {'label': "we won't go sledging", 'g': 'res'}, {'label': 'you push the sledge', 'g': 'if'}, {'label': 'it will move', 'g': 'res'}])]

u = build_unit(10, 'unit-10', 'A good year!', 'Một năm tuyệt vời', '❄️', 'flyers--unit-10-45mu', [L1, L2], A)
save_unit(u)
