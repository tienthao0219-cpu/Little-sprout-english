# -*- coding: utf-8 -*-
"""Dựng app "Thẻ từ vựng" cho một unit Movers từ ảnh lưới cô gửi.

  python3 make_unit.py <số unit> <thư mục chứa mv-uNN-gK.png> [--no-manifest]

Việc làm: cắt ô theo grids.json -> data/wordsets/img/movers--unit-N-mvNN/<từ>.webp
          -> data/wordsets/movers--unit-N-mvNN.json (+ index.json)
          -> apps/movers/unit-N-mvNN/unit-N-<tên>-the-tu-vung-mvNN.html (mẫu = app Flyers)
          -> data/manifest.json (curriculum movers: thêm unit + app).
Từ không có ảnh (None): thẻ chữ, không hình. Từ ('reuse','uNN:từ'): dùng lại ảnh unit khác nếu unit đó đã dựng.
Không tự điền IPA (cô chưa gửi): thẻ chỉ hiện từ + nghĩa."""
import sys, os, re, json, datetime
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
ROOT = os.path.abspath(HERE + '../../../../') + '/'
sys.path.insert(0, HERE)
import slice_grid as sg
import vocab_data as V

TOPIC_VI = {
 'Verbs & actions': 'Động từ & hành động', 'Clothes & accessories': 'Quần áo & phụ kiện', 'Sports & activities': 'Thể thao & hoạt động',
 'Descriptive adjectives': 'Tính từ miêu tả', 'Colours': 'Màu sắc', 'Activities': 'Hoạt động', 'Things & media': 'Đồ vật & phương tiện',
 'Days of the week': 'Các ngày trong tuần', 'Places': 'Địa điểm', 'Things': 'Đồ vật', 'Things in the house': 'Đồ vật trong nhà',
 'Places in the house': 'Nơi trong nhà', 'Holiday places': 'Địa điểm đi chơi', 'Things & concepts': 'Đồ vật & khái niệm',
 'People & jobs': 'Người & nghề nghiệp', 'Family': 'Gia đình', 'Appearance': 'Ngoại hình', 'Food & drink': 'Đồ ăn & thức uống',
 'Containers': 'Đồ đựng', 'Animals': 'Động vật', 'Scenery': 'Phong cảnh', 'Weather & nature': 'Thời tiết & thiên nhiên',
 'Body': 'Cơ thể', 'Health': 'Sức khỏe', 'Countryside': 'Miền quê', 'Vehicles & things': 'Phương tiện & đồ vật'}
EMOJI = {1: '🌳', 2: '📅', 3: '🏙️', 4: '🏠', 5: '🧳', 6: '📖', 7: '👨‍👩‍👧', 8: '🍽️', 9: '🐘', 10: '⛅', 11: '🩺', 12: '🚜'}

IPA = json.load(open(HERE + 'ipa_movers.json', encoding='utf8')) if os.path.exists(HERE + 'ipa_movers.json') else {}

def slug(w): return re.sub(r'[^a-z0-9]+', '-', w.lower()).strip('-')
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

