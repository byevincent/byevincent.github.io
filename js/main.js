document.addEventListener('DOMContentLoaded', function () {

  // Theme toggle
  var toggle = document.querySelector('.theme-toggle');
  var saved = localStorage.getItem('bv-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bv-theme', next);
    });
  }

  // Mobile nav
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Tag filter pills
  var pills = Array.from(document.querySelectorAll('.pill'));
  var cards = Array.from(document.querySelectorAll('.post-card'));
  var empty = document.getElementById('posts-empty');

  if (pills.length && cards.length) {
    function applyFilter(tag) {
      var visible = 0;
      cards.forEach(function (card) {
        var tags = (card.getAttribute('data-tags') || '').split(' ');
        var show = tag === 'all' || tags.indexOf(tag) !== -1;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      pills.forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-tag') === tag);
      });
      if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        applyFilter(pill.getAttribute('data-tag'));
      });
    });

    applyFilter('all');
  }

});
