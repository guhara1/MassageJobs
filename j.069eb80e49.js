(function(){var b=document.querySelector('.rsel'),p=document.getElementById('rp');if(!b||!p)return;
b.addEventListener('click',function(){var o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',o?'false':'true');p.hidden=o;});
var q=document.getElementById('q'),s=document.getElementById('sug'),R=null,C=[["massage", "마사지"], ["swedish", "스웨디시"], ["oneshop", "1인샵"], ["skin", "피부관리"]];
function load(cb){if(R)return cb(R);fetch('/r.json').then(function(r){return r.json()}).then(function(j){R=j;cb(R)}).catch(function(){})}
function esc(t){return t.replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function find(v){var o=[];v=v.replace(/\s+/g,'');if(!v)return o;
C.forEach(function(c){if(c[1].indexOf(v)>=0||v.indexOf(c[1])>=0)o.push([c[1]+' 공고','/work/'+c[0]+'/','업종'])});
R.forEach(function(sd){if(sd.n.indexOf(v)>=0)o.push([sd.n,'/local/'+sd.s+'/','시·도']);
sd.g.forEach(function(g){var gn=g.n.replace(/\s/g,'');if(gn.indexOf(v)>=0)o.push([g.n,'/local/'+g.s+'/',sd.n]);
g.d.forEach(function(d){if(d.n.indexOf(v)>=0&&o.length<40)o.push([d.n,'/local/'+g.s+'/'+d.s+'/',sd.n+' '+g.n])})})});return o.slice(0,8)}
function show(){var v=q.value.trim();if(!v){s.hidden=true;return}load(function(){var o=find(v);if(!o.length){s.hidden=true;return}
s.innerHTML=o.map(function(x){return '<a href="'+x[1]+'">'+esc(x[0])+'<small>'+esc(x[2])+'</small></a>'}).join('');s.hidden=false})}
q.addEventListener('input',show);q.addEventListener('focus',show);
document.addEventListener('click',function(e){if(!s.contains(e.target)&&e.target!==q)s.hidden=true});
q.form.addEventListener('submit',function(e){e.preventDefault();load(function(){var o=find(q.value.trim());location.href=o.length?o[0][1]:'/local/'})});
})();