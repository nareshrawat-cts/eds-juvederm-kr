/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards.
 * Source: https://www.juvederm.co.kr/juvederm/story.php (section.story_juvederm .story_juvederm_in),
 *         https://www.juvederm.co.kr/product/volbella.php (section.product_juvederm ul.feature_list)
 * Generated: 2026-07-31
 *
 * Block library structure: 2 columns, one row per card.
 *  - Row 1: block name
 *  - Each card row: [image/icon] | [text: eyebrow + title + description]
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
  // Card items. Two known layouts:
  //   product page: <ul class="feature_list"><li>… (imgArea + txtArea)
  //   story page:   <dl class="one"><dt><img></dt><dd><p></dd></dl> (repeated)
  // Select the card containers directly — never their children — to avoid
  // duplicate rows. A standalone header image (.img with no dt/dd) is not a card.
  let cardEls = Array.from(element.querySelectorAll(':scope > li'));
  if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll(':scope > dl'));
  if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll('li'));
  if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll('dl'));
  // Cards must contain an image; drops any non-card containers.
  cardEls = cardEls.filter((el) => el && el.querySelector('img'));

  const cells = [];
  cardEls.forEach((card) => {
    // Image lives in the icon/image area (dt for dl cards).
    const imageEl = resolveImg(document, card.querySelector('.imgArea img, dt img, .img img, img'));

    const textCell = [];
    // Text area: .txtArea, or the dd for dl cards; fall back to the card itself.
    const txt = card.querySelector('.txtArea') || card.querySelector('dd') || card;
    // Eyebrow / small label.
    Array.from(txt.querySelectorAll('small, .point')).forEach((s) => {
      if (s.textContent.trim()) textCell.push(s);
    });
    Array.from(txt.querySelectorAll('h1, h2, h3, h4, h5, h6')).forEach((h) => textCell.push(h));
    Array.from(txt.querySelectorAll('p')).forEach((p) => {
      if (p.textContent.trim()) textCell.push(p);
    });
    const cta = txt.querySelector('a[href]');
    if (cta && cta.getAttribute('href')) {
      const link = document.createElement('a');
      link.href = cta.getAttribute('href');
      link.textContent = cta.textContent.replace(/\s+/g, ' ').trim();
      textCell.push(link);
    }

    if (!imageEl && textCell.length === 0) return;
    cells.push([imageEl || '', textCell.length ? textCell : '']);
  });

  // Empty-block guard
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
