const track = document.getElementById("projectsTrack");
const prev = document.querySelector(".project-arrow.prev");
const next = document.querySelector(".project-arrow.next");
const dotsContainer = document.getElementById("projectsDots");

if (track && prev && next && dotsContainer) {
  const items = [...track.querySelectorAll(".project-item")];
  let pages = [];

  function getPages() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const positions = items.map(item =>
      Math.min(item.offsetLeft - items[0].offsetLeft, maxScroll)
    );

    return [...new Set(positions.map(p => Math.max(0, p)))];
  }

  function currentPage() {
    let closest = 0;
    let distance = Infinity;

    pages.forEach((position, index) => {
      const difference = Math.abs(track.scrollLeft - position);
      if (difference < distance) {
        distance = difference;
        closest = index;
      }
    });

    return closest;
  }

  function updateDots() {
    const active = currentPage();

    [...dotsContainer.children].forEach((dot, index) => {
      dot.classList.toggle("active", index === active);
      dot.setAttribute("aria-current", index === active ? "true" : "false");
    });
  }

  function scrollToPage(index) {
    if (!pages.length) return;
    const target = Math.max(0, Math.min(index, pages.length - 1));
    track.scrollTo({ left: pages[target], behavior: "smooth" });
  }

  function buildDots() {
    pages = getPages();
    dotsContainer.innerHTML = "";

    pages.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to project position ${index + 1}`);
      dot.addEventListener("click", () => scrollToPage(index));
      dotsContainer.appendChild(dot);
    });

    updateDots();
  }

  prev.addEventListener("click", () => {
    scrollToPage(currentPage() - 1);
  });

  next.addEventListener("click", () => {
    scrollToPage(currentPage() + 1);
  });

  track.addEventListener("wheel", event => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >=
      track.scrollWidth - track.clientWidth - 1;

    if ((event.deltaY < 0 && atStart) ||
        (event.deltaY > 0 && atEnd)) return;

    event.preventDefault();
    track.scrollLeft += event.deltaY;
  }, { passive: false });

  track.addEventListener("scroll", updateDots, { passive: true });
  window.addEventListener("resize", buildDots);

  buildDots();
}

const inspoGallery = document.querySelector(".inspo-gallery");

if (inspoGallery) {
  inspoGallery.addEventListener("wheel", event => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    const maxScroll = inspoGallery.scrollWidth - inspoGallery.clientWidth;
    const canScroll = event.deltaY > 0
      ? inspoGallery.scrollLeft < maxScroll - 1
      : inspoGallery.scrollLeft > 1;

    if (!canScroll) return;

    event.preventDefault();
    inspoGallery.scrollBy({ left: event.deltaY, behavior: "auto" });
  }, { passive: false });
}

const projectDetailLinks = document.querySelectorAll(
  '.project-link[href^="#"][href$="-project"]'
);
const projectDetailSections = document.querySelectorAll(".project-detail");

projectDetailLinks.forEach(link => {
  const projectDetails = document.querySelector(link.getAttribute("href"));
  if (!projectDetails) return;

  if (window.location.hash === `#${projectDetails.id}`) {
    projectDetailSections.forEach(section => {
      section.hidden = section !== projectDetails;
    });
    projectDetails.hidden = false;
  }

  link.addEventListener("click", event => {
    event.preventDefault();
    projectDetailSections.forEach(section => {
      section.hidden = section !== projectDetails;
    });
    projectDetails.hidden = false;
    history.pushState(null, "", `#${projectDetails.id}`);
    projectDetails.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

/* SIX CALENDARS CAROUSEL */

const calendarTrack = document.querySelector(
  '#calendar-project .calendar-gallery-track'
);

const calendarPrev = document.querySelector(
  '#calendar-project .calendar-gallery-prev'
);

const calendarNext = document.querySelector(
  '#calendar-project .calendar-gallery-next'
);

if (calendarTrack && calendarPrev && calendarNext) {

  function moveCalendar(direction) {
    const item = calendarTrack.querySelector(
      '.calendar-gallery-item'
    );

    if (!item) return;

    const gap = parseFloat(
      getComputedStyle(calendarTrack).columnGap
    ) || 0;

    const distance = item.getBoundingClientRect().width + gap;

    calendarTrack.scrollBy({
      left: direction * distance,
      behavior: 'smooth'
    });
  }

  calendarPrev.addEventListener('click', () => {
    moveCalendar(-1);
  });

  calendarNext.addEventListener('click', () => {
    moveCalendar(1);
  });

}

/* ==================================
   BACK TO PROJECTS — ALL PROJECTS
================================== */

const backToProjectsLinks = document.querySelectorAll(
  '.project-detail-back[href="#projects"]'
);

const projectsSection = document.getElementById("projects");

backToProjectsLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    projectDetailSections.forEach(section => {
      section.hidden = true;
    });

    history.pushState(null, "", "#projects");

    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
});