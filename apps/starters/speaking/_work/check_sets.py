"""Kiểm tra dữ liệu các bộ test Starters Speaking và vẽ khung kiểm tra lên tranh.

    python3 _work/check_sets.py            # kiểm tra mọi bộ
    python3 _work/check_sets.py ptp-t1     # chỉ một bộ

- In ra LỖI (phải sửa) và CẢNH BÁO (nên xem lại) cho từng bộ.
- Vẽ _work/check/<mã bộ>.png: khung XANH = vật trên tranh (hot), khung HỒNG = vùng đặt thẻ (zones),
  chấm ĐỎ = điểm đặt thẻ. MỞ ẢNH NÀY RA XEM trước khi build: khung phải nằm đúng vật mà câu hỏi nhắc tới
  (lần trước vùng "bicycle" bao trùm người phụ nữ nên thẻ đè lên người).
Cần: Pillow.
"""
import json, os, sys
from PIL import Image, ImageDraw

W = os.path.dirname(os.path.abspath(__file__)) + '/'
data = json.load(open(W + 'data.json', encoding='utf8'))

def rect_ok(r):
    return isinstance(r, list) and len(r) == 4 and all(isinstance(v, (int, float)) for v in r) \
        and r[2] > 0 and r[3] > 0 and r[0] >= 0 and r[1] >= 0 and r[0] + r[2] <= 100.5 and r[1] + r[3] <= 100.5

def check(s):
    E, Wn = [], []
    sid = s['id']
    miss = ['thiếu trường "%s"' % k for k in ('id', 'no', 'title', 'theme', 'themeVi', 'src', 'origin', 'scene', 'hot', 'zones', 'cards', 'p1', 'p2', 'p3', 'p4', 'bye') if k not in s]
    if miss: return miss, Wn
    if s['origin'] not in ('book', 'claude'): E.append('origin phải là "book" hoặc "claude"')
    img = W + '../' + s['scene'].get('img', '')
    if not os.path.exists(img): E.append('chưa có ảnh tranh: ' + s['scene'].get('img', ''))
    for k, v in s['hot'].items():
        if not rect_ok(v.get('rect')): E.append('hot["%s"] toạ độ sai (x,y,w,h tính theo %% tranh, trong 0..100)' % k)
    for k, v in s['zones'].items():
        if not rect_ok(v.get('rect')): E.append('zones["%s"] toạ độ sai' % k)
        a = v.get('at')
        if a is not None and not (len(a) == 2 and 0 <= a[0] <= 100 and 0 <= a[1] <= 100): E.append('zones["%s"].at sai' % k)
    for k, c in s['cards'].items():
        if not os.path.exists(W + '../' + c.get('img', '')): E.append('chưa có ảnh thẻ "%s": %s' % (k, c.get('img')))
        if not c.get('w') or not c.get('s'): E.append('thẻ "%s" thiếu w/s (từ và câu mẫu)' % k)
    P = s['p1']
    miss = ['p1 thiếu "%s"' % k for k in ('hello', 'intro', 'example', 'find', 'tableSay', 'order', 'cardSteps') if k not in P]
    if miss: return E + miss, Wn
    def q(path, x, need_hints=True):
        if not x.get('say'): E.append(path + ': thiếu say')
        if not x.get('vi'): Wn.append(path + ': thiếu nghĩa tiếng Việt (vi)')
        if need_hints and len(x.get('hints') or []) < 2: Wn.append(path + ': chưa đủ gợi ý (nên 2 mức)')
    if P['example'].get('target') not in s['hot']: E.append('p1.example.target không có trong hot')
    for i, f in enumerate(P['find']):
        q('p1.find[%d]' % i, f)
        if f.get('target') not in s['hot']: E.append('p1.find[%d].target "%s" không có trong hot' % (i, f.get('target')))
    for c in P['order']:
        if c not in s['cards']: E.append('p1.order có thẻ "%s" không có trong cards' % c)
    for i, c in enumerate(P['cardSteps']):
        if c['card'] not in s['cards']: E.append('p1.cardSteps[%d].card "%s" không có trong cards' % (i, c['card']))
        q('p1.cardSteps[%d].pick' % i, c['pick']); q('p1.cardSteps[%d].place' % i, c['place'])
        for part in ('demo', 'place'):
            if part in c and c[part].get('zone') not in s['zones']: E.append('p1.cardSteps[%d].%s.zone "%s" không có trong zones' % (i, part, c[part].get('zone')))
    for i, x in enumerate(s['p2']):
        q('p2[%d]' % i, x)
        if x.get('point') not in s['hot']: E.append('p2[%d].point "%s" không có trong hot' % (i, x.get('point')))
    for i, c in enumerate(s['p3']):
        if c['card'] not in s['cards']: E.append('p3[%d].card không có trong cards' % i)
        for j, x in enumerate(c['qs']): q('p3[%d].qs[%d]' % (i, j), x)
    for i, x in enumerate(s['p4']): q('p4[%d]' % i, x)
    # số điểm tương tự Test 1: 3 câu Part 4, 4 thẻ Part 3, 5 câu Part 2 (chỉ cảnh báo)
    if len(s['p2']) != 5: Wn.append('Part 2 có %d câu (Test 1 có 5)' % len(s['p2']))
    if len(s['p3']) != 4: Wn.append('Part 3 có %d thẻ (Test 1 có 4)' % len(s['p3']))
    if len(s['p4']) != 3: Wn.append('Part 4 có %d câu (Test 1 có 3)' % len(s['p4']))
    for i, c in enumerate(s['p3']):
        if c.get('check'): Wn.append('p3[%d] còn ghi chú cần cô xác nhận: %s' % (i, c['check'][:80]))
    return E, Wn

