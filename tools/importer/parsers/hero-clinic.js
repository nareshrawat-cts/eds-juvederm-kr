/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-clinic. Base: hero.
 * Source: https://www.juvederm.co.kr (#find)
 * Generated: 2026-07-31
 *
 * Block library structure: 1 column, 3 rows.
 *  - Row 1: block name
 *  - Row 2: background image (optional)
 *  - Row 3: title (heading), subheading, CTA (optional)
 */
export default function parse(element, { document }) {
  // Background image: the large imagery in .imgArea (fallback to the clinic thumbnail).
  const bgSource = element.querySelector('.imgArea img, .imgArea .img img, .txtArea dt img');
  let bgImage;
  if (bgSource) {
    // Resolve lazy-loaded images whose real URL sits in a data-* attribute.
    const src = bgSource.getAttribute('src')
      || bgSource.getAttribute('data-src')
      || bgSource.getAttribute('data-original');
    if (src) {
      bgImage = document.createElement('img');
      bgImage.src = src;
      if (bgSource.getAttribute('alt')) bgImage.alt = bgSource.getAttribute('alt');
    }
  }

  // Title headings live in the text area (split across multiple h4s).
  const headings = Array.from(element.querySelectorAll('.txtArea dt h4, .txtArea h1, .txtArea h2, .txtArea h3, .txtArea h4'));

  // CTA: the wrapping anchor with the "detail" label.
  const ctaSource = element.querySelector('.txtArea a[href], a[href]');
  let cta;
  if (ctaSource && ctaSource.getAttribute('href')) {
    cta = document.createElement('a');
    cta.href = ctaSource.getAttribute('href');
    const label = element.querySelector('.txtArea dd p, .txtArea dd');
    cta.textContent = (label ? label.textContent : ctaSource.textContent).replace(/\s+/g, ' ').trim();
  }

  const cells = [];

  // Row 2: background image
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell (single column -> all content in one cell)
  const contentCell = [];
  headings.forEach((h) => contentCell.push(h));
  if (cta) contentCell.push(cta);

  // Empty-block guard
  if (cells.length === 0 && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (contentCell.length > 0) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-clinic', cells });
  element.replaceWith(block);
}
