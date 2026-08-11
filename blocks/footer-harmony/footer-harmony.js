/*
 * footer-harmony — standalone HarmonyCa site footer.
 * Built from the Figma "Home - Overview" footer (87:455). Its own block,
 * independent of the Juvederm `footer` block (which the `footer` block
 * delegates away from for harmony pages).
 *
 * Authored fragment rows:
 *   1. top    : [ Find a Clinic link ] , [ Instagram + Facebook links ]
 *   2. mid    : [ column links <ul> ] , HArmonyCa wordmark , Allergan line
 *   3. legal  : row of legal links
 *   4. text   : legal / disclaimer paragraphs
 *
 * Decorates into: dark-navy footer with a pill CTA + social icons (top row),
 * a divider, column links + two-tone logos (mid row), a divider, centred
 * legal links, small-print paragraphs, and a decorative dotted arc.
 */

const IG = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/></svg>';
const FB = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H6v3h2v8h3v-8h2.5l.5-3H11V7.5A1.5 1.5 0 0 1 12.5 6H15V3z"/></svg>';

export default function decorate(block) {
  const rows = [...block.children];
  const [topRow, midRow, legalRow, textRow] = rows;

  // ---- Top row: pill CTA (left) + socials (right) ----
  // EDS delivers the row's content as paragraphs inside a single cell: the
  // first <p> is the CTA link, the second holds the social links.
  const top = document.createElement('div');
  top.className = 'footer-harmony-top';
  if (topRow) {
    const cell = topRow.firstElementChild || topRow;
    const paras = [...cell.querySelectorAll(':scope > p')];
    const ctaP = paras[0];
    const socialsP = paras[1];

    if (ctaP) {
      const cta = document.createElement('div');
      cta.className = 'footer-harmony-cta';
      const a = ctaP.querySelector('a');
      if (a) a.classList.add('footer-harmony-pill');
      cta.append(ctaP);
      top.append(cta);
    }
    if (socialsP) {
      socialsP.className = 'footer-harmony-socials';
      socialsP.querySelectorAll('a').forEach((a) => {
        const label = (a.getAttribute('aria-label') || a.textContent).toLowerCase();
        a.textContent = '';
        const isFb = label.includes('face');
        a.setAttribute('aria-label', isFb ? 'Facebook' : 'Instagram');
        a.innerHTML = isFb ? FB : IG;
      });
      top.append(socialsP);
    }
  }

  // ---- Mid row: column links (left) + logos (right) ----
  const mid = document.createElement('div');
  mid.className = 'footer-harmony-mid';
  if (midRow) {
    const links = midRow.querySelector('ul');
    const cols = document.createElement('div');
    cols.className = 'footer-harmony-cols';
    if (links) { links.className = 'footer-harmony-collinks'; cols.append(links); }

    const brand = document.createElement('div');
    brand.className = 'footer-harmony-brand';
    // Remaining paragraphs after the ul are the logo lines.
    midRow.querySelectorAll('p').forEach((p) => brand.append(p));

    // Add the arc ring mark around the HArmonyCa wordmark (all white here,
    // matching the Figma footer logo — no blue "Ca" accent in the footer).
    const wordmark = brand.querySelector('strong');
    if (wordmark && !wordmark.querySelector('.footer-harmony-mark')) {
      const mark = document.createElement('span');
      mark.className = 'footer-harmony-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.innerHTML = `<svg viewBox="0 0 200 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="30" rx="97" ry="27" stroke="#fff" stroke-width="1.5" stroke-opacity="0.7"/>
        <path d="M12 18.6 A 97 27 0 0 1 174 12.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.5 7" stroke-opacity="0.7"/>
      </svg>`;
      const wrap = wordmark.closest('p');
      if (wrap) { wrap.classList.add('footer-harmony-wordmark'); wrap.prepend(mark); }
    }

    mid.append(cols, brand);
  }

  // ---- Legal links row (centred) ----
  const legal = document.createElement('div');
  legal.className = 'footer-harmony-legal';
  if (legalRow) {
    while (legalRow.firstChild) legal.append(legalRow.firstChild);
  }

  // ---- Legal text paragraphs ----
  const text = document.createElement('div');
  text.className = 'footer-harmony-text';
  if (textRow) {
    while (textRow.firstChild) text.append(textRow.firstChild);
  }

  // ---- Decorative dotted arc (bottom-right) ----
  const arc = document.createElement('span');
  arc.className = 'footer-harmony-arc';
  arc.setAttribute('aria-hidden', 'true');

  block.textContent = '';
  const inner = document.createElement('div');
  inner.className = 'footer-harmony-inner';
  inner.append(top, mid, legal, text);
  block.append(inner, arc);
}
