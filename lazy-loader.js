// runtime helper to apply native lazy loading and decoding
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const imgs = Array.from(document.querySelectorAll('img'));
      imgs.forEach((img, i) => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        if (i < 6 && !img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'high');
      });

      const main = document.getElementById('main-foreground-image');
      if (main) {
        main.setAttribute('loading', 'eager');
        main.setAttribute('fetchpriority', 'high');
      }
    } catch (e) {
      console.warn('lazy-loader.js failed', e);
    }
  });
})();
