/*===============================================================
  Phuong Tran — portfolio behaviour
  Vanilla JS, no dependencies. Every block guards its own nodes so
  a missing section never breaks the rest of the page.
================================================================*/
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*=============== THEME ===============*/
  var root = document.documentElement;
  var themeToggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    root.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
    });
  }

  // Follow the OS until the visitor makes a choice of their own.
  var media = window.matchMedia('(prefers-color-scheme: light)');
  media.addEventListener('change', function (e) {
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (err) {}
    if (!stored) root.dataset.theme = e.matches ? 'light' : 'dark';
  });

  /*=============== MOBILE NAV ===============*/
  var navMenu = document.getElementById('nav-menu');
  var navToggle = document.getElementById('nav-toggle');
  var navClose = document.getElementById('nav-close');

  function openNav() {
    if (!navMenu) return;
    navMenu.classList.add('is-open');
    document.body.classList.add('is-locked');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle) navToggle.addEventListener('click', openNav);
  if (navMenu) {
    navMenu.addEventListener('click', function (e) {
      // The scrim is a pseudo-element of the panel, so a click that lands on
      // the panel itself (not a child) came from outside the drawer.
      if (e.target === navMenu) closeNav();
    });
  }
  if (navClose) navClose.addEventListener('click', closeNav);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  /*=============== HEADER STATE + SCROLL SPY ===============*/
  var progressBar = document.querySelector('#progress i');
  var header = document.getElementById('header');
  var scrollUp = document.getElementById('scroll-up');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));

  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  var ticking = false;

  function onScroll() {
    var y = window.scrollY;

    if (header) header.classList.toggle('is-scrolled', y > 20);
    if (scrollUp) scrollUp.classList.toggle('is-visible', y > 480);

    if (progressBar) {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.setProperty('--p', scrollable > 0 ? y / scrollable : 0);
    }

    // The section whose top has most recently passed the header line wins.
    var offset = y + (header ? header.offsetHeight : 0) + 40;
    var current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= offset) current = section.id;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  /*=============== COPY TO CLIPBOARD ===============*/
  document.querySelectorAll('.copy').forEach(function (button) {
    button.addEventListener('click', function (e) {
      // The button sits inside a mailto: card — don't follow the link.
      e.preventDefault();
      e.stopPropagation();

      var value = button.dataset.copy || '';
      var done = function () {
        button.classList.add('is-done');
        setTimeout(function () { button.classList.remove('is-done'); }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {});
      }
    });
  });

  /*=============== REVEAL ON SCROLL ===============*/
  var revealTargets = document.querySelectorAll(
    '.section__eyebrow, .section__title, .section__lead, .card, .timeline__item, .cta, ' +
    '.about__media, .about__body, .tile, .chart, .diagram, .domains__note'
  );

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

    revealTargets.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
      observer.observe(el);
    });
  }

  /*=============== ROTATING ROLE ===============*/
  var rotator = document.getElementById('rotator');

  if (rotator && !reduced) {
    var roles = ['.NET & Cloud', 'APIs & Data', 'Angular · Vue · Svelte', 'Azure & AWS'];
    var roleIndex = 0;

    setInterval(function () {
      rotator.classList.add('is-out');
      setTimeout(function () {
        roleIndex = (roleIndex + 1) % roles.length;
        rotator.textContent = roles[roleIndex];
        rotator.classList.remove('is-out');
      }, 300);
    }, 3200);
  }

  /*=============== COUNT UP ===============*/
  function countUp(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    if (reduced) { el.textContent = String(target); return; }

    var duration = 1100;
    var started = null;

    function step(now) {
      if (started === null) started = now;
      var t = Math.min((now - started) / duration, 1);
      // easeOutCubic — fast start, soft landing.
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var counters = document.querySelectorAll('[data-count]');
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        // Zero it only now: an element whose observer never fires keeps its
        // real value in the markup rather than being stuck showing 0.
        if (!reduced) entry.target.textContent = '0';
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /*=============== CHART DRAW-IN ===============*/
  // The bars start at scaleX(0); .is-drawn releases them. Without
  // IntersectionObserver they would stay collapsed, so draw them immediately.
  var charts = document.querySelectorAll('.bars');

  if ('IntersectionObserver' in window && !reduced) {
    var chartObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-drawn');
        chartObserver.unobserve(entry.target);
      });
    }, { threshold: 0.25 });

    charts.forEach(function (c) { chartObserver.observe(c); });
  } else {
    charts.forEach(function (c) { c.classList.add('is-drawn'); });
  }

  /*=============== CARD SPOTLIGHT ===============*/
  // One delegated listener rather than one per card.
  if (!reduced && matchMedia('(hover: hover)').matches) {
    document.addEventListener('pointermove', function (e) {
      var card = e.target.closest ? e.target.closest('.card') : null;
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /*=============== CODE CARD TILT ===============*/
  var codecard = document.getElementById('codecard');

  if (codecard && !reduced && matchMedia('(hover: hover)').matches) {
    var tiltFrame = null;

    codecard.addEventListener('pointermove', function (e) {
      if (tiltFrame) return;
      tiltFrame = requestAnimationFrame(function () {
        var r = codecard.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        codecard.classList.add('is-tilting');
        codecard.style.setProperty('--ry', (px * 9).toFixed(2) + 'deg');
        codecard.style.setProperty('--rx', (-py * 7).toFixed(2) + 'deg');
        tiltFrame = null;
      });
    }, { passive: true });

    codecard.addEventListener('pointerleave', function () {
      codecard.classList.remove('is-tilting');
      codecard.style.setProperty('--ry', '0deg');
      codecard.style.setProperty('--rx', '0deg');
    });
  }

  /*=============== FOOTER YEAR ===============*/
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
