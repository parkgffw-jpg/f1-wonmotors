/* 에프원모터스 홈페이지 스크립트 (모바일 메뉴 / 스크롤 효과) */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  /* 모바일 메뉴 열기/닫기 */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
      }
    });
  }

  /* 스크롤 시 헤더 배경 진하게 */
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 현재 보고 있는 섹션 메뉴 강조 */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* 스크롤 등장 애니메이션 */
  var targets = document.querySelectorAll(
    '.symptom-grid li, .service-card, .process-list li, .why-item, .faq-list details, .location-info, .location-map'
  );

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    Array.prototype.forEach.call(targets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      revealObserver.observe(el);
    });
  }
})();

/* ===== 정비사례 페이지: 분류 필터 + 사진 크게 보기 ===== */
(function () {
  'use strict';

  /* 분류 필터 */
  var chips = document.querySelectorAll('.case-chip');
  var cards = document.querySelectorAll('.case-card');

  if (chips.length && cards.length) {
    Array.prototype.forEach.call(chips, function (chip) {
      chip.addEventListener('click', function () {
        var want = chip.getAttribute('data-filter');

        Array.prototype.forEach.call(chips, function (c) {
          c.classList.toggle('is-on', c === chip);
        });

        Array.prototype.forEach.call(cards, function (card) {
          card.hidden = !(want === 'all' || card.getAttribute('data-cat') === want);
        });
      });
    });
  }

  /* 사진 크게 보기 */
  var box = document.getElementById('lightbox');
  var boxImg = document.getElementById('lightboxImg');
  var boxCap = document.getElementById('lightboxCap');
  var boxClose = document.getElementById('lightboxClose');
  if (!box || !boxImg) return;

  function open(src, alt, cap) {
    boxImg.src = src;
    boxImg.alt = alt || '';
    boxCap.textContent = cap || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    boxClose.focus();
  }

  function close() {
    box.hidden = true;
    boxImg.src = '';
    document.body.style.overflow = '';
  }

  document.addEventListener('click', function (e) {
    var img = e.target.closest ? e.target.closest('.case-shots img') : null;
    if (!img) return;
    var fig = img.closest('figure');
    var cap = fig && fig.querySelector('figcaption');
    open(img.currentSrc || img.src, img.alt, cap ? cap.textContent : '');
  });

  boxClose.addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !box.hidden) close();
  });
})();
