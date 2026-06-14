// Second patch: bake the "app-only" isolation into index.html.
// Injects a script in the outer <head> that survives the bundle's
// documentElement swap, waits for the React app to mount, then strips the
// design-spec column + drawn phone frame so ONLY the EPUB reader shows
// fullscreen. Self-healing via a lightweight interval (handles remounts).
const fs = require('fs');
const f = 'index.html';
let s = fs.readFileSync(f, 'utf8');

const APP_ONLY = `(function(){
  var DESC='Full build';
  function A(el,arr){for(var i=0;i<arr.length;i++){var d=arr[i],j=d.indexOf(':');try{el.style.setProperty(d.slice(0,j),d.slice(j+1),'important');}catch(e){}}}
  function isolate(){
    if(!document.body) return false;
    var labels=[].slice.call(document.querySelectorAll('*')).filter(function(e){return /Bibliothek/.test(e.textContent||'');});
    if(!labels.length) return false;
    labels.sort(function(a,b){return a.querySelectorAll('*').length-b.querySelectorAll('*').length;});
    var screen=labels[0];
    while(screen.parentElement&&screen.parentElement!==document.body&&(screen.parentElement.textContent||'').indexOf(DESC)<0)screen=screen.parentElement;
    var cur=screen;
    while(cur&&cur.parentElement&&cur!==document.documentElement){
      var k=[].slice.call(cur.parentElement.children);
      for(var i=0;i<k.length;i++)if(k[i]!==cur)k[i].style.setProperty('display','none','important');
      cur=cur.parentElement;
    }
    var a=screen.parentElement,U=['overflow:visible','transform:none','border-radius:0','border:0','box-shadow:none','max-width:none','min-width:0','width:auto','height:auto','padding:0','margin:0','background:#fff','filter:none','clip-path:none','aspect-ratio:auto'];
    while(a){A(a,U);if(a===document.documentElement)break;a=a.parentElement;}
    A(screen,['position:fixed','top:0','left:0','right:0','bottom:0','width:100vw','height:100vh','height:100dvh','max-width:none','max-height:none','min-width:0','margin:0','border:0','border-radius:0','box-shadow:none','outline:0','overflow-y:auto','overflow-x:hidden','background:#fff','z-index:2147483647','transform:none','filter:none','clip-path:none','aspect-ratio:auto','padding:0']);
    screen.setAttribute('data-rand-app','1');
    var inner=[].slice.call(screen.querySelectorAll('*'));
    inner.forEach(function(e){var t=(e.textContent||'').trim();if(/^9:41$/.test(t)){var p=e;for(var x=0;x<3&&p&&p!==screen;x++){if((p.textContent||'').trim().length<24)p.style.setProperty('display','none','important');p=p.parentElement;}}});
    inner.forEach(function(e){var r=e.getBoundingClientRect();if(r.top>80||r.height>60||r.width>240||r.width<40)return;var cs=getComputedStyle(e),m=(cs.backgroundColor||'').match(/(\\d+),\\s*(\\d+),\\s*(\\d+)/);if(m&&(+m[1]+ +m[2]+ +m[3])<150&&(e.textContent||'').trim().length===0)e.style.setProperty('display','none','important');});
    document.documentElement.style.setProperty('background','#fff','important');
    document.body.style.setProperty('background','#fff','important');
    document.body.style.setProperty('overflow','hidden','important');
    return true;
  }
  setInterval(function(){
    if(document.querySelector('[data-rand-app]'))return;
    if(/Bibliothek/.test((document.body&&document.body.textContent)||''))isolate();
  },150);
})();`;

const anchor = `  <script>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('SW registration failed', e); });
      });
    }
  </script>`;

const parts = s.split(anchor);
if (parts.length !== 2) throw new Error('SW anchor not unique: ' + (parts.length - 1));
s = parts[0] + anchor + '\n  <script>\n' + APP_ONLY + '\n  </script>' + parts[1];

fs.writeFileSync(f, s);
console.log('patch2 applied: app-only isolation injected');
