/* ==========================================================================
   search.js — keyboard shortcuts and hint badge for the sidebar search
   Registered as a docsify plugin, so this file must load before docsify.js.
   ========================================================================== */

(function () {
  'use strict';

  function getInput() {
    return document.querySelector('.sidebar .search input[type="search"]');
  }

  var isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || '');

  /* Small "Ctrl K" badge inside the field */
  function addHint() {
    var wrap = document.querySelector('.sidebar .search .input-wrap');
    if (!wrap || wrap.querySelector('.search-kbd')) return;

    var kbd = document.createElement('span');
    kbd.className = 'search-kbd';
    kbd.setAttribute('aria-hidden', 'true');
    kbd.textContent = isMac ? '⌘K' : 'Ctrl K';
    wrap.appendChild(kbd);
  }

  function focusSearch() {
    var input = getInput();
    if (!input) return;

    // Make sure the drawer is open on small screens
    if (window.innerWidth <= 768) {
      document.body.classList.add('close');
    }

    input.focus();
    input.select();
  }

  function isTypingTarget(el) {
    if (!el) return false;
    var tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
           el.isContentEditable;
  }

  function wireShortcuts() {
    if (document.documentElement.dataset.searchShortcuts) return;
    document.documentElement.dataset.searchShortcuts = 'true';

    document.addEventListener('keydown', function (e) {
      var input = getInput();

      // Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        focusSearch();
        return;
      }

      // "/" when not already typing
      if (e.key === '/' && !isTypingTarget(document.activeElement)) {
        e.preventDefault();
        focusSearch();
        return;
      }

      // Escape clears and releases the field
      if (e.key === 'Escape' && input && document.activeElement === input) {
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.blur();
      }
    });
  }

  function updatePlaceholder() {
    var input = getInput();
    if (!input) return;
    input.setAttribute('aria-label', 'Search documentation');
  }

  function plugin(hook) {
    hook.ready(function () {
      addHint();
      wireShortcuts();
      updatePlaceholder();
    });

    hook.doneEach(function () {
      addHint();
      updatePlaceholder();
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
})();
