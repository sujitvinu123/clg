/* ═══════ BATCH REUNION — Advanced Interactions ═══════ */

/* ═══════ SUPABASE CONFIG ═══════ */
const SUPABASE_URL = 'https://qwblgbldfwtrhnargesx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3YmxnYmxkZnd0cmhuYXJnZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDI1NTMsImV4cCI6MjA5MDUxODU1M30.Jmpl3aX8_D9BE7O1vLrqzQ1yBoZtxwfb6boaPJwkHr4';

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
  initHeroEntrance();
  initMorphText();
  initHeroParallax();
  initHeroParticles();
  initCursorGlow();
  initCountdown();
  initCounterAnimation();
  initScrollReveal();
  initHighlightsTimeline();
  initTestimonialCarousel();
  initForm();
  initSmoothScroll();
  initRipple();
  init3DTilt();
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

/* ═══════ NAVBAR ═══════ */
function initNavbar() {
  const nav = document.getElementById('mainNav');
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      links.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('active');
        links.classList.remove('active');
      });
    });
  }
}

/* ═══════ HERO ENTRANCE ═══════ */
function initHeroEntrance() {
  document.querySelectorAll('.anim-ent').forEach(el => {
    const d = parseInt(el.dataset.d || 0, 10);
    setTimeout(() => el.classList.add('anim-go'), 350 + d);
  });
}

/* ═══════ MORPH TEXT ═══════ */
function initMorphText() {
  const wordEl = document.getElementById('heroMorphWord');
  if (!wordEl) return;

  const words = [
    'Lives On.',
    'Begins Again.',
    'Shines Bright.',
    'Reconnects.',
    'Inspires.',
    'Comes Home.',
  ];

  let current = 0;
  setInterval(() => {
    wordEl.classList.remove('active');
    wordEl.classList.add('exit');

    setTimeout(() => {
      current = (current + 1) % words.length;
      wordEl.textContent = words[current];
      wordEl.classList.remove('exit');
      void wordEl.offsetWidth;
      wordEl.classList.add('active');
    }, 400);
  }, 2200);
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

/* ═══════ HERO PARTICLES ═══════ */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    p.style.animationDuration = (Math.random() * 8 + 6) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    container.appendChild(p);
  }
}

/* ═══════ CURSOR GLOW ═══════ */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(max-width: 768px)').matches) return;

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ═══════ COUNTDOWN TIMER ═══════ */
function initCountdown() {
  const targetDate = new Date('2026-12-15T10:00:00+05:30').getTime();
  const daysEl = document.getElementById('cdDays');
  const hoursEl = document.getElementById('cdHours');
  const minsEl = document.getElementById('cdMins');
  const secsEl = document.getElementById('cdSecs');
  if (!daysEl) return;

  function update() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const dStr = String(days).padStart(3, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(mins).padStart(2, '0');
    const sStr = String(secs).padStart(2, '0');

    if (daysEl.textContent !== dStr) { daysEl.textContent = dStr; daysEl.classList.add('flip'); setTimeout(() => daysEl.classList.remove('flip'), 500); }
    if (hoursEl.textContent !== hStr) { hoursEl.textContent = hStr; hoursEl.classList.add('flip'); setTimeout(() => hoursEl.classList.remove('flip'), 500); }
    if (minsEl.textContent !== mStr) { minsEl.textContent = mStr; minsEl.classList.add('flip'); setTimeout(() => minsEl.classList.remove('flip'), 500); }
    if (secsEl.textContent !== sStr) { secsEl.textContent = sStr; secsEl.classList.add('flip'); setTimeout(() => secsEl.classList.remove('flip'), 500); }
  }

  update();
  setInterval(update, 1000);
}

