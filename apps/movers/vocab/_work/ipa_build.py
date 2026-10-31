# -*- coding: utf-8 -*-
"""Tạo IPA Anh-Anh cho từ vựng Movers.
Nguồn: open-dict-data/ipa-dict (en_UK, kiểu espeak) -> chuyển về kiểu từ điển Cambridge/Flyers
(dấu nhấn đặt đầu âm tiết, ɹ->r, ɐ->ə, ɛ->e). Từ thiếu trong nguồn / cụm từ: bảng tay IPA_FIX bên dưới.
Chạy: python3 ipa_build.py  -> ipa_movers.json  (+ in bảng để cô duyệt)"""
import re, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
sys.path.insert(0, HERE)
import vocab_data as V
DICT = os.environ.get('IPA_DICT', '/home/claude/work/ipa/en_UK.txt')
VOW = set('æɑɒɔəɛɜɪʊʌeiuaɐoː')
ONS2 = set('pl bl kl gl fl sl pr br tr dr kr gr fr θr ʃr tw kw gw sw sp st sk sm sn pj bj tj dj kj gj fj vj θj sj hj mj nj lj stj spj skj tʃ dʒ'.split())
def split_ph(s): return list(s)
def is_onset(c):
    if len(c) == 1: return c != 'ŋ'
    if c in ONS2: return True
    if len(c) == 3 and c[0] == 's' and c[1] in 'ptk' and c[2] in 'lrwj': return True
    return False
def move_stress(p):
    out = list(p); i = 0
    while i < len(out):
        if out[i] in 'ˈˌ':
            mark = out.pop(i); j = i
            while j > 0 and out[j - 1] not in VOW and out[j - 1] not in 'ˈˌ ': j -= 1     # cụm phụ âm trước nguyên âm
            cl = ''.join(out[j:i]); k = 0
            while k < len(cl) and not is_onset(cl[k:]): k += 1                              # onset hợp lệ dài nhất
            out.insert(j + k, mark); i = j + k + 1
        else: i += 1
    return ''.join(out)
def nuclei(p): return len(re.findall('[' + ''.join(VOW - set('ː')) + ']+', p))
def conv(p):
    p = p.replace('ɹ', 'r').replace('ɐ', 'ə').replace('ɛ', 'e').replace('ɡ', 'g')
    p = move_stress(p).replace('iə', 'ɪə')
    return p
D = {}
for l in open(DICT, encoding='utf8'):
    w, p = l.rstrip('\n').split('\t'); D.setdefault(w, p.split(', ')[0].strip('/'))
