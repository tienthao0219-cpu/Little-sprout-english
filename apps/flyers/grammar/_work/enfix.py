# Công thức ưu tiên tiếng Anh: nhãn tiếng Anh trong ô màu, tiếng Việt nhỏ trong ngoặc bên dưới. Chạy lại được (idempotent).
import re, json, os
W = os.path.dirname(os.path.abspath(__file__)) + '/'
VN = re.compile(r'[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]', re.I)
MAP = {'động từ': 'verb', 'nơi chốn': 'place', 'chủ ngữ': 'subject', 'tân ngữ': 'object', 'giới từ': 'preposition', 'cái gì': 'thing', 'cho ai': 'person', 'ai': 'subject',
       'khi nào': 'time', 'điều kiện': 'condition', 'kết quả': 'result', 'từ để hỏi': 'question word', 'danh từ số ít': 'singular noun', 'danh từ số nhiều': 'plural noun',
       'hướng / nơi chốn': 'direction / place', 'cái gì / nơi chốn': 'thing / place', 'cái gì / nơi chốn': 'thing / place', 'số / some': 'number / some', 'danh từ': 'noun',
       'a / an + danh từ số ít': 'a / an + singular noun', 'số / some + danh từ số nhiều': 'number / some + plural noun', 'đồ ăn': 'food', 'hướng': 'direction',
       'cái gì / nơi chốn ': 'thing / place', '+ động từ': '+ verb', 'tân ngữ ': 'object', 'khi nào ': 'time', 'từ để hỏi ': 'question word', 'động từ ': 'verb'}
TITLE = [('Động từ', 'Verb'), ('động từ', 'verb'), ('nơi chốn', 'place'), ('Từ để hỏi', 'Question word'), ('điều kiện', 'condition'), ('kết quả', 'result'), ('đồ ăn', 'food'),
         ('danh từ số ít', 'singular noun'), ('danh từ số nhiều', 'plural noun')]
unmapped = set()
def en_label(t):
    if not VN.search(t): return t, None
    k = t.strip().lower()
    if k in MAP: return MAP[k], t.strip().lower()
    unmapped.add(t); return t, None
def fix_parts(parts):
    for p in parts:
        t, vi = en_label(p['t'])
        s = p.get('s') or ''
        if vi:   # nhãn đã đổi sang tiếng Anh
            p['t'] = t; p['s'] = '(' + vi + ')' + ('\n' + s if s and not s.startswith('(') else '')
        elif s and not s.startswith('(') and VN.search(s):
            p['s'] = '(' + s + ')'
def fix_unit(u):
    for l in u['lessons']:
        for b in l['blocks']:
            if b['k'] == 'pattern':
                fix_parts(b['parts'])
                for a, c in TITLE: b['title'] = b['title'].replace(a, c)
            if b['k'] == 'dialog':
                for c in b['askFormula']:
                    t, _ = en_label(c['t']); c['t'] = t
                for a, c in TITLE: b['title'] = b['title'].replace(a, c)
    return u
if __name__ == '__main__':
    d = json.load(open(W + 'data.json', encoding='utf8'))
    for u in d['units']: fix_unit(u)
    open(W + 'data.json', 'w', encoding='utf8').write(json.dumps(d, ensure_ascii=False, indent=1))
    print('chưa dịch được:', sorted(unmapped))
