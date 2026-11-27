/* UniVerse v11 — global chrome: search, a11y (zoom + contrast), cookie banner, sticky apply chip. Language-aware (ar/en). */
(function(){
var EN=document.documentElement.lang==='en';
var T=EN?{
  search:'Search',zin:'Increase font size',zout:'Decrease font size',zreset:'Default font size',
  hc:'High contrast',
  ck:'We use cookies to improve your experience on our site. By continuing to browse you agree to our <a href="legal.html#privacy">privacy policy</a>.',
  ok:'Got it',apply:'Apply Now'
}:{
  search:'بحث',zin:'تكبير الخط',zout:'تصغير الخط',zreset:'الحجم الافتراضي',
  hc:'تباين أعلى',
  ck:'نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. بمتابعة التصفح أنت توافق على <a href="legal.html#privacy">سياسة الخصوصية</a>.',
  ok:'موافق',apply:'قدّم الآن'
};
var reduced=false;
try{reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}

// 1) real search submit from the overlay
var si=document.getElementById('srchInput');
if(si){
  var go=function(){var q=si.value.trim();if(q)location.href='search.html?q='+encodeURIComponent(q)};
  si.addEventListener('keydown',function(e){if(e.key==='Enter')go()});
  var fld=si.closest('.fld');
  if(fld){var b=document.createElement('button');b.className='srch-go';b.textContent=T.search;b.type='button';b.onclick=go;fld.appendChild(b);}
}
// 2) font-size + contrast accessibility controls in the utility bar
var ul=document.querySelector('.u-l');
if(ul){
  var wrap=document.createElement('span');wrap.className='u-a11y';
  wrap.innerHTML='<button type="button" data-z="out" aria-label="'+T.zout+'" title="'+T.zout+'">A−</button><button type="button" data-z="reset" aria-label="'+T.zreset+'" title="'+T.zreset+'">A</button><button type="button" data-z="in" aria-label="'+T.zin+'" title="'+T.zin+'">A+</button><button type="button" data-hc="1" aria-label="'+T.hc+'" title="'+T.hc+'" class="hcbtn"><svg viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/></svg></button>';
  ul.insertBefore(wrap,ul.firstChild);
  var zs=[1,1.125,1.25],cur=0;
  try{cur=parseInt(localStorage.getItem('uv_zi')||'0',10);if(!(cur>=0&&cur<=2))cur=0;}catch(e){}
  var apply=function(){document.body.style.zoom=zs[cur];try{localStorage.setItem('uv_zi',String(cur));}catch(e){}};
  if(cur)apply();
  var hc=false;
  try{hc=localStorage.getItem('uv_hc')==='1';}catch(e){}
  var applyHc=function(){document.documentElement.classList.toggle('hc',hc);wrap.querySelector('.hcbtn').classList.toggle('on',hc);};
  applyHc();
  wrap.addEventListener('click',function(e){
    var t=e.target.closest('[data-z],[data-hc]');if(!t)return;
    if(t.hasAttribute('data-hc')){hc=!hc;applyHc();try{localStorage.setItem('uv_hc',hc?'1':'0');}catch(e){}return;}
    var z=t.getAttribute('data-z');
    if(z==='in')cur=Math.min(2,cur+1);else if(z==='out')cur=Math.max(0,cur-1);else cur=0;
    apply();
  });
}
// 3) cookie consent banner
try{if(!localStorage.getItem('uv_ck')){
  var cb=document.createElement('div');cb.className='ck';cb.setAttribute('role','region');cb.setAttribute('aria-label','cookies');
  cb.innerHTML='<p>'+T.ck+'</p><button type="button">'+T.ok+'</button>';
  cb.querySelector('button').onclick=function(){cb.classList.add('hide');try{localStorage.setItem('uv_ck','1');}catch(e){}};
  document.body.appendChild(cb);
  setTimeout(function(){cb.classList.add('show')},reduced?0:900);
}}catch(e){}
// 4) sticky apply chip (everywhere except the application and admission pages)
var page=location.pathname.split('/').pop()||'landing.html';
if(page!=='admission.html'&&page!=='apply.html'){
  var ap=document.createElement('a');ap.href='apply.html';ap.className='apply-chip';
  ap.innerHTML=T.apply+'<svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
  if(EN)ap.querySelector('svg').style.transform='scaleX(-1)';
  document.body.appendChild(ap);
  var lastY=scrollY;
  addEventListener('scroll',function(){
    var y=scrollY,down=y>lastY+4,up=y<lastY-4;lastY=y;
    if(y<=650||down)ap.classList.remove('show');
    else if(up)ap.classList.add('show');
  },{passive:true});
}
})();