# Bảng tay: từ thiếu trong nguồn và cụm từ (kiểu Cambridge). Cô sẽ duyệt cả bảng.
IPA_FIX = {
 'email': 'ˈiːmeɪl', 'CD': 'ˌsiː ˈdiː', 'DVD': 'ˌdiː viː ˈdiː', 'Monday': 'ˈmʌndeɪ', 'Tuesday': 'ˈtjuːzdeɪ', 'Wednesday': 'ˈwenzdeɪ',
 'Thursday': 'ˈθɜːzdeɪ', 'Friday': 'ˈfraɪdeɪ', 'Saturday': 'ˈsætədeɪ', 'Sunday': 'ˈsʌndeɪ', 'café': 'ˈkæfeɪ', 'present': 'ˈprezənt',
 'app': 'æp', 'shower': 'ˈʃaʊə', 'downstairs': 'ˌdaʊnˈsteəz', 'upstairs': 'ˌʌpˈsteəz', 'inside': 'ˌɪnˈsaɪd', 'outside': 'ˌaʊtˈsaɪd',
 'wind': 'wɪnd', 'windy': 'ˈwɪndi', 'river': 'ˈrɪvə', 'stomach-ache': 'ˈstʌməkeɪk', 'earache': 'ˈɪəreɪk', 'headache': 'ˈhedeɪk',
 'toothache': 'ˈtuːθeɪk', 'T-shirt': 'ˈtiː ʃɜːt', 'e-book': 'ˈiː bʊk', 'roller skate': 'ˈrəʊlə skeɪt', 'map of the world': 'ˈmæp əv ðə ˈwɜːld',
 'film / movie': 'fɪlm / ˈmuːvi', 'lift / elevator': 'lɪft / ˈelɪveɪtə', '(swimming) pool': '(ˈswɪmɪŋ) puːl', 'foot / feet': 'fʊt / fiːt',
 'teeth / tooth': 'tiːθ / tuːθ', 'leaf / leaves': 'liːf / liːvz', 'bus station': 'ˈbʌs ˌsteɪʃən', 'bus stop': 'ˈbʌs stɒp', 'car park': 'ˈkɑː pɑːk',
 'shopping centre': 'ˈʃɒpɪŋ ˌsentə', 'sports centre': 'ˈspɔːts ˌsentə', 'comic book': 'ˈkɒmɪk bʊk', 'ice skates': 'ˈaɪs skeɪts',
 'train driver': 'ˈtreɪn ˌdraɪvə', 'curly hair': 'ˌkɜːli ˈheə', 'fair hair': 'ˌfeə ˈheə', 'straight hair': 'ˌstreɪt ˈheə', 'grown-up': 'ˈgrəʊn ʌp',
 'swimsuit': 'ˈswɪmsuːt', 'basketball': 'ˈbɑːskɪtbɔːl', 'milkshake': 'ˈmɪlkʃeɪk', 'lemonade': 'ˌlemə ˈneɪd', 'broccoli': 'ˈbrɒkəli',
}
IPA_FIX.update({
 'lion': 'ˈlaɪən',
 'drawing': 'ˈdrɔːɪŋ', 'kangaroo': 'ˌkæŋgəˈruː', 'trousers': 'ˈtraʊzəz', 'lemonade': 'ˌleməˈneɪd', 'car park': 'ˈkɑː ˌpɑːk',
 'bus stop': 'ˈbʌs ˌstɒp', 'comic book': 'ˈkɒmɪk ˌbʊk', 'ice skates': 'ˈaɪs ˌskeɪts', 'T-shirt': 'ˈtiː ˌʃɜːt', 'e-book': 'ˈiː ˌbʊk',
 'roller skate': 'ˈrəʊlə ˌskeɪt', 'grown-up': 'ˈgrəʊn ˌʌp', 'map of the world': 'ˌmæp əv ðə ˈwɜːld', '(swimming) pool': '(ˌswɪmɪŋ) ˈpuːl',
 'grandson': 'ˈgrænsʌn', 'grandparent': 'ˈgrænˌpeərənt', 'granddaughter': 'ˈgrænˌdɔːtə', 'temperature': 'ˈtemprətʃə', 'pasta': 'ˈpæstə',
 'sandwich': 'ˈsænwɪdʒ', 'vegetables': 'ˈvedʒtəbəlz', 'shopping centre': 'ˈʃɒpɪŋ ˌsentə'})
def ipa_for(w):
    if w in IPA_FIX: return IPA_FIX[w]
    parts = [t for t in re.split(r"[^A-Za-z'é]+", w) if t]
    res = []
    for t in parts:
        k = t.lower()
        if k not in D: return None
        c = conv(D[k])
        if len(parts) == 1 and nuclei(D[k]) == 1: c = c.replace('ˈ', '').replace('ˌ', '')
        res.append(c)
    return ' '.join(res)
def main():
    out = {}; miss = []
    for u in V.U:
        for it in u['items']:
            w = it[0]; p = ipa_for(w)
            if p is None: miss.append(w)
            else: out[w] = p
    json.dump(out, open(HERE + 'ipa_movers.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    print(len(out), 'có IPA; thiếu:', miss)
    for u in V.U:
        print('\n== Unit %d %s' % (u['n'], u['title']))
        print('  '.join('%s /%s/' % (it[0], out.get(it[0], '???')) for it in u['items']))
if __name__ == '__main__': main()
