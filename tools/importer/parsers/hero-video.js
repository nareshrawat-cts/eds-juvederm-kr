/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-video. Base: hero.
 * Source: https://www.juvederm.co.kr (#visual)
 * Generated: 2026-07-31
 *
 * Block library structure: 1 column, 3 rows.
 *  - Row 1: block name
 *  - Row 2: background asset (video/image) — optional
 *  - Row 3: title (heading), subheading, CTA — optional
 */
export default function parse(element, { document }) {
  // Background asset: video iframe or image. Extract the video URL as a link so it can be embedded.
  const iframe = element.querySelector('iframe[src*="vimeo"], iframe[src*="youtube"], iframe.vimeo_iframe, .v_bg iframe');
  const bgImage = element.querySelector('.v_bg img, .visual_in img, img[class*="bg"]');

  // Content: title heading + optional subheading + optional CTA
  const heading = element.querySelector('.v_txt h1, .v_txt h2, h1, h2, [class*="title"]');
  const subheading = element.querySelector('.v_txt p, .basic_in p');
  // Scroll-down / control anchors are UI, not real CTAs — exclude them.
  const ctaLinks = Array.from(element.querySelectorAll('.v_txt a, .basic_in a'))
    .filter((a) => !a.classList.contains('scroll_down') && !a.closest('.video_control'));

  const cells = [];

  // Row 2: background asset (video link preferred, else image)
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    cells.push([link]);
  } else if (bgImage) {
    cells.push([bgImage]);
  }

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

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}
