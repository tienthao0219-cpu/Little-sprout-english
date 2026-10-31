# Sửa các câu mà chỗ trống đang hỏi TỪ VỰNG thay vì NGỮ PHÁP (cô Thảo góp ý): chỗ trống phải là trợ động từ, giới từ,
# từ nối, dạng của động từ… Khoá = (số unit, câu hỏi cũ). Áp dụng cho practice, extras, mix, quiz.
import json, random
CAN = ['Can', 'Could', 'Will']
def Fx(q, ans, bank, why, **kw):
    return dict(q=q, ans=ans if isinstance(ans, list) else [ans], bank=bank, why=why, **kw)
def Mx(q, right, w1, w2, why, **kw):
    return dict(q=q, right=right, w1=w1, w2=w2, why=why, **kw)

IMP = 'Câu mệnh lệnh: dùng động từ nguyên mẫu, không có chủ ngữ.'
NEG = "Câu cấm đoán: Don't + động từ."
FIX = {
 # ---------- Unit 1 · can ----------
 (1, 'My mum can ___ delicious food.'): Fx('My mum ___ cook delicious food.', 'can', ['can', "can't", 'to'], 'Biết làm gì → can + động từ nguyên mẫu.'),
 (1, 'Birds can ___.'): Fx('Birds ___ fly.', 'can', ['can', "can't", 'to'], 'Biết / có thể → can + động từ nguyên mẫu.'),
 (1, 'Can she ___ the violin?'): Fx('___ she play the violin?', 'Can', ['Can', 'Is', 'Does'], 'Câu hỏi với can: Can + chủ ngữ + động từ?'),
 # ---------- Unit 2 · Imperatives ----------
 (2, '___ right at the museum.'): Fx('___ (turn) right at the museum.', 'Turn', ['Turn', 'Turns', 'Turning'], IMP),
 (2, '___ at the red light!'): Fx('___ (stop) at the red light!', 'Stop', ['Stop', 'Stops', 'Stopping'], IMP),
 (2, '___ the road at the zebra crossing.'): Fx('___ (cross) the road at the zebra crossing.', 'Cross', ['Cross', 'Crosses', 'Crossing'], IMP),
 (2, 'Go straight on, ___.'): Fx("Go straight on. ___ turn left!", ["Don't"], ["Don't", 'Not', 'No'], NEG, art=None),
 (2, "Don't ___ in the library!"): Fx("___ talk in the library!", ["Don't"], ["Don't", 'Not', 'No'], NEG),
 (2, 'Turn ___ at the bank.'): Fx('___ (wait) here, please.', 'Wait', ['Wait', 'Waits', 'Waiting'], IMP, art=None),
 (2, 'Go ___ on.'): Fx('___ (go) straight on.', 'Go', ['Go', 'Goes', 'Going'], IMP),
 # ---------- Unit 2 · could (suggestions) ----------
 (2, 'Good ___!'): Fx('We ___ go to the zoo. (gợi ý)', 'could', ['could', 'coulds', 'are'], 'Gợi ý → We could + động từ nguyên mẫu.'),
 (2, 'We could ___ the bridge.'): Fx('We ___ cross the bridge.', 'could', ['could', 'coulds', 'are'], 'Gợi ý → We could + động từ nguyên mẫu.'),
 (2, 'A: We could go to the zoo. B: ___ idea!'): Mx('A: We ___ go to the zoo. B: Good idea!', 'could', 'coulds', 'are', 'Gợi ý → We could + động từ nguyên mẫu.'),
 # ---------- Unit 2 · giới từ ----------
 (2, 'The shop is in the ___ of the street.'): Fx('The shop is ___ the middle of the street.', 'in', ['in', 'on', 'at'], 'in the middle of = ở giữa.'),
 # ---------- Unit 2 · can / could / will (requests) ----------
 (2, 'Will you ___ me?'): Fx('___ you help me?', CAN, ['Can', 'Could', 'Will', 'Is'], 'Nhờ giúp đỡ → Can / Could / Will + you + động từ?'),
 (2, 'Can you ___ the window?'): Fx('___ you open the window?', CAN, ['Can', 'Could', 'Will', 'Is'], 'Nhờ giúp đỡ → Can / Could / Will + you + động từ?'),
 (2, 'Yes, of ___.'): Fx('___ you pass the salt, please?', CAN, ['Can', 'Could', 'Will', 'Is'], 'Nhờ giúp đỡ → Can / Could / Will + you + động từ?'),
 (2, 'Can you wait for me, ___?'): Fx('___ you wait for me, please?', CAN, ['Can', 'Could', 'Will', 'Is'], 'Nhờ giúp đỡ → Can / Could / Will + you + động từ?'),
 (2, 'Will you ___ the door, please?'): Fx('___ you close the door, please?', CAN, ['Can', 'Could', 'Will', 'Is'], 'Nhờ giúp đỡ → Can / Could / Will + you + động từ?'),
 (2, 'Can I ___ your pen?'): Fx('___ I use your pen?', ['Can', 'Could'], ['Can', 'Could', 'Will'], 'Xin phép → Can / Could + I + động từ?'),
 (2, 'Could you ___ me, please?'): Fx('Could you help ___, please?', 'me', ['me', 'I', 'my'], 'Sau động từ dùng me (người nhận).'),
 # ---------- Unit 3 · will (offers) ----------
 (3, 'A: Will you have some pizza? B: Yes, ___!'): Fx('It is hot. I ___ open the window.', ['will', "'ll"], ['will', 'am', 'do'], 'Đề nghị giúp → I will / I\'ll + động từ nguyên mẫu.', art=None),
 (3, 'A: Will you have a biscuit? B: Yes, ___.'): Fx('You look tired. I ___ carry your bag.', ['will', "'ll"], ['will', 'am', 'do'], 'Đề nghị giúp → I will / I\'ll + động từ nguyên mẫu.', art=None),
 (3, "I'll ___ you the salt."): Fx('I ___ pass you the salt.', ['will', "'ll"], ['will', 'am', 'do'], 'Đề nghị giúp → I will / I\'ll + động từ nguyên mẫu.'),
 (3, "I'll ___ the pizza into pieces."): Fx('I ___ cut the pizza for you.', ['will', "'ll"], ['will', 'am', 'do'], 'Đề nghị giúp → I will / I\'ll + động từ nguyên mẫu.'),
 (3, 'A: Will you have some jam? B: Yes, ___.'): Mx('You look thirsty. I ___ bring you some water.', 'will', 'am', 'do', 'Đề nghị giúp → I will + động từ nguyên mẫu.', art=None),
 (3, 'A: Will you have a biscuit? B: No, ___ you.'): Mx('It is dark. I ___ turn on the light.', 'will', 'am', 'do', 'Đề nghị giúp → I will + động từ nguyên mẫu.', art=None),
 # ---------- Unit 3 · If / When ----------
 (3, 'If I am thirsty, I ___ water.'): Fx('If I am thirsty, I ___ (drink) water.', 'drink', ['drink', 'drinks', 'drinking'], 'Mệnh đề kết quả dùng present simple: I → drink.'),
 (3, 'When she is happy, she ___.'): Fx('When she is happy, she ___ (smile).', 'smiles', ['smiles', 'smile', 'smiling'], 'Present simple: she → smiles.'),
 (3, 'If you drop it, it ___.'): Fx('If you drop it, it ___ (break).', 'breaks', ['breaks', 'break', 'breaking'], 'Present simple: it → breaks.'),
 (3, 'If it is hot, I ___ ice cream.'): Fx('If it is hot, I ___ (eat) ice cream.', 'eat', ['eat', 'eats', 'eating'], 'Present simple: I → eat.'),
 (3, 'If he eats too much, he ___ ill.'): Fx('If he eats too much, he ___ (feel) ill.', 'feels', ['feels', 'feel', 'feeling'], 'Present simple: he → feels.'),
 (3, 'If it ___, we stay at home.'): Fx('If it ___ (rain), we stay at home.', 'rains', ['rains', 'rain', 'raining'], 'Mệnh đề If dùng present simple: it → rains.'),
 # ---------- Unit 4 · Imperatives ----------
 (4, '___ your book.'): Fx('___ (open) your book.', 'Open', ['Open', 'Opens', 'Opening'], IMP),
 (4, '___ to me, please.'): Fx('___ (listen) to me, please.', 'Listen', ['Listen', 'Listens', 'Listening'], IMP),
 (4, "Don't ___ in the classroom."): Fx('___ run in the classroom.', ["Don't"], ["Don't", 'Not', 'No'], NEG),
 (4, '___ after me.'): Fx('___ (repeat) after me.', 'Repeat', ['Repeat', 'Repeats', 'Repeating'], IMP),
 (4, 'Raise your ___.'): Fx('___ (raise) your hand.', 'Raise', ['Raise', 'Raises', 'Raising'], IMP),
 (4, "Don't be ___!"): Fx('___ be late!', ["Don't"], ["Don't", 'Not', 'No'], NEG),
 (4, '___ the group, please.'): Fx('___ (join) the group, please.', 'Join', ['Join', 'Joins', 'Joining'], IMP),
 # ---------- Unit 4 · could / couldn't ----------
 (4, 'I could ___ when I was five.'): Fx('I ___ swim when I was five. (đã biết bơi)', 'could', ['could', "couldn't", 'can'], 'Quá khứ biết làm gì → could + động từ nguyên mẫu.'),
 (4, "I couldn't ___ a bike when I was three."): Fx('I ___ ride a bike when I was three. (chưa biết đi)', ["couldn't", 'could not'], ["couldn't", 'could', "can't"], 'Quá khứ chưa biết → couldn\'t + động từ nguyên mẫu.'),
 # ---------- Unit 4 · Question words ----------
 (4, "What ___ is it? – Ten o'clock."): Fx("___ time is it? – Ten o'clock.", 'What', ['What', 'Where', 'Who'], 'Hỏi giờ → What time…?'),
 (4, 'What ___ is Music? – At ten.'): Fx('___ time is Music? – At ten.', 'What', ['What', 'Where', 'Who'], 'Hỏi giờ → What time…?'),
 # ---------- Unit 5 ----------
 (5, 'The film ___ at six.'): Fx('The film ___ (start) at six.', 'starts', ['starts', 'start', 'starting'], 'Lịch trình dùng present simple: the film = it → starts.'),
 (5, 'The bus ___ at ten. (lịch trình)'): Fx('The bus ___ (leave) at ten.', 'leaves', ['leaves', 'leave', 'leaving'], 'Lịch trình dùng present simple: the bus = it → leaves.'),
 (5, 'The zoo ___ at nine every day.'): Fx('The zoo ___ (open) at nine every day.', 'opens', ['opens', 'open', 'opening'], 'Lịch trình dùng present simple: the zoo = it → opens.'),
 (5, "Let's ___ on the swings."): Fx('___ play on the swings.', ["Let's"], ["Let's", 'Lets', 'Shall'], "Rủ rê → Let's + động từ nguyên mẫu."),
 (5, 'We could ___ a cartoon.'): Fx('We ___ watch a cartoon.', 'could', ['could', 'coulds', 'are'], 'Gợi ý → We could + động từ nguyên mẫu.'),
 (5, 'It is going to ___ later. Take an umbrella!'): Fx('It is ___ to rain later. Take an umbrella!', 'going', ['going', 'go', 'goes'], 'Thấy dấu hiệu → is going to + động từ.'),
 # ---------- Unit 6 ----------
 (6, "They'd like to be ___."): Fx("They'd like ___ be engineers.", 'to', ['to', 'for', 'at'], "I'd like to be…"),
 (6, 'A cook works in a ___.'): Fx('A cook works ___ a kitchen.', 'in', ['in', 'on', 'under'], 'Làm việc trong nơi nào → in a kitchen.'),
 (6, 'A: Where does a singer work? B: A singer works on a ___.'): Fx('A: Where does a singer work? B: A singer works ___ a stage.', 'on', ['on', 'in', 'under'], 'Làm việc trên sân khấu → on a stage.'),
 (6, 'They could be ___.'): Fx('They ___ be pilots. (có thể)', 'could', ['could', 'coulds', 'are'], 'Đoán → could + be.'),
 (6, 'He has a big hat. He could be a ___.'): Fx('He has a big hat. He ___ be a cook.', 'could', ['could', 'coulds', 'does'], 'Đoán → could + be.'),
 (6, 'A: Where does a cook work? B: A cook works in a ___.'): Mx('A cook works ___ a kitchen.', 'in', 'on', 'under', 'Làm việc trong nơi nào → in a kitchen.'),
 (6, 'A: Where does a waiter work? B: A waiter works in a ___.'): Mx('A waiter works ___ a restaurant.', 'in', 'on', 'under', 'Làm việc trong nơi nào → in a restaurant.'),
 (6, 'She could be a nurse. She is not ___.'): Mx('She ___ be a nurse. I am not sure.', 'could', 'coulds', 'does', 'Đoán → could + be.'),
 (6, 'She has a camera. She could be a ___.'): Mx('She has a camera. She could ___ a photographer.', 'be', 'is', 'being', 'Sau could dùng be.'),
 # ---------- vòng rà 2: câu còn có thể có nhiều đáp án ----------
 (1, 'The chick is ___ the table.'): Fx('The chick is ___ the table.', ['next to', 'beside', 'near'], ['next to', 'in', 'under'], 'Gà con ở cạnh bàn → next to.'),
 (1, 'The shop is closed. ___ is in the shop.'): Fx('The shop is closed. ___ is in the shop.', ['no one', 'nobody'], ['no one', 'everyone', 'anyone'], 'Cửa hàng đóng cửa, không có ai → no one.'),
 (2, '___ straight on for two minutes.'): Fx('___ (go) straight on for two minutes.', 'Go', ['Go', 'Goes', 'Going'], IMP),
 (2, 'We could ___ to the museum.'): Fx('We ___ go to the museum.', 'could', ['could', 'coulds', 'are'], 'Gợi ý → We could + động từ nguyên mẫu.'),
 (3, "I'll ___ you a drink."): Fx('I ___ get you a drink.', ['will', "'ll"], ['will', 'am', 'do'], 'Đề nghị giúp → I will / I\'ll + động từ nguyên mẫu.'),
 (3, 'Will you ___ some jam?'): Fx('___ you have some jam?', 'Will', ['Will', 'Are', 'Is'], 'Mời ai ăn gì → Will you have…?'),
 (4, '___ your homework, please.'): Fx('___ (do) your homework, please.', 'Do', ['Do', 'Does', 'Doing'], IMP),
 (5, 'I am ___ my grandma on Sunday.'): Fx('I am ___ (visit) my grandma on Sunday.', 'visiting', ['visiting', 'visit', 'visits'], 'am + V-ing: kế hoạch đã sắp xếp.'),
 (5, "Let's ___ photos."): Fx("___ take photos.", ["Let's"], ["Let's", 'Lets', 'Shall'], "Rủ rê → Let's + động từ nguyên mẫu."),
 (5, 'He is going to ___ a clown.'): Fx('He is going ___ see a clown.', 'to', ['to', 'for', 'at'], 'is going to + động từ nguyên mẫu.'),
 (5, "I'm going to ___ photos."): Fx("I'm going ___ take photos.", 'to', ['to', 'for', 'at'], 'am going to + động từ nguyên mẫu.'),
 (5, 'Shall we ___ to the circus?'): Fx('Shall ___ go to the circus?', 'we', ['we', 'us', 'our'], 'Hỏi ý → Shall we…?'),
 (5, 'They are ___ to the circus tomorrow.'): Fx('They ___ going to the circus tomorrow.', 'are', ['are', 'is', 'am'], 'They → are going.'),
 (5, 'She is ___ to sing.'): Fx('She ___ going to sing.', 'is', ['is', 'are', 'am'], 'She → is going to.'),
 (5, 'It is ___ to rain later. Take an umbrella!'): Fx('It ___ going to rain later. Take an umbrella!', 'is', ['is', 'are', 'am'], 'It → is going to.'),
 (6, 'A doctor ___ in a hospital.'): Fx('A doctor ___ (work) in a hospital.', 'works', ['works', 'work', 'working'], 'a doctor → works.'),
 (6, 'Where do teachers ___?'): Fx('___ do teachers work?', 'Where', ['Where', 'What', 'Who'], 'Hỏi nơi chốn → Where…?'),
 (6, 'Where does a mechanic ___?'): Fx('Where ___ a mechanic work?', 'does', ['does', 'do', 'is'], 'a mechanic (một người) → does.'),
 # ---------- Unit 7 ----------
 (7, 'She will ___ a crown.'): Fx('She ___ wear a crown.', 'will', ['will', 'is going', 'are going'], 'Đoán → will + động từ nguyên mẫu.'),
}

