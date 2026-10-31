# Bộ công cụ soạn unit ngữ pháp: viết gọn → sinh dữ liệu cho data.json (có kiểm tra tự động).
import json, os, random, re
W = os.path.dirname(os.path.abspath(__file__)) + '/'
IMGROOT = W + '../../../../data/wordsets/img/'

def S(s):
    """'{Go|v} {straight on.|obj}' -> [{'t':'Go','c':'v'},...]. Chữ ngoài {} là chữ thường không tô màu."""
    out = []
    for m in re.finditer(r'\{([^|}]*)\|([a-z]*)\}|([^{}]+)', s):
        if m.group(3) is not None:
            if m.group(3).strip(): out.append({'t': m.group(3).strip(), 'c': None})
        else: out.append({'t': m.group(1), 'c': m.group(2) or None})
    return out

def V(w, n=1, no=False, q=False, x=False):
    d = {'t': 'vocab', 'w': w, 'n': n, 'no': no, 'q': q}
    if x: d['x'] = True          # dấu ✘ nhỏ dưới hình (ví dụ câu phủ định)
    return d
def X(w): return V(w, x=True)
def SG(v): return {'t': 'sign', 'v': v}
def EM(e): return {'t': 'emo', 'e': e}

def P(parts): return [{'t': t, 'c': c, 's': sub} for t, c, sub in parts]
def pattern(title, color, parts, exs):
    return {'k': 'pattern', 'title': title, 'color': color, 'parts': P(parts),
            'exs': [dict(c=S(e[0]), vi=e[1], art=(e[2] if len(e) > 2 else None)) for e in exs]}
def when(title, items): return {'k': 'when', 'title': title, 'items': [dict(icon=i, t=t, ex=ex, vi=vi) for i, t, ex, vi in items]}
def table(title, head, rows, tint, big0=False, note=None):
    d = {'k': 'table', 'title': title, 'head': head, 'rows': rows, 'tint': tint}
    if big0: d['big0'] = True
    if note: d['note'] = note
    return d
def grid(title, items): return {'k': 'grid', 'title': title, 'items': [dict(en=en, vi=vi, tip=tip, **({'art': i} if isinstance(i, dict) else {'icon': i})) for i, en, vi, tip in items]}
def three(title, items):
    """3 thẻ giới thiệu gọn: items = (icon, tiêu đề, màu, câu có [[từ nhấn]], nghĩa)"""
    return {'k': 'three', 'title': title, 'items': [dict(icon=i, head=h_, c=c, s=sn, vi=vi) for i, h_, c, sn, vi in items]}
def join(title, items, note=None):
    """ghép 2 câu đơn thành 1 câu: item = ((a_en,a_vi),(b_en,b_vi), từ nối, câu ghép có [[từ nối]], nghĩa, art?)"""
    d = {'k': 'join', 'title': title, 'items': [dict(a=a, b=b, conn=cn, out=o, vi=vi, **({'art': art[0]} if art else {})) for a, b, cn, o, vi, *art in items]}
    if note: d['note'] = note
    return d
def compare(title, items): return {'k': 'compare', 'title': title, 'items': items}
def CI(en, c, vi, use, exs, art=None):
    d = {'en': en, 'c': c, 'vi': vi, 'use': use, 'exs': exs}
    if art: d['art'] = art
    return d
def cards(title, items): return {'k': 'cards', 'title': title, 'items': [dict(art=a, en=en, vi=vi) for a, en, vi in items]}
def dialog(title, ask, rounds):
    return {'k': 'dialog', 'title': title, 'askFormula': S(ask),
            'rounds': [dict(q=S(q), a=S(a), qvi=qvi, avi=avi, **({'art': art} if art else {})) for q, a, qvi, avi, art in rounds]}
def tip(t): return {'k': 'tip2', 't': t}
def mistakes(items): return {'k': 'mistakes', 'items': [dict(bad=b, good=g, why=w) for b, g, w in items]}
def acts(*ids): return {'k': 'acts', 'items': list(ids)}

def _shuf(opts, key):
    o = list(opts); random.Random(key).shuffle(o); return o
