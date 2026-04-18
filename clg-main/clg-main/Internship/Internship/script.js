/**
 * Alumni Contribution Portal
 * Motion Design & Interaction System
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoadAnimation();
  initHeroSlider();
  initScrollReveal();
  initParallax();
  initFormInteractions();
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
  
  // Set initial states
  heading.style.opacity = '0';
  heading.style.transform = 'translateX(-60px)';
  
  subtitle.style.opacity = '0';
  subtitle.style.transform = 'translateY(20px)';
  
  buttons.style.opacity = '0';
  buttons.style.transform = 'scale(0.9)';
  
  visual.style.opacity = '0';
  visual.style.transform = 'translateY(40px)';
  
  // Animate in sequence
  setTimeout(() => {
    // Heading
    heading.style.transition = `all 0.8s ${springEase}`;
    heading.style.opacity = '1';
    heading.style.transform = 'translateX(0)';
    heading.classList.remove('load-hidden');
    
    // Subtitle
    setTimeout(() => {
      subtitle.style.transition = `all 0.8s ${springEase}`;
      subtitle.style.opacity = '1';
      subtitle.style.transform = 'translateY(0)';
      subtitle.classList.remove('load-hidden');
    }, 150);
    
    // Buttons
    setTimeout(() => {
      buttons.style.transition = `all 0.8s ${springEase}`;
      buttons.style.opacity = '1';
      buttons.style.transform = 'scale(1)';
      buttons.classList.remove('load-hidden');
    }, 300);
    
    // Visual
    setTimeout(() => {
      visual.style.transition = `all 1s ${springEase}`;
      visual.style.opacity = '1';
      visual.style.transform = 'translateY(0)';
      visual.classList.remove('load-hidden');
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
        
        // Handle stagger delays
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
  
  // Custom Timeline Scroll Observer
  if (timelineProgress && timelineItems.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(timelineItems).indexOf(entry.target);
          const total = timelineItems.length;
          // Calculate percentage height
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
    // Fade out current slide
    slides[currentSlide].classList.remove('active');
    
    // Move to next slide
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Fade in next slide
    slides[currentSlide].classList.add('active');
  }, 4000); // Wait 2s on slide, 1.5s transition
}

/**
 * Level 5 — Parallax 
 * Mouse-based movement max 10px shift
 */
function initParallax() {
  const parallaxContainers = document.querySelectorAll('[data-parallax="true"]');
  const visualElement = document.querySelector('.hero-glass-element');
  
  if (!parallaxContainers.length || !visualElement) return;
  
  document.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    // Max 10px shift (-5px to 5px)
    const shiftX = (x - 0.5) * 20; 
    const shiftY = (y - 0.5) * 20;
    
    // Apply to visual element with requestAnimationFrame for performance
    requestAnimationFrame(() => {
      visualElement.style.transform = `translate(calc(-50% + ${shiftX}px), calc(-50% + ${shiftY}px))`;
    });
  });
}

/**
 * Form Functionality & Micro-Interactions
 */
function initFormInteractions() {
  const form = document.getElementById('donation-form');
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customAmountInput = document.getElementById('custom-amount');
  const successState = document.getElementById('donation-success');
  const resetButton = document.getElementById('reset-form');
  
  if (!form) return;
  
  // Amount selection
  amountBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove selected class from all
      amountBtns.forEach(b => b.classList.remove('selected'));
      // Add to clicked
      btn.classList.add('selected');
      
      // Handle custom amount toggle
      if (btn.dataset.value === 'custom') {
        customAmountInput.style.display = 'block';
        customAmountInput.focus();
        customAmountInput.required = true;
      } else {
        customAmountInput.style.display = 'none';
        customAmountInput.required = false;
        customAmountInput.value = '';
      }
    });
  });
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple validation
    const email = document.getElementById('email').value;
    const firstName = document.getElementById('firstName').value;
    const fundId = document.getElementById('fundId').value;
    
    let amount = parseFloat(customAmountInput.value);
    if (customAmountInput.style.display === 'none') {
      const selectedBtn = document.querySelector('.amount-btn.selected');
      if (selectedBtn) {
        amount = parseFloat(selectedBtn.dataset.value);
      }
    }
    
    if (firstName && email && amount > 0 && fundId) {
      // Show success animation
      successState.classList.add('active');
    } else {
      alert("Please ensure all fields including amount are filled correctly.");
    }
  });
  
  // Reset form
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      form.reset();
      
      // Reset amount selection to default
      amountBtns.forEach(b => b.classList.remove('selected'));
      amountBtns[0].classList.add('selected');
      customAmountInput.style.display = 'none';
      
      // Hide success state
      successState.classList.remove('active');
    });
  }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        let offsetTop = targetElement.getBoundingClientRect().top + window.scrollY;
        
        // Offset for fixed header
        offsetTop -= 80;
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}
