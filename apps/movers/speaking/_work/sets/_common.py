import os, json
def crop_info(sid):
    p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '_crop', sid + '.json')
    d = json.load(open(p)) if os.path.exists(p) else {}
    if d.get('p2box'):                        # khung tranh 1 kèm chữ tên nhân vật bên phải: nới rộng thêm
        b = d['p2box'][0]; b[2] = round(min(1 - b[0], b[2] + 0.07), 4)
    return d

def S2(sid, n, group, name, src, title, p1, dif, p2, story, p3, p4, hints, note=None, p2c=None, draft=False, origin=None):
    """Bộ gọn. p1=(example,[(ex,cand,back)..]); dif=[(b,[ex,cand],b2?)..]; p2=(title,intro,[(n,say,back)..]);
    p3=(intro,[(odd,say,back[,names])..]); p4=(intro,[(q,a,back)..]); hints={'p1','p2','p3','p4'}"""
    out = {
        'id': sid, 'no': n, 'group': group, 't': int(sid.split('-t')[-1]), 'name': name, 'src': src, 'title': title,
        'teacher': {
            'p1': {'example': p1[0], 'items': [{'ex': a, 'cand': b, 'back': c} for a, b, c in p1[1]]},
            'p2': {'title': p2[0], 'intro': p2[1], 'pics': [{'n': k, 'say': s, 'back': b} for k, s, b in p2[2]]},
            'p3': {'intro': p3[0], 'sets': [dict({'n': i + 1, 'odd': x[0], 'say': x[1], 'back': x[2]}, **({'names': x[3]} if len(x) > 3 else {})) for i, x in enumerate(p3[1])]},
        },
        'p4': {'intro': p4[0], 'qs': [{'q': q, 'a': a, 'back': b} for q, a, b in p4[1]]},
        'dif': [{'b': d[0], 'w': d[1], **({'b2': d[2]} if len(d) > 2 else {})} for d in dif],
        'story': story, 'hints': hints,
    }
    if p2c: out['p2c'] = [{'s': a, 'l': b, 'v': c, 'f': d} for a, b, c, d in p2c]
    if note: out['note'] = note
    if draft: out['p4']['draft'] = True
    if origin: out['origin'] = origin
    out.update(crop_info(sid))
    return out
