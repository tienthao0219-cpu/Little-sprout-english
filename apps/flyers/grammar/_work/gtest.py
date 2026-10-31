# Kiểm tra tự động trang ngữ pháp (cần: python3 -m http.server 8765 ở thư mục gốc repo)
import sys,json
from playwright.sync_api import sync_playwright
U='http://localhost:8765/apps/flyers/grammar/grammar-%s.html'
unit=sys.argv[1] if len(sys.argv)>1 else 'unit-1'
res=[];bad=[]
with sync_playwright() as p:
  b=p.chromium.launch()
  for name,(w,h) in {'phone':(390,844),'ipad':(820,1180),'laptop':(1366,768)}.items():
    ctx=b.new_context(viewport=dict(width=w,height=h),has_touch=name!='laptop',is_mobile=name!='laptop'); pg=ctx.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    pg.route('**/*',lambda r:r.continue_()) 
    pg.goto(U%unit); pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(500)
    msgs=pg.evaluate("window.__m=[];window.LSE_REPORT.answer=(a,b,c,d)=>__m.push(['a',a,c]);window.LSE_REPORT.finish=(s,m)=>__m.push(['f',s,m]);1")
    n=pg.evaluate("U.lessons.length")
    # khoá: chỉ bài 1 mở, bài tập khoá
    lock=pg.evaluate("[U.lessons.map((_,i)=>lessonOpen(i)),quizOpen()]")
    ok_lock = lock[0][0] and not any(lock[0][1:]) and not lock[1]
    # học lần lượt 4 bài
    for i in range(n):
      pg.evaluate(f"lessonView({i})"); pg.wait_for_timeout(150)
      cards=pg.evaluate("document.querySelectorAll('.ex').length"); imgs=pg.evaluate("[...document.querySelectorAll('.vart img')].every(i=>i.complete&&i.naturalWidth>0)")
      overflow=pg.evaluate("document.documentElement.scrollWidth-document.documentElement.clientWidth")
      res.append((name,'lesson',i+1,cards,imgs,overflow))
      pg.evaluate("document.querySelector('.nav .btn.pulse').click()"); pg.wait_for_timeout(100)
    unlocked=pg.evaluate("quizOpen()")
    # làm bài tập: cố ý sai câu 1, còn lại đúng
    pg.evaluate("quizStart()")
    total=pg.evaluate("U.quiz.length"); first=True
    for k in range(total):
      idx=pg.evaluate("Q.order[Q.pos]"); a=pg.evaluate(f"U.quiz[{idx}].a")
      tap=(a+1)%3 if (first and k==0) else a
      pg.evaluate(f"document.querySelectorAll('.opt')[{tap}].click()"); pg.wait_for_timeout(40); pg.evaluate("document.querySelector('.qcard .nav .btn').click()"); pg.wait_for_timeout(40)
    # vòng Fix it: câu sai quay lại
    fix=pg.evaluate("document.querySelector('.qn .fix')!==null")
    if fix:
      idx=pg.evaluate("Q.order[Q.pos]"); a=pg.evaluate(f"U.quiz[{idx}].a"); pg.evaluate(f"document.querySelectorAll('.opt')[{a}].click()"); pg.evaluate("document.querySelector('.qcard .nav .btn').click()")
    pg.wait_for_timeout(200)
    result=pg.evaluate("[!!document.querySelector('.result'),document.querySelector('.result h2')&&document.querySelector('.result h2').textContent,document.querySelectorAll('.stars span:not(.off)').length]")
    m=pg.evaluate("__m"); answers=[x for x in m if x[0]=='a']; fin=[x for x in m if x[0]=='f']
    res.append((name,'quiz',ok_lock,unlocked,fix,result[0],result[2],len(answers),sum(1 for x in answers if x[2]),fin[-1][1:] if fin else None,len(errs)))
    if not(ok_lock and unlocked and fix and result[0] and len(answers)==total and sum(1 for x in answers if x[2])==total-1 and fin and fin[-1][1]==total-1 and not errs): bad.append(res[-1])
    for r in res:
      if r[1]=='lesson' and r[0]==name and (r[3]<3 or not r[4] or r[5]>1): bad.append(r)
    ctx.close()
  b.close()
print('kết quả',len(res),'lỗi',len(bad)); [print(x) for x in bad]
