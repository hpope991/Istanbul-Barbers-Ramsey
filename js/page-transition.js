(function () {
  /* Page order — determines slide direction */
  var PAGE_ORDER = {
    'index.html':   0,
    'about.html':   1,
    'shop.html':    2,
    'gallery.html': 3,
    'contact.html': 4
  };

  /* Derive the filename from a full href */
  function filename(href) {
    var parts = href.split('/');
    var f = parts[parts.length - 1] || 'index.html';
    // treat bare "/" or "" as index
    if (f === '' || f === '#') f = 'index.html';
    return f;
  }

  /* Which page are we on right now? */
  function currentPage() {
    return filename(window.location.pathname);
  }

  /* Store the incoming direction so the new page can read it */
  function setIncoming(dir) {
    try { sessionStorage.setItem('pt-incoming', dir); } catch (e) {}
  }
  function getIncoming() {
    try { return sessionStorage.getItem('pt-incoming'); } catch (e) { return null; }
  }
  function clearIncoming() {
    try { sessionStorage.removeItem('pt-incoming'); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body;

    /* ── ENTER animation ── */
    var incoming = getIncoming();
    clearIncoming();

    if (incoming === 'from-right') {
      body.classList.add('pt-enter-from-right');
    } else if (incoming === 'from-left') {
      body.classList.add('pt-enter-from-left');
    }

    /* Remove enter class after animation ends */
    body.addEventListener('animationend', function onEnter(e) {
      if (e.target !== body) return;
      body.classList.remove('pt-enter-from-right', 'pt-enter-from-left');
      body.removeEventListener('animationend', onEnter);
    });

    /* ── Intercept nav link clicks ── */
    var navLinks = document.querySelectorAll('nav a[href]');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var target = filename(link.getAttribute('href'));
        var current = currentPage();

        var fromIndex = PAGE_ORDER[current] !== undefined ? PAGE_ORDER[current] : -1;
        var toIndex   = PAGE_ORDER[target]  !== undefined ? PAGE_ORDER[target]  : -1;

        /* Same page — do nothing */
        if (target === current) return;

        e.preventDefault();

        /* Work out directions */
        var exitClass, incomingDir;
        if (toIndex > fromIndex) {
          /* Moving forward  → exit left, enter from right */
          exitClass   = 'pt-exit-left';
          incomingDir = 'from-right';
        } else {
          /* Moving backward → exit right, enter from left */
          exitClass   = 'pt-exit-right';
          incomingDir = 'from-left';
        }

        setIncoming(incomingDir);
        body.classList.add(exitClass);

        body.addEventListener('animationend', function onExit(ev) {
          if (ev.target !== body) return;
          body.removeEventListener('animationend', onExit);
          window.location.href = link.getAttribute('href');
        });
      });
    });
  });
})();
