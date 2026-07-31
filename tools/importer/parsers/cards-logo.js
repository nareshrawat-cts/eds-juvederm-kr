/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-logo. Base: cards.
 * Source: https://www.juvederm.co.kr/juvederm/story.php (section.story_safety ul.story_product),
 *         https://www.juvederm.co.kr/product/volbella.php (section.product_cut)
 * Generated: 2026-07-31
 *
 * Block library structure: 2 columns, one row per card.
 *  - Row 1: block name
 *  - Each card row: [image/logo] | [optional caption text]
 *
 * These are image/logo cards. Each card is essentially a single image; any
 * caption comes from alt text or an adjacent text node.
 */
function resolveImg(document, source) {
  if (!source) return undefined;
  const src = source.getAttribute('src')
    || source.getAttribute('data-src')
    || source.getAttribute('data-original');
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    if (source.getAttribute('alt')) img.alt = source.getAttribute('alt');
    return img;
  }
  return undefined;
}

export default function parse(element, { document }) {
  // Card containers: <li> logo items or <div class="cut"> image blocks.
  let cardEls = Array.from(element.querySelectorAll(':scope > li, :scope ul > li, :scope > .cut, :scope .cut'));
  if (cardEls.length === 0) {
    // Fallback: each image is its own card.
    cardEls = Array.from(element.querySelectorAll('img')).map((img) => img.closest('li, .cut') || img);
  }
  // De-dupe.
  cardEls = cardEls.filter((el, i, arr) => el && arr.indexOf(el) === i);

  const cells = [];
  cardEls.forEach((card) => {
    const imgSource = card.tagName === 'IMG' ? card : card.querySelector('img');
    const imageEl = resolveImg(document, imgSource);
    if (!imageEl) return;

    // Optional caption text (title/description), excluding empty nodes.
    const textCell = [];
    const txt = card.querySelector('.txtArea, dd, figcaption');
    if (txt) {
      Array.from(txt.querySelectorAll('h1, h2, h3, h4, h5, h6, p, small')).forEach((n) => {
        if (n.textContent.trim()) textCell.push(n);
      });
    }

    cells.push([imageEl, textCell.length ? textCell : '']);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-logo', cells });
  element.replaceWith(block);
}
