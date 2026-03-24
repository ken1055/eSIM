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
})();
