/*
 * nav-harmony — standalone HarmonyCa site navigation.
 *
 * Authored structure (two rows, embedded directly in the block or loaded as a
 * fragment): row 1 = brand link; row 2 = a <ul> of nav links.
 *   | nav-harmony |
 *   | [HArmonyCa](/harmony-home) |
 *   | - [The Science](/the-science)
 *     - [Before & After](/before-and-after)
 *     - ...
 *
 * Decorates into: white bar with the wordmark left, links right, and a mobile
 * hamburger that toggles a link drawer. Independent of the Juvederm `header`.
 */

const isDesktop = window.matchMedia('(min-width: 900px)');

export default function decorate(block) {
  const rows = [...block.children];
  const brandRow = rows[0];
  const linksRow = rows[1];

  const inner = document.createElement('div');
  inner.className = 'nav-harmony-inner';

  // Brand (row 1) — keep its markup (wordmark span / logo img) intact.
  const brand = document.createElement('div');
  brand.className = 'nav-harmony-brand';
  if (brandRow) {
    const cell = brandRow.firstElementChild || brandRow;
    while (cell.firstChild) brand.append(cell.firstChild);
  }

  // Elliptical logo mark (Figma: a ring encircling the whole HArmonyCa
  // wordmark — solid blue ellipse with an orange dotted arc across the top).
  // Recreated as an inline SVG overlay behind the wordmark, unless the
  // fragment already supplies a logo <img>.
  const brandLink = brand.querySelector('a');
  if (brandLink && !brandLink.querySelector('img, svg')) {
    const mark = document.createElement('span');
    mark.className = 'nav-harmony-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = `<svg viewBox="0 0 200 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="30" rx="97" ry="27" stroke="#00a3e0" stroke-width="2"/>
      <path d="M12 18.6 A 97 27 0 0 1 174 12.6" stroke="#eb6f31" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.5 7"/>
    </svg>`;
    brandLink.prepend(mark);
  }

  // Links (row 2) — reuse the authored <ul>, just class it.
  const links = (linksRow && linksRow.querySelector('ul')) || document.createElement('ul');
  links.className = 'nav-harmony-links';

  // Hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-harmony-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-controls', 'nav-harmony');
  hamburger.innerHTML = '<span></span>';

  const setExpanded = (expanded) => {
    block.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    hamburger.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  };
  hamburger.addEventListener('click', () => {
    setExpanded(block.getAttribute('aria-expanded') !== 'true');
  });
  isDesktop.addEventListener('change', () => setExpanded(false));

  inner.append(brand, links, hamburger);

  block.textContent = '';
  block.id = 'nav-harmony';
  block.setAttribute('aria-expanded', 'false');
  block.append(inner);
}
