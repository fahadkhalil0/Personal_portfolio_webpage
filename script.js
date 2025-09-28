// Main Script
document.addEventListener('DOMContentLoaded', () => {

  // Elements
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const yearEl = document.getElementById('year');

  // Set current year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      header.classList.toggle('nav-open');
    });
  }

  // Smooth scroll & close mobile nav
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      header.classList.remove('nav-open');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // IntersectionObserver for reveal animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // IntersectionObserver to highlight nav links
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });

  sections.forEach(sec => navObserver.observe(sec));


  // Contact Form with Formspree (with validation)
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form values
      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const message = form.querySelector('textarea[name="message"]').value.trim();

      // === Basic validation ===
      if (!name || !email || !message) {
        feedback.textContent = "⚠️ Please fill in all fields.";
        feedback.style.color = "red";
        return;
      }

      // === Email format validation ===
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.textContent = "❌ Please enter a valid email address.";
        feedback.style.color = "red";
        return;
      }

      // Prepare data for Formspree
      const data = new FormData(form);
      // Show loading state
      feedback.textContent = "⏳ Sending...";
      feedback.style.color = "limegreen";

      try {
        const response = await fetch(form.action, {
          method: form.method,
          body: data,
          headers: { "Accept": "application/json" }
        });

        if (response.ok) {
          feedback.textContent = "✅ Thank you! Your message has been sent.";
          feedback.style.color = "limegreen";
          form.reset();
        } else {
          feedback.textContent = "❌ Oops! Something went wrong. Try again.";
          feedback.style.color = "red";
        }
      } catch (error) {
        feedback.textContent = "⚠️ Network error. Please try again later.";
        feedback.style.color = "red";
      }
    });
  }

  // Animate skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
          const width = fill.style.getPropertyValue('--width');
          fill.style.width = width;
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.skill').forEach(skill => {
    skillObserver.observe(skill);
  });
});


// Modern Animations with GSAP

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Navbar fade-in from top
gsap.from("header", {
  y: -80,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});

// Section Headings
gsap.utils.toArray("h2").forEach(h2 => {
  gsap.from(h2, {
    scrollTrigger: {
      trigger: h2,
      start: "top 80%", // animate when 80% of viewport
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  });
});

// Paragraphs + small text (EXCLUDING footer)
gsap.utils.toArray("p:not(.site-footer p)").forEach(p => {
  gsap.from(p, {
    scrollTrigger: {
      trigger: p,
      start: "top 85%",
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  });
});

// Buttons pop effect
gsap.utils.toArray(".btn").forEach(btn => {
  gsap.from(btn, {
    scrollTrigger: {
      trigger: btn,
      start: "top 85%",
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: "back.out(1.7)"
  });
});

// Project cards stagger animation
gsap.utils.toArray(".project-card").forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  });
});

