# Unit 1 không có script riêng: áp dụng sửa câu điền từ + làm lại bài tổng hợp trực tiếp trên data.json
import json, os
import ugen, fixes
W = os.path.dirname(os.path.abspath(__file__)) + '/'
d = json.load(open(W + 'data.json', encoding='utf8'))
u = [x for x in d['units'] if x['no'] == 1][0]
n = 0
for l in u['lessons']:
    n += fixes.apply(1, l['practice'])
n += fixes.apply(1, u['mix'])
u['quiz'] = ugen.make_quiz(u['lessons'])
ugen.validate(u)
open(W + 'data.json', 'w', encoding='utf8').write(json.dumps(d, ensure_ascii=False, indent=1))
print('Unit 1: sửa', n, 'câu, bài tổng hợp', len(u['quiz']), 'câu')
