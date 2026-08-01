/* ==========================================================================
   theme.js — Dark mode toggle with localStorage persistence
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'devops-docs-theme';
  var DARK = 'dark';
  var LIGHT = 'light';

  /**
   * Get the user's preferred theme from:
   * 1. localStorage (explicit choice)
   * 2. System preference (prefers-color-scheme)
   * 3. Default to light
   */
  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) {
      return stored;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return DARK;
    }
    return LIGHT;
  }

  /**
   * Apply theme to the document
   */
  function applyTheme(theme) {
    if (theme === DARK) {
      document.documentElement.setAttribute('data-theme', DARK);
      if (document.body) {
        document.body.setAttribute('data-theme', DARK);
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (document.body) {
        document.body.removeAttribute('data-theme');
      }
    }
  }

  // Re-apply to body once DOM is ready (for initial page load)
  function ensureBodyTheme() {
    var theme = document.documentElement.getAttribute('data-theme');
    if (theme === DARK && document.body) {
      document.body.setAttribute('data-theme', DARK);
    }
  }

  /**
   * Toggle between light and dark
   */
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    updateToggleButton(next);
    
    // Dispatch event for other scripts to react to theme change
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
  }

  /**
   * Update the toggle button icon
   */
  function updateToggleButton(theme) {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    var sunIcon = btn.querySelector('.fa-sun');
    var moonIcon = btn.querySelector('.fa-moon');

    if (theme === DARK) {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  }

  /**
   * Create the floating toggle button
   */
  function createToggleButton() {
    if (document.querySelector('.theme-toggle')) return;

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.setAttribute('title', 'Toggle dark/light mode');
    btn.innerHTML = '<i class="fas fa-sun" aria-hidden="true"></i>' +
                    '<i class="fas fa-moon" aria-hidden="true"></i>';

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      toggleTheme();
    });

    document.body.appendChild(btn);

    // Set initial icon state
    var currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT;
    updateToggleButton(currentTheme);
  }

  /**
   * Listen for system theme changes
   */
  function watchSystemTheme() {
    if (!window.matchMedia) return;

    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', function (e) {
      // Only auto-switch if user hasn't made an explicit choice
      var stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        var theme = e.matches ? DARK : LIGHT;
        applyTheme(theme);
        updateToggleButton(theme);
      }
    });
  }

  /**
   * Initialize immediately (before DOM ready) to prevent flash
   */
  function initTheme() {
    var theme = getPreferredTheme();
    applyTheme(theme);
  }

  // Apply theme immediately to prevent flash of wrong theme
  initTheme();

  // Create toggle button when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      ensureBodyTheme();
      createToggleButton();
      watchSystemTheme();
    });
  } else {
    ensureBodyTheme();
    createToggleButton();
    watchSystemTheme();
  }

  // Also ensure button exists after docsify navigation
  if (window.$docsify) {
    window.$docsify.plugins = (window.$docsify.plugins || []).concat(function (hook) {
      hook.doneEach(function () {
        createToggleButton();
        var theme = document.documentElement.getAttribute('data-theme') || LIGHT;
        updateToggleButton(theme);
      });
    });
  }

})();
