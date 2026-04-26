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

  /* ---------- 4. THREE.JS PARTICLE BG ---------- */
  if (window.THREE) {
    const canvas = document.getElementById('particleBg');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Particle field
    const particleCount = 1200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorA = new THREE.Color('#38e3c5');
    const colorB = new THREE.Color('#7c5cff');
    const colorC = new THREE.Color('#ffb547');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120;

      const r = Math.random();
      const c = r < 0.5 ? colorA : (r < 0.85 ? colorB : colorC);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 1.4 + 0.3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connecting lines (data network)
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(200 * 2 * 3);
    const lineColors = new Float32Array(200 * 2 * 3);
    for (let i = 0; i < 200; i++) {
      const ax = (Math.random() - 0.5) * 80;
      const ay = (Math.random() - 0.5) * 60;
      const az = (Math.random() - 0.5) * 60;
      const bx = ax + (Math.random() - 0.5) * 20;
      const by = ay + (Math.random() - 0.5) * 20;
      const bz = az + (Math.random() - 0.5) * 20;
      linePositions[i * 6] = ax;
      linePositions[i * 6 + 1] = ay;
      linePositions[i * 6 + 2] = az;
      linePositions[i * 6 + 3] = bx;
      linePositions[i * 6 + 4] = by;
      linePositions[i * 6 + 5] = bz;
      const c = i % 2 === 0 ? colorA : colorB;
      for (let j = 0; j < 2; j++) {
        lineColors[i * 6 + j * 3] = c.r;
        lineColors[i * 6 + j * 3 + 1] = c.g;
        lineColors[i * 6 + j * 3 + 2] = c.b;
      }
    }
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
      requestAnimationFrame(animate);
      const t = Date.now() * 0.0001;
      particles.rotation.y = t * 0.3 + mouseX * 0.5;
      particles.rotation.x = mouseY * 0.3;
      lines.rotation.y = -t * 0.2 + mouseX * 0.3;
      lines.rotation.x = -mouseY * 0.2;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* ---------- HERO 3D DATA SPHERE ---------- */
    const hero3dContainer = document.getElementById('hero3d');
    if (hero3dContainer && window.innerWidth > 1100) {
      const hRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      hRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const cw = hero3dContainer.clientWidth;
      const ch = hero3dContainer.clientHeight;
      hRenderer.setSize(cw, ch);
      hero3dContainer.appendChild(hRenderer.domElement);

      const hScene = new THREE.Scene();
      const hCam = new THREE.PerspectiveCamera(45, cw / ch, 0.1, 100);
      hCam.position.z = 8;

      // Wireframe icosahedron data sphere
      const geo = new THREE.IcosahedronGeometry(2.4, 1);
      const wireGeo = new THREE.WireframeGeometry(geo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0x38e3c5,
        transparent: true,
        opacity: 0.45
      });
      const wireSphere = new THREE.LineSegments(wireGeo, wireMat);
      hScene.add(wireSphere);

      // Inner solid sphere with glow
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x7c5cff,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide
      });
      const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32), glowMat);
      hScene.add(glowSphere);

      // Vertex points on sphere
      const positions = geo.attributes.position;
      const pointsGeo = new THREE.BufferGeometry();
      const pointsArr = new Float32Array(positions.array);
      pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointsArr, 3));
      const pointsMat = new THREE.PointsMaterial({
        color: 0x38e3c5,
        size: 0.08,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const spherePoints = new THREE.Points(pointsGeo, pointsMat);
      hScene.add(spherePoints);

      // Orbiting rings
      const ringGroup = new THREE.Group();
      for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(3 + i * 0.4, 0.005, 8, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: i === 0 ? 0x38e3c5 : (i === 1 ? 0x7c5cff : 0xffb547),
          transparent: true,
          opacity: 0.3
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.userData.speed = 0.2 + Math.random() * 0.3;
        ring.userData.axis = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
        ringGroup.add(ring);
      }
      hScene.add(ringGroup);

      // Orbiting data nodes (small spheres on rings)
      const orbitNodes = [];
      for (let i = 0; i < 8; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const nodeMat = new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x38e3c5 : 0xffb547
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.userData.angle = Math.random() * Math.PI * 2;
        node.userData.radius = 3 + Math.random() * 0.6;
        node.userData.speed = 0.3 + Math.random() * 0.4;
        node.userData.tilt = Math.random() * Math.PI;
        hScene.add(node);
        orbitNodes.push(node);
      }

      function animateHero() {
        requestAnimationFrame(animateHero);
        const t = Date.now() * 0.0005;
        wireSphere.rotation.y = t * 0.4;
        wireSphere.rotation.x = t * 0.2;
        spherePoints.rotation.y = t * 0.4;
        spherePoints.rotation.x = t * 0.2;
        glowSphere.rotation.y = -t * 0.3;

        ringGroup.children.forEach(ring => {
          ring.rotateOnAxis(ring.userData.axis, ring.userData.speed * 0.01);
        });

        orbitNodes.forEach(node => {
          node.userData.angle += node.userData.speed * 0.01;
          const a = node.userData.angle;
          const r = node.userData.radius;
          const tilt = node.userData.tilt;
          node.position.x = Math.cos(a) * r;
          node.position.y = Math.sin(a) * r * Math.cos(tilt);
          node.position.z = Math.sin(a) * r * Math.sin(tilt);
        });

        // Mouse parallax on hero
        wireSphere.rotation.y += mouseX * 0.005;
        wireSphere.rotation.x += mouseY * 0.005;

        hRenderer.render(hScene, hCam);
      }
      animateHero();

      window.addEventListener('resize', () => {
        const w = hero3dContainer.clientWidth;
        const h = hero3dContainer.clientHeight;
        hCam.aspect = w / h;
        hCam.updateProjectionMatrix();
        hRenderer.setSize(w, h);
      });
    }
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
