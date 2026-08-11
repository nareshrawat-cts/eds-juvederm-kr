/*
 * columns-intro — decorate the "Introducing HarmonyCa" columns.
 * First cell is intro copy; the following cells are features whose first
 * paragraph names an icon token (droplet | collagen | sparkle) that is
 * swapped for an inline SVG.
 */

const ICONS = {
  droplet: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" stroke="#00a3e0" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  collagen: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3l7 7-2 2-7-7 2-2zM12 5 5.5 11.5 4 17l5.5-1.5L16 9M8.5 8.5l3 3" stroke="#00a3e0" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" stroke="#00a3e0" stroke-width="1.5" stroke-linejoin="round"/></svg>',
};

export default function decorate(block) {
  const cols = [...block.children];

  cols.forEach((col, i) => {
    if (i === 0) return; // intro copy cell, leave as-is
    // The icon token is the column's first <p> (direct child or nested).
    const first = col.querySelector('p');
    if (!first) return;
    const token = first.textContent.trim().toLowerCase();
    if (ICONS[token]) {
      const icon = document.createElement('span');
      icon.className = 'columns-intro-icon';
      icon.innerHTML = ICONS[token];
      first.replaceWith(icon);
    }
  });
}
