document.addEventListener('DOMContentLoaded', function () {

  // Theme toggle. The initial theme is set by an inline <head> script
  // (before first paint, so no flash); here we only handle the click.
  var toggle = document.querySelector('.theme-toggle');
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
  var pills = Array.from(document.querySelectorAll('.filter-row .pill'));
  var cards = Array.from(document.querySelectorAll('.post-card'));
  var empty = document.getElementById('posts-empty');
  var emptyReset = document.getElementById('posts-empty-reset');

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
        var on = p.getAttribute('data-tag') === tag;
        p.classList.toggle('active', on);
        p.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
    }

    pills.forEach(function (pill) {
      pill.setAttribute('aria-pressed', 'false');
      pill.addEventListener('click', function () {
        applyFilter(pill.getAttribute('data-tag'));
      });
    });

    if (emptyReset) {
      emptyReset.addEventListener('click', function () {
        applyFilter('all');
      });
    }

    applyFilter('all');
  }

});
