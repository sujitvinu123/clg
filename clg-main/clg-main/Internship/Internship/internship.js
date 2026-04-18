/**
 * Alumni Contribution Portal - Internship Page
 * Motion Design & Interaction System
 */

document.addEventListener('DOMContentLoaded', () => {
  initPageLoadAnimation();
  initHeroCarousel();
  initScrollReveal();
  initParallax();
  initTagInput();
  initFormInteractions();
  initSmoothScroll();
  initInternshipListings();
  initStudentResumeUpload();
});

let studentResumeSkills = [];
let studentResumeParsedData = null;
let studentRawResumeText = "";

const STOP_WORDS = new Set(["and", "the", "to", "in", "for", "of", "with", "a", "an", "on", "as", "is", "by", "at", "from", "it", "this", "that", "are", "be", "or", "which"]);

function extractResumeData(textLower) {
  const words = textLower.match(/\b[a-z]{3,}\b/g) || [];
  const meaningfulWords = words.filter(w => !STOP_WORDS.has(w));
  const uniqueKeywords = [...new Set(meaningfulWords)];

  let domain = "General";
  if (textLower.includes("machine learning") || textLower.includes("ai")) domain = "AI";
  else if (textLower.includes("web") || textLower.includes("frontend") || textLower.includes("backend")) domain = "Web Development";
  else if (textLower.includes("data") || textLower.includes("analytics")) domain = "Data Science";

  const has_projects = textLower.includes("project");
  const has_experience = textLower.includes("experience");

  return {
    extracted_skills: uniqueKeywords.slice(0, 50),
    domain,
    has_projects,
    has_experience,
    keywords: uniqueKeywords.slice(0, 50),
    resume_text: textLower.slice(0, 2000)
  };
}

async function saveResumeData(resumeData) {
  if (!supabaseClient) return;
  try {
    const { error } = await supabaseClient.from("resume_data").insert([resumeData]);
    if (error) console.error("Insert resume_data error:", error);
  } catch (err) {
    console.error("Save resume data failed:", err);
  }
}

