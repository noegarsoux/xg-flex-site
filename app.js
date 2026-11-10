(function(){
const WID=['UltraCompressed','Compressed','Condensed','Standard','Extended','Expanded','UltraWide'];
const WGT=['Thin','Light','Regular','Medium','Bold','Black','Heavy'];
const STR=[50,62.5,75,100,125,150,200];
const NUM=[100,300,400,500,700,800,900];
const KW=['ultra-condensed','extra-condensed','condensed','normal','expanded','extra-expanded','ultra-expanded'];
const $=id=>document.getElementById(id);
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e;}
function setStyle(node,fam,w,g,ita){node.style.fontFamily=fam+',system-ui,sans-serif';node.style.fontStretch=STR[w]+'%';node.style.fontWeight=NUM[g];node.style.fontStyle=ita?'italic':'normal';}
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- hero: width follows x, weight follows y */
const hero=$('heroWord'), readout=$('heroStyle');
let hw=5,hg=5,hi=false,lastMove=0;
function fitHero(){
  const par=hero.parentElement, cs=getComputedStyle(par); const box=par.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  hero.style.fontSize='100px';
  const w=hero.scrollWidth||1;
  const size=Math.min(box/w*100*0.99,Math.max(90,window.innerHeight*0.46));
  hero.style.fontSize=size+'px';
}
function heroSet(w,g,i){
  if(w===hw&&g===hg&&i===hi&&hero.dataset.ready) return;
  hw=w;hg=g;hi=i;hero.dataset.ready='1';
  setStyle(hero,'XGC',w,g,i);
  readout.textContent=WID[w]+' '+WGT[g]+(i?' Italic':'');
  fitHero();
  if(document.fonts) document.fonts.load((i?'italic ':'normal ')+NUM[g]+' '+KW[w]+' 100px XGC','XG Flex').then(()=>{ if(w===hw&&g===hg&&i===hi) fitHero(); }).catch(()=>{});
}
heroSet(5,5,false);
document.fonts&&document.fonts.ready.then(fitHero);
window.addEventListener('resize',fitHero);
function fromPointer(e){
  const r=hero.getBoundingClientRect();
  const x=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width));
  const y=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));
  lastMove=Date.now();
  heroSet(Math.min(6,Math.floor(x*7)),Math.min(6,Math.floor(y*7)),e.shiftKey);
}
hero.addEventListener('pointermove',fromPointer);
hero.addEventListener('pointerdown',fromPointer);
// idle tour through the family
const tour=[];for(let g=0;g<7;g++)tour.push([3,g]);for(let w=3;w<7;w++)tour.push([w,6]);for(let w=6;w>=0;w--)tour.push([w,6-Math.round((6-w)*0.5)]);for(let g=3;g>=0;g--)tour.push([0,g]);for(let w=0;w<=5;w++)tour.push([w,Math.min(5,w)]);
let ti=0;
if(!reduce) setInterval(()=>{ if(Date.now()-lastMove<2500||document.hidden) return; const r=hero.getBoundingClientRect(); if(r.bottom<0) return; const [w,g]=tour[ti++%tour.length]; heroSet(w,g,false); },380);
// warm the roman styles in the background so the tour does not flash
window.addEventListener('load',()=>{ if(!document.fonts) return; const list=[]; tour.forEach(([w,g])=>list.push('normal '+NUM[g]+' '+KW[w]+' 40px XGC')); let k=0;
  (function next(){ if(k>=list.length) return; document.fonts.load(list[k++],'XG Flex').catch(()=>{}).finally(()=>setTimeout(next,20)); })();
});

/* ---------- marquee */
const mq=$('mq');
const WORDS=['6','9','2','a','Q','R','?','!','XG','XO','XC','XQ','+−=','×÷±','≤≥','„“”','Rare','Quiz','2069'];
function fillMarquee(){
  const frag=document.createDocumentFragment();
  for(let rep=0;rep<2;rep++) WORDS.forEach((w,i)=>{const s=el('span',null,w); const k=(i*5+3)%7, g=(i*3+rep)%7; setStyle(s,'XGC',k,g,i%4===3); frag.appendChild(s);});
  mq.appendChild(frag);
}
fillMarquee();

