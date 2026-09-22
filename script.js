const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const workTrack = document.getElementById("workTrack");
const workDots = document.getElementById("workDots");
const workPrev = document.getElementById("workPrev");
const workNext = document.getElementById("workNext");

if (workTrack) {
  const slides = Array.from(workTrack.children);
  let index = 0;
  let dragStartX = 0;
  let dragDeltaX = 0;
  let isDragging = false;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${i + 1}번째 사진 보기`);
    dot.addEventListener("click", () => goTo(i));
    workDots.appendChild(dot);
  });
  const dots = Array.from(workDots.children);

  function render() {
    workTrack.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  workPrev.addEventListener("click", () => goTo(index - 1));
  workNext.addEventListener("click", () => goTo(index + 1));

  workTrack.addEventListener("pointerdown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragDeltaX = 0;
    workTrack.classList.add("is-dragging");
    workTrack.setPointerCapture(e.pointerId);
  });

  workTrack.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    dragDeltaX = e.clientX - dragStartX;
    const percent = (dragDeltaX / workTrack.clientWidth) * 100;
    workTrack.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    workTrack.classList.remove("is-dragging");
    const threshold = workTrack.clientWidth * 0.15;
    if (dragDeltaX > threshold) {
      goTo(index - 1);
    } else if (dragDeltaX < -threshold) {
      goTo(index + 1);
    } else {
      render();
    }
  }

  workTrack.addEventListener("pointerup", endDrag);
  workTrack.addEventListener("pointercancel", endDrag);
  workTrack.addEventListener("pointerleave", () => {
    if (isDragging) endDrag();
  });

  render();
}
