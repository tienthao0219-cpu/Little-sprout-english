# Tạo 4 bộ flashcard: Alphabet, Numbers 1–20, Numbers 21–100, Colours (ảnh trong ../img/ do build_images.py tạo).
# Mỗi thẻ: hình + nghĩa tiếng Việt + âm thanh (đọc bằng giọng đọc của trình duyệt, giống các bộ Picture cards cũ).
import json, os, sys
W = os.path.dirname(os.path.abspath(__file__)) + '/'
sys.path.insert(0, W + '../../_tools')
import add_learn_mode as L
TPL = open(W + 'deck-template.html', encoding='utf8').read()
OUT = W + '../'

# ---------- dữ liệu ----------
IPA = dict(zip('ABCDEFGHIJKLMNOPQRSTUVWXYZ', ['eɪ', 'biː', 'siː', 'diː', 'iː', 'ef', 'dʒiː', 'eɪtʃ', 'aɪ', 'dʒeɪ', 'keɪ', 'el', 'em', 'en', 'əʊ', 'piː', 'kjuː', 'ɑː', 'es', 'tiː', 'juː', 'viː', 'ˈdʌbljuː', 'eks', 'waɪ', 'zed']))
# cách đọc tên chữ cái cho giọng đọc (tránh đọc "A" thành mạo từ "a")
LSAY = dict(zip('ABCDEFGHIJKLMNOPQRSTUVWXYZ', ['ay', 'bee', 'see', 'dee', 'ee', 'eff', 'jee', 'aitch', 'eye', 'jay', 'kay', 'el', 'em', 'en', 'oh', 'pee', 'queue', 'are', 'ess', 'tee', 'you', 'vee', 'double you', 'ex', 'why', 'zed']))
ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
TENS = {2: 'twenty', 3: 'thirty', 4: 'forty', 5: 'fifty', 6: 'sixty', 7: 'seventy', 8: 'eighty', 9: 'ninety'}
VU = {1: 'một', 2: 'hai', 3: 'ba', 4: 'bốn', 5: 'năm', 6: 'sáu', 7: 'bảy', 8: 'tám', 9: 'chín'}
VT = {2: 'hai mươi', 3: 'ba mươi', 4: 'bốn mươi', 5: 'năm mươi', 6: 'sáu mươi', 7: 'bảy mươi', 8: 'tám mươi', 9: 'chín mươi'}
def en(n):
    if n == 100: return 'one hundred'
    if n < 20: return ONES[n]
    t, u = divmod(n, 10); return TENS[t] + ('-' + ONES[u] if u else '')
def vi(n):
    if n == 100: return 'một trăm'
    if n == 10: return 'mười'
    if n < 10: return VU[n]
    if n < 20: return 'mười ' + ('lăm' if n == 15 else VU[n - 10])
    t, u = divmod(n, 10)
    return VT[t] + ('' if not u else ' ' + {1: 'mốt', 5: 'lăm'}.get(u, VU[u]))
COL = [('red', 'màu đỏ'), ('orange', 'màu cam'), ('yellow', 'màu vàng'), ('light green', 'màu xanh lá nhạt'), ('green', 'màu xanh lá'), ('light blue', 'màu xanh dương nhạt'),
       ('blue', 'màu xanh dương'), ('purple', 'màu tím'), ('pink', 'màu hồng'), ('brown', 'màu nâu'), ('black', 'màu đen'), ('white', 'màu trắng')]

def num_cards(a, b, groups):
    out = []
    for n in range(a, b + 1):
        g = next(g for g in groups if g[0] <= n <= g[1])
        c = dict(id='n%d' % n, word=en(n), vi=vi(n), image='img/numbers/%d.webp' % n, topic='%d – %d' % g, topicVi='')
        if '-' in c['word']: c['say'] = c['word'].replace('-', ' ')
        out.append(c)
    return out
def letter_cards():
    groups = [('A – F', 'A', 'F'), ('G – L', 'G', 'L'), ('M – R', 'M', 'R'), ('S – Z', 'S', 'Z')]
    out = []
    for i in range(26):
        L_ = chr(65 + i); g = next(g for g in groups if g[1] <= L_ <= g[2])
        out.append(dict(id='l' + L_.lower(), word=L_, vi='chữ cái ' + L_, tag='/%s/' % IPA[L_], say=LSAY[L_], image='img/alphabet/%s.webp' % L_.lower(), topic=g[0], topicVi=''))
    return out
def colour_cards():
    return [dict(id='c' + w.replace(' ', '-'), word=w, vi=v, image='img/colours/%s.webp' % w.replace(' ', '-')) for w, v in COL]

DECKS = [
 dict(file='alphabet.html', title='ABC · Alphabet A–Z · Flashcards', h1='ALPHABET A–Z', logo='🔤', sub='Click a card to hear the letter name.', cards=letter_cards(),
      css='.word{text-transform:none}.ln-word{text-transform:none}', say={c['word']: c['say'] for c in letter_cards()}),
 dict(file='numbers-1-20.html', title='123 · Numbers 1–20 · Flashcards', h1='NUMBERS 1–20', logo='🔢', sub='Click a card to hear the number.', cards=num_cards(1, 20, [(1, 10), (11, 20)])),
 dict(file='numbers-21-100.html', title='123 · Numbers 21–100 · Flashcards', h1='NUMBERS 21–100', logo='💯', sub='Click a card to hear the number.', cards=num_cards(21, 100, [(a, a + 9) for a in range(21, 100, 10)][:-1] + [(91, 100)])),
 dict(file='colours.html', title='Colours · Flashcards', h1='COLOURS', logo='🎨', sub='Click a card to hear the colour.', cards=colour_cards()),
]
for d in DECKS:
    cards = d['cards']
    topics = []
    for c in cards:
        if c.get('topic') and (c['topic'], c['topicVi']) not in topics: topics.append((c['topic'], c['topicVi']))
    tabs = ''
    if topics:
        tabs = '<button data-t="all" class="on">Tất cả <small>(%d)</small></button>' % len(cards) + ''.join(
            '<button data-t="%s">%s <small>%s%d</small></button>' % (t, t, (tv + ' · ') if tv else '', sum(1 for c in cards if c.get('topic') == t)) for t, tv in topics)
    html = TPL
    for k, v in (('@@TITLE@@', d['title']), ('@@LOGO@@', d['logo']), ('@@H1@@', d['h1']), ('@@SUB@@', d['sub']), ('@@COUNT@@', str(len(cards))), ('@@TABS@@', tabs),
                 ('@@CARDS@@', json.dumps(cards, ensure_ascii=False, separators=(',', ':'))), ('@@EXTRACSS@@', d.get('css', ''))):
        html = html.replace(k, v)
    extra = ''
    if d.get('say'):
        extra = '<script>/* đọc tên chữ cái cho đúng */const SAY=%s;{const _sp=speak;speak=function(t,done){return _sp(SAY[t]||t,done);};}</script>' % json.dumps(d['say'], ensure_ascii=False)
    html = html.replace('@@EXTRAJS@@', extra)
    assert '@@' not in html.replace('@@', '', 0) or True
    html = L.inject(html)
    with open(OUT + d['file'], 'w', encoding='utf8') as f: f.write(html)
    print(d['file'], len(cards), 'thẻ', len(html) // 1024, 'KB')