/* ---------- family matrix */
const matrix=$('matrix'), famText=$('famText');
let famIta=false; const cells=[];
function buildMatrix(){
  matrix.textContent='';cells.length=0;
  matrix.appendChild(el('div','h',''));
  WGT.forEach(g=>matrix.appendChild(el('div','h',g)));
  WID.forEach((w,wi)=>{
    matrix.appendChild(el('div','rh',w));
    WGT.forEach((g,gi)=>{
      const b=el('button','c'); b.type='button'; b.title=w+' '+g+(famIta?' Italic':''); b.setAttribute('aria-label',w+' '+g+(famIta?' italique':'')+', ouvrir dans l’essai');
      b.textContent=famText.value||'Ra6'; setStyle(b,'XGC',wi,gi,famIta);
      b.addEventListener('click',()=>{ $('tWid').value=wi; $('tWgt').value=gi; $('tIta').checked=famIta; render(); document.getElementById('essai').scrollIntoView({behavior:reduce?'auto':'smooth'}); });
      cells.push(b); matrix.appendChild(b);
    });
  });
}
buildMatrix();
famText.addEventListener('input',()=>cells.forEach(c=>c.textContent=famText.value||'Ra6'));
document.querySelectorAll('[data-fam-ita]').forEach(b=>b.addEventListener('click',()=>{famIta=b.dataset.famIta==='1';document.querySelectorAll('[data-fam-ita]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));buildMatrix();}));

/* ---------- tester */
const tW=$('tWid'),tG=$('tWgt'),tS=$('tSize'),tI=$('tIta'),tT=$('tText'),tAF=$('tAF'),tRP=$('tRP');
let view='side';
function mapped(t){ if(tAF.checked) t=t.replace(/a/g,AF); if(tRP.checked) t=t.replace(/R/g,RP); return t; }
function render(){
  const w=+tW.value,g=+tG.value,i=tI.checked,size=+tS.value,text=tT.value||'XG Flex';
  $('tWidVal').textContent=WID[w]; $('tWgtVal').textContent=WGT[g]; $('tSizeVal').textContent=size+' px';
  const c=$('tCustom'),b=$('tBase'),oc=$('oCustom'),ob=$('oBase');
  c.textContent=oc.textContent=mapped(text); b.textContent=ob.textContent=text;
  [c,oc].forEach(n=>{setStyle(n,'XGC',w,g,i);n.style.fontSize=size+'px';});
  [b,ob].forEach(n=>{setStyle(n,'XGB',w,g,i);n.style.fontSize=size+'px';});
  $('tLines').hidden=view!=='side'; $('tOver').hidden=view!=='over';
  const fall=$('tFall'); fall.textContent='';
  WGT.forEach((gn,gi)=>{const r=el('div','wf'); r.appendChild(el('span',null,gn)); const d=el('div',null,mapped(text)); setStyle(d,'XGC',w,gi,i); d.style.fontSize=Math.round(Math.max(18,size*0.42))+'px'; r.appendChild(d); fall.appendChild(r);});
}
[tW,tG,tS,tI,tT,tAF,tRP].forEach(n=>{n.addEventListener('input',render);n.addEventListener('change',render);});
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;document.querySelectorAll('[data-view]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
render();

/* ---------- lightbox */
const lb=$('lb'),lbImg=$('lbImg');
function openLB(src,title){ lbImg.src=src; lbImg.alt=title||''; $('lbTitle').textContent=title||''; lb.hidden=false; document.body.style.overflow='hidden'; $('lbClose').focus(); }
function closeLB(){ lb.hidden=true; document.body.style.overflow=''; lbImg.removeAttribute('src'); }
$('lbClose').addEventListener('click',closeLB);
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!lb.hidden) closeLB(); });
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>openLB(b.dataset.open,b.closest('figure').querySelector('h3').textContent)));

