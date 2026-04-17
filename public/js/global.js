// ============================================================
// PRINT3D STUDIO — Global JS v14
// Ambient canvas · Micro-transitions · Scroll reveals
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // AMBIENT BACKGROUND — v14 LIQUID FLUID ENGINE
  // WebGL2 metaball SDF · chromatic aberration · iridescent sheen
  // mouse-reactive distortion · organic lava-lamp motion
  // ============================================================
  (function initAmbient() {
    const canvas = document.createElement('canvas');
    canvas.id = 'ambient-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    // Try WebGL2, fallback to canvas2d enhanced
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: true, premultipliedAlpha: false });

    let W = 0, H = 0;
    function resize() {
      W = canvas.width  = Math.floor(window.innerWidth  * window.devicePixelRatio * 0.55);
      H = canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio * 0.55);
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
      if (gl) gl.viewport(0, 0, W, H);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (!gl) {
      // ---- Canvas2D enhanced fallback (rare) ----
      const ctx2 = canvas.getContext('2d');
      const blobs = Array.from({ length: 7 }, () => ({
        x: Math.random(), y: Math.random(),
        vx: (Math.random()-0.5)*0.00025, vy: (Math.random()-0.5)*0.00025,
        r: 0.22 + Math.random()*0.2, phase: Math.random()*6.28,
        freq: 0.12 + Math.random()*0.14,
      }));
      let mx2=0.5,my2=0.5;
      window.addEventListener('mousemove', e=>{mx2=e.clientX/innerWidth;my2=e.clientY/innerHeight},{passive:true});
      const t0=performance.now();
      (function loop(){
        const t=(performance.now()-t0)*0.001;
        ctx2.clearRect(0,0,W,H);
        blobs.forEach(b=>{
          b.x+=b.vx+(mx2-b.x)*0.00001; b.y+=b.vy+(my2-b.y)*0.00001;
          if(b.x<-b.r)b.x=1+b.r; if(b.x>1+b.r)b.x=-b.r;
          if(b.y<-b.r)b.y=1+b.r; if(b.y>1+b.r)b.y=-b.r;
          const breath=1+Math.sin(t*b.freq+b.phase)*0.18;
          const cx=b.x*W, cy=b.y*H, r=b.r*Math.min(W,H)*breath;
          const g=ctx2.createRadialGradient(cx,cy,0,cx,cy,r);
          g.addColorStop(0,'rgba(200,30,30,0.07)');
          g.addColorStop(0.5,'rgba(140,20,20,0.03)');
          g.addColorStop(1,'rgba(0,0,0,0)');
          ctx2.fillStyle=g; ctx2.beginPath(); ctx2.arc(cx,cy,r,0,6.28); ctx2.fill();
        });
        requestAnimationFrame(loop);
      })();
      return;
    }

    // ================================================================
    // WEBGL2 LIQUID FLUID ENGINE — v14
    // SDF metaball field · iridescent chromatic sheen · mouse warp
    // ================================================================

    const VS = `#version 300 es
precision highp float;
in vec2 a_pos;
out vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

    const FS = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2  u_res;
uniform vec2  u_mouse;
uniform vec3  u_blobs[9];   // xy=pos, z=radius
uniform float u_scroll;
in  vec2 v_uv;
out vec4 fragColor;

// ---- noise helpers ----
vec3 hash3(vec2 p){
  vec3 q = vec3(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)), dot(p,vec2(419.2,371.9)));
  return fract(sin(q)*43758.5453);
}
float noise(vec2 p){
  vec2 i=floor(p); vec2 f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  float a=dot(hash3(i      ).xy, f-vec2(0,0));
  float b=dot(hash3(i+vec2(1,0)).xy, f-vec2(1,0));
  float c=dot(hash3(i+vec2(0,1)).xy, f-vec2(0,1));
  float d=dot(hash3(i+vec2(1,1)).xy, f-vec2(1,1));
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y)*0.5+0.5;
}
float fbm(vec2 p){
  float v=0.0, a=0.5;
  for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.1+vec2(1.7,9.2);a*=0.5;}
  return v;
}

// ---- metaball SDF sum ----
float metafield(vec2 p){
  float f=0.0;
  for(int i=0;i<9;i++){
    vec2 d=p-u_blobs[i].xy;
    float r=u_blobs[i].z;
    f += (r*r)/(dot(d,d)+0.0001);
  }
  return f;
}

// ---- HSL to RGB ----
vec3 hsl2rgb(float h,float s,float l){
  h=fract(h);
  vec3 rgb=clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0,0.0,1.0);
  return l+s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));
}

void main(){
  vec2 uv = v_uv;
  float ar = u_res.x / u_res.y;
  vec2  p  = uv * vec2(ar, 1.0);   // aspect-corrected

  float t = u_time;

  // ---- mouse gravity distortion ----
  vec2 mp = u_mouse * vec2(ar, 1.0);
  float md = length(p - mp);
  float warp = 0.018 / (md * md + 0.04);
  p += normalize(p - mp + vec2(0.001)) * warp * 0.04;

  // ---- fbm distortion ----
  float nx = fbm(p * 1.2 + vec2(t*0.07,  t*0.05));
  float ny = fbm(p * 1.2 + vec2(t*0.05, -t*0.07) + vec2(5.2, 1.3));
  vec2 dp  = vec2(nx - 0.5, ny - 0.5) * 0.28;
  vec2 pw  = p + dp;

  // ---- evaluate metaball field ----
  float field = metafield(pw * vec2(1.0/ar, 1.0));

  // threshold with smooth iso-surface
  float iso     = 2.8;
  float surface = smoothstep(iso - 0.35, iso + 0.35, field);
  float surface2= smoothstep(iso - 0.8,  iso + 0.1,  field); // softer halo

  // ---- iridescent color mapping ----
  // hue shifts with field strength + position + time for oil-slick look
  float hue   = fract(field * 0.12 + uv.x * 0.18 + uv.y * 0.09 + t * 0.04);
  float hue2  = fract(hue + 0.08 + sin(t*0.3 + field*0.5)*0.04);

  // chromatic offset for thin-film shimmer
  float chroma= sin(field * 3.14 + t * 0.8) * 0.5 + 0.5;

  vec3 col1 = hsl2rgb(hue,  0.85, 0.38);  // rich saturated
  vec3 col2 = hsl2rgb(hue2, 0.7,  0.28);  // darker complement

  vec3 surfaceColor = mix(col2, col1, chroma);

  // red accent: pull toward brand red on dominant mass
  float redPull = smoothstep(iso + 0.1, iso + 1.2, field);
  vec3  brandRed = vec3(0.9, 0.18, 0.18);
  surfaceColor   = mix(surfaceColor, brandRed, redPull * 0.55);

  // ---- specular highlight (fake fresnel) ----
  float spec = pow(chroma, 4.0) * surface * 0.25;
  surfaceColor += spec;

  // ---- soft halo (subsurface glow) ----
  vec3 haloColor = mix(vec3(0.55,0.08,0.08), vec3(0.3,0.06,0.06), uv.y);
  float halo     = surface2 * (1.0 - surface) * 0.6;

  // ---- composite ----
  vec3 finalColor = haloColor * halo + surfaceColor * surface;

  // ---- vignette ----
  float vig = 1.0 - smoothstep(0.35, 0.95, length(uv - 0.5) * 1.4);
  finalColor *= vig;

  // ---- depth / scroll parallax tint ----
  finalColor *= 0.88 + u_scroll * 0.12;

  float alpha = (surface + halo * 0.6) * 0.82 * vig;

  fragColor = vec4(finalColor, alpha);
}`;

    // ---- compile shaders ----
    function makeShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }
    const vs = makeShader(gl.VERTEX_SHADER, VS);
    const fs = makeShader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(prog)); return;
    }
    gl.useProgram(prog);

    // ---- fullscreen quad ----
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPosLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

    // ---- uniform locations ----
    const uTime   = gl.getUniformLocation(prog, 'u_time');
    const uRes    = gl.getUniformLocation(prog, 'u_res');
    const uMouse  = gl.getUniformLocation(prog, 'u_mouse');
    const uBlobs  = gl.getUniformLocation(prog, 'u_blobs[0]');
    const uScroll = gl.getUniformLocation(prog, 'u_scroll');

    // ---- enable alpha blending ----
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    // ---- metaball state (9 blobs) ----
    const N = 9;
    const blobs = Array.from({ length: N }, (_, i) => ({
      x:  Math.random(),
      y:  Math.random(),
      vx: (Math.random() - 0.5) * 0.00018,
      vy: (Math.random() - 0.5) * 0.00018,
      r:  0.10 + Math.random() * 0.13,
      phase: Math.random() * Math.PI * 2,
      freq:  0.10 + Math.random() * 0.12,
      orbitR: 0.08 + Math.random() * 0.18,
      orbitF: 0.04 + Math.random() * 0.07,
      orbitPhase: Math.random() * Math.PI * 2,
      orbitCx: 0.2 + Math.random() * 0.6,
      orbitCy: 0.2 + Math.random() * 0.6,
    }));

    // ---- mouse ----
    let mx = 0.5, my = 0.5, tmx = 0.5, tmy = 0.5;
    window.addEventListener('mousemove', e => {
      tmx = e.clientX / window.innerWidth;
      tmy = e.clientY / window.innerHeight;
    }, { passive: true });
    window.addEventListener('touchmove', e => {
      tmx = e.touches[0].clientX / window.innerWidth;
      tmy = e.touches[0].clientY / window.innerHeight;
    }, { passive: true });

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1); }, { passive: true });

    const startTime = performance.now();

    function draw() {
      const t = (performance.now() - startTime) * 0.001;

      // smooth mouse
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;

      // update blobs — slow organic orbit + drift
      const blobData = new Float32Array(N * 3);
      blobs.forEach((b, i) => {
        // drift
        b.x += b.vx; b.y += b.vy;
        // soft bounce
        if (b.x < 0.05 || b.x > 0.95) b.vx *= -1;
        if (b.y < 0.05 || b.y > 0.95) b.vy *= -1;
        // orbital wobble
        const ox = Math.cos(t * b.orbitF + b.orbitPhase) * b.orbitR;
        const oy = Math.sin(t * b.orbitF * 1.31 + b.orbitPhase) * b.orbitR * 0.7;
        // mouse attraction (gentle)
        b.vx += (mx - b.x) * 0.000008;
        b.vy += (my - b.y) * 0.000008;
        b.vx *= 0.998; b.vy *= 0.998;
        // breathing radius
        const breathR = b.r * (1.0 + Math.sin(t * b.freq + b.phase) * 0.22);

        blobData[i * 3 + 0] = b.x + ox;
        blobData[i * 3 + 1] = b.y + oy;
        blobData[i * 3 + 2] = breathR;
      });

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, W, H);
      gl.uniform2f(uMouse, mx, my);
      gl.uniform3fv(uBlobs, blobData);
      gl.uniform1f(uScroll, scrollY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  })();

  // ============================================================
  // CLICK / TOUCH RIPPLE
  // ============================================================
  function spawnRipple(x, y) {
    const r = document.createElement('div');
    r.className = 'click-ripple';
    r.style.left = x + 'px';
    r.style.top  = y + 'px';
    document.body.appendChild(r);
    r.addEventListener('animationend', () => r.remove());
  }
  document.addEventListener('click', e => spawnRipple(e.clientX, e.clientY));
  document.addEventListener('touchstart', e => {
    const t = e.touches[0];
    spawnRipple(t.clientX, t.clientY);
  }, { passive: true });

  // ============================================================
  // PAGE TRANSITION
  // ============================================================
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    overlay.style.transform = 'scaleX(1)';
    overlay.style.transformOrigin = 'right';
    overlay.style.transition = 'transform 0.55s cubic-bezier(0.76,0,0.24,1)';
    setTimeout(() => { overlay.style.transform = 'scaleX(0)'; }, 50);
  }
  window.addEventListener('pageshow', e => {
    if (e.persisted && overlay) {
      overlay.style.transition = 'none';
      overlay.style.transform  = 'scaleX(0)';
    }
  });
  document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target])').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http')) return;
      e.preventDefault();
      if (!overlay) { window.location.href = href; return; }
      overlay.style.transformOrigin = 'left';
      overlay.style.transition = 'transform 0.48s cubic-bezier(0.76,0,0.24,1)';
      overlay.style.transform  = 'scaleX(1)';
      setTimeout(() => { window.location.href = href; }, 500);
    });
  });

  // ============================================================
  // NAV — scroll state + mobile toggle
  // ============================================================
  const nav = document.querySelector('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const toggle     = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (mobileMenu.classList.contains('open')) {
        spans[0].style.transform = 'translateY(6px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6px) rotate(-45deg)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // Active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '/' && href === '/') ||
        (currentPath.includes(href) && href !== '/')) {
      link.classList.add('active');
    }
  });

  // ============================================================
  // SCROLL REVEAL — staggered IntersectionObserver
  // ============================================================
  function initScrollReveal() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el    = entry.target;
        const delay = parseFloat(el.dataset.delay || 0) * 1000;
        setTimeout(() => el.classList.add('revealed'), delay);
        obs.unobserve(el);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -36px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Already visible: no transition, just show
        el.style.transition = 'none';
        el.classList.add('revealed');
        requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ''; }));
      } else {
        obs.observe(el);
      }
    });
  }

  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen ? setTimeout(initScrollReveal, 4950) : initScrollReveal();

  // ============================================================
  // CARD HOVER TILT — applied to .tilt-card elements
  // ============================================================
  document.querySelectorAll('.tilt-card, .material-card, .contact-card, .param-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / r.height) * -5;
      const ry = ((e.clientX - r.left - r.width  / 2) / r.width ) *  5;
      card.style.transform    = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
      card.style.transition   = 'transform 0.08s ease';
      card.style.willChange   = 'transform';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
      card.style.transform  = '';
    });
  });

  // ============================================================
  // STAGGER — auto-stagger children of [data-stagger]
  // ============================================================
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const delay = parseFloat(parent.dataset.stagger || 0.08);
    const obs2 = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      Array.from(parent.children).forEach((child, i) => {
        child.style.opacity   = '0';
        child.style.transform = 'translateY(18px)';
        child.style.transition = `opacity 0.55s cubic-bezier(0.16,1,0.3,1) ${i * delay}s,
                                   transform 0.55s cubic-bezier(0.16,1,0.3,1) ${i * delay}s`;
        requestAnimationFrame(() => requestAnimationFrame(() => {
          child.style.opacity   = '1';
          child.style.transform = 'translateY(0)';
        }));
      });
      obs2.unobserve(parent);
    }, { threshold: 0.1 });
    obs2.observe(parent);
  });

  // ============================================================
  // MAGNETIC BUTTONS — spring on click
  // ============================================================
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('mag-pulse');
      btn.addEventListener('animationend', () => btn.classList.remove('mag-pulse'), { once: true });
    });
  });

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    const obs3   = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      let current = 0;
      const step  = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
        if (current >= target) clearInterval(timer);
      }, 16);
      obs3.unobserve(el);
    });
    obs3.observe(el);
  });

  // ============================================================
  // NOISE CANVAS
  // ============================================================
  document.querySelectorAll('.noise-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      drawNoise();
    }
    function drawNoise() {
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = Math.random() * 18;
        img.data[i] = img.data[i+1] = img.data[i+2] = v;
        img.data[i+3] = 28;
      }
      ctx.putImageData(img, 0, 0);
    }
    resize();
  });

  // ============================================================
  // GSAP PARALLAX (if GSAP + ScrollTrigger loaded)
  // ============================================================
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      gsap.to(el, {
        yPercent: speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
    });
  }

  // ============================================================
  // LINK UNDERLINE MICRO-ANIMATION (footer + nav)
  // Already handled via CSS transitions — nothing to do
  // ============================================================

});
