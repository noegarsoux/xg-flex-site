(function(){
const WID=['UltraCompressed','Compressed','Condensed','Standard','Extended','Expanded','UltraWide'];
const WGT=['Thin','Light','Regular','Medium','Bold','Black','Heavy'];
const STR=[50,62.5,75,100,125,150,200], NUM=[100,300,400,500,700,800,900];
const AF='', RP='';
const $=id=>document.getElementById(id);
function el(t,c,x){const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}

const GLYPHS=[
  {id:'XG',ch:'XG',tag:'XG',name:'XG kerning'},
  {id:'6',ch:'6',tag:'6',name:'Six'},
  {id:'9',ch:'9',tag:'9',name:'Nine'},
  {id:'2',ch:'2',tag:'2',name:'Two'},
  {id:'a',ch:'a',tag:'a',name:'a'},
  {id:'a-alt',ch:AF,tag:'a_pied',name:'a, alternate with foot',note:'U+E000'},
  {id:'Q',ch:'Q',tag:'Q',name:'Q'},
  {id:'R',ch:'R',tag:'R',name:'R'},
  {id:'R-alt',ch:RP,tag:'R_droit',name:'R, alternate with straight leg',note:'U+E001'},
  {id:'comma',ch:',',tag:'virgule',name:'Comma'},
  {id:'apostrophe',ch:'’',tag:'apostrophe',name:'Apostrophe'}
];

// global view state: one width (0-6) or all (-1), roman or italic
const st={w:3,ita:false};
try{const s=JSON.parse(localStorage.getItem('xgview')||'null'); if(s&&s.w>=-1&&s.w<7){st.w=s.w;st.ita=!!s.ita;}}catch(e){}

// lightbox
const lb=$('lb'), lbImg=$('lbImg');
function openLB(src,alt){lbImg.src=src;lbImg.alt=alt;lb.hidden=false;document.body.style.overflow='hidden';}
function closeLB(){lb.hidden=true;document.body.style.overflow='';lbImg.removeAttribute('src');}
$('lbClose').addEventListener('click',closeLB);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!lb.hidden)closeLB();});

// controls
const widths=$('widths'), slant=$('slant');
[['3','Standard']].length;
WID.concat(['All']).forEach((w,i)=>{const b=el('button',null,w);b.type='button';b.dataset.w=(w==='All'?-1:i);b.onclick=()=>{st.w=+b.dataset.w;draw();};widths.appendChild(b);});
[['0','Roman'],['1','Italic']].forEach(([v,l])=>{const b=el('button',null,l);b.type='button';b.dataset.i=v;b.onclick=()=>{st.ita=v==='1';draw();};slant.appendChild(b);});

const index=$('index'), box=$('specimens'), views=[];
GLYPHS.forEach(it=>{
  const a=el('a',null,it.ch); a.href='#'+it.id; a.setAttribute('aria-label',it.name); index.appendChild(a);
  const s=el('section','spec'); s.id=it.id;
  const h=el('div','s-head');
  h.appendChild(el('span','s-glyph',it.ch)); h.appendChild(el('h3','s-name',it.name)); if(it.note) h.appendChild(el('span','s-note',it.note));
  s.appendChild(h);
  const rows=el('div','rows'); s.appendChild(rows); box.appendChild(s);
  views.push({it,rows});
});

function rowImg(it,r){
  const b=el('div','sheet'); b.setAttribute('role','button'); b.tabIndex=0; b.addEventListener('keydown',e=>{if(e.key==='Enter')b.click();});
  const img=el('img'); img.loading='lazy'; img.decoding='async';
  img.src='img/row_'+it.tag+'_'+(st.ita?'ita':'rom')+'_'+r+'.webp?v=3';
  img.alt=it.name+', '+WID[r]+(st.ita?' Italic':'')+', Lateral left and XG Flex Custom right, seven weights';
  img.addEventListener('load',()=>{img.style.maxWidth=Math.round(img.naturalWidth/1.6)+'px';img.style.margin='0';});
  b.appendChild(img); b.onclick=()=>openLB(img.src,img.alt);
  return b;
}
function draw(){
  views.forEach(({it,rows})=>{
    rows.textContent='';
    const list=st.w<0?[0,1,2,3,4,5,6]:[st.w];
    list.forEach(r=>{ if(st.w<0) rows.appendChild(el('p','rowlab',WID[r]+(st.ita?' Italic':''))); rows.appendChild(rowImg(it,r)); });
  });
  widths.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.w===st.w)));
  slant.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.i==='1')===st.ita)));
  try{localStorage.setItem('xgview',JSON.stringify(st));}catch(e){}
}
draw();
{const on=widths.querySelector('[aria-pressed="true"]'); if(on&&widths.scrollWidth>widths.clientWidth) widths.scrollLeft=on.offsetLeft-widths.offsetLeft-16;}

// tester
const tW=$('tWid'), tG=$('tWgt'), tI=$('tIta'), tT=$('tText');
WID.forEach((w,i)=>tW.appendChild(new Option(w,i))); WGT.forEach((w,i)=>tG.appendChild(new Option(w,i)));
tW.value=3; tG.value=4;
function render(){const i=tI.getAttribute('aria-pressed')==='true';tT.style.fontStretch=STR[+tW.value]+'%';tT.style.fontWeight=NUM[+tG.value];tT.style.fontStyle=i?'italic':'normal';}
tW.onchange=render; tG.onchange=render; tI.onclick=()=>{tI.setAttribute('aria-pressed',String(tI.getAttribute('aria-pressed')!=='true'));render();};
render();
})();
