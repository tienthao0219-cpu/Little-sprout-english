# Kiểm tra tự động trang ngữ pháp:  python3 -I? không cần;  python3 _work/gtest.py unit-1
# (cần: python3 -m http.server 8765 ở gốc repo + Playwright)
import sys
from playwright.sync_api import sync_playwright
U='http://localhost:8765/apps/flyers/grammar/grammar-%s.html'
unit=sys.argv[1] if len(sys.argv)>1 else 'unit-1'
bad=[];rep=[]
def drag_all(pg):
  """kéo thả bằng chuột thật; nếu chữ và đích không cùng một màn hình thì chạm chữ rồi cuộn và chạm đích"""
  guard=0
  while pg.evaluate("document.querySelectorAll('.act:not(.fin) .bank .chip:not(.placed)').length") and guard<60:
    guard+=1
    pick=pg.evaluate("""(()=>{const act=document.querySelector('.act:not(.fin)');const chip=act.querySelector('.bank .chip:not(.placed)');
      const c=chip._c;const ts=[...act.querySelectorAll('[data-drop]')];
      const t=ts.find(t=>t._s&&(act.querySelector('.bk')?c.g===t.dataset.id:String(t._s.ans).toLowerCase()===String(c.label).toLowerCase())&&!t.classList.contains('done'));
      chip.setAttribute('data-pk','1');t.setAttribute('data-pt','1');chip.scrollIntoView({block:'center'});
      const a=chip.getBoundingClientRect(),b=t.getBoundingClientRect();return {fit:b.top>110&&b.bottom<innerHeight-30&&a.top>110&&a.bottom<innerHeight-30}})()""")
    def rects():
      return pg.evaluate("(()=>{const a=document.querySelector('[data-pk]').getBoundingClientRect(),b=document.querySelector('[data-pt]').getBoundingClientRect();return [a.x+a.width/2,a.y+a.height/2,b.x+b.width/2,b.y+b.height/2]})()")
    r=rects()
    if pick['fit']:
      pg.mouse.move(r[0],r[1]); pg.mouse.down(); pg.mouse.move((r[0]+r[2])/2,(r[1]+r[3])/2,steps=4); pg.mouse.move(r[2],r[3],steps=4); pg.mouse.up()
    else:   # chạm chữ -> cuộn -> chạm đích
      if not pg.evaluate("document.querySelector('[data-pk]').classList.contains('sel')"): pg.mouse.click(r[0],r[1])
      pg.evaluate("document.querySelector('[data-pt]').scrollIntoView({block:'center'})"); r=rects(); pg.mouse.click(r[2],r[3])
    pg.evaluate("document.querySelectorAll('[data-pk],[data-pt]').forEach(e=>{e.removeAttribute('data-pk');e.removeAttribute('data-pt')})"); pg.wait_for_timeout(40)
