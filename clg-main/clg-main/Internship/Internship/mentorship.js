document.addEventListener('DOMContentLoaded', () => {
  initPageLoadAnimation();
  initHeroSlider();
  initScrollReveal();
  initParallax();
  initTagInput();
  initFormInteractions();
  initMentorCards();
  initSmoothScroll();
});

/**
 * Level 1 — Page Load Animations
 */
function initPageLoadAnimation() {
  const heading = document.getElementById('hero-heading');
  const subtitle = document.getElementById('hero-subtitle');
  const buttons = document.getElementById('hero-buttons');
  const visual = document.getElementById('hero-visual');
  
  const springEase = 'cubic-bezier(0.22, 1, 0.36, 1)';
  
  if(heading) {
    heading.style.opacity = '0';
    heading.style.transform = 'translateX(-60px)';
  }
  if(subtitle) {
    subtitle.style.opacity = '0';
    subtitle.style.transform = 'translateY(20px)';
  }
  if(buttons) {
    buttons.style.opacity = '0';
    buttons.style.transform = 'scale(0.9)';
  }
  if(visual) {
    visual.style.opacity = '0';
    visual.style.transform = 'translateY(40px)';
  }
  
  // Animate in sequence
  setTimeout(() => {
    if(heading) {
      heading.style.transition = `all 0.8s ${springEase}`;
      heading.style.opacity = '1';
      heading.style.transform = 'translateX(0)';
      heading.classList.remove('load-hidden');
    }
    
    setTimeout(() => {
      if(subtitle) {
        subtitle.style.transition = `all 0.8s ${springEase}`;
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
        subtitle.classList.remove('load-hidden');
      }
    }, 150);
    
    setTimeout(() => {
      if(buttons) {
        buttons.style.transition = `all 0.8s ${springEase}`;
        buttons.style.opacity = '1';
        buttons.style.transform = 'scale(1)';
        buttons.classList.remove('load-hidden');
      }
    }, 300);
    
    setTimeout(() => {
      if(visual) {
        visual.style.transition = `all 1s ${springEase}`;
        visual.style.opacity = '1';
        visual.style.transform = 'translateY(0)';
        visual.classList.remove('load-hidden');
      }
    }, 450);
    
  }, 100);
}

/**
 * Level 2 — Scroll Reveal (Intersection Observer)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };
  
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('stagger-1')) {
          entry.target.style.animationDelay = '0.1s';
        } else if (entry.target.classList.contains('stagger-2')) {
          entry.target.style.animationDelay = '0.2s';
        } else if (entry.target.classList.contains('stagger-3')) {
          entry.target.style.animationDelay = '0.3s';
        }
        
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  revealElements.forEach(el => observer.observe(el));
  
  if (timelineProgress && timelineItems.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(timelineItems).indexOf(entry.target);
          const total = timelineItems.length;
          const percentage = ((index + 1) / total) * 100;
          timelineProgress.style.height = `${percentage}%`;
        }
      });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => timelineObserver.observe(item));
  }
}

/**
 * Level 4 — Hero Animation (Auto Crossfade)
 */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-bg');
  if (slides.length <= 1) return;
  
  let currentSlide = 0;
  
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 2000); 
}

/**
 * Level 5 — Parallax 
 */
function initParallax() {
  const parallaxContainers = document.querySelectorAll('[data-parallax="true"]');
  const visualElement = document.querySelector('.hero-glass-element');
  
  if (!parallaxContainers.length || !visualElement) return;
  
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    const shiftX = (x - 0.5) * 20; 
    const shiftY = (y - 0.5) * 20;
    
    requestAnimationFrame(() => {
      visualElement.style.transform = `translate(calc(-50% + ${shiftX}px), calc(-50% + ${shiftY}px))`;
    });
  });
}

/**
 * Tag Input Logic
 */