/* ---------- glyph plates */
const LABEL={solo:'Custom seul',ov:'Sur Lateral',base:'Base sur Lateral',bsolo:'Base seule',cmp:'Custom sur base',prev:'Sur la version 3'};
const jump=$('jump'), plates=$('plates'); const chips=new Map(); let section='';
ITEMS.forEach(it=>{
  if(it.sep){section=it.sep; jump.appendChild(el('span','sep',it.sep)); return;}
  const a=el('a',null,it.ch); a.href='#'+it.id; a.setAttribute('aria-label',it.name);
  if(it.ch===AF||it.ch===RP) a.appendChild(el('small',null,it.ch===AF?'pied':'droit'));
  jump.appendChild(a); chips.set(it.id,a);
  const sec=el('article','glyph'); sec.id=it.id;
  const top=el('div','gtop');
  const big=el('div',it.group?'gbig grp':'gbig',it.ch); top.appendChild(big);
  const tx=el('div','gtxt');
  tx.appendChild(el('p','kicker',section)); tx.appendChild(el('h3',null,it.name)); tx.appendChild(el('p','form',it.form)); tx.appendChild(el('p','what',it.what));
  if(it.watch) tx.appendChild(el('p','watch',it.watch));
  top.appendChild(tx); sec.appendChild(top);
  const st={mode:it.modes.includes('ov')?'ov':'solo',ita:false,w:3,g:4};
  const bar=el('div','gbar');
  if(it.modes.length>1){const seg=el('div','seg'); it.modes.forEach(m=>{const b=el('button',null,LABEL[m]);b.type='button';b.dataset.mode=m;b.addEventListener('click',()=>{st.mode=m;upd();});seg.appendChild(b);}); bar.appendChild(seg);}
  const seg2=el('div','seg'); [['0','Romains'],['1','Italiques']].forEach(([v,l])=>{const b=el('button',null,l);b.type='button';b.dataset.ita=v;b.addEventListener('click',()=>{st.ita=(v==='1');upd();});seg2.appendChild(b);}); bar.appendChild(seg2);
  bar.appendChild(el('span','spacer'));
  const z=el('button','plain','Plein écran'); z.type='button'; bar.appendChild(z);
  sec.appendChild(bar);
  const sheet=el('button','sheet'); sheet.type='button'; const img=el('img'); img.loading='lazy'; img.decoding='async'; sheet.appendChild(img); sec.appendChild(sheet);
  const legend=el('div','legend'); sec.appendChild(legend);
  const open=()=>openLB(img.src,it.name+' · '+LABEL[st.mode]+' · '+(st.ita?'italiques':'romains'));
  sheet.addEventListener('click',open); z.addEventListener('click',open);
  img.addEventListener('load',()=>{img.classList.remove('loading'); img.style.maxWidth=Math.round(img.naturalWidth/1.5)+'px';});
  function upd(){
    const tag=(st.mode==='base')?it.base:it.tag;
    const src='img/'+st.mode+'_'+tag+'_'+(st.ita?'ita':'rom')+'.webp';
    if(img.getAttribute('src')!==src){ if(img.getAttribute('src')) img.classList.add('loading'); img.src=src; }
    img.alt=it.name+', '+(st.ita?'italiques':'romains')+', 49 styles, '+LABEL[st.mode].toLowerCase();
    big.style.fontStyle=st.ita?'italic':'normal';
    legend.textContent='';
    let sw=null;
    if(st.mode==='solo') legend.appendChild(el('span',null,it.soloLegend||(it.group?'Les signes custom seuls, à demi-corps, dans les 49 styles.':'Le glyphe custom seul, à corps égal dans les 49 styles.')));
    else if(st.mode==='bsolo') legend.appendChild(el('span',null,it.group?'Les mêmes signes dans XG Flex avant les changements, à demi-corps.':'Le même signe dans XG Flex avant les changements.'));
    else if(st.mode==='prev') sw=[['var(--base)','Version 3 seule'],['var(--xg)','Version 4 seule'],['var(--both)','Commun aux deux']];
    else if(st.mode==='cmp') sw=[['var(--base)','Base seule'],['var(--xg)','Custom seul'],['var(--both)','Commun aux deux']];
    else sw=[['var(--lat)','Lateral seul'],['var(--xg)',st.mode==='ov'?'Custom seul':'Base seule'],['var(--both)','Commun aux deux']];
    if(sw) sw.forEach(([c,t])=>{const s=el('span');const i=el('i');i.style.background=c;s.appendChild(i);s.appendChild(document.createTextNode(t));legend.appendChild(s);});
    bar.querySelectorAll('button[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===st.mode)));
    bar.querySelectorAll('button[data-ita]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.ita==='1')===st.ita)));
  }
  upd(); plates.appendChild(sec);
});
// highlight the chip of the plate in view
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>{es.forEach(e=>{ if(e.isIntersecting){ chips.forEach(c=>c.classList.remove('on')); const c=chips.get(e.target.id); if(c){c.classList.add('on'); const j=jump.getBoundingClientRect(), r=c.getBoundingClientRect(); if(r.left<j.left||r.right>j.right) jump.scrollBy({left:r.left-j.left-40,behavior:'smooth'});} } });},{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('.glyph').forEach(s=>io.observe(s));
}

/* ---------- overlap bars */
const bars=$('bars');
const head=el('div','brow head'); head.appendChild(el('span',null,'Glyphe'));
const lg=el('span','legend-inline'); [['var(--line2)','Base XG Flex'],['var(--xg)','XG Flex Custom']].forEach(([c,t])=>{const s=el('span');const i=el('i');i.style.background=c;s.appendChild(i);s.appendChild(document.createTextNode(t));lg.appendChild(s);});
head.appendChild(lg); head.appendChild(el('span','far','Style le plus éloigné')); bars.appendChild(head);
ROWS.forEach(r=>{
  const row=el('div','brow'); row.setAttribute('role','row');
  const g=el('span','g',r[0]); if(r[0]===AF) g.appendChild(el('small',null,'pied')); if(r[0]===RP) g.appendChild(el('small',null,'droit')); row.appendChild(g);
  const tr=el('div','track');
  const vb=parseFloat(r[1].replace(',','.')), vc=parseFloat(r[2].replace(',','.'));
  const bb=el('span','b base'); bb.style.width=vb+'%'; const bc=el('span','b cus'); bc.style.width='0%';
  const lb1=el('span','lab base',r[1]+' %'); lb1.style.left=vb+'%'; const lb2=el('span','lab cus',r[2]+' %'); lb2.style.left=vc+'%';
  tr.append(bb,bc,lb1,lb2); row.appendChild(tr);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{bc.style.transition='width 1s cubic-bezier(.2,.8,.2,1)'; bc.style.width=vc+'%';}));
  const far=el('span','far'); const [pct,sty]=r[3].split(' · '); const b=el('b',null,pct+' %'); far.append(b,document.createTextNode(' en '+sty+' · plus proche que la base dans '+r[4]+' styles')); row.appendChild(far);
  bars.appendChild(row);
});
})();
