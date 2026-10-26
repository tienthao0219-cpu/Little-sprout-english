"""Kiểm thử app Starters Speaking bằng Playwright (chạy từ thư mục _work).
   Cần: python3 -m http.server 8765 chạy ở thư mục gốc của repo.   python3 pwtest.py [--shots]
   Chạy trọn vẹn 1 bộ (4 Part) ở laptop / iPad / điện thoại và kiểm tra: không lỗi console, không tràn ngang,
   nút ≥ 44px, chạm đúng/sai, kéo thả thẻ, lật thẻ, sao + sticker được lưu, chế độ cô, chế độ học viên."""
import json, sys
from playwright.sync_api import sync_playwright
URL = 'http://localhost:8765/apps/starters/speaking/speaking.html'
D = json.load(open('data.json', encoding='utf8'))
S = D['sets'][0]
VP = {'laptop': dict(width=1366, height=768), 'ipad': dict(width=820, height=1180), 'phone': dict(width=390, height=844)}
SHOTS = '--shots' in sys.argv
res = []
def ok(name, cond, info=''):
    res.append((name, bool(cond), info))
    if not cond: print('FAIL', name, info)

def scene_pt(pg, rect, fx=.5, fy=.5):
    b = pg.evaluate("(()=>{const r=document.querySelector('.scene').getBoundingClientRect();return [r.left,r.top,r.width,r.height]})()")
    return b[0] + b[2] * (rect[0] + rect[2] * fx) / 100, b[1] + b[3] * (rect[1] + rect[3] * fy) / 100
def bring(pg, sel):
    pg.evaluate("(s)=>{const e=document.querySelector(s);e&&e.scrollIntoView({block:'center'})}", sel)
def click_scene(pg, rect, fx=.5, fy=.5):
    bring(pg, '.scene'); x, y = scene_pt(pg, rect, fx, fy); pg.mouse.click(x, y); pg.wait_for_timeout(120)
def drag_chip(pg, cid, rect):
    sel = f'.chip[data-id="{cid}"],.placed[data-id="{cid}"]'
    bring(pg, '.scene')
    bb = pg.evaluate("(s)=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}", sel)
    x, y = scene_pt(pg, rect)
    pg.mouse.move(*bb); pg.mouse.down()
    for k in range(1, 9): pg.mouse.move(bb[0] + (x - bb[0]) * k / 8, bb[1] + (y - bb[1]) * k / 8)
    pg.mouse.up(); pg.wait_for_timeout(150)
def primary(pg): pg.evaluate("document.querySelector('.dock .btn.pri,.partdone .btn.pri').click()"); pg.wait_for_timeout(180)
def shot(pg, vn, name):
    if SHOTS: pg.screenshot(path=f'/tmp/shots/flow_{vn}_{name}.png')
def audit(pg, vn, label):
    r = pg.evaluate("""()=>{const out={ov:document.documentElement.scrollWidth>innerWidth+1,small:[]};
      document.querySelectorAll('button,input,[role=button]').forEach(e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);
        if(r.width===0||r.height===0||c.visibility==='hidden'||e.closest('.hidden'))return;
        if(e.classList.contains('chip')||e.closest('.slot'))return;               // thẻ nhỏ trên bàn: kéo/chạm bằng cả thẻ
        if(r.height<44||r.width<44)out.small.push((e.className||e.tagName)+':'+Math.round(r.width)+'x'+Math.round(r.height))});return out}""")
    ok(f'{vn}:{label}:no-h-overflow', not r['ov'])
    ok(f'{vn}:{label}:buttons>=44px', not r['small'], r['small'][:4])

