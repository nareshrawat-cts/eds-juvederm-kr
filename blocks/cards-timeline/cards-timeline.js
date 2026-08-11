/*
 * cards-timeline — decorate "guided journey" into intro + numbered steps.
 * Authored structure:
 *   row 1 (intro): [ eyebrow, heading, subtext ]
 *   rows 2..N (steps): [ phase|title (heading), body, photo ]
 * The heading in each step is expected as "Phase | Title"; the part before
 * the pipe stays accent, the part after is wrapped in <span>.
 */

export default function decorate(block) {
  const rows = [...block.children];
  const [introRow, ...stepRows] = rows;

  // Intro column
  const intro = document.createElement('div');
  intro.className = 'cards-timeline-intro';
  const introCell = introRow.firstElementChild || introRow;
  while (introCell.firstChild) intro.append(introCell.firstChild);

  // Steps list
  const ol = document.createElement('ol');
  ol.className = 'cards-timeline-steps';

  stepRows.forEach((row, i) => {
    const cell = row.firstElementChild || row;
    const heading = cell.querySelector('h3, h4, h5');
    const picture = cell.querySelector('picture');
    const body = [...cell.querySelectorAll('p')].find((p) => !p.querySelector('picture'));

    const li = document.createElement('li');

    const num = document.createElement('span');
    num.className = 'cards-timeline-num';
    num.textContent = String(i + 1);
    li.append(num);

    const card = document.createElement('div');
    card.className = 'cards-timeline-card';

    const text = document.createElement('div');
    if (heading) {
      // Split "Phase | Title" → accent phase + <span>title</span>
      const parts = heading.textContent.split('|');
      const h = document.createElement('h3');
      if (parts.length > 1) {
        h.append(document.createTextNode(`${parts[0].trim()} `));
        const span = document.createElement('span');
        span.textContent = parts.slice(1).join('|').trim();
        h.append(span);
      } else {
        h.textContent = heading.textContent.trim();
      }
      text.append(h);
    }
    if (body) text.append(body);
    card.append(text);

    if (picture) card.append(picture);
    li.append(card);
    ol.append(li);
  });

  block.textContent = '';
  block.append(intro, ol);
}
