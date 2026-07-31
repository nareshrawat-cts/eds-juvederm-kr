/* eslint-disable */
/* global WebImporter */
/**
 * Parser for embed-video. Base: embed.
 * Source: https://www.juvederm.co.kr/juvederm/story.php (section.story_campaign .video_wrap)
 * Generated: 2026-07-31
 *
 * Block library structure (Embed video): 1 column, 2 rows.
 *  - Row 1: block name
 *  - Row 2: single cell with the external video URL. An optional poster image
 *    may be placed above the link in the same cell.
 */
export default function parse(element, { document }) {
  // The embedded video: an iframe (Vimeo/YouTube) or a source link.
  const iframe = element.querySelector('iframe[src], .video iframe, [class*="video"] iframe');
  const anchor = element.querySelector('a[href*="vimeo"], a[href*="youtube"], a[href*="youtu.be"]');

  let url;
  if (iframe && iframe.getAttribute('src')) {
    url = iframe.getAttribute('src');
  } else if (anchor && anchor.getAttribute('href')) {
    url = anchor.getAttribute('href');
  }

  // Optional poster image (placed above the link in the cell).
  let poster;
  const posterSource = element.querySelector('.video img, [class*="video"] img, img[class*="poster"]');
  if (posterSource) {
    const src = posterSource.getAttribute('src')
      || posterSource.getAttribute('data-src')
      || posterSource.getAttribute('data-original');
    if (src) {
      poster = document.createElement('img');
      poster.src = src;
      if (posterSource.getAttribute('alt')) poster.alt = posterSource.getAttribute('alt');
    }
  }

  // Empty-block guard
  if (!url) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const link = document.createElement('a');
  link.href = url;
  link.textContent = url;

  // Single cell holds optional poster image (above) then the URL link.
  const contentCell = [];
  if (poster) contentCell.push(poster);
  contentCell.push(link);

  const cells = [[contentCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-video', cells });
  element.replaceWith(block);
}