with sync_playwright() as p:
  b=p.chromium.launch()
  for name,(w,h) in {'phone':(390,844),'ipad':(820,1180),'laptop':(1366,768)}.items():
    ctx=b.new_context(viewport=dict(width=w,height=h),has_touch=False); pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.goto(U%unit); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(500)
    pg.evaluate("window.__m=[];window.LSE_REPORT.answer=(a,b,c,d)=>__m.push(['a',a,c]);window.LSE_REPORT.finish=(s,m)=>__m.push(['f',s,m]);1")
    n=pg.evaluate("U.lessons.length")
    lock=pg.evaluate("[U.lessons.map((_,i)=>lessonOpen(i)),quizOpen()]")
    assert lock[0][0] and not any(lock[0][1:]) and not lock[1],('lock',lock)
    for i in range(n):
      pg.evaluate(f"lessonView({i})"); pg.wait_for_timeout(200)
      disabled=pg.evaluate("document.getElementById('goPractice').disabled")
      overflow=pg.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
      imgs=pg.evaluate("[...document.querySelectorAll('.vart img')].every(i=>i.complete&&i.naturalWidth>0)")
      blocks=pg.evaluate("document.querySelectorAll('.box,.ex').length")
      # nút khoá cho tới khi làm xong luyện nhanh
      drag_all(pg); pg.wait_for_timeout(100)
      acts=pg.evaluate("[document.querySelectorAll('.act').length,document.querySelectorAll('.act.fin').length]")
      enabled=not pg.evaluate("document.getElementById('goPractice').disabled")
      if not(disabled and enabled and acts[0]==acts[1]>0 and imgs and overflow<=1 and blocks>=5): bad.append((name,'lesson',i+1,disabled,enabled,acts,imgs,overflow,blocks))
      pg.evaluate("document.getElementById('goPractice').click()"); pg.wait_for_timeout(100)
      # luyện tập: câu đầu cố ý sai
      total=pg.evaluate("Q.o.qs.length"); types=pg.evaluate("Q.o.qs.map(q=>q.t||'mcq')")
      for k in range(total):
        q=pg.evaluate("Q.o.qs[Q.order[Q.pos]]"); t=q.get('t','mcq')
        if t=='mcq':
          tap=(q['a']+1)%3 if k==0 else q['a']; pg.evaluate(f"document.querySelectorAll('.opt')[{tap}].click()")
        else:
          ans=q['ans'][0] if k!=0 else 'zzz'; pg.fill('input.fin',ans); pg.evaluate("document.querySelector('.qcard .nav .btn').click()")
        pg.evaluate("document.getElementById('qnext').click()"); pg.wait_for_timeout(30)
      fix=pg.evaluate("document.querySelector('.qn .fix')!==null")
      if fix:
        q=pg.evaluate("Q.o.qs[Q.order[Q.pos]]")
        if q.get('t')=='fill': pg.fill('input.fin',q['ans'][0]); pg.evaluate("document.querySelector('.qcard .nav .btn').click()")
        else: pg.evaluate(f"document.querySelectorAll('.opt')[{q['a']}].click()")
        pg.evaluate("document.getElementById('qnext').click()")
      res=pg.evaluate("[!!document.querySelector('.result'),document.querySelectorAll('.stars span:not(.off)').length,document.querySelector('.result h2').textContent]")
      pd=pg.evaluate(f"pdone({i})"); nxt=pg.evaluate(f"{i+1}<U.lessons.length?lessonOpen({i+1}):quizOpen()")
      if not(total==20 and types.count('mcq')==10 and types.count('fill')==10 and fix and res[0] and pd and nxt): bad.append((name,'practice',i+1,total,types.count('fill'),fix,res,pd,nxt))
      rep.append((name,i+1,res[2]))
    m=pg.evaluate("__m"); answers=[x for x in m if x[0]=='a']
    wrong_first=sum(1 for x in answers if not x[2])
    if len(answers)!=80 or wrong_first!=4 or len([x for x in m if x[0]=='f'])!=4: bad.append((name,'report',len(answers),wrong_first))
    # bài tập tổng hợp
    pg.evaluate("quizStart()"); total=pg.evaluate("Q.o.qs.length")
    for k in range(total):
      q=pg.evaluate("Q.o.qs[Q.order[Q.pos]]"); pg.evaluate(f"document.querySelectorAll('.opt')[{q['a']}].click()"); pg.evaluate("document.getElementById('qnext').click()")
    r=pg.evaluate("[!!document.querySelector('.result'),document.querySelectorAll('.stars span:not(.off)').length]")
    if not(r[0] and r[1]==3): bad.append((name,'quiz',r))
    if errs: bad.append((name,'errors',errs[:3]))
    ctx.close()
  b.close()
print('hoàn tất, lỗi:',len(bad)); [print(x) for x in bad]

# --- thanh nút Undo / Skip / Next / Home ---
with sync_playwright() as p:
  b=p.chromium.launch(); pg=b.new_page(viewport=dict(width=390,height=844)); errs=[]
  pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.goto(U%unit); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(400)
  pg.evaluate("practiceStart(0)")
  btn=lambda n: pg.evaluate(f"document.querySelectorAll('.qb')[{n}].disabled")
  r=[]
  r.append(('next khoá lúc đầu',btn(2)==True,'undo khoá ở câu 1',btn(0)==True))
  q0=pg.evaluate("Q.order[Q.pos]"); pg.evaluate("document.querySelectorAll('.qb')[1].click()")           # skip
  r.append(('skip đưa câu xuống cuối',pg.evaluate("Q.order[Q.order.length-1]")==q0 and pg.evaluate("Q.order[Q.pos]")!=q0))
  q=pg.evaluate("Q.o.qs[Q.order[Q.pos]]")
  if q.get('t')=='fill': pg.fill('input.fin',q['ans'][0]); pg.evaluate("document.querySelector('.qcard .nav .btn').click()")
  else: pg.evaluate(f"document.querySelectorAll('.opt')[{q['a']}].click()")
  r.append(('next mở sau khi trả lời',btn(2)==False,'skip khoá sau khi trả lời',btn(1)==True))
  pg.evaluate("document.getElementById('qnext').click()"); pos1=pg.evaluate("Q.pos")
  pg.evaluate("document.querySelectorAll('.qb')[0].click()")                                              # undo -> câu trước
  r.append(('undo về câu trước',pg.evaluate("Q.pos")==pos1-1))
  pg.evaluate("document.querySelectorAll('.qb')[3].click()")                                              # home -> hỏi xác nhận
  r.append(('home hỏi xác nhận',pg.evaluate("!!document.querySelector('.cdlg')")))
  pg.evaluate("document.querySelectorAll('.cdlg .btn')[1].click()")
  r.append(('thoát về trang ngữ pháp',pg.evaluate("!!document.querySelector('.tiles')")))
  bad2=[x for x in r if not all(v for v in x[1::2])]
  print('thanh nút:',len(r),'kiểm tra, lỗi',len(bad2),bad2,errs[:2]); b.close()