function initStudentResumeUpload() {
  const resumeInput = document.getElementById('student-resume');
  if (!resumeInput) return;

  resumeInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) {
      studentResumeSkills = [];
      return;
    }

    try {
      if (typeof pdfjsLib === 'undefined') {
        console.warn('PDF.js not loaded');
        return;
      }

      // Configure worker for PDF.js (in case it tries to load it automatically and fails)
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

      const fileReader = new FileReader();
      fileReader.onload = async function () {
        try {
          const typedarray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            fullText += pageText + " ";
          }

          console.log("Resume text length:", fullText.length);

          studentRawResumeText = fullText;

          const textLower = fullText.toLowerCase();

          studentResumeParsedData = extractResumeData(textLower);
          studentResumeSkills = studentResumeParsedData.extracted_skills;

          console.log("Resume Data:", studentResumeParsedData);
          await saveResumeData(studentResumeParsedData);
        } catch (error) {
          console.error("Error processing PDF content:", error);
          studentResumeSkills = [];
        }
      };

      fileReader.onerror = function () {
        console.error("Error reading file");
        studentResumeSkills = [];
      };

      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error setting up PDF parsing:", error);
      studentResumeSkills = [];
    }
  });
}

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
  if (heading) {
    heading.style.opacity = '0';
    heading.style.transform = 'translateX(-60px)';
  }

  if (subtitle) {
    subtitle.style.opacity = '0';
    subtitle.style.transform = 'translateY(20px)';
  }

  if (buttons) {
    buttons.style.opacity = '0';
    buttons.style.transform = 'scale(0.9)';
  }

  if (visual) {
    visual.style.opacity = '0';
    visual.style.transform = 'translateY(40px)';
  }

  // Animate in sequence
  setTimeout(() => {
    // Heading
    if (heading) {
      heading.style.transition = `all 0.8s ${springEase}`;
      heading.style.opacity = '1';
      heading.style.transform = 'translateX(0)';
      heading.classList.remove('load-hidden');
    }

    // Subtitle
    setTimeout(() => {
      if (subtitle) {
        subtitle.style.transition = `all 0.8s ${springEase}`;
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
        subtitle.classList.remove('load-hidden');
      }
    }, 150);

    // Buttons
    setTimeout(() => {
      if (buttons) {
        buttons.style.transition = `all 0.8s ${springEase}`;
        buttons.style.opacity = '1';
        buttons.style.transform = 'scale(1)';
        buttons.classList.remove('load-hidden');
      }
    }, 300);

    // Visual
    setTimeout(() => {
      if (visual) {
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
 * Level 4 — Hero Auto Image Carousel Right Side
 */
function initHeroCarousel() {
  const slides = document.querySelectorAll('#hero-carousel .carousel-image');
  if (slides.length <= 1) return;

  let currentSlide = 0;

  setInterval(() => {
    // Fade out current slide
    slides[currentSlide].classList.remove('active');

    // Move to next slide
    currentSlide = (currentSlide + 1) % slides.length;

    // Fade in next slide
    slides[currentSlide].classList.add('active');
  }, 2000); // 2s interval crossfade
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

    // Max 10px shift
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
  const container = document.getElementById('tag-container');
  const input = document.getElementById('jobSkills');
  const tagsList = document.getElementById('tags-list');
  let tags = [];

  if (!container || !input || !tagsList) return;

  // Add focus styling
  input.addEventListener('focus', () => container.classList.add('focused'));
  input.addEventListener('blur', () => container.classList.remove('focused'));

  // Allow clicking anywhere on container to focus input
  container.addEventListener('click', () => input.focus());

  const renderTags = () => {
    tagsList.innerHTML = '';
    tags.forEach((tag, index) => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.innerHTML = `
        ${tag}
        <button type="button" aria-label="Remove ${tag}" data-index="${index}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;
      tagsList.appendChild(pill);
    });

    // Reattach remove event listeners
    const removeButtons = tagsList.querySelectorAll('button');
    removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering container click
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        tags.splice(idx, 1);
        renderTags();
      });
    });
  };

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = input.value.trim();
      if (val && !tags.includes(val)) {
        tags.push(val);
        renderTags();
        input.value = '';
      }
    } else if (e.key === 'Backspace' && input.value === '' && tags.length > 0) {
      // Allow backspace to remove last tag if input is empty
      tags.pop();
      renderTags();
    }
  });

  // Global property to get tags
  window.getJobSkills = () => tags;
}

/**
 * Form Submission & Validation
 */
function initFormInteractions() {
  const form = document.querySelector('#internship-form');
  const successState = document.getElementById('form-success-state');
  const resetButton = document.getElementById('reset-internship-form');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Submitting form...");

    try {
      // Capture skills input and convert into array
      const skillsInput = document.getElementById('jobSkills')?.value || '';
      let commaSkills = [];
      if (skillsInput) {
        commaSkills = skillsInput
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill !== '');
      }

      // Merge with any skills added via the existing tag UI
      const existingTags = typeof window.getJobSkills === 'function' ? window.getJobSkills() : [];
      const finalSkills = [...new Set([...existingTags, ...commaSkills])];

      // Extract values using existing input IDs and map EXACTLY
      const data = {
        company: document.getElementById('companyName')?.value || '',
        role: document.getElementById('yourRole')?.value || '',
        title: document.getElementById('internshipTitle')?.value || '',
        location: document.getElementById('location')?.value || '',
        duration: document.getElementById('duration')?.value || '',
        stipend: document.getElementById('stipend')?.value || '',
        openings: parseInt(document.getElementById('openings')?.value) || 0,
        description: document.getElementById('description')?.value || '',
        deadline: document.getElementById('deadline')?.value || null,
        skills: finalSkills
      };

      console.log("Data:", data);

      if (!supabaseClient) {
        throw new Error("Supabase client is not initialized.");
      }

      // Database Insert
      const { error } = await supabaseClient
        .from("internships")
        .insert([data]);

      if (error) {
        throw error;
      }

      // Success Handling
      alert("Internship Posted Successfully");
      form.reset();

      // Reset Tag UI if present
      if (typeof window.getJobSkills === 'function') {
        window.getJobSkills().length = 0;
        const tagsList = document.getElementById('tags-list');
        if (tagsList) tagsList.innerHTML = '';
      }

      if (successState) {
        successState.classList.add('active');
      }

      // Reload listings
      if (typeof loadInternships === 'function') {
        try { loadInternships(); } catch (err) { console.error("Error reloading internships:", err); }
      }

    } catch (error) {
      console.error(error);
      alert("Failed to post internship");
    }
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      form.reset();
      if (typeof window.getJobSkills === 'function') {
        window.getJobSkills().length = 0;
        const tagsList = document.getElementById('tags-list');
        if (tagsList) tagsList.innerHTML = '';
      }
      if (successState) {
        successState.classList.remove('active');
      }
    });
  }
}

/**
 * Internship Listings & Empty State
 */
function initInternshipListings() {
  const listingsGrid = document.querySelector('#open-listings #listings-grid');
  const emptyState = document.querySelector('#open-listings #empty-state');
  const toggleBtn = document.querySelector('#open-listings #toggle-listings');

  if (!listingsGrid || !emptyState) return;

  // Mock Internship Data
  let mockInternships = [
    {
      title: "Software Engineering Intern",
      company: "Acme Corp",
      location: "San Francisco, CA (Hybrid)",
      skills: ["React", "Python", "SQL"],
      description: "Join our core platform group to build scalable microservices and deliver frontend features utilized by millions of daily users."
    },
    {
      title: "Data Science Intern",
      company: "Innovate AI",
      location: "Remote",
      skills: ["Python", "TensorFlow", "Pandas"],
      description: "Work closely with senior data scientists to develop predictive models and design data pipelines for our newest generative AI tools."
    },
    {
      title: "Product Design Intern",
      company: "Nexus Systems",
      location: "New York, NY (Onsite)",
      skills: ["Figma", "Prototyping", "UX Research"],
      description: "Help redefine our mobile application experience through wireframing, rigorous user testing, and crafting beautiful interfaces."
    }
  ];

  const renderInternships = () => {
    listingsGrid.innerHTML = '';

    if (mockInternships.length === 0) {
      listingsGrid.style.display = 'none';
      emptyState.style.display = 'flex';
      return;
    }

    listingsGrid.style.display = 'grid'; // restoring grid
    emptyState.style.display = 'none';

    mockInternships.forEach((job, index) => {
      const delayScale = (index % 3) + 1;

      const skillsHTML = job.skills.map(s => `<span class="job-skill-pill">${s}</span>`).join('');

      const card = document.createElement('div');
      card.className = `glass-card job-card reveal stagger-${delayScale}`;

      card.innerHTML = `
        <div class="job-card-header">
          <div>
            <h3 class="job-title">${job.title}</h3>
            <div class="job-company">${job.company}</div>
          </div>
        </div>
        
        <div class="job-meta">
          <div class="job-meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${job.location}
          </div>
        </div>
        
        <div class="job-skills">
          ${skillsHTML}
        </div>
        
        <div class="job-description">
          <p style="margin-bottom: 0;">${job.description}</p>
        </div>
        
        <a href="#" class="btn btn-red" style="width: 100%;">View Details</a>
      `;

      listingsGrid.appendChild(card);
    });

    // Manually trigger reveal for newly created DOM elements if we toggle
    // However, Intersection Observer from earlier might miss these if it ran before.
    // So let's add .revealed instantly if we are just toggling, or re-init scroll reveal.
    setTimeout(() => {
      document.querySelectorAll('#listings-grid .reveal').forEach(el => el.classList.add('revealed'));
    }, 50);
  };

  // Initial render
  setTimeout(renderInternships, 100);

  // Toggle functionality for empty state testing
  if (toggleBtn) {
    let showsData = true;
    // Prevent duplicate event handlers safely:
    const clone = toggleBtn.cloneNode(true);
    toggleBtn.parentNode.replaceChild(clone, toggleBtn);

    clone.addEventListener('click', () => {
      showsData = !showsData;
      if (showsData) {
        mockInternships = [ // restore
          { title: "Software Engineering Intern", company: "Acme Corp", location: "San Francisco, CA (Hybrid)", skills: ["React", "Python", "SQL"], description: "Join our core platform group to build scalable microservices and deliver frontend features utilized by millions of daily users." },
          { title: "Data Science Intern", company: "Innovate AI", location: "Remote", skills: ["Python", "TensorFlow", "Pandas"], description: "Work closely with senior data scientists to develop predictive models and design data pipelines for our newest generative AI tools." },
          { title: "Product Design Intern", company: "Nexus Systems", location: "New York, NY (Onsite)", skills: ["Figma", "Prototyping", "UX Research"], description: "Help redefine our mobile application experience through wireframing, rigorous user testing, and crafting beautiful interfaces." }
        ];
      } else {
        mockInternships = []; // clear
      }
      renderInternships();
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
        offsetTop -= 80; // Offset for fixed header
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// --- NEW SUPABASE AND SEARCH ENHANCEMENTS ---

let supabaseClient;

try {
  supabaseClient = supabase.createClient(
    "https://qwblgbldfwtrhnargesx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3YmxnYmxkZnd0cmhuYXJnZXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NDI1NTMsImV4cCI6MjA5MDUxODU1M30.Jmpl3aX8_D9BE7O1vLrqzQ1yBoZtxwfb6boaPJwkHr4"
  );
  console.log("Supabase initialized");
} catch (err) {
  console.error("Supabase init failed", err);
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    initApp();
  } catch (e) {
    console.error("App error prevented:", e);
  }
});

// handleForm() removed — form submission is now handled by initFormInteractions()
// which validates skills, sends data to Supabase, and shows the success UI.

async function loadInternships() {
  if (!supabaseClient) return;

  try {
    const { data, error } = await supabaseClient
      .from("internships")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    renderInternships(data);

  } catch (err) {
    console.error("Load error:", err);
  }
}

function renderInternships(data) {
  const container = document.getElementById("listings-grid");
  const empty = document.getElementById("empty-state");

  if (!container) return;

  container.innerHTML = "";

  if (!data || data.length === 0) {
    if (empty) empty.style.display = "block";
    return;
  }

  if (empty) empty.style.display = "none";

  data.forEach((job, index) => {
    const card = document.createElement("div");
    card.className = "glass-card";

    // Build match score badge if score exists
    let scoreBadge = "";
    if (typeof job._matchScore === "number" && job._matchScore > 0) {
      const pct = Math.min(Math.round(job._matchScore), 100);
      let badgeColor = "rgba(229, 57, 53, 0.2)";
      let textColor = "var(--red-lt)";
      if (pct >= 75) {
        badgeColor = "rgba(76, 175, 80, 0.2)";
        textColor = "#66BB6A";
      } else if (pct >= 50) {
        badgeColor = "rgba(255, 183, 77, 0.2)";
        textColor = "#FFB74D";
      }
      scoreBadge = `<div style="display:inline-block; padding:4px 12px; border-radius:20px; background:${badgeColor}; color:${textColor}; font-size:0.8rem; font-weight:600; margin-bottom:12px;">${pct}% Match</div>`;
    }

    // Build skills pills
    const jobSkills = job.skills || [];
    const skillsHTML = jobSkills.map(s => `<span class="job-skill-pill">${s}</span>`).join("");

    card.innerHTML = `
      ${scoreBadge}
      <h3 style="margin-bottom:4px;">${job.title || "Untitled Role"}</h3>
      <p style="color:var(--red-lt); font-weight:500; margin-bottom:8px;">${job.company || ""}</p>
      <p style="font-size:0.9rem; margin-bottom:12px;">${job.location || ""}</p>
      ${skillsHTML ? `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">${skillsHTML}</div>` : ""}
      ${job.description ? `<p style="font-size:0.9rem; margin-bottom:16px; color:var(--text-muted);">${job.description}</p>` : ""}
    `;

    container.appendChild(card);
  });
}

/**
 * Scoring-based internship matching system
 */
function calculateMatchScore(job, filters) {
  let score = 0;
  const maxScore = 100;

  // --- Role match (weight: 40) ---
  if (filters.role) {
    const jobTitle = (job.title || "").toLowerCase();
    const roleQuery = filters.role.toLowerCase();
    if (jobTitle === roleQuery) {
      score += 40; // exact match
    } else if (jobTitle.includes(roleQuery) || roleQuery.includes(jobTitle)) {
      score += 30; // partial match
    } else {
      // word-level overlap
      const roleWords = roleQuery.split(/\s+/);
      const titleWords = jobTitle.split(/\s+/);
      const overlap = roleWords.filter(w => titleWords.some(tw => tw.includes(w) || w.includes(tw)));
      if (overlap.length > 0) {
        score += Math.min(20, overlap.length * 10);
      }
    }
  }

  // --- Skills match (weight: 30, distributed per skill) ---
  if (filters.skills.length > 0) {
    const jobSkillsStr = (job.skills || []).join(" ").toLowerCase();
    const jobDesc = (job.description || "").toLowerCase();
    let skillHits = 0;

    filters.skills.forEach(skill => {
      if (jobSkillsStr.includes(skill) || jobDesc.includes(skill)) {
        skillHits++;
      }
    });

    if (skillHits > 0) {
      // Scale: more skills matched = higher score, cap at 30
      const skillScore = Math.min(30, (skillHits / filters.skills.length) * 30);
      score += skillScore;
    }
  }

  // --- Location match (weight: 20) ---
  if (filters.location) {
    const jobLocation = (job.location || "").toLowerCase();
    const locQuery = filters.location.toLowerCase();
    if (jobLocation.includes(locQuery) || locQuery.includes(jobLocation)) {
      score += 20;
    } else {
      const locWords = locQuery.split(/[\s,]+/);
      const matched = locWords.filter(w => jobLocation.includes(w));
      if (matched.length > 0) {
        score += 10;
      }
    }
  }

  // --- Skill Level (weight: 5) ---
  if (filters.skillLevel) {
    const jobDesc = (job.description || "").toLowerCase();
    const jobTitle = (job.title || "").toLowerCase();
    const levelKeywords = {
      beginner: ["junior", "intern", "entry", "beginner", "trainee", "associate"],
      intermediate: ["mid", "intermediate", "analyst", "developer", "engineer"],
      advanced: ["senior", "lead", "staff", "principal", "advanced", "architect"]
    };
    const keywords = levelKeywords[filters.skillLevel] || [];
    const hasMatch = keywords.some(kw => jobTitle.includes(kw) || jobDesc.includes(kw));
    if (hasMatch) {
      score += 5;
    }
  }

  // --- Learning Goal (weight: 5) ---
  if (filters.goal) {
    const jobDesc = (job.description || "").toLowerCase();
    const goalKeywords = {
      "hands-on": ["hands-on", "practical", "build", "develop", "create", "implement"],
      "career": ["career", "growth", "explore", "exposure", "industry", "professional"],
      "technical": ["technical", "deep-dive", "architecture", "system", "algorithm", "engineering"],
      "leadership": ["leadership", "team", "manage", "collaborate", "mentor", "coordinate"]
    };
    const keywords = goalKeywords[filters.goal] || [];
    const hasMatch = keywords.some(kw => jobDesc.includes(kw));
    if (hasMatch) {
      score += 5;
    }
  }

  // --- External Resume Data Bonuses ---
  let adjustedMaxScore = maxScore;
  if (typeof studentResumeParsedData !== 'undefined' && studentResumeParsedData) {
    adjustedMaxScore += 15; // domain

    // Domain match medium weight
    const jobDesc = (job.description || "").toLowerCase();
    const jobTitle = (job.title || "").toLowerCase();

    let domainMatch = false;
    if (studentResumeParsedData.domain === "AI" && (jobDesc.includes("ai") || jobDesc.includes("machine learning"))) domainMatch = true;
    else if (studentResumeParsedData.domain === "Web Development" && (jobDesc.includes("web") || jobDesc.includes("frontend") || jobDesc.includes("backend"))) domainMatch = true;
    else if (studentResumeParsedData.domain === "Data Science" && (jobDesc.includes("data") || jobDesc.includes("analytics"))) domainMatch = true;

    if (domainMatch) score += 15;

    // Bonus points
    if (studentResumeParsedData.has_projects) score += 5;
    if (studentResumeParsedData.has_experience) score += 10;
  }

  return Math.min(score, adjustedMaxScore);
}
async function saveStudentProfile(filters, finalSkills) {
  if (!supabaseClient) return;

  try {
    const profileData = {
      role: filters.role || "",
      skills: finalSkills || [],
      location: filters.location || "",
      skill_level: filters.skillLevel || "",
      availability: filters.availability || "",
      goal: filters.goal || "",
      resume_skills: studentResumeSkills || []
    };

    console.log("Saving Profile:", profileData);

    const { error } = await supabaseClient
      .from("student_profiles")
      .insert([profileData]);

    if (error) {
      console.error("Insert error:", error);
    } else {
      console.log("Profile saved successfully");
    }

  } catch (err) {
    console.error("Save profile failed:", err);
  }
}

function parseResumeSmart(text) {
  if (!text) return {};

  const cleanText = text.replace(/\s+/g, ' ');
  const textLower = cleanText.toLowerCase();

  let name = "Unknown";
  const nameMatch = cleanText.trim().match(/^[A-Z][a-zA-Z]+\s+[A-Z][a-zA-Z]+/);
  if (nameMatch) {
    name = nameMatch[0];
  } else {
    const words = cleanText.trim().split(/\s+/);
    if (words.length >= 2) name = words[0] + " " + words[1];
  }

  const techKeywords = [
    "react", "python", "node", "sql", "html", "css", "java", "mongodb", "express", "ai", "machine learning", "typescript", "c++", "javascript", "aws", "docker", "git"
  ];
  let skillsSet = new Set();
  techKeywords.forEach(skill => {
    const regex = new RegExp("\\b" + skill.replace("+", "\\+") + "\\b", "gi");
    if (regex.test(textLower)) {
      skillsSet.add(skill);
    }
  });

  let skills = Array.from(skillsSet).slice(0, 15);

  let domain = "General";
  if (textLower.includes("machine learning") || textLower.includes("ai")) {
    domain = "AI";
  } else if (textLower.includes("web") || textLower.includes("frontend")) {
    domain = "Web Development";
  }

  let education = "Not Specified";
  if (textLower.match(/\b(b\.?tech|bachelor|college|university|bsc|b\.?e\.?)\b/)) {
    education = "Bachelor / College";
  }

  let experience_level = "Fresher";
  if (textLower.match(/\b(intern|experience|worked)\b/)) {
    experience_level = "Experienced";
  }

  let projects = false;
  let project_keywords = [];
  if (textLower.includes("project")) {
    projects = true;
    const projIdx = textLower.indexOf("project");
    const contextStr = textLower.substring(Math.max(0, projIdx - 50), Math.min(textLower.length, projIdx + 100));

    techKeywords.forEach(skill => {
      const regex = new RegExp("\\b" + skill.replace("+", "\\+") + "\\b", "gi");
      if (regex.test(contextStr)) {
        project_keywords.push(skill);
      }
    });
  }

  project_keywords = [...new Set(project_keywords)];

  return {
    name,
    skills,
    domain,
    education,
    experience_level,
    projects,
    project_keywords
  };
}

async function saveResumeAIData(parsedData, rawText) {
  if (!supabaseClient) return;
  try {
    const dataToInsert = {
      name: parsedData.name,
      skills: parsedData.skills,
      domain: parsedData.domain,
      education: parsedData.education,
      experience_level: parsedData.experience_level,
      projects: parsedData.projects,
      raw_text: rawText
    };

    console.log("Supabase insert object:", dataToInsert);

    const { error } = await supabaseClient
      .from("resume_ai_data")
      .insert([dataToInsert]);

    if (error) {
      console.error("AI Data Insert Error:", error);
    }
  } catch (err) {
    console.error("Save AI Data Failed:", err);
  }
}

function handleFilter() {
  const btn = document.getElementById("filter-btn");
  if (!btn || !supabaseClient) return;

  btn.addEventListener("click", async () => {
    try {
      if (typeof studentRawResumeText !== 'undefined' && studentRawResumeText) {
        const parsedData = parseResumeSmart(studentRawResumeText);
        console.log("Resume Text:", studentRawResumeText);
        console.log("Parsed Data:", parsedData);
        console.log("AI Parsed Resume:", parsedData);
        await saveResumeAIData(parsedData, studentRawResumeText);
      }

      const manualSkills = (document.getElementById("filter-skills")?.value || "")
        .toLowerCase().split(",").map(s => s.trim()).filter(s => s);

      const finalSkills = [...new Set([...manualSkills, ...studentResumeSkills])];
      console.log("Final Skills:", finalSkills);

      const filters = {
        role: (document.getElementById("filter-role")?.value || "").trim(),
        skills: finalSkills,
        location: (document.getElementById("filter-location")?.value || "").trim(),
        skillLevel: (document.getElementById("filter-skill-level")?.value || ""),
        availability: (document.getElementById("filter-availability")?.value || ""),
        goal: (document.getElementById("filter-goal")?.value || "")
      };

      await saveStudentProfile(filters, finalSkills);

      const { data } = await supabaseClient
        .from("internships")
        .select("*");

      // If all fields are empty, show everything unscored
      const hasInput = filters.role || filters.skills.length > 0 || filters.location
        || filters.skillLevel || filters.availability || filters.goal;

      if (!hasInput) {
        removeMatchedSection();
        renderInternships(data);
        return;
      }

      // Calculate match scores
      const scored = (data || []).map(job => ({
        ...job,
        _matchScore: calculateMatchScore(job, filters)
      }));

      // Filter out zero-score results and sort descending
      const matched = scored
        .filter(job => job._matchScore > 0)
        .sort((a, b) => b._matchScore - a._matchScore);

      renderInternships(matched);
      renderTopMatches(matched);

    } catch (err) {
      console.error("Filter error:", err);
    }
  });
}

function initApp() {
  handleFilter();
  loadInternships();
}

function removeMatchedSection() {
  try {
    const existingSection = document.getElementById("matched-internships-section");
    if (existingSection) {
      existingSection.remove();
    }
  } catch (err) {
    console.error("Error removing matched section:", err);
  }
}

function renderTopMatches(matchedList) {
  try {
    removeMatchedSection();

    if (!matchedList || matchedList.length === 0) return;

    const listingsGrid = document.getElementById("listings-grid");
    if (!listingsGrid) return;

    const topMatches = matchedList.slice(0, 3);
    console.log("Top matched internships:", topMatches);

    const section = document.createElement("div");
    section.id = "matched-internships-section";
    section.style.marginBottom = "40px";
    section.style.padding = "24px";
    section.style.border = "2px solid rgba(76, 175, 80, 0.5)";
    section.style.borderRadius = "16px";
    section.style.backgroundColor = "rgba(76, 175, 80, 0.05)";
    section.style.position = "relative";
    
    const title = document.createElement("h2");
    title.innerText = "⭐ Top Matched Internships";
    title.style.marginBottom = "24px";
    title.style.color = "#66BB6A";
    
    const cardsContainer = document.createElement("div");
    cardsContainer.className = "grid grid-3";
    cardsContainer.style.display = "grid";
    cardsContainer.style.gap = "20px";

    topMatches.forEach((job, index) => {
      const card = document.createElement("div");
      card.className = "glass-card";
      card.style.cursor = "pointer";
      card.style.transition = "transform 0.2s, box-shadow 0.2s";
      card.style.position = "relative";
      card.style.overflow = "hidden";
      
      card.onmouseenter = () => {
        card.style.transform = "translateY(-5px)";
        card.style.boxShadow = "0 8px 24px rgba(76, 175, 80, 0.2)";
      };
      card.onmouseleave = () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "none";
      };

      const pct = Math.min(Math.round(job._matchScore || 0), 100);
      const scoreBadge = `<div style="display:inline-block; padding:6px 12px; border-radius:20px; background:rgba(76, 175, 80, 0.2); color:#66BB6A; font-size:0.8rem; font-weight:600; margin-bottom:12px;">${pct}% Match</div>`;
      
      const jobSkills = job.skills || [];
      const skillsHTML = jobSkills.slice(0, 3).map(s => `<span class="job-skill-pill">${s}</span>`).join("");

      card.innerHTML = `
        ${scoreBadge}
        <h3 style="margin-bottom:4px; font-size:1.2rem;">${job.title || "Untitled Role"}</h3>
        <p style="color:var(--red-lt); font-weight:500; margin-bottom:8px;">${job.company || ""}</p>
        <p style="font-size:0.9rem; margin-bottom:16px;">${job.location || ""}</p>
        ${skillsHTML ? `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">${skillsHTML}</div>` : ""}
        <div style="font-size:0.9rem; color:var(--text-muted); border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">Click to view details & apply</div>
      `;

      card.addEventListener("click", () => {
        console.log("Clicked top matched card:", job.title);
        openJobModal(job);
      });

      cardsContainer.appendChild(card);
    });

    section.appendChild(title);
    section.appendChild(cardsContainer);
    
    // Insert BEFORE the existing listings grid
    listingsGrid.parentNode.insertBefore(section, listingsGrid);

  } catch (err) {
    console.error("Error rendering top matches:", err);
  }
}

function openJobModal(job) {
  try {
    let modal = document.getElementById("job-detail-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "job-detail-modal";
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100vw";
      modal.style.height = "100vh";
      modal.style.backgroundColor = "rgba(0,0,0,0.85)";
      modal.style.zIndex = "9999";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      modal.style.backdropFilter = "blur(8px)";
      
      const content = document.createElement("div");
      content.id = "job-detail-modal-content";
      content.className = "glass-card";
      content.style.width = "90%";
      content.style.maxWidth = "600px";
      content.style.maxHeight = "90vh";
      content.style.overflowY = "auto";
      content.style.position = "relative";
      content.style.padding = "40px";
      content.style.borderRadius = "20px";
      
      modal.appendChild(content);
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }

    const content = document.getElementById("job-detail-modal-content");
    const pct = Math.min(Math.round(job._matchScore || 0), 100);
    const skillsHTML = (job.skills || []).map(s => `<span class="job-skill-pill">${s}</span>`).join("");
    
    content.innerHTML = `
      <button id="close-modal-btn" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:white; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s;">&times;</button>
      <div style="display:inline-block; padding:6px 16px; border-radius:20px; background:rgba(76, 175, 80, 0.2); color:#66BB6A; font-size:0.9rem; font-weight:600; margin-bottom:20px;">${pct}% Match</div>
      <h2 style="margin-bottom:8px; font-size:1.8rem;">${job.title || "Untitled Role"}</h2>
      <h3 style="color:var(--red-lt); font-size:1.2rem; margin-bottom:16px;">${job.company || ""}</h3>
      <p style="margin-bottom:20px; color:var(--text-muted);"><svg style="vertical-align:middle; margin-right:6px;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${job.location || ""}</p>
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:24px;">${skillsHTML}</div>
      <div style="margin-bottom:32px; background:rgba(0,0,0,0.2); padding:20px; border-radius:12px;">
        <h4 style="margin-bottom:12px; font-size:1.1rem; color:white;">Description</h4>
        <p style="color:rgba(255,255,255,0.8); line-height:1.7; font-size:0.95rem;">${job.description || "No descriptions are available for this internship."}</p>
      </div>
      <button id="apply-job-btn" class="btn btn-primary" style="width:100%; text-align:center; padding:16px; font-size:1.1rem; border-radius:12px; font-weight:bold;">Apply Now</button>
    `;

    document.getElementById("close-modal-btn").addEventListener("click", () => {
      modal.style.display = "none";
    });

    if (window.appliedInternships && window.appliedInternships.has(job.id)) {
       document.getElementById("apply-job-btn").innerText = "Applied ✓";
       document.getElementById("apply-job-btn").style.backgroundColor = "#4CAF50";
       document.getElementById("apply-job-btn").disabled = true;
       document.getElementById("apply-job-btn").style.opacity = "0.7";
    } else {
       document.getElementById("apply-job-btn").addEventListener("click", () => {
         transformToApplicationForm(job, pct, modal);
       });
    }

    modal.style.display = "flex";

  } catch(err) {
    console.error("Error opening job modal:", err);
  }
}

// Global registry for applied jobs to prevent duplicates across sessions in same page load
window.appliedInternships = window.appliedInternships || new Set();

function transformToApplicationForm(job, pct, modal) {
  try {
    const content = document.getElementById("job-detail-modal-content");
    
    // Section 2 Data setup
    let profileSkillsStr = "";
    let profileDomain = "Not specified";
    let profileExp = "Not specified";
    let autoName = "";
    let isParsed = typeof studentResumeParsedData !== 'undefined' && studentResumeParsedData;
    
    if (isParsed) {
       profileSkillsStr = (studentResumeParsedData.skills || []).join(", ");
       profileDomain = studentResumeParsedData.domain || "General";
       profileExp = studentResumeParsedData.experience_level || "Not specified";
       autoName = studentResumeParsedData.name || "";
    }

    // Section 4 Match Insights
    let insightHTML = "";
    if (pct > 0) {
       const jobSkillsLen = job.skills ? job.skills.length : 0;
       insightHTML = `
         <div style="margin-top:20px; padding:16px; background:rgba(76,175,80,0.1); border-left:4px solid #4CAF50; border-radius:8px;">
           <h4 style="color:#66BB6A; margin-bottom:10px;">Match Insights</h4>
           <ul style="list-style:none; padding-left:0; font-size:0.9rem; color:rgba(255,255,255,0.8);">
             <li style="margin-bottom:6px;">✔ ${pct}% overall profile match</li>
             <li style="margin-bottom:6px;">✔ Evaluated against ${jobSkillsLen} required skills</li>
             <li>✔ Matches well with your stated capabilities</li>
           </ul>
         </div>
       `;
    }

    content.innerHTML = `
      <button id="close-modal-btn" style="position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:white; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s;">&times;</button>
      
      <!-- Section 1: Job Summary -->
      <h2 style="margin-bottom:8px; font-size:1.6rem;">Apply: ${job.title || "Role"}</h2>
      <h3 style="color:var(--red-lt); font-size:1.1rem; margin-bottom:16px;">${job.company || ""} - ${job.location || ""}</h3>
      <div style="font-size:0.9rem; margin-bottom:20px; color:rgba(255,255,255,0.8);">
        <strong>Required Skills:</strong> ${(job.skills || []).join(", ") || "Not specified"}
      </div>

      <div style="display:flex; flex-direction:column; gap:20px; max-height:55vh; overflow-y:auto; padding-right:10px;">
        
        <!-- Section 2: Profile Summary -->
        <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px;">
          <h4 style="margin-bottom:12px; color:white;">Your Auto-Filled Profile</h4>
          <div style="font-size:0.9rem; color:rgba(255,255,255,0.7); line-height:1.6;">
             <p><strong>Domain:</strong> ${profileDomain}</p>
             <p><strong>Experience:</strong> ${profileExp}</p>
             <p><strong>Skills:</strong> ${profileSkillsStr || "None parsed"}</p>
             <p><strong>Project Keywords:</strong> ${isParsed && studentResumeParsedData.project_keywords ? studentResumeParsedData.project_keywords.join(", ") : "None"}</p>
          </div>
        </div>
        
        <!-- Section 4: Insights -->
        ${insightHTML}

        <!-- Section 3: Application Form -->
        <div style="margin-top:10px;">
           <h4 style="margin-bottom:16px;">Application Details</h4>
           <div class="form-group" style="margin-bottom:12px;">
             <label style="display:block; font-size:0.9rem; margin-bottom:6px; color:var(--text-muted);">Full Name</label>
             <input type="text" id="app-name" value="${autoName}" placeholder="John Doe" style="width:100%; padding:12px; border-radius:8px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.2); color:white;">
           </div>
           
           <div class="form-group" style="margin-bottom:12px;">
             <label style="display:block; font-size:0.9rem; margin-bottom:6px; color:var(--text-muted);">Email Address</label>
             <input type="email" id="app-email" placeholder="john@example.com" style="width:100%; padding:12px; border-radius:8px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.2); color:white;">
           </div>
           
           <div class="form-group" style="margin-bottom:12px;">
             <label style="display:block; font-size:0.9rem; margin-bottom:6px; color:var(--text-muted);">Phone Number</label>
             <input type="tel" id="app-phone" placeholder="+1 234 567 8900" style="width:100%; padding:12px; border-radius:8px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.2); color:white;">
           </div>
           
           <div style="margin-bottom:16px; font-size:0.95rem; color:rgba(255,255,255,0.9); padding:12px; background:rgba(0,0,0,0.2); border-radius:8px;">
             <strong>Resume:</strong> ${isParsed ? "Using Uploaded Parser Info ✅" : "No Resume Context ❌"}
           </div>
           
           <div class="form-group" style="margin-bottom:12px;">
             <label style="display:block; font-size:0.9rem; margin-bottom:6px; color:var(--text-muted);">Cover Letter (Optional)</label>
             <textarea id="app-cover" placeholder="Why are you a good fit for this role?" rows="4" style="width:100%; padding:12px; border-radius:8px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.2); color:white; resize:vertical;"></textarea>
           </div>
        </div>
      </div>
      
      <div style="margin-top:24px;">
        <button id="submit-application-btn" class="btn btn-primary" style="width:100%; text-align:center; padding:16px; font-size:1.1rem; border-radius:12px; font-weight:bold;">Submit Application</button>
        <div id="submit-error-msg" style="color:#ef5350; font-size:0.9rem; margin-top:12px; display:none; text-align:center;"></div>
      </div>
    `;

    document.getElementById("close-modal-btn").addEventListener("click", () => {
      modal.style.display = "none";
    });

    document.getElementById("submit-application-btn").addEventListener("click", async () => {
       const btn = document.getElementById("submit-application-btn");
       const errMsg = document.getElementById("submit-error-msg");
       
       const name = document.getElementById("app-name").value;
       const email = document.getElementById("app-email").value;
       const phone = document.getElementById("app-phone").value;
       const cover = document.getElementById("app-cover").value;

       // Basic Validation
       if (!name || !email) {
         errMsg.innerText = "Please fill in your Full Name and Email Address.";
         errMsg.style.display = "block";
         return;
       }

       errMsg.style.display = "none";
       btn.innerText = "Submitting Application...";
       btn.disabled = true;
       btn.style.opacity = "0.7";

       try {
         const applicationPayload = {
           internship_id: job.id || null,
           student_name: name,
           email: email,
           phone: phone,
           skills: typeof studentResumeSkills !== 'undefined' ? studentResumeSkills : [],
           resume_data: isParsed ? studentResumeParsedData : null,
           cover_letter: cover,
           match_score: pct,
           status: "applied"
         };

         console.log("Submitting Application Payload:", applicationPayload);

         if (typeof supabaseClient !== "undefined" && supabaseClient) {
            const { error, data } = await supabaseClient.from("applications").insert([applicationPayload]);
            console.log("Supabase insert response:", data || "Success");
            if (error) {
               console.error("Supabase Error during application insert:", error);
               throw new Error(error.message || "Failed to submit to database");
            }
         } else {
            console.warn("Supabase client missing, bypassing database insert");
         }

         // Mark Job as Applied globally
         window.appliedInternships.add(job.id);

         // Display Success UI Feedback
         btn.innerText = "Applied Successfully ✓";
         btn.style.backgroundColor = "#4CAF50";
         btn.style.color = "white";
         btn.style.opacity = "1";

         // Close modal after brief success presentation
         setTimeout(() => {
           modal.style.display = "none";
           // Note: The UI updates on next open of this modal by checking window.appliedInternships
         }, 1500);

       } catch (e) {
         console.error("Application submission process failed:", e);
         errMsg.innerText = "Submission Failed: " + (e.message || "Please check connection and try again.");
         errMsg.style.display = "block";
         btn.innerText = "Submit Application";
         btn.disabled = false;
         btn.style.opacity = "1";
       }
    });

  } catch(innerErr) {
    console.error("Error setting up application form modal:", innerErr);
  }
}
