// ============================================================
// PRINT3D STUDIO — canvas-deco.js v2.0
// Animazioni decorative canvas — contestualmente precise
// ============================================================

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const RED   = '#e53e3e';
  const RED_A = (a) => `rgba(229,62,62,${a})`;
  const WH_A  = (a) => `rgba(255,255,255,${a})`;
  const rand  = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const mob   = () => window.innerWidth < 768;

  function makeCanvas(styles) {
    const c = document.createElement('canvas');
    Object.assign(c.style, { position:'absolute', pointerEvents:'none', zIndex:'0', ...styles });
    return c;
  }

  // ── 1. NAV — particelle rosse/bianche (come in foto) ──────
  function initNavParticles() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const canvas = makeCanvas({ inset:'0', width:'100%', height:'100%', opacity:'0.75' });
    nav.style.overflow = 'hidden';
    nav.insertBefore(canvas, nav.firstChild);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    function resize() {
      const r = nav.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W*dpr; canvas.height = H*dpr;
      canvas.style.width = W+'px'; canvas.style.height = H+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize();
    const N = mob() ? 22 : 40;
    const pts = Array.from({length:N},(_,i)=>({
      x:rand(0,1), y:rand(0,1),
      vx:rand(-0.025,0.025)*(Math.random()>.5?1:-1),
      vy:rand(-0.012,0.012),
      r:rand(1.2,2.6), o:rand(0.25,0.7),
      red:i<Math.ceil(N*0.2),
      ph:rand(0,Math.PI*2), fr:rand(0.35,0.85),
    }));
    let t=0, raf;
    (function loop(){
      ctx.clearRect(0,0,W,H); t+=0.016;
      pts.forEach(p=>{
        p.x+=p.vx*0.016; p.y+=p.vy*0.016;
        if(p.x<-0.03)p.x=1.03; if(p.x>1.03)p.x=-0.03;
        if(p.y<-0.08)p.y=1.08; if(p.y>1.08)p.y=-0.08;
        const a=(p.o*(0.65+Math.sin(t*p.fr+p.ph)*0.35)).toFixed(3);
        ctx.beginPath(); ctx.arc(p.x*W,p.y*H,p.r,0,Math.PI*2);
        if(p.red){ctx.shadowBlur=5;ctx.shadowColor=RED;ctx.fillStyle=RED_A(a);}
        else{ctx.shadowBlur=0;ctx.fillStyle=WH_A((+a*0.45).toFixed(3));}
        ctx.fill();
      });
      ctx.shadowBlur=0; raf=requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',()=>{cancelAnimationFrame(raf);resize();},{passive:true});
  }

  // ── 2. FOOTER — rete nodi connessi (stile PCB) ────────────
  function initFooterMesh() {
    const footer = document.querySelector('footer');
    if(!footer) return;
    const canvas = makeCanvas({inset:'0',width:'100%',height:'100%',opacity:'0.28'});
    if(getComputedStyle(footer).position==='static') footer.style.position='relative';
    footer.insertBefore(canvas,footer.firstChild);
    const ctx=canvas.getContext('2d');
    let W=0,H=0,nodes=[];
    function build(){
      W=footer.offsetWidth; H=footer.offsetHeight;
      canvas.width=W; canvas.height=H;
      const step=mob()?70:90; nodes=[];
      const cols=Math.ceil(W/step), rows=Math.ceil(H/step);
      for(let r=0;r<=rows;r++) for(let c=0;c<=cols;c++)
        nodes.push({
          bx:(c/cols)*W, by:(r/rows)*H,
          x:(c/cols)*W+rand(-10,10), y:(r/rows)*H+rand(-8,8),
          vx:rand(-0.06,0.06), vy:rand(-0.04,0.04),
          r:rand(0.8,1.8), red:Math.random()>0.82, a:rand(0.2,0.55),
        });
    }
    build();
    const DIST=100;
    (function loop(){
      ctx.clearRect(0,0,W,H);
      nodes.forEach(n=>{
        n.x+=n.vx; n.y+=n.vy;
        n.x+=(n.bx-n.x)*0.003; n.y+=(n.by-n.y)*0.003;
      });
      for(let i=0;i<nodes.length;i++) for(let j=i+1;j<nodes.length;j++){
        const a=nodes[i],b=nodes[j];
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<DIST){
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
          ctx.strokeStyle=RED_A(((1-d/DIST)*0.1).toFixed(3));
          ctx.lineWidth=0.5; ctx.stroke();
        }
      }
      nodes.forEach(n=>{
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle=n.red?RED_A(n.a.toFixed(3)):WH_A((n.a*0.35).toFixed(3)); ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',build,{passive:true});
  }

  // ── 3. HOME — ticker-bar: scintille integrate nel flusso ──
  function initTickerSparkles() {
    const ticker=document.querySelector('.ticker-bar');
    if(!ticker) return;
    const canvas=makeCanvas({inset:'0',width:'100%',height:'100%',zIndex:'2'});
    ticker.style.position='relative'; ticker.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    let W=0,H=0;
    function resize(){W=ticker.offsetWidth;H=ticker.offsetHeight;canvas.width=W;canvas.height=H;}
    resize();
    const sparks=[]; let frame=0;
    (function loop(){
      ctx.clearRect(0,0,W,H); frame++;
      if(frame%20===0) sparks.push({x:rand(0,W),y:rand(H*.15,H*.85),life:0,max:rand(50,110),r:rand(.8,2),red:Math.random()>.55});
      for(let i=sparks.length-1;i>=0;i--){
        const s=sparks[i]; s.life++;
        const p=s.life/s.max;
        const a=p<.2?(p/.2)*.75:(1-(p-.2)/.8)*.75;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        if(s.red){ctx.shadowBlur=4;ctx.shadowColor=RED;ctx.fillStyle=RED_A(a.toFixed(3));}
        else{ctx.shadowBlur=0;ctx.fillStyle=WH_A((a*.35).toFixed(3));}
        ctx.fill(); ctx.shadowBlur=0;
        if(s.life>=s.max) sparks.splice(i,1);
      }
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',resize,{passive:true});
  }

  // ── 4. HOME — CTA strip: particelle angolari ──────────────
  function initHomeCtaParticles() {
    const cta=document.querySelector('.cta-strip');
    if(!cta) return;
    const canvas=makeCanvas({inset:'0',width:'100%',height:'100%'});
    if(getComputedStyle(cta).position==='static') cta.style.position='relative';
    cta.insertBefore(canvas,cta.firstChild);
    const ctx=canvas.getContext('2d');
    let W=0,H=0,pts=[];
    function build(){
      W=cta.offsetWidth; H=cta.offsetHeight; canvas.width=W; canvas.height=H;
      const M=80;
      pts=Array.from({length:18},()=>{
        const corner=Math.floor(Math.random()*4);
        return{x:corner%2===0?rand(0,M):rand(W-M,W),y:corner<2?rand(0,M):rand(H-M,H),
          vx:rand(-.18,.18),vy:rand(-.10,.10),r:rand(.8,1.8),a:rand(.15,.45),
          red:Math.random()>.45,ph:rand(0,Math.PI*2),fr:rand(.3,.7)};
      });
    }
    build();
    let t=0;
    (function loop(){
      ctx.clearRect(0,0,W,H); t+=0.016;
      pts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
        p.x=clamp(p.x,0,W); p.y=clamp(p.y,0,H);
        const a=(p.a*(0.55+Math.sin(t*p.fr+p.ph)*0.45)).toFixed(3);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.red?RED_A(a):WH_A((+a*.3).toFixed(3)); ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',build,{passive:true});
  }

  // ── 5. HOME — hero-visual: layer dots (filamento che cade) ─
  function initHeroLayerDots() {
    const visual=document.querySelector('.hero-visual');
    if(!visual||mob()) return;
    const canvas=makeCanvas({inset:'0',width:'100%',height:'100%',opacity:'0.5',zIndex:'0'});
    visual.style.position='relative'; visual.insertBefore(canvas,visual.firstChild);
    const ctx=canvas.getContext('2d');
    let W=0,H=0;
    function resize(){W=visual.offsetWidth;H=visual.offsetHeight;canvas.width=W;canvas.height=H;}
    resize();
    const drops=Array.from({length:12},()=>({x:rand(0,1),y:rand(0,H),speed:rand(.3,.8),r:rand(1,2.2),a:rand(.1,.4)}));
    (function loop(){
      ctx.clearRect(0,0,W,H);
      drops.forEach(d=>{
        d.y+=d.speed; if(d.y>H+5){d.y=-5;d.x=rand(.2,.8);}
        ctx.beginPath(); ctx.arc(d.x*W,d.y,d.r,0,Math.PI*2);
        ctx.fillStyle=RED_A(d.a.toFixed(3)); ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',resize,{passive:true});
  }

  // ── 6. MATERIALI — shimmer sulle barre spec ───────────────
  function initMaterialSpecBars() {
    const bars=document.querySelectorAll('.spec-bar');
    if(!bars.length) return;
    bars.forEach(bar=>{
      const canvas=makeCanvas({position:'absolute',top:'0',left:'0',width:'100%',height:'100%',zIndex:'1',borderRadius:'inherit'});
      bar.style.position='relative'; bar.style.overflow='hidden'; bar.appendChild(canvas);
      const ctx=canvas.getContext('2d');
      let W=0,H=0,done=false;
      function resize(){W=bar.offsetWidth;H=bar.offsetHeight;canvas.width=W;canvas.height=H;}
      resize();
      const io=new IntersectionObserver(e=>{
        if(e[0].isIntersecting&&!done){done=true;io.disconnect();shimmer();}
      },{threshold:.5});
      io.observe(bar);
      function shimmer(){
        let pos=-.4;
        (function f(){
          ctx.clearRect(0,0,W,H); pos+=0.012;
          const g=ctx.createLinearGradient((pos-.4)*W,0,(pos+.4)*W,0);
          g.addColorStop(0,'rgba(255,255,255,0)'); g.addColorStop(.5,'rgba(255,255,255,0.22)'); g.addColorStop(1,'rgba(255,255,255,0)');
          ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
          if(pos<1.4) requestAnimationFrame(f);
        })();
      }
      window.addEventListener('resize',resize,{passive:true});
    });
  }

  // ── 7. MATERIALI — pulse radiale nelle param-card ─────────
  function initParamCardPulse() {
    const cards=document.querySelectorAll('.param-card');
    if(!cards.length) return;
    cards.forEach(card=>{
      const canvas=makeCanvas({inset:'0',width:'100%',height:'100%',opacity:'0.5'});
      if(getComputedStyle(card).position==='static') card.style.position='relative';
      card.insertBefore(canvas,card.firstChild);
      const ctx=canvas.getContext('2d');
      let W=0,H=0,active=false;
      function resize(){W=card.offsetWidth;H=card.offsetHeight;canvas.width=W;canvas.height=H;}
      resize();
      const io=new IntersectionObserver(e=>{
        if(e[0].isIntersecting&&!active){active=true;io.disconnect();run();}
      },{threshold:.4});
      io.observe(card);
      function run(){
        let t=0;
        (function f(){
          ctx.clearRect(0,0,W,H); t+=0.025;
          const r=20+Math.sin(t*.8)*12;
          const a=Math.max(0,Math.sin(t*.8)*.25);
          const g=ctx.createRadialGradient(W/2,H*.3,0,W/2,H*.3,r);
          g.addColorStop(0,RED_A(a.toFixed(3))); g.addColorStop(1,'rgba(229,62,62,0)');
          ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
          requestAnimationFrame(f);
        })();
      }
      window.addEventListener('resize',resize,{passive:true});
    });
  }

  // ── 8. CATALOGO — scanner sulla filter-bar ────────────────
  function initCatalogScanner() {
    const filterBar=document.querySelector('.filter-bar');
    if(!filterBar) return;
    const canvas=makeCanvas({position:'absolute',bottom:'0',left:'0',width:'100%',height:'2px',zIndex:'2'});
    canvas.height=4; filterBar.style.position='relative'; filterBar.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    let W=0;
    function resize(){W=filterBar.offsetWidth;canvas.width=W*2;canvas.style.width='100%';}
    resize();
    let t=0;
    (function loop(){
      const CW=canvas.width; ctx.clearRect(0,0,CW,4); t+=0.006;
      ctx.fillStyle='rgba(255,255,255,0.05)'; ctx.fillRect(0,1,CW,1);
      const x=(t%1)*CW;
      const g=ctx.createRadialGradient(x,2,0,x,2,120);
      g.addColorStop(0,RED_A('.75')); g.addColorStop(.4,RED_A('.15')); g.addColorStop(1,'rgba(229,62,62,0)');
      ctx.fillStyle=g; ctx.fillRect(Math.max(0,x-120),0,240,4);
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',resize,{passive:true});
  }

  // ── 9. PRENOTAZIONE — griglia isometrica nell'header ──────
  function initBookingGrid() {
    const header=document.querySelector('.page-header');
    if(!header) return;
    const canvas=makeCanvas({inset:'0',width:'100%',height:'100%',zIndex:'1'});
    header.style.overflow='hidden'; header.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    let W=0,H=0,pts=[];
    function build(){
      W=header.offsetWidth; H=header.offsetHeight; canvas.width=W; canvas.height=H;
      const step=mob()?40:52; pts=[]; let row=0;
      for(let y=step/2;y<H+step;y+=step,row++){
        const off=(row%2)*(step/2);
        for(let x=off;x<W+step;x+=step)
          pts.push({x,y,a:rand(.04,.18),r:rand(1,1.8),ph:rand(0,Math.PI*2),fr:rand(.2,.5)});
      }
    }
    build();
    let t=0;
    (function loop(){
      ctx.clearRect(0,0,W,H); t+=0.012;
      pts.forEach(p=>{
        const a=(p.a*(0.4+Math.sin(t*p.fr+p.ph)*0.6)).toFixed(3);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=RED_A(a); ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',build,{passive:true});
  }

  // ── 10. RECENSIONI — archi pulsanti nelle stat-cell ───────
  function initReviewsArcPulse() {
    const cells=document.querySelectorAll('.rec-agg-cell');
    if(!cells.length) return;
    cells.forEach((cell,idx)=>{
      const canvas=makeCanvas({inset:'0',width:'100%',height:'100%',opacity:'0.35'});
      if(getComputedStyle(cell).position==='static') cell.style.position='relative';
      cell.insertBefore(canvas,cell.firstChild);
      const ctx=canvas.getContext('2d');
      let W=0,H=0;
      function resize(){W=cell.offsetWidth;H=cell.offsetHeight;canvas.width=W;canvas.height=H;}
      resize();
      const offset=idx*(Math.PI*.4);
      let t=0;
      (function loop(){
        ctx.clearRect(0,0,W,H); t+=0.018;
        const cx=W/2,cy=H/2,base=Math.min(W,H)*.38;
        [1,-.7].forEach((dir,i)=>{
          const sp=dir*(t+offset);
          const a=(0.12+Math.sin(t*.6+i)*.06).toFixed(3);
          const arc=Math.PI*(0.4+Math.sin(t*.3+i*.8)*.15);
          ctx.beginPath(); ctx.arc(cx,cy,base+i*8,sp,sp+arc);
          ctx.strokeStyle=RED_A(a); ctx.lineWidth=1; ctx.stroke();
        });
        requestAnimationFrame(loop);
      })();
      window.addEventListener('resize',resize,{passive:true});
    });
  }

  // ── 11. CONTATTI — onda radar sulla contact-card email ────
  function initContactRadar() {
    const card=document.querySelector('.contact-card--main');
    if(!card) return;
    const canvas=makeCanvas({inset:'0',width:'100%',height:'100%',opacity:'0.5'});
    if(getComputedStyle(card).position==='static') card.style.position='relative';
    card.insertBefore(canvas,card.firstChild);
    const ctx=canvas.getContext('2d');
    let W=0,H=0;
    function resize(){W=card.offsetWidth;H=card.offsetHeight;canvas.width=W;canvas.height=H;}
    resize();
    const waves=[0,.33,.66].map(ph=>({ph,r:ph*60}));
    (function loop(){
      ctx.clearRect(0,0,W,H);
      const cy=H/2, cx=mob()?32:48;
      waves.forEach(w=>{
        w.r+=0.5; if(w.r>Math.max(W,H)) w.r=0;
        const a=Math.max(0,0.18-(w.r/Math.max(W,H))*0.18);
        ctx.beginPath(); ctx.arc(cx,cy,w.r,0,Math.PI*2);
        ctx.strokeStyle=RED_A(a.toFixed(3)); ctx.lineWidth=1; ctx.stroke();
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',resize,{passive:true});
  }

  // ── 12. TOS — stream di testo legale (solo desktop) ───────
  function initTosTextStream() {
    if(mob()) return;
    const hero=document.querySelector('.tos-hero');
    if(!hero) return;
    const canvas=makeCanvas({position:'absolute',right:'0',top:'0',width:'200px',height:'100%',opacity:'0.18',zIndex:'0'});
    hero.appendChild(canvas);
    const ctx=canvas.getContext('2d');
    const W=200; let H=0;
    function resize(){H=hero.offsetHeight;canvas.height=H;canvas.width=W;}
    resize();
    const LINES=['ART.1 §1.a','GDPR 679/16','D.Lgs 196/03','ART.13 §2.b','COOKIE §3','PRIVACY','ART.7','CONSENT','DATA §4.1','LEGAL','ART.21','OPT-OUT'];
    const streams=Array.from({length:5},(_,i)=>({x:20+i*36,y:rand(-200,0),speed:rand(.4,.9),li:Math.floor(rand(0,LINES.length)),timer:0,every:Math.floor(rand(40,90))}));
    ctx.font='8px monospace'; ctx.textAlign='center';
    (function loop(){
      ctx.clearRect(0,0,W,H);
      streams.forEach(s=>{
        s.y+=s.speed; s.timer++;
        if(s.timer>=s.every){s.timer=0;s.li=(s.li+1)%LINES.length;}
        if(s.y>H+40) s.y=-40;
        const n=s.y/H, a=n<.1?n*10*.5:n>.9?(1-n)*10*.5:.5;
        ctx.fillStyle=RED_A(a.toFixed(3)); ctx.fillText(LINES[s.li],s.x,s.y);
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize',resize,{passive:true});
  }

  // ── 13. CAT PAGES — griglia puntini nell'angolo del hero ──
  function initCatHeroRipple() {
    const hero=document.querySelector('.cat-hero');
    if(!hero) return;
    const SIZE=mob()?90:150;
    const canvas=makeCanvas({position:'absolute',right:'0',top:'0',width:SIZE+'px',height:SIZE+'px',opacity:'0.4',zIndex:'0'});
    canvas.width=SIZE*2; canvas.height=SIZE*2;
    hero.appendChild(canvas);
    const ctx=canvas.getContext('2d'); ctx.scale(2,2);
    const step=14, pts=[];
    for(let y=step;y<SIZE;y+=step) for(let x=step;x<SIZE;x+=step)
      pts.push({x,y,ph:Math.hypot(x-SIZE,y)*0.08});
    let t=0;
    (function loop(){
      ctx.clearRect(0,0,SIZE,SIZE); t+=0.022;
      pts.forEach(p=>{
        const a=Math.max(0,(0.3+Math.sin(t-p.ph)*0.4)*0.35);
        ctx.beginPath(); ctx.arc(p.x,p.y,1.2,0,Math.PI*2);
        ctx.fillStyle=RED_A(a.toFixed(3)); ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
  }

  // ── 14. CAT PAGES — beam sulla linea del process ──────────
  function initProcessLineBeam() {
    if(mob()) return;
    const ps=document.querySelector('.process-section');
    if(!ps) return;
    const stepsEl=ps.querySelector('.process-steps');
    if(!stepsEl) return;
    const canvas=document.createElement('canvas');
    canvas.style.cssText='display:block;width:100%;height:2px;pointer-events:none;';
    canvas.height=4; stepsEl.parentNode.insertBefore(canvas,stepsEl);
    const ctx=canvas.getContext('2d');
    let W=0,started=false;
    function resize(){W=canvas.offsetWidth;canvas.width=W*2;canvas.style.width='100%';}
    resize();
    const io=new IntersectionObserver(e=>{
      if(e[0].isIntersecting&&!started){started=true;io.disconnect();beam();}
    },{threshold:.3});
    io.observe(canvas);
    function beam(){
      const CW=canvas.width; let pos=0;
      (function f(){
        ctx.clearRect(0,0,CW,4); pos+=0.007;
        const x=pos*CW;
        const g=ctx.createLinearGradient(Math.max(0,x-160),0,x+20,0);
        g.addColorStop(0,'rgba(229,62,62,0)'); g.addColorStop(.7,RED_A('.5')); g.addColorStop(1,RED_A('.9'));
        ctx.fillStyle=g; ctx.fillRect(Math.max(0,x-160),0,180,4);
        if(pos<1) requestAnimationFrame(f);
        else{ctx.fillStyle='rgba(229,62,62,0.12)';ctx.fillRect(0,1,CW,1);}
      })();
    }
    window.addEventListener('resize',resize,{passive:true});
  }

  // ── 15. MATERIALI — header: layer FDM che scorrono ─────────
  function initMaterialHeaderLayers() {
    const header = document.querySelector('.page-header-sm');
    if (!header) return;
    if (!window.location.pathname.includes('materiali')) return;
    const canvas = makeCanvas({ inset:'0', width:'100%', height:'100%', opacity:'0.55', zIndex:'1' });
    header.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    function resize() { W = header.offsetWidth; H = header.offsetHeight; canvas.width = W; canvas.height = H; }
    resize();
    // Horizontal layer lines drifting left→right, evocative of FDM layer-by-layer
    const LINES = Array.from({ length: mob() ? 6 : 10 }, (_, i) => ({
      y: (i / (mob() ? 6 : 10)) * H + rand(0, H / 10),
      x: rand(-W, 0),
      speed: rand(0.18, 0.45),
      len: rand(W * 0.08, W * 0.22),
      a: rand(0.06, 0.18),
      w: rand(0.8, 1.6),
    }));
    // Small dot swarm on the right side
    const DOTS = Array.from({ length: mob() ? 10 : 20 }, () => ({
      x: rand(W * 0.6, W),
      y: rand(0, H),
      vy: rand(0.15, 0.45),
      r: rand(0.8, 1.8),
      a: rand(0.08, 0.25),
      red: Math.random() > 0.6,
    }));
    (function loop() {
      ctx.clearRect(0, 0, W, H);
      // Layer lines
      LINES.forEach(l => {
        l.x += l.speed;
        if (l.x > W + 20) l.x = -l.len - rand(0, W * 0.3);
        const g = ctx.createLinearGradient(l.x, 0, l.x + l.len, 0);
        g.addColorStop(0, RED_A('0'));
        g.addColorStop(0.5, RED_A(l.a.toFixed(3)));
        g.addColorStop(1, RED_A('0'));
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x + l.len, l.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = l.w;
        ctx.stroke();
      });
      // Falling dots
      DOTS.forEach(d => {
        d.y += d.vy;
        if (d.y > H + 4) { d.y = -4; d.x = rand(W * 0.55, W); }
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.red ? RED_A(d.a.toFixed(3)) : WH_A((d.a * 0.4).toFixed(3));
        ctx.fill();
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize', () => { resize(); }, { passive: true });
  }

  // ── 16. MATERIALI — mat-custom-note: molecola orbitante ────
  function initMoleculeOrbit() {
    const note = document.querySelector('.mat-custom-note');
    if (!note) return;
    const icon = note.querySelector('.custom-note-icon');
    if (!icon) return;
    const canvas = makeCanvas({ inset:'0', width:'100%', height:'100%', opacity:'0.65', zIndex:'0' });
    if (getComputedStyle(note).position === 'static') note.style.position = 'relative';
    note.insertBefore(canvas, note.firstChild);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    function resize() { W = note.offsetWidth; H = note.offsetHeight; canvas.width = W; canvas.height = H; }
    resize();
    // Orbit around the icon position (left side of the card)
    const ORBITS = [
      { r: 38, speed: 0.008, phase: 0, size: 2.0, a: 0.35, red: true },
      { r: 55, speed: -0.005, phase: Math.PI * 0.7, size: 1.4, a: 0.22, red: false },
      { r: 68, speed: 0.004, phase: Math.PI * 1.4, size: 1.8, a: 0.28, red: true },
    ];
    // Bond lines between orbit dots and center
    let t = 0;
    (function loop() {
      ctx.clearRect(0, 0, W, H); t += 0.016;
      // Icon center in canvas-space (approx left zone, vertically centered)
      const cx = mob() ? W * 0.12 : Math.min(70, W * 0.1);
      const cy = H / 2;
      ORBITS.forEach(o => {
        const angle = t * o.speed * 60 + o.phase;
        const ox = cx + Math.cos(angle) * o.r;
        const oy = cy + Math.sin(angle) * o.r * 0.55; // flatten ellipse
        // Bond line
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ox, oy);
        ctx.strokeStyle = RED_A((o.a * 0.35).toFixed(3));
        ctx.lineWidth = 0.6; ctx.stroke();
        // Dot
        ctx.beginPath(); ctx.arc(ox, oy, o.size, 0, Math.PI * 2);
        if (o.red) { ctx.shadowBlur = 4; ctx.shadowColor = RED; ctx.fillStyle = RED_A(o.a.toFixed(3)); }
        else { ctx.shadowBlur = 0; ctx.fillStyle = WH_A((o.a * 0.5).toFixed(3)); }
        ctx.fill(); ctx.shadowBlur = 0;
      });
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize', resize, { passive: true });
  }

  // ── 17. MATERIALI — page-cta: sweep beam + corner sparks ───
  function initMaterialCtaBeam() {
    const cta = document.querySelector('.page-cta');
    if (!cta) return;
    if (!window.location.pathname.includes('materiali')) return;
    const canvas = makeCanvas({ inset:'0', width:'100%', height:'100%', zIndex:'0' });
    if (getComputedStyle(cta).position === 'static') cta.style.position = 'relative';
    cta.insertBefore(canvas, cta.firstChild);
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    function resize() { W = cta.offsetWidth; H = cta.offsetHeight; canvas.width = W; canvas.height = H; }
    resize();
    // Sweeping horizontal beam
    let t = 0;
    const sparks = [];
    (function loop() {
      ctx.clearRect(0, 0, W, H); t += 0.012;
      // Sweep beam
      const x = ((t * 0.18) % 1.4 - 0.2) * W;
      const g = ctx.createLinearGradient(x - 180, 0, x + 40, 0);
      g.addColorStop(0, RED_A('0'));
      g.addColorStop(0.75, RED_A('0.07'));
      g.addColorStop(1, RED_A('0.18'));
      ctx.fillStyle = g;
      ctx.fillRect(Math.max(0, x - 180), 0, 220, H);
      // Corner sparkles
      if (Math.random() < 0.04) {
        const corner = Math.floor(Math.random() * 4);
        sparks.push({
          x: corner % 2 === 0 ? rand(0, 60) : rand(W - 60, W),
          y: corner < 2 ? rand(0, 50) : rand(H - 50, H),
          life: 0, max: rand(40, 80), r: rand(0.8, 1.8), red: Math.random() > 0.4,
        });
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]; s.life++;
        const p = s.life / s.max;
        const a = p < 0.3 ? (p / 0.3) * 0.5 : (1 - (p - 0.3) / 0.7) * 0.5;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.red ? RED_A(a.toFixed(3)) : WH_A((a * 0.4).toFixed(3));
        ctx.fill();
        if (s.life >= s.max) sparks.splice(i, 1);
      }
      requestAnimationFrame(loop);
    })();
    window.addEventListener('resize', resize, { passive: true });
  }

  // ── ROUTER ─────────────────────────────────────────────────
  function init() {
    const p=window.location.pathname;
    initNavParticles();
    initFooterMesh();
    if(p==='/'||p===''||p==='/index'||!p.replace('/','')) {
      initTickerSparkles();
      initHomeCtaParticles();
      initHeroLayerDots();
    }
    if(p.includes('materiali')){
      initMaterialSpecBars();
      initParamCardPulse();
      initMaterialHeaderLayers();
      initMoleculeOrbit();
      initMaterialCtaBeam();
    }
    if(p.includes('catalogo')) initCatalogScanner();
    if(p.includes('prenotazione')) initBookingGrid();
    if(p.includes('recensioni')) initReviewsArcPulse();
    if(p.includes('contatti')) initContactRadar();
    if(p.includes('tos')) initTosTextStream();
    if(/decorativi|componentistica|prototipi|personalizzati/.test(p)){
      initCatHeroRipple();
      initProcessLineBeam();
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
