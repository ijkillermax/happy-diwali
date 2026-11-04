(function(){
var $=function(i){return document.getElementById(i)};
var KEY=[0x5a,0x17,0xc3,0x8e,0x31,0xd4,0x6b,0xa9];
function hx(x){return ('0'+x.toString(16)).slice(-2)}
function clean(t){return Array.from(String(t).replace(/[\u0000-\u001f<>]/g,'').trim()).slice(0,24).join('')}
/* random salt + XOR with key + checksum, written as hex (obfuscation, not encryption) */
function enc(t){
  var by=Array.from(new TextEncoder().encode(t)),s=Math.floor(Math.random()*254)+1,o=[s],sum=0;
  by.forEach(function(x,i){sum=(sum+x)&255;o.push(x^KEY[i%KEY.length]^s)});
  o.push(sum^s);return o.map(hx).join('');
}
var out=$('out'),note=$('note');
$('f').addEventListener('submit',function(e){
  e.preventDefault();
  var name=clean($('name').value);
  if(!name){note.textContent='Type a name first.';return}
  var u=new URL('index.html',location.href);
  u.hash=enc(name);
  out.value=u.href;$('open').href=u.href;
  $('res').hidden=false;note.textContent='';out.focus();out.select();
});
$('copy').addEventListener('click',function(){
  var ok=function(){note.textContent='Link copied. Send it with love.'};
  var fail=function(){out.select();try{document.execCommand('copy')?ok():note.textContent='Press Ctrl+C to copy the selected link.'}catch(e){note.textContent='Press Ctrl+C to copy the selected link.'}};
  try{navigator.clipboard.writeText(out.value).then(ok,fail)}catch(e){fail()}
});
})();
