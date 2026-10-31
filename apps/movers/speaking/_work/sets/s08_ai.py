# -*- coding: utf-8 -*-
"""12 bộ do Claude soạn (ai-t1…ai-t12). Nội dung lấy từ ai_sets/specs.py. Bộ ẨN cho tới khi có ảnh:
ai_sets/import_ai.py <id> đưa ảnh vào img/<id>/ và ghi id vào sets/_ai_ready.json -> bộ hiện ra.  Vòng khoanh Part 1 ghi vào sets/_crop/<id>.json (khoá "dif")."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'ai_sets'))
from _common import S2
from specs import SPECS, DEMOS
GROUP = ('ai', 'Bộ soạn thêm (ảnh AI)')
READY = json.load(open(os.path.join(HERE, '_ai_ready.json'))) if os.path.exists(os.path.join(HERE, '_ai_ready.json')) else []
SETS = []
for k, sp in enumerate(SPECS, 1):
    ex = sp['p1']['example']; st = sp['story']; dm = DEMOS[sp['demo']]
    items = [("In my picture %s." % d[1], "(In your picture) %s." % d[2], "Here %s, but here …" % d[1]) for d in sp['p1']['diffs']]
    dif = [({'b': [.3, .3, .3, .3], 'w': [d[4], d[5]]}) for d in sp['p1']['diffs']]
    demo_intro = "Now look at these four pictures. One is different. %s Now you tell me about these pictures. Which one is different? (Why?)" % dm[2]
    p3sets = [(dm[1], dm[2], "", dm[0])] + [(r[1], r[2], r[3], r[0]) for r in sp['rows']]
    s = S2(sp['id'], 0, 'ai', 'Bộ soạn thêm · %d' % k, "Bộ do Claude soạn theo cấu trúc Movers · chủ đề: %s (ảnh tạo bằng AI)" % sp['theme'], st['title'],
           ("Here %s, but here %s." % (ex[0], ex[1]), items), [], (st['title'], st['lines'][0], [(i + 2, st['lines'][i + 1], st['backs'][i]) for i in range(3)]),
           st['lines'], (demo_intro, p3sets), ("Now let's talk about %s." % sp['topic'], sp['p4']), {}, note=sp.get('note'), draft=True, origin='claude')
    if os.path.exists(os.path.join(HERE, '_crop', sp['id'] + '.json')) and 'dif' in json.load(open(os.path.join(HERE, '_crop', sp['id'] + '.json'))): pass
    else: s['dif'] = []                       # chưa đo vòng khoanh -> để trống (app vẫn chạy, chỉ không có vòng)
    if sp['id'] not in READY: s['hidden'] = True
    SETS.append(s)
