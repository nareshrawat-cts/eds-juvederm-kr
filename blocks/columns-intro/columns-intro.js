/*
 * columns-intro — decorate the "Introducing HarmonyCa" columns.
 * First cell is intro copy; the following cells are features whose first
 * paragraph names an icon token (droplet | collagen | sparkle) that is
 * swapped for the matching brand icon SVG (served from /icons).
 */

// Feature-icon token → official brand SVG (in /icons). The tokens are the
// words authored in the content; each maps to a supplied HArmonyCa icon.
const ICON_FILES = {
  droplet: 'instant-vol',
  collagen: 'collagen-stimulation',
  sparkle: 'natural-results',
};

export default function decorate(block) {
  const cols = [...block.children];

  cols.forEach((col, i) => {
    if (i === 0) return; // intro copy cell, leave as-is
    // The icon token is the column's first <p> (direct child or nested).
    const first = col.querySelector('p');
    if (!first) return;
    const token = first.textContent.trim().toLowerCase();
    const file = ICON_FILES[token];
    if (file) {
      const icon = document.createElement('span');
      icon.className = 'columns-intro-icon';
      const img = document.createElement('img');
      img.src = `${window.hlx.codeBasePath}/icons/${file}.svg`;
      img.alt = '';
      img.setAttribute('aria-hidden', 'true');
      img.width = 48;
      img.height = 48;
      icon.append(img);
      first.replaceWith(icon);
    }
  });
}
