export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-brand-${cols.length}-cols`);

  // Mark the image column (empty cell that carries the brand photo as a
  // background) and the text column so CSS can target them regardless of order.
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (col.querySelector('h1, h2, h3, h4, h5, h6, p')) {
        col.classList.add('columns-brand-text-col');
      } else {
        col.classList.add('columns-brand-img-col');
      }
    });
  });

  // The source renders the CTA with a Material Symbols "arrow_outward"
  // ligature. That font is not loaded, so the ligature name leaks as literal
  // text (e.g. "자세히보기arrow_outward"). Replace it with a real arrow glyph.
  block.querySelectorAll('a').forEach((a) => {
    if (a.childNodes.length === 1 && a.firstChild.nodeType === Node.TEXT_NODE) {
      const text = a.textContent;
      const idx = text.indexOf('arrow_outward');
      if (idx !== -1) {
        a.textContent = text.slice(0, idx).trim();
        const arrow = document.createElement('span');
        arrow.className = 'columns-brand-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '↗'; // ↗ north-east arrow
        a.append(arrow);
      }
    }
  });
}