function initTagInput() {
  const container = document.getElementById('expertise-tags-container');
  const input = document.getElementById('expertise-input');
  if (!container || !input) return;
  
  let tags = [];
  
  function renderTags() {
    // Remove all current pills
    const pills = container.querySelectorAll('.tag-pill');
    pills.forEach(pill => pill.remove());
    
    // Add new pills before input
    tags.forEach((tag, index) => {
      const pill = document.createElement('div');
      pill.className = 'tag-pill';
      pill.innerHTML = `
        ${tag}
        <button type="button" data-index="${index}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      `;
      container.insertBefore(pill, input);
    });
    
    // Attach remove logic
    const removeBtns = container.querySelectorAll('.tag-pill button');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        tags.splice(idx, 1);
        renderTags();
      });
    });
  }
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value.trim();
      if (val && !tags.includes(val)) {
        tags.push(val);
        input.value = '';
        renderTags();
      }
    } else if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
      tags.pop();
      renderTags();
    }
  });

  input.addEventListener('focus', () => {
    container.classList.add('focused');
  });

  input.addEventListener('blur', () => {
    container.classList.remove('focused');
    // Add tag on blur if there's text
    const val = input.value.trim();
    if (val && !tags.includes(val)) {
      tags.push(val);
      input.value = '';
      renderTags();
    }
  });
  
  container.addEventListener('click', () => {
    input.focus();
  });
}

/**
 * Form Functionality & Micro-Interactions
 */
function initFormInteractions() {
  const form = document.getElementById('mentorship-form');
  const successState = document.getElementById('form-success');
  const resetButton = document.getElementById('reset-form');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // check tags count
    const container = document.getElementById('expertise-tags-container');
    const pills = container.querySelectorAll('.tag-pill');
    if (pills.length === 0) {
      alert("Please press Enter to add at least one area of expertise.");
      document.getElementById('expertise-input').focus();
      return;
    }
    
    // Validated format, show success
    successState.classList.add('active');
  });
  
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      form.reset();
      
      // Reset tags
      const container = document.getElementById('expertise-tags-container');
      const pills = container.querySelectorAll('.tag-pill');
      pills.forEach(pill => pill.remove());
      
      successState.classList.remove('active');
    });
  }
}

/**
 * Mentor Cards Rendering
 */
function initMentorCards() {
  const mentorListContainer = document.getElementById('mentors-grid');
  const emptyState = document.getElementById('mentors-empty');
  if(!mentorListContainer) return;

  // Static Data
  const mentors = [
    {
      name: "Sarah Jenkins",
      company: "Google",
      role: "Senior UX Designer",
      exp: "8 Years",
      tags: ["UX Research", "Figma", "Prototyping"],
      bio: "Passionate about helping young designers build portfolios that stand out in big tech."
    },
    {
      name: "David Chen",
      company: "Stripe",
      role: "Staff Software Engineer",
      exp: "12 Years",
      tags: ["System Design", "React", "Node.js"],
      bio: "Available for technical interview prep and career progression advice for engineers."
    },
    {
      name: "Elena Rodriguez",
      company: "McKinsey",
      role: "Engagement Manager",
      exp: "6 Years",
      tags: ["Consulting", "Strategy", "Leadership"],
      bio: "I guide students aiming to break into management consulting and case interviews."
    }
  ];

  // Set mentors = [] to test empty state
  // const mentors = [];

  if (mentors.length === 0) {
    mentorListContainer.style.display = 'none';
    if(emptyState) emptyState.style.display = 'flex';
  } else {
    mentorListContainer.style.display = 'grid';
    if(emptyState) emptyState.style.display = 'none';

    mentorListContainer.innerHTML = mentors.map((mentor, i) => `
      <div class="glass-card reveal stagger-${(i % 3) + 1} job-card">
        <div class="job-card-header">
          <div>
            <h3 class="job-title">${mentor.name}</h3>
            <div class="job-company">${mentor.role} at ${mentor.company}</div>
          </div>
        </div>
        <div class="job-meta">
          <div class="job-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            ${mentor.exp} Experience
          </div>
        </div>
        <div class="job-skills">
          ${mentor.tags.map(tag => `<span class="job-skill-pill">${tag}</span>`).join('')}
        </div>
        <p class="job-description" style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px;">
          ${mentor.bio}
        </p>
        <button class="btn btn-outline" style="width: 100%; padding: 12px; font-size: 0.95rem;">Book Session</button>
      </div>
    `).join('');
  }
}

/**
 * Smooth Scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        let offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}
