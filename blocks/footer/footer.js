import { getMetadata, loadCSS } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // HarmonyCa is a separate site with its own standalone footer block. When
  // the footer fragment targets footer-harmony, delegate to that block instead
  // of the Juvederm footer decoration below. Juvederm footer code untouched.
  if (footerPath.includes('footer-harmony')) {
    block.textContent = '';
    const footerHarmony = document.createElement('div');
    footerHarmony.className = 'footer-harmony block';
    footerHarmony.dataset.blockName = 'footer-harmony';
    while (fragment.firstElementChild) footerHarmony.append(fragment.firstElementChild);
    block.append(footerHarmony);
    loadCSS(`${window.hlx.codeBasePath}/blocks/footer-harmony/footer-harmony.css`);
    const { default: decorateFooterHarmony } = await import('../footer-harmony/footer-harmony.js');
    decorateFooterHarmony(footerHarmony);
    return;
  }

  // Resolve fragment-relative image paths (e.g. "images/footer-logo.svg")
  // against the fragment's own directory so they work on nested pages too.
  const footerDir = `${footerPath.substring(0, footerPath.lastIndexOf('/'))}/`;
  fragment.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('/') && !src.startsWith('http') && !src.startsWith('data:')) {
      img.setAttribute('src', footerDir + src);
    }
  });

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // label the top-level sections so CSS can lay them out (content-first: the
  // fragment provides the content/order, JS only assigns structural classes)
  const sectionClasses = ['footer-logo', 'footer-info', 'footer-links', 'footer-legal', 'footer-copyright'];
  [...footer.children].forEach((section, i) => {
    if (sectionClasses[i]) section.classList.add(sectionClasses[i]);
  });

  // Top row: logo on the left, company/contact info on the right — matching the
  // source #footer .foot_top (flex row, space-between, bottom border).
  const logo = footer.querySelector('.footer-logo');
  const info = footer.querySelector('.footer-info');
  if (logo && info) {
    const top = document.createElement('div');
    top.className = 'footer-top';
    logo.replaceWith(top);
    top.append(logo, info);

    // Split the single info column into "Company info." + "Contact us." groups
    // (each an <h4> label followed by its lines), so they sit side by side like
    // the source .foot_about dl pair.
    // The info lines may be wrapped in a .default-content-wrapper; operate on
    // whichever element actually holds the <p> rows.
    const holder = info.querySelector('.default-content-wrapper') || info;
    const nodes = [...holder.children];
    const groups = [];
    let current = null;
    nodes.forEach((node) => {
      if (node.querySelector('strong') || node.tagName === 'STRONG') {
        current = document.createElement('div');
        current.className = 'footer-info-group';
        groups.push(current);
      }
      if (current) current.append(node);
    });
    if (groups.length) {
      groups.forEach((g) => holder.append(g));
      holder.classList.add('footer-info-groups');
    }
  }

  block.append(footer);
}
