# Unit 1 · bài "Prepositions of place": thêm HÌNH cho các câu luyện tập trước đây chỉ có chữ (và gợi ý nghĩa).
# Khớp theo nội dung câu hỏi, áp cho cả 3 kho: lesson.practice, quiz (bài tổng hợp) và mix (bài trộn). Chạy lại nhiều lần không sao.
# Hình vẽ ở template.html (prepScene): art = {t:'prep', v: giới từ, a: vật, o: nơi}.
import json, os
W = os.path.dirname(os.path.abspath(__file__)) + '/'
A = lambda v, a, o: {'t': 'prep', 'v': v, 'a': a, 'o': o}
MAP = {
    'The pen is ___ the bag.': A('in', 'pen', 'bag'),
    "Tom: It's ___ the bag. I can see it inside!": A('in', 'pen', 'bag'),
    'The cup is ___ the table.': A('on', 'cup', 'table'),
    'The shoes are ___ the bed.': A('under', 'shoes', 'bed'),
    'The cat is ___ the door.': A('behind', 'cat', 'door'),
    'The fridge is ___ the cooker.': A('next', 'fridge', 'cooker'),
    "Mum: It's ___ the cooker. They are very close.": A('next', 'fridge', 'cooker'),
    'The key is ___ the box.': A('in', 'key', 'box'),
    'The ball is ___ the chair.': A('under', 'ball', 'chair'),
    'My bag is ___ the desk.': A('on', 'bag', 'desk'),
    "The teacher's desk is ___ the board.": A('front', 'desk', 'board'),
    'She is ___ the sofa.': A('behind', 'tail', 'sofa'),
}
d = json.load(open(W + 'data.json', encoding='utf8'))
u = [x for x in d['units'] if x['no'] == 1][0]
pools = [('practice', q) for l in u['lessons'] for q in l['practice']] + [('quiz', q) for q in u['quiz']] + [('mix', q) for q in u['mix']]
n = 0
for src, q in pools:
    if q.get('topic', 'Prepositions of place') != 'Prepositions of place' or q.get('art'): continue
    a = MAP.get(q['q'])
    if a:
        q['art'] = dict(a); n += 1
left = [(s, q['q']) for s, q in pools if q.get('topic', 'Prepositions of place') == 'Prepositions of place' and not q.get('art')]
with open(W + 'data.json', 'w', encoding='utf8') as f:
    f.write(json.dumps(d, ensure_ascii=False, indent=1))
print('đã thêm hình cho', n, 'câu; còn thiếu hình:', left)
