
// Confetti palette remains colorful regardless of theme
const SOFT_COLORS = ["#FFD36E","#FF9FB3","#7BE3FF","#AEF1CF","#BCA8FF"];

const App = (()=>{
  function ripple(el,x,y){ const r=document.createElement("span"); r.className="ripple"; r.style.left=x+"px"; r.style.top=y+"px"; el.appendChild(r); setTimeout(()=>r.remove(),650); }

  function softBurst(x=innerWidth/2,y=innerHeight/2){
    const c=document.createElement("canvas"); c.className="softburst"; document.body.appendChild(c);
    const ctx=c.getContext("2d"); const DPR=Math.max(1,devicePixelRatio||1);
    const resize=()=>{ c.width=innerWidth*DPR; c.height=innerHeight*DPR; }; resize();
    const colors=[...SOFT_COLORS];
    const N=140; const parts=Array.from({length:N},()=>({x:x*DPR,y:y*DPR,r:6+Math.random()*18,a:Math.random()*Math.PI*2,v:2+Math.random()*3,life:60+Math.random()*40,color:colors[Math.floor(Math.random()*colors.length)]}));
    let t=0; (function loop(){ ctx.clearRect(0,0,c.width,c.height);
      for(const p of parts){ p.x+=Math.cos(p.a)*p.v; p.y+=Math.sin(p.a)*p.v; p.life--; ctx.globalAlpha=Math.max(0,p.life/100); ctx.beginPath(); ctx.fillStyle=p.color; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
      if(++t<110) requestAnimationFrame(loop); else c.remove(); })();
  }

  // speech
  async function speakSeq(list, rate=0.9){ for(const t of list){ await speak(t, rate); await new Promise(r=>setTimeout(r, 100)); } }
  function speak(t, rate=.9){ return new Promise(res=>{ try{ const u=new SpeechSynthesisUtterance(t); u.rate=rate; u.pitch=1.0; u.onend=res; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){ res(); } }); }

  // WebAudio
  const AC=window.AudioContext||window.webkitAudioContext; let ctx=null;
  function ensureAudio(){ if(!ctx){ ctx=new AC(); } return ctx; }
  function tone(f=440,d=.25,type="sine",vol=.8){ ensureAudio(); const o=ctx.createOscillator(), g=ctx.createGain(); o.type=type; o.frequency.value=f; o.connect(g); g.connect(ctx.destination);
    const t=ctx.currentTime; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.start(t); o.stop(t+d+.02); }
  function pop(){ tone(320,.18,"sine",.9); }

  // touch trails
  let trailsOn = true, lastTrail = 0;
  function enableTrails(on=true){ trailsOn = on; }
  function sparkle(x,y){
    const s=document.createElement("div");
    s.style.position="fixed"; s.style.left=x+"px"; s.style.top=y+"px"; s.style.width="10px"; s.style.height="10px";
    s.style.borderRadius="50%"; s.style.pointerEvents="none"; s.style.zIndex=1500;
    s.style.background=SOFT_COLORS[Math.floor(Math.random()*SOFT_COLORS.length)];
    s.style.opacity="0.95"; s.style.transform="translate(-50%,-50%) scale(1)";
    s.style.transition="transform .45s ease, opacity .45s ease";
    document.body.appendChild(s);
    requestAnimationFrame(()=>{ s.style.transform="translate(-50%,-50%) scale(0.2)"; s.style.opacity="0"; });
    setTimeout(()=>s.remove(), 500);
  }

  // baby lock
  function injectLock(){
    const fab=document.createElement("button"); fab.className="button lock-fab"; fab.textContent="🔒 Baby Lock"; fab.setAttribute("aria-label","Enable Baby Lock");
    document.body.appendChild(fab);
    const ov=document.createElement("div"); ov.className="lock-overlay"; ov.innerHTML=`
      <div class="lock-corner" aria-hidden="true"></div>
      <div class="badge">🔒 Locked — triple‑tap top‑left to exit</div>`;
    document.body.appendChild(ov);
    let locked=false, taps=0, tapTimer=null;
    function lock(){ locked=true; ov.style.display="flex"; }
    function unlock(){ locked=false; ov.style.display="none"; taps=0; clearTimeout(tapTimer); }
    fab.addEventListener("click", lock);
    ov.addEventListener("touchmove", e=>e.preventDefault(), {passive:false});
    ov.addEventListener("click", e=>{ /* swallow */ });
    ov.querySelector(".lock-corner").addEventListener("click", ()=>{
      taps++; if(tapTimer) clearTimeout(tapTimer);
      tapTimer=setTimeout(()=>{ taps=0; }, 900);
      if(taps>=3){ unlock(); }
    });
  }


  // fullscreen helpers
  function toggleFullscreen(target=document.documentElement){
    try{
      if (!document.fullscreenElement) {
        (target.requestFullscreen||target.webkitRequestFullscreen||target.msRequestFullscreen||function(){})();
      } else {
        (document.exitFullscreen||document.webkitExitFullscreen||document.msExitFullscreen||function(){})();
      }
    }catch(e){}
  }
  function addFullscreenFab(){
    // Hide in iOS standalone where fullscreen is redundant
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) return;
    const btn=document.createElement('button'); btn.className='button fs-fab'; btn.textContent='⤢ Fullscreen';
    btn.setAttribute('aria-label','Toggle Fullscreen');
    btn.addEventListener('click', ()=>toggleFullscreen());
    document.body.appendChild(btn);
  }

  function init(){
    const unlock = ()=>{ try{ ensureAudio().resume(); }catch(e){} window.removeEventListener("pointerdown", unlock); }; window.addEventListener("pointerdown", unlock, {once:true});
    window.addEventListener("pointermove", e=>{
      if(!trailsOn) return;
      const now=performance.now(); if(now-lastTrail<18) return; lastTrail=now;
      sparkle(e.clientX, e.clientY);
    });
    injectLock();
    addFullscreenFab();
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
  }

  return { ripple, softBurst, speak, speakSeq, tone, pop, init, enableTrails, toggleFullscreen };
})();
