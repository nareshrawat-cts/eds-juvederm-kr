/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.juvederm.co.kr/juvederm/story.php, /product/volbella.php (#visual)
 * Generated: 2026-07-31
 *
 * Block library structure: 1 column, 3 rows.
 *  - Row 1: block name
 *  - Row 2: background image (optional)
 *  - Row 3: title (heading), subheading, CTA (optional)
 */
export default function parse(element, { document }) {
  // Background image: prefer the desktop (PC) asset. The asset may be an <img>
  // or a CSS inline background:url() on a .v_bg div.
  let bgSrc;
  let bgAlt;
  const imgSource = element.querySelector('.visual-pc img, .v_bg img, .visual-mo img, img[class*="bg"]');
  if (imgSource) {
    bgSrc = imgSource.getAttribute('src')
      || imgSource.getAttribute('data-src')
      || imgSource.getAttribute('data-original');
    bgAlt = imgSource.getAttribute('alt');
  }
  if (!bgSrc) {
    // Extract url(...) from an inline background style (desktop preferred).
    const bgEl = element.querySelector('.visual-pc .v_bg[style], .visual-pc [style*="url"], .v_bg[style*="url"], [style*="background"][style*="url"]');
    if (bgEl) {
      const m = (bgEl.getAttribute('style') || '').match(/url\((['"]?)([^'")]+)\1\)/i);
      if (m) bgSrc = m[2];
    }
  }
  let bgImage;
  if (bgSrc) {
    bgImage = document.createElement('img');
    bgImage.src = bgSrc;
    if (bgAlt) bgImage.alt = bgAlt;
  }

  // Content: title heading + optional subheading + optional CTA.
  const heading = element.querySelector('.v_txt h1, .v_txt h2, .v_txt h3, .basic_in h1, .basic_in h2, .basic_in h3, h1, h2, h3');
  const subheading = element.querySelector('.v_txt p, .basic_in p');
  const ctaLinks = Array.from(element.querySelectorAll('.v_txt a[href], .basic_in a[href]'));

  const cells = [];

  // Row 2: background image
  if (bgImage) cells.push([bgImage]);

  // Row 3: content cell (single column -> all content in one cell)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  ctaLinks.forEach((a) => contentCell.push(a));

  // Empty-block guard
  if (cells.length === 0 && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (contentCell.length > 0) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
