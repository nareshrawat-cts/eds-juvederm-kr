import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-feature-card-image';
      else div.className = 'cards-feature-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';

  // "Value Story" infographic variant (story page): the source shows a central
  // circular brand graphic behind the 3 icon/caption groups. Detect this variant
  // by its paragraph captions (the product-page variant uses headings instead)
  // and prepend the decorative brand image. The image is purely decorative.
  const isValueStory = !ul.querySelector('.cards-feature-card-body h3, .cards-feature-card-body h4, .cards-feature-card-body h5');
  if (isValueStory) {
    block.classList.add('cards-feature-value-story');
    const brand = document.createElement('div');
    brand.className = 'cards-feature-brand';
    brand.setAttribute('aria-hidden', 'true');
    brand.innerHTML = `<img src="${new URL('./story-brand.svg', import.meta.url).href}" alt="" loading="lazy" width="484" height="484">`;
    block.append(brand);
  }

  block.append(ul);
}
