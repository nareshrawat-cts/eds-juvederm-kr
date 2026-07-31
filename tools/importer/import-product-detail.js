/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsLogoParser from './parsers/cards-logo.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/juvederm-cleanup.js';
import sectionsTransformer from './transformers/juvederm-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-feature': cardsFeatureParser,
  'cards-logo': cardsLogoParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'product-detail',
  description: 'Product detail page with visual hero, LNB sidebar navigation, product info with feature list, and product/model imagery',
  urls: [
    'https://www.juvederm.co.kr/product/volbella.php',
  ],
  blocks: [
    { name: 'hero-banner', instances: ['#visual'] },
    { name: 'cards-feature', instances: ['section.product_juvederm ul.feature_list'] },
    { name: 'cards-logo', instances: ['section.product_cut'] },
  ],
  sections: [
    { id: 'visual', name: 'Hero Banner', selector: '#visual', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'lnb', name: 'Product Sub Nav', selector: '#contents > div.lnb', style: null, blocks: [], defaultContent: ['#contents > div.lnb'] },
    { id: 'product_juvederm', name: 'Product Info', selector: 'section.product_juvederm', style: null, blocks: ['cards-feature'], defaultContent: ['section.product_juvederm .titArea', 'section.product_juvederm .product_info'] },
    { id: 'product_cut', name: 'Product Imagery', selector: 'section.product_cut', style: null, blocks: ['cards-logo'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

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
