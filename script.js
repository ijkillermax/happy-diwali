(function(){
var $=function(i){return document.getElementById(i)};
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var q=reduce?.5:1;

/* mandala */
(function(){
  var s='<svg viewBox="0 0 400 400" fill="none" stroke="#ffb627" stroke-width="1.2"><g transform="translate(200 200)">';
  for(var i=0;i<12;i++)s+='<ellipse cx="0" cy="-130" rx="22" ry="62" transform="rotate('+i*30+')"/>';
  for(var j=0;j<24;j++)s+='<ellipse cx="0" cy="-165" rx="9" ry="26" stroke="#ff7a18" transform="rotate('+(j*15+7.5)+')"/>';
  s+='<circle r="62"/><circle r="40" stroke="#e0245e"/><circle r="190" stroke-dasharray="2 8"/></g></svg>';
  $('mandala').innerHTML=s;
})();

/* fireworks */
var cv=$('fx'),c=cv.getContext('2d'),W,H,rockets=[],ps=[];
function size(){var d=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}
size();addEventListener('resize',size);
var hues=[42,28,340,290,190,120,8];
function rnd(a,b){return a+Math.random()*(b-a)}
function launch(x,y,hue){rockets.push({x:x+rnd(-50,50),y:H+10,tx:x,ty:y,h:hue==null?hues[Math.floor(Math.random()*hues.length)]:hue,sp:rnd(.04,.06)})}
function boom(x,y,hue,k){
  k=k||1;var n=Math.round(rnd(70,110)*q*k),ring=Math.random()<.4,two=Math.random()<.35;
  for(var i=0;i<n;i++){
    var a=i/n*Math.PI*2+rnd(0,.1),sp=ring?4*k+.4:rnd(.5,5.2)*k;
    ps.push({x:x,y:y,px:x,py:y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,l:1,d:rnd(.008,.018),h:two&&i%2?hue+150:hue+rnd(-14,14),sz:rnd(1.2,2.6),cr:Math.random()<.18&&k>.6});
  }
}
function crackle(p){for(var i=0;i<5;i++){var a=rnd(0,6.3),s=rnd(.5,2.4);ps.push({x:p.x,y:p.y,px:p.x,py:p.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:.7,d:.05,h:p.h,sz:1.2,cr:false})}}
function frame(){
  requestAnimationFrame(frame);
  if(!rockets.length&&!ps.length)return;
  c.clearRect(0,0,W,H);c.globalCompositeOperation='lighter';c.lineCap='round';
  for(var i=rockets.length-1;i>=0;i--){
    var r=rockets[i];r.y+=(r.ty-r.y)*r.sp-2.4;r.x+=(r.tx-r.x)*.03;
    ps.push({x:r.x,y:r.y,px:r.x,py:r.y,vx:rnd(-.3,.3),vy:rnd(.2,1),l:.6,d:.06,h:r.h,sz:1.4,cr:false});
    c.fillStyle='hsl('+r.h+',100%,80%)';c.beginPath();c.arc(r.x,r.y,2.2,0,6.3);c.fill();
    if(r.y<=r.ty+8){boom(r.x,r.y,r.h,r.k);rockets.splice(i,1)}
  }
  for(var j=ps.length-1;j>=0;j--){
    var p=ps[j];p.px=p.x;p.py=p.y;p.vx*=.985;p.vy=p.vy*.985+.045;p.x+=p.vx;p.y+=p.vy;p.l-=p.d;
    if(p.l<=0){if(p.cr)crackle(p);ps.splice(j,1);continue}
    c.strokeStyle='hsla('+p.h+',100%,'+(55+p.l*20)+'%,'+p.l+')';c.lineWidth=p.sz;
    c.beginPath();c.moveTo(p.px,p.py);c.lineTo(p.x,p.y);c.stroke();
  }
  c.globalCompositeOperation='source-over';
}
frame();
function barrage(n){for(var i=0;i<n;i++)(function(i){setTimeout(function(){launch(rnd(W*.1,W*.9),rnd(H*.1,H*.5))},i*300)})(i)}

addEventListener('click',function(e){
  if(e.target.closest&&e.target.closest('button,input,label,a'))return;
  launch(e.clientX,e.clientY);
});
/* sparkler: drag or move the pointer */
addEventListener('pointermove',function(e){
  if(e.pointerType==='mouse'||e.buttons){
    for(var i=0;i<2;i++){var a=rnd(0,6.3),s=rnd(.3,2);ps.push({x:e.clientX,y:e.clientY,px:e.clientX,py:e.clientY,vx:Math.cos(a)*s,vy:Math.sin(a)*s-.6,l:.8,d:.045,h:rnd(30,48),sz:1.1,cr:false})}
  }
});

/* name: only read from a private token in the link (?to=<token> or #<token>) */
var nameVal='',title=$('title'),wish=$('wish');
function render(){
  var n=nameVal;
  title.textContent=n?'Happy Diwali, '+n:'Happy Diwali';
  wish.textContent='Wishing '+(n||'you')+' a Diwali glowing with light, joy, love, health and wealth. May every diya lit tonight keep your home bright all year.';
}
var KEY=[0x5a,0x17,0xc3,0x8e,0x31,0xd4,0x6b,0xa9];
function clean(t){return Array.from(String(t).replace(/[\u0000-\u001f<>]/g,'').trim()).slice(0,24).join('')}
function dec(h){
  try{
    if(!/^([0-9a-f]{2}){3,}$/i.test(h))return '';
    var o=[];for(var i=0;i<h.length;i+=2)o.push(parseInt(h.substr(i,2),16));
    var s=o[0],ck=o[o.length-1]^s,sum=0;
    var by=o.slice(1,-1).map(function(x,i){return x^KEY[i%KEY.length]^s});
    by.forEach(function(x){sum=(sum+x)&255});
    if(sum!==ck)return '';
    return new TextDecoder().decode(new Uint8Array(by));
  }catch(e){return ''}
}
function fromUrl(){
  var t='';
  try{t=new URLSearchParams(location.search).get('to')||''}catch(e){}
  if(!t)t=location.hash.slice(1);
  return clean(dec(t));
}
function apply(){nameVal=fromUrl();render()}
apply();
addEventListener('hashchange',apply);

/* diyas */
var words=['Light','Joy','Love','Health','Wealth'],lit=0,box=$('diyas');
var art='<svg viewBox="0 0 100 82" aria-hidden="true"><g class="flame"><path d="M50 2C61 19 67 31 50 46C33 31 39 19 50 2Z" fill="url(#fl)"/><path d="M50 22C55 31 56 37 50 43C44 37 45 31 50 22Z" fill="#fffbe0" opacity=".85"/></g><rect x="48.8" y="43" width="2.4" height="7" fill="#2a1008"/><path d="M6 50Q50 98 94 50Q94 44 50 44Q6 44 6 50Z" fill="url(#cl)"/><ellipse cx="50" cy="48" rx="44" ry="6" fill="#f59a3d"/><ellipse cx="50" cy="48" rx="36" ry="3.4" fill="#6b2410"/><circle cx="30" cy="62" r="2.6" fill="#ffb627"/><circle cx="50" cy="70" r="2.6" fill="#ffb627"/><circle cx="70" cy="62" r="2.6" fill="#ffb627"/></svg>';
words.forEach(function(w){
  var b=document.createElement('button');b.type='button';b.className='diya';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Light the diya of '+w);
  b.innerHTML='<div class="glow"></div>'+art+'<span>'+w+'</span>';
  b.addEventListener('click',function(){
    if(b.classList.contains('lit'))return;
    b.classList.add('lit');b.setAttribute('aria-pressed','true');lit++;
    var r=b.getBoundingClientRect();
    rockets.push({x:r.left+r.width/2,y:r.top,tx:r.left+r.width/2,ty:Math.max(60,r.top-rnd(130,230)),h:hues[lit%hues.length],sp:.06,k:.6});
    if(lit<5){$('hint').textContent=lit+' of 5 lit. '+(5-lit)+' to go.'}
    else{
      $('hint').textContent='';
      setTimeout(function(){$('card').hidden=false;barrage(16)},500);
    }
  });
  box.appendChild(b);
});

/* card actions */
$('sky').addEventListener('click',function(){barrage(14)});

/* opening moment */
setTimeout(function(){launch(W*.25,H*.25)},400);
setTimeout(function(){launch(W*.75,H*.22)},900);
setTimeout(function(){launch(W*.5,H*.15)},1400);
})();
