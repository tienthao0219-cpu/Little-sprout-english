/* Dữ liệu bài học. Giáo viên có thể thêm/sửa ở đây.
   Mỗi bộ từ có 9 từ -> khớp với 1 file hình 3x3 (assets/<sheet>.png), thứ tự từ trái sang phải, trên xuống dưới.
   Nếu chưa có file hình, game tự dùng emoji (trường e). */
window.NM = window.NM || {};

NM.GROUPS = ['Starters', 'Movers', 'Flyers', 'Global Success 4', 'Global Success 5', 'Global Success 7', 'Global Success 8'];
NM.GROUP_LEVEL = {
  'Starters': 'easy', 'Movers': 'easy', 'Flyers': 'normal',
  'Global Success 4': 'normal', 'Global Success 5': 'normal',
  'Global Success 7': 'hard', 'Global Success 8': 'hard'
};

/* w: từ | vi: nghĩa | e: emoji | d: định nghĩa tiếng Anh | s: câu có ___ | alt: từ đồng nghĩa/dễ nhầm | topic */
NM.SETS = [
  { id: 'u1', kind: 'vocab', title: 'Animals', group: 'Starters', icon: '🐾', sheet: 'u1-animals', words: [
    { w: 'cat', vi: 'con mèo', e: '🐱', d: 'A small pet that says meow.', s: 'The ___ says meow.', alt: [], topic: 'animals' },
    { w: 'dog', vi: 'con chó', e: '🐶', d: 'A pet that barks and wags its tail.', s: 'The ___ says woof.', alt: [], topic: 'animals' },
    { w: 'rabbit', vi: 'con thỏ', e: '🐰', d: 'An animal with long ears that hops.', s: 'The ___ eats a carrot.', alt: ['bunny'], topic: 'animals' },
    { w: 'monkey', vi: 'con khỉ', e: '🐵', d: 'An animal that climbs trees and likes bananas.', s: 'The ___ is climbing the tree.', alt: [], topic: 'animals' },
    { w: 'elephant', vi: 'con voi', e: '🐘', d: 'A very big animal with a long trunk.', s: 'The ___ has a long trunk.', alt: [], topic: 'animals' },
    { w: 'tiger', vi: 'con hổ', e: '🐯', d: 'A big wild cat with stripes.', s: 'The ___ has orange and black stripes.', alt: [], topic: 'animals' },
    { w: 'bird', vi: 'con chim', e: '🐦', d: 'An animal that has wings and can fly.', s: 'The ___ is singing in the tree.', alt: [], topic: 'animals' },
    { w: 'fish', vi: 'con cá', e: '🐟', d: 'An animal that lives and swims in water.', s: 'The ___ swims in the pond.', alt: [], topic: 'animals' },
    { w: 'horse', vi: 'con ngựa', e: '🐴', d: 'A big animal that people can ride.', s: 'She rides her ___ every Sunday.', alt: [], topic: 'animals' }
  ] },
  { id: 'u2', kind: 'vocab', title: 'Food & Drink', group: 'Starters', icon: '🍎', sheet: 'u2-food', words: [
    { w: 'apple', vi: 'quả táo', e: '🍎', d: 'A round red or green fruit.', s: 'My ___ is red and sweet.', alt: [], topic: 'food' },
    { w: 'banana', vi: 'quả chuối', e: '🍌', d: 'A long yellow fruit.', s: 'The ___ is yellow and sweet.', alt: [], topic: 'food' },
    { w: 'bread', vi: 'bánh mì', e: '🍞', d: 'Food made from flour. We eat it for breakfast.', s: 'I have ___ and eggs for breakfast.', alt: [], topic: 'food' },
    { w: 'milk', vi: 'sữa', e: '🥛', d: 'A white drink that comes from cows.', s: 'I drink a glass of ___ every morning.', alt: [], topic: 'food' },
    { w: 'rice', vi: 'cơm', e: '🍚', d: 'Small white grains that we cook and eat.', s: 'We eat ___ with fish.', alt: [], topic: 'food' },
    { w: 'egg', vi: 'quả trứng', e: '🥚', d: 'A hen lays it. It is oval.', s: 'I have one ___ for breakfast.', alt: [], topic: 'food' },
    { w: 'cake', vi: 'bánh ngọt', e: '🍰', d: 'A sweet food for a birthday party.', s: 'We eat birthday ___ at the party.', alt: [], topic: 'food' },
    { w: 'orange', vi: 'quả cam', e: '🍊', d: 'A round fruit with orange skin.', s: 'This ___ is juicy.', alt: [], topic: 'food' },
    { w: 'juice', vi: 'nước ép', e: '🧃', d: 'A drink made from fruit.', s: 'I like apple ___.', alt: [], topic: 'food' }
  ] },
  { id: 'u3', kind: 'vocab', title: 'School Things', group: 'Starters', icon: '🎒', sheet: 'u3-school', words: [
    { w: 'book', vi: 'quyển sách', e: '📖', d: 'You read it. It has many pages.', s: 'I read my ___ before bed.', alt: [], topic: 'school' },
    { w: 'pencil', vi: 'bút chì', e: '✏️', d: 'You write or draw with it. It is made of wood.', s: 'Please write with your ___.', alt: [], topic: 'school' },
    { w: 'ruler', vi: 'thước kẻ', e: '📏', d: 'You use it to draw straight lines.', s: 'Use your ___ to draw a straight line.', alt: [], topic: 'school' },
    { w: 'bag', vi: 'cặp sách', e: '🎒', d: 'You carry your books in it.', s: 'She puts her books in her ___.', alt: ['backpack'], topic: 'school' },
    { w: 'teacher', vi: 'giáo viên', e: '🧑‍🏫', d: 'A person who teaches students at school.', s: 'Our ___ is very kind.', alt: [], topic: 'school' },
    { w: 'chair', vi: 'cái ghế', e: '🪑', d: 'You sit on it.', s: 'Please sit on your ___.', alt: [], topic: 'school' },
    { w: 'clock', vi: 'đồng hồ', e: '⏰', d: 'It shows the time.', s: 'The ___ says seven o’clock.', alt: [], topic: 'school' },
    { w: 'crayon', vi: 'bút sáp màu', e: '🖍️', d: 'A colorful stick that you draw with.', s: 'I draw a sun with a yellow ___.', alt: [], topic: 'school' },
    { w: 'scissors', vi: 'cái kéo', e: '✂️', d: 'You use them to cut paper.', s: 'I cut the paper with ___.', alt: [], topic: 'school' }
  ] },
  { id: 'u4', kind: 'vocab', title: 'Action Words', group: 'Movers', icon: '🏃', sheet: 'u4-actions', words: [
    { w: 'hop', vi: 'nhảy lò cò', e: '🦘', d: 'To jump on one foot.', s: 'The rabbit can ___ very fast.', alt: ['jump'], topic: 'actions' },
    { w: 'skip', vi: 'nhảy dây', e: '🪢', d: 'To jump over a rope.', s: 'We ___ in the playground.', alt: ['jump'], topic: 'actions' },
    { w: 'run', vi: 'chạy', e: '🏃', d: 'To move fast on your feet.', s: 'I can ___ very fast.', alt: [], topic: 'actions' },
    { w: 'jump', vi: 'nhảy', e: '🤾', d: 'To push yourself up into the air.', s: 'Can you ___ high?', alt: ['hop', 'skip'], topic: 'actions' },
    { w: 'swim', vi: 'bơi', e: '🏊', d: 'To move in water with your arms and legs.', s: 'Fish can ___ in the river.', alt: [], topic: 'actions' },
    { w: 'climb', vi: 'trèo, leo', e: '🧗', d: 'To go up a tree or a mountain.', s: 'Monkeys can ___ trees.', alt: [], topic: 'actions' },
    { w: 'dance', vi: 'nhảy múa', e: '💃', d: 'To move your body to music.', s: 'They ___ at the party.', alt: [], topic: 'actions' },
    { w: 'sing', vi: 'hát', e: '🎤', d: 'To make music with your voice.', s: 'Birds ___ in the morning.', alt: [], topic: 'actions' },
    { w: 'draw', vi: 'vẽ', e: '🎨', d: 'To make a picture with a pencil or crayon.', s: 'I like to ___ flowers.', alt: [], topic: 'actions' }
  ] },
  { id: 'u5', kind: 'vocab', title: 'My Family', group: 'Movers', icon: '👪', sheet: 'u5-family', words: [
    { w: 'mother', vi: 'mẹ', e: '👩', d: 'Your female parent.', s: 'My ___ cooks dinner.', alt: ['mom'], topic: 'family' },
    { w: 'father', vi: 'bố', e: '👨', d: 'Your male parent.', s: 'My ___ drives me to school.', alt: ['dad'], topic: 'family' },
    { w: 'sister', vi: 'chị / em gái', e: '👧', d: 'A girl who has the same parents as you.', s: 'My ___ is ten years old.', alt: [], topic: 'family' },
    { w: 'brother', vi: 'anh / em trai', e: '👦', d: 'A boy who has the same parents as you.', s: 'My ___ plays football.', alt: [], topic: 'family' },
    { w: 'grandmother', vi: 'bà', e: '👵', d: 'The mother of your mother or father.', s: 'My ___ tells me stories.', alt: ['grandma'], topic: 'family' },
    { w: 'grandfather', vi: 'ông', e: '👴', d: 'The father of your mother or father.', s: 'My ___ likes fishing.', alt: ['grandpa'], topic: 'family' },
    { w: 'baby', vi: 'em bé', e: '👶', d: 'A very young child.', s: 'The ___ cries and drinks milk.', alt: [], topic: 'family' },
    { w: 'uncle', vi: 'chú / bác / cậu', e: '🧔', d: 'The brother of your mother or father.', s: 'My ___ lives in Da Nang.', alt: [], topic: 'family' },
    { w: 'aunt', vi: 'cô / dì', e: '👩‍🦰', d: 'The sister of your mother or father.', s: 'My ___ is a nurse.', alt: [], topic: 'family' }
  ] },

  /* Ngữ pháp: q có ___ ; a = đáp án ; o = đáp án sai ; x = giải thích tiếng Việt */
  { id: 'g1', kind: 'grammar', title: 'To be & have got', group: 'Movers', icon: '📘', items: [
    { q: 'I ___ a student.', a: 'am', o: ['is', 'are'], x: 'Chủ ngữ “I” đi với “am”: I am.' },
    { q: 'She ___ my sister.', a: 'is', o: ['am', 'are'], x: '“She” là một người (số ít) nên dùng “is”.' },
    { q: 'They ___ happy.', a: 'are', o: ['is', 'am'], x: '“They” là số nhiều nên dùng “are”.' },
    { q: 'We ___ in the classroom.', a: 'are', o: ['is', 'am'], x: '“We” là số nhiều nên dùng “are”.' },
    { q: 'He ___ got a new bike.', a: 'has', o: ['have', 'is'], x: 'Với He / She / It ta dùng “has got”, không dùng “have got”.' },
    { q: 'I ___ got two cats.', a: 'have', o: ['has', 'is'], x: 'Với I / You / We / They ta dùng “have got”.' },
    { q: 'This ___ my book.', a: 'is', o: ['are', 'am'], x: '“This” là một vật (số ít) nên dùng “is”.' },
    { q: 'My friends ___ at school.', a: 'are', o: ['is', 'am'], x: '“My friends” là số nhiều nên dùng “are”.' }
  ] },
  { id: 'g2', kind: 'grammar', title: 'Present Simple & Continuous', group: 'Flyers', icon: '📗', items: [
    { q: 'She ___ to school every day.', a: 'goes', o: ['go', 'going'], x: 'Thì hiện tại đơn, chủ ngữ “She” thì động từ thêm -es: goes.' },
    { q: 'I ___ breakfast at seven.', a: 'have', o: ['has', 'having'], x: 'Chủ ngữ “I” dùng động từ nguyên mẫu: have.' },
    { q: 'They ___ football now.', a: 'are playing', o: ['play', 'plays'], x: 'Có “now” (bây giờ) nên dùng hiện tại tiếp diễn: are + V-ing.' },
    { q: 'He ___ a book now.', a: 'is reading', o: ['reads', 'read'], x: 'Có “now” nên dùng hiện tại tiếp diễn: is + V-ing.' },
    { q: 'Birds ___ in the sky.', a: 'fly', o: ['flies', 'flying'], x: '“Birds” là số nhiều nên động từ giữ nguyên: fly.' },
    { q: 'My mother ___ dinner every evening.', a: 'cooks', o: ['cook', 'cooking'], x: '“Every evening” là thói quen -> hiện tại đơn; “My mother” là ngôi thứ 3 số ít nên thêm -s: cooks.' },
    { q: 'Look! The cat ___ on the sofa.', a: 'is sleeping', o: ['sleeps', 'sleep'], x: '“Look!” báo hiệu việc đang xảy ra -> hiện tại tiếp diễn: is sleeping.' },
    { q: 'We ___ TV in the evening.', a: 'watch', o: ['watches', 'watching'], x: '“We” dùng động từ nguyên mẫu: watch.' }
  ] },
  { id: 'g3', kind: 'grammar', title: 'Prepositions & Questions', group: 'Movers', icon: '📙', items: [
    { q: 'The clock is ___ the wall.', a: 'on', o: ['in', 'at'], x: 'Vật gắn trên tường dùng “on the wall”.' },
    { q: 'I get up ___ six o’clock.', a: 'at', o: ['on', 'in'], x: 'Giờ cụ thể dùng “at”: at six o’clock.' },
    { q: 'My birthday is ___ May.', a: 'in', o: ['on', 'at'], x: 'Tháng dùng “in”: in May.' },
    { q: '___ is your name?', a: 'What', o: ['Where', 'Who'], x: 'Hỏi tên dùng “What”: What is your name?' },
    { q: '___ are you from?', a: 'Where', o: ['Who', 'When'], x: 'Hỏi nơi chốn / quê quán dùng “Where”.' },
    { q: '___ old are you?', a: 'How', o: ['What', 'Who'], x: 'Hỏi tuổi dùng “How old ...?”.' },
    { q: 'There ___ three apples on the table.', a: 'are', o: ['is', 'am'], x: '“Three apples” là số nhiều nên dùng “There are”.' },
    { q: 'There ___ a cat under the chair.', a: 'is', o: ['are', 'am'], x: '“A cat” là số ít nên dùng “There is”.' }
  ] }
];


/* ---------- Mở từ Trung tâm trò chơi (?set=): chỉ dùng bộ từ đã chọn ---------- */
(function () {
  var H = window.GAMESET; if (!H) return;
  var cur = String(H.id || '').split('--')[0];
  var GMAP = { starters: 'Starters', movers: 'Movers', flyers: 'Flyers', gs4: 'Global Success 4', gs5: 'Global Success 5', gs7: 'Global Success 7', gs8: 'Global Success 8' };
  NM.HUB = H;
  NM.HUB_NOPIC = !H.items.every(function (it) { return it.img; });
  NM.SETS = [{
    id: 'hub', kind: 'vocab', title: H.title || 'Bộ từ', group: GMAP[cur] || 'Starters', icon: '📘',
    words: H.items.filter(function (it) { return it.vi; }).map(function (it) {
      return { w: it.w, vi: it.vi, e: '', img: it.img || '', d: '', s: '', alt: [], topic: it.topic || 'Từ vựng' };
    })
  }];
})();