def Mc(q, right, w1, w2, why, art=None, hint=None, lv=None, fmt=None, pre=None, post=None):
    opts = _shuf([right, w1, w2], q + right)
    d = {'t': 'mcq', 'q': q, 'opts': opts, 'a': opts.index(right), 'why': why}
    if art: d['art'] = art
    if hint: d['hint'] = hint
    if pre: d['pre'] = pre
    if post: d['post'] = post
    if lv: d['lv'] = lv
    if fmt: d['fmt'] = fmt
    return d
def Fl(q, ans, bank, why, art=None, hint=None, lv=None, fmt=None):
    ans = ans if isinstance(ans, list) else [ans]
    d = {'t': 'fill', 'q': q, 'ans': ans, 'bank': _shuf(bank, q), 'why': why}
    if art: d['art'] = art
    if hint: d['hint'] = hint
    if lv: d['lv'] = lv
    if fmt: d['fmt'] = fmt
    return d
def Dlg(pre, q, right, w1, w2, why, art=None): return Mc(q, right, w1, w2, why, art=art, pre=pre, lv='m', fmt='dlg')
def Clz(pre, q, right, w1, w2, why, art=None): return Mc(q, right, w1, w2, why, art=art, pre=pre, lv='h', fmt='cloze')

def slot(id, title, instr, slots, chips): return {'id': id, 'mode': 'slot', 'title': title, 'instr': instr, 'slots': slots, 'chips': chips}
def bucket(id, title, instr, buckets, chips): return {'id': id, 'mode': 'bucket', 'title': title, 'instr': instr, 'buckets': buckets, 'chips': chips}
def Sl(id, text, ans, art=None, hint=None):
    d = {'id': id, 'text': text, 'ans': ans}
    if art: d['art'] = art
    if hint: d['hint'] = hint
    return d

def lesson(id, color, icon, title, vi, say, blocks, practice, extras):
    assert len(practice) == 20, (title, len(practice))
    nm = sum(1 for q in practice if q['t'] == 'mcq')
    assert nm == 10, (title, 'mcq', nm)
    return {'id': id, 'color': color, 'icon': icon, 'title': title, 'vi': vi, 'say': say, 'blocks': blocks, 'practice': practice, 'extras': extras}

def tag_level(q):
    """mức độ + kiểu bài cho kho trộn (giống nhau cho practice và quiz)"""
    c = json.loads(json.dumps(q))
    if c['t'] == 'mcq': c['fmt'] = c.get('fmt') or ('look' if c.get('art') else 'read'); c['lv'] = c.get('lv') or ('e' if c.get('art') else 'm')
    else: c['fmt'] = c.get('fmt') or 'fill'; c['lv'] = c.get('lv') or ('m' if (c.get('art') or c.get('hint')) else 'h')
    return c

def make_quiz(lessons):
    """Luyện tập tổng hợp của unit: 10 trắc nghiệm + 10 điền từ, xoay vòng đều các điểm ngữ pháp, xen kẽ hai dạng."""
    parts = {}
    for kind in ('mcq', 'fill'):
        pools = [[q for q in l['practice'] if q['t'] == kind] for l in lessons]
        out, used, r = [], set(), 0
        while len(out) < 10 and r < 40:
            for k, pool in enumerate(pools):
                if len(out) >= 10 or not pool: continue
                for t in range(len(pool)):
                    q = pool[(r * 3 + k + t) % len(pool)]
                    if q['q'] not in used:
                        used.add(q['q']); c = tag_level(q); c['topic'] = lessons[k]['title']; out.append(c); break
            r += 1
        parts[kind] = out
    quiz = []
    for m, f in zip(parts['mcq'], parts['fill']): quiz += [m, f]
    return quiz