def run(vn):
    with sync_playwright() as p:
        b = p.chromium.launch(); vp = VP[vn]
        ctx = b.new_context(viewport=vp, has_touch=(vn != 'laptop'), is_mobile=(vn == 'phone'))
        pg = ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'TUNNEL' not in m.text and 'ERR_' not in m.text else None)
        pg.goto(URL + '?mute=1'); pg.wait_for_timeout(400)
        audit(pg, vn, 'home'); shot(pg, vn, '00_home')
        ok(f'{vn}:home-tiles', pg.evaluate("document.querySelectorAll('.tile').length") == 1 + len(D['soon']))
        pg.evaluate("__ss.openSet('ptp-t1')"); pg.wait_for_timeout(150); audit(pg, vn, 'intro'); shot(pg, vn, '01_intro')
        pg.evaluate("__ss.startPart(0)"); pg.wait_for_timeout(150)
        # --- Part 1
        ok(f'{vn}:p1-name-input', pg.evaluate("!!document.querySelector('.nameIn')"))
        pg.fill('.nameIn', 'Mai'); shot(pg, vn, '02_name'); primary(pg)               # → intro tranh
        ok(f'{vn}:p1-scene-visible', pg.evaluate("!!document.querySelector('.scene img')"))
        shot(pg, vn, '03_intro'); audit(pg, vn, 'p1-scene'); primary(pg)               # → Here's a cat
        ok(f'{vn}:p1-pointer-ring', pg.evaluate("!!document.querySelector('.ptr')")); shot(pg, vn, '04_cat'); primary(pg)
        # Where is the car? : chạm sai 1 lần rồi chạm đúng
        wrong = [60, 3, 4, 4]; click_scene(pg, wrong)
        ok(f'{vn}:p1-wrong-no-advance', pg.evaluate("__ss.st.i") == 3 and not pg.evaluate("__ss.st.stepDone"))
        click_scene(pg, S['hot']['car']['rect']); ok(f'{vn}:p1-car-correct', pg.evaluate("__ss.st.stepDone")); shot(pg, vn, '05_car_ok'); primary(pg)
        # Where are the children? : 2 lần sai → hiện câu dự phòng
        click_scene(pg, [2, 2, 5, 5]); click_scene(pg, [80, 80, 5, 5])
        ok(f'{vn}:p1-backup-after-2-wrong', pg.evaluate("__ss.st.help") and 'children' in pg.inner_text('.bub').lower()); shot(pg, vn, '06_backup')
        click_scene(pg, S['hot']['children']['rect']); primary(pg)
        # bàn thẻ
        ok(f'{vn}:p1-tray-8', pg.evaluate("document.querySelectorAll('.chip').length") == 8); shot(pg, vn, '07_tray'); audit(pg, vn, 'p1-tray'); primary(pg)
        # chọn sai thẻ rồi đúng
        bring(pg, '.tray'); pg.evaluate("document.querySelector('.chip[data-id=apple]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:5,clientY:5}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:5,clientY:5}))")
        pg.wait_for_timeout(100); ok(f'{vn}:p1-pick-wrong-ignored', not pg.evaluate("__ss.st.stepDone"))
        pg.evaluate("document.querySelector('.chip[data-id=guitar]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:5,clientY:5}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:5,clientY:5}))")
        pg.wait_for_timeout(100); ok(f'{vn}:p1-pick-guitar', pg.evaluate("__ss.st.stepDone")); primary(pg)
        pg.wait_for_timeout(500)
        ok(f'{vn}:p1-demo-guitar-on-bike', pg.evaluate("!!document.querySelector('.placed[data-id=guitar]')")); shot(pg, vn, '08_demo'); primary(pg)
        # đặt thẻ: kéo sai chỗ rồi đúng chỗ
        drag_chip(pg, 'guitar', [3, 3, 4, 4]); ok(f'{vn}:p1-drag-wrong', not pg.evaluate("__ss.st.stepDone"))
        drag_chip(pg, 'guitar', S['zones']['underBirds']['rect']); ok(f'{vn}:p1-drag-guitar-ok', pg.evaluate("__ss.st.stepDone") and abs(pg.evaluate("__ss.st.placed.guitar.x")-(S['zones']['underBirds']['rect'][0]+S['zones']['underBirds']['rect'][2]/2))<.1)
        shot(pg, vn, '09_placed'); primary(pg)
        # goat: pick + place bằng cách chạm (giữ thẻ rồi chạm tranh)
        pg.evaluate("document.querySelector('.chip[data-id=goat]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:5,clientY:5}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:5,clientY:5}))")
        pg.wait_for_timeout(100); primary(pg)
        pg.evaluate("document.querySelector('.chip[data-id=goat]').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:5,clientY:5}));document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,clientX:5,clientY:5}))")
        pg.wait_for_timeout(100); ok(f'{vn}:p1-goat-held', pg.evaluate("__ss.st.held")=='goat')
        click_scene(pg, S['zones']['betweenDogBaby']['rect']); ok(f'{vn}:p1-tap-place-goat', pg.evaluate("__ss.st.stepDone")); primary(pg)
        ok(f'{vn}:p1-partdone', pg.evaluate("__ss.st.view") == 'partdone'); shot(pg, vn, '10_p1done'); audit(pg, vn, 'partdone')
        primary(pg)
        # --- Part 2
        ok(f'{vn}:p2-start', pg.evaluate("__ss.st.part") == 1 and pg.evaluate("Object.keys(__ss.st.placed).length") == 0)
        n2 = len(S['p2'])
        for i in range(n2):
            if i == 0: shot(pg, vn, '11_p2'); audit(pg, vn, 'p2')
            if i == 1:
                pg.evaluate("[...document.querySelectorAll('.dock .btn')].find(b=>b.textContent.includes('chưa hiểu')).click()"); pg.wait_for_timeout(100)
                ok(f'{vn}:p2-backup', S['p2'][1]['back'] in pg.inner_text('.bub'))
                pg.evaluate("[...document.querySelectorAll('.dock .btn')].find(b=>b.textContent.includes('Hỏi lại')).click()")
            primary(pg)
        ok(f'{vn}:p2-partdone', pg.evaluate("__ss.st.view") == 'partdone'); primary(pg)
        # --- Part 3
        ok(f'{vn}:p3-start', pg.evaluate("__ss.st.part") == 2 and pg.evaluate("!!document.querySelector('.fc')")); shot(pg, vn, '12_p3'); audit(pg, vn, 'p3')
        pg.evaluate("document.querySelector('.fc').click()"); pg.wait_for_timeout(700)
        ok(f'{vn}:p3-flip', pg.evaluate("document.querySelector('.fc').classList.contains('flip')") and 'jacket' in pg.inner_text('.face.back').lower()); shot(pg, vn, '13_p3flip')
        n3 = sum(len(c['qs']) for c in S['p3'])
        for i in range(n3): primary(pg); pg.wait_for_timeout(450)
        ok(f'{vn}:p3-partdone', pg.evaluate("__ss.st.view") == 'partdone'); primary(pg)
        # --- Part 4
        ok(f'{vn}:p4-start', pg.evaluate("__ss.st.part") == 3); shot(pg, vn, '14_p4'); audit(pg, vn, 'p4')
        for i in range(len(S['p4']) + 1): primary(pg)
        ok(f'{vn}:reward', pg.evaluate("__ss.st.view") == 'reward'); shot(pg, vn, '15_reward'); audit(pg, vn, 'reward')
        prog = pg.evaluate("__ss.loadProg()")
        ok(f'{vn}:star-saved', 'ptp-t1' in prog['stars'] and len(prog['stk']) == 1, prog)
        pg.evaluate("document.querySelector('.rew .btn.pri').click()"); pg.wait_for_timeout(150)
        ok(f'{vn}:album', pg.evaluate("document.querySelectorAll('.sticker').length") == 12 and pg.evaluate("document.querySelectorAll('.sticker.lock').length") == 11); shot(pg, vn, '16_album'); audit(pg, vn, 'album')
        # chơi lại cùng bộ → không cộng thêm sao
        pg.evaluate("__ss.openSet('ptp-t1');__ss.startPart(3);__ss.st.i=__ss.st.steps.length-1;__ss.nextStep()")
        ok(f'{vn}:replay-no-extra-star', len(pg.evaluate("__ss.loadProg()")['stars']) == 1)
        # --- chế độ cô
        pg.evaluate("__ss.S.teach=true;__ss.openSet('ptp-t1');__ss.startPart(1)"); pg.wait_for_timeout(150)
        ok(f'{vn}:teach-note', pg.evaluate("!!document.querySelector('.tnote')") and 'Flower' in pg.inner_text('.tnote') and 'Claude' in pg.inner_text('.tnote')); shot(pg, vn, '17_teach'); audit(pg, vn, 'teach')
        pg.evaluate("__ss.startPart(2);__ss.st.i=9;__ss.render()")
        ok(f'{vn}:teach-check-ball', 'xác nhận' in pg.inner_text('.tnote'))
        # --- học viên đăng nhập: không có nút Cô
        pg.evaluate("localStorage.setItem('lse_auth_v1',JSON.stringify({name:'Bo',role:'student'}))"); pg.goto(URL + '?mute=1'); pg.wait_for_timeout(300)
        ok(f'{vn}:student-no-teacher-btn', 'Cô:' not in pg.inner_text('.sbar') and 'Hi, Bo' in pg.inner_text('.hero'))
        pg.evaluate("localStorage.removeItem('lse_auth_v1')")
        ok(f'{vn}:no-console-errors', not errs, errs[:3])
        ctx.close(); b.close()

if __name__ == '__main__':
    import os; os.makedirs('/tmp/shots', exist_ok=True)
    for vn in VP: run(vn)
    bad = [r for r in res if not r[1]]
    print('total', len(res), 'failed', len(bad))
    json.dump(res, open('pw_res.json', 'w'))
