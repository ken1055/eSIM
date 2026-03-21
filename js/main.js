/* ============================================================
   eSIM Japan LP — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ===== Header Scroll Effect =====
  const header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
    updateMobileCta();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ===== Mobile Navigation Toggle =====
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.nav__link, .btn').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===== FAQ Accordion =====
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-faq');
      const answer   = document.getElementById(targetId);
      const icon     = btn.querySelector('.faq-icon');
      const isOpen   = answer.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('open'));

      // Open clicked (unless it was already open)
      if (!isOpen) {
        answer.classList.add('open');
        icon.classList.add('open');
      }
    });
  });

  // ===== Device Accordion =====
  document.querySelectorAll('.device-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const body     = document.getElementById(targetId);
      const arrow    = btn.querySelector('.device-arrow');

      body.classList.toggle('open');
      arrow.classList.toggle('open');
      btn.setAttribute('aria-expanded', body.classList.contains('open'));
    });
  });

  // ===== Install Guide Tabs =====
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById('tab-' + tabId);
      if (panel) panel.classList.add('active');
    });
  });

  // ===== Mobile Fixed CTA =====
  const mobileCta  = document.getElementById('mobile-cta');
  const heroSection = document.querySelector('.hero');

  function updateMobileCta() {
    if (!heroSection || !mobileCta) return;
    const heroBottom = heroSection.getBoundingClientRect().bottom;
    mobileCta.classList.toggle('visible', heroBottom < 0);
  }

  // ===== Intersection Observer — Scroll Animations =====
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -48px 0px'
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  // Staggered animation for grid items
  const staggerSelectors = [
    '.plan-card',
    '.why-card',
    '.review-card',
    '.step',
    '.cov-feature'
  ];

  staggerSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
      if (!el.hasAttribute('data-aos')) {
        el.setAttribute('data-aos', '');
        observer.observe(el);
      }
    });
  });

  // ===== Progress Bar Animation =====
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    // Start at 0 and animate to target width
    const targetWidth = progressFill.style.width;
    progressFill.style.width = '0%';
    setTimeout(() => {
      progressFill.style.width = targetWidth;
    }, 800);
  }

  // ===== Active Nav Link on Scroll =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link');

  function setActiveNavLink() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActiveNavLink, { passive: true });

  // ===== Init =====
  onScroll();
  updateMobileCta();
})();
