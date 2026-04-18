/* ═══════ SUPABASE CONFIG ═══════ */
// ⚠️ IMPORTANT: Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://qwblgbldfwtrhnargesx.supabase.co';       // e.g. 'https://xyzcompany.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3YmxnYmxkZnd0cmhuYXJnZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDI1NTMsImV4cCI6MjA5MDUxODU1M30.Jmpl3aX8_D9BE7O1vLrqzQ1yBoZtxwfb6boaPJwkHr4'; // e.g. 'eyJhbGciOi...'

let supabaseClient = null;

function initSupabase() {
  if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase connected');
  } else {
    console.warn('⚠️ Supabase not configured — form will simulate submission');
  }
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  initScrollProgress();
  initNavbar();
  initNavActive();
  initHeroEntrance();
  initMorphText();
  initScrollReveal();
  initHeroParallax();
  initHeroCarousel();
  init3DTilt();
  initProcessSection();
  initForm();
  initSmoothScroll();
  initRipple();
  initAboutParallax();
  initAboutFadeIn();
  initMentorCarousel();
});

/* ═══════ SCROLL PROGRESS BAR ═══════ */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });
}

/* ═══════ GLASS NAVBAR ═══════ */
function initNavbar() {
  const nav = document.getElementById('glassNav');
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('navMenu');

  // Skip if elements don't exist (institutional navbar replaces glass-nav)
  if (!nav || !burger || !menu) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link, .nav-cta').forEach(a => {
    a.addEventListener('click', () => {
      burger.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

/* ═══════ SECTION ACTIVE HIGHLIGHT ═══════ */
function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[data-section]');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => obs.observe(s));
}

/* ═══════ HERO ENTRANCE (blur + slide) ═══════ */
function initHeroEntrance() {
  document.querySelectorAll('.anim-ent').forEach(el => {
    const d = parseInt(el.dataset.d || 0, 10);
    setTimeout(() => el.classList.add('anim-go'), 350 + d);
  });
}

/* ═══════ SCROLL REVEAL (re-triggers on scroll) ═══════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.r-el');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const parent = e.target.parentElement;
        const siblings = parent ? [...parent.querySelectorAll(':scope > .r-el')] : [e.target];
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add('revealed'), idx * 100);
      } else {
        e.target.classList.remove('revealed');
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  els.forEach(el => obs.observe(el));
}

/* ═══════ HERO PARALLAX ═══════ */
function initHeroParallax() {
  const bgWrap = document.getElementById('heroBgWrap');
  const hero = document.getElementById('hero');
  if (!bgWrap || !hero) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;
  const max = 12, lerp = 0.05;

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    tx = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * max;
    ty = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * max;
  });

  hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

  (function loop() {
    cx += (tx - cx) * lerp;
    cy += (ty - cy) * lerp;
    bgWrap.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ═══════ 3D TILT SYSTEM ═══════ */
function init3DTilt() {
  /* Skip on touch / small screens */
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    /* Find the inner element that should transform */
    const target = card.querySelector('.hero-card-inner') || card;

    let tx = 0, ty = 0, cx = 0, cy = 0;
    const maxTilt = 8; /* degrees */
    const lerp = 0.08;
    let raf = null;
    let active = false;

    function animate() {
      cx += (tx - cx) * lerp;
      cy += (ty - cy) * lerp;

      target.style.transform = `rotateX(${-cy}deg) rotateY(${cx}deg) scale3d(1.03, 1.03, 1.03)`;

      if (active || Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
        raf = requestAnimationFrame(animate);
      } else {
        target.style.transform = '';
      }
    }

    card.addEventListener('mouseenter', () => {
      active = true;
      if (!raf) raf = requestAnimationFrame(animate);
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      tx = nx * maxTilt;
      ty = ny * maxTilt;
    });

    card.addEventListener('mouseleave', () => {
      active = false;
      tx = 0;
      ty = 0;
      /* Continue animation to smoothly return to 0 */
      if (!raf) raf = requestAnimationFrame(animate);
    });
  });
}

/* ═══════ PROCESS SECTION ═══════ */
function initProcessSection() {
  const section = document.getElementById('process');
  if (!section) return;

  initProcHeaderReveal();
  initProcTimeline();
  initProcFormReveal();
}

/* ── Header Word Reveal ── */
function initProcHeaderReveal() {
  const words = document.querySelectorAll('.proc-word');
  const subtitle = document.querySelector('.proc-subtitle');
  const progress = document.getElementById('procProgressWrap');
  if (!words.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('proc-word-visible'), i * 180);
        });
        if (subtitle) setTimeout(() => subtitle.classList.add('proc-visible'), words.length * 180 + 100);
        if (progress) setTimeout(() => progress.classList.add('proc-visible'), words.length * 180 + 300);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  obs.observe(words[0].parentElement);
}

