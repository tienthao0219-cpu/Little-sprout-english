// Kiểm thử mọi bộ test của Starters Speaking trên trang thật.
// Chạy:  (ở gốc repo)  python3 -m http.server 8765 &   rồi   node apps/starters/speaking/_work/handoff/tools/test_sets.js [mã bộ ...]
// Cần Playwright (npm i playwright). In ra từng bộ: số bước, số bước có gợi ý, ảnh hỏng, lỗi console, kết quả đặt thẻ.
const {chromium}=require('playwright');
const ids=process.argv.slice(2);
(async()=>{
 const b=await chromium.launch();let bad=0;
 const pg=await b.newPage({viewport:{width:1100,height:900}});
 const errs=[],miss=[];
 pg.on('pageerror',e=>errs.push('PAGEERR '+String(e).slice(0,200)));pg.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push('CONSOLE '+m.text().slice(0,160))});
 pg.on('response',r=>{if(r.status()>=400)miss.push(r.status()+' '+r.url().slice(-70))});
 await pg.goto('http://localhost:8765/apps/starters/speaking/speaking.html?mute=1');await pg.waitForTimeout(700);
 const all=await pg.evaluate(()=>D.sets.map(s=>s.id));
 console.log('Trang chủ:',await pg.locator('.tile2').count(),'ô bộ test,',all.length,'bộ trong dữ liệu');
 for(const id of (ids.length?ids:all)){
   const before=errs.length;let info={steps:0,hints:0,placed:0,problems:[]};
   await pg.evaluate(id=>window.__ss.openSet(id),id);
   for(let part=0;part<4;part++){
     await pg.evaluate(p=>window.__ss.startPart(p),part);
     const n=await pg.evaluate(()=>window.__ss.st.steps.length);
     for(let i=0;i<n;i++){
       await pg.evaluate(i=>{window.__ss.st.i=i;window.__ss.st.wrong=0;window.__ss.render()},i);info.steps++;
       const st=await pg.evaluate(()=>{const s=window.__ss.st.steps[window.__ss.st.i];return {t:s.t,n:(s.hints||[]).length,zone:s.zone,card:s.card}});
       if(!(await pg.locator('.bub .q').innerText()).trim())info.problems.push(`P${part+1}.${i} bong bóng rỗng`);
       if(st.n){info.hints++;for(let k=0;k<=st.n;k++){const btn=pg.locator('.acts .btn.soft').first();if(await btn.count())await btn.click();if(!(await pg.locator('.bub .q').innerText()).trim())info.problems.push(`P${part+1}.${i} gợi ý ${k} rỗng`)}}
       // ảnh phải tải được
       const broken=await pg.evaluate(()=>[...document.images].filter(im=>im.complete&&im.naturalWidth===0&&!im.src.startsWith('data:')).map(im=>im.src.slice(-50)));
       if(broken.length)info.problems.push(`P${part+1}.${i} ảnh hỏng: ${broken.join(',')}`);
       // bước đặt thẻ: chạm đúng giữa vùng phải được chấp nhận
       if(st.t==='place'){
         const ok=await pg.evaluate(()=>{const s=window.__ss.st,step=s.steps[s.i],z=s.set.zones[step.zone],c=z.at||[z.rect[0]+z.rect[2]/2,z.rect[1]+z.rect[3]/2];
           const inr=c[0]>=z.rect[0]&&c[0]<=z.rect[0]+z.rect[2]&&c[1]>=z.rect[1]&&c[1]<=z.rect[1]+z.rect[3];return inr});
         if(ok)info.placed++;else info.problems.push(`P${part+1}.${i} điểm đặt thẻ nằm ngoài vùng`);
       }
     }
   }
   // chạy trọn bộ để ra màn thưởng
   for(let part=0;part<4;part++){await pg.evaluate(p=>window.__ss.startPart(p),part);for(let i=0;i<80;i++){if((await pg.evaluate(()=>window.__ss.st.view))!=='step')break;await pg.evaluate(()=>window.__ss.nextStep())}}
   const view=await pg.evaluate(()=>window.__ss.st.view);if(view!=='reward')info.problems.push('không tới màn thưởng: '+view);
   const e=errs.slice(before);
   const okk=!info.problems.length&&!e.length;if(!okk)bad++;
   console.log((okk?'OK  ':'LỖI ')+id,'· bước',info.steps,'· có gợi ý',info.hints,'· bước đặt thẻ',info.placed,info.problems.length?'· '+info.problems.slice(0,4).join(' | '):'',e.length?'· '+e.slice(0,2).join(' | '):'');
 }
 console.log('Ảnh/tệp lỗi tải:',miss.length?JSON.stringify([...new Set(miss)].slice(0,8)):'không');
 console.log(bad?`CÓ ${bad} BỘ LỖI`:'TẤT CẢ ĐẠT');await b.close();process.exit(bad?1:0);})();
