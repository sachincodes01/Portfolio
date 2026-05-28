/* ══════════════════════════════════════════
   script.js — Sachin Lolariya Portfolio
   GSAP + ScrollTrigger + Lenis + SplitType
══════════════════════════════════════════ */

"use strict";

// ─────────────────────────────────────
// 0. Register GSAP plugins
// ─────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────
// 1. LENIS SMOOTH SCROLL
// ─────────────────────────────────────
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ─────────────────────────────────────
// 2. LOADER ANIMATION
// ─────────────────────────────────────
(function initLoader() {
  const loaderEl   = document.getElementById("loader");
  const countEl    = document.getElementById("loader-count");
  const barEl      = document.querySelector(".loader-bar");
  const overlayEl  = document.querySelector(".loader-overlay");
  const firstName  = document.querySelector(".loader-first");
  const lastName   = document.querySelector(".loader-last");

  let progress = 0;
  const tl = gsap.timeline();

  // Reveal name letters
  tl.to([firstName, lastName], {
    y: "0%",
    duration: 0.9,
    stagger: 0.15,
    ease: "power4.out",
    delay: 0.2,
  });

  // Count up to 100
  let counter = { val: 0 };
  tl.to(counter, {
    val: 100,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
      const v = Math.round(counter.val);
      countEl.textContent = v;
      barEl.style.width = v + "%";
    },
  }, "-=0.5");

  // Slide overlay up then hide loader
  tl.to(overlayEl, {
    scaleY: 1,
    transformOrigin: "bottom",
    duration: 0.6,
    ease: "power3.inOut",
  });
  tl.to(loaderEl, {
    yPercent: -100,
    duration: 0.8,
    ease: "power3.inOut",
    onComplete: () => {
      loaderEl.style.display = "none";
      document.body.style.overflow = "";
      initHero();
    },
  }, "-=0.2");

  document.body.style.overflow = "hidden";
})();

