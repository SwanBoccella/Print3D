// ============================================================
// INDEX PAGE JS — Hero canvas + GSAP animations
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ================================================================
  // DEVICE DETECTION — choose which loading screen to show
  // Desktop: pointer device + wide screen + not touch-primary
  // Mobile:  touch-primary OR narrow viewport
  // ================================================================
  const isDesktop = (() => {
    const ua = navigator.userAgent;
    const isMobileDevice =
      /Android/i.test(ua) ||
      /iPhone|iPod/i.test(ua) ||
      /iPad/i.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (isMobileDevice) return false;
    return window.innerWidth >= 1024;
  })();

  // Show / hide the right loader
  const mobileLoader  = document.getElementById('loading-screen');
  const desktopLoader = document.getElementById('loading-screen-desktop');

  if (isDesktop) {
    if (mobileLoader)  mobileLoader.style.display  = 'none';
    if (desktopLoader) desktopLoader.classList.add('ldd-active');
  } else {
    if (desktopLoader) desktopLoader.style.display = 'none';
    // mobile loader keeps its default display
  }

  // ================================================================
  // DESKTOP LOADING SCREEN ENGINE
  // ================================================================
  if (isDesktop && desktopLoader) {
    const lddCanvas   = document.getElementById('ldd-canvas');
    const lddPhaseEl  = document.getElementById('ldd-phase');
    const lddPctEl    = document.getElementById('ldd-pct');
    const lddSegs     = document.getElementById('ldd-segs');
    const lddLayersD  = document.getElementById('ldd-layers-d');
    const lddEta      = document.getElementById('ldd-eta');
    const lddTempEl   = document.getElementById('ldd-temp');
    const lddBedEl    = document.getElementById('ldd-bed');
    const lddSpeedEl  = document.getElementById('ldd-speed');
    const lddInfillEl = document.getElementById('ldd-infill');
    const lddLog      = document.getElementById('ldd-log');
    const lddClockEl  = document.getElementById('ldd-clock-d');
    const lddStatusEl = document.getElementById('ldd-status-text');
    const lddSidDate  = document.getElementById('ldd-sid-date');

    // Update date in top-right
    const now = new Date();
    if (lddSidDate) lddSidDate.textContent =
      now.getFullYear() + '.' +
      String(now.getMonth()+1).padStart(2,'0') + '.' +
      String(now.getDate()).padStart(2,'0');

    // ---- Build 20 progress segments ----
    const SEG_COUNT = 20;
    if (lddSegs) {
      for (let i = 0; i < SEG_COUNT; i++) {
        const s = document.createElement('div');
        s.className = 'ldd-seg';
        s.id = 'ldd-s' + i;
        lddSegs.appendChild(s);
      }
    }

    // ---- Orbit ring circumferences (for dashoffset) ----
    // outer r200 circ ≈ 1257.1, mid r150 ≈ 942.5, inner r88 ≈ 553.0
    const CIRC_OUTER = 1257.1, CIRC_MID = 942.5, CIRC_INNER = 553.0;
    const lddOrbitOuter = document.getElementById('ldd-orbit-outer');
    const lddOrbitMid   = document.getElementById('ldd-orbit-mid');
    const lddOrbitInner = document.getElementById('ldd-orbit-inner');

    function setLddProgress(pct) {
      const frac = pct / 100;

      // Segments
      const litCount = Math.round(frac * SEG_COUNT);
      for (let i = 0; i < SEG_COUNT; i++) {
        const s = document.getElementById('ldd-s' + i);
        if (!s) continue;
        s.className = 'ldd-seg' +
          (i < litCount ? ' ldd-seg--lit' + (i === litCount - 1 ? ' ldd-seg--tip' : '') : '');
      }

      // Orbit fill arcs
      if (lddOrbitOuter) lddOrbitOuter.style.strokeDashoffset = CIRC_OUTER * (1 - frac);
      if (lddOrbitMid)   lddOrbitMid.style.strokeDashoffset   = CIRC_MID   * (1 - frac);
      if (lddOrbitInner) lddOrbitInner.style.strokeDashoffset = CIRC_INNER * (1 - frac);

      // Pct text
      if (lddPctEl) lddPctEl.textContent = pct + '%';

      // Layer count
      if (lddLayersD) lddLayersD.textContent = 'LAYERS: ' + Math.floor(frac * 240) + ' / 240';

      // ETA
      const remaining = Math.max(0, Math.round((100 - pct) / 100 * 4.4));
      if (lddEta) lddEta.textContent = 'ETA: ' + remaining + 's';
    }

    // ---- Clock ----
    const lddStart = Date.now();
    const lddClockTick = setInterval(() => {
      const el = Date.now() - lddStart;
      const ms = el % 1000;
      const s  = Math.floor(el / 1000) % 60;
      const m  = Math.floor(el / 60000) % 60;
      if (lddClockEl) lddClockEl.textContent =
        String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0') + ':' + String(ms).padStart(3,'0').slice(0,2);
    }, 50);

    // ---- Log stream ----
    const logLines = [
      'G28 X Y Z — HOME ALL AXES','EEPROM: 512B OK','FW: MARLIN 3.6.2',
      'MESH BED LEVELING: ACTIVE','PID AUTOTUNE: E0 PASS','M104 S210 T0',
      'M140 S60 BED PREHEAT','AXIS X: HOMED OK','AXIS Z: HOMED OK',
      'ABL PROBE PASS','SLICER: CURA 5.4 READY','NOZZLE: 0.4mm BRASS',
      'FLOW RATE: 100%','RETRACT: 5.0mm','FAN: LAYER 3+ 100%',
      'PRINT SPEED: 60mm/s','INFILL: GRID 20%','SUPPORT: DISABLED',
      '0xE5 0x3E 0x3E 0xFF','COMMS: USB+SD OK',
    ];
    let lddLogIdx = 0;
    const lddLogTick = setInterval(() => {
      if (!lddLog) return;
      const ln = document.createElement('div');
      ln.className = 'ldd-log-line' + (Math.random() > 0.75 ? ' hot' : '');
      ln.textContent = logLines[lddLogIdx % logLines.length];
      lddLog.appendChild(ln);
      if (lddLog.children.length > 12) lddLog.removeChild(lddLog.firstChild);
      lddLogIdx++;
    }, 180);

    // ---- Telemetry live countup ----
    function lddAnimTele(el, from, to, unit, dur) {
      if (!el) return;
      const t0 = Date.now();
      function tick() {
        const t = Math.min((Date.now()-t0)/dur, 1);
        el.textContent = Math.round(from + (to-from)*t) + unit;
        if (t < 1) requestAnimationFrame(tick);
        else el.classList.add('live');
      }
      requestAnimationFrame(tick);
    }

    // ---- Checklist helpers ----
    function lddSetChk(i, state) {
      const el = document.getElementById('ldd-chk-'+i);
      if (!el) return;
      const icon = el.querySelector('.ldd-chk-i');
      el.className = 'ldd-chk ' + (state === 'done' ? 'ldd-done' : state === 'active' ? 'ldd-active' : '');
      if (icon) icon.textContent = state === 'done' ? '✓' : state === 'active' ? '▶' : '○';
    }

    // ---- Phases ----
    const lddPhases = [
      { pct: 12,  label: 'LOADING ASSETS',     chk: 0, delay: 200  },
      { pct: 30,  label: 'CALIBRATING AXES',   chk: 1, delay: 750  },
      { pct: 55,  label: 'SLICING GEOMETRY',   chk: 2, delay: 1550 },
      { pct: 78,  label: 'HEATING EXTRUDER',   chk: 3, delay: 2400 },
      { pct: 100, label: 'SYSTEM READY',       chk: 4, delay: 3300 },
    ];

    let lddCurrPct = 0;
    lddPhases.forEach(({ pct, label, chk, delay }) => {
      setTimeout(() => {
        if (lddPhaseEl) lddPhaseEl.textContent = label;
        if (lddStatusEl) lddStatusEl.textContent = label;

        // Animate pct
        const from = lddCurrPct, to = pct;
        const dur = 420;
        const t0 = Date.now();
        function tick() {
          const t = Math.min((Date.now()-t0)/dur, 1);
          const ease = 1 - Math.pow(1-t, 3);
          setLddProgress(Math.round(from + (to-from)*ease));
          if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        lddCurrPct = pct;

        // Checklist
        for (let i = 0; i <= chk; i++) {
          lddSetChk(i, i < chk ? 'done' : 'active');
        }

        // Telemetry
        if (chk === 2) {
          lddAnimTele(lddTempEl, 25, 210, '°C', 650);
          lddAnimTele(lddBedEl,  25,  60, '°C', 650);
        }
        if (chk === 3) {
          lddAnimTele(lddSpeedEl,  0, 60, ' mm/s', 400);
          lddAnimTele(lddInfillEl, 0, 20, '%', 400);
        }
      }, delay);
    });

    // Mark all done
    setTimeout(() => {
      for (let i = 0; i < 5; i++) lddSetChk(i, 'done');
      if (lddStatusEl) lddStatusEl.textContent = 'ALL SYSTEMS NOMINAL — READY';
      const dot = desktopLoader.querySelector('.ldd-bb-dot');
      if (dot) dot.style.background = '#4caf50';
    }, 3900);

    // Hide desktop loader
    setTimeout(() => {
      clearInterval(lddClockTick);
      clearInterval(lddLogTick);
      if (desktopLoader) desktopLoader.classList.add('ldd-hide');
      setTimeout(() => {
        if (desktopLoader) desktopLoader.remove();
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }, 950);
    }, 4500);

    // ---- Desktop canvas: parametric grid + oscillating lines ----
    if (lddCanvas) {
      const dctx = lddCanvas.getContext('2d');
      lddCanvas.width  = window.innerWidth;
      lddCanvas.height = window.innerHeight;
      const W = lddCanvas.width, H = lddCanvas.height;

      // Parametric points on a torus-like surface
      const RINGS = 8, PTS = 40;
      let angle = 0;
      function drawDesktopCanvas() {
        dctx.clearRect(0, 0, W, H);
        angle += 0.004;
        const cx = W/2, cy = H/2;
        const R1 = Math.min(W,H) * 0.32; // major radius
        const R2 = Math.min(W,H) * 0.08; // minor radius

        for (let ring = 0; ring < RINGS; ring++) {
          const phi = (ring / RINGS) * Math.PI * 2 + angle * 0.7;
          const pts = [];
          for (let i = 0; i <= PTS; i++) {
            const theta = (i / PTS) * Math.PI * 2 + angle;
            const rx = (R1 + R2 * Math.cos(phi)) * Math.cos(theta);
            const ry = (R1 + R2 * Math.cos(phi)) * Math.sin(theta);
            const rz = R2 * Math.sin(phi);
            // Simple perspective
            const persp = 5 / (5 + rz / Math.min(W,H) * 1.5);
            pts.push([cx + rx * persp, cy + ry * persp]);
          }
          const alpha = 0.08 + 0.06 * Math.sin(phi + angle);
          dctx.beginPath();
          dctx.moveTo(pts[0][0], pts[0][1]);
          for (let i = 1; i < pts.length; i++) {
            dctx.lineTo(pts[i][0], pts[i][1]);
          }
          dctx.strokeStyle = `rgba(229,62,62,${alpha})`;
          dctx.lineWidth = 0.7;
          dctx.stroke();
        }

        // Cross-meridian lines
        for (let i = 0; i < PTS; i += 4) {
          const theta = (i / PTS) * Math.PI * 2;
          const pts2 = [];
          for (let ring = 0; ring <= RINGS; ring++) {
            const phi = (ring / RINGS) * Math.PI * 2 + angle * 0.7;
            const rx = (R1 + R2 * Math.cos(phi)) * Math.cos(theta + angle);
            const ry = (R1 + R2 * Math.cos(phi)) * Math.sin(theta + angle);
            const rz = R2 * Math.sin(phi);
            const persp = 5 / (5 + rz / Math.min(W,H) * 1.5);
            pts2.push([cx + rx * persp, cy + ry * persp]);
          }
          dctx.beginPath();
          dctx.moveTo(pts2[0][0], pts2[0][1]);
          for (let i = 1; i < pts2.length; i++) dctx.lineTo(pts2[i][0], pts2[i][1]);
          dctx.strokeStyle = 'rgba(229,62,62,0.04)';
          dctx.lineWidth = 0.5;
          dctx.stroke();
        }

        requestAnimationFrame(drawDesktopCanvas);
      }
      drawDesktopCanvas();
    }
  }
  // ================================================================
  // END DESKTOP LOADING SCREEN ENGINE
  // ================================================================

  // ---- LOADING SCREEN — Advanced (MOBILE, skipped on desktop) ----
  if (!isDesktop) {
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
    // No hard pixel cap — scales with viewport so it fills space on "desktop mode" phones
    const SIZE = Math.min(lc.width, lc.height) * 0.28;

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
  } // end if (!isDesktop) — mobile loader

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

  // ============================================================
  // PLA INTERACTIVE SPHERE — ULTRA CRAZY EDITION
  // 12 modalità folli che cambiano ad ogni click
  // ============================================================
  (function initPlaSphere() {
    const wrap  = document.getElementById('pla-sphere-wrap');
    const inner = document.getElementById('pla-inner');
    const plaLabel = inner ? inner.querySelector('.pla-label') : null;
    const canvas = document.getElementById('pla-canvas');
    const hint   = document.getElementById('pla-hint');
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext('2d');
    const W = 320, H = 320, CX = W / 2, CY = H / 2;

    // ---- BASE STATE ----
    const rings = [
      { r: 88,  rx: 0,    ry: 0,    speed: 0.008,  phase: 0,    col: 'rgba(229,62,62,0.55)', lw: 1.2 },
      { r: 108, rx: 0.6,  ry: 0,    speed: -0.006, phase: 1.1,  col: 'rgba(229,62,62,0.35)', lw: 0.8 },
      { r: 130, rx: -0.4, ry: 0.3,  speed: 0.004,  phase: 2.3,  col: 'rgba(229,62,62,0.2)',  lw: 0.6 },
      { r: 152, rx: 1.0,  ry: -0.5, speed: -0.003, phase: 0.7,  col: 'rgba(229,62,62,0.12)', lw: 0.5 },
    ];
    const dots = rings.map((ring, i) => ({
      ringIdx: i, angle: Math.random() * Math.PI * 2, size: 2 + Math.random() * 2,
    }));

    let tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
    let isDragging = false, lastMX = 0, lastMY = 0;
    let velX = 0, velY = 0, autoRotate = 0;
    let t = 0;

    // ---- CRAZY MODE SYSTEM ----
    const MODES = [
      'BLACKHOLE','NORMAL','ELECTRIC','SONAR','MATRIX',
      'PARTY','VORTEX','MAGNET','RAINBOW',
      'FORGE','EXPLODE','GLITCH'
    ];
    let currentMode = 'NORMAL';
    let modeT = 0;
    let clickCount = 0;

    // mode-specific state
    let gravityY = 0, gravityVY = 0, gravityBounce = 0;
    let electricArcs = [];
    let faceEyeX = 0, faceEyeY = 0, faceTargetX = 0, faceTargetY = 0, faceMouthOpen = 0;
    let matrixChars = [];
    let partyHue = 0;
    let blackholeParticles = [];
    let liquidDrops = [];
    let vortexParticles = [];
    let magnetRepel = false;
    let magnetParticles = [];
    let magnetFieldPhase = 0;
    let magnetPulse = 0;
    let rainbowPhase = 0;
    let explodeFrags = [];
    let glitchOffset = 0;
    let modeTimeout = null;
    // SONAR state
    let sonarWaves = [];
    let sonarEchos = [];
    // FORGE state
    let forgeSparks = [];

    const MODE_HINTS = {
      NORMAL:    'DRAG · CLICK · EXPLORE',
      ELECTRIC:  '⚡ ELECTRIC MODE — SCARICA!',
      SONAR:     '📡 SONAR MODE — PING!',
      MATRIX:    '⬛ MATRIX MODE — SEGUI IL CONIGLIO',
      PARTY:     '🎉 PARTY MODE — BALLA!',
      BLACKHOLE: '🕳 BLACK HOLE — TUTTO VIENE ASSORBITO',
      VORTEX:    '🌀 VORTEX — RISUCCHIATO!',
      MAGNET:    '🧲 MAGNET — DRAG PER INVERTIRE IL CAMPO',
      RAINBOW:   '🌈 RAINBOW — PURA LUCE',
      FORGE:     '🔥 FORGE — ACCIAIO FUSO',
      EXPLODE:   '💥 EXPLODE — VA\' IN PEZZI!',
      GLITCH:    '⛔ GLITCH — ERRORE SISTEMA',
    };

    function setMode(mode) {
      currentMode = mode;
      modeT = 0;

      // Reset ALL visuals — including opacity which EXPLODE sets to 0
      inner.style.transform = '';
      inner.style.filter = '';
      inner.style.background = '';
      inner.style.boxShadow = '';
      inner.style.transition = '';
      inner.style.opacity = '1';
      if (plaLabel) { plaLabel.style.color = ''; plaLabel.style.textShadow = ''; plaLabel.style.transform = ''; }
      wrap.style.transform = '';
      wrap.style.filter = '';

      // Clear mode-specific overlays
      wrap.querySelectorAll('.pla-mode-overlay').forEach(el => el.remove());

      if (hint) hint.textContent = MODE_HINTS[mode] || 'CLICK PER CAMBIARE MODALITÀ';

      // Initialize mode
      if (mode === 'ELECTRIC') {
        electricArcs = Array.from({length: 8}, (_, i) => ({
          angle: (i / 8) * Math.PI * 2 + Math.random() * 0.5,
          len: 55 + Math.random() * 70,
          life: Math.random(),
          speed: 0.06 + Math.random() * 0.07,
          segs: Math.floor(7 + Math.random() * 7),
          jitter: 14 + Math.random() * 12,
          branches: [],
          width: 0.8 + Math.random() * 1.2,
          bright: Math.random() > 0.4,
        }));
      }
      if (mode === 'MATRIX') {
        matrixChars = Array.from({length:30}, () => ({
          x: Math.random() * W,
          y: Math.random() * H - H,
          speed: 2 + Math.random() * 4,
          char: '',
          len: Math.floor(5 + Math.random() * 12),
          chars: Array.from({length:15}, () => String.fromCharCode(0x30A0 + Math.random()*96)),
        }));
      }
      if (mode === 'PARTY') {
        partyHue = 0;
        createPartyConfetti();
      }
      if (mode === 'BLACKHOLE') {
        blackholeParticles = Array.from({length:60}, () => ({
          x: CX + (Math.random()-0.5)*W*1.5,
          y: CY + (Math.random()-0.5)*H*1.5,
          vx: (Math.random()-0.5)*2,
          vy: (Math.random()-0.5)*2,
          size: 1 + Math.random()*3,
          col: `hsl(${Math.random()*30+350},90%,${40+Math.random()*40}%)`,
          trail: [],
        }));
      }
      if (mode === 'VORTEX') {
        vortexParticles = Array.from({length: 80}, () => {
          const angle = Math.random() * Math.PI * 2;
          const r = 80 + Math.random() * 75;
          return {
            angle,
            r,
            speed: 0.008 + Math.random() * 0.012,
            drift: -0.15 - Math.random() * 0.2,  // spiral inward
            size: 1 + Math.random() * 2.5,
            hue: 260 + Math.random() * 80,        // purple-cyan band
            alpha: 0.4 + Math.random() * 0.6,
            trail: [],
          };
        });
      }
      if (mode === 'EXPLODE') {
        explodeFrags = Array.from({length:40}, () => {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          return {
            x: CX, y: CY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random()-0.5) * 0.2,
            size: 6 + Math.random() * 18,
            col: `hsl(${Math.random()*30+340},90%,55%)`,
            alpha: 1,
          };
        });
        inner.style.opacity = '0';
        if (navigator.vibrate) navigator.vibrate([20,40,20,40,80]);
      }
      if (mode === 'GLITCH') {
        if (navigator.vibrate) navigator.vibrate([5,10,5,10,5]);
        startGlitch();
      }
      if (mode === 'RAINBOW') {
        rainbowPhase = 0;
      }
      if (mode === 'SONAR') {
        sonarWaves = [];
        sonarEchos = [];
        // Kick first ping immediately
        sonarWaves.push({ r: 72, maxR: 155, alpha: 1, speed: 1.8 });
      }
      if (mode === 'FORGE') {
        forgeSparks = [];
        inner.style.transition = 'none';
      }
      if (mode === 'MAGNET') {
        magnetRepel = false;
        magnetFieldPhase = 0;
        magnetPulse = 0;
        magnetParticles = Array.from({length: 28}, (_, i) => {
          const angle = (i / 28) * Math.PI * 2;
          const orbitR = 85 + Math.random() * 55;
          return {
            angle,
            orbitR,
            orbitSpeed: (0.008 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1),
            size: 1.5 + Math.random() * 2.5,
            alpha: 0.4 + Math.random() * 0.6,
            life: Math.random(),
            phase: Math.random() * Math.PI * 2,
          };
        });
        if (hint) hint.textContent = '🧲 DRAG PER INVERTIRE — CLICK PER AVANZARE';
      }
    }

    function createPartyConfetti() {
      for (let i = 0; i < 50; i++) {
        const c = document.createElement('div');
        c.className = 'pla-mode-overlay pla-confetti';
        const hue = Math.random() * 360;
        c.style.cssText = `
          position:absolute;
          width:${4+Math.random()*8}px;
          height:${4+Math.random()*4}px;
          background:hsl(${hue},90%,60%);
          left:50%;top:50%;
          border-radius:${Math.random()>0.5?'50%':'2px'};
          pointer-events:none;
          z-index:20;
          --tx:${(Math.random()-0.5)*300}px;
          --ty:${(Math.random()-0.5)*300}px;
          --rot:${Math.random()*720}deg;
          animation: confettiFly ${0.8+Math.random()*1.2}s cubic-bezier(0,0.9,0.5,1) ${Math.random()*0.4}s both;
        `;
        wrap.appendChild(c);
        c.addEventListener('animationend', () => c.remove());
      }
    }

    let glitchInterval = null;
    function startGlitch() {
      if (glitchInterval) clearInterval(glitchInterval);
      let glitchCount = 0;
      glitchInterval = setInterval(() => {
        glitchCount++;
        const ox = (Math.random()-0.5)*20;
        const oy = (Math.random()-0.5)*8;
        inner.style.transform = `translate(${ox}px,${oy}px) skew(${(Math.random()-0.5)*8}deg)`;
        inner.style.filter = `hue-rotate(${Math.random()*360}deg) saturate(3)`;
        if (plaLabel) plaLabel.style.textShadow = `${(Math.random()-0.5)*10}px 0 #0ff, ${(Math.random()-0.5)*10}px 0 #f0f`;
        if (glitchCount > 20) {
          clearInterval(glitchInterval);
          glitchInterval = null;
          inner.style.transform = '';
          inner.style.filter = '';
          if (plaLabel) plaLabel.style.textShadow = '';
        }
      }, 80);
    }

    // ---- BASE DRAW FUNCTIONS ----
    function drawOrbitRing(ring, extraRotate, colorOverride) {
      const rx = ring.ry + tiltY * 0.5;
      const ry = ring.rx + tiltX * 0.5;
      const angle = ring.phase + ring.speed * t * 60 + extraRotate;
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
      ctx.strokeStyle = colorOverride || ring.col;
      ctx.lineWidth = ring.lw;
      ctx.stroke();
      ctx.restore();
    }

    function drawOrbitDot(dot, colorOverride) {
      const ring = rings[dot.ringIdx];
      const angle = dot.angle + ring.speed * t * 60 + autoRotate;
      const ry = ring.rx + tiltX * 0.5;
      const tiltedRy = ring.r * Math.abs(Math.cos(ry)) * 0.4 + ring.r * 0.15;
      const x = CX + ring.r * Math.cos(angle);
      const y = CY + tiltedRy * Math.sin(angle);
      const col = colorOverride || 'rgba(229,62,62,0.85)';
      ctx.beginPath(); ctx.arc(x, y, dot.size, 0, Math.PI*2);
      ctx.fillStyle = col; ctx.fill();
      const grd = ctx.createRadialGradient(x,y,0,x,y,dot.size*3);
      grd.addColorStop(0, col); grd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(x,y,dot.size*3,0,Math.PI*2);
      ctx.fillStyle = grd; ctx.fill();
    }

    function drawHalo(colorOverride, alphaMultiplier=1) {
      const strength = (0.3 + Math.sin(t * 0.03) * 0.1) * alphaMultiplier;
      const col = colorOverride || '229,62,62';
      const grd = ctx.createRadialGradient(CX,CY,55,CX,CY,160);
      grd.addColorStop(0,`rgba(${col},0)`);
      grd.addColorStop(0.5,`rgba(${col},${strength*0.08})`);
      grd.addColorStop(1,`rgba(${col},0)`);
      ctx.beginPath(); ctx.arc(CX,CY,160,0,Math.PI*2);
      ctx.fillStyle = grd; ctx.fill();
    }

    function drawBaseReflection() {
      const lx = CX - tiltY*8 - 20, ly = CY - tiltX*8 - 20;
      const refGrd = ctx.createRadialGradient(lx,ly,2,CX,CY,72);
      refGrd.addColorStop(0,'rgba(255,255,255,0.06)');
      refGrd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX,CY,72,0,Math.PI*2);
      ctx.fillStyle = refGrd; ctx.fill();
    }

    // ---- MODE RENDERERS ----
    function renderGravity() {
      gravityVY += 0.4;
      gravityY += gravityVY;
      if (gravityY > 80) { gravityY = 80; gravityVY *= -0.75; if (navigator.vibrate) navigator.vibrate(15); }
      inner.style.transform = `translateY(${gravityY}px) scaleX(${1+Math.abs(gravityVY)*0.008}) scaleY(${1-Math.abs(gravityVY)*0.01})`;
      const squish = Math.max(0, 1 - Math.abs(gravityY-80)/20);
      drawHalo('229,62,62', 0.5 + squish);
      rings.forEach(ring => drawOrbitRing(ring, 0));
      dots.forEach(d => drawOrbitDot(d));
      drawBaseReflection();
    }

    // Helper: draw a single Lichtenberg-style bolt from (sx,sy) in direction (angle) for length (len)
    function drawLightningBolt(sx, sy, angle, len, segs, jitter, alpha, width, depth) {
      if (depth > 3 || len < 8) return;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      let cx2 = sx, cy2 = sy;
      const pts = [[sx, sy]];
      for (let s = 1; s <= segs; s++) {
        const prog = s / segs;
        const wander = (Math.random() - 0.5) * jitter * (1 - prog * 0.4);
        const perpAngle = angle + Math.PI * 0.5;
        const nx = sx + Math.cos(angle) * len * prog + Math.cos(perpAngle) * wander;
        const ny = sy + Math.sin(angle) * len * prog + Math.sin(perpAngle) * wander;
        ctx.lineTo(nx, ny);
        pts.push([nx, ny]);
        cx2 = nx; cy2 = ny;
      }
      // Core bright line
      ctx.strokeStyle = `rgba(220,240,255,${alpha * 0.95})`;
      ctx.lineWidth = width * (depth === 0 ? 1.6 : 0.9 / depth);
      ctx.shadowColor = '#7df';
      ctx.shadowBlur = depth === 0 ? 14 : 7;
      ctx.stroke();
      // Outer glow pass
      ctx.beginPath();
      pts.forEach(([px, py], i) => i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py));
      ctx.strokeStyle = `rgba(100,190,255,${alpha * 0.35})`;
      ctx.lineWidth = width * (depth === 0 ? 5 : 2.5 / depth);
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.shadowBlur = 0;
      // Branches at random segment points
      const branchCount = depth === 0 ? Math.floor(2 + Math.random() * 3) : (Math.random() > 0.4 ? 1 : 0);
      for (let b = 0; b < branchCount; b++) {
        const bIdx = Math.floor(1 + Math.random() * (pts.length - 2));
        const [bx, by] = pts[bIdx];
        const branchAngle = angle + (Math.random() - 0.5) * 1.4 + (Math.random() > 0.5 ? Math.PI * 0.25 : -Math.PI * 0.25);
        const branchLen = len * (0.3 + Math.random() * 0.4);
        const branchAlpha = alpha * (0.5 + Math.random() * 0.3);
        drawLightningBolt(bx, by, branchAngle, branchLen, Math.floor(segs * 0.6), jitter * 0.7, branchAlpha, width * 0.55, depth + 1);
      }
    }

    function renderElectric() {
      // ── Electric atmosphere background pulse ──
      const bgFlash = 0.04 + 0.04 * Math.sin(t * 0.15);
      const bgGrd = ctx.createRadialGradient(CX, CY, 20, CX, CY, 160);
      bgGrd.addColorStop(0, `rgba(80,160,255,${bgFlash})`);
      bgGrd.addColorStop(0.5, `rgba(50,100,200,${bgFlash * 0.5})`);
      bgGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX, CY, 160, 0, Math.PI * 2);
      ctx.fillStyle = bgGrd; ctx.fill();

      drawHalo('100,180,255', 2.2);
      rings.forEach((ring, i) => drawOrbitRing(ring, 0, `rgba(100,200,255,${0.3 + i * 0.1})`));
      dots.forEach(d => drawOrbitDot(d, 'rgba(180,230,255,0.95)'));
      drawBaseReflection();

      // ── Main lightning bolts ──
      electricArcs.forEach((arc, idx) => {
        arc.life += arc.speed;
        if (arc.life > 1) {
          // Respawn with new properties
          arc.angle = Math.random() * Math.PI * 2;
          arc.len = 55 + Math.random() * 70;
          arc.life = 0;
          arc.segs = Math.floor(7 + Math.random() * 7);
          arc.jitter = 14 + Math.random() * 12;
          arc.width = 0.8 + Math.random() * 1.2;
          arc.bright = Math.random() > 0.4;
        }

        // Life curve: quick rise, slow fade → sharp strike feel
        const lifeAlpha = Math.pow(Math.sin(arc.life * Math.PI), 0.5) * 0.92;
        if (lifeAlpha < 0.04) return;

        const startR = 72;
        const startAngle = arc.angle + autoRotate;
        const sx = CX + Math.cos(startAngle) * startR;
        const sy = CY + Math.sin(startAngle) * startR;

        // Each bolt re-randomizes geometry every frame for flickering effect
        ctx.save();
        drawLightningBolt(sx, sy, startAngle, arc.len, arc.segs, arc.jitter, lifeAlpha, arc.width, 0);
        ctx.restore();

        // ── Impact flash at bolt origin ──
        if (arc.bright && lifeAlpha > 0.6) {
          const flashGrd = ctx.createRadialGradient(sx, sy, 0, sx, sy, 12);
          flashGrd.addColorStop(0, `rgba(220,240,255,${lifeAlpha * 0.8})`);
          flashGrd.addColorStop(1, 'rgba(100,180,255,0)');
          ctx.beginPath(); ctx.arc(sx, sy, 12, 0, Math.PI * 2);
          ctx.fillStyle = flashGrd; ctx.fill();
        }
      });

      // ── Random spark micro-discharges across sphere surface ──
      if (Math.random() > 0.55) {
        const sa = Math.random() * Math.PI * 2;
        const sx = CX + Math.cos(sa + autoRotate) * 68;
        const sy = CY + Math.sin(sa + autoRotate) * 68;
        ctx.save();
        drawLightningBolt(sx, sy, sa + (Math.random() - 0.5) * 0.8, 20 + Math.random() * 25, 4, 8, 0.6 + Math.random() * 0.3, 0.5, 1);
        ctx.restore();
      }

      // ── Sphere flash on strike ──
      const maxArcLife = Math.max(...electricArcs.map(a => Math.sin(a.life * Math.PI)));
      const flashIntensity = maxArcLife * 0.5;
      inner.style.filter = `brightness(${1 + flashIntensity}) saturate(${1 + flashIntensity * 0.5}) hue-rotate(${Math.sin(t * 0.12) * 20}deg)`;
      inner.style.boxShadow = `0 0 ${40 + flashIntensity * 60}px rgba(100,200,255,${0.6 + flashIntensity * 0.4}), 0 0 90px rgba(60,120,255,0.3), inset 0 0 20px rgba(0,0,0,0.5)`;
      if (plaLabel) plaLabel.style.textShadow = `0 0 20px #4af, 0 0 ${40 + flashIntensity * 40}px #8ef`;
    }

    function renderFace() {
      drawHalo('229,62,62');
      rings.forEach(ring => drawOrbitRing(ring, 0));
      drawBaseReflection();
      faceEyeX += (faceTargetX - faceEyeX) * 0.1;
      faceEyeY += (faceTargetY - faceEyeY) * 0.1;
      faceMouthOpen = Math.sin(t * 0.05) * 0.5 + 0.5;
      // Eyes
      const eyeOffsetX = 20, eyeOffsetY = -10, eyeR = 12;
      [-1,1].forEach(side => {
        const ex = CX + side * eyeOffsetX + faceEyeX * 4;
        const ey = CY + eyeOffsetY + faceEyeY * 4;
        ctx.beginPath(); ctx.arc(ex, ey, eyeR, 0, Math.PI*2);
        ctx.fillStyle = '#fff'; ctx.fill();
        ctx.beginPath(); ctx.arc(ex+faceEyeX*3, ey+faceEyeY*3, eyeR*0.55, 0, Math.PI*2);
        ctx.fillStyle = '#111'; ctx.fill();
        ctx.beginPath(); ctx.arc(ex+faceEyeX*3+2, ey+faceEyeY*3-2, eyeR*0.15, 0, Math.PI*2);
        ctx.fillStyle = '#fff'; ctx.fill();
        // Eyelid blink
        if (Math.sin(t*0.04) > 0.96) {
          ctx.beginPath(); ctx.arc(ex, ey, eyeR, Math.PI, Math.PI*2);
          ctx.fillStyle = '#1a1a1a'; ctx.fill();
        }
      });
      // Mouth
      ctx.beginPath();
      ctx.arc(CX + faceEyeX*2, CY + 22, 18, 0, Math.PI * faceMouthOpen);
      ctx.strokeStyle = 'rgba(229,62,62,0.9)';
      ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke();
      // Eyebrows
      if (faceTargetY < -0.3) {
        [-1,1].forEach(s => {
          ctx.beginPath();
          ctx.moveTo(CX+s*(eyeOffsetX-8), CY+eyeOffsetY-eyeR-2);
          ctx.lineTo(CX+s*(eyeOffsetX+8), CY+eyeOffsetY-eyeR+4);
          ctx.strokeStyle='rgba(229,62,62,0.7)'; ctx.lineWidth=3; ctx.stroke();
        });
      }
    }

    function renderMatrix() {
      // Faint dark overlay for trail effect (instead of full clear)
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0,0,W,H);

      ctx.font = 'bold 12px monospace';  // set once, not per char
      matrixChars.forEach(col => {
        col.y += col.speed;
        if (col.y > H + 100) { col.y = -Math.random()*H*0.5; col.x = Math.random()*W; }
        // Randomly mutate one char per column per frame
        if (Math.random() > 0.9) {
          const idx = Math.floor(Math.random() * col.chars.length);
          col.chars[idx] = String.fromCharCode(0x30A0 + Math.random()*96);
        }
        col.chars.forEach((ch, i) => {
          const cy2 = col.y - i * 14;
          if (cy2 < -14 || cy2 > H + 14) return;
          const isHead = i === 0;
          const distFromCenter = Math.hypot(col.x - CX, cy2 - CY);
          const fade = 1 - i / col.chars.length;
          const alpha = distFromCenter < 78 ? 0.08 : fade;
          if (alpha < 0.02) return;
          ctx.fillStyle = isHead
            ? `rgba(200,255,200,${alpha})`
            : `rgba(0,${140 + Math.floor(fade * 100)},0,${alpha})`;
          ctx.fillText(ch, col.x, cy2);
        });
      });

      // Pulse ring around sphere
      const pulseR = 72 + Math.sin(t*0.05)*4;
      ctx.beginPath(); ctx.arc(CX,CY,pulseR,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,255,70,${0.25+Math.sin(t*0.05)*0.1})`;
      ctx.lineWidth=1.5; ctx.stroke();

      inner.style.background = `radial-gradient(circle at 35% 35%, #0a2a0a, #000)`;
      inner.style.boxShadow = `0 0 40px rgba(0,255,70,0.4), inset 0 0 20px rgba(0,0,0,0.9)`;
      if (plaLabel) { plaLabel.style.color = '#0f0'; plaLabel.style.textShadow = '0 0 20px #0f0'; }
    }

    function renderParty() {
      partyHue = (partyHue + 3) % 360;
      const col = `hsl(${partyHue},90%,60%)`;
      const col2 = `hsl(${(partyHue+120)%360},90%,60%)`;
      drawHalo(`${Math.floor(Math.sin(t*0.05)*128+128)},${Math.floor(Math.cos(t*0.04)*128+128)},255`, 3);
      rings.forEach((ring,i) => {
        const h = (partyHue + i*90) % 360;
        drawOrbitRing(ring, 0, `hsla(${h},90%,60%,0.7)`);
      });
      dots.forEach((d,i) => drawOrbitDot(d, `hsla(${(partyHue+i*60)%360},90%,60%,0.9)`));
      drawBaseReflection();
      inner.style.background = `radial-gradient(circle at 35% 35%, hsl(${partyHue},70%,40%), hsl(${(partyHue+180)%360},70%,15%))`;
      inner.style.boxShadow = `0 0 60px hsla(${partyHue},90%,60%,0.6), inset 0 0 30px rgba(0,0,0,0.5)`;
      inner.style.transform = `rotate(${Math.sin(t*0.08)*8}deg) scale(${1+Math.sin(t*0.12)*0.05})`;
      if (plaLabel) { plaLabel.style.color = col; plaLabel.style.textShadow = `0 0 20px ${col2}`; }
      // stroboscopic ring bursts
      if (t % 15 === 0) createPartyConfetti();
    }

    function renderBlackhole() {
      const strength = 0.5 + Math.sin(t*0.03)*0.2;
      const grd = ctx.createRadialGradient(CX,CY,0,CX,CY,160);
      grd.addColorStop(0,'rgba(0,0,0,0.95)');
      grd.addColorStop(0.3,`rgba(80,0,0,${strength*0.3})`);
      grd.addColorStop(0.7,`rgba(229,0,0,${strength*0.08})`);
      grd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX,CY,160,0,Math.PI*2);
      ctx.fillStyle = grd; ctx.fill();

      blackholeParticles.forEach(p => {
        p.trail.push({x:p.x,y:p.y});
        if (p.trail.length>10) p.trail.shift();
        const dx = CX-p.x, dy = CY-p.y;
        const dist = Math.hypot(dx,dy)+1;
        const pull = 60/dist;
        p.vx += dx/dist*pull; p.vy += dy/dist*pull;
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;
        if (dist < 20) { p.x=CX+(Math.random()-0.5)*W*1.2; p.y=CY+(Math.random()-0.5)*H*1.2; p.vx=0; p.vy=0; }
        // draw trail
        if (p.trail.length > 1) {
          ctx.beginPath(); ctx.moveTo(p.trail[0].x,p.trail[0].y);
          p.trail.forEach(pt=>ctx.lineTo(pt.x,pt.y));
          ctx.strokeStyle=p.col; ctx.lineWidth=p.size*0.5; ctx.globalAlpha=0.5; ctx.stroke(); ctx.globalAlpha=1;
        }
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle=p.col; ctx.fill();
      });
      // Accretion disk
      rings.forEach((ring,i) => {
        const h = t*2 + i*45;
        drawOrbitRing(ring, t*0.02, `hsla(${h%360},90%,55%,0.5)`);
      });
      inner.style.background = 'radial-gradient(circle at 50% 50%, #000, #000)';
      inner.style.boxShadow = `0 0 80px rgba(229,62,62,0.8), 0 0 0 3px rgba(229,62,62,0.3), inset 0 0 60px #000`;
      inner.style.transform = `scale(${1+Math.sin(t*0.04)*0.03})`;
    }

    function renderVortex() {
      // Dark purple radial bg
      const bgGrd = ctx.createRadialGradient(CX,CY,0,CX,CY,160);
      bgGrd.addColorStop(0,'rgba(10,0,25,0.9)');
      bgGrd.addColorStop(0.6,'rgba(40,0,60,0.4)');
      bgGrd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX,CY,160,0,Math.PI*2);
      ctx.fillStyle = bgGrd; ctx.fill();

      // Spiral arm lines (static decoration)
      for (let arm = 0; arm < 3; arm++) {
        const armOff = (arm / 3) * Math.PI * 2 + t * 0.008;
        ctx.beginPath();
        for (let s = 0; s <= 60; s++) {
          const progress = s / 60;
          const spiralAngle = armOff + progress * Math.PI * 4;
          const spiralR = 155 * (1 - progress * 0.7);
          const sx = CX + Math.cos(spiralAngle) * spiralR;
          const sy = CY + Math.sin(spiralAngle) * spiralR;
          if (s === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        const armHue = 270 + arm * 40;
        ctx.strokeStyle = `hsla(${armHue},80%,60%,0.07)`;
        ctx.lineWidth = 1; ctx.stroke();
      }

      // Vortex particles — spiral inward
      vortexParticles.forEach(p => {
        // Save last position for trail
        const px = CX + Math.cos(p.angle) * p.r;
        const py = CY + Math.sin(p.angle) * p.r;
        p.trail.push({x: px, y: py});
        if (p.trail.length > 10) p.trail.shift();

        // Accelerate rotation as r decreases
        const spinBoost = 1 + (1 - Math.min(p.r, 155) / 155) * 3;
        p.angle += p.speed * spinBoost;
        p.r += p.drift * spinBoost;

        // Respawn when sucked in
        if (p.r < 30) {
          p.r = 100 + Math.random() * 55;
          p.angle = Math.random() * Math.PI * 2;
          p.trail = [];
          p.hue = 260 + Math.random() * 80;
        }

        const x = CX + Math.cos(p.angle) * p.r;
        const y = CY + Math.sin(p.angle) * p.r;
        const lifeAlpha = Math.min(1, (p.r - 30) / 40);  // fade near center

        // Trail
        if (p.trail.length > 2) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          p.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
          ctx.strokeStyle = `hsla(${p.hue},85%,65%,${p.alpha * lifeAlpha * 0.4})`;
          ctx.lineWidth = p.size * 0.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Particle dot
        ctx.beginPath(); ctx.arc(x, y, p.size * lifeAlpha, 0, Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},90%,70%,${p.alpha * lifeAlpha})`;
        ctx.shadowColor = `hsl(${p.hue},90%,60%)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Orbit rings with vortex tint
      rings.forEach((ring,i) => {
        const h = 270 + i * 25 + t * 0.5;
        drawOrbitRing(ring, t * 0.005 * (i+1), `hsla(${h%360},80%,60%,${0.25+i*0.06})`);
      });
      dots.forEach((d,i) => drawOrbitDot(d, `hsla(${(280+i*30)%360},85%,65%,0.9)`));
      drawBaseReflection();

      inner.style.background = `radial-gradient(circle at 40% 35%, #1a0033, #060010)`;
      inner.style.boxShadow = `0 0 60px rgba(140,0,255,0.4), 0 0 120px rgba(80,0,180,0.2), inset 0 0 30px rgba(0,0,0,0.9)`;
      inner.style.transform = `rotate(${t * 0.15}deg)`;
      if (plaLabel) { plaLabel.style.color = '#c080ff'; plaLabel.style.textShadow = '0 0 20px rgba(160,80,255,1), 0 0 40px rgba(100,0,255,0.6)'; }
    }

    function renderMagnet() {
      magnetFieldPhase += 0.018;
      magnetPulse += 0.04;
      const repel = magnetRepel;
      // Color palette: attraction = cyan-blue, repulsion = magenta-orange
      const hA = repel ? [255, 80, 180] : [60, 160, 255];
      const hB = repel ? [255, 160, 50] : [120, 220, 255];

      // ── Deep ambient glow background ──
      const bgGrd = ctx.createRadialGradient(CX, CY, 30, CX, CY, 155);
      bgGrd.addColorStop(0, `rgba(${hA[0]},${hA[1]},${hA[2]},0.07)`);
      bgGrd.addColorStop(0.5, `rgba(${hB[0]},${hB[1]},${hB[2]},0.04)`);
      bgGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX, CY, 155, 0, Math.PI * 2);
      ctx.fillStyle = bgGrd; ctx.fill();

      // ── Dipole field lines (smooth bezier curves) ──
      const numLines = 20;
      for (let i = 0; i < numLines; i++) {
        const theta = (i / numLines) * Math.PI * 2;
        const animTheta = theta + magnetFieldPhase * (repel ? -0.6 : 0.6);
        const pulseFactor = 1 + Math.sin(magnetPulse + i * 0.4) * 0.06;

        // Dipole field line parametric: r = r0 * sin²(θ)
        ctx.beginPath();
        const steps = 36;
        let firstPt = true;
        for (let s = 0; s <= steps; s++) {
          const param = s / steps; // 0→1
          const lineAngle = animTheta + (repel ? 1 : -1) * param * 0.9;
          // Expansion: starts near sphere, fans out, comes back
          const envelope = Math.sin(param * Math.PI);
          const r = 72 + envelope * (60 + 28 * Math.sin(magnetPulse * 0.7 + i * 0.25)) * pulseFactor;
          const px = CX + Math.cos(lineAngle) * r;
          const py = CY + Math.sin(lineAngle) * r;
          if (firstPt) { ctx.moveTo(px, py); firstPt = false; }
          else ctx.lineTo(px, py);
        }
        const lineAlpha = 0.18 + 0.18 * Math.sin(magnetPulse * 0.5 + i * 0.31);
        const t1 = i / numLines;
        const r = Math.round(hA[0] + (hB[0]-hA[0]) * t1);
        const g = Math.round(hA[1] + (hB[1]-hA[1]) * t1);
        const b = Math.round(hA[2] + (hB[2]-hA[2]) * t1);
        ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
        ctx.lineWidth = 1 + 0.5 * Math.sin(magnetPulse + i);
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`;
        ctx.shadowBlur = 6;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // ── Orbiting plasma particles ──
      magnetParticles.forEach((p, idx) => {
        p.angle += p.orbitSpeed * (1 + 0.3 * Math.sin(magnetPulse * 0.3 + idx));
        p.life += 0.012;
        if (p.life > 1) {
          p.life = 0;
          p.orbitR = 82 + Math.random() * 60;
          p.size = 1.5 + Math.random() * 2.5;
        }
        const lifeAlpha = Math.sin(p.life * Math.PI) * p.alpha;
        if (lifeAlpha < 0.05) return;

        // Polar warp: particles drift toward poles (top/bottom) in attract mode
        const latBias = repel ? 0 : Math.sin(p.angle * 2) * 0.25;
        const px = CX + Math.cos(p.angle + magnetFieldPhase * 0.2) * p.orbitR;
        const py = CY + Math.sin(p.angle + magnetFieldPhase * 0.2 + latBias) * p.orbitR * 0.72;

        const t2 = (Math.sin(p.phase + magnetFieldPhase) + 1) * 0.5;
        const pr = Math.round(hA[0] + (hB[0]-hA[0]) * t2);
        const pg = Math.round(hA[1] + (hB[1]-hA[1]) * t2);
        const pb = Math.round(hA[2] + (hB[2]-hA[2]) * t2);

        ctx.beginPath();
        ctx.arc(px, py, p.size * (0.8 + 0.2 * Math.sin(magnetPulse + idx)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pr},${pg},${pb},${lifeAlpha})`;
        ctx.shadowColor = `rgba(${pr},${pg},${pb},0.9)`;
        ctx.shadowBlur = p.size * 5;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // ── Pole glow spots (N/S poles) ──
      const poleAngle = magnetFieldPhase * 0.4;
      [0, Math.PI].forEach((poleOff, pi) => {
        const angle = poleAngle + poleOff;
        const px = CX + Math.cos(angle) * 68;
        const py = CY + Math.sin(angle) * 45;
        const poleGrd = ctx.createRadialGradient(px, py, 0, px, py, 22);
        const col = pi === 0 ? hA : hB;
        const poleAlpha = 0.55 + 0.2 * Math.sin(magnetPulse + pi * Math.PI);
        poleGrd.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},${poleAlpha})`);
        poleGrd.addColorStop(0.4, `rgba(${col[0]},${col[1]},${col[2]},0.2)`);
        poleGrd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2);
        ctx.fillStyle = poleGrd; ctx.fill();
        // label N/S
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = `rgba(255,255,255,0.55)`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(pi === 0 ? 'N' : 'S', px, py);
      });

      // ── Sphere glow ──
      const sphereGrd = ctx.createRadialGradient(CX, CY, 20, CX, CY, 78);
      sphereGrd.addColorStop(0, `rgba(${hB[0]},${hB[1]},${hB[2]},0.12)`);
      sphereGrd.addColorStop(1, `rgba(${hA[0]},${hA[1]},${hA[2]},0)`);
      ctx.beginPath(); ctx.arc(CX, CY, 78, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrd; ctx.fill();

      drawHalo(repel ? '255,80,180' : '60,160,255', 1.5);
      rings.forEach((ring, i) => drawOrbitRing(ring, magnetFieldPhase * 0.3, `rgba(${hA[0]},${hA[1]},${hA[2]},${0.2 + i*0.06})`));
      dots.forEach(d => drawOrbitDot(d, `rgba(${hB[0]},${hB[1]},${hB[2]},0.85)`));
      drawBaseReflection();

      const pulse = 1 + Math.sin(magnetPulse * 0.8) * 0.025;
      const colStr = `rgba(${hA[0]},${hA[1]},${hA[2]},0.9)`;
      inner.style.boxShadow = `0 0 50px ${colStr}, 0 0 90px rgba(${hB[0]},${hB[1]},${hB[2]},0.3), inset 0 0 25px rgba(0,0,0,0.6)`;
      inner.style.transform = `scale(${pulse})`;
      if (plaLabel) plaLabel.style.textShadow = `0 0 16px rgba(${hA[0]},${hA[1]},${hA[2]},1), 0 0 32px rgba(${hB[0]},${hB[1]},${hB[2]},0.6)`;
    }

    function renderRainbow() {
      rainbowPhase += 0.02;
      // Starburst rings
      for (let i = 0; i < 8; i++) {
        const h = ((i/8)*360 + rainbowPhase*60) % 360;
        const pulse = 0.5 + Math.sin(rainbowPhase*3 + i)*0.5;
        rings.forEach((ring,ri) => {
          const rmod = { ...ring, r: ring.r * (0.9 + i*0.03) };
          drawOrbitRing(rmod, i*0.4+rainbowPhase, `hsla(${h},90%,60%,${0.1*pulse})`);
        });
      }
      dots.forEach((d,i) => drawOrbitDot(d, `hsla(${(rainbowPhase*100+i*80)%360},90%,65%,0.9)`));
      // Rainbow halo
      for (let i = 7; i >= 0; i--) {
        const h = (i/8)*360 + rainbowPhase*60;
        const grd = ctx.createRadialGradient(CX,CY,60+i*10,CX,CY,80+i*10);
        grd.addColorStop(0,`hsla(${h},90%,60%,0)`);
        grd.addColorStop(0.5,`hsla(${h},90%,60%,0.06)`);
        grd.addColorStop(1,`hsla(${h},90%,60%,0)`);
        ctx.beginPath(); ctx.arc(CX,CY,80+i*10,0,Math.PI*2);
        ctx.fillStyle=grd; ctx.fill();
      }
      const h0 = (rainbowPhase*60)%360;
      inner.style.background = `radial-gradient(circle at 35% 35%, hsl(${h0},70%,50%), hsl(${(h0+120)%360},70%,20%))`;
      inner.style.boxShadow = `0 0 60px hsla(${h0},90%,60%,0.6), 0 0 120px hsla(${(h0+120)%360},90%,60%,0.3)`;
      if (plaLabel) { plaLabel.style.color = `hsl(${h0},90%,70%)`; plaLabel.style.textShadow = `0 0 30px hsl(${h0},90%,60%)`; }
    }

    function renderSonar() {
      // Background — deep dark teal
      const bgGrd = ctx.createRadialGradient(CX,CY,0,CX,CY,160);
      bgGrd.addColorStop(0,'rgba(0,18,22,0.85)');
      bgGrd.addColorStop(1,'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX,CY,160,0,Math.PI*2);
      ctx.fillStyle = bgGrd; ctx.fill();

      // Grid lines (polar — concentric faint circles)
      for (let gr = 40; gr <= 150; gr += 35) {
        ctx.beginPath(); ctx.arc(CX,CY,gr,0,Math.PI*2);
        ctx.strokeStyle = 'rgba(0,220,180,0.07)'; ctx.lineWidth = 0.8; ctx.stroke();
      }
      // Crosshair
      ['rgba(0,220,180,0.08)','rgba(0,220,180,0.08)'].forEach((_,i) => {
        ctx.beginPath();
        if (i===0) { ctx.moveTo(CX,CY-155); ctx.lineTo(CX,CY+155); }
        else       { ctx.moveTo(CX-155,CY); ctx.lineTo(CX+155,CY); }
        ctx.strokeStyle='rgba(0,220,180,0.07)'; ctx.lineWidth=0.8; ctx.stroke();
      });

      // Emit new ping every ~80 frames
      if (modeT % 80 === 0) {
        sonarWaves.push({ r: 72, maxR: 155, alpha: 0.9, speed: 1.8 });
        if (navigator.vibrate) navigator.vibrate(8);
      }

      // Update & draw waves
      sonarWaves = sonarWaves.filter(w => w.alpha > 0.01);
      sonarWaves.forEach(w => {
        w.r += w.speed;
        w.alpha = Math.max(0, w.alpha - 0.012);
        // Main ring
        ctx.beginPath(); ctx.arc(CX,CY,w.r,0,Math.PI*2);
        ctx.strokeStyle = `rgba(0,220,180,${w.alpha * 0.9})`;
        ctx.lineWidth = 1.5; ctx.shadowColor = 'rgba(0,220,180,0.6)'; ctx.shadowBlur = 6;
        ctx.stroke(); ctx.shadowBlur = 0;
        // Inner echo glow
        if (w.r > 90) {
          ctx.beginPath(); ctx.arc(CX,CY,w.r-3,0,Math.PI*2);
          ctx.strokeStyle = `rgba(0,255,200,${w.alpha * 0.3})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      });

      // Echo dots — appear when a wave passes through them
      if (modeT % 80 === 40) {
        // spawn 3–5 random echo dots around the sphere edge
        for (let i = 0; i < 4; i++) {
          const ang = Math.random() * Math.PI * 2;
          const dist = 90 + Math.random() * 55;
          sonarEchos.push({
            x: CX + Math.cos(ang) * dist,
            y: CY + Math.sin(ang) * dist,
            alpha: 0.9,
            size: 2 + Math.random() * 3,
          });
        }
      }
      sonarEchos = sonarEchos.filter(e => e.alpha > 0.01);
      sonarEchos.forEach(e => {
        e.alpha -= 0.015;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(0,255,200,${e.alpha})`;
        ctx.shadowColor = 'rgba(0,255,180,0.8)'; ctx.shadowBlur = 10;
        ctx.fill(); ctx.shadowBlur = 0;
      });

      // Orbit rings tinted teal
      rings.forEach(ring => drawOrbitRing(ring, 0, `rgba(0,180,140,${ring.lw * 0.5})`));
      dots.forEach(d => drawOrbitDot(d, 'rgba(0,230,180,0.85)'));
      drawBaseReflection();

      inner.style.background = 'radial-gradient(circle at 38% 32%, #0a2e2a, #001a16)';
      inner.style.boxShadow = `0 0 50px rgba(0,200,160,0.4), inset 0 0 25px rgba(0,0,0,0.8)`;
      if (plaLabel) { plaLabel.style.color = '#00e6b8'; plaLabel.style.textShadow = '0 0 18px rgba(0,230,180,0.9)'; }
    }

    function renderForge() {
      // Heat glow from center
      const heatGrd = ctx.createRadialGradient(CX,CY,30,CX,CY,160);
      const heatPulse = 0.5 + Math.sin(t * 0.04) * 0.2;
      heatGrd.addColorStop(0, `rgba(255,140,0,${heatPulse * 0.35})`);
      heatGrd.addColorStop(0.4, `rgba(200,40,0,${heatPulse * 0.15})`);
      heatGrd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX,CY,160,0,Math.PI*2);
      ctx.fillStyle = heatGrd; ctx.fill();

      // Emit sparks each frame
      const emitCount = Math.random() > 0.5 ? 2 : 1;
      for (let i = 0; i < emitCount; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 3.5;
        const hue = 15 + Math.random() * 35; // orange-red band
        forgeSparks.push({
          x: CX + Math.cos(ang) * 72,
          y: CY + Math.sin(ang) * 72,
          vx: Math.cos(ang) * spd + (Math.random()-0.5) * 1.5,
          vy: Math.sin(ang) * spd + (Math.random()-0.5) * 1.5 - 0.5,
          life: 1,
          decay: 0.02 + Math.random() * 0.025,
          size: 1 + Math.random() * 2.5,
          hue,
          trail: [],
        });
      }

      // Update & draw sparks
      forgeSparks = forgeSparks.filter(s => s.life > 0);
      forgeSparks.forEach(s => {
        s.trail.push({x: s.x, y: s.y});
        if (s.trail.length > 7) s.trail.shift();
        s.x += s.vx; s.y += s.vy;
        s.vy += 0.08; // gravity
        s.vx *= 0.98;
        s.life -= s.decay;

        // Trail
        if (s.trail.length > 1) {
          ctx.beginPath(); ctx.moveTo(s.trail[0].x, s.trail[0].y);
          s.trail.forEach(pt => ctx.lineTo(pt.x, pt.y));
          ctx.strokeStyle = `hsla(${s.hue},100%,65%,${s.life * 0.5})`;
          ctx.lineWidth = s.size * 0.4; ctx.lineCap = 'round'; ctx.stroke();
        }
        // Spark head
        ctx.beginPath(); ctx.arc(s.x, s.y, Math.max(0.1, s.size * s.life), 0, Math.PI*2);
        ctx.fillStyle = `hsla(${s.hue + 20},100%,75%,${s.life})`;
        ctx.shadowColor = `hsl(${s.hue},100%,55%)`; ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;  // reset immediately

        // Occasional bright pop
        if (s.life > 0.85 && Math.random() > 0.7) {
          ctx.beginPath(); ctx.arc(s.x, s.y, s.size * 2.5, 0, Math.PI*2);
          ctx.fillStyle = `hsla(40,100%,90%,${s.life * 0.6})`;
          ctx.fill();
        }
      });

      // Orbit rings with heat tint
      rings.forEach((ring,i) => drawOrbitRing(ring, 0, `rgba(255,${80+i*30},0,${0.3+i*0.08})`));
      dots.forEach(d => drawOrbitDot(d, `hsl(${20+Math.sin(t*0.05)*20},100%,60%)`));
      drawBaseReflection();

      const bright = 1.1 + Math.sin(t * 0.06) * 0.15;
      inner.style.background = `radial-gradient(circle at 35% 30%, #7a2800, #2a0800)`;
      inner.style.boxShadow = `0 0 70px rgba(255,80,0,${0.5+Math.sin(t*0.04)*0.2}), inset 0 0 30px rgba(0,0,0,0.8)`;
      inner.style.filter = `brightness(${bright})`;
      if (plaLabel) { plaLabel.style.color = '#ff9020'; plaLabel.style.textShadow = '0 0 20px rgba(255,120,0,1), 0 0 40px rgba(255,60,0,0.6)'; }
    }

    function renderExplode() {
      // Phase 1 (0-80): fragments fly out, sphere hidden
      // Phase 2 (80-160): sphere reassembles, fragments fade
      // Phase 3 (160+): repeat
      const phase = modeT % 200;

      if (phase === 0 || (phase === 0 && modeT > 0)) {
        // Re-init fragments at each cycle start
        explodeFrags = Array.from({length:40}, () => {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 5;
          return {
            x: CX, y: CY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random()-0.5) * 0.25,
            size: 5 + Math.random() * 16,
            col: `hsl(${Math.random()*30+340},90%,55%)`,
            alpha: 1,
          };
        });
        inner.style.opacity = '0';
        if (navigator.vibrate) navigator.vibrate([10,20,10]);
      }

      // Draw fragments
      explodeFrags.forEach(f => {
        if (phase < 160) {
          f.x += f.vx; f.y += f.vy;
          f.vy += 0.12;
          f.vx *= 0.985; f.vy *= 0.985;
          f.rot += f.rotSpeed;
          f.alpha = Math.max(0, f.alpha - 0.006);
        }
        if (f.alpha <= 0.01) return;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.globalAlpha = Math.max(0, f.alpha);
        ctx.beginPath();
        ctx.moveTo(-f.size/2, -f.size/3);
        ctx.lineTo(f.size/2, -f.size/4);
        ctx.lineTo(f.size/3, f.size/2);
        ctx.lineTo(-f.size/3, f.size/3);
        ctx.closePath();
        ctx.fillStyle = f.col;
        ctx.shadowColor = f.col;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;  // ← reset immediately inside save/restore
        ctx.globalAlpha = 1;
        ctx.restore();
      });

      // Phase 2: sphere fades back in
      if (phase >= 80) {
        const progress = Math.min(1, (phase - 80) / 80);
        inner.style.opacity = `${progress}`;
        drawHalo('229,62,62', progress);
        rings.forEach(ring => drawOrbitRing(ring, 0));
        dots.forEach(d => drawOrbitDot(d));
        drawBaseReflection();
      }
    }

    function renderGlitch() {
      // Draw base first
      drawHalo('229,62,62');
      rings.forEach((ring,i) => {
        const glitch = Math.random() > 0.8;
        drawOrbitRing(ring, glitch ? Math.random()*2 : 0, glitch ? `rgba(0,255,255,0.5)` : ring.col);
      });
      dots.forEach(d => drawOrbitDot(d));

      // Color channel split — offset copy of current canvas content
      const glitchX = (Math.random()-0.5)*16;
      const glitchY = (Math.random()-0.5)*4;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.18;
      ctx.drawImage(canvas, glitchX, glitchY, W, H, 0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.restore();

      // Scan lines
      for (let y = 0; y < H; y += 4) {
        if (Math.random() > 0.97) {
          ctx.fillStyle = `rgba(229,62,62,0.12)`;
          ctx.fillRect(0, y, W, 2);
        }
      }
      // Random noise blocks
      if (Math.random() > 0.7) {
        const bx = Math.random()*W, by = Math.random()*H;
        const bw = 20+Math.random()*80, bh = 3+Math.random()*10;
        ctx.fillStyle = `rgba(${Math.random()>0.5?'0,255,255':'255,0,255'},0.25)`;
        ctx.fillRect(bx-bw/2, by, bw, bh);
      }
    }

    // ---- MAIN ANIMATE LOOP ----
    function animate() {
      ctx.clearRect(0, 0, W, H);
      t++; modeT++;

      tiltX += (targetTiltX - tiltX) * 0.08;
      tiltY += (targetTiltY - tiltY) * 0.08;
      if (!isDragging) {
        autoRotate += velX * 0.012;
        velX *= 0.94; velY *= 0.94;
        targetTiltX *= 0.97; targetTiltY *= 0.97;
      }

      switch (currentMode) {
        case 'ELECTRIC':  renderElectric();  break;
        case 'SONAR':     renderSonar();     break;
        case 'MATRIX':    renderMatrix();    break;
        case 'PARTY':     renderParty();     break;
        case 'BLACKHOLE': renderBlackhole(); break;
        case 'VORTEX':    renderVortex();    break;
        case 'MAGNET':    renderMagnet();    break;
        case 'RAINBOW':   renderRainbow();   break;
        case 'FORGE':     renderForge();     break;
        case 'EXPLODE':   renderExplode();   break;
        case 'GLITCH':    renderGlitch();    break;
        default: // NORMAL
          drawHalo();
          rings.forEach(ring => drawOrbitRing(ring, 0));
          dots.forEach(dot => drawOrbitDot(dot));
          drawBaseReflection();
          inner.style.transform = '';
          inner.style.filter = '';
          inner.style.background = '';
          inner.style.boxShadow = '';
          if (plaLabel) { plaLabel.style.color = ''; plaLabel.style.textShadow = ''; }
          break;
      }
      requestAnimationFrame(animate);
    }
    setMode('BLACKHOLE');
    animate();

    // ---- DRAG ----
    function onStart(mx, my) {
      isDragging = true; lastMX = mx; lastMY = my; velX = 0; velY = 0;
      wrap.style.cursor = 'grabbing';
    }
    function onMove(mx, my) {
      if (!isDragging) return;
      const dx = mx-lastMX, dy = my-lastMY;
      velX = dx; velY = dy;
      autoRotate += dx*0.012;
      targetTiltX = Math.max(-1.2,Math.min(1.2, targetTiltX+dy*0.04));
      targetTiltY = Math.max(-1.2,Math.min(1.2, targetTiltY+dx*0.04));
      lastMX = mx; lastMY = my;
      // Magnet drag: shake + toggle repel on significant drag
      if (currentMode === 'MAGNET') {
        inner.style.transform = `translate(${dx*0.3}px,${dy*0.3}px)`;
        setTimeout(()=>inner.style.transform='',100);
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          magnetRepel = !magnetRepel;
          if (hint) hint.textContent = magnetRepel ? '🧲 REPULSIONE ATTIVA' : '🧲 ATTRAZIONE ATTIVA';
        }
      }
    }
    function onEnd() { isDragging = false; wrap.style.cursor = 'grab'; }

    wrap.addEventListener('mousedown', e => onStart(e.clientX, e.clientY));
    window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onEnd);

    // ---- CLICK = CHANGE MODE ----
    function handleClick(isTouch) {

      clickCount++;
      // Cycle through modes in order, skip NORMAL after first time
      const idx = MODES.indexOf(currentMode);
      const nextIdx = (idx + 1) % MODES.length;
      setMode(MODES[nextIdx]);

      if (isTouch && navigator.vibrate) navigator.vibrate([10,20,10]);

      // Show mode badge
      const badge = document.createElement('div');
      badge.className = 'pla-mode-overlay pla-mode-badge';
      badge.textContent = MODES[nextIdx];
      wrap.appendChild(badge);
      badge.addEventListener('animationend', ()=>badge.remove());
    }

    wrap.addEventListener('click', e => {
      if (e.pointerType === 'touch') return;
      handleClick(false);
      fireBurst(e.clientX, e.clientY, false);
    });

    // ---- BURST ----
    function fireBurst(clientX, clientY, isMobile) {
      wrap.classList.remove('burst'); void wrap.offsetWidth; wrap.classList.add('burst');
      wrap.addEventListener('animationend', ()=>wrap.classList.remove('burst'),{once:true});
      const count = isMobile ? 18 : 12;
      const col = currentMode === 'RAINBOW' ? `hsl(${Math.random()*360},90%,60%)` :
                  currentMode === 'ELECTRIC' ? '#4af' :
                  currentMode === 'MATRIX' ? '#0f0' :
                  '#e53e3e';
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        dot.className = 'pla-burst-dot';
        dot.style.background = col;
        const angle = (i/count)*Math.PI*2+Math.random()*0.3;
        const dist = (isMobile?90:80)+Math.random()*70;
        dot.style.setProperty('--tx', Math.cos(angle)*dist+'px');
        dot.style.setProperty('--ty', Math.sin(angle)*dist+'px');
        dot.style.setProperty('--dur', (0.45+Math.random()*0.4)+'s');
        dot.style.width = dot.style.height = ((isMobile?4:3)+Math.random()*5)+'px';
        wrap.appendChild(dot);
        dot.addEventListener('animationend',()=>dot.remove(),{once:true});
      }
      velX += (Math.random()-0.5)*(isMobile?14:8);
      velY += (Math.random()-0.5)*(isMobile?14:8);
    }

    // ---- TOUCH ----
    let lastTouchX=0, lastTouchY=0, pinchStartDist=0, isTap=false;
    let touchStartX=0, touchStartY=0, touchScrollLocked=false;
    wrap.addEventListener('touchstart', e => {
      if (e.touches.length===1) {
        const t0=e.touches[0];
        touchStartX=t0.clientX; touchStartY=t0.clientY;
        lastTouchX=t0.clientX; lastTouchY=t0.clientY;
        isTap=true; touchScrollLocked=false;
        onStart(t0.clientX,t0.clientY);
      } else if (e.touches.length===2) {
        const dx=e.touches[0].clientX-e.touches[1].clientX;
        const dy=e.touches[0].clientY-e.touches[1].clientY;
        pinchStartDist=Math.hypot(dx,dy); isDragging=false;
      }
    },{passive:true});

    window.addEventListener('touchmove', e => {
      if (e.touches.length===1) {
        const t0=e.touches[0];
        const dx=t0.clientX-touchStartX, dy=t0.clientY-touchStartY;
        // Determine scroll intent on first significant move
        if (!touchScrollLocked && (Math.abs(dx)>6||Math.abs(dy)>6)) {
          touchScrollLocked = Math.abs(dy) > Math.abs(dx); // vertical = scroll
        }
        if (Math.abs(dx)>3||Math.abs(dy)>3) isTap=false;
        if (!touchScrollLocked) {
          // Horizontal drag on sphere — block scroll
          if (e.cancelable) e.preventDefault();
          onMove(t0.clientX,t0.clientY);
        }
        lastTouchX=t0.clientX; lastTouchY=t0.clientY;
      } else if (e.touches.length===2) {
        const dx=e.touches[0].clientX-e.touches[1].clientX;
        const dy=e.touches[0].clientY-e.touches[1].clientY;
        const dist=Math.hypot(dx,dy);
        autoRotate += (dist-pinchStartDist)*0.004;
        pinchStartDist=dist;
      }
    },{passive:false});

    window.addEventListener('touchend', e => {
      if (isTap && e.changedTouches.length===1) {
        handleClick(true);
        fireBurst(e.changedTouches[0].clientX,e.changedTouches[0].clientY,true);
      }
      isTap=false; onEnd();
    });

    // ---- HOVER (mouse) ----
    wrap.addEventListener('mousemove', e => {
      if (isDragging) return;
      const rect=wrap.getBoundingClientRect();
      const nx=(e.clientX-rect.left-rect.width/2)/(rect.width/2);
      const ny=(e.clientY-rect.top-rect.height/2)/(rect.height/2);
      targetTiltX=ny*0.8; targetTiltY=nx*0.8;
      if (currentMode==='FACE') { faceTargetX=nx; faceTargetY=ny; }
    });
    wrap.addEventListener('mouseleave', ()=>{
      if (!isDragging) { targetTiltX=0; targetTiltY=0; }
    });

    // ---- GYROSCOPE ----
    let gyroEnabled=false;
    function enableGyro() {
      window.addEventListener('deviceorientation', e => {
        if (isDragging) return;
        const beta=(e.beta||0)-45, gamma=e.gamma||0;
        targetTiltX=Math.max(-1,Math.min(1,beta*0.018));
        targetTiltY=Math.max(-1,Math.min(1,gamma*0.022));
      },{passive:true});
    }
    if (typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function') {
      wrap.addEventListener('click',()=>{
        if (!gyroEnabled) {
          DeviceOrientationEvent.requestPermission().then(s=>{
            if(s==='granted'){enableGyro();gyroEnabled=true;}
          }).catch(()=>{});
        }
      },{once:true});
    } else if (window.DeviceOrientationEvent) { enableGyro(); gyroEnabled=true; }

    // Init hint
    if (hint) hint.textContent = 'CLICK PER CAMBIARE MODALITÀ';
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
