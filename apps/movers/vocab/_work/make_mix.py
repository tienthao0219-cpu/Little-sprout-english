# -*- coding: utf-8 -*-
"""Dựng app REVIEW VOCAB gộp 12 unit Movers (giống file mix của Starters/Flyers):
  - tick một hoặc nhiều unit (không tick = trộn tất cả) -> Thẻ từ (hình + IPA + nghe + nghĩa) và Luyện tập 9 dạng, trộn xen kẽ.
  - ảnh nạp từ data/wordsets/img (lazy), không nhúng base64 nên file nhẹ.
  python3 make_mix.py"""
import os, re, json, datetime, glob
HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
ROOT = os.path.abspath(HERE + '../../../../') + '/'
import make_unit as MU
UID = 'review-mv00'; FNAME = 'movers-review-vocab-mv00.html'
TAGS = {('bat', 4): '(baseball)', ('bat', 9): '(animal)', ('cook', 2): '(verb)', ('cook', 6): '(person)'}   # từ trùng chữ khác nghĩa
def main():
    cards, seen, dupe = [], {}, []
    for n in range(1, 13):
        d = json.load(open(ROOT + 'data/wordsets/movers--unit-%d-mv%02d.json' % (n, n), encoding='utf8'))
        label = 'Unit %d · %s' % (n, d['title'].split(' · ', 1)[1])
        for it in d['items']:
            key = it['w'].lower()
            if key in seen and seen[key].get('image') == (('../../../data/wordsets/' + it['img']) if it.get('img') else None):
                continue                                   # cùng từ + cùng ảnh (cage, rainbow dùng lại) -> chỉ giữ một thẻ
            c = {'id': 'u%d-%s' % (n, MU.slug(it['w'])), 'word': it['w'], 'vi': it['vi'], 'topic': label, 'topicVi': ''}
            if it.get('ipa'): c['ipa'] = it['ipa']
            if it.get('img'): c['image'] = '../../../data/wordsets/' + it['img']
            if '/' in it['w']: c['say'] = re.sub(r'\s*/\s*', ' or ', it['w'])
            if '(' in it['w']: c['say'] = re.sub(r'[()]', '', it['w'])
            if not it.get('img') and it['topic'] == 'Days of the week': c['badge'] = it['w'][:3]
            if (it['w'], n) in TAGS: c['tag'] = TAGS[(it['w'], n)]
            if key in seen: dupe.append(it['w'])
            seen.setdefault(key, c); cards.append(c)
    # mọi từ trùng chữ còn lại phải đã có tag
    byw = {}
    for c in cards: byw.setdefault(c['word'].lower(), []).append(c)
    bad = [w for w, l in byw.items() if len(l) > 1 and not all(x.get('tag') for x in l)]
    assert not bad, 'từ trùng chữ chưa có tag: %s' % bad
    topics = []
    for c in cards:
        if c['topic'] not in topics: topics.append(c['topic'])
    tabs = '<button data-t="all" class="on">Tất cả <small>(%d)</small></button>' % len(cards) + ''.join(
        '<button data-t="%s">%s <small>%d</small></button>' % (MU.esc(t), MU.esc(t), len([c for c in cards if c['topic'] == t])) for t in topics)
    html = open(HERE + 'unit_template.html', encoding='utf8').read()
    def rep(a, b):
        nonlocal html
        assert html.count(a) == 1, a[:70]; html = html.replace(a, b)
    # --- chọn nhiều unit: dùng chung cho Thẻ từ và Luyện tập ---
    rep('let cards=[...originalCards], playingAll=false, stopAll=false, topicSel="all", view=cards;',
        'const SELU=window.SELU=new Set();\nfunction toggleU(t){ if(t==="all") SELU.clear(); else if(SELU.has(t)) SELU.delete(t); else SELU.add(t); document.querySelectorAll("#tabs2 button").forEach(x=>x.classList.toggle("on",x.dataset.t==="all"?!SELU.size:SELU.has(x.dataset.t))); }\nlet cards=[...originalCards], playingAll=false, stopAll=false, topicSel="all", view=cards;')
    rep("view=cards.filter(c=>topicSel==='all'||c.topic===topicSel);", "view=cards.filter(c=>!SELU.size||SELU.has(c.topic));")
    rep("topicSel=b.dataset.t; tabs2.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b)); render(); window.scrollTo(0,0);", "toggleU(b.dataset.t); render(); window.scrollTo(0,0);")
    rep("const pool=()=>W_ALL.filter(c=>sel==='all'||c.topic===sel);", "const pool=()=>W_ALL.filter(c=>!SELU.size||SELU.has(c.topic));")
    rep("""<button class="pr-chip ${sel==='all'?'on':''}" data-t="all">""", """<button class="pr-chip ${!SELU.size?'on':''}" data-t="all">""")
    rep("""<button class="pr-chip ${sel===t?'on':''}" data-t="${esc(t)}">""", """<button class="pr-chip ${SELU.has(t)?'on':''}" data-t="${esc(t)}">""")
    rep("if(b.dataset.t!==undefined){ sel=b.dataset.t; return setup(); }", "if(b.dataset.t!==undefined){ toggleU(b.dataset.t); return setup(); }")
    rep('<img src="${c.image}" alt="${esc(c.word)}">', '<img loading="lazy" decoding="async" src="${c.image}" alt="${esc(c.word)}">')
    rep('<div><b>Chủ đề</b></div>', '<div><b>Chọn unit</b> <small style="color:#6d8da2">(tick nhiều unit để trộn; không tick = tất cả)</small></div>')
    rep('Bấm vào thẻ để nghe phát âm.', 'Tick các unit muốn ôn, bấm thẻ để nghe phát âm. Không tick = trộn cả 12 unit.')
    html = (html.replace('@@TITLE@@', 'Movers · REVIEW VOCAB').replace('@@EMOJI@@', '🌈').replace('@@H1@@', 'MOVERS · REVIEW VOCAB')
            .replace('@@N@@', str(len(cards))).replace('@@TABS@@', tabs)
            .replace('@@CARDS@@', json.dumps(cards, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')))
    html = html.replace('Từ + IPA', 'Từ + IPA')
    adir = ROOT + 'apps/movers/' + UID + '/'; os.makedirs(adir, exist_ok=True)
    open(adir + FNAME, 'w', encoding='utf8').write(html)
    print('mix:', len(cards), 'thẻ,', len(topics), 'unit,', len(html) // 1024, 'KB; bỏ thẻ trùng:', dupe)
    mp = ROOT + 'data/manifest.json'; m = json.load(open(mp, encoding='utf8')); now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')
    cur = next(c for c in m['curricula'] if c['id'] == 'movers')
    cur['units'] = [u for u in cur['units'] if u['id'] != UID] + [{'id': UID, 'name': 'REVIEW VOCAB'}]
    aid = 'movers-review-vocab-mv00'; file = 'apps/movers/%s/%s' % (UID, FNAME)
    app = next((a for a in m['apps'] if a['id'] == aid), None)
    if not app:
        app = {'id': aid, 'title': 'Movers · REVIEW VOCAB (trộn 12 unit, có hình + IPA)', 'cur': 'movers', 'unit': UID, 'file': file, 'kind': 'app', 'desc': '', 'added': now}; m['apps'].append(app)
    app['file'] = file; app['updated'] = now
    open(mp, 'w', encoding='utf8').write(json.dumps(m, ensure_ascii=False, indent=2)); print('manifest ok')
if __name__ == '__main__': main()
