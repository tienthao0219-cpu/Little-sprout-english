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
          pg.evaluate(f'st.part={part};resetPartUI();testView()'); pg.evaluate('if(!st.hint)toggleHint()'); pg.wait_for_timeout(150)
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
            vcw=pg.evaluate("document.querySelectorAll('.vcw').length"); vrows=pg.evaluate("document.querySelectorAll('.vcw tr:not(.band)').length")
            dr=pg.evaluate("[...document.querySelectorAll('.dring')].filter(e=>getComputedStyle(e).display!='none').length")
            nd_=pg.evaluate("(st.set.dif||[]).length")
            res.append((vn,sid,'p1vcw',vcw,vrows,dr,nd_*2,0))
          if part==2:
            cards=pg.evaluate("document.querySelectorAll('.pcard').length"); rows=pg.evaluate("document.querySelectorAll('.pcard .pr').length"); pat=pg.evaluate("document.querySelectorAll('.pat').length")
            res.append((vn,sid,'p3cards',cards,rows,pat,0,0))
          if vn=='laptop' and sid in ('ai-t6','suc-t5','cam3-t2') :
            pg.screenshot(path=f'shots/{vn}_{sid}_p{part+1}.png',full_page=True)
        # part 2 accordions
        pg.evaluate('st.part=1;resetPartUI();testView()'); pg.evaluate('if(!st.hint)toggleHint()')
        nq=pg.evaluate("(()=>{const b=[...document.querySelectorAll('.qitem button')];b.forEach(x=>{x.click();x.click()});return b.length})()")
        res.append((vn,sid,'p2q',nq,pg.evaluate("document.querySelectorAll('.qitem .qdet:not(.hidden) .qh').length"),pg.evaluate("document.querySelectorAll('.qh .t-wh').length"),0,0))
        if vn=='laptop' and sid in('ai-t6','suc-t5'): pg.screenshot(path=f'shots/{vn}_{sid}_p2.png',full_page=True)
      res.append((vn,'ERRORS',len(errs),errs[:3],0,0,0,0))
      ctx.close()
    b.close()
  return res
if __name__=='__main__':
  import os; os.makedirs('shots',exist_ok=True)
  r=run(sys.argv[1:] or None)
  bad=[x for x in r if (x[2] in('p1','p3') and (x[6]>0 or x[7]>0 or x[4]!=x[5] or x[4]<1)) or (x[2]=='p3cards' and (x[3]!=5 or x[4]!=20 or x[5]<1)) or (x[1]=='ERRORS' and any('tunnel' not in e.lower() for e in x[3])) or (x[2]=='p1vcw' and (x[3]!=1 or x[4]<1 or x[5]!=x[6])) or (x[2]=='p2q' and (x[3]!=x[4] or x[5]<x[3]*0.5))]
  json.dump(r,open('pw_res.json','w'))
  print('total',len(r),'flagged',len(bad))
  for x in bad[:80]: print(x)
