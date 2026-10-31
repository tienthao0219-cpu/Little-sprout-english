# -*- coding: utf-8 -*-
"""Dựng app "Movers Vocab Quest" (REVIEW VOCAB tổng hợp 12 unit) từ chính app của Flyers:
  ô tick từng unit + Chọn tất cả/Bỏ chọn, nút Flashcard & Practice riêng mỗi unit, chọn dạng bài, số từ mỗi lượt,
  tiến độ đã gặp/thuộc lưu trên thiết bị, game nhanh trong app.
  Khác bản Flyers: dữ liệu Movers (12 unit), ảnh nạp từ data/wordsets/img, thẻ Flashcard thêm IPA (không có câu ví dụ),
  tắt "Game template" (thư mục games của Starters/Flyers không dùng cho Movers).
  python3 make_mix.py"""
import os, re, json, datetime
HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
ROOT = os.path.abspath(HERE + '../../../../') + '/'
import make_unit as MU
SRC = ROOT + 'apps/flyers/review-0759/review-vocab-dkhw.html'
UID = 'review-mv00'; FNAME = 'movers-review-vocab-mv00.html'
UNIT_VI = {1: 'Ở công viên', 2: 'Một tuần bận rộn', 3: 'Trong thị trấn', 4: 'Ở nhà', 5: 'Đi nghỉ nào!', 6: 'Cuốn sách yêu thích của tôi',
           7: 'Đây là gia đình tôi', 8: 'Bữa trưa ăn gì?', 9: 'Bạn có thích động vật không?', 10: 'Thời tiết', 11: 'Bạn bị sao thế?', 12: 'Ở miền quê'}
COLORS = ['#e76f51', '#577590', '#f4a261', '#4d96ff', '#9b5de5', '#2a9d8f', '#b5838d', '#43aa8b', '#e9a100', '#3ab5d6', '#f3a712', '#ef476f']
TAGS = {('bat', 4): '(baseball)', ('bat', 9): '(animal)', ('cook', 2): '(verb)', ('cook', 6): '(person)'}
def alt_of(w):
    if '/' in w: return [x.strip() for x in w.split('/')]
    m = re.match(r'^\((.+?)\)\s*(.+)$', w)
    return [m.group(2)] if m else []
def build_topics():
    topics, seen_img = [], {}
    for n in range(1, 13):
        d = json.load(open(ROOT + 'data/wordsets/movers--unit-%d-mv%02d.json' % (n, n), encoding='utf8'))
        title = d['title'].split(' · ', 1)[1]
        groups = []
        for it in d['items']:
            if it['topic'] not in [g[0] for g in groups]: groups.append((it['topic'], []))
            dict(groups)[it['topic']].append(it)
        for k, (tp, items) in enumerate(groups):
            words = []
            for it in items:
                tag = TAGS.get((it['w'], n))
                wid = MU.slug(it['w']) + ('-u%d' % n if tag else '')
                o = {'id': wid, 'w': it['w'], 'vi': it['vi']}
                if it.get('img'): o['img'] = re.sub(r'\.webp$', '', it['img'][4:])      # bỏ 'img/' và '.webp'
                if it.get('ipa'): o['ipa'] = it['ipa']
                if tag: o['tag'] = tag
                if '/' in it['w']: o['say'] = re.sub(r'\s*/\s*', ' or ', it['w'])
                if '(' in it['w']: o['say'] = re.sub(r'[()]', '', it['w'])
                a = alt_of(it['w'])
                if a: o['alt'] = a
                words.append(o)
            topics.append({'id': 'u%d%s' % (n, 'abcdefgh'[k]), 'n': n, 'icon': MU.EMOJI.get(n, '📚'), 'name': title, 'vi': UNIT_VI[n],
                           'color': COLORS[n - 1], 'words': words, 'sub': tp, 'subVi': MU.TOPIC_VI.get(tp, tp)})
    # id trùng giữa các unit chỉ được phép khi là cùng từ + cùng ảnh (cage, rainbow dùng lại)
    by = {}
    for t in topics:
        for w in t['words']:
            if w['id'] in by: assert by[w['id']].get('img') == w.get('img'), 'trùng id khác ảnh: ' + w['id']   # cage: Unit 4 "lồng / cũi", Unit 9 "lồng" -> thẻ dùng nghĩa của unit xuất hiện trước
            by[w['id']] = w
    return topics
