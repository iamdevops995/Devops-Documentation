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

  /* -------------------------------------------------- user profile bar ---- */

  function buildUserProfile() {
    if (document.querySelector('.user-profile-bar')) return;

    var userName = localStorage.getItem('userName') || '';
    var userEmail = localStorage.getItem('userEmail') || '';
    var userPhoto = localStorage.getItem('userPhoto') || '';
    
    if (!userEmail) return; // Not logged in

    var displayName = userName || userEmail.split('@')[0];
    var initials = displayName.charAt(0).toUpperCase();

    var profileBar = document.createElement('div');
    profileBar.className = 'user-profile-bar';
    
    var avatarHtml = userPhoto 
      ? '<img src="' + userPhoto + '" alt="' + displayName + '" class="user-avatar">'
      : '<div class="user-avatar user-avatar-initials">' + initials + '</div>';

    profileBar.innerHTML = 
      '<div class="user-profile-content">' +
        avatarHtml +
        '<div class="user-info">' +
          '<span class="user-name">' + displayName + '</span>' +
          '<span class="user-email">' + userEmail + '</span>' +
        '</div>' +
        '<button class="btn-signout" onclick="window.firebaseSignOut ? window.firebaseSignOut() : (localStorage.clear(), location.href=\'login.html\')" title="Sign out">' +
          '<i class="fas fa-sign-out-alt"></i>' +
          '<span>Sign Out</span>' +
        '</button>' +
      '</div>';

    // Insert at top of sidebar
    var sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      var searchEl = sidebar.querySelector('.search');
      if (searchEl) {
        sidebar.insertBefore(profileBar, searchEl);
      } else {
        sidebar.insertBefore(profileBar, sidebar.firstChild);
      }
    }
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
      buildUserProfile();
      wireDrawer();
    });

    hook.doneEach(function () {
      var path = (vm.route && vm.route.path) || '/';
      // Fallback for browsers without :has() support
      document.body.classList.toggle('is-landing', path === '/');

      buildSidebarFooter();
      buildUserProfile();
      wireDrawer();
      wrapTables();
      markExternalLinks();

      if (isMobile()) closeDrawer();
    });
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [plugin].concat(window.$docsify.plugins || []);
})();
