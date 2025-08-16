// Common for toddlers: theme manager, ripple, gentle confetti, voice + simple WebAudio drums
const App = (()=>{
  const LS = "toddlerThemeV1";
  const THEMES = [
    {name:"Candy Pop",   vars:{bg1:"#0f1226",bg2:"#201848",panel:"#1a1f44cc",card:"#1b214e",card2:"#222a60",accent:"#ffd36e",accent2:"#ff9fb3",accent3:"#7be3ff",accent4:"#aef1cf",accent5:"#bca8ff",text:"#ffffff",muted:"#bfd3ff",outline:"#33407a",pad:"#171d45",padb:"#2b3572"}},
    {name:"Ocean Breeze",vars:{bg1:"#081a2a",bg2:"#123b5a",panel:"#0e253ecc",card:"#0f2a48",card2:"#13335a",accent:"#7be3ff",accent2:"#b0f3ff",accent3:"#aef1cf",accent4:"#ffd36e",accent5:"#ff9fb3",text:"#ecfbff",muted:"#bfe8ff",outline:"#1f4d76",pad:"#0e2542",padb:"#1c4872"}},
    {name:"Sunset Sorbet",vars:{bg1:"#2a0d1c",bg2:"#4a1040",panel:"#311334cc",card:"#3a173f",card2:"#4a1d4f",accent:"#ff9fb3",accent2:"#ffd36e",accent3:"#7be3ff",accent4:"#aef1cf",accent5:"#bca8ff",text:"#fff5f8",muted:"#ffd7e2",outline:"#5a2a6f",pad:"#321540",padb:"#5a2a76"}},
    {name:"Forest Mint", vars:{bg1:"#0d1a14",bg2:"#163a2a",panel:"#0e261ecc",card:"#123428",card2:"#184233",accent:"#aef1cf",accent2:"#7be3ff",accent3:"#ffd36e",accent4:"#ff9fb3",accent5:"#bca8ff",text:"#edfff8",muted:"#c8ffe8",outline:"#1f5a48",pad:"#0e2a22",padb:"#1c5a48"}},
    {name:"High Contrast",vars:{bg1:"#000000",bg2:"#131313",panel:"#111111e6",card:"#111111",card2:"#191919",accent:"#ffd000",accent2:"#ff2a6f",accent3:"#00d5ff",accent4:"#00ffa3",accent5:"#b38cff",text:"#ffffff",muted:"#d9d9d9",outline:"#2a2a2a",pad:"#101010",padb:"#2a2a2a"}},
  ];

  function applyTheme(t){
    const root = document.documentElement;
    root.style.setProperty("--bg1", t.vars.bg1);
    root.style.setProperty("--bg2", t.vars.bg2);
    root.style.setProperty("--panel", t.vars.panel);
    root.style.setProperty("--card", t.vars.card);
    root.style.setProperty("--card2", t.vars.card2);
    root.style.setProperty("--accent", t.vars.accent);
    root.style.setProperty("--accent2", t.vars.accent2);
    root.style.setProperty("--accent3", t.vars.accent3);
    root.style.setProperty("--accent4", t.vars.accent4);
    root.style.setProperty("--accent5", t.vars.accent5);
    root.style.setProperty("--text", t.vars.text);
    root.style.setProperty("--muted", t.vars.muted);
    root.style.setProperty("--outline", t.vars.outline);
    root.style.setProperty("--pad", t.vars.pad);
    root.style.setProperty("--pad-border", t.vars.padb);
  }

  function initTheme(){
    let idx = Number(localStorage.getItem(LS) || "0");
    if (isNaN(idx) || idx<0 || idx>=THEMES.length) idx = 0;
    applyTheme(THEMES[idx]);
    const sel = document.getElementById("themeSel");
    if (sel){
      sel.innerHTML = THEMES.map((t,i)=> `<option value="${i}" ${i===idx?"selected":""}>${t.name}</option>`).join("");
      sel.onchange = ()=>{ const i = Number(sel.value); applyTheme(THEMES[i]); localStorage.setItem(LS, String(i)); };
    }
  }

  // gentle confetti (soft circles)
  function softBurst(x=innerWidth/2, y=innerHeight/2){
    const c = document.createElement("canvas");
    c.className="softburst"; document.body.appendChild(c);
    const ctx=c.getContext("2d"); const DPR = Math.max(1, devicePixelRatio||1);
    const resize=()=>{ c.width=innerWidth*DPR; c.height=innerHeight*DPR; }; resize();
    const colors = [getVar("--accent"), getVar("--accent2"), getVar("--accent3"), getVar("--accent4"), getVar("--accent5")];
    const N=140; const parts = Array.from({length:N}, ()=> ({
      x:x*DPR, y:y*DPR, r: 6 + Math.random()*18, a: Math.random()*Math.PI*2, v: 2 + Math.random()*3, life: 60+Math.random()*40, color: colors[Math.floor(Math.random()*colors.length)]
    }));
    let t=0; (function loop(){
      ctx.clearRect(0,0,c.width,c.height);
      for (const p of parts){
        p.x += Math.cos(p.a)*p.v; p.y += Math.sin(p.a)*p.v; p.life--;
        ctx.globalAlpha = Math.max(0, p.life/100);
        ctx.beginPath(); ctx.fillStyle=p.color; ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
      }
      if (++t<110) requestAnimationFrame(loop); else c.remove();
    })();
  }

  function getVar(name){
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#fff";
  }

  // ripple on tap
  function ripple(el, x, y){
    const r = document.createElement("span");
    r.className="ripple"; r.style.left = x+"px"; r.style.top = y+"px";
    el.appendChild(r); setTimeout(()=> r.remove(), 650);
  }

  // Voice
  function speak(t){ try{ const u=new SpeechSynthesisUtterance(t); u.rate=.95; u.pitch=1.0; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch(e){} }

  // WebAudio simple drums & pops
  function audio(){
    const C = window.AudioContext || window.webkitAudioContext;
    const ctx = new C();
    function pop(){ // short plop
      const o = ctx.createOscillator(), g=ctx.createGain();
      o.type="sine"; o.frequency.value=300; o.connect(g); g.connect(ctx.destination);
      const t=ctx.currentTime; g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.9,t+.01); g.gain.exponentialRampToValueAtTime(.0001,t+.2);
      o.start(t); o.frequency.exponentialRampToValueAtTime(120,t+.2); o.stop(t+.23);
    }
    function kick(){
      const o = ctx.createOscillator(), g=ctx.createGain(); o.type="sine"; o.connect(g); g.connect(ctx.destination);
      const t=ctx.currentTime; o.frequency.setValueAtTime(140,t); o.frequency.exponentialRampToValueAtTime(40,t+.35);
      g.gain.setValueAtTime(1,t); g.gain.exponentialRampToValueAtTime(.0001,t+.35); o.start(t); o.stop(t+.36);
    }
    function snare(){
      const noise = (()=>{ const b=ctx.createBuffer(1, ctx.sampleRate*.2, ctx.sampleRate); const d=b.getChannelData(0);
        for(let i=0;i<d.length;i++){ d[i]= (Math.random()*2-1) * Math.pow(1-i/d.length, 3); } return b; })();
      const s=ctx.createBufferSource(); s.buffer=noise; const g=ctx.createGain(); const hp=ctx.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=2000;
      s.connect(hp); hp.connect(g); g.connect(ctx.destination); const t=ctx.currentTime; g.gain.setValueAtTime(.9,t); g.gain.exponentialRampToValueAtTime(.001,t+.15); s.start(t);
    }
    function hat(){
      const noise = (()=>{ const b=ctx.createBuffer(1, ctx.sampleRate*.05, ctx.sampleRate); const d=b.getChannelData(0);
        for(let i=0;i<d.length;i++){ d[i]= (Math.random()*2-1) } return b; })();
      const s=ctx.createBufferSource(); s.buffer=noise; const g=ctx.createGain(); const hp=ctx.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=6000;
      s.connect(hp); hp.connect(g); g.connect(ctx.destination); const t=ctx.currentTime; g.gain.setValueAtTime(.7,t); g.gain.exponentialRampToValueAtTime(.001,t+.07); s.start(t);
    }
    function tom(freq=220){
      const o = ctx.createOscillator(), g=ctx.createGain(); o.type="sine"; o.frequency.value=freq; o.connect(g); g.connect(ctx.destination);
      const t=ctx.currentTime; g.gain.setValueAtTime(1,t); g.gain.exponentialRampToValueAtTime(.0001,t+.25); o.start(t); o.stop(t+.26);
    }
    return { pop, kick, snare, hat, tom };
  }

  return { initTheme, THEMES, softBurst, ripple, speak, audio };
})();