/* ── Timeline Scroll Animation ── */
function initProcTimeline() {
  const timeline = document.getElementById('procTimeline');
  const fillLine = document.getElementById('procTlFill');
  const progressFill = document.getElementById('procProgressFill');
  const progressLabel = document.getElementById('procProgressLabel');
  const steps = document.querySelectorAll('.proc-step');
  if (!timeline || !steps.length) return;

  const totalSteps = steps.length;

  /* Staggered step reveal */
  const stepObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('proc-step-visible');
        stepObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.15 });

  steps.forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.08}s`;
    stepObs.observe(step);
  });

  /* Scroll-driven timeline fill + active step */
  let ticking = false;

  function updateTimeline() {
    const rect = timeline.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.top < windowH && rect.bottom > 0) {
      const totalH = rect.height;
      const scrolled = Math.max(0, windowH * 0.5 - rect.top);
      const pct = Math.min(scrolled / totalH, 1);

      if (fillLine) {
        fillLine.style.height = (pct * 100) + '%';
      }

      /* Find active step */
      let activeIdx = 0;
      steps.forEach((step, i) => {
        const stepRect = step.getBoundingClientRect();
        const stepMid = stepRect.top + stepRect.height * 0.4;

        if (stepMid < windowH * 0.55) {
          activeIdx = i;
          step.classList.add('proc-step-active');
        } else {
          step.classList.remove('proc-step-active');
        }
      });

      /* Update progress */
      if (progressFill) {
        progressFill.style.width = ((activeIdx + 1) / totalSteps * 100) + '%';
      }
      if (progressLabel) {
        progressLabel.textContent = `Step ${activeIdx + 1} of ${totalSteps}`;
      }
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateTimeline);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateTimeline();
}

/* ── Form Panel Reveal ── */
function initProcFormReveal() {
  const panel = document.getElementById('procFormPanel');
  if (!panel) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        panel.classList.add('proc-form-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  obs.observe(panel);
}

/* ═══════ FORM WITH SUPABASE ═══════ */
function initForm() {
  const form = document.getElementById('mentorForm');
  const ok = document.getElementById('formOk');
  const errorEl = document.getElementById('formError');
  const btn = document.getElementById('submitBtn');
  if (!form) return;

  /* Real-time validation */
  const inputs = form.querySelectorAll('.pf-input[required]');
  inputs.forEach(inp => {
    inp.addEventListener('blur', () => {
      if (inp.value.trim()) {
        inp.classList.remove('pf-error');
        inp.classList.add('pf-valid');
      } else {
        inp.classList.remove('pf-valid');
      }
    });

    inp.addEventListener('input', () => {
      if (inp.classList.contains('pf-error') && inp.value.trim()) {
        inp.classList.remove('pf-error');
        inp.classList.add('pf-valid');
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    /* Hide previous error */
    if (errorEl) errorEl.classList.remove('visible');

    inputs.forEach(inp => {
      if (!inp.value.trim()) {
        valid = false;
        inp.classList.remove('pf-valid');
        inp.classList.add('pf-error');
      }
    });

    if (!valid) return;

    btn.disabled = true;
    const lab = document.getElementById('submitText');
    if (lab) lab.textContent = 'Submitting...';

    /* Gather form data */
    const formData = {
      full_name: document.getElementById('fName').value.trim(),
      email: document.getElementById('fEmail').value.trim(),
      graduation_year: parseInt(document.getElementById('fYear').value, 10),
      phone: document.getElementById('fPhone').value.trim() || null,
      expertise: document.getElementById('fExpertise').value,
      availability: document.getElementById('fAvailability').value,
      company: document.getElementById('fCompany').value.trim() || null,
      designation: document.getElementById('fDesignation').value.trim() || null,
      linkedin: document.getElementById('fLinkedin').value.trim() || null,
      message: document.getElementById('fMsg').value.trim() || null,
      submitted_at: new Date().toISOString()
    };

    try {
      if (supabaseClient) {
        /* ── Submit to Supabase ── */
        const { data, error } = await supabaseClient
          .from('mentor_applications')
          .insert([formData]);

        if (error) {
          throw new Error(error.message);
        }

        console.log('✅ Submitted to Supabase:', data);
      } else {
        /* ── Simulate submission when Supabase not configured ── */
        console.log('📋 Form data (Supabase not configured):', formData);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      /* Show success */
      const fields = form.querySelectorAll('.pf-row, .pf-group, .pf-submit, .pf-trust');
      fields.forEach(f => {
        f.style.opacity = '0';
        f.style.transform = 'translateY(-8px)';
        f.style.transition = 'opacity .3s, transform .3s';
      });
      setTimeout(() => {
        fields.forEach(f => f.style.display = 'none');
        ok.classList.add('visible');
      }, 350);

    } catch (err) {
      console.error('❌ Submission error:', err);
      btn.disabled = false;
      if (lab) lab.textContent = 'Submit Application';
      if (errorEl) {
        errorEl.textContent = 'Something went wrong: ' + err.message + '. Please try again.';
        errorEl.classList.add('visible');
      }
    }
  });
}

/* ═══════ SMOOTH SCROLL ═══════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const t = document.querySelector(href);
      if (!t) return;
      const navEl = document.getElementById('glassNav') || document.querySelector('.inst-header');
      const off = navEl ? navEl.offsetHeight : 80;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off - 12, behavior: 'smooth' });
    });
  });
}

/* ═══════ RIPPLE EFFECT ═══════ */
function initRipple() {
  /* Inject positional CSS for ripple */
  const s = document.createElement('style');
  s.textContent = `.btn-ripple::after{left:var(--rx,50%);top:var(--ry,50%)}`;
  document.head.appendChild(s);

  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const r = this.getBoundingClientRect();
      this.style.setProperty('--rx', (e.clientX - r.left) + 'px');
      this.style.setProperty('--ry', (e.clientY - r.top) + 'px');
      this.classList.remove('rippling');
      void this.offsetWidth;
      this.classList.add('rippling');
      setTimeout(() => this.classList.remove('rippling'), 600);
    });
  });
}

/* ═══════ HERO IMAGE CAROUSEL ═══════ */
function initHeroCarousel() {
  const images = document.querySelectorAll('.carousel-img');
  const captionLabel = document.getElementById('captionLabel');

  if (!images.length || !captionLabel) return;

  const captions = ['Campus Grounds', 'Vibrant Ecosystem', 'Serene Environment'];
  let current = 0;
  const interval = 3000;

  setInterval(() => {
    /* Fade out current */
    images[current].classList.remove('active');

    /* Fade caption */
    captionLabel.style.opacity = '0';

    /* Move to next */
    current = (current + 1) % images.length;

    /* Small delay for crossfade feel */
    setTimeout(() => {
      images[current].classList.add('active');
      captionLabel.textContent = captions[current];
      captionLabel.style.opacity = '1';
    }, 200);
  }, interval);
}

/* ═══════ MULTILINGUAL MORPH TEXT ═══════ */
function initMorphText() {
  const wordEl = document.getElementById('heroMorphWord');
  if (!wordEl) return;

  const words = [
    'Mentor.',          // English
    'मार्गदर्शक.',       // Hindi
    'வழிகாட்டி.',        // Tamil
    'మార్గదర్శి.',       // Telugu
    'മാർഗദർശി.',        // Malayalam
    'ಮಾರ್ಗದರ್ಶಕ.',       // Kannada
    'পথপ্রদর্শক.',       // Bengali
    'ମାର୍ଗଦର୍ଶକ.',      // Odia
    'मार्गदर्शक.',       // Marathi
    'માર્ગદર્શક.',       // Gujarati
    'ਮਾਰਗਦਰਸ਼ਕ.',       // Punjabi
  ];

  let current = 0;
  const INTERVAL = 1500;

  setInterval(() => {
    /* Exit animation */
    wordEl.classList.remove('active');
    wordEl.classList.add('exit');

    setTimeout(() => {
      /* Update text */
      current = (current + 1) % words.length;
      wordEl.textContent = words[current];

      /* Reset position for enter */
      wordEl.classList.remove('exit');

      /* Force reflow for smooth re-trigger */
      void wordEl.offsetWidth;

      /* Enter animation */
      wordEl.classList.add('active');
    }, 400);
  }, INTERVAL);
}

/* ═══════ ABOUT SECTION PARALLAX + BG FADE ═══════ */
function initAboutParallax() {
  const bgWrap = document.getElementById('aboutBgWrap');
  const aboutSec = document.getElementById('about');
  if (!bgWrap || !aboutSec) return;

  const speed = 0.4;
  let currentOpacity = 0;
  let targetOpacity = 0;
  const lerpFactor = 0.06;

  function update() {
    const rect = aboutSec.getBoundingClientRect();
    const windowH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < windowH) {
      const scrolled = (windowH - rect.top) / (windowH + rect.height);
      const offset = (scrolled - 0.5) * rect.height * speed;
      bgWrap.style.transform = `translate3d(0, ${offset}px, 0)`;

      if (scrolled < 0.2) {
        targetOpacity = scrolled / 0.2;
      } else if (scrolled > 0.8) {
        targetOpacity = (1 - scrolled) / 0.2;
      } else {
        targetOpacity = 1;
      }
      targetOpacity = Math.max(0, Math.min(1, targetOpacity));
    } else {
      targetOpacity = 0;
    }

    currentOpacity += (targetOpacity - currentOpacity) * lerpFactor;
    if (Math.abs(currentOpacity - targetOpacity) < 0.005) currentOpacity = targetOpacity;
    bgWrap.style.opacity = currentOpacity;

    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ═══════ ABOUT SCROLL REVEAL SYSTEM ═══════ */
function initAboutFadeIn() {
  /* Staggered reveal for .abt-reveal elements */
  const revealEls = document.querySelectorAll('.abt-reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0, 10);
        const parent = entry.target.parentElement;
        const siblings = parent ? [...parent.querySelectorAll(':scope > .abt-reveal')] : [entry.target];
        const idx = siblings.indexOf(entry.target);
        const stagger = idx * 120 + delay;

        setTimeout(() => {
          entry.target.classList.add('abt-visible');
        }, stagger);

        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  revealEls.forEach(el => observer.observe(el));

  /* Word-by-word title reveal */
  const words = document.querySelectorAll('.abt-word-reveal');
  if (words.length) {
    const wordObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const allWords = entry.target.closest('.about-main-title').querySelectorAll('.abt-word-reveal');
          allWords.forEach((w, i) => {
            setTimeout(() => w.classList.add('abt-word-visible'), i * 150);
          });
          wordObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    wordObs.observe(words[0]);
  }
}

/* ═══════ MENTOR IMAGE CAROUSEL ═══════ */
function initMentorCarousel() {
  const slides = document.querySelectorAll('.mentor-slide');
  const dots = document.querySelectorAll('.mentor-dot');
  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  const interval = 1250;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx % total;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function autoAdvance() {
    timer = setInterval(() => goTo(current + 1), interval);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goTo(parseInt(dot.dataset.idx, 10));
      autoAdvance();
    });
  });

  autoAdvance();
}
