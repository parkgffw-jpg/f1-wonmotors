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
  var panels = document.querySelectorAll('[data-panel]');

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

        /* 분류에 딸린 안내 패널 (작업 가능 차량 등) */
        Array.prototype.forEach.call(panels, function (pn) {
          pn.hidden = pn.getAttribute('data-panel') !== want;
        });

        if (typeof setWork === 'function') { setWork(want); }
      });
    });
  }

  /* ===== 차종 버튼 + 정비사례 렌더 (자료: assets/js/cases-data.js) ===== */
  var DATA = (typeof window.CASES !== 'undefined' && window.CASES) ? window.CASES : [];
  var BRANDS = [
    ['hyundai',   '현대',        'korea',   'kr'],
    ['kia',       '기아',        'korea',   'kr'],
    ['kgm',       'KGM · 쌍용',  'korea',   'kr'],
    ['renault',   '르노코리아',   'korea',   'kr'],
    ['chevrolet', '쉐보레',      'korea',   'kr'],
    ['porsche',   '포르쉐',      'porsche', 'im'],
    ['benz',      '벤츠',        'benz',    'im'],
    ['bmw',       'BMW',         'bmw',     'im'],
    ['audi',      '아우디',      'audi',    'im'],
    ['vw',        '폭스바겐',    'vw',      'im'],
    ['etc',       '그 외 차종',  '',        'im']
  ];
  var BNAME = {}, BATTR = {};
  BRANDS.forEach(function (b) { BNAME[b[0]] = b[1]; BATTR[b[0]] = b[2]; });

  function inWork(rec, work) {
    if (work === 'all') return true;
    return (' ' + (rec.work || '') + ' ').indexOf(' ' + work + ' ') > -1;
  }
  function pick(work, brand) {
    return DATA.filter(function (r) { return inWork(r, work) && r.brand === brand; });
  }

  var tileBoxes = document.querySelectorAll('[data-tiles]');
  var brandBox  = document.getElementById('brandCases');
  var brandNone = document.getElementById('brandNone');

  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function step(label, text) {
    return text
      ? '<li><span>' + label + '</span><p>' + esc(text) + '</p></li>'
      : '<li><span>' + label + '</span><p class="step-todo">내용 준비 중</p></li>';
  }
  function symHTML(r) {
    if (!r.sym || !r.sym.length) return '';
    return '<div class="case-sym"><span class="case-sym-label">이런 증상에서 이어지는 작업입니다</span><ul>' +
      r.sym.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
  }
  function askHTML(r) {
    if (!r.q || !r.q.length) return '';
    return '<div class="case-ask"><span class="case-ask-label">이런 질문으로 찾아오십니다</span><ul>' +
      r.q.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
  }
  function shotsHTML(r) {
    if (!r.photos || !r.photos.length) {
      return '<div class="case-shots"><div class="shot-empty">작업 사진 · 정비내역서 준비 중</div></div>';
    }
    var MAP = window.CASE_IMG || {};
    return '<div class="case-shots">' + r.photos.map(function (p) {
      var src = MAP[p.f] || ('assets/img/cases/' + p.f);
      return '<figure><img src="' + src + '" alt="' + esc(p.c) +
             '" loading="lazy" /><figcaption>' + esc(p.c) + '</figcaption></figure>';
    }).join('') + '</div>';
  }
  function cardHTML(r) {
    var attr = BATTR[r.brand] || '';
    var badge = attr
      ? '<span class="car-badge" data-brand="' + attr + '">' + esc(BNAME[r.brand] || '') + '</span>'
      : '<span class="car-badge">' + esc(BNAME[r.brand] || '') + '</span>';
    var spec = '';
    if (r.car) spec += '<div><dt>차종</dt><dd>' + esc(r.car) + '</dd></div>';
    if (r.km)  spec += '<div><dt>주행거리</dt><dd>' + esc(r.km) + '</dd></div>';
    if (r.out) spec += '<div><dt>출고</dt><dd>' + esc(r.out) + '</dd></div>';
    var tag = (' ' + r.work + ' ').indexOf(' injector ') > -1 ? '커먼레일 · 인젝터'
            : (' ' + r.work + ' ').indexOf(' dpf ') > -1 ? 'DPF 클리닝' : '정비';
    return '<article class="case-card">' +
      '<div class="case-head">' + badge +
        '<span class="case-tag">' + tag + '</span>' +
        '<span class="src-flag">정비내역서 기준</span></div>' +
      '<h2 class="case-title">' + esc(r.car) + (r.title ? ' — ' + esc(r.title) : '') + '</h2>' +
      symHTML(r) +
      (spec ? '<dl class="case-spec">' + spec + '</dl>' : '') +
      '<ol class="case-steps">' +
        step('증상', r.symptom) + step('진단', r.diagnosis) +
        step('수리', r.repair)  + step('결과', r.result) +
      '</ol>' +
      askHTML(r) +
      shotsHTML(r) +
      '</article>';
  }

  var curWork = 'all', curBrand = null;
  var countBox = document.getElementById('brandCount');

  function buildTiles() {
    Array.prototype.forEach.call(tileBoxes, function (box) {
      var work = box.getAttribute('data-tiles');
      var groups = [['kr', '국산차'], ['im', '수입차']];
      var html = '';
      groups.forEach(function (g) {
        var items = BRANDS.filter(function (b) {
          return b[3] === g[0] && pick(work, b[0]).length > 0;
        });
        if (!items.length) return;
        html += '<div class="bp-group"><span class="bp-label' +
                (g[0] === 'kr' ? ' bp-label-kr' : '') + '">' + g[1] + '</span><ul class="bp-list">';
        items.forEach(function (b) {
          var n = pick(work, b[0]).length;
          html += '<li><button type="button" class="bp-chip" data-bfilter="' + b[0] + '">' +
                  b[1] + ' <span class="bp-cnt">' + n + '</span></button></li>';
        });
        html += '</ul></div>';
      });
      box.innerHTML = html;
    });
  }

  function render() {
    var list = DATA.filter(function (r) {
      return inWork(r, curWork) && (!curBrand || r.brand === curBrand);
    });
    if (brandBox) {
      brandBox.innerHTML = list.map(cardHTML).join('');
      brandBox.hidden = list.length === 0;
    }
    if (brandNone) brandNone.hidden = list.length !== 0;
    if (countBox) {
      countBox.textContent = curBrand
        ? (BNAME[curBrand] || '') + ' ' + list.length + '건'
        : '정비내역서 기록 ' + list.length + '건';
      countBox.hidden = list.length === 0;
    }
    /* 브랜드를 고르면 설명용 글은 숨깁니다 */
    Array.prototype.forEach.call(cards, function (card) {
      card.hidden = curBrand
        ? true
        : !(curWork === 'all' || card.getAttribute('data-cat') === curWork);
    });
  }

  function setWork(work) {
    curWork = work; curBrand = null;
    Array.prototype.forEach.call(document.querySelectorAll('.bp-chip'), function (c) {
      c.classList.remove('is-on');
    });
    render();
  }
  function clearBrand() { curBrand = null; }

  if (tileBoxes.length && DATA.length) {
    buildTiles();
    Array.prototype.forEach.call(panels, function (pn) {
      pn.hidden = pn.getAttribute('data-panel') !== 'all';
    });
    render();
    document.addEventListener('click', function (e) {
      var chip = e.target.closest && e.target.closest('.bp-chip');
      if (!chip) return;
      var off = chip.classList.contains('is-on');
      Array.prototype.forEach.call(document.querySelectorAll('.bp-chip'), function (c) {
        c.classList.remove('is-on');
      });
      if (off) { curBrand = null; }
      else { chip.classList.add('is-on'); curBrand = chip.getAttribute('data-bfilter'); }
      render();
      var panel = chip.closest('.brand-panel');
      if (panel && !off) {
        var y = panel.getBoundingClientRect().bottom + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
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
