/*LEARN:begin*/
(function(){
const root=document.getElementById('learn'); if(!root||typeof originalCards==='undefined') return;
const ALL=originalCards.slice();
const topics=[]; ALL.forEach(c=>{ if(c.topic&&topics.indexOf(c.topic)<0) topics.push(c.topic); });
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const say=c=>{ try{ if(typeof speak==='function') speak(c.say||c.word); }catch(e){} };
const stopSay=()=>{ try{ speechSynthesis.cancel(); }catch(e){} };
let sel='all', list=[], pos=0, flipped=false, shuffled=false, finished=false, auto=true;
try{ if(localStorage.getItem('lse_learn_auto')==='0') auto=false; }catch(e){}
const shuf=a=>{ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const base=()=>ALL.filter(c=>sel==='all'||c.topic===sel);
function reset(shuffle){ shuffled=!!shuffle; list=shuffled?shuf(base()):base(); pos=0; flipped=false; finished=false; stopSay(); draw(); }
function draw(){
  if(!list.length) list=base();
  if(finished){
    root.innerHTML=`<div class="ln-done"><div style="font-size:64px">🎉</div><h2>Giỏi lắm! Em đã xem hết ${list.length} thẻ</h2><p>Học lại hoặc xáo trộn để nhớ chắc hơn nhé.</p>
    <div class="row"><button class="ln-btn" data-a="again" style="min-height:52px;font-size:16px">↺ Học lại từ đầu</button><button class="ln-btn" data-a="shuffle" style="min-height:52px;font-size:16px">🔀 Xáo trộn &amp; học lại</button>
    <button class="ln-btn" data-a="cards" style="min-height:52px;font-size:16px">🃏 Về thẻ từ</button>${document.querySelector('.modebar [data-m="practice"]')?'<button class="ln-btn" data-a="practice" style="min-height:52px;font-size:16px">🎯 Luyện tập</button>':''}</div></div>`;
    return;
  }
  const c=list[pos], n=list.length;
  const front=c.image?`<div class="ln-pic"><img src="${esc(c.image)}" alt="" draggable="false"></div>`:`<div class="ln-pic"><div class="ln-nopic">${esc(c.vi)}</div></div>`;
  root.innerHTML=`<div class="ln-bar"><button class="ln-btn" data-a="cards">← Thẻ từ</button><div class="ln-count" aria-live="polite">${pos+1} / ${n}</div><button class="ln-btn ${auto?'on':''}" data-a="auto" aria-pressed="${auto}">${auto?'🔊 Tự đọc: BẬT':'🔇 Tự đọc: TẮT'}</button></div>
  <div class="ln-prog"><i style="width:${Math.round((pos+1)/n*100)}%"></i></div>
  ${topics.length>1?`<div class="ln-topics"><button class="${sel==='all'?'on':''}" data-t="all">Tất cả (${ALL.length})</button>${topics.map(t=>`<button class="${sel===t?'on':''}" data-t="${esc(t)}">${esc(t)}</button>`).join('')}</div>`:''}
  <div class="ln-card${flipped?' flipped':''}" tabindex="0" role="button" data-a="flip" aria-label="Thẻ ${pos+1}. Chạm để lật thẻ">
    <div class="ln-in">
      <div class="ln-face front">${front}<div class="ln-hint">👆 Chạm để lật thẻ</div></div>
      <div class="ln-face back"><div class="ln-word" data-a="say">${esc(c.word)}${c.tag?`<span class="tag">${esc(c.tag)}</span>`:''}</div><div class="ln-vi">${esc(c.vi)}</div>
        <button class="ln-say" type="button" data-a="say" aria-label="Nghe từ ${esc(c.word)}">🔊 Nghe</button><div class="ln-small">Chạm vào thẻ để lật lại</div></div>
    </div>
  </div>
  <div class="ln-nav"><button class="prev" data-a="prev" ${pos===0?'disabled':''}>◀ Trước</button><button class="shuf" data-a="shuffle" aria-pressed="${shuffled}">${shuffled?'🔢 Theo thứ tự':'🔀 Xáo trộn'}</button><button class="next" data-a="next">${pos===n-1?'Xong ✓':'Tiếp ▶'}</button></div>`;
}
function go(d){
  stopSay();
  if(d>0){ if(pos>=list.length-1){ finished=true; return draw(); } pos++; }
  else { if(pos===0) return; pos--; }
  flipped=false; draw();
}
function flip(){
  const card=root.querySelector('.ln-card'); if(!card) return;
  flipped=!flipped; card.classList.toggle('flipped',flipped);
  if(flipped&&auto) setTimeout(()=>say(list[pos]),260); else if(!flipped) stopSay();
}
root.addEventListener('click',e=>{
  const t=e.target.closest('[data-t]'); if(t&&t.dataset.t!==undefined&&t.closest('.ln-topics')){ sel=t.dataset.t; return reset(shuffled); }
  const b=e.target.closest('[data-a]'); if(!b) return; const a=b.dataset.a;
  if(a==='say'){ e.stopPropagation(); return say(list[pos]); }
  if(a==='flip') return flip();
  if(a==='next') return go(1);
  if(a==='prev') return go(-1);
  if(a==='shuffle') return reset(!shuffled||finished);
  if(a==='again') return reset(false);
  if(a==='auto'){ auto=!auto; try{ localStorage.setItem('lse_learn_auto',auto?'1':'0'); }catch(_){} if(!auto) stopSay(); return draw(); }
  if(a==='cards'||a==='practice'){ const m=document.querySelector('.modebar [data-m="'+(a==='cards'?'cards':'practice')+'"]'); if(m) m.click(); }
});
document.addEventListener('keydown',e=>{
  if(!document.body.classList.contains('mode-learn')) return; if(/INPUT|TEXTAREA|SELECT/.test((e.target.tagName||''))) return;
  if(e.key==='ArrowRight') { e.preventDefault(); go(1); }
  else if(e.key==='ArrowLeft') { e.preventDefault(); go(-1); }
  else if((e.key===' '||e.key==='Enter'||e.key==='ArrowUp'||e.key==='ArrowDown')&&!finished&&!e.target.closest('button')){ e.preventDefault(); flip(); }
  else if((e.key==='s'||e.key==='S')&&!finished) say(list[pos]);
});
// vuốt trái / phải để đi tới / lui
let sx=null,sy=null;
root.addEventListener('touchstart',e=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; },{passive:true});
root.addEventListener('touchend',e=>{ if(sx===null) return; const t=e.changedTouches[0], dx=t.clientX-sx, dy=t.clientY-sy; sx=null;
  if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5&&e.target.closest('.ln-card')){ e.preventDefault(); go(dx<0?1:-1); } },{passive:false});
function enter(){ reset(false); window.scrollTo(0,0); }
function leave(){ stopSay(); }
document.querySelectorAll('.modebar button').forEach(x=>x.addEventListener('click',()=>{
  const on=x.dataset.m==='learn'; document.body.classList.toggle('mode-learn',on);
  if(on) enter(); else leave();
}));
})();
/*LEARN:end*/
