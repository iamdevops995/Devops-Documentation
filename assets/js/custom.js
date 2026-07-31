/* ==========================================================================
   custom.js — landing page flag, mobile drawer, sidebar footer, table wrap
   Registered as a docsify plugin, so this file must load before docsify.js.
   ========================================================================== */

(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 768;

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  /* --------------------------------------------------- mobile drawer ---- */

  function buildOverlay() {
    if (document.querySelector('.sidebar-overlay')) return;

    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.addEventListener('click', closeDrawer);
    document.body.appendChild(overlay);
  }

  function closeDrawer() {
    document.body.classList.remove('close');
  }

  function wireDrawer() {
    var nav = document.querySelector('.sidebar-nav');
    if (!nav || nav.dataset.drawerWired) return;

    nav.dataset.drawerWired = 'true';
    nav.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('a');
      if (link && isMobile()) closeDrawer();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('close')) {
        closeDrawer();
      }
    });
  }

  /* -------------------------------------------------- sidebar footer ---- */

  function buildSidebarFooter() {
    var sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.sidebar-footer')) return;

    var footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    footer.innerHTML =
      '<span>DevOps Docs</span>' +
      '<a href="https://github.com/iamdevops995/Devops-Documentation" ' +
      'target="_blank" rel="noopener" aria-label="Repository on GitHub">' +
      '<i class="fab fa-github" aria-hidden="true"></i> GitHub</a>';
    sidebar.appendChild(footer);
  }

  /* --------------------------------------------------- content tweaks ---- */

  function wrapTables() {
    var tables = document.querySelectorAll('.markdown-section > table');

    Array.prototype.forEach.call(tables, function (table) {
      var wrap = document.createElement('div');
      wrap.className = 'table-wrap';
      table.parentNode.insertBefore(wrap, table);
      wrap.appendChild(table);
    });
  }

  function markExternalLinks() {
    var links = document.querySelectorAll('.markdown-section a[href^="http"]');

    Array.prototype.forEach.call(links, function (link) {
      if (link.hostname === window.location.hostname) return;
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
  }

  /* -------------------------------------------------------- plugin ---- */

  function plugin(hook, vm) {
    hook.ready(function () {
      buildOverlay();
      buildSidebarFooter();
      wireDrawer();
    });

    hook.doneEach(function () {
      var path = (vm.route && vm.route.path) || '/';
      // Fallback for browsers without :has() support
      document.body.classList.toggle('is-landing', path === '/');

      buildSidebarFooter();
      wireDrawer();
      wrapTables();
      markExternalLinks();

      if (isMobile()) closeDrawer();
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
})();
