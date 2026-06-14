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

  /* ---- Date field: native picker, English display (locale-independent) ---- */
  var dateEl = $('startDate');       // hidden native <input type="date">
  var dateText = $('startDateText'); // visible English text
  if (dateEl) {
    var t = new Date();
    dateEl.min = t.getFullYear() + '-' +
      String(t.getMonth() + 1).padStart(2, '0') + '-' + String(t.getDate()).padStart(2, '0');
  }
  function fmtEnglish(v) {
    var d = new Date(v + 'T00:00:00');
    if (isNaN(d)) return v;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  function openPicker() {
    if (dateEl.showPicker) { try { dateEl.showPicker(); return; } catch (e) {} }
    dateEl.focus(); dateEl.click();
  }
  if (dateText && dateEl) {
    dateText.addEventListener('click', openPicker);
    dateText.addEventListener('focus', openPicker);
    dateEl.addEventListener('change', function () {
      dateText.value = dateEl.value ? fmtEnglish(dateEl.value) : '';
      if (dateEl.value) { showError('err-date', false); dateText.classList.remove('is-invalid'); }
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
    $('startDateText').classList.toggle('is-invalid', !dateOk);
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
      startDate: $('startDate').value
    });

    beginPayment();
  });

  /* ---- Payment: create a Stripe Checkout Session, then redirect ----
     Falls back to the mock flow when the backend isn't available yet
     (e.g. local static preview) or no Stripe key is configured server-side. */
  function beginPayment() {
    var btn = $('co-submit');
    btn.disabled = true;
    $('pay-overlay').classList.add('show');

    var order = {};
    try { order = JSON.parse(sessionStorage.getItem('esim_order')) || {}; } catch (e) {}

    fetch('api/create-checkout-session.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: order.planId,
        email: order.email,
        startDate: order.startDate
      })
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('http ' + r.status)); })
      .then(function (data) {
        if (data && data.url) {
          window.location.href = data.url;     // -> Stripe Checkout (hosted)
        } else {
          goMock();                            // { mock: true } — no key configured yet
        }
      })
      .catch(function () { goMock(); });        // endpoint missing (static preview) / network error
  }

  /* ---- Mock payment: spinner then success page (no real charge) ---- */
  function goMock() {
    setTimeout(function () { window.location.href = 'success.html'; }, 1200);
  }

  /* Keep summary price in sync if the user switches currency */
  document.querySelectorAll('[data-currency]').forEach(function (a) {
    a.addEventListener('click', function () {
      setTimeout(renderSummary, 0);
    });
  });
})();