/* ═══════ COUNTER ANIMATION ═══════ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const start = performance.now();

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          el.textContent = Math.round(eased * target).toLocaleString();
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target.toLocaleString() + (el.closest('.stat-item').querySelector('.stat-label').textContent.includes('%') ? '' : '+');
        }

        requestAnimationFrame(animate);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ═══════ SCROLL REVEAL ═══════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.r-el');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const parent = e.target.parentElement;
        const siblings = parent ? [...parent.querySelectorAll(':scope > .r-el')] : [e.target];
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add('revealed'), idx * 100);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  els.forEach(el => obs.observe(el));
}

/* ═══════ HIGHLIGHTS TIMELINE ═══════ */
function initHighlightsTimeline() {
  const timeline = document.getElementById('hlTimeline');
  const fillLine = document.getElementById('hlLineFill');
  const items = document.querySelectorAll('.hl-item');
  if (!timeline || !items.length) return;

  const itemObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('hl-visible');
        itemObs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.15 });

  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.08}s`;
    itemObs.observe(item);
  });

  /* Scroll-driven fill line */
  let ticking = false;
  function updateFill() {
    const rect = timeline.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (rect.top < windowH && rect.bottom > 0) {
      const scrolled = Math.max(0, windowH * 0.5 - rect.top);
      const pct = Math.min(scrolled / rect.height, 1);
      if (fillLine) fillLine.style.height = (pct * 100) + '%';
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateFill); ticking = true; }
  }, { passive: true });
  updateFill();
}

/* ═══════ TESTIMONIAL CAROUSEL ═══════ */
function initTestimonialCarousel() {
  const track = document.getElementById('tcTrack');
  const prevBtn = document.getElementById('tcPrev');
  const nextBtn = document.getElementById('tcNext');
  const dotsContainer = document.getElementById('tcDots');
  if (!track) return;

  const slides = track.querySelectorAll('.tc-slide');
  const total = slides.length;
  let current = 0;
  let autoTimer;

  /* Create dots */
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('button');
    dot.className = 'tc-dot' + (i === 0 ? ' active' : '');
    dot.dataset.idx = i;
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }
  const dots = dotsContainer.querySelectorAll('.tc-dot');

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); startAuto(); });

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
  startAuto();

  /* Swipe support */
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      clearInterval(autoTimer);
      goTo(current + (diff > 0 ? 1 : -1));
      startAuto();
    }
  });
}

/* ═══════ FORM ═══════ */
function initForm() {
  const form = document.getElementById('reunionForm');
  const ok = document.getElementById('formOk');
  const errorEl = document.getElementById('formError');
  const btn = document.getElementById('rfSubmitBtn');
  if (!form) return;

  /* Real-time validation */
  const inputs = form.querySelectorAll('.rf-input[required]');
  inputs.forEach(inp => {
    inp.addEventListener('blur', () => {
      if (inp.value.trim()) { inp.style.borderColor = '#2e7d32'; inp.style.boxShadow = '0 0 0 3px rgba(46,125,50,.06)'; }
    });
    inp.addEventListener('input', () => {
      if (inp.style.borderColor === 'rgb(198, 40, 40)' && inp.value.trim()) {
        inp.style.borderColor = '#2e7d32'; inp.style.boxShadow = '0 0 0 3px rgba(46,125,50,.06)';
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    if (errorEl) errorEl.classList.remove('visible');

    inputs.forEach(inp => {
      if (!inp.value.trim()) {
        valid = false;
        inp.style.borderColor = '#c62828';
        inp.style.boxShadow = '0 0 0 3px rgba(198,40,40,.1)';
        inp.style.animation = 'none'; void inp.offsetWidth; inp.style.animation = 'pfShake 0.4s ease';
      }
    });

    if (!valid) return;

    btn.disabled = true;
    const lab = document.getElementById('rfSubmitText');
    if (lab) lab.textContent = 'Submitting...';

    const formData = {
      full_name: document.getElementById('rfName').value.trim(),
      email: document.getElementById('rfEmail').value.trim(),
      phone: document.getElementById('rfPhone').value.trim() || null,
      batch_year: document.getElementById('rfBatch').value || null,
      department: document.getElementById('rfDept').value.trim() || null,
      guests: parseInt(document.getElementById('rfGuests').value) || 0,
      message: document.getElementById('rfMessage').value.trim() || null,
      submitted_at: new Date().toISOString()
    };

    try {
      if (supabaseClient) {
        const { data, error } = await supabaseClient.from('reunion_registrations').insert([formData]);
        if (error) throw new Error(error.message);
        console.log('✅ Submitted to Supabase:', data);
      } else {
        console.log('📋 Form data (Supabase not configured):', formData);
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      const fields = form.querySelectorAll('.rf-row, .rf-group, .rf-submit, .rf-header');
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
      if (lab) lab.textContent = 'Register for Reunion';
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
      const navEl = document.querySelector('.inst-header');
      const off = navEl ? navEl.offsetHeight : 80;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off - 12, behavior: 'smooth' });
    });
  });
}

/* ═══════ RIPPLE EFFECT ═══════ */
function initRipple() {
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

/* ═══════ 3D TILT ═══════ */
function init3DTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    const target = card.querySelector('.hero-card-inner') || card;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const maxTilt = 6, lerp = 0.08;
    let raf = null, active = false;

    function animate() {
      cx += (tx - cx) * lerp;
      cy += (ty - cy) * lerp;
      target.style.transform = `rotateX(${-cy}deg) rotateY(${cx}deg) scale3d(1.02,1.02,1.02)`;
      if (active || Math.abs(tx - cx) > 0.01 || Math.abs(ty - cy) > 0.01) {
        raf = requestAnimationFrame(animate);
      } else {
        target.style.transform = '';
      }
    }

    card.addEventListener('mouseenter', () => { active = true; if (!raf) raf = requestAnimationFrame(animate); });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * maxTilt;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2 * maxTilt;
    });
    card.addEventListener('mouseleave', () => { active = false; tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(animate); });
  });
}

/* ═══════ KEYFRAME INJECTION for pfShake ═══════ */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes pfShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-4px)}40%{transform:translateX(4px)}60%{transform:translateX(-3px)}80%{transform:translateX(2px)}}`;
document.head.appendChild(shakeStyle);