def main():
    n = int(sys.argv[1]); src = sys.argv[2].rstrip('/') + '/'; nomf = '--no-manifest' in sys.argv
    unit = next(u for u in V.U if u['n'] == n)
    grids = next(g for g in json.load(open(HERE + 'grids.json', encoding='utf8'))['units'] if g['n'] == n)['grids']
    uid = 'unit-%d-mv%02d' % (n, n); wid = 'movers--' + uid
    imgdir = ROOT + 'data/wordsets/img/' + wid + '/'; os.makedirs(imgdir, exist_ok=True)

    # 1) cắt ô -> webp
    got = {}
    for g in grids:
        p = src + g['file'] + '.png'
        if not os.path.exists(p): print('THIẾU ảnh', p); continue
        im = Image.open(p); boxes = sg.find_cells(im, g['cols'], g['rows'])
        assert len(boxes) == len([w for w in g['words']]), g['file']
        for w, b in zip(g['words'], boxes):
            if w is None: continue
            t = sg.trim(im, b); t.save(imgdir + slug(w) + '.webp', 'WEBP', quality=84, method=6); got[w] = 'img/%s/%s.webp' % (wid, slug(w))
    # 2) danh sách thẻ
    items, cards = [], []
    for it in unit['items']:
        w, vi, topic, desc = it
        img = got.get(w)
        if isinstance(desc, tuple) and desc[0] == 'reuse':
            su, sw = desc[1].split(':'); sfile = ROOT + 'data/wordsets/movers--unit-%d-mv%02d.json' % (int(su[1:]), int(su[1:]))
            if os.path.exists(sfile):
                img = next((x['img'] for x in json.load(open(sfile, encoding='utf8'))['items'] if x['w'] == sw), None)
        if desc is not None and not isinstance(desc, tuple) and w not in got: print('CHƯA CÓ ẢNH:', w)
        d = {'w': w, 'vi': vi, 'topic': topic}
        if IPA.get(w): d['ipa'] = IPA[w]
        if img: d['img'] = img
        items.append(d)
    # 3) wordset json + index
    title = 'Unit %d · %s' % (n, unit['title'])
    json.dump({'id': wid, 'title': title, 'cur': 'movers', 'unit': uid, 'items': items}, open(ROOT + 'data/wordsets/' + wid + '.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    ip = ROOT + 'data/wordsets/index.json'; idx = json.load(open(ip, encoding='utf8'))
    idx['sets'] = [s for s in idx['sets'] if s['id'] != wid]
    idx['sets'].append({'id': wid, 'title': title, 'cur': 'movers', 'unit': uid, 'n': len(items), 'pics': len([x for x in items if x.get('img')])})
    json.dump(idx, open(ip, 'w', encoding='utf8'), ensure_ascii=False, indent=2)
    # 4) app html (ảnh nhúng base64 như app Flyers để chạy độc lập)
    import base64
    for it in items:
        c = {'id': slug(it['w']), 'word': it['w'], 'vi': it['vi'], 'topic': it['topic'], 'topicVi': TOPIC_VI.get(it['topic'], it['topic'])}
        if it.get('ipa'): c['ipa'] = it['ipa']
        if '(' in it['w']: c['say'] = re.sub(r'[()]', '', it['w'])
        if '/' in it['w']: c['say'] = re.sub(r'\s*/\s*', ' or ', it['w'])
        if not it.get('img') and it['topic'] == 'Days of the week': c['badge'] = it['w'][:3]
        if it.get('img'):
            b = open(ROOT + 'data/wordsets/' + it['img'], 'rb').read(); c['image'] = 'data:image/webp;base64,' + base64.b64encode(b).decode()
        cards.append(c)
    topics = []
    for c in cards:
        if c['topic'] not in [t[0] for t in topics]: topics.append((c['topic'], c['topicVi']))
    tabs = '<button data-t="all" class="on">Tất cả <small>(%d)</small></button>' % len(cards) + ''.join(
        '<button data-t="%s">%s <small>%s · %d</small></button>' % (esc(t), esc(t), esc(tv), len([c for c in cards if c['topic'] == t])) for t, tv in topics)
    html = open(HERE + 'unit_template.html', encoding='utf8').read()
    html = (html.replace('@@TITLE@@', esc(title)).replace('@@EMOJI@@', EMOJI.get(n, '📚')).replace('@@H1@@', esc('UNIT %d · %s' % (n, unit['title'].upper())))
            .replace('@@N@@', str(len(cards))).replace('@@TABS@@', tabs)
            .replace('@@CARDS@@', json.dumps(cards, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')))
    if not any(it.get('ipa') for it in items): html = html.replace('Từ + IPA', 'Từ')   # chưa có IPA: bỏ chữ IPA trên nút
    fname = 'unit-%d-%s-the-tu-vung-mv%02d.html' % (n, slug(unit['title']), n)
    adir = ROOT + 'apps/movers/' + uid + '/'; os.makedirs(adir, exist_ok=True)
    open(adir + fname, 'w', encoding='utf8').write(html)
    print('unit', n, '->', len(cards), 'thẻ,', len([c for c in cards if c.get('image')]), 'có hình;', fname, len(html) // 1024, 'KB')
    # 5) manifest
    if nomf: return
    mp = ROOT + 'data/manifest.json'; m = json.load(open(mp, encoding='utf8')); now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    cur = next(c for c in m['curricula'] if c['id'] == 'movers')
    if uid not in [u['id'] for u in cur['units']]: cur['units'].append({'id': uid, 'name': 'UNIT %d' % n})
    cur['units'] = [u for u in cur['units'] if u['id'] == 'speaking'] + sorted([u for u in cur['units'] if u['id'] != 'speaking'], key=lambda u: int((re.search(r'\d+', u['name']) or re.search(r'(\d+)', '999')).group()))
    aid = fname[:-5]; file = 'apps/movers/%s/%s' % (uid, fname)
    app = next((a for a in m['apps'] if a['id'] == aid), None)
    if not app:
        app = {'id': aid, 'title': '%s - Thẻ từ vựng' % title, 'cur': 'movers', 'unit': uid, 'file': file, 'kind': 'app', 'desc': '', 'added': now}; m['apps'].append(app)
    app['file'] = file; app['updated'] = now
    open(mp, 'w', encoding='utf8').write(json.dumps(m, ensure_ascii=False, indent=2)); print('manifest: ok', aid)

if __name__ == '__main__': main()
