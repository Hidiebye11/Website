/* =========================================
   Navigation
   ========================================= */
(function () {
  const navbar   = document.querySelector('.navbar');
  const toggle   = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Highlight active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Scroll shadow
  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
  });

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
})();

/* =========================================
   Scroll Reveal
   ========================================= */
(function () {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();

/* =========================================
   Skill Bars (About page)
   ========================================= */
(function () {
  var bars = document.querySelectorAll('.skill-bar-fill');
  if (!bars.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var fill = entry.target;
        fill.style.width = fill.getAttribute('data-width');
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(function (bar) { observer.observe(bar); });
})();

/* =========================================
   Project Filter (Projects page)
   ========================================= */
(function () {
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.project-card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      projectCards.forEach(function (card) {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* =========================================
   Contact Form
   ========================================= */
(function () {
  var form    = document.getElementById('contact-form');
  var success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
      if (typeof form.reportValidity === 'function') form.reportValidity();
      return;
    }

    var btn = form.querySelector('[type="submit"]');
    var originalBtnHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending…';
    }

    var endpoint = form.getAttribute('action');
    var method = (form.getAttribute('method') || 'POST').toUpperCase();
    var payload = new FormData(form);

    fetch(endpoint, {
      method: method,
      body: payload,
      mode: 'no-cors'
    }).then(function () {
      form.reset();
      form.style.display = 'none';
      if (success) success.style.display = 'block';
    }).catch(function (err) {
      console.error('Contact form submission failed:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHtml;
      }
    });
  });
})();

/* =========================================
   Smooth counter (Home stats)
   ========================================= */
(function () {
  var counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el    = entry.target;
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 1200;
      var start  = performance.now();
      observer.unobserve(el);
      requestAnimationFrame(function tick(now) {
        var elapsed = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(tick);
      });
    });
  }, { threshold: 0.5 });

  counters.forEach(function (el) { observer.observe(el); });
})();

/* =========================================
   Typewriter (Home)
   ========================================= */
(function () {
  var el = document.querySelector('.typewriter[data-words]');
  if (!el) return;

  var raw = el.getAttribute('data-words') || '';
  var words;
  try {
    words = JSON.parse(raw);
  } catch (e) {
    words = raw.split(',').map(function (w) { return w.trim(); }).filter(Boolean);
  }
  if (!words || !words.length) return;

  // Prevent the prefix (e.g. "I am") from visually shifting as words type/delete.
  // Use a fixed width based on the longest phrase.
  var longest = words.reduce(function (max, w) {
    return Math.max(max, String(w || '').length);
  }, 0);
  if (longest > 0) {
    el.style.minWidth = longest + 'ch';
    el.style.display = 'inline-block';
    el.style.whiteSpace = 'nowrap';
  }

  var wordIndex = 0;
  var charIndex = 0;
  var direction = 1; // 1 typing, -1 deleting
  var pauseAfterTypedMs = 900;
  var pauseAfterDeletedMs = 250;
  var typeDelayMs = 70;
  var deleteDelayMs = 45;

  function tick() {
    var word = words[wordIndex] || '';
    charIndex += direction;

    if (charIndex < 0) {
      charIndex = 0;
      direction = 1;
      wordIndex = (wordIndex + 1) % words.length;
      window.setTimeout(tick, pauseAfterDeletedMs);
      return;
    }

    el.textContent = word.slice(0, charIndex);

    if (direction === 1 && charIndex >= word.length) {
      direction = -1;
      window.setTimeout(tick, pauseAfterTypedMs);
      return;
    }

    window.setTimeout(tick, direction === 1 ? typeDelayMs : deleteDelayMs);
  }

  tick();
})();
