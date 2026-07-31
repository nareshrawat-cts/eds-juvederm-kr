import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * cards-product — Juvéderm collection product tiles.
 *
 * Authored rows: [ model-image cell ] [ body cell: h4 name + package image + link ]
 * Decorated into an overlay composition matching the source (#collection .roll):
 * a single background photo with the name + bottle image overlaid on top of it,
 * centred vertically, exactly like the source .pro_bg + .pro_info.
 *   <li>
 *     <a class="cards-product-tile" href>            positioned, no overflow clip
 *       <div class="cards-product-model">            photo background (overflow:hidden)
 *         <picture> model photo </picture>
 *       </div>
 *       <div class="cards-product-info">             overlay sibling, centred on the photo
 *         <h4 class="cards-product-name"> name </h4>
 *         <div class="cards-product-bottle"> package <picture> </div>
 *       </div>
 *     </a>
 *   </li>
 * The overlay is a SIBLING of the photo (not a child) so the bottle image can
 * extend past the photo's bottom without being clipped, exactly like the source
 * where .pro_info sits alongside .pro_bg inside the anchor.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const modelPic = cells[0] ? cells[0].querySelector('picture') : null;
    const body = cells[1] || cells[0];
    const heading = body ? body.querySelector('h4') : null;
    const pictures = body ? [...body.querySelectorAll('picture')] : [];
    const bottlePic = pictures.find((p) => p !== modelPic) || pictures[0] || null;
    const link = body ? body.querySelector('a') : null;

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const tile = document.createElement('a');
    tile.className = 'cards-product-tile';
    if (link && link.getAttribute('href')) tile.href = link.getAttribute('href');

    const model = document.createElement('div');
    model.className = 'cards-product-model';
    if (modelPic) model.append(modelPic);
    tile.append(model);

    // Overlay: product name + bottle image, both sitting on top of the photo.
    // Sibling of the photo so the bottle can overflow past the photo bottom.
    const info = document.createElement('div');
    info.className = 'cards-product-info';
    if (heading) {
      heading.className = 'cards-product-name';
      info.append(heading);
    }
    if (bottlePic) {
      const bottle = document.createElement('div');
      bottle.className = 'cards-product-bottle';
      bottle.append(bottlePic);
      info.append(bottle);
    }
    tile.append(info);

    li.append(tile);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
