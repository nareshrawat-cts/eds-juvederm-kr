import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Recompute each slide's offset from the active slide so the CSS coverflow
 * can position it (centre = 0, immediate neighbours = ±1, hidden otherwise).
 * @param {Element} block the carousel-story block
 */
function updateCoverflow(block) {
  const slides = [...block.querySelectorAll('.carousel-story-slide')];
  const total = slides.length;
  const active = parseInt(block.dataset.activeSlide || '0', 10);

  slides.forEach((slide, idx) => {
    let offset = idx - active;
    // wrap so the shortest direction is used (enables the loop feel)
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    slide.dataset.offset = offset;

    const isActive = offset === 0;
    slide.setAttribute('aria-hidden', !isActive);
    slide.querySelectorAll('a').forEach((link) => {
      if (!isActive) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });
}

/**
 * Show the slide at the given index (wraps around at both ends).
 * @param {Element} block the carousel-story block
 * @param {number} slideIndex target index
 */
export function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-story-slide');
  const total = slides.length;
  let real = slideIndex;
  if (slideIndex < 0) real = total - 1;
  if (slideIndex >= total) real = 0;
  block.dataset.activeSlide = real;
  updateCoverflow(block);
}

function bindEvents(block) {
  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  // advance/retreat by clicking the peeking neighbour cards
  block.querySelectorAll('.carousel-story-slide').forEach((slide) => {
    slide.addEventListener('click', () => {
      const offset = parseInt(slide.dataset.offset || '0', 10);
      if (offset !== 0) {
        showSlide(block, parseInt(block.dataset.activeSlide, 10) + offset);
      }
    });
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-story-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-story-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-story-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-story-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const container = document.createElement('div');
  container.classList.add('carousel-story-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-story-slides');

  if (!isSingleSlide) {
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-story-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class="slide-prev" aria-label="Previous Slide"><span>PREV</span></button>
      <button type="button" class="slide-next" aria-label="Next Slide"><span>NEXT</span></button>
    `;
    container.append(slideNavButtons);
  }

  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    moveInstrumentation(row, slide);
    slidesWrapper.append(slide);
    row.remove();
  });

  container.append(slidesWrapper);
  block.prepend(container);

  block.dataset.activeSlide = 0;
  updateCoverflow(block);

  if (!isSingleSlide) {
    bindEvents(block);
  }

  // Entrance animation: fade/slide the slider up when it scrolls into view
  // (mirrors the source AOS "fade-up" on #story .story_wrap).
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        block.classList.add('in-view');
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });
  observer.observe(block);
}