def _shuf(opts, key):
    o = list(opts); random.Random(key).shuffle(o); return o

def apply(no, qs):
    """Thay các câu cũ bằng câu mới (giữ nguyên art, lv, fmt, topic…). Trả về số câu đã sửa."""
    n = 0
    for q in qs:
        spec = FIX.get((no, q.get('q')))
        if not spec or (q['t'] == 'mcq') != ('right' in spec): continue
        s = dict(spec); old = q['q']
        q['q'] = s['q']; q['why'] = s['why']; q.pop('hint', None)
        if 'art' in s: q.pop('art', None)       # hình cũ không còn hợp với câu mới
        if q['t'] == 'fill':
            q['ans'] = s['ans']; q['bank'] = _shuf(s['bank'], s['q'])
        else:
            opts = _shuf([s['right'], s['w1'], s['w2']], s['q'] + s['right']); q['opts'] = opts; q['a'] = opts.index(s['right'])
        n += 1
    return n

if __name__ == '__main__':      # chạy cho dữ liệu đã lưu (Unit 1 không có script riêng)
    import os
    W = os.path.dirname(os.path.abspath(__file__)) + '/'
    d = json.load(open(W + 'data.json', encoding='utf8'))
    tot = 0
    for u in d['units']:
        if u['no'] != 1: continue
        for l in u['lessons']:
            tot += apply(u['no'], l['practice']) + apply(u['no'], l.get('extras', []))
        tot += apply(u['no'], u['mix']) + apply(u['no'], u['quiz'])
    open(W + 'data.json', 'w', encoding='utf8').write(json.dumps(d, ensure_ascii=False, indent=1))
    print('đã sửa', tot, 'câu (Unit 1)')
