/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: juvederm.co.kr section breaks + section metadata.
 *
 * Runs in afterTransform only. Uses payload.template.sections to insert an
 * <hr> before every non-first section and a "Section Metadata" block for every
 * section that declares a style.
 *
 * Section selectors are sourced from tools/importer/page-templates.json
 * (validated against migration-work/cleaned.html), e.g. #visual, #about,
 * #story, #collection, #find, section.story_juvederm, section.story_campaign,
 * section.story_safety, section.product_juvederm, section.product_cut,
 * and #contents > div.lnb.
 *
 * Sections with a style in the templates: homepage #collection (grey),
 * brand-story section.story_campaign (grey). Expected Section Metadata blocks
 * therefore equals the number of sections whose `style` is non-null.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  // Run in beforeTransform: section anchors like #visual and #find are fully
  // replaced by their block parsers, so by afterTransform querySelector('#find')
  // would return null and no section break would be inserted before it (leaving
  // #find merged into the previous section). beforeTransform runs while every
  // anchor still exists.
  if (hookName !== TransformHook.beforeTransform) {
    return;
  }

  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) {
    return;
  }

  // Resolve each section's anchor element (first matching element under main).
  const resolved = sections.map((section) => {
    let el = null;
    if (section.selector) {
      try {
        el = element.querySelector(section.selector);
      } catch (e) {
        el = null;
      }
    }
    return { section, el };
  });

  // Process in reverse order so inserted nodes never shift not-yet-processed
  // section anchors.
  for (let i = resolved.length - 1; i >= 0; i -= 1) {
    const { section, el } = resolved[i];
    if (!el) {
      // Selector didn't match on this page; skip gracefully.
      continue;
    }

    // Section Metadata block (only when the template declares a style).
    if (section.style) {
      const block = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      el.appendChild(block);
    }

    // Section break: insert an <hr> before every section except the first.
    if (i > 0) {
      const hr = document.createElement('hr');
      el.parentNode.insertBefore(hr, el);
    }
  }
}
