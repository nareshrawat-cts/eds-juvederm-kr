/*
 * columns-treats — decorate into text column + media column.
 * Authored structure: single row with two cells:
 *   [ eyebrow + heading + subtext + CTA ] , [ face picture + callout <ul> ]
 * The media cell is rebuilt so the photo and the callouts are two separate
 * grid children (EDS otherwise wraps them together in one <p>).
 */

export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;
  const cells = [...row.children];
  const textCell = cells[0];
  const mediaCell = cells[1];

  if (textCell) {
    textCell.className = 'columns-treats-text';
    const link = textCell.querySelector('a');
    if (link) link.classList.add('button');
  }

  // Rebuild the media cell: picture in one column, callout list in the other.
  const media = document.createElement('div');
  media.className = 'columns-treats-media';
  if (mediaCell) {
    const picture = mediaCell.querySelector('picture');
    const callouts = mediaCell.querySelector('ul');
    if (picture) {
      const figure = document.createElement('div');
      figure.className = 'columns-treats-photo';
      figure.append(picture);
      media.append(figure);
    }
    if (callouts) {
      callouts.className = 'columns-treats-callouts';
      media.append(callouts);
    }
  }

  block.textContent = '';
  if (textCell) block.append(textCell);
  block.append(media);
}
