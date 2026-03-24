(function () {
  'use strict';

  // ===== Mobile Drawer =====
  const hamburger      = document.getElementById('hamburger');
  const mobDrawer      = document.getElementById('mob-drawer');
  const mobOverlay     = document.getElementById('mob-overlay');
  const mobDrawerClose = document.getElementById('mob-drawer-close');

  function openDrawer() {
    mobDrawer.classList.add('open');
    mobOverlay.classList.add('active');
    mobDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    mobDrawer.classList.remove('open');
    mobOverlay.classList.remove('active');
    mobDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger)      hamburger.addEventListener('click', openDrawer);
  if (mobDrawerClose) mobDrawerClose.addEventListener('click', closeDrawer);
  if (mobOverlay)     mobOverlay.addEventListener('click', closeDrawer);

  // Close on drawer link click
  if (mobDrawer) {
    mobDrawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
  }

  // ===== Mobile Accordion =====
  document.querySelectorAll('.mob-acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.dataset.acc;
      const panel   = document.getElementById(panelId);
      if (!panel) return;
      const isOpen = panel.classList.contains('open');
      // Close all
      document.querySelectorAll('.mob-acc-panel').forEach(p => p.classList.remove('open'));
      document.querySelectorAll('.mob-acc-btn').forEach(b => b.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) {
        panel.classList.add('open');
        btn.classList.add('open');
      }
    });
  });

  // ===== Header Scroll =====
  const header = document.getElementById('site-header');
  function onScroll() {
    header.style.boxShadow = window.scrollY > 20 ? '0 2px 12px rgba(0,0,0,0.10)' : '';
    updateMobCta();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = btn.getAttribute('data-faq');
      const answer = document.getElementById(id);
      const icon   = btn.querySelector('.faq-icon');
      const isOpen = answer.classList.contains('open');

      document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));

      if (!isOpen) {
        answer.classList.add('open');
        icon.classList.add('open');
      }
    });
  });

  // ===== First Time Accordion =====
  document.querySelectorAll('.ft-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const id     = btn.getAttribute('data-ft');
      const answer = document.getElementById(id);
      const arrow  = btn.querySelector('.ft-arrow');
      const isOpen = answer.classList.contains('open');

      document.querySelectorAll('.ft-a').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.ft-arrow').forEach(a => a.classList.remove('open'));

      if (!isOpen) {
        answer.classList.add('open');
        arrow.classList.add('open');
      }
    });
  });

  // ===== Mobile CTA =====
  const mobCta = document.getElementById('mob-cta');
  const hero   = document.querySelector('.hero-section');

  function updateMobCta() {
    if (!mobCta || !hero) return;
    mobCta.classList.toggle('visible', hero.getBoundingClientRect().bottom < 0);
  }

  // ===== Smooth Scroll =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===== Util dropdowns (mobile toggle) =====
  document.querySelectorAll('.util-dropdown').forEach(el => {
    el.querySelector('.util-btn')?.addEventListener('click', e => {
      e.stopPropagation();
      el.classList.toggle('active');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.util-dropdown').forEach(el => el.classList.remove('active'));
  });

  // ===== Activate section tab switcher =====
  document.querySelectorAll('.activate-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.activate-tab').forEach(t => {
        t.classList.remove('activate-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.activate-panel').forEach(p => {
        p.classList.remove('activate-panel--active');
        p.hidden = true;
      });
      tab.classList.add('activate-tab--active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + target);
      if (panel) { panel.classList.add('activate-panel--active'); panel.hidden = false; }
    });
  });

  onScroll();

  // ===== Sakura Animation =====
  (function () {
    const canvas = document.getElementById('sakura-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let petals = [];
    let animId = null;
    let played = false;

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function Petal(cx, cy) {
      // タップ位置周辺からランダムに発生
      this.x  = cx + (Math.random() - 0.5) * 120;
      this.y  = cy + (Math.random() - 0.5) * 80;
      this.size  = Math.random() * 7 + 4;
      this.vx    = (Math.random() - 0.5) * 3;
      this.vy    = -(Math.random() * 3 + 1);   // 最初は上へ
      this.gravity = 0.06;
      this.rot   = Math.random() * 360;
      this.rotV  = (Math.random() - 0.5) * 4;
      this.alpha = 1;
      // ピンク系をランダムに
      const hue = Math.round(340 + Math.random() * 20);
      const sat = Math.round(80 + Math.random() * 15);
      const lgt = Math.round(78 + Math.random() * 12);
      this.color = `hsl(${hue},${sat}%,${lgt}%)`;
    }
    Petal.prototype.update = function () {
      this.vy   += this.gravity;
      this.x    += this.vx + Math.sin(Date.now() * 0.001 + this.rot) * 0.4;
      this.y    += this.vy;
      this.rot  += this.rotV;
      this.alpha = Math.max(0, this.alpha - 0.008);
    };
    Petal.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot * Math.PI / 180);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals = petals.filter(p => p.alpha > 0);
      petals.forEach(p => { p.update(); p.draw(); });
      if (petals.length > 0) {
        animId = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animId = null;
      }
    }

    function startSakura(e) {
      if (played) return;
      played = true;

      const cx = e.clientX ?? window.innerWidth  / 2;
      const cy = e.clientY ?? window.innerHeight / 2;

      for (let i = 0; i < 60; i++) petals.push(new Petal(cx, cy));

      if (animId) cancelAnimationFrame(animId);
      animate();

      // 3秒後にフェードアウトしながら停止
      setTimeout(() => {
        petals.forEach(p => { p.gravity += 0.03; });
      }, 3000);
    }

    document.addEventListener('click',      startSakura, { once: true });
    document.addEventListener('touchstart', startSakura, { once: true, passive: true });
  })();
})();
