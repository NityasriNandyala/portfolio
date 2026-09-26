/**
 * NANDYALA NITYA SRI - PORTFOLIO INTERACTIVITY & LOGIC
 * Features:
 *  - Theme switcher (Dark Mode default & Light Mode toggle with LocalStorage persistence)
 *  - Sticky & floating pill navbar
 *  - Mobile navigation drawer toggle & auto-close
 *  - Scroll spy for active section highlight
 *  - Dynamic typing role rotator
 *  - Project category filtering
 *  - Contact form validation with mailto fallback
 *  - Copy-to-clipboard toast notifications
 *  - Smooth back-to-top floating button
 *  - IntersectionObserver scroll reveal animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initStickyHeader();
  initMobileNav();
  initScrollSpy();
  initTypingRole();
  initProjectFilter();
  initContactForm();
  initCopyButtons();
  initBackToTop();
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Theme Management (Dark Mode First + Light Mode Toggle)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');

  // Moon SVG (representing dark mode / night)
  const moonIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  
  // Sun SVG (representing light mode / daylight)
  const sunIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  // Check saved theme or default to dark
  const savedTheme = localStorage.getItem('nitya_theme') || 'dark';
  applyTheme(savedTheme);

  function toggle() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('nitya_theme', nextTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggle);
  }

  if (themeToggleMobileBtn) {
    themeToggleMobileBtn.addEventListener('click', toggle);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // In dark mode: display moon icon (matching reference UI); in light mode: display sun icon
    const icon = theme === 'dark' ? moonIcon : sunIcon;
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = icon;
      themeToggleBtn.setAttribute('aria-label', label);
      themeToggleBtn.setAttribute('title', label);
    }

    if (themeToggleMobileBtn) {
      themeToggleMobileBtn.innerHTML = `${icon} <span>${theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>`;
      themeToggleMobileBtn.setAttribute('aria-label', label);
      themeToggleMobileBtn.setAttribute('title', label);
    }
  }
}

/* --------------------------------------------------------------------------
   2. Floating Pill Header State on Scroll
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.getElementById('site-header') || document.querySelector('.floating-nav-wrapper');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!hamburger || !mobileNav) return;

  const toggleNav = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', shouldOpen);
    hamburger.classList.toggle('active', shouldOpen);
    hamburger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggleNav());

  // Close when clicking any mobile drawer link
  const mobileLinks = mobileNav.querySelectorAll('.mobile-drawer-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleNav(false));
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleNav(false);
    }
  });

  // Close on click outside mobile drawer
  document.addEventListener('click', (e) => {
    if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
      toggleNav(false);
    }
  });
}

/* --------------------------------------------------------------------------
   4. Scroll Spy (Active Navigation Links)
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-pill-link');
  const mobileLinks = document.querySelectorAll('.mobile-drawer-link');

  if (!sections.length) return;

  const onScroll = () => {
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        mobileLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   5. Dynamic Hero Headline Role Rotator (Typewriter Effect)
   -------------------------------------------------------------------------- */
function initTypingRole() {
  const targetElement = document.getElementById('typing-role');
  if (!targetElement) return;

  const roles = [
    'Java Developer | ServiceNow Developer | AI/ML Enthusiast',
    'Software Developer | Java | Spring Boot | ServiceNow',
    'Java Developer | Spring Boot | REST APIs',
    'ServiceNow Developer | CSA & CAD Certified',
    'AI & Machine Learning Software Engineer'
  ];

  // Start with first full role visible for immediate clarity & SEO
  let currentRoleIdx = 0;
  let charIdx = roles[0].length;
  targetElement.textContent = roles[0];
  let isDeleting = true;
  let typingSpeed = 3000;

  function typeEffect() {
    const currentText = roles[currentRoleIdx];

    if (isDeleting) {
      charIdx--;
      targetElement.textContent = currentText.substring(0, charIdx);
      typingSpeed = 28;
    } else {
      charIdx++;
      targetElement.textContent = currentText.substring(0, charIdx);
      typingSpeed = 60;
    }

    if (!isDeleting && charIdx === currentText.length) {
      typingSpeed = 3400; // Pause when string is fully typed
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing next title
    }

    setTimeout(typeEffect, typingSpeed);
  }

  // Delay first erase animation cycle by 3.5s so user reads the recommended title first
  setTimeout(typeEffect, 3500);
}

/* --------------------------------------------------------------------------
   6. Projects Filter Tabs (Optional Filtering Support)
   -------------------------------------------------------------------------- */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-minimal-card, .project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   7. Contact Form Handling & Direct Emailing
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  if (!form || !statusBox) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.elements['name']?.value.trim();
    const email = form.elements['email']?.value.trim();
    const subject = form.elements['subject']?.value.trim();
    const message = form.elements['message']?.value.trim();

    if (!name || !email || !subject || !message) {
      showStatus('Please fill out all fields before submitting.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Compose direct mailto link to Nitya Sri's verified email address
    const mailtoUrl = `mailto:nandyalanityasri99@gmail.com?subject=${encodeURIComponent(
      `[Portfolio Inquiry] ${subject} - from ${name}`
    )}&body=${encodeURIComponent(
      `Hi Nitya,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;

    showStatus('Opening your email client with the message pre-filled. Thank you!', 'success');

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 700);

    form.reset();
  });

  function showStatus(text, type) {
    statusBox.textContent = text;
    statusBox.className = `form-status ${type}`;
    statusBox.style.display = 'block';

    setTimeout(() => {
      statusBox.style.display = 'none';
    }, 6000);
  }
}

/* --------------------------------------------------------------------------
   8. Copy to Clipboard with Toast Notification
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied: ${textToCopy}`);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* --------------------------------------------------------------------------
   9. Back to Top Floating Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   10. Scroll Reveal Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.tech-item, .project-minimal-card, .exp-card, .edu-card, .skill-card, .about-box, .contact-card-wrap'
  );

  if (!targets.length) return;

  // Add base class for animation
  targets.forEach(el => el.classList.add('reveal-item'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    targets.forEach(el => observer.observe(el));
  } else {
    targets.forEach(el => el.classList.add('revealed'));
  }
}