// ─────────────────────────────────────
// 3. HERO ANIMATIONS (run after loader)
// ─────────────────────────────────────
function initHero() {
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Navbar slides down
  heroTl.to("#navbar", { translateY: "0%", duration: 0.8 });

  // Eyebrow fades in
  heroTl.to("#hero-eyebrow", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4");

  // Title lines — use SplitType
  const titleLines = document.querySelectorAll(".title-line");
  titleLines.forEach((line, i) => {
    try {
      const split = new SplitType(line, { types: "chars" });
      heroTl.from(split.chars, {
        opacity: 0,
        y: "120%",
        rotateX: -80,
        stagger: 0.025,
        duration: 0.7,
        ease: "back.out(1.5)",
      }, i === 0 ? "-=0.4" : "-=0.5");
    } catch (e) {
      // Fallback: just fade in
      heroTl.from(line, { opacity: 0, y: 40, duration: 0.6 }, "-=0.4");
    }
  });

  heroTl
    .to("#hero-sub",   { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
    .to("#hero-ctas",  { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
    .to("#hero-img",   { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" }, "-=0.5")
    .to("#hero-stats", { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
    .to(".scroll-indicator", { opacity: 1, duration: 0.6 }, "-=0.3");

  // Stats counter
  document.querySelectorAll(".stat-num").forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    gsap.from({ v: 0 }, {
      v: 0,
      duration: 1.5,
      ease: "power2.out",
      onUpdate: function () {
        el.textContent = Math.round(this.targets()[0].v);
      },
      delay: 1.8,
    });
    gsap.to({ v: 0 }, {
      v: target,
      duration: 1.5,
      ease: "power2.out",
      delay: 1.8,
      onUpdate: function () {
        el.textContent = Math.round(this.targets()[0].v);
      },
    });
  });

  // Mouse parallax on hero image
  document.addEventListener("mousemove", (e) => {
    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 12;
    gsap.to("#hero-img", {
      x: xPos, y: yPos,
      duration: 1.2,
      ease: "power2.out",
    });
    gsap.to(".orb-1", {
      x: xPos * 1.5, y: yPos * 1.5,
      duration: 1.8,
      ease: "power2.out",
    });
  });
}

// ─────────────────────────────────────
// 4. NAVBAR SCROLL BEHAVIOR
// ─────────────────────────────────────
const navbar = document.getElementById("navbar");
const sections = document.querySelectorAll("section[id], footer[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  // Scrolled class
  navbar.classList.toggle("scrolled", window.scrollY > 60);

  // Back to top
  const btt = document.getElementById("backToTop");
  btt.classList.toggle("show", window.scrollY > 400);

  // Active link
  let currentSection = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) {
      currentSection = sec.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${currentSection}`
    );
  });
});

// ─────────────────────────────────────
// 5. MOBILE HAMBURGER
// ─────────────────────────────────────
const hamburger   = document.getElementById("hamburger");
const mobileNav   = document.getElementById("mobileNav");
const hamLines    = document.querySelectorAll(".ham-line");
const mobLinks    = document.querySelectorAll(".mob-link");
let menuOpen      = false;

hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  mobileNav.classList.toggle("open", menuOpen);

  if (menuOpen) {
    gsap.to(hamLines[0], { rotate: 45, y: 6.5, duration: 0.3 });
    gsap.to(hamLines[1], { opacity: 0, duration: 0.2 });
    gsap.to(hamLines[2], { rotate: -45, y: -6.5, duration: 0.3 });
    gsap.to(mobLinks, {
      y: "0%",
      stagger: 0.07,
      duration: 0.5,
      ease: "power3.out",
    });
    lenis.stop();
  } else {
    gsap.to(hamLines[0], { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(hamLines[1], { opacity: 1, duration: 0.3 });
    gsap.to(hamLines[2], { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(mobLinks, { y: "100%", stagger: 0.04, duration: 0.3 });
    lenis.start();
  }
});

mobLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (menuOpen) hamburger.click();
  });
});

// Init mob link positions
gsap.set(mobLinks, { y: "100%" });

// ─────────────────────────────────────
// 6. SCROLL-TRIGGERED SECTION REVEALS
// ─────────────────────────────────────
function revealOnScroll() {

  // Section labels + titles
  document.querySelectorAll(".reveal-title").forEach((el) => {
    try {
      const split = new SplitType(el, { types: "words" });
      gsap.from(split.words, {
        opacity: 0,
        y: 60,
        stagger: 0.07,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    } catch {
      gsap.from(el, {
        opacity: 0, y: 40, duration: 0.8,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }
  });

  // About section
  gsap.to(".reveal-left", {
    opacity: 1, x: 0, duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: ".reveal-left", start: "top 80%" },
  });
  gsap.to(".reveal-right", {
    opacity: 1, x: 0, duration: 0.9, delay: 0.15,
    ease: "power3.out",
    scrollTrigger: { trigger: ".reveal-right", start: "top 80%" },
  });

  // Skill cards — staggered entrance
  gsap.from(".skill-card-wrap", {
    opacity: 0, y: 60, stagger: 0.12,
    duration: 0.8, ease: "power3.out",
    scrollTrigger: {
      trigger: "#skills .row",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Skill bars fill on scroll
  document.querySelectorAll(".skill-fill").forEach((bar) => {
    const targetW = bar.dataset.w + "%";
    ScrollTrigger.create({
      trigger: bar,
      start: "top 85%",
      onEnter: () => {
        gsap.to(bar, { width: targetW, duration: 1.2, ease: "power2.out" });
      },
    });
  });

  // Project cards
  gsap.to(".reveal-card", {
    opacity: 1, y: 0,
    stagger: 0.1,
    duration: 0.75,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".projects-grid",
      start: "top 80%",
      toggleActions: "play none none none",
    },
  });

  // Timeline lines
  gsap.to("#tl-line-1", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "#experience .row",
      start: "top 75%",
      end: "bottom 20%",
      scrub: 0.5,
    },
  });
  gsap.to("#tl-line-2", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "#experience .row",
      start: "top 75%",
      end: "bottom 20%",
      scrub: 0.5,
    },
  });

  // Timeline cards
  document.querySelectorAll(".tl-card").forEach((card, i) => {
    gsap.to(card, {
      opacity: 1, x: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  });

  // Contact section
  gsap.from(".contact-info-item", {
    opacity: 0, x: -30, stagger: 0.1, duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-info-wrap",
      start: "top 80%",
    },
  });
  gsap.from(".contact-form", {
    opacity: 0, y: 40, duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 80%",
    },
  });
}

// ─────────────────────────────────────
// 7. GSAP PARALLAX — HERO SCROLL
// ─────────────────────────────────────
gsap.to(".hero-title", {
  yPercent: 15,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});
gsap.to(".orb-1", {
  yPercent: 30,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});
gsap.to(".orb-2", {
  yPercent: -20,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
  },
});

// ─────────────────────────────────────
// 8. PROJECT CARD TILT EFFECT
// ─────────────────────────────────────
document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect   = card.getBoundingClientRect();
    const xRel   = (e.clientX - rect.left) / rect.width - 0.5;
    const yRel   = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateX: -yRel * 6,
      rotateY:  xRel * 6,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 800,
    });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0, rotateY: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.7)",
    });
  });
});

// ─────────────────────────────────────
// 9. SMOOTH ANCHOR SCROLL
// ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.6 });
    }
  });
});

// ─────────────────────────────────────
// 10. BACK TO TOP
// ─────────────────────────────────────
document.getElementById("backToTop").addEventListener("click", () => {
  lenis.scrollTo(0, { duration: 1.6 });
});

// ─────────────────────────────────────
// 11. EMAIL COPY
// ─────────────────────────────────────
const copyBtn = document.getElementById("copyEmail");
const toast   = document.getElementById("toast");

copyBtn && copyBtn.addEventListener("click", () => {
  const email = document.getElementById("emailVal").textContent.trim();
  navigator.clipboard.writeText(email).then(() => {
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
    gsap.from(toast, { scale: 0.85, duration: 0.3, ease: "back.out(2)" });
  }).catch(() => {
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = email;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  });
});

// ─────────────────────────────────────
// 12. CONTACT FORM MOCK SUBMIT
// ─────────────────────────────────────
const sendBtn = document.getElementById("sendBtn");
sendBtn && sendBtn.addEventListener("click", () => {
  const name    = document.getElementById("fname").value.trim();
  const email   = document.getElementById("femail").value.trim();
  const message = document.getElementById("fmessage").value.trim();

  if (!name || !email || !message) {
    gsap.to(".contact-form", {
      x: [-10, 10, -8, 8, 0],
      duration: 0.4,
      ease: "power1.inOut",
    });
    return;
  }

  const btnText = document.getElementById("sendBtnText");
  const btnIcon = document.getElementById("sendIcon");

  gsap.to(sendBtn, { scale: 0.97, duration: 0.1 });
  gsap.to(sendBtn, { scale: 1, duration: 0.3, delay: 0.1 });

  btnText.textContent = "Sending...";
  btnIcon.className = "bi bi-hourglass-split ms-2";

  setTimeout(() => {
    btnText.textContent = "Message Sent!";
    btnIcon.className = "bi bi-check-circle-fill ms-2";
    gsap.from(sendBtn, { scale: 0.95, duration: 0.3, ease: "back.out(2)" });

    setTimeout(() => {
      btnText.textContent = "Send Message";
      btnIcon.className = "bi bi-send-fill ms-2";
    }, 3000);
  }, 1500);
});

// ─────────────────────────────────────
// 13. SKILL CARD HOVER GLOW
// ─────────────────────────────────────
document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0.04) 60%)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.background = "";
  });
});

// ─────────────────────────────────────
// 14. INIT ALL SCROLL ANIMATIONS
// ─────────────────────────────────────
// Wait a tick so DOM is settled
window.addEventListener("load", () => {
  revealOnScroll();
});

// ─────────────────────────────────────
// 15. SECTION LABEL REVEAL
// ─────────────────────────────────────
document.querySelectorAll(".section-label").forEach((el) => {
  gsap.from(el, {
    opacity: 0, x: -20, duration: 0.6, ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 88%" },
  });
});

// ─────────────────────────────────────
// 16. MARQUEE HOVER PAUSE
// ─────────────────────────────────────
const marqueeTrack = document.getElementById("marqueeTrack");
if (marqueeTrack) {
  marqueeTrack.addEventListener("mouseenter", () => {
    marqueeTrack.style.animationPlayState = "paused";
  });
  marqueeTrack.addEventListener("mouseleave", () => {
    marqueeTrack.style.animationPlayState = "running";
  });
}

// ─────────────────────────────────────
// 17. FOOTER REVEAL
// ─────────────────────────────────────
gsap.from(".footer-inner > *", {
  opacity: 0, y: 20, stagger: 0.1, duration: 0.7, ease: "power2.out",
  scrollTrigger: { trigger: "#footer", start: "top 90%" },
});
