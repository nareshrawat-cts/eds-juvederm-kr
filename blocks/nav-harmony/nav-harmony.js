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

  // Brand (row 1) — keep the authored link, but swap its text for the official
  // HArmonyCa logo lockup (SVG). The SVG is a code asset (served from /icons/),
  // NOT a content image — an <img src> to an .svg in the fragment gets mangled
  // by the media pipeline, so the logo is injected here instead.
  const brand = document.createElement('div');
  brand.className = 'nav-harmony-brand';
  if (brandRow) {
    const cell = brandRow.firstElementChild || brandRow;
    while (cell.firstChild) brand.append(cell.firstChild);
  }
  const brandLink = brand.querySelector('a');
  if (brandLink) {
    const label = brandLink.textContent.trim() || 'HArmonyCa';
    const logo = document.createElement('img');
    logo.src = `${window.hlx.codeBasePath}/icons/harmony-logo.svg`;
    logo.alt = label;
    logo.className = 'nav-harmony-logo';
    logo.width = 109;
    logo.height = 51;
    brandLink.replaceChildren(logo);
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
