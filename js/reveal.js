// Scroll-triggered reveal animations.
// Adds .reveal to every major block, then toggles .is-visible as it enters the viewport.

// Header scroll state (toggles translucent → solid as you scroll past hero)
(function () {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

(function () {
  const SELECTORS = [
    '.hero-content',
    '.intro',
    '.services-section .eyebrow',
    '.services-section h2',
    '.services-section .service',
    '.pricing-section',
    '.gallery-section .eyebrow',
    '.gallery-section h2',
    '.gallery-featured .photo',
    '.footer-grid > div',
  ];

  function init() {
    const els = document.querySelectorAll(SELECTORS.join(','));
    els.forEach((el, i) => {
      el.classList.add('reveal');
      // small per-element stagger so siblings cascade in
      el.style.transitionDelay = (i % 6) * 60 + 'ms';
    });

    if (!('IntersectionObserver' in window)) {
      // Fallback: just show everything
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    els.forEach(el => io.observe(el));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
