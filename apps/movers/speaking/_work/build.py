# -*- coding: utf-8 -*-
"""Dựng apps/movers/speaking/speaking.html = template.html + dữ liệu các bộ trong sets/*.py.
   python3 _work/build.py      (chạy từ bất kỳ đâu).  Đồng thời đăng ký app vào data/manifest.json (nếu chưa có)."""
import json, os, sys, glob, importlib.util, datetime
W = os.path.dirname(os.path.abspath(__file__)) + '/'
def load(path):
    spec = importlib.util.spec_from_file_location(os.path.basename(path)[:-3], path); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
groups, sets = [], []
for p in sorted(glob.glob(W + 'sets/*.py')):
    if os.path.basename(p).startswith('_'): continue
    m = load(p)
    if getattr(m, 'GROUP', None) and m.GROUP[0] not in [g['id'] for g in groups]: groups.append({'id': m.GROUP[0], 'name': m.GROUP[1]})
    sets.extend(m.SETS)
ids = [s['id'] for s in sets]; assert len(ids) == len(set(ids)), 'trùng id bộ'
for k, s in enumerate(sets): s['no'] = k + 1          # đánh số liên tục theo thứ tự file trong sets/
TCODE = open(W + 'tcode.txt').read().strip() if os.path.exists(W + 'tcode.txt') else '97afd2db'     # mã của cô (băm); mặc định thao2026, đổi bằng set_code.py
DATA = {'groups': groups, 'sets': sets, 'tcode': TCODE}
json.dump(DATA, open(W + 'data.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
t = open(W + 'template.html', encoding='utf8').read()
out = t.replace('@@DATA@@', json.dumps(DATA, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'))
open(W + '../speaking.html', 'w', encoding='utf8').write(out)
print('built', len(out), 'bytes;', len([s for s in sets if not s.get('hidden')]), 'bộ hiển thị /', len(sets), 'bộ')

def manifest():
    mp = W + '../../../../data/manifest.json'
    if not os.path.exists(mp): return
    m = json.load(open(mp, encoding='utf8')); now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    if not any(c['id'] == 'movers' for c in m['curricula']):
        used = {c.get('tint') for c in m['curricula']}; tint = next(i for i in range(20) if i not in used)
        m['curricula'].append({'id': 'movers', 'name': 'Cambridge Movers', 'emoji': '🌈', 'tint': tint, 'units': [{'id': 'speaking', 'name': 'SPEAKING'}]})
        print('manifest: thêm curriculum movers')
    app = next((a for a in m['apps'] if a.get('file') == 'apps/movers/speaking/speaking.html'), None)
    if not app:
        app = {'id': 'speaking-test-movers', 'title': 'Movers Speaking – bộ đề (4 Parts)', 'cur': 'movers', 'unit': 'speaking', 'file': 'apps/movers/speaking/speaking.html', 'kind': 'app', 'added': now}
        m['apps'].append(app)
    app['desc'] = 'Luyện nói Movers như thi thật: Part 1 hai tranh song song, Part 2 kể chuyện 4 tranh, Part 3 tìm tranh khác loại, Part 4 câu hỏi cá nhân; có gợi ý và chế độ cô'
    app['title'] = 'Movers Speaking – %d bộ đề (4 Parts)' % len([s for s in sets if not s.get('hidden')])
    app['updated'] = now
    open(mp, 'w', encoding='utf8').write(json.dumps(m, ensure_ascii=False, indent=2)); print('manifest: updated', now)
manifest()
