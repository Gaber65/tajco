/* ==========================================================================
   loader.js — Page loader for Taj Al Sharq United
   ========================================================================== */

const Loader = (() => {
  'use strict';

  let loaderEl = null;

  const init = () => {
    loaderEl = document.querySelector('.page-loader');
    window.addEventListener('load', () => {
      hide();
    });
  };

  const hide = () => {
    if (loaderEl) {
      setTimeout(() => {
        loaderEl.classList.add('is-hidden');
      }, 100);
    }
  };

  const show = () => {
    if (loaderEl) {
      loaderEl.classList.remove('is-hidden');
    }
  };

  return { init, hide, show };
})();
