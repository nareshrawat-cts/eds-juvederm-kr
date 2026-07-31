/**
 * hero-clinic — "Find Juvéderm Clinic" CTA banner.
 *
 * Source (#find): a 50/50 split. Left = plum panel (.txtArea) holding a 300x420
 * dark box; three display headings (Find / Juvéderm / Clinic) sit at the box's
 * corners and a "자세히보기 ↗" CTA reveals on hover. Right = a clinic photo.
 *
 * Authored rows (from import):
 *   cell 0: the box/hover image (find_img_hover.jpg)
 *   cell 1: h4 "Find", h4 "Juvéderm", h4 "Clinic", p > a (CTA)
 *
 * Decorated into:
 *   <div class="hero-clinic-panel">           left plum panel
 *     <a class="hero-clinic-box" href>
 *       <span class="hero-clinic-frame"> <picture> </span>
 *       <h4 class="hero-clinic-word-one">Find</h4>
 *       <h4 class="hero-clinic-word-two">Juvéderm</h4>
 *       <h4 class="hero-clinic-word-three">Clinic</h4>
 *       <span class="hero-clinic-cta"> 자세히보기 ↗ </span>
 *     </a>
 *   </div>
 *   <div class="hero-clinic-photo"></div>      right clinic photo
 */
export default function decorate(block) {
  const boxPic = block.querySelector('picture');
  const headings = [...block.querySelectorAll('h4')];
  const link = block.querySelector('a');
  const href = link ? link.getAttribute('href') : '#';

  block.textContent = '';

  // Left plum panel with the dark box.
  const panel = document.createElement('div');
  panel.className = 'hero-clinic-panel';

  const boxLink = document.createElement('a');
  boxLink.className = 'hero-clinic-box';
  boxLink.href = href;

  const frame = document.createElement('span');
  frame.className = 'hero-clinic-frame';
  if (boxPic) frame.append(boxPic);
  boxLink.append(frame);

  const wordClasses = ['hero-clinic-word-one', 'hero-clinic-word-two', 'hero-clinic-word-three'];
  headings.forEach((h, i) => {
    h.className = wordClasses[i] || '';
    boxLink.append(h);
  });

  // Hover CTA (자세히보기 ↗), centred over the box.
  const cta = document.createElement('span');
  cta.className = 'hero-clinic-cta';
  const ctaText = (link ? link.textContent : '자세히보기').replace(/\s*arrow_outward\s*/g, '').trim() || '자세히보기';
  cta.innerHTML = `${ctaText}<span class="hero-clinic-arrow" aria-hidden="true">↗</span>`;
  boxLink.append(cta);

  panel.append(boxLink);

  // Right clinic photo.
  const photo = document.createElement('div');
  photo.className = 'hero-clinic-photo';
  photo.setAttribute('aria-hidden', 'true');

  block.append(panel, photo);
}
