(function () {
  'use strict';

  // ===== Hamburger / Mobile Nav =====
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  hamburger.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close nav on link click
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
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

  onScroll();
})();
