/* =====================================================
   i18n.js — Language & Currency switching
   Languages : en / de / zh
   Currencies : USD (¥150) / EUR (¥160)
   ===================================================== */
(function () {
  'use strict';

  /* ---- Exchange rates (JPY base) ---- */
  var RATES   = { USD: 150, EUR: 160 };
  var SYMBOLS = { USD: '$', EUR: '€' };

  /* ---- Translation dictionary ---- */
  var T = {
    en: {
      /* nav */
      'nav.nationwide': 'Nationwide Plans',
      'nav.multi':      'Multi-Country Plans',
      'nav.city':       'City Plans',
      'nav.support':    'Support',
      'nav.lab':        'Connectivity Lab',
      'nav.compat':     'eSIM Compatible Phones',
      'nav.activate':   'eSIM Activation Guide',
      'nav.contact':    'Contact',
      'nav.daily':      'Daily Report',
      'nav.weekly':     'Weekly Reports',
      /* hero */
      'hero.title':    'Stay connected in Japan instantly<br><span style="font-size:0.75em;font-weight:600;opacity:0.88">No SIM card. No waiting.<br>Scan the QR code and get online in 2 minutes.</span>',
      'hero.check1':   'Instant activation',
      'hero.check2':   'No SIM swap',
      'hero.check3':   'Unlimited data',
      'hero.btn':      'Get Your eSIM Instantly',
      'hero.trusted1': 'Used by travelers from 80+ countries',
      'hero.trusted2': 'Trusted by 50,000+ travelers worldwide',
      /* plans */
      'plans.title':   'Plans',
      'plans.sub':     'Choose the plan that fits your trip',
      'plan.period1':  '/ 5 days',
      'plan.period2':  '/ 10 days',
      'plan.period3':  '/ 30 days',
      'plan.unlimited':'Unlimited',
      'plan.feat1':    'High-speed 4G/LTE',
      'plan.feat2':    'Instant QR delivery',
      'plan.feat3':    'Activates on first use in Japan',
      'plan.feat4':    'Powered by Docomo / SoftBank',
      'plan.buy':      'Buy Now',
      'plan.popular':  '★ MOST POPULAR',
      'plan.pay1':     'Secure payment powered by Stripe.',
      'plan.pay2':     'Your eSIM will be delivered instantly by email after purchase.',
      'plan.pay3':     'No physical SIM required.',
      /* city */
      'city.title': 'For City Travelers',
      'city.sub':   "Connect to Japan's best local network, city by city",
      'city.shop':  'Shop Now →',
      /* multi */
      'multi.title': 'For Multi-Country Travelers',
      'multi.sub':   'One eSIM, multiple destinations — seamless connectivity across Asia',
      'multi.view':  'View Plans →',
      /* coverage */
      'cov.title': 'Coverage Across Japan',
      'cov.sub':   'Stay connected everywhere you travel',
      /* why */
      'why.title': 'Why getjapanesim.com is Best for Japan eSIM',
      /* support */
      'sup.title': '24/7 real human support,<br>ready when you need it',
      'sup.p':     "We're here before, during, and after your trip. Reach us via email or WhatsApp — a real person always responds.",
      'sup.li1':   'Get help within 5 minutes.',
      'sup.li2':   'Real humans, not bots — every time.',
      'sup.li3':   'Fast, reliable support from experienced specialists.',
      /* reviews */
      'rev.title': 'What Travelers Are Saying About our eSIM in Japan',
      /* how */
      'how.title': 'How does eSIM for Japan work?',
      'how.sub':   'From purchase to connected — in under 2 minutes.',
      'how.s1':    'Choose a plan',
      'how.s1p':   'Select the plan that fits your trip and place a quick order.',
      'how.s2':    'Pay online',
      'how.s2p':   'Secure checkout in under a minute — instant confirmation sent to your email.',
      'how.s3':    'Scan QR code',
      'how.s3p':   'Open your email, scan the QR code, and your eSIM is installed instantly.',
      'how.s4':    "You're online instantly",
      'how.s4p':   'Arrive in Japan and you\'re connected — no waiting, no SIM swaps.',
      /* first time */
      'ft.title': 'First time using eSIM for your trip to Japan?',
      'ft.sub':   'Count on us for your stress-free eSIM experience.',
      /* faq */
      'faq.title': 'Frequently Asked Questions',
      /* about */
      'about.p1':  'Get Japan eSIM is provided by COCODAKE Co., Ltd., a Japan-based company trusted by travelers worldwide. We deliver fast, reliable 4G LTE connectivity with instant activation and 24/7 real human support.',
      'about.p2':  'Stay connected anywhere in Japan — from Tokyo to Okinawa — with no physical SIM required. Just scan and go.',
      'about.btn': 'Get your eSIM now',
      /* footer */
      'footer.tagline': 'Explore Japan with confidence.',
      'footer.desc':    'Enjoy instant activation, no hidden fees, and reliable nationwide coverage. Get connected in just minutes — no SIM card required.',
      /* mobile cta */
      'mob.starts': 'Starts at',
      'mob.lang':   'Language',
      'mob.curr':   'Currency',
    },

    de: {
      /* nav */
      'nav.nationwide': 'Nationale Tarife',
      'nav.multi':      'Multi-Länder-Tarife',
      'nav.city':       'Stadtspezifische Tarife',
      'nav.support':    'Support',
      'nav.lab':        'Verbindungsanalyse',
      'nav.compat':     'eSIM-kompatible Geräte',
      'nav.activate':   'eSIM-Aktivierungsanleitung',
      'nav.contact':    'Kontakt',
      'nav.daily':      'Tagesbericht',
      'nav.weekly':     'Wochenberichte',
      /* hero */
      'hero.title':    'Sofort in Japan online —<br><span style="font-size:0.75em;font-weight:600;opacity:0.88">Keine SIM-Karte. Kein Warten.<br>QR-Code scannen und in 2 Minuten verbunden.</span>',
      'hero.check1':   'Sofortaktivierung',
      'hero.check2':   'Kein SIM-Wechsel nötig',
      'hero.check3':   'Unbegrenzte Daten',
      'hero.btn':      'eSIM jetzt holen',
      'hero.trusted1': 'Genutzt von Reisenden aus 80+ Ländern',
      'hero.trusted2': 'Weltweit vertraut von 50.000+ Reisenden',
      /* plans */
      'plans.title':   'Tarife',
      'plans.sub':     'Wählen Sie den passenden Tarif für Ihre Reise',
      'plan.period1':  '/ 5 Tage',
      'plan.period2':  '/ 10 Tage',
      'plan.period3':  '/ 30 Tage',
      'plan.unlimited':'Unbegrenzt',
      'plan.feat1':    'Schnelles 4G/LTE-Netz',
      'plan.feat2':    'Sofortige QR-Lieferung per E-Mail',
      'plan.feat3':    'Aktivierung bei erster Nutzung in Japan',
      'plan.feat4':    'Betrieben von Docomo / SoftBank',
      'plan.buy':      'Jetzt kaufen',
      'plan.popular':  '★ AM BELIEBTESTEN',
      'plan.pay1':     'Sichere Zahlung über Stripe.',
      'plan.pay2':     'Ihre eSIM wird sofort per E-Mail geliefert.',
      'plan.pay3':     'Keine physische SIM-Karte erforderlich.',
      /* city */
      'city.title': 'Für Städtereisende',
      'city.sub':   'Verbinden Sie sich mit dem besten lokalen Netz, Stadt für Stadt',
      'city.shop':  'Jetzt kaufen →',
      /* multi */
      'multi.title': 'Für Reisende in mehrere Länder',
      'multi.sub':   'Eine eSIM, mehrere Ziele — nahtlos durch ganz Asien',
      'multi.view':  'Tarife ansehen →',
      /* coverage */
      'cov.title': 'Netzabdeckung in Japan',
      'cov.sub':   'Überall verbunden auf Ihren Reisen',
      /* why */
      'why.title': 'Warum getjapanesim.com die beste Wahl für Japan eSIM ist',
      /* support */
      'sup.title': '24/7 echter menschlicher Support,<br>immer für Sie bereit',
      'sup.p':     'Wir sind vor, während und nach Ihrer Reise für Sie da. Kontaktieren Sie uns per E-Mail oder WhatsApp.',
      'sup.li1':   'Hilfe innerhalb von 5 Minuten.',
      'sup.li2':   'Echte Menschen, keine Bots — immer.',
      'sup.li3':   'Schneller, zuverlässiger Support von erfahrenen Spezialisten.',
      /* reviews */
      'rev.title': 'Was Reisende über unsere Japan eSIM sagen',
      /* how */
      'how.title': 'Wie funktioniert die Japan eSIM?',
      'how.sub':   'Vom Kauf bis zur Verbindung — in unter 2 Minuten.',
      'how.s1':    'Tarif wählen',
      'how.s1p':   'Wählen Sie den passenden Tarif für Ihre Reise und bestellen Sie schnell.',
      'how.s2':    'Online bezahlen',
      'how.s2p':   'Sicherer Checkout in weniger als einer Minute — sofortige Bestätigung per E-Mail.',
      'how.s3':    'QR-Code scannen',
      'how.s3p':   'Öffnen Sie Ihre E-Mail, scannen Sie den QR-Code — eSIM sofort installiert.',
      'how.s4':    'Sofort online!',
      'how.s4p':   'In Japan angekommen und direkt verbunden — kein Warten, kein SIM-Wechsel.',
      /* first time */
      'ft.title': 'Zum ersten Mal eSIM für Ihre Japan-Reise?',
      'ft.sub':   'Verlassen Sie sich auf uns für ein stressfreies eSIM-Erlebnis.',
      /* faq */
      'faq.title': 'Häufig gestellte Fragen',
      /* about */
      'about.p1':  'Get Japan eSIM wird von COCODAKE Co., Ltd. bereitgestellt, einem japanischen Unternehmen, dem Reisende weltweit vertrauen. Wir bieten schnelles, zuverlässiges 4G LTE mit Sofortaktivierung und 24/7 persönlichem Support.',
      'about.p2':  'Bleiben Sie überall in Japan verbunden — von Tokio bis Okinawa — ganz ohne physische SIM-Karte. Einfach scannen und loslegen.',
      'about.btn': 'Jetzt eSIM kaufen',
      /* footer */
      'footer.tagline': 'Japan entdecken — mit Zuversicht.',
      'footer.desc':    'Sofortaktivierung, keine versteckten Gebühren, zuverlässige landesweite Abdeckung. In wenigen Minuten verbunden — ohne SIM-Karte.',
      /* mobile cta */
      'mob.starts': 'Ab',
      'mob.lang':   'Sprache',
      'mob.curr':   'Währung',
    },

    zh: {
      /* nav */
      'nav.nationwide': '全国套餐',
      'nav.multi':      '多国套餐',
      'nav.city':       '城市套餐',
      'nav.support':    '客户支持',
      'nav.lab':        '网速监测',
      'nav.compat':     'eSIM兼容设备',
      'nav.activate':   'eSIM激活指南',
      'nav.contact':    '联系我们',
      'nav.daily':      '每日报告',
      'nav.weekly':     '每周报告',
      /* hero */
      'hero.title':    '立刻连上日本网络<br><span style="font-size:0.75em;font-weight:600;opacity:0.88">无需实体SIM卡，无需等待。<br>扫描二维码，两分钟内上线。</span>',
      'hero.check1':   '即时激活',
      'hero.check2':   '无需换卡',
      'hero.check3':   '无限流量',
      'hero.btn':      '立即获取eSIM',
      'hero.trusted1': '来自80多个国家的旅行者使用中',
      'hero.trusted2': '全球50,000+旅行者信赖之选',
      /* plans */
      'plans.title':   '套餐方案',
      'plans.sub':     '选择最适合您旅行的套餐',
      'plan.period1':  '/ 5天',
      'plan.period2':  '/ 10天',
      'plan.period3':  '/ 30天',
      'plan.unlimited':'无限流量',
      'plan.feat1':    '高速4G/LTE网络',
      'plan.feat2':    '即时发送二维码',
      'plan.feat3':    '到达日本首次使用时自动激活',
      'plan.feat4':    'NTT Docomo / SoftBank 运营',
      'plan.buy':      '立即购买',
      'plan.popular':  '★ 最受欢迎',
      'plan.pay1':     '通过Stripe安全付款。',
      'plan.pay2':     '购买后eSIM将立即通过邮件发送。',
      'plan.pay3':     '无需实体SIM卡。',
      /* city */
      'city.title': '城市旅行者专区',
      'city.sub':   '接入日本各城市最优质的本地网络',
      'city.shop':  '立即购买 →',
      /* multi */
      'multi.title': '多国旅行者专区',
      'multi.sub':   '一张eSIM，多个目的地 — 畅游全亚洲',
      'multi.view':  '查看套餐 →',
      /* coverage */
      'cov.title': '日本全境网络覆盖',
      'cov.sub':   '无论您走到哪里，都能保持联网',
      /* why */
      'why.title': '为什么getjapanesim.com是日本eSIM的最佳选择',
      /* support */
      'sup.title': '24/7真人客服，<br>随时为您解答',
      'sup.p':     '从出发前到旅途中，再到返回后，我们全程陪伴。通过邮件或WhatsApp联系我们，真人实时响应。',
      'sup.li1':   '5分钟内获得帮助。',
      'sup.li2':   '真人服务，非机器人 — 始终如此。',
      'sup.li3':   '经验丰富的专家提供快速可靠的支持。',
      /* reviews */
      'rev.title': '旅行者对我们日本eSIM的评价',
      /* how */
      'how.title': '日本eSIM如何使用？',
      'how.sub':   '从购买到连接 — 不到2分钟完成。',
      'how.s1':    '选择套餐',
      'how.s1p':   '选择适合您行程的套餐并快速下单。',
      'how.s2':    '在线支付',
      'how.s2p':   '一分钟内安全结账 — 即时收到邮件确认。',
      'how.s3':    '扫描二维码',
      'how.s3p':   '打开邮件，扫描二维码，eSIM立即安装完成。',
      'how.s4':    '立刻上线！',
      'how.s4p':   '抵达日本即刻连接 — 无需等待，无需换卡。',
      /* first time */
      'ft.title': '第一次在日本旅行使用eSIM？',
      'ft.sub':   '放心交给我们，让您轻松无忧地使用eSIM。',
      /* faq */
      'faq.title': '常见问题解答',
      /* about */
      'about.p1':  'Get Japan eSIM 由总部位于日本的COCODAKE Co., Ltd.提供，深受全球旅行者信赖。我们提供即时激活的高速4G LTE连接及24/7真人客服支持。',
      'about.p2':  '无论您在东京还是冲绳，都能轻松联网 — 无需实体SIM卡，扫码即用。',
      'about.btn': '立即购买eSIM',
      /* footer */
      'footer.tagline': '自信探索日本。',
      'footer.desc':    '即时激活，无隐藏费用，全国可靠覆盖。几分钟内即可联网 — 无需实体SIM卡。',
      /* mobile cta */
      'mob.starts': '起价',
      'mob.lang':   '语言',
      'mob.curr':   '货币',
    }
  };

  /* ---- State ---- */
  var currentLang     = localStorage.getItem('esim_lang')     || 'en';
  var currentCurrency = localStorage.getItem('esim_currency') || 'USD';

  /* ---- Apply language ---- */
  function applyLanguage(lang) {
    if (!T[lang]) return;
    currentLang = lang;
    localStorage.setItem('esim_lang', lang);

    var dict = T[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    /* Update lang button label */
    var labels = { en: 'EN', de: 'DE', zh: '中文' };
    var btn = document.getElementById('lang-btn');
    if (btn) btn.innerHTML = (labels[lang] || lang.toUpperCase()) + ' <span class="caret">▾</span>';

    /* Sync mobile select */
    var mobLang = document.getElementById('mob-lang');
    if (mobLang) mobLang.value = lang;

    /* Mark active item */
    document.querySelectorAll('[data-lang]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-lang') === lang);
    });
  }

  /* ---- Apply currency ---- */
  function formatPrice(jpy, currency) {
    var amount = (jpy / RATES[currency]).toFixed(2);
    return SYMBOLS[currency] + amount;
  }

  function applyCurrency(currency) {
    if (!RATES[currency]) return;
    currentCurrency = currency;
    localStorage.setItem('esim_currency', currency);

    /* plan-price-main: keep <span> with currency label */
    document.querySelectorAll('.plan-price-main[data-jpy]').forEach(function (el) {
      var jpy = parseInt(el.getAttribute('data-jpy'), 10);
      el.innerHTML = formatPrice(jpy, currency) + ' <span>' + currency + '</span>';
    });

    /* card prices (city / multi / mob-cta) with data-prefix */
    document.querySelectorAll('[data-jpy]:not(.plan-price-main)').forEach(function (el) {
      var jpy    = parseInt(el.getAttribute('data-jpy'), 10);
      var prefix = el.getAttribute('data-prefix') || '';
      el.textContent = prefix + formatPrice(jpy, currency) + ' ' + currency;
    });

    /* Update currency button label */
    var btn = document.getElementById('curr-btn');
    if (btn) btn.innerHTML = currency + ' <span class="caret">▾</span>';

    /* Sync mobile select */
    var mobCurr = document.getElementById('mob-curr');
    if (mobCurr) mobCurr.value = currency;

    /* Mark active item */
    document.querySelectorAll('[data-currency]').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-currency') === currency);
    });
  }

  /* ---- Dropdown toggle (desktop header) ---- */
  function setupDropdown(wrapperId) {
    var wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;
    var btn  = wrapper.querySelector('.util-btn');
    var menu = wrapper.querySelector('.util-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = menu.classList.contains('open');
      /* Close all util menus first */
      document.querySelectorAll('.util-menu.open').forEach(function (m) { m.classList.remove('open'); });
      if (!isOpen) menu.classList.add('open');
    });
  }

  document.addEventListener('click', function () {
    document.querySelectorAll('.util-menu.open').forEach(function (m) { m.classList.remove('open'); });
  });

  /* ---- Event listeners ---- */
  function init() {
    setupDropdown('lang-dropdown');
    setupDropdown('curr-dropdown');

    /* Desktop lang links */
    document.querySelectorAll('[data-lang]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        applyLanguage(this.getAttribute('data-lang'));
        var menu = this.closest('.util-menu');
        if (menu) menu.classList.remove('open');
      });
    });

    /* Desktop currency links */
    document.querySelectorAll('[data-currency]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        applyCurrency(this.getAttribute('data-currency'));
        var menu = this.closest('.util-menu');
        if (menu) menu.classList.remove('open');
      });
    });

    /* Mobile lang select */
    var mobLang = document.getElementById('mob-lang');
    if (mobLang) {
      mobLang.addEventListener('change', function () {
        applyLanguage(this.value);
      });
    }

    /* Mobile currency select */
    var mobCurr = document.getElementById('mob-curr');
    if (mobCurr) {
      mobCurr.addEventListener('change', function () {
        applyCurrency(this.value);
      });
    }

    /* Apply saved or default settings on load */
    applyLanguage(currentLang);
    applyCurrency(currentCurrency);
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
