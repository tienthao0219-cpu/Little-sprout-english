# -*- coding: utf-8 -*-
"""Dựng một bộ test hoàn chỉnh (4 Part) từ đặc tả ai_specs.py + file toạ độ, rồi thêm vào data.json.

    python3 ai_sets/gen_set.py <mã bộ>            # đọc ai_sets/coords/<mã bộ>.json

coords/<mã bộ>.json:
{
  "hot":   { "<khoá vật>": [x, y, w, h], ... },          # %, góc trên-trái + rộng + cao. Khoá: vật ví dụ, 2 vật cần tìm, nhóm đếm, em bé làm gì, người "Tell me about"
  "zones": { "<khoá vùng>": [x, y, w, h] hoặc [x, y, w, h, ax, ay] },   # vùng đặt thẻ (+ điểm thẻ nằm xuống)
  "colours": { "<khoá thẻ>": "red", ... }                 # màu chính của thẻ (cho câu "What colour is it?")
}
Ảnh phải có sẵn: img/<mã bộ>/scene.webp và img/<mã bộ>/<khoá thẻ>.webp (từ slice_sheet.py -> cutout.py).
Mọi phần do Claude soạn đều gắn origin "claude".
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
sys.path.insert(0, HERE); sys.path.insert(0, HERE + '../handoff/tools')
from ai_specs import SPECS, VI
from sethelp import *

PLACE = {'ai-t1': ('the zoo', 'sở thú'), 'ai-t2': ('a farm', 'nông trại'), 'ai-t3': ('a kitchen', 'nhà bếp'), 'ai-t4': ('a bedroom', 'phòng ngủ'), 'ai-t5': ('a birthday party', 'bữa tiệc sinh nhật'),
         'ai-t6': ('a sports field', 'sân thể thao'), 'ai-t7': ('a swimming pool', 'bể bơi'), 'ai-t8': ('a picnic', 'buổi dã ngoại'), 'ai-t9': ('a railway station', 'nhà ga'), 'ai-t10': ('a market', 'khu chợ')}
PREP_VI = {'on': 'lên', 'under': 'dưới', 'next to': 'bên cạnh', 'in': 'vào trong'}
NUM = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five'}
COLOURS = ['red', 'blue', 'yellow', 'green', 'pink', 'white', 'brown']
DIST = {'animal': 'dog', 'food': 'cake', 'clothes': 'hat', 'thing': 'book'}
CL_ALT = {'balloons': 'flowers', 'ducks': 'birds', 'apples': 'oranges', 'toy cars': 'toy trains', 'balls': 'apples', 'tomatoes': 'apples', 'bags': 'books', 'rubber ducks': 'toy cars'}
PRON = {'boy': 'he', 'man': 'he', 'girl': 'she', 'woman': 'she'}
cap = lambda t: t[:1].upper() + t[1:]

def other_colour(c): return next(x for x in COLOURS if x != c)
def art(c): return ('an ' if c['art'] == 'an' else 'a ') + c['word'] if c['art'] in ('a', 'an') else c['word']
def is_pl(c): return c['art'] == 'pl'

def pick_say(c):
    w = c['word']
    return ('Which are the %s?' % w, 'Are these the %s?' % w) if is_pl(c) else ('Which is the %s?' % w, 'Is this the %s?' % w)
def card_vi(c): return VI.get(c['word'], c['word'])

def p3_cards(s, ci, colours):
    c = next(x for x in s['cards'] if x['key'] == ci); w = c['word']; vi = card_vi(c); cat = c['cat']
    d = DIST[cat] if DIST[cat] != w else 'ball'
    if is_pl(c):
        q1 = Q('What are these?', 'Đây là những gì?', [cap(w)], 'Are they %s?' % w, ['Are they %s?' % w, 'Are they %s or %ss?' % (w, d)])
    elif c['art'] == 'mass':
        q1 = Q("What's this?", 'Đây là gì?', [cap(w)], 'Is it %s?' % w, ['Is it %s?' % w, 'Is it %s or %s?' % (w, d)])
    else:
        q1 = Q("What's this?", 'Đây là gì?', [cap(w)], 'Is it %s?' % art(c), ['Is it %s?' % art(c), 'Is it %s or a %s?' % (art(c), d)])
    if cat == 'animal':
        q2 = Q('Do you like %s?' % c['pl'], 'Em có thích %s không?' % vi, ['Yes / No'], '', ['Yes or no? Do you like %s?' % c['pl'], 'Is %s big or small?' % art(c)], free=True)
        q3 = Q("What's your favourite animal?", 'Con vật em thích nhất là gì?', ['(A) dog'], 'Do you like dogs?', ['Do you like dogs?', 'Do you like dogs or cats?'], free=True)
    elif cat == 'food':
        q2 = Q('Do you like %s?' % c['pl'], 'Em có thích %s không?' % vi, ['Yes / No'], '', ['Yes or no? Do you like %s?' % c['pl'], 'Do you eat %s?' % c['pl']], free=True)
        ans = 'Bread' if c['meal'] == 'breakfast' else 'Rice'
        q3 = Q('What do you eat for %s?' % c['meal'], 'Bữa %s em ăn gì?' % {'breakfast': 'sáng', 'lunch': 'trưa', 'dinner': 'tối'}[c['meal']], [ans],
               'Do you eat %s?' % ans.lower(), ['Do you eat %s?' % ans.lower(), 'Do you eat %s or %s?' % (ans.lower(), 'noodles' if ans == 'Rice' else 'rice')], free=True)
    elif cat == 'clothes':
        wear = w if is_pl(c) else art(c)
        q2 = Q('Do you wear %s to school?' % wear, 'Em có mặc %s đến trường không?' % vi, ['Yes / No'], '', ['Yes or no? Do you wear %s to school?' % wear, 'Do you wear %s at home?' % wear], free=True)
        q3 = Q('What colour %s your %s?' % ('are' if is_pl(c) else 'is', w), '%s của em màu gì?' % cap(vi), ['(Blue)'],
               '%s your %s blue?' % ('Are' if is_pl(c) else 'Is', w), ['%s your %s blue?' % ('Are' if is_pl(c) else 'Is', w), '%s your %s blue or white?' % ('Are' if is_pl(c) else 'Is', w)], free=True)
    else:  # thing
        have = ('Do you wear %s?' % w) if w == 'glasses' else ('Have you got %s?' % (art(c) if not is_pl(c) else w))
        q2 = Q(have, 'Em có %s không?' % vi, ['Yes / No'], '', ['Yes or no? ' + have, 'Do you like %s?' % c['pl']], free=True)
        col = colours.get(ci)
        if col:
            b = '%s it %s?' % ('Is', col)
            q3 = Q('What colour is it?' if not is_pl(c) else 'What colour are they?', 'Nó màu gì?', [cap(col)], 'Is it %s?' % col if not is_pl(c) else 'Are they %s?' % col,
                   [('Is it %s?' % col) if not is_pl(c) else ('Are they %s?' % col), ('Is it %s or %s?' % (col, other_colour(col))) if not is_pl(c) else ('Are they %s or %s?' % (col, other_colour(col)))])
        else:
            q3 = Q('Do you like %s?' % c['pl'], 'Em có thích %s không?' % vi, ['Yes / No'], '', ['Yes or no? Do you like %s?' % c['pl'], 'Do you play with %s?' % c['pl']], free=True)
    return p3(ci, [q1, q2, q3])

def build(sid):
    s = next(x for x in SPECS if x['id'] == sid)
    co = json.load(open(HERE + 'coords/%s.json' % sid, encoding='utf8'))
    colours = co.get('colours', {}); where, where_vi = PLACE[sid]   # (không đặt tên là 'place' vì trùng hàm place() của sethelp)
    hot = {}
    def hrect(key, label):
        if key not in co['hot']: raise SystemExit('thiếu toạ độ hot["%s"] trong coords/%s.json' % (key, sid))
        x, y, w, h = co['hot'][key]; hot[key] = R(x, y, w, h, label)
    hrect(s['ex'][0], s['ex'][1])
    for f in s['finds']: hrect(f[0], f[1])
    cl = s['cluster']; hrect(cl[0], cl[1]); ac = s['actor']; hrect(ac[0], ac[1]); tm = s['tellme']; hrect(tm[0], tm[1])
    zones, zinfo = {}, []
    for (zk, prep, anchor, anchor_vi) in s['zones']:
        if zk not in co['zones']: raise SystemExit('thiếu toạ độ zones["%s"] trong coords/%s.json' % (zk, sid))
        v = co['zones'][zk]; x, y, w, h = v[:4]; at = v[4:6] if len(v) >= 6 else None
        zones[zk] = Z(x, y, w, h, '%s %s' % (prep, anchor), at); zinfo.append((zk, prep, anchor, anchor_vi))
    cards = {c['key']: card(sid, c['key'], c['word'], ("They're %s." % c['word']) if is_pl(c) else ("It's %s." % art(c) if c['art'] != 'mass' else "It's %s." % c['word'])) for c in s['cards']}
    byk = {c['key']: c for c in s['cards']}
    order = [c['key'] for c in s['cards']]; order = order[3:] + order[:3]
    finds = []
    for (k, label, pl, vi) in s['finds']:
        say, back = ('Where are the %s?' % label, 'Are these the %s?' % label) if pl else ("Where's the %s?" % label, 'Is this the %s?' % label)
        finds.append(find(say, k, back, '%s ở đâu?' % cap(vi), ['Look at the picture. %s' % say, back]))
    steps = []
    for i, ck in enumerate([s['card1'], s['card2']]):
        c = byk[ck]; sayp, backp = pick_say(c); zk, prep, anchor, anchor_vi = zinfo[1 if i == 0 else 2]
        pk = pick(sayp, backp, 'Thẻ nào là %s?' % card_vi(c), ['Look at the cards. ' + sayp, backp])
        if i == 0:
            say = 'Now you put %s %s %s.' % ('the ' + c['word'], prep, anchor)
        else:
            say = 'Put %s %s %s.' % ('the ' + c['word'], prep, anchor)
        place_hint = ["Look at %s. Where's %s?" % (anchor, anchor), "Where's %s? %s %s." % (anchor, cap(prep), anchor)]
        vi_say = ('Bây giờ em đặt %s %s %s.' if i == 0 else 'Đặt %s %s %s.') % (card_vi(c), PREP_VI[prep], anchor_vi)
        pc = place(say, zk, "Where's %s? %s %s." % (anchor, cap(prep), anchor), vi_say, place_hint)
        if i == 0:
            zd = zinfo[0]
            dm = demo("I'm putting %s %s %s." % ('the ' + c['word'], zd[1], zd[2]), zd[0], 'Cô đặt %s %s %s.' % (card_vi(c), PREP_VI[zd[1]], zd[3]))
            steps.append(step(ck, pk, pc, dm))
        else:
            steps.append(step(ck, pk, pc))
    p1 = {'hello': HELLO, 'intro': {'say': 'Look at this. This is %s.' % where, 'vi': 'Nhìn này. Đây là %s.' % where_vi},
          'example': {'say': "Here's the %s." % s['ex'][1], 'target': s['ex'][0], 'vi': 'Đây là %s. (cô chỉ vào tranh)' % s['ex'][2]},
          'find': finds, 'tableSay': {'say': 'Now look at these.', 'vi': 'Bây giờ nhìn những thẻ này nhé.'}, 'order': order, 'cardSteps': steps}
    # ---- Part 2
    ck, noun, sing, colour, n, vi_noun = cl
    alt = CL_ALT.get(noun, 'toys')
    a, b = (NUM[n - 1], NUM[n]) if n > 1 else ('two', 'one')
    p2_ = [Q('Now, (name), what are these?', 'Đây là những gì?', [cap(noun)], 'Are they %s?' % noun, ['Are they %s?' % noun, 'Are they %s or %s?' % (noun, alt)], point=ck),
           Q('What colour are they?', 'Chúng màu gì?', [cap(colour)], 'Are they %s?' % colour, ['Are they %s?' % colour, 'Are they %s or %s?' % (colour, other_colour(colour))], point=ck),
           Q('How many %s are there?' % noun, 'Có bao nhiêu %s?' % vi_noun, [cap(b)], 'Are there %s? %s?' % (a, cap(b)), ['Are there %s? %s?' % (a, cap(b)), 'Are there %s or %s?' % (a, b)], point=ck)]
    pr = PRON[ac[1]]; who = ac[1]
    p2_.append(Q("What's the %s doing?" % who, ac[5], [ac[3]], 'Is %s %s?' % (pr, ac[2]), ['Is %s %s?' % (pr, ac[2]), 'Is %s %s or %s?' % (pr, ac[2], ac[4])], point=ac[0]))
    segs = [t.replace(' (', ' ').replace(')', '') for t in tm[3].split(' / ')]
    p2_.append(Q('Tell me about this %s.' % tm[1], tm[4], tm[2], tm[3], segs, point=tm[0]))
    # ---- Part 3 / 4
    p3_ = [p3_cards(s, ck3, colours) for ck3 in s['p3']]
    p4_ = []
    for i, (say, vi, ans, back, hints) in enumerate(s['p4']):
        if i == 0: say = 'Now, (name), ' + say[0].lower() + say[1:]
        p4_.append(Q(say, vi, ans, back, hints, free=True))
    return {'id': sid, 'no': s['no'], 'group': 'ai', 'origin': 'claude', 'title': 'Extra %d' % (s['no'] - 30), 'theme': s['theme'], 'themeVi': s['themeVi'],
            'src': 'Bộ do Claude soạn: tranh và thẻ tạo bằng ChatGPT, kịch bản soạn theo khung các bộ trong sách (không phải đề của sách)',
            'scene': {'img': 'img/%s/scene.webp' % sid, 'alt': '%s: %s' % (s['theme'], '; '.join(o.split(',')[0] for o in s['objs'][:4]))},
            'hot': hot, 'zones': zones, 'cards': cards, 'p1': p1, 'p2': p2_, 'p3': p3_, 'p4': p4_,
            'bye': {'say': 'OK. Thank you, (name). Goodbye.', 'vi': 'Được rồi. Cảm ơn em. Tạm biệt!'}}

if __name__ == '__main__':
    sid = sys.argv[1]
    d = load(); add(d, build(sid)); save(d)
    print('Đã thêm bộ', sid, '- tổng', len(d['sets']), 'bộ. Chạy: python3 _work/check_sets.py', sid)