// Skills section bar fill + fade-in
gsap.utils.toArray(".skill").forEach(skill => {
  gsap.from(skill, {
    scrollTrigger: {
      trigger: skill,
      start: "top 80%",
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out"
  });
});

// Social icons bounce in
gsap.utils.toArray(".social-links a").forEach((icon, i) => {
  gsap.from(icon, {
    scrollTrigger: {
      trigger: icon,
      start: "top 95%",
    },
    scale: 0,
    opacity: 0,
    duration: 0.5,
    delay: i * 0.1,
    ease: "back.out(2)"
  });
});


// Stylish Footer Animations

// Whole footer slides up with a soft glow
gsap.fromTo(".site-footer",
  {
    y: 100,
    opacity: 0,
    filter: "blur(8px)"
  },
  {
    scrollTrigger: {
      trigger: ".site-footer",
      start: "top 95%",
      toggleActions: "play none none none",
      once: true
    },
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    duration: 1.5,
    ease: "expo.out"
  }
);

// Footer text "typing in" style
gsap.from(".site-footer p", {
  scrollTrigger: {
    trigger: ".site-footer",
    start: "top 95%"
  },
  opacity: 0,
  y: 20,
  duration: 1,
  delay: 0.5,
  ease: "power2.out"
});

// Footer social icons floating effect
gsap.utils.toArray(".footer-social a").forEach((icon, i) => {
  gsap.fromTo(icon,
    {
      opacity: 0,
      y: 30,
      scale: 0.8,
      rotate: -15
    },
    {
      scrollTrigger: {
        trigger: ".site-footer",
        start: "top 95%"
      },
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      duration: 0.8,
      delay: 0.6 + i * 0.2, // staggered bounce
      ease: "elastic.out(1, 0.6)"
    }
  );
});

// Hero animation
const heading = document.querySelector(".hero-heading");
const cursor = document.querySelector(".cursor");
const lead = document.querySelector(".lead");
const buttons = document.querySelectorAll(".hero-ctas .btn");

if (heading) {
  // Save accent safely
  const accentEl = heading.querySelector(".accent");
  const accent = accentEl ? accentEl.textContent : "";

  // Get cursor HTML (if it exists) or create a dot cursor
  const cursorEl = heading.querySelector(".cursor");
  const cursorHTML = cursorEl ? cursorEl.outerHTML : '<span class="cursor">.</span>';

  // Build a combined string that preserves only the non-accent text with a marker for accent
  const partsArray = Array.from(heading.childNodes).map(node => {
    if (node.nodeType === 3) return node.textContent; // plain text node
    if (node.nodeType === 1 && node.classList.contains("accent")) return "{{ACCENT}}"; // marker
    return ""; // ignore other elements (like cursor)
  });

  // Remove dots from the base text (we'll re-add cursor at the end)
  const combined = partsArray.join("").replace(/\./g, "").trim();

  // Split around the marker (if accent exists)
  const [before, after = ""] = combined.split("{{ACCENT}}");

  // Helper: convert string into span-wrapped characters (preserve spaces)
  function charsToSpans(str) {
    return str
      .split("")
      .map(ch => (ch === " " ? " " : `<span class="char">${ch}</span>`))
      .join("");
  }

  // Build accent html (each accent char wrapped, with accent class)
  const accentHTML = accent
    .split("")
    .map(c => `<span class="char accent">${c}</span>`)
    .join("");

  // Rebuild heading HTML: before chars + accent (if any) + after chars + cursor
  heading.innerHTML =
    charsToSpans(before) +
    (accent ? `<span class="accent">${accentHTML}</span>` : "") +
    charsToSpans(after) +
    cursorHTML;

  // Animate heading chars
  gsap.to(".hero-heading .char", {
    opacity: 1,
    y: 0,
    duration: 0.10,
    stagger: 0.25,
    ease: "power2.out",
    onComplete: () => {
      // show blinking dot (cursor)
      const cur = document.querySelector(".cursor");
      if (cur) cur.style.opacity = "1";

      // Animate lead after heading
      gsap.to(lead, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      // Animate buttons with stagger
      gsap.to(buttons, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.2,
        delay: 0.3
      });
    }
  });
}

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav-list");

// Toggle menu open/close
navToggle.addEventListener("click", () => {
  nav.classList.toggle("nav-open");
});

// Close menu automatically on item click
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("nav-open");
  });
});


// Auto-scroll for Why Choose Me section
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".why-container .why-grid");
  if (!grid) return;

  let scrollSpeed = 1; // px per frame (adjust speed)
  let direction = 1;   // 1 = right, -1 = left
  let raf;

  function autoScroll() {
    grid.scrollLeft += direction * scrollSpeed;

    // reverse direction when edges hit
    if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth) {
      direction = -1;
    } else if (grid.scrollLeft <= 0) {
      direction = 1;
    }

    raf = requestAnimationFrame(autoScroll);
  }

  // start
  autoScroll();

  // stop on hover
  grid.addEventListener("mouseenter", () => cancelAnimationFrame(raf));
  grid.addEventListener("mouseleave", () => autoScroll());
});

// Scroll-to-Top Button Logic
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTop");

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  } else {
    console.error('Button with id="backToTop" not found.');
  }
});