def overlay(s):
    img = W + '../' + s['scene'].get('img', '')
    if not os.path.exists(img): return
    im = Image.open(img).convert('RGB'); w0, h0 = im.size
    k = 1400 / w0; im = im.resize((1400, round(h0 * k))); w, h = im.size
    d = ImageDraw.Draw(im)
    for name, z in s['hot'].items():
        x, y, rw, rh = z['rect']; d.rectangle([x * w / 100, y * h / 100, (x + rw) * w / 100, (y + rh) * h / 100], outline=(0, 90, 255), width=3); d.text((x * w / 100 + 4, y * h / 100 + 3), name, fill=(0, 60, 255))
    for name, z in s['zones'].items():
        x, y, rw, rh = z['rect']; d.rectangle([x * w / 100, y * h / 100, (x + rw) * w / 100, (y + rh) * h / 100], outline=(255, 0, 110), width=4); d.text((x * w / 100 + 4, y * h / 100 + 3), 'ZONE ' + name, fill=(255, 0, 110))
        ax, ay = z.get('at') or (x + rw / 2, y + rh / 2); d.ellipse([ax * w / 100 - 6, ay * h / 100 - 6, ax * w / 100 + 6, ay * h / 100 + 6], fill=(255, 0, 0))
    os.makedirs(W + 'check', exist_ok=True); im.save(W + 'check/%s.png' % s['id'])

def main():
    ids = sys.argv[1:]
    bad = 0
    ids_seen, nos = set(), set()
    for s in data['sets']:
        if ids and s['id'] not in ids: continue
        if s['id'] in ids_seen: print('LỖI: trùng id', s['id']); bad += 1
        ids_seen.add(s['id'])
        if s.get('no') in nos: print('LỖI: trùng số bộ', s.get('no'), s['id']); bad += 1
        nos.add(s.get('no'))
        E, Wn = check(s)
        print('== %s (%s) — %d lỗi, %d cảnh báo' % (s['id'], s.get('title', '?'), len(E), len(Wn)))
        for e in E: print('  LỖI:', e)
        for w in Wn: print('  cảnh báo:', w)
        bad += len(E)
        if not E: overlay(s)
    print('\nTổng: %d bộ đã kiểm tra, %d lỗi.%s' % (len(ids_seen), bad, ' Mở ảnh trong _work/check/ để xem khung.' if os.path.isdir(W + 'check') else ''))
    sys.exit(1 if bad else 0)

main()