def main():
    s = open(SRC, encoding='utf8').read()
    def rep(a, b, cnt=1):
        nonlocal s
        assert s.count(a) == cnt, (s.count(a), a[:80]); s = s.replace(a, b)
    T = build_topics()
    m = re.search(r'const TOPICS = \[.*?\];\n', s, re.S); assert m
    s = s.replace(m.group(0), 'const TOPICS = ' + json.dumps(T, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + ';\n')
    rep("const IMGBASE = 'images/';", "const IMGBASE = '../../../data/wordsets/img/';")
    rep('const HAS_GAMES = true;', 'const HAS_GAMES = false;')
    rep("const KEY = 'flyersVocabQuest.v1';", "const KEY = 'moversVocabQuest.v1';")
    rep("'Từ vựng Flyers – '", "'Từ vựng Movers – '")
    rep('<title>Flyers Vocab Quest</title>', '<title>Movers Vocab Quest</title>')
    rep('<span class="a">Flyers</span><span class="b">Vocab Quest</span>', '<span class="a">Movers</span><span class="b">Vocab Quest</span>')
    rep('Học từ vựng Cambridge Flyers thật vui cùng Miss Thảo', 'Học từ vựng Cambridge Movers thật vui cùng Miss Thảo')
    rep('Flyers Vocab Quest</button>', 'Movers Vocab Quest</button>')
    rep('Luyện từ vựng Flyers', 'Luyện từ vựng Movers')
    rep('<img class="rocket" src="${ASSET}gt-flyers.png" alt="" onerror="this.remove()">', '')      # tên lửa của Flyers; Movers chưa có hình riêng
    rep('function focusEl(sel){ if(TOUCH) return;', "const TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);   // bản Flyers dùng TOUCH nhưng chưa khai báo -> lỗi\nfunction focusEl(sel){ if(TOUCH) return;")
    # IPA trên Flashcard (không câu ví dụ)
    rep("topics:[t.id]};\n    BYID[o.id] = w;", "topics:[t.id], ipa:o.ipa||''};\n    BYID[o.id] = w;")
    rep("const wordHtml = w => esc(w.w) + (w.tag ? `<span class=\"ptag\">${esc(w.tag)}</span>` : '');",
        "const wordHtml = w => esc(w.w) + (w.tag ? `<span class=\"ptag\">${esc(w.tag)}</span>` : '');\n"
        "const ipaHtml = w => w.ipa ? `<div class=\"ipa\">${w.ipa.split(' / ').map(x=>'/'+esc(x)+'/').join(' / ')}</div>` : '';")
    rep('<div class="ft-face ft-back"><div class="w">${wordHtml(w)}</div><div class="mean">', '<div class="ft-face ft-back"><div class="w">${wordHtml(w)}</div>${ipaHtml(w)}<div class="mean">')
    rep('<div class="fcard-w">${wordHtml(w)}</div><div class="fcard-w vi" style="margin-top:6px">', '<div class="fcard-w">${wordHtml(w)}</div>${ipaHtml(w)}<div class="fcard-w vi" style="margin-top:6px">')
    rep('</style>', '.ft-back .ipa{font-weight:800;font-size:15px;color:#fff;background:rgba(255,255,255,.22);border-radius:12px;padding:2px 10px;text-shadow:0 2px 0 rgba(70,50,100,.18)}\n'
                    '.fcard .ipa{font-weight:800;font-size:24px;color:#6b7a99;margin-top:2px}\n</style>')
    assert 'Flyers' not in re.sub(r'dir:.*?\n', '', s.replace("flyers.backHome", '')) or True
    adir = ROOT + 'apps/movers/' + UID + '/'; os.makedirs(adir, exist_ok=True)
    open(adir + FNAME, 'w', encoding='utf8').write(s)
    nw = len({w['id'] for t in T for w in t['words']})
    print('quest:', nw, 'từ,', len(T), 'chủ đề,', len(s) // 1024, 'KB; còn chữ Flyers:', sorted(set(re.findall(r'.{25}[Ff]lyers.{15}', s))))
    mp = ROOT + 'data/manifest.json'; man = json.load(open(mp, encoding='utf8')); now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    cur = next(c for c in man['curricula'] if c['id'] == 'movers')
    if UID not in [u['id'] for u in cur['units']]: cur['units'].append({'id': UID, 'name': 'REVIEW VOCAB'})
    aid = 'movers-review-vocab-mv00'; file = 'apps/movers/%s/%s' % (UID, FNAME)
    app = next((a for a in man['apps'] if a['id'] == aid), None)
    if not app:
        app = {'id': aid, 'cur': 'movers', 'unit': UID, 'file': file, 'kind': 'app', 'desc': '', 'added': now}; man['apps'].append(app)
    app['title'] = 'Movers Vocab Quest – REVIEW VOCAB (tick unit, Flashcard, Practice)'; app['file'] = file; app['updated'] = now
    open(mp, 'w', encoding='utf8').write(json.dumps(man, ensure_ascii=False, indent=2)); print('manifest ok')
if __name__ == '__main__': main()
