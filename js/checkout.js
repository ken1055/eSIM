/* =====================================================
   checkout.js — Details screen logic (UI-only, mock flow)

   Flow today (mock):
     1. Read selected plan from ?plan= query param
     2. Render the summary card
     3. Validate the form on submit
     4. Show a "redirecting" overlay, then go to success.html

   To go live later, replace startMockPayment() with
   createStripeCheckoutSession() — see the stub at the bottom.
   ===================================================== */
(function () {
  'use strict';

  /* ---- Currency (mirror of i18n.js so prices render before i18n init) ---- */
  var RATES   = { USD: 150, EUR: 160 };
  var SYMBOLS = { USD: '$', EUR: '€' };

  /* ---- Plan catalog (matches the cards on index.html) ---- */
  var PLANS = {
    'city-3gb':    { name: '3GB / 5 Days',      desc: 'Japan Nationwide · Best for Short Trips',   jpy: 1800, data: '3 GB',        validity: '5 Days',  badge: '' },
    'city-10gb':   { name: '10GB / 10 Days',    desc: 'Japan Nationwide · Best for Mid-Length Trips', jpy: 2250, data: '10 GB',    validity: '10 Days', badge: 'Most Popular' },
    'city-unlim':  { name: 'Unlimited / 30 Days', desc: 'Japan Nationwide · Best for Long Stays',  jpy: 5400, data: 'Unlimited',   validity: '30 Days', badge: '' },
    'multi-3gb':   { name: '3GB / 5 Days',      desc: 'Multi-Country · Quick Trips',               jpy: 2100, data: '3 GB',        validity: '5 Days',  badge: '' },
    'multi-10gb':  { name: '10GB / 10 Days',    desc: 'Multi-Country · Best for Multi-Country Travel', jpy: 3300, data: '10 GB',  validity: '10 Days', badge: 'Most Popular' },
    'multi-unlim': { name: 'Unlimited / 30 Days', desc: 'Multi-Country · Extended Stays',          jpy: 6750, data: 'Unlimited',   validity: '30 Days', badge: '' }
  };
  var DEFAULT_PLAN = 'city-10gb';

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }
  function currentCurrency() {
    var c = localStorage.getItem('esim_currency') || 'USD';
    return RATES[c] ? c : 'USD';
  }
  function formatPrice(jpy, currency) {
    return SYMBOLS[currency] + (jpy / RATES[currency]).toFixed(2) + ' ' + currency;
  }

  /* ---- Render summary card from selected plan ---- */
  var planId = getParam('plan');
  var plan = PLANS[planId] || PLANS[DEFAULT_PLAN];
  if (!PLANS[planId]) planId = DEFAULT_PLAN;

  function $(id) { return document.getElementById(id); }

  function renderSummary() {
    var cur = currentCurrency();
    $('sum-plan').textContent = plan.name;
    $('sum-plandesc').textContent = plan.desc;
    $('sum-data').textContent = plan.data;
    $('sum-validity').textContent = plan.validity;
    var priceEl = $('sum-price');
    priceEl.setAttribute('data-jpy', plan.jpy);  // lets i18n.js update on currency toggle
    priceEl.textContent = formatPrice(plan.jpy, cur);
    var badge = $('sum-badge');
    if (plan.badge) { badge.textContent = plan.badge; badge.style.display = ''; }
    else { badge.style.display = 'none'; }
  }
  renderSummary();

  /* ---- Save selection so success.html can show the same plan ---- */
  function persistOrder(extra) {
    var order = {
      planId: planId,
      planName: plan.name,
      jpy: plan.jpy,
      currency: currentCurrency()
    };
    if (extra) Object.keys(extra).forEach(function (k) { order[k] = extra[k]; });
    try { sessionStorage.setItem('esim_order', JSON.stringify(order)); } catch (e) {}
    return order;
  }

  /* ---- Date input: default min = today ---- */
  var dateEl = $('startDate');
  if (dateEl) {
    var today = new Date().toISOString().slice(0, 10);
    dateEl.min = today;
  }

  /* ---- Promo toggle ---- */
  var promoToggle = $('promo-toggle');
  var promoField  = $('promo-field');
  if (promoToggle && promoField) {
    promoToggle.addEventListener('click', function () {
      promoToggle.classList.toggle('open');
      promoField.classList.toggle('open');
      if (promoField.classList.contains('open')) $('promo').focus();
    });
  }

  /* ---- Validation ---- */
  function showError(id, show) {
    var el = $(id);
    if (el) el.classList.toggle('show', show);
  }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function validate() {
    var ok = true;
    var email  = $('email').value.trim();
    var email2 = $('email2').value.trim();
    var date   = $('startDate').value;

    var emailOk = isEmail(email);
    showError('err-email', !emailOk);
    $('email').classList.toggle('is-invalid', !emailOk);
    if (!emailOk) ok = false;

    var matchOk = emailOk && email === email2;
    showError('err-email2', emailOk && !matchOk);
    $('email2').classList.toggle('is-invalid', emailOk && !matchOk);
    if (!matchOk) ok = false;

    var dateOk = !!date;
    showError('err-date', !dateOk);
    $('startDate').classList.toggle('is-invalid', !dateOk);
    if (!dateOk) ok = false;

    if (!$('chk-esim').checked || !$('chk-unlocked').checked) {
      ok = false;
      alert('Please confirm your device supports eSIM and is carrier-unlocked.');
    }
    return ok;
  }

  /* ---- Submit ---- */
  var form = $('checkout-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    persistOrder({
      firstName: $('firstName').value.trim(),
      lastName:  $('lastName').value.trim(),
      email:     $('email').value.trim(),
      startDate: $('startDate').value,
      promo:     $('promo').value.trim()
    });

    // === TODAY: mock payment ===
    startMockPayment();

    // === LATER: real payment (replace the line above with) ===
    // createStripeCheckoutSession();
  });

  /* ---- Mock payment: spinner then success page ---- */
  function startMockPayment() {
    var btn = $('co-submit');
    btn.disabled = true;
    $('pay-overlay').classList.add('show');
    setTimeout(function () {
      window.location.href = 'success.html';
    }, 1800);
  }

  /* ---------------------------------------------------------
     STUB for the live Stripe integration (do not call yet).

     Requires a serverless function (e.g. /api/create-checkout-session)
     that creates a Stripe Checkout Session with your secret key and
     returns { url }. The browser then redirects to Stripe's hosted page.

     async function createStripeCheckoutSession() {
       const order = JSON.parse(sessionStorage.getItem('esim_order'));
       const res = await fetch('/api/create-checkout-session', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(order)
       });
       const { url } = await res.json();
       window.location.href = url;   // -> Stripe Checkout
     }

     success.html becomes the Stripe success_url. The QR is then
     issued server-side via the eSIM provider API after the
     payment webhook confirms the charge.
  --------------------------------------------------------- */

  /* Keep summary price in sync if the user switches currency */
  document.querySelectorAll('[data-currency]').forEach(function (a) {
    a.addEventListener('click', function () {
      setTimeout(renderSummary, 0);
    });
  });
})();
