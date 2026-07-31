/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroVideoParser from './parsers/hero-video.js';
import columnsBrandParser from './parsers/columns-brand.js';
import carouselStoryParser from './parsers/carousel-story.js';
import cardsProductParser from './parsers/cards-product.js';
import heroClinicParser from './parsers/hero-clinic.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/juvederm-cleanup.js';
import sectionsTransformer from './transformers/juvederm-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-video': heroVideoParser,
  'columns-brand': columnsBrandParser,
  'carousel-story': carouselStoryParser,
  'cards-product': cardsProductParser,
  'hero-clinic': heroClinicParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Homepage with video hero, brand about section, value-story carousel, product collection listing, and find-clinic CTA',
  urls: [
    'https://www.juvederm.co.kr',
  ],
  blocks: [
    { name: 'hero-video', instances: ['#visual'] },
    { name: 'columns-brand', instances: ['#about'] },
    { name: 'carousel-story', instances: ['#story .story_roll'] },
    { name: 'cards-product', instances: ['#collection .collection_roll'] },
    { name: 'hero-clinic', instances: ['#find'] },
    { name: 'section-collection', instances: ['#collection'], section: 'grey' },
  ],
  sections: [
    { id: 'visual', name: 'Video Hero', selector: '#visual', style: null, blocks: ['hero-video'], defaultContent: [] },
    { id: 'about', name: 'Brand Intro', selector: '#about', style: null, blocks: ['columns-brand'], defaultContent: [] },
    { id: 'story', name: 'Value Story', selector: '#story', style: null, blocks: ['carousel-story'], defaultContent: ['#story .titArea'] },
    { id: 'collection', name: 'Product Collection', selector: '#collection', style: 'grey', blocks: ['cards-product'], defaultContent: ['#collection .titArea'] },
    { id: 'find', name: 'Find Clinic CTA', selector: '#find', style: null, blocks: ['hero-clinic'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    if (blockDef.name.startsWith('section-')) return;
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element, section: blockDef.section || null });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // The #contents container carries a purely decorative full-width background
    // (contents_bg.png, per the source main.css). transformBackgroundImages
    // materializes it into an inline content <img>, which wrongly lands between
    // the video hero and the #about section. Remove that decorative asset so
    // #about follows the video directly, as on live.
    main.querySelectorAll('img[src*="contents_bg"]').forEach((img) => {
      const wrapper = img.closest('p, picture') || img;
      (wrapper.closest('p') || wrapper).remove();
    });

    // 6. Path (default root "/" to "index" to avoid empty-path sanitize error)
    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/index');

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
