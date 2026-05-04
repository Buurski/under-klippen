/* Under Klippen — shared site behavior */

(function () {
  'use strict';

  // ---- Nav appearance + load animation -----------------------------
  const nav = document.querySelector('.nav');
  if (nav) {
    requestAnimationFrame(() => {
      setTimeout(() => nav.classList.add('is-loaded'), 150);
    });

    // Dark-mode based on what's behind nav
    const updateNavTone = () => {
      const probeY = nav.getBoundingClientRect().bottom - 6;
      const sections = document.querySelectorAll('[data-tone]');
      let tone = 'light';
      sections.forEach(s => {
        const r = s.getBoundingClientRect();
        if (r.top <= probeY && r.bottom >= probeY) tone = s.dataset.tone;
      });
      nav.classList.toggle('is-dark', tone === 'dark');
    };
    updateNavTone();
    window.addEventListener('scroll', updateNavTone, { passive: true });
    window.addEventListener('resize', updateNavTone);
  }

  // ---- Scroll reveal -----------------------------------------------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- Hero parallax -----------------------------------------------
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    let ticking = false;
    const updateParallax = () => {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const offset = -r.top * speed;
        const inner = el.querySelector('.parallax-inner') || el;
        inner.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();
  }

  // ---- Mobile burger drawer ----------------------------------------
  const burger = document.querySelector('.nav-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      let drawer = document.querySelector('.nav-drawer');
      if (!drawer) {
        drawer = document.createElement('div');
        drawer.className = 'nav-drawer';
        drawer.innerHTML = `
          <button class="nav-drawer-close" aria-label="Luk">×</button>
          <nav>
            <a href="index.html">Forside</a>
            <a href="menu.html">Menu &amp; Vinkort</a>
            <a href="om-os.html">Om os</a>
            <a href="selskaber.html">Selskaber</a>
            <a href="index.html#events">Events</a>
            <a href="index.html#gavekort">Gavekort</a>
            <a class="cta" href="#">Book bord</a>
          </nav>
        `;
        document.body.appendChild(drawer);
        drawer.querySelector('.nav-drawer-close').addEventListener('click', () => {
          drawer.classList.remove('is-open');
        });
      }
      drawer.classList.add('is-open');
    });
  }
})();
