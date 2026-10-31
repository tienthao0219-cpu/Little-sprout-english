import json,sys,re
from playwright.sync_api import sync_playwright
URL='http://localhost:8765/apps/flyers/speaking/speaking.html'
ids=[s['id'] for s in json.load(open('data.json',encoding='utf8'))['sets']]
vp={'laptop':dict(width=1366,height=768),'phone':dict(width=390,height=844)}
JS_TIPS="""(sel)=>{const out=[];document.querySelectorAll(sel).forEach(iw=>{const ir=iw.getBoundingClientRect();
 const tips=[...iw.querySelectorAll('.tip')].map(t=>{const r=t.getBoundingClientRect();return {l:r.left-ir.left,t:r.top-ir.top,r:r.right-ir.left,b:r.bottom-ir.top,txt:t.textContent}});
 let ov=0,oob=0;for(let i=0;i<tips.length;i++){const a=tips[i];if(a.l<-1||a.t<-1||a.r>ir.width+1||a.b>ir.height+1)oob++;for(let j=i+1;j<tips.length;j++){const b=tips[j];if(a.l<b.r&&b.l<a.r&&a.t<b.b&&b.t<a.b)ov++}}
 out.push({n:tips.length,ov,oob,dots:iw.querySelectorAll('.hot').length,on:iw.querySelectorAll('.hot.on').length})});return out}"""