/* ===== v12: mobile drawer nav + table scroll wrapping ===== */
(function(){
var EN=document.documentElement.lang==='en';
var L=EN?{menu:'Menu',close:'Close',quick:'Quick links',apply:'Apply Now',login:'Sign in'}:{menu:'القائمة',close:'إغلاق',quick:'روابط سريعة',apply:'قدّم الآن',login:'تسجيل الدخول'};

// 1) wrap wide tables so they scroll inside their card instead of breaking the page
document.querySelectorAll('table').forEach(function(t){
  if(t.closest('.tblw')||t.closest('#srch')||t.closest('.mdraw'))return;
  var d=document.createElement('div');d.className='tblw';
  t.parentNode.insertBefore(d,t);d.appendChild(t);
});

// 2) hamburger + slide-in drawer built from the existing desktop nav markup
var mast=document.querySelector('.mast');
if(!mast)return;
var btn=document.createElement('button');
btn.className='mbtn';btn.type='button';btn.setAttribute('aria-label',L.menu);
btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
mast.appendChild(btn);

var back=document.createElement('div');back.className='mback';
var dr=document.createElement('nav');dr.className='mdraw';dr.setAttribute('aria-label',L.menu);
document.body.appendChild(back);document.body.appendChild(dr);

// header
var dh=document.createElement('div');dh.className='md-h';
dh.innerHTML='<span class="wm"><b>Uni</b><span>Verse</span></span>';
var x=document.createElement('button');x.className='md-x';x.type='button';x.setAttribute('aria-label',L.close);
x.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
dh.appendChild(x);dr.appendChild(dh);
var body=document.createElement('div');body.className='md-b';dr.appendChild(body);

// groups cloned from .mnav
var mnav=document.querySelector('.mnav');
if(mnav){
  mnav.querySelectorAll(':scope > div').forEach(function(g){
    var nl=g.querySelector(':scope > .nl');var dd=g.querySelector(':scope > .dd');
    if(!nl)return;
    if(!dd&&nl.tagName==='A'){
      var top=document.createElement('a');top.className='md-top';top.href=nl.getAttribute('href');
      top.textContent=nl.textContent.trim();
      top.innerHTML+='<svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
      if(EN)top.querySelector('svg').style.transform='scaleX(-1)';
      body.appendChild(top);return;
    }
    if(!dd)return;
    var grp=document.createElement('div');grp.className='mg';
    var gb=document.createElement('button');gb.type='button';
    gb.textContent=nl.textContent.trim();
    gb.innerHTML+='<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';
    var list=document.createElement('div');list.className='md-l';
    var li=document.createElement('div');li.className='md-li';
    dd.querySelectorAll('a').forEach(function(a){
      var c=document.createElement('a');c.href=a.getAttribute('href');
      var clone=a.cloneNode(true);
      clone.querySelectorAll('small').forEach(function(s){s.remove();});
      c.textContent=clone.textContent.trim();
      li.appendChild(c);
    });
    list.appendChild(li);grp.appendChild(gb);grp.appendChild(list);
    gb.addEventListener('click',function(){grp.classList.toggle('open');});
    body.appendChild(grp);
  });
}

// quick utility links
var util=document.querySelector('.util nav');
if(util){
  var qu=document.createElement('div');qu.className='md-util';
  qu.setAttribute('aria-label',L.quick);
  util.querySelectorAll('a').forEach(function(a){
    var c=document.createElement('a');c.href=a.getAttribute('href');c.textContent=a.textContent.trim();
    qu.appendChild(c);
  });
  body.appendChild(qu);
}

// actions: apply + login + language switch
var acts=document.createElement('div');acts.className='md-a';
var ap=document.createElement('a');ap.className='md-apply';ap.href='apply.html';ap.textContent=L.apply;
acts.appendChild(ap);
var login=document.querySelector('.macts .btn-login');
if(login){var lg=document.createElement('a');lg.className='md-login';lg.href=login.getAttribute('href');lg.textContent=login.textContent.trim();acts.appendChild(lg);}
var lang=document.querySelector('.u-lang');
if(lang){var la=document.createElement('a');la.className='md-lang';la.href=lang.getAttribute('href');la.textContent=lang.textContent.trim();acts.appendChild(la);}
dr.appendChild(acts);

// open/close wiring
var root=document.documentElement;
function open(){root.classList.add('mopen');btn.setAttribute('aria-expanded','true');}
function close(){root.classList.remove('mopen');btn.setAttribute('aria-expanded','false');}
btn.setAttribute('aria-expanded','false');
btn.addEventListener('click',function(){root.classList.contains('mopen')?close():open();});
back.addEventListener('click',close);
x.addEventListener('click',close);
dr.addEventListener('click',function(e){if(e.target.closest('a'))close();});
document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();

/* v12.1: abbreviate long EN weekday headers on narrow screens */
(function(){
if(document.documentElement.lang!=='en')return;
function abbr(){var small=innerWidth<560;document.querySelectorAll('.cal .dh').forEach(function(d){
  if(!d.dataset.full)d.dataset.full=d.textContent;
  d.textContent=small?d.dataset.full.slice(0,3):d.dataset.full;
});}
abbr();addEventListener('resize',abbr,{passive:true});
// calendar grid may render after this script; re-run shortly after load
setTimeout(abbr,300);setTimeout(abbr,1200);
})();
