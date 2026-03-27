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

  // ===== Reviews Carousel =====
  (function () {
    const track = document.querySelector('.reviews-track');
    if (!track) return;
    const cards = Array.from(track.querySelectorAll('.review-card'));
    const dots  = Array.from(document.querySelectorAll('.carousel-dot'));
    const btnPrev = document.querySelector('.carousel-btn--prev');
    const btnNext = document.querySelector('.carousel-btn--next');
    let current = 0;
    let timer   = null;

    function goTo(idx) {
      cards[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (idx + cards.length) % cards.length;
      cards[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
    }

    function startAuto() { timer = setInterval(() => goTo(current + 1), 5000); }
    function stopAuto()  { clearInterval(timer); }

    if (btnPrev) btnPrev.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (btnNext) btnNext.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    });

    startAuto();
  })();

  // ===== Sakura Animation — 自動で上から下へ連続して降る =====
  (function () {
    const canvas = document.getElementById('sakura-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const HEADER_H = 84;
    const MAX_PETALS = 45;
    let petals = [];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function Petal(startY) {
      const hue = Math.round(338 + Math.random() * 22);
      const sat = Math.round(80 + Math.random() * 15);
      const lgt = Math.round(76 + Math.random() * 14);
      this.x         = Math.random() * canvas.width;
      this.y         = startY !== undefined ? startY : HEADER_H - Math.random() * 10;
      this.size      = Math.random() * 6 + 3;
      this.vx        = (Math.random() - 0.5) * 1.2;
      this.vy        = Math.random() * 2.5 + 2.0;
      this.rot       = Math.random() * 360;
      this.rotV      = (Math.random() - 0.5) * 2.5;
      this.swing     = Math.random() * Math.PI * 2;
      this.swingSpd  = 0.012 + Math.random() * 0.014;
      this.swingAmp  = 0.6 + Math.random() * 1.0;
      this.color     = `hsl(${hue},${sat}%,${lgt}%)`;
      this.alpha     = 0;
    }
    Petal.prototype.update = function () {
      this.swing += this.swingSpd;
      this.x     += this.vx + Math.sin(this.swing) * this.swingAmp;
      this.y     += this.vy;
      this.rot   += this.rotV;
      if (this.alpha < 0.9) this.alpha = Math.min(0.9, this.alpha + 0.04);
      const fadeStart = canvas.height * 0.82;
      if (this.y > fadeStart) {
        this.alpha = Math.max(0, 0.9 * (1 - (this.y - fadeStart) / (canvas.height * 0.18)));
      }
    };
    Petal.prototype.isDead = function () {
      return this.y > canvas.height + 20;
    };
    Petal.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot * Math.PI / 180);
      const s = this.size;
      // 楕円ベースの桜花びら：縦長・上部に小さなV字ノッチ
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.05);            // ノッチ底（浅め）
      ctx.lineTo(-s * 0.15, -s * 0.42);   // ノッチ左（控えめ）
      ctx.bezierCurveTo(
        -s * 0.72, -s * 0.55,             // 左上の丸み
        -s * 0.72,  s * 0.85,             // 左下の丸み（縦長）
         0,         s * 1.1               // 下端
      );                                   // 左弧
      ctx.bezierCurveTo(
         s * 0.72,  s * 0.85,
         s * 0.72, -s * 0.55,
         s * 0.15, -s * 0.42
      );                                   // 右弧（対称）
      ctx.lineTo(0, -s * 0.05);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
      // 薄い輪郭線
      ctx.strokeStyle = 'hsla(340,70%,72%,' + (this.alpha * 0.35) + ')';
      ctx.lineWidth = 0.4;
      ctx.stroke();
      ctx.restore();
    };

    // 初期ロード時は画面全体に分散して配置
    for (let i = 0; i < MAX_PETALS; i++) {
      const p = new Petal(HEADER_H + Math.random() * (window.innerHeight - HEADER_H));
      p.alpha = Math.random() * 0.7;
      petals.push(p);
    }

    let spawning = true;
    // 2秒後に新規生成を停止
    setTimeout(() => { spawning = false; }, 2000);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals = petals.filter(p => !p.isDead());
      if (spawning) {
        while (petals.length < MAX_PETALS) petals.push(new Petal());
      }
      petals.forEach(p => { p.update(); p.draw(); });
      if (petals.length > 0 || spawning) {
        requestAnimationFrame(animate);
      }
    }

    animate();
  })();
})();
