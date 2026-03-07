/**
 * Portfolio: year in footer + dynamic writing section + dynamic projects section.
 */
(function () {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // SVG icons
  var githubIcon = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>';
  var externalIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>';

  // Load and render projects section
  function loadProjects() {
    var projectsGrid = document.getElementById('projects-grid');
    if (!projectsGrid) return;

    fetch('data/projects.json')
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to load projects');
        return response.json();
      })
      .then(function(projects) {
        // Filter featured projects and sort by order
        var featuredProjects = projects
          .filter(function(project) { return project.featured; })
          .sort(function(a, b) { return a.order - b.order; });

        projectsGrid.innerHTML = featuredProjects.map(function(project) {
          var links = '';
          if (project.links.github) {
            links += `<a href="${project.links.github}" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">${githubIcon}</a>`;
          }
          if (project.links.live) {
            links += `<a href="${project.links.live}" target="_blank" rel="noopener noreferrer" aria-label="View live site">${externalIcon}</a>`;
          }

          return `
            <article class="project-card">
              <div class="project-card__header">
                <h3 class="project-card__name">${project.name}</h3>
                <div class="project-card__links">
                  ${links}
                </div>
              </div>
              <p class="project-card__description">${project.description}</p>
              <p class="project-card__tech">${project.tech}</p>
            </article>
          `;
        }).join('');
      })
      .catch(function(error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">Unable to load projects at this time.</p>';
      });
  }

  // Load and render writing section
  function loadWritings() {
    var writingList = document.getElementById('writing-list');
    if (!writingList) return;

    fetch('data/writings.json')
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to load writings');
        return response.json();
      })
      .then(function(writings) {
        // Sort by date descending (newest first) and take only first 5
        var sortedWritings = writings
          .sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
          })
          .slice(0, 5);

        writingList.innerHTML = sortedWritings.map(function(writing) {
          return `
            <article class="writing-item" itemscope itemtype="https://schema.org/BlogPosting">
              <time class="writing-item__date" datetime="${writing.date}" itemprop="datePublished">${writing.displayDate}</time>
              <div class="writing-item__content">
                <h3 class="writing-item__title" itemprop="headline">
                  <a href="${writing.url}" target="_blank" rel="noopener noreferrer" itemprop="url">
                    <span itemprop="name">${writing.title}</span>
                    <svg class="writing-item__arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M1 8h14M9 2l6 6-6 6"/>
                    </svg>
                  </a>
                </h3>
                <p class="writing-item__excerpt" itemprop="description">${writing.excerpt}</p>
                <meta itemprop="author" content="Ganesh Kumar Marimuthu">
              </div>
            </article>
          `;
        }).join('');
      })
      .catch(function(error) {
        console.error('Error loading writings:', error);
        writingList.innerHTML = '<p style="color: var(--color-text-muted); text-align: center;">Unable to load articles at this time.</p>';
      });
  }

  // Theme toggle
  var themeToggle = document.querySelector('.theme-toggle');
  function getPreferredTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }
  applyTheme(getPreferredTheme());
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
      // Trigger spin animation
      themeToggle.classList.add('theme-toggle--spin');
      setTimeout(function () { themeToggle.classList.remove('theme-toggle--spin'); }, 400);
    });
  }

  // Initialize
  loadProjects();
  loadWritings();

  // Active nav highlighting via IntersectionObserver
  var sections = document.querySelectorAll('section[id]');
  var navLinksAll = document.querySelectorAll('.nav__list a[href^="#"]');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinksAll.forEach(function (link) { link.classList.remove('nav--active'); });
        var active = document.querySelector('.nav__list a[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('nav--active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  
  sections.forEach(function (s) { observer.observe(s); });

  // Mobile menu toggle
  var navToggle = document.querySelector('.nav__toggle');
  var navList = document.querySelector('.nav__list');
  var navBackdrop = document.querySelector('.nav__backdrop');

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navList.classList.remove('active');
    if (navBackdrop) navBackdrop.classList.remove('active');
  }

  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    navList.classList.add('active');
    if (navBackdrop) navBackdrop.classList.add('active');
  }
  
  if (navToggle && navList) {
    navToggle.addEventListener('click', function() {
      var isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      isExpanded ? closeMenu() : openMenu();
    });
    
    // Close menu when clicking on a link
    var navLinks = navList.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', closeMenu);
    });
    
    // Close menu when clicking backdrop or outside
    if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);
    document.addEventListener('click', function(event) {
      if (!navToggle.contains(event.target) && !navList.contains(event.target)) {
        closeMenu();
      }
    });
  }
})();
