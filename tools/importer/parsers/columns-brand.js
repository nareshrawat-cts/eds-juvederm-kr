/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-brand. Base: columns.
 * Source: https://www.juvederm.co.kr (#about)
 * Generated: 2026-07-31
 *
 * Block library structure: multiple columns. Second row defines the column count.
 * This variant is a 2-column layout: [image] | [text: headings + CTA].
 */
export default function parse(element, { document }) {
  // --- Image column ---
  let imageEl;
  const imgSource = element.querySelector('.imgArea img, .imgArea .img img, img');
  if (imgSource) {
    const src = imgSource.getAttribute('src')
      || imgSource.getAttribute('data-src')
      || imgSource.getAttribute('data-original');
    if (src) {
      imageEl = document.createElement('img');
      imageEl.src = src;
      if (imgSource.getAttribute('alt')) imageEl.alt = imgSource.getAttribute('alt');
    }
  }
  if (!imageEl) {
    // The image may be a CSS background (inline style or stylesheet-driven).
    const bgEl = element.querySelector('.imgArea .img, .imgArea [style*="url"], .imgArea');
    if (bgEl) {
      let url;
      const inline = (bgEl.getAttribute('style') || '').match(/url\((['"]?)([^'")]+)\1\)/i);
      if (inline) {
        url = inline[2];
      } else if (typeof getComputedStyle === 'function') {
        const computed = getComputedStyle(bgEl).backgroundImage;
        const cm = computed && computed.match(/url\((['"]?)([^'")]+)\1\)/i);
        if (cm) url = cm[2];
      }
      if (url) {
        imageEl = document.createElement('img');
        imageEl.src = url;
      }
    }
  }

  // --- Text column ---
  // Prefer the inner text wrapper; fall back to the outer text area.
  const txtArea = element.querySelector('.txtArea_in') || element.querySelector('.txtArea');
  const textCell = [];
  if (txtArea) {
    const headings = Array.from(txtArea.querySelectorAll('h1, h2, h3, h4'));
    headings.forEach((h) => textCell.push(h));
    // CTA link
    const ctaSource = txtArea.querySelector('.btnArea a[href], a[href]');
    if (ctaSource && ctaSource.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = ctaSource.getAttribute('href');
      cta.textContent = ctaSource.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(cta);
    }
  }

  // Empty-block guard
  if (!imageEl && textCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // One row, two columns: image | text.
  const cells = [[imageEl || '', textCell.length ? textCell : '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-brand', cells });
  element.replaceWith(block);
}
