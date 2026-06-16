const revealItems = document.querySelectorAll(".reveal");
const backToTop = document.querySelector(".back-to-top");

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

const showVisibleRevealItems = () => {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isNearViewport = rect.top < window.innerHeight * 1.05 && rect.bottom > -window.innerHeight * 0.1;

    if (isNearViewport) {
      item.classList.add("is-visible");
    }
  });
};

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

showVisibleRevealItems();
window.addEventListener("load", showVisibleRevealItems, { once: true });

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