def run(only=None):
  res=[]
  with sync_playwright() as p:
    b=p.chromium.launch()
    for vn,v in vp.items():
      ctx=b.new_context(viewport=v,has_touch=(vn=='phone'),is_mobile=(vn=='phone'))
      pg=ctx.new_page(); errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
      pg.goto(URL); pg.wait_for_timeout(300)
      for sid in ids:
        if only and sid not in only: continue
        pg.evaluate(f'openSet("{sid}")'); pg.wait_for_timeout(120)
        for part in (0,2):
          pg.evaluate(f'st.part={part};resetPartUI();testView()'); pg.evaluate('if(!st.hint)toggleHint()'); pg.evaluate('if(st.part===0&&st.hlvl<2)toggleHint()'); pg.wait_for_timeout(150)
          # click each dot via real mouse at its centre
          pg.evaluate("document.querySelectorAll('.iw').forEach(e=>e.scrollIntoView({block:'center'}))")
          n=pg.evaluate("document.querySelectorAll('.hot').length")
          for i in range(n):
            pg.evaluate(f"document.querySelectorAll('.hot')[{i}].scrollIntoView({{block:'center'}})")
            bb=pg.evaluate(f"(()=>{{const r=document.querySelectorAll('.hot')[{i}].getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}})()")
            pg.mouse.click(bb[0],bb[1]); 
          st=pg.evaluate(JS_TIPS,'.iw')
          tot=sum(x['on'] for x in st); nd=sum(x['dots'] for x in st)
          res.append((vn,sid,'p%d'%(part+1),nd,tot,sum(x['n'] for x in st),sum(x['ov'] for x in st),sum(x['oob'] for x in st)))
          if part==0:
            # bảng so sánh: có đúng 1, mở được, số hàng = số điểm khác; đã bỏ hẳn bảng từ vựng 2 tranh
            old=pg.evaluate("document.querySelectorAll('.vcw').length")
            pg.evaluate("document.querySelector('.dtbl>button')&&document.querySelector('.dtbl>button').click()")
            vcw=pg.evaluate("document.querySelectorAll('.dtbl').length")-old
            vrows=pg.evaluate("document.querySelectorAll('.dtbl .cmp-r').length")
            dr=pg.evaluate("[...document.querySelectorAll('.dring')].filter(e=>{const c=getComputedStyle(e);return c.display!='none'&&c.position=='absolute'&&parseFloat(c.borderTopWidth)>=2&&e.getBoundingClientRect().height>10}).length")
            nd_=pg.evaluate("(st.set.dif||[]).length")
            res.append((vn,sid,'p1vcw',vcw,vrows,dr,nd_*2,0))
          if part==2:
            cards=pg.evaluate("document.querySelectorAll('.pcol').length")
            pre=pg.evaluate("document.querySelectorAll('.pcol .prow:not(.hidden)').length")      # lúc đầu: chưa hiện dòng nào
            pg.evaluate("document.querySelectorAll('.pcol').forEach(c=>{for(let i=0;i<4;i++)c.click()})")
            rows=pg.evaluate("document.querySelectorAll('.pcol .prow:not(.hidden)').length")   # chạm 4 lần: hiện đủ 20 dòng
            pg.evaluate("document.querySelectorAll('.pcol').forEach(c=>c.click())")             # chạm thêm 1 lần: ẩn lại
            post=pg.evaluate("document.querySelectorAll('.pcol .prow:not(.hidden)').length")
            pat=pg.evaluate("document.querySelectorAll('.pat').length")+(0 if pre==0 and post==0 else -99)
            res.append((vn,sid,'p3cards',cards,rows,pat,0,0))
          if vn=='laptop' and sid in ('ai-t6','suc-t5','cam3-t2') :
            pg.screenshot(path=f'shots/{vn}_{sid}_p{part+1}.png',full_page=True)
        # chế độ học viên: có khung tự đánh giá, không có khung chấm của cô, không có nút Cô ở Part 4
        pg.evaluate('st.teach=false;st.part=3;resetPartUI();testView()')
        stu=pg.evaluate("[document.querySelectorAll('.selfbox').length,document.querySelectorAll('.score').length,document.querySelectorAll('.tbtn').length]")
        pg.evaluate('st.part=2;resetPartUI();testView()')
        pg.evaluate("[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Xem từng tranh')).click()")
        pg.wait_for_timeout(120)
        sv=pg.evaluate("(()=>{const c=document.querySelector('.sv-crop');const r=c.getBoundingClientRect();return [r.width>50&&r.height>50,document.querySelectorAll('.sv-dots i').length]})()")
        pg.evaluate("document.querySelectorAll('.sv-nav .btn')[1].click();document.querySelectorAll('.sv-nav .btn')[1].click()")
        i3=pg.evaluate("document.querySelector('.lbt span').textContent")
        pg.evaluate("[...document.querySelectorAll('.lbt button')].find(b=>b.textContent.includes('Đóng')).click()")
        res.append((vn,sid,'student',stu[0],stu[1],stu[2],int(sv[0]) if sv[0] else 0,sv[1] if i3=='Tranh 3 / 5' else -1))
        pg.evaluate('st.teach=true')
        # khoá Part (chế độ học viên): bấm Part 2 khi chưa xong Part 1 thì bị chặn; chọn mặt cười thì mở
        pg.evaluate("st.teach=false;localStorage.removeItem(KEY);openSet('%s');startSet(0)"%sid)
        lka=pg.evaluate("[document.querySelectorAll('.node.locked').length,(document.querySelectorAll('.node')[1].click(),st.part)]")
        pg.evaluate("document.querySelectorAll('.nav.pnav .btn')[1].click()"); lkb=pg.evaluate('st.part')
        pg.evaluate("document.querySelector('.selfbox .rbtn').click()"); pg.evaluate("document.querySelectorAll('.nav.pnav .btn')[1].click()"); lkc=pg.evaluate('st.part')
        res.append((vn,sid,'lock',lka[0],lka[1],lkb,lkc,pg.evaluate("document.querySelectorAll('.node.locked').length")))
        pg.evaluate('st.teach=true;localStorage.removeItem(KEY)')
        # part 2 accordions
        pg.evaluate('st.part=1;resetPartUI();testView()'); pg.evaluate('if(!st.hint)toggleHint()')
        nq=pg.evaluate("(()=>{const b=[...document.querySelectorAll('.qitem button')];b.forEach(x=>{x.click();x.click();x.click()});return b.length})()")
        res.append((vn,sid,'p2q',nq,pg.evaluate("document.querySelectorAll('.qitem .qdet:not(.hidden) .qh').length"),pg.evaluate("document.querySelectorAll('.qh .t-wh').length"),0,0))
        if vn=='laptop' and sid in('ai-t6','suc-t5'): pg.screenshot(path=f'shots/{vn}_{sid}_p2.png',full_page=True)
      res.append((vn,'ERRORS',len(errs),errs[:3],0,0,0,0))
      ctx.close()
    b.close()
  return res

def lock_sets_test():
  out=[]
  with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport=dict(width=1000,height=800)); pg.goto(URL); pg.wait_for_timeout(400)
    pg.evaluate("st.teach=false;localStorage.clear();goHome()")
    groups=pg.evaluate("[...new Set(SETS.map(s=>s.group))].length")
    lockedAll=pg.evaluate("document.querySelectorAll('.tile2.lockd').length")
    expect=pg.evaluate("SETS.length-[...new Set(SETS.map(s=>s.group))].length")
    pg.evaluate("document.querySelectorAll('.tile2.lockd')[0].click()"); toast=pg.evaluate("!!document.querySelector('.toast')")
    first=pg.evaluate("(()=>{const s=SETS[1];st.set=s;PARTS.forEach(q=>markDone(q.id));homeView();return document.querySelectorAll('.tile2.lockd').length})()")
    pg.evaluate("st.teach=true;homeView()"); t=pg.evaluate("document.querySelectorAll('.tile2.lockd').length")
    pg.evaluate("document.querySelector('.pillrow ~ *,button.pill:not(.star)')"); 
    pg.evaluate("st.teach=true;setLockSets(false);homeView()"); off=pg.evaluate("document.querySelectorAll('.tile2.lockd').length")
    out.append(('lockSets',lockedAll==expect,toast,t,off,first<=lockedAll))
    b.close()
  return out

