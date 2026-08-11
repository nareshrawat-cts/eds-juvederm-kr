/*
 * cards-stats — decorate authored rows into stat cards.
 * Authored structure: each row = [ value (heading) , body ] cell(s).
 * A droplet icon is prepended to each card.
 */

const DROPLET = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" stroke="#00a3e0" stroke-width="1.5" stroke-linejoin="round"/></svg>';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    const icon = document.createElement('span');
    icon.className = 'cards-stats-icon';
    icon.innerHTML = DROPLET;
    li.append(icon);

    // Move the row's content (heading + paragraph) into the card.
    while (row.firstElementChild) {
      const cell = row.firstElementChild;
      while (cell.firstChild) li.append(cell.firstChild);
      cell.remove();
    }
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
