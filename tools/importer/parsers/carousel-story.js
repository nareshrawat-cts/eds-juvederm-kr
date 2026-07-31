/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-story. Base: carousel.
 * Source: https://www.juvederm.co.kr (#story .story_roll)
 * Generated: 2026-07-31
 *
 * Block library structure: 2 columns, one row per slide.
 *  - Row 1: block name
 *  - Each slide row: [image] | [text: title/description/CTA]
 *
 * The source is a Swiper carousel that clones slides (swiper-slide-duplicate).
 * Duplicates are filtered out and slides de-duplicated by image src.
 */
export default function parse(element, { document }) {
  const slideEls = Array.from(element.querySelectorAll('.swiper-slide, .story_slide'))
    // Drop only Swiper's exact clone slides. Note: modifier classes like
    // "swiper-slide-duplicate-prev" are real slides, so match the exact class,
    // not a substring. The src-based de-dupe below removes any remaining repeats.
    .filter((s) => !s.classList.contains('swiper-slide-duplicate'));

  const cells = [];
  const seen = new Set();

  slideEls.forEach((slide) => {
    const imgSource = slide.querySelector('.img img, img');
    let imageEl;
    let key;
    if (imgSource) {
      const src = imgSource.getAttribute('src')
        || imgSource.getAttribute('data-src')
        || imgSource.getAttribute('data-original');
      if (src) {
        key = src;
        imageEl = document.createElement('img');
        imageEl.src = src;
        if (imgSource.getAttribute('alt')) imageEl.alt = imgSource.getAttribute('alt');
      }
    }

    // Skip slides without an image (mandatory) or already-seen images.
    if (!imageEl || seen.has(key)) return;
    seen.add(key);

    // Text cell: heading(s), description, optional CTA.
    const textCell = [];
    const txt = slide.querySelector('.txt') || slide.querySelector('.inner') || slide;
    Array.from(txt.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach((h) => textCell.push(h));
    Array.from(txt.querySelectorAll('p')).forEach((p) => textCell.push(p));
    const cta = txt.querySelector('a[href]');
    if (cta && cta.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = cta.getAttribute('href');
      link.textContent = cta.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(link);
    }

    cells.push([imageEl, textCell.length ? textCell : '']);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-story', cells });
  element.replaceWith(block);
}
