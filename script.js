const revealItems = document.querySelectorAll(".reveal");
const colorInputs = document.querySelectorAll("[data-color-var]");
const colorReset = document.querySelector(".color-reset");
const backToTop = document.querySelector(".back-to-top");

const defaultColors = {
  "--bg": "#070908",
  "--surface": "#101513",
  "--text": "#f2fbf6",
  "--mint": "#6defc0",
  "--cyan": "#7ddde7",
  "--amber": "#efc96d",
};

const setThemeColor = (variable, value) => {
  document.documentElement.style.setProperty(variable, value);

  if (variable === "--surface") {
    document.documentElement.style.setProperty("--surface-2", value);
    document.documentElement.style.setProperty("--surface-3", value);
  }
};

colorInputs.forEach((input) => {
  const variable = input.dataset.colorVar;
  const savedValue = localStorage.getItem(`portfolio-color-${variable}`);

  if (savedValue) {
    input.value = savedValue;
    setThemeColor(variable, savedValue);
  }

  input.addEventListener("input", () => {
    setThemeColor(variable, input.value);
    localStorage.setItem(`portfolio-color-${variable}`, input.value);
  });
});

colorReset?.addEventListener("click", () => {
  Object.entries(defaultColors).forEach(([variable, value]) => {
    setThemeColor(variable, value);
    localStorage.removeItem(`portfolio-color-${variable}`);

    const input = document.querySelector(`[data-color-var="${variable}"]`);
    if (input) {
      input.value = value;
    }
  });
});

const updateBackToTop = () => {
  if (!backToTop) return;

  const scrollPosition = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  backToTop.classList.toggle("is-visible", scrollPosition > pageHeight * 0.72);
};

const fastScrollToTop = () => {
  const start = window.scrollY;
  const duration = Math.min(850, Math.max(420, start * 0.22));
  const startedAt = performance.now();

  const easeOutCubic = (value) => 1 - Math.pow(1 - value, 3);

  const step = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    window.scrollTo(0, start * (1 - easeOutCubic(progress)));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};

backToTop?.addEventListener("click", fastScrollToTop);
window.addEventListener("scroll", updateBackToTop, { passive: true });
window.addEventListener("resize", updateBackToTop);
updateBackToTop();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px",
  },
);

revealItems.forEach((item) => revealObserver.observe(item));

const cursorDot = document.querySelector(".cursor-dot");
const cursorCard = document.querySelector(".cursor-card");
const cursorTargets = document.querySelectorAll("[data-cursor]");
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (finePointer && cursorDot && cursorCard) {
  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const renderCursor = () => {
    dotX += (mouseX - dotX) * 0.22;
    dotY += (mouseY - dotY) * 0.22;

    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    cursorCard.style.left = `${mouseX + 18}px`;
    cursorCard.style.top = `${mouseY + 18}px`;

    requestAnimationFrame(renderCursor);
  };

  renderCursor();

  cursorTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => {
      cursorCard.textContent = target.dataset.cursor;
      cursorDot.classList.add("is-active");
      cursorCard.classList.add("is-active");
    });

    target.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("is-active");
      cursorCard.classList.remove("is-active");
    });
  });
}
