/* ============================================================
   RAHUL PAGAR PORTFOLIO · INTERACTIONS + 3D
   ============================================================ */

(() => {
  'use strict';

  /* ---------- 1. BOOT LOADER ---------- */
  const bootLoader = document.getElementById('bootLoader');
  const bootBar = document.getElementById('bootBarFill');
  const bootStatus = document.getElementById('bootStatus');
  const bootMessages = [
    'initializing data layer...',
    'loading sql connections...',
    'compiling python kernel...',
    'rendering 3d scene...',
    'establishing uplink...',
    'ready.'
  ];
  let bootProgress = 0;
  let msgIdx = 0;
  const bootInterval = setInterval(() => {
    bootProgress += Math.random() * 18 + 6;
    if (bootProgress >= 100) {
      bootProgress = 100;
      bootBar.style.width = '100%';
      bootStatus.textContent = bootMessages[bootMessages.length - 1];
      clearInterval(bootInterval);
      setTimeout(() => bootLoader.classList.add('done'), 400);
      return;
    }
    bootBar.style.width = bootProgress + '%';
    if (bootProgress > (msgIdx + 1) * (100 / bootMessages.length) && msgIdx < bootMessages.length - 1) {
      msgIdx++;
      bootStatus.textContent = bootMessages[msgIdx];
    }
  }, 140);

  /* ---------- 2. CUSTOM CURSOR ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function cursorTick() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    if (cursorDot) {
      cursorDot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    }
    if (cursorRing) {
      cursorRing.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(cursorTick);
  }
  cursorTick();

  document.querySelectorAll('a, button, .stack-card, .proj-card, .tl-card, .ch-card, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });

  /* ---------- 3. NAV SCROLL STATE ---------- */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  /* ---------- 4. SUBTLE DATA-GRID CANVAS BG (lightweight, no Three.js) ---------- */
  const canvas = document.getElementById('particleBg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    // Sparse calm dots — like quiet data points, not a particle storm
    const dotCount = Math.min(40, Math.floor(w / 50));
    const dots = [];
    for (let i = 0; i < dotCount; i++) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.5,
        vy: (Math.random() - 0.5) * 0.15,
        vx: (Math.random() - 0.5) * 0.15,
        op: Math.random() * 0.4 + 0.1
      });
    }

    function drawBg() {
      ctx.clearRect(0, 0, w, h);
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 227, 197, ${d.op})`;
        ctx.fill();
      });
      requestAnimationFrame(drawBg);
    }
    drawBg();

    window.addEventListener('resize', () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.scale(dpr, dpr);
    });
  }

  /* ---------- 5. STAT COUNTERS ---------- */
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(step);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

  /* ---------- 6. PROJECT FILTERS ---------- */
  const filterBtns = document.querySelectorAll('.proj-filter');
  const projCards = document.querySelectorAll('.proj-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projCards.forEach(card => {
        if (f === 'all' || card.dataset.cat.includes(f)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ---------- 7. CARD TILT ---------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -6;
      const ry = ((x - cx) / cx) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 8. SCROLL REVEAL ---------- */
  const reveals = document.querySelectorAll('.section, .stack-card, .proj-card, .tl-item, .ch-card');
  reveals.forEach(el => el.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  /* ---------- 9. LOCAL TIME (DUBLIN) ---------- */
  function updateTime() {
    const tEl = document.getElementById('localTime');
    if (!tEl) return;
    const now = new Date().toLocaleTimeString('en-GB', {
      timeZone: 'Europe/Dublin',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    tEl.textContent = now;
  }
  updateTime();
  setInterval(updateTime, 1000);
  document.getElementById('footerYear').textContent = new Date().getFullYear();

  /* ---------- 10. CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = encodeURIComponent(data.get('name'));
      const email = encodeURIComponent(data.get('email'));
      const message = encodeURIComponent(data.get('message'));
      const subject = `Portfolio enquiry from ${data.get('name')}`;
      const body = `Name: ${data.get('name')}%0D%0AEmail: ${data.get('email')}%0D%0A%0D%0A${data.get('message')}`;
      const status = document.getElementById('formStatus');
      status.textContent = '> opening mail client...';
      window.location.href = `mailto:rahulpagar423@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      setTimeout(() => { status.textContent = '> message ready. send when you\'re happy with it.'; }, 1500);
    });
  }

  /* ---------- 11. MOBILE NAV ---------- */
  const navMobile = document.getElementById('navMobile');
  const navLinks = document.querySelector('.nav-links');
  if (navMobile) {
    navMobile.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

})();
