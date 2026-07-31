/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base: cards.
 * Source: https://www.juvederm.co.kr (#collection .collection_roll)
 * Generated: 2026-07-31
 *
 * Block library structure: 2 columns, one row per card.
 *  - Row 1: block name
 *  - Each card row: [image] | [text: title + product image + CTA]
 *
 * The source is a slick carousel that clones cards (slick-cloned).
 * Clones are filtered and cards de-duplicated by link href.
 */
function resolveImg(document, source) {
  if (!source) return undefined;
  const src = source.getAttribute('src')
    || source.getAttribute('data-src')
    || source.getAttribute('data-lazy')
    || source.getAttribute('data-original');
  if (src) {
    const img = document.createElement('img');
    img.src = src;
    if (source.getAttribute('alt')) img.alt = source.getAttribute('alt');
    return img;
  }
  // CSS background fallback (inline or computed).
  const inline = (source.getAttribute('style') || '').match(/url\((['"]?)([^'")]+)\1\)/i);
  if (inline) {
    const img = document.createElement('img');
    img.src = inline[2];
    return img;
  }
  return undefined;
}

export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll('.roll, .slick-slide'))
    // Drop slick's cloned slides.
    .filter((c) => !c.classList.contains('slick-cloned'));

  const cells = [];
  const seen = new Set();

  cardEls.forEach((card) => {
    const link = card.querySelector('a[href]');
    const href = link && link.getAttribute('href');

    // Main card image: the background image behind the product.
    let imageEl = resolveImg(document, card.querySelector('.pro_bg .img img, .pro_bg img'));
    if (!imageEl) {
      const bgDiv = card.querySelector('.pro_bg .img, .pro_bg [style*="url"]');
      imageEl = resolveImg(document, bgDiv);
    }

    // De-dupe by href (fallback to image src) to avoid slick repeats.
    const key = href || (imageEl && imageEl.src);
    if (!key || seen.has(key)) return;
    seen.add(key);

    // Text cell: title heading + product image + CTA.
    const textCell = [];
    const info = card.querySelector('.pro_info') || card;
    Array.from(info.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach((h) => textCell.push(h));
    const productImg = resolveImg(document, info.querySelector('.product_img img'));
    if (productImg) textCell.push(productImg);
    if (href) {
      const cta = document.createElement('a');
      cta.href = href;
      const label = (info.querySelector('h1, h2, h3, h4, h5, h6') || {}).textContent
        || link.textContent;
      cta.textContent = (label || href).replace(/\s+/g, ' ').trim();
      textCell.push(cta);
    }

    if (!imageEl && textCell.length === 0) return;
    cells.push([imageEl || '', textCell.length ? textCell : '']);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
