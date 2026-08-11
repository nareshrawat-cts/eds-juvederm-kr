/*
 * hero-harmony — HarmonyCa gradient hero / CTA banner.
 * Decorates authored rows into a background image layer + text overlay.
 * Authored rows (any of): background picture, heading, subtext, CTA links.
 */

export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const picture = cell.querySelector('picture');
    const heading = cell.querySelector('h1, h2, h3');
    const links = cell.querySelectorAll('a');

    // Background image row: unwrap the picture to sit as the bg layer.
    if (picture && !heading && !cell.textContent.trim()) {
      block.prepend(picture);
      row.remove();
      return;
    }

    // CTA row: 1+ links, no heading → actions group with .button styling.
    if (links.length && !heading) {
      const actions = document.createElement('div');
      actions.className = 'hero-harmony-actions';
      links.forEach((a) => {
        a.classList.add('button');
        const p = document.createElement('p');
        p.className = 'button-container';
        p.append(a);
        actions.append(p);
      });
      row.replaceWith(actions);
      return;
    }

    // Subtext row: a bare paragraph with no heading/links.
    if (!heading && !links.length && cell.textContent.trim()) {
      const p = cell.querySelector('p') || cell;
      p.classList.add('hero-harmony-subtext');
      row.replaceWith(p);
      return;
    }

    // Heading row: keep the heading, drop the wrapper.
    if (heading) {
      row.replaceWith(heading);
    }
  });
}
