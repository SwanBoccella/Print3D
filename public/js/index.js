// ============================================================
// INDEX PAGE JS — Hero canvas + GSAP animations
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- LOADING SCREEN — Advanced ----
  const loadScreen = document.getElementById('loading-screen');
  const ldrBarFill = document.getElementById('ldr-bar-fill');
  const ldrBarPulse = document.getElementById('ldr-bar-pulse');
  const ldrPct = document.getElementById('ldr-pct');
  const ldrPhase = document.getElementById('ldr-phase');
  const ldrStatus = document.getElementById('ldr-status');
  const ldrLayers = document.getElementById('ldr-layers');
  const ldrRingFill = document.getElementById('ldr-ring-fill');
  const ldrRingFill2 = document.getElementById('ldr-ring-fill2');
  const teleTemp = document.getElementById('tele-temp');
  const teleBed = document.getElementById('tele-bed');
  const teleInfill = document.getElementById('tele-infill');
  const teleSpeed = document.getElementById('tele-speed');
  const ldrClock = document.getElementById('ldr-clock');
  const dataStream = document.getElementById('ldr-datastream');

  // ---- Loader canvas: rotating wireframe cube ----
  const lc = document.getElementById('loader-canvas');
  if (lc) {
    const lctx = lc.getContext('2d');
    lc.width = window.innerWidth;
    lc.height = window.innerHeight;

    let lcAngle = 0;
    const cx = lc.width / 2, cy = lc.height / 2;
    const SIZE = Math.min(Math.min(lc.width, lc.height) * 0.28, 220);

    // Cube vertices
    const verts = [
      [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
      [-1,-1, 1],[1,-1, 1],[1,1, 1],[-1,1, 1],
    ];
    const edges = [
      [0,1],[1,2],[2,3],[3,0],
      [4,5],[5,6],[6,7],[7,4],
      [0,4],[1,5],[2,6],[3,7],
    ];

    function projectVert(v, ang) {
      // Rotate around Y+X axes
      const cos = Math.cos(ang), sin = Math.sin(ang);
      const cos2 = Math.cos(ang * 0.6), sin2 = Math.sin(ang * 0.6);
      let [x, y, z] = v;
      // Y rotation
      let x2 = x * cos - z * sin, z2 = x * sin + z * cos;
      // X rotation
      let y2 = y * cos2 - z2 * sin2, z3 = y * sin2 + z2 * cos2;
      const persp = 4 / (4 + z3);
      return [cx + x2 * SIZE * persp, cy + y2 * SIZE * persp];
    }

    function drawLoader() {
      lctx.clearRect(0, 0, lc.width, lc.height);
      lcAngle += 0.004;

      const projected = verts.map(v => projectVert(v, lcAngle));

      // Draw edges
      edges.forEach(([a, b]) => {
        lctx.beginPath();
        lctx.moveTo(projected[a][0], projected[a][1]);
        lctx.lineTo(projected[b][0], projected[b][1]);
        lctx.strokeStyle = 'rgba(229,62,62,0.9)';
        lctx.lineWidth = 0.8;
        lctx.stroke();
      });

      // Draw vertices
      projected.forEach(([px, py]) => {
        lctx.beginPath();
        lctx.arc(px, py, 2, 0, Math.PI * 2);
        lctx.fillStyle = 'rgba(229,62,62,0.9)';
        lctx.fill();
      });

      // Draw mid-edge dashes (inner cross lines)
      const midpoints = edges.map(([a,b]) => [
        (projected[a][0] + projected[b][0]) / 2,
        (projected[a][1] + projected[b][1]) / 2,
      ]);
      for (let i = 0; i < midpoints.length; i++) {
        for (let j = i + 1; j < midpoints.length; j++) {
          const dx = midpoints[i][0] - midpoints[j][0];
          const dy = midpoints[i][1] - midpoints[j][1];
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < SIZE * 0.8) {
            const alpha = (1 - d / (SIZE * 0.8)) * 0.12;
            lctx.beginPath();
            lctx.moveTo(midpoints[i][0], midpoints[i][1]);
            lctx.lineTo(midpoints[j][0], midpoints[j][1]);
            lctx.strokeStyle = `rgba(229,62,62,${alpha})`;
            lctx.lineWidth = 0.4;
            lctx.stroke();
          }
        }
      }
      requestAnimationFrame(drawLoader);
    }
    drawLoader();
  }

  // ---- Clock ----
  const startTime = Date.now();
  function updateClock() {
    const elapsed = Date.now() - startTime;
    const ms = elapsed % 1000;
    const s = Math.floor(elapsed / 1000) % 60;
    const m = Math.floor(elapsed / 60000) % 60;
    if (ldrClock) ldrClock.textContent =
      String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0') + ':' + String(ms).padStart(3,'0').slice(0,2);
  }
  const clockInterval = setInterval(updateClock, 50);

  // ---- Data stream ----
  const hexLines = [
    '0xE53E3E 0x0A0A0A 0xFF7070','AXIS_X: HOMING...','AXIS_Z: HOMING...',
    'FW: 3.6.2 — MARLIN','EEPROM: 512B OK','MESH BED LEVELING...',
    'PID AUTOTUNE: E0...','G28 X Y Z','G29 — ABL PROBE',
    'M104 S210 T0','M140 S60','SLICER: CURA 5.4',
    '0x3F 0x2A 0xCC 0x11','LAYER: FDM 0.2mm','NOZZLE: 0.4mm BRASS',
    'FLOW RATE: 100%','FAN: 100% LAYER 3+','RETRACT: 5mm',
    'PRINT_SPEED: 60mm/s','0xAB 0x00 0xFF 0x3D',
  ];
  let streamIdx = 0;
  const streamInterval = setInterval(() => {
    if (!dataStream) return;
    const line = document.createElement('span');
    line.textContent = hexLines[streamIdx % hexLines.length];
    if (Math.random() > 0.7) line.classList.add('active');
    dataStream.appendChild(line);
    if (dataStream.children.length > 28) dataStream.removeChild(dataStream.firstChild);
    streamIdx++;
  }, 160);

  // ---- SVG ring circumferences: r90=565.5, r70=439.8 ----
  const CIRC1 = 565.5, CIRC2 = 439.8;

  function setProgress(pct) {
    const frac = pct / 100;
    if (ldrBarFill)  ldrBarFill.style.width  = pct + '%';
    if (ldrBarPulse) ldrBarPulse.style.width = pct + '%';
    if (ldrPct)      ldrPct.textContent = pct + '%';
    if (ldrRingFill)  ldrRingFill.style.strokeDashoffset  = CIRC1 * (1 - frac);
    if (ldrRingFill2) ldrRingFill2.style.strokeDashoffset = CIRC2 * (1 - frac);
    if (ldrLayers)    ldrLayers.textContent = 'LAYERS: ' + Math.floor(frac * 240) + ' / 240';
  }

  // Telemetry countup
  function animateTele(el, from, to, unit, duration) {
    if (!el) return;
    const start = Date.now();
    function tick() {
      const t = Math.min((Date.now() - start) / duration, 1);
      const val = Math.round(from + (to - from) * t);
      el.textContent = val + unit;
      if (t < 1) requestAnimationFrame(tick);
      else el.classList.add('active');
    }
    requestAnimationFrame(tick);
  }

  // ---- Phases ----
  const phases = [
    { pct: 12,  label: 'LOADING ASSETS',     chk: 0, delay: 250  },
    { pct: 30,  label: 'CALIBRATING AXES',   chk: 1, delay: 800  },
    { pct: 55,  label: 'SLICING GEOMETRY',   chk: 2, delay: 1500 },
    { pct: 78,  label: 'WARMING EXTRUDER',   chk: 3, delay: 2300 },
    { pct: 100, label: 'SYSTEM READY',       chk: 4, delay: 3200 },
  ];

  // Animate progress smoothly
  let currentPct = 0;
  phases.forEach(({ pct, label, chk, delay }) => {
    setTimeout(() => {
      if (ldrPhase) ldrPhase.textContent = label;
      if (ldrStatus) ldrStatus.textContent = '● ' + label;

      // Animate from current to target
      const from = currentPct, to = pct;
      const dur = 400;
      const t0 = Date.now();
      function tick() {
        const t = Math.min((Date.now() - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setProgress(Math.round(from + (to - from) * ease));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      currentPct = pct;

      // Mark checklist
      for (let i = 0; i <= chk; i++) {
        const el = document.getElementById('chk-' + i);
        if (el) {
          if (i < chk) { el.classList.add('done'); el.querySelector('.ldr-chk-icon').textContent = '✓'; }
          else if (i === chk) { el.classList.add('active'); el.querySelector('.ldr-chk-icon').textContent = '▶'; }
        }
      }

      // Telemetry updates
      if (chk === 2) { animateTele(teleTemp, 25, 210, '°C', 600); animateTele(teleBed, 25, 60, '°C', 600); }
      if (chk === 3) { animateTele(teleInfill, 0, 20, '%', 400); animateTele(teleSpeed, 0, 60, ' mm/s', 400); }
    }, delay);
  });

  // Mark all done
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      const el = document.getElementById('chk-' + i);
      if (el) { el.classList.remove('active'); el.classList.add('done'); el.querySelector('.ldr-chk-icon').textContent = '✓'; }
    }
    if (ldrStatus) { ldrStatus.textContent = '● READY'; ldrStatus.style.color = '#4caf50'; }
  }, 3800);

  // Hide
  setTimeout(() => {
    clearInterval(clockInterval);
    clearInterval(streamInterval);
    if (loadScreen) loadScreen.classList.add('hide');
    setTimeout(() => {
      if (loadScreen) loadScreen.remove();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 850);
  }, 4400);

  // ---- HERO CANVAS — Particle Grid ----
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroSection = canvas.closest('.hero');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = heroSection ? heroSection.offsetHeight : window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PARTICLES = [];
  const COUNT = 80;

  for (let i = 0; i < COUNT; i++) {
    PARTICLES.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      red: Math.random() > 0.85,
    });
  }

  let mouse = { x: -9999, y: -9999 };
  // Click-based particle burst
  document.addEventListener('click', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    // Scatter nearby particles on click
    PARTICLES.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const force = (180 - dist) / 180;
        p.vx += (dx / (dist || 1)) * force * 3;
        p.vy += (dy / (dist || 1)) * force * 3;
      }
    });
    setTimeout(() => { mouse.x = -9999; mouse.y = -9999; }, 400);
  });

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    PARTICLES.forEach(p => {
      // Damping
      p.vx *= 0.98;
      p.vy *= 0.98;

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.red ? `rgba(229,62,62,${p.alpha})` : `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < PARTICLES.length; i++) {
      for (let j = i + 1; j < PARTICLES.length; j++) {
        const dx = PARTICLES[i].x - PARTICLES[j].x;
        const dy = PARTICLES[i].y - PARTICLES[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const alpha = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
          ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
          ctx.strokeStyle = `rgba(229,62,62,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ---- PLA INTERACTIVE SPHERE ----
  (function initPlaSphere() {
    const wrap  = document.getElementById('pla-sphere-wrap');
    const inner = document.getElementById('pla-inner');
    const canvas = document.getElementById('pla-canvas');
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    const W = 320, H = 320, CX = W / 2, CY = H / 2;

    // Orbit rings: [radius, tiltX, tiltY, speed, phase, color, lineWidth]
    const rings = [
      { r: 88,  rx: 0,    ry: 0,    speed: 0.008,  phase: 0,    col: 'rgba(229,62,62,0.55)', lw: 1.2 },
      { r: 108, rx: 0.6,  ry: 0,    speed: -0.006, phase: 1.1,  col: 'rgba(229,62,62,0.35)', lw: 0.8 },
      { r: 130, rx: -0.4, ry: 0.3,  speed: 0.004,  phase: 2.3,  col: 'rgba(229,62,62,0.2)',  lw: 0.6 },
      { r: 152, rx: 1.0,  ry: -0.5, speed: -0.003, phase: 0.7,  col: 'rgba(229,62,62,0.12)', lw: 0.5 },
    ];

    // Floating dots on orbits
    const dots = rings.map((ring, i) => ({
      ringIdx: i,
      angle: Math.random() * Math.PI * 2,
      size: 2 + Math.random() * 2,
    }));

    // Drag / tilt state
    let tiltX = 0, tiltY = 0; // current tilt applied to rings
    let targetTiltX = 0, targetTiltY = 0;
    let isDragging = false;
    let lastMX = 0, lastMY = 0;
    let velX = 0, velY = 0;
    let autoRotate = 0; // extra Y-rotation from drag momentum
    let t = 0;

    // Draw a tilted ellipse (orbit ring)
    function drawOrbitRing(ring, extraRotate) {
      const rx = ring.ry + tiltY * 0.5;
      const ry = ring.rx + tiltX * 0.5;
      const angle = ring.phase + ring.speed * t * 60 + extraRotate;

      // Project 3D ring to 2D ellipse
      const cosA = Math.cos(angle + autoRotate);
      const sinA = Math.sin(angle + autoRotate);
      const tiltedRy = ring.r * Math.abs(Math.cos(ry)) * 0.4 + ring.r * 0.15;
      const tiltedRx = ring.r;
      const skew = sinA * rx * 0.3;

      ctx.save();
      ctx.translate(CX, CY);
      ctx.rotate(Math.atan2(sinA * 0.4, cosA) * 0.3 + rx * 0.1);
      ctx.beginPath();
      ctx.ellipse(0, skew * 6, tiltedRx, tiltedRy, 0, 0, Math.PI * 2);
      ctx.strokeStyle = ring.col;
      ctx.lineWidth = ring.lw;
      ctx.stroke();
      ctx.restore();
    }

    // Draw a dot on its orbit
    function drawOrbitDot(dot) {
      const ring = rings[dot.ringIdx];
      const angle = dot.angle + ring.speed * t * 60 + autoRotate;
      const ry = ring.rx + tiltX * 0.5;
      const tiltedRy = ring.r * Math.abs(Math.cos(ry)) * 0.4 + ring.r * 0.15;
      const tiltedRx = ring.r;

      const x = CX + tiltedRx * Math.cos(angle);
      const y = CY + tiltedRy * Math.sin(angle);

      const grd = ctx.createRadialGradient(x, y, 0, x, y, dot.size * 3);
      grd.addColorStop(0, 'rgba(229,62,62,0.9)');
      grd.addColorStop(1, 'rgba(229,62,62,0)');
      ctx.beginPath();
      ctx.arc(x, y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(229,62,62,0.85)';
      ctx.fill();
      // glow
      ctx.beginPath();
      ctx.arc(x, y, dot.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    // Draw outer glow halo
    function drawHalo() {
      const strength = 0.3 + Math.sin(t * 0.03) * 0.1;
      const grd = ctx.createRadialGradient(CX, CY, 55, CX, CY, 160);
      grd.addColorStop(0, `rgba(229,62,62,0)`);
      grd.addColorStop(0.5, `rgba(229,62,62,${strength * 0.08})`);
      grd.addColorStop(1, `rgba(229,62,62,0)`);
      ctx.beginPath();
      ctx.arc(CX, CY, 160, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
    }

    function animate() {
      ctx.clearRect(0, 0, W, H);
      t++;

      // Ease tilt toward target
      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;

      // Decay momentum
      if (!isDragging) {
        autoRotate += velX * 0.012;
        velX *= 0.94;
        velY *= 0.94;
        targetTiltX *= 0.97;
        targetTiltY *= 0.97;
      }

      drawHalo();
      rings.forEach(ring => drawOrbitRing(ring, 0));
      dots.forEach(dot => drawOrbitDot(dot));

      // 3D light reflection on inner sphere — moves with tilt
      const lx = CX - tiltY * 8 - 20;
      const ly = CY - tiltX * 8 - 20;
      const refGrd = ctx.createRadialGradient(lx, ly, 2, CX, CY, 72);
      refGrd.addColorStop(0, 'rgba(255,255,255,0.06)');
      refGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath();
      ctx.arc(CX, CY, 72, 0, Math.PI * 2);
      ctx.fillStyle = refGrd;
      ctx.fill();

      requestAnimationFrame(animate);
    }
    animate();

    // ---- DRAG INTERACTION ----
    function onStart(mx, my) {
      isDragging = true;
      lastMX = mx; lastMY = my;
      velX = 0; velY = 0;
      wrap.style.cursor = 'grabbing';
    }
    function onMove(mx, my) {
      if (!isDragging) return;
      const dx = mx - lastMX;
      const dy = my - lastMY;
      velX = dx;
      velY = dy;
      autoRotate += dx * 0.012;
      targetTiltX += dy * 0.04;
      targetTiltY += dx * 0.04;
      targetTiltX = Math.max(-1.2, Math.min(1.2, targetTiltX));
      targetTiltY = Math.max(-1.2, Math.min(1.2, targetTiltY));
      lastMX = mx; lastMY = my;
    }
    function onEnd() {
      isDragging = false;
      wrap.style.cursor = 'grab';
    }

    wrap.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onEnd);

    // ---- TOUCH INTERACTION (enhanced) ----
    let touchStartX = 0, touchStartY = 0;
    let lastTouchX = 0, lastTouchY = 0;
    let pinchStartDist = 0;
    let isTap = false;

    wrap.addEventListener('touchstart', e => {
      e.preventDefault();
      if (e.touches.length === 1) {
        const t0 = e.touches[0];
        touchStartX = t0.clientX; touchStartY = t0.clientY;
        lastTouchX = t0.clientX; lastTouchY = t0.clientY;
        isTap = true;
        onStart(t0.clientX, t0.clientY);
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDist = Math.hypot(dx, dy);
        isDragging = false;
      }
    }, { passive: false });

    window.addEventListener('touchmove', e => {
      if (e.touches.length === 1) {
        const t0 = e.touches[0];
        const dx = t0.clientX - lastTouchX;
        const dy = t0.clientY - lastTouchY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) isTap = false;
        lastTouchX = t0.clientX; lastTouchY = t0.clientY;
        onMove(t0.clientX, t0.clientY);
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        autoRotate += (dist - pinchStartDist) * 0.004;
        pinchStartDist = dist;
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const rect = wrap.getBoundingClientRect();
        targetTiltX = Math.max(-1, Math.min(1, (my - rect.top - rect.height/2) / (rect.height/2)));
        targetTiltY = Math.max(-1, Math.min(1, (mx - rect.left - rect.width/2) / (rect.width/2)));
      }
    }, { passive: true });

    window.addEventListener('touchend', e => {
      if (isTap && e.changedTouches.length === 1) {
        fireBurst(e.changedTouches[0].clientX, e.changedTouches[0].clientY, true);
      }
      isTap = false;
      onEnd();
    });

    // ---- GYROSCOPE ----
    let gyroEnabled = false;
    function enableGyro() {
      window.addEventListener('deviceorientation', e => {
        if (isDragging) return;
        const beta  = (e.beta  || 0) - 45;
        const gamma = e.gamma || 0;
        targetTiltX = Math.max(-1, Math.min(1, beta  * 0.018));
        targetTiltY = Math.max(-1, Math.min(1, gamma * 0.022));
      }, { passive: true });
    }
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      wrap.addEventListener('click', () => {
        if (!gyroEnabled) {
          DeviceOrientationEvent.requestPermission().then(state => {
            if (state === 'granted') { enableGyro(); gyroEnabled = true; }
          }).catch(() => {});
        }
      }, { once: true });
    } else if (window.DeviceOrientationEvent) {
      enableGyro(); gyroEnabled = true;
    }

    // ---- BURST (click + tap) ----
    function fireBurst(clientX, clientY, isMobile) {
      wrap.classList.remove('burst');
      void wrap.offsetWidth;
      wrap.classList.add('burst');
      wrap.addEventListener('animationend', () => wrap.classList.remove('burst'), { once: true });
      if (isMobile && navigator.vibrate) navigator.vibrate([10, 30, 10]);
      const count = isMobile ? 18 : 12;
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'pla-burst-dot';
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
        const dist = (isMobile ? 90 : 80) + Math.random() * 70;
        dot.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        dot.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
        dot.style.setProperty('--dur', (0.45 + Math.random() * 0.4) + 's');
        dot.style.width = dot.style.height = ((isMobile ? 4 : 3) + Math.random() * 5) + 'px';
        wrap.appendChild(dot);
        dot.addEventListener('animationend', () => dot.remove(), { once: true });
      }
      velX += (Math.random() - 0.5) * (isMobile ? 14 : 8);
      velY += (Math.random() - 0.5) * (isMobile ? 14 : 8);
    }

    wrap.addEventListener('click', e => {
      if (e.pointerType === 'touch') return;
      fireBurst(e.clientX, e.clientY, false);
    });

    // ---- HOVER TILT (mouse proximity) ----
    wrap.addEventListener('mousemove', e => {
      if (isDragging) return;
      const rect = wrap.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetTiltX = ny * 0.8;
      targetTiltY = nx * 0.8;
    });
    wrap.addEventListener('mouseleave', () => {
      if (!isDragging) { targetTiltX = 0; targetTiltY = 0; }
    });
  })();

  // ---- GSAP SCROLL (kept for other elements) ----
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ---- CATEGORY CARD CLICK FLASH ----
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.add('cat-flash');
      card.addEventListener('animationend', () => card.classList.remove('cat-flash'), { once: true });
    });
  });

});