def reward_tests():
  out=[]
  with sync_playwright() as p:
    b=p.chromium.launch()
    # 1) mã của cô
    pg=b.new_page(viewport=dict(width=900,height=800)); pg.goto(URL); pg.wait_for_timeout(300); pg.evaluate("localStorage.clear();location.reload()"); pg.wait_for_timeout(500)
    pg.evaluate("goHome()"); pg.evaluate("document.querySelector('.sbar .ni').click()"); dlg=pg.evaluate("!!document.querySelector('.cdlg')")
    pg.fill('.cdlg input','sai'); pg.keyboard.press('Enter'); wrong=pg.evaluate("[st.teach,document.querySelector('.cmsg').textContent.length>0]")
    pg.fill('.cdlg input','thao2026'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200); right=pg.evaluate("[st.teach,!document.querySelector('.cdlg')]")
    out.append(('code',dlg,wrong==[False,True],right==[True,True]))
    # 2) học viên đăng nhập: không có nút Cô
    pg2=b.new_page(viewport=dict(width=900,height=800)); pg2.goto(URL); pg2.evaluate("localStorage.clear();localStorage.setItem('lse_auth_v1',JSON.stringify({name:'An',role:'student'}));location.reload()"); pg2.wait_for_timeout(500)
    out.append(('student',pg2.evaluate("document.querySelectorAll('.sbar .ni').length"),pg2.evaluate("st.teach")))
    # 3) hoàn thành bộ -> sao + sticker; đồng bộ qua hồ sơ website (giả lập)
    pg3=b.new_page(viewport=dict(width=900,height=800))
    H="<iframe id=f src='%s' style='width:900px;height:760px'></iframe><script>window.LSE={prof:{d:{fly:{stars:{},stk:[]}},get(){return this.d},mut(fn){fn(this.d)},sync:{state:'ok'}}}</script>"%URL
    pg3.route('http://localhost:8765/__h.html',lambda r:r.fulfill(body=H,content_type='text/html')); pg3.goto('http://localhost:8765/__h.html')
    pg3.wait_for_timeout(1200); fr=pg3.frame_locator('#f')
    f=pg3.frames[1]
    f.evaluate("localStorage.clear();localStorage.setItem('lse_auth_v1',JSON.stringify({name:'An',role:'teacher'}));location.reload()"); pg3.wait_for_timeout(1200); f=pg3.frames[1]
    f.evaluate("openSet(SETS[0].id);startSet(0);PARTS.forEach(q=>markDone(q.id));st.part=3;testView();finish()"); pg3.wait_for_timeout(300)
    got=f.evaluate("[document.body.innerText.includes('sao mới'),document.querySelectorAll('.sticker').length,albumView(),document.querySelectorAll('.sticker:not(.lock)').length]")
    remote=pg3.evaluate("[Object.keys(LSE.prof.d.fly.stars),LSE.prof.d.fly.stk]")
    out.append(('reward',got[0],got[1],got[3],len(remote[0]),remote[1]))
    b.close()
  return out

if __name__=='__main__':
  import os; os.makedirs('shots',exist_ok=True)
  r=run(sys.argv[1:] or None)
  bad=[x for x in r if (x[2] in('p1','p3') and (x[6]>0 or x[7]>0 or x[4]!=x[5] or x[4]<1)) or (x[2]=='p3cards' and (x[3]!=5 or x[4]!=20 or x[5]<1)) or (x[1]=='ERRORS' and any('tunnel' not in e.lower() for e in x[3])) or (x[2]=='p1vcw' and (x[3]!=1 or x[4]*2!=x[6] or x[5]!=x[6])) or (x[2]=='student' and (x[3]!=1 or x[4]!=0 or x[5]!=0 or x[6]!=1 or x[7]!=5)) or (x[2]=='lock' and (x[3]!=3 or x[4]!=0 or x[5]!=0 or x[6]!=1 or x[7]!=2)) or (x[2]=='p2q' and (x[3]!=x[4] or x[5]<x[3]*0.5))]
  ls=lock_sets_test(); print('lockSets',ls)
  if not (ls[0][1] and ls[0][2] and ls[0][3]==0 and ls[0][4]==0 and ls[0][5]): bad.append(ls)
  rw=reward_tests(); print('reward',rw)
  if not (rw[0][1] and rw[0][2] and rw[0][3] and rw[1][1]==0 and rw[1][2]==False and rw[2][1] and rw[2][2]>=1 and rw[2][3]==1 and rw[2][4]==1 and rw[2][5]==[0]): bad.append(rw)
  json.dump(r,open('pw_res.json','w'))
  print('total',len(r),'flagged',len(bad))
  for x in bad[:80]: print(x)