def build_unit(no, id_, title, vi, emoji, vocabDir, lessons, acts_):
    import fixes
    u = {'id': id_, 'no': no, 'title': title, 'vi': vi, 'emoji': emoji, 'vocabDir': vocabDir,
         'src': 'Get Ready for Flyers · Unit %d (chủ điểm ngữ pháp do cô Thảo cung cấp)' % no, 'lessons': [], 'acts': {a['id']: a for a in acts_}}
    mix = []
    for l in lessons:
        extras = l.pop('extras')
        fixes.apply(no, l['practice']); fixes.apply(no, extras)
        for q in l['practice']:
            c = tag_level(q); c['topic'] = l['title']; mix.append(c)
        for q in extras:
            c = json.loads(json.dumps(q)); c['topic'] = l['title']; mix.append(c)
        u['lessons'].append(l)
    u['quiz'] = make_quiz(u['lessons'])
    u['mix'] = mix
    validate(u)
    return u

def validate(u):
    errs = []
    def chk(q, where):
        if q['t'] == 'mcq':
            if len(set(q['opts'])) != 3: errs.append((where, 'đáp án trùng', q['q']))
            if q['opts'][q['a']] is None: errs.append((where, 'a', q['q']))
        else:
            if not any(a in q['bank'] or a.lower() in [b.lower() for b in q['bank']] for a in q['ans']): errs.append((where, 'đáp án không có trong bank', q['q'], q['ans'], q['bank']))
        if q['t'] == 'fill' and q['q'].count('___') != 1: errs.append((where, 'cần đúng 1 chỗ trống', q['q']))
        if q['t'] == 'mcq' and q['q'].count('___') > 1: errs.append((where, '>1 chỗ trống', q['q']))
        a = q.get('art')
        if a and a.get('t') == 'vocab':
            f = IMGROOT + u['vocabDir'] + '/' + a['w'] + '.webp'
            if not os.path.exists(f): errs.append((where, 'thiếu ảnh', f))
    for l in u['lessons']:
        for q in l['practice']: chk(q, l['title'])
        for b in l['blocks']:
            for k in ('exs', 'rounds'):
                for e in b.get(k, []):
                    a = e.get('art')
                    if a and a.get('t') == 'vocab' and not os.path.exists(IMGROOT + u['vocabDir'] + '/' + a['w'] + '.webp'): errs.append((l['title'], 'thiếu ảnh khối', a['w']))
            for it in b.get('items', []):
                a = it.get('art') if isinstance(it, dict) else None
                if a and a.get('t') == 'vocab' and not os.path.exists(IMGROOT + u['vocabDir'] + '/' + a['w'] + '.webp'): errs.append((l['title'], 'thiếu ảnh', a['w']))
    for q in u['mix']: chk(q, 'mix')
    for k, a in u['acts'].items():
        for sl in a.get('slots', []):
            if sl.get('art', {}).get('t') == 'vocab' and not os.path.exists(IMGROOT + u['vocabDir'] + '/' + sl['art']['w'] + '.webp'): errs.append((k, 'thiếu ảnh', sl['art']['w']))
        for c in a['chips']:
            ca = c.get('art') if isinstance(c, dict) else None
            if ca and ca.get('t') == 'vocab' and not os.path.exists(IMGROOT + u['vocabDir'] + '/' + ca['w'] + '.webp'): errs.append((k, 'thiếu ảnh', ca['w']))
    if errs:
        for e in errs: print('LỖI', e)
        raise SystemExit('Dữ liệu unit %d có lỗi' % u['no'])

def save_unit(u):
    import enfix; enfix.fix_unit(u)
    d = json.load(open(W + 'data.json', encoding='utf8'))
    d['units'] = [x for x in d['units'] if x['no'] != u['no']] + [u]
    d['units'].sort(key=lambda x: x['no'])
    for m in d['meta']: m['ready'] = any(x['no'] == m['no'] for x in d['units'])
    open(W + 'data.json', 'w', encoding='utf8').write(json.dumps(d, ensure_ascii=False, indent=1))
    import collections
    c = collections.Counter(q['lv'] for q in u['mix'] + u['quiz'])
    print('Unit %d: %d bài, luyện tập %s, kho trộn %d câu %s, tổng hợp %d' % (u['no'], len(u['lessons']), [len(l['practice']) for l in u['lessons']], len(u['mix']), dict(c), len(u['quiz'])))
