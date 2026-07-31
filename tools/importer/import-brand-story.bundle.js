/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-brand-story.js
  var import_brand_story_exports = {};
  __export(import_brand_story_exports, {
    default: () => import_brand_story_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    let bgSrc;
    let bgAlt;
    const imgSource = element.querySelector('.visual-pc img, .v_bg img, .visual-mo img, img[class*="bg"]');
    if (imgSource) {
      bgSrc = imgSource.getAttribute("src") || imgSource.getAttribute("data-src") || imgSource.getAttribute("data-original");
      bgAlt = imgSource.getAttribute("alt");
    }
    if (!bgSrc) {
      const bgEl = element.querySelector('.visual-pc .v_bg[style], .visual-pc [style*="url"], .v_bg[style*="url"], [style*="background"][style*="url"]');
      if (bgEl) {
        const m = (bgEl.getAttribute("style") || "").match(/url\((['"]?)([^'")]+)\1\)/i);
        if (m) bgSrc = m[2];
      }
    }
    let bgImage;
    if (bgSrc) {
      bgImage = document2.createElement("img");
      bgImage.src = bgSrc;
      if (bgAlt) bgImage.alt = bgAlt;
    }
    const heading = element.querySelector(".v_txt h1, .v_txt h2, .v_txt h3, .basic_in h1, .basic_in h2, .basic_in h3, h1, h2, h3");
    const subheading = element.querySelector(".v_txt p, .basic_in p");
    const ctaLinks = Array.from(element.querySelectorAll(".v_txt a[href], .basic_in a[href]"));
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctaLinks.forEach((a) => contentCell.push(a));
    if (cells.length === 0 && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (contentCell.length > 0) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function resolveImg(document2, source) {
    if (!source) return void 0;
    const src = source.getAttribute("src") || source.getAttribute("data-src") || source.getAttribute("data-original");
    if (src) {
      const img = document2.createElement("img");
      img.src = src;
      if (source.getAttribute("alt")) img.alt = source.getAttribute("alt");
      return img;
    }
    return void 0;
  }
  function parse2(element, { document: document2 }) {
    let cardEls = Array.from(element.querySelectorAll(":scope > li"));
    if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll(":scope > dl"));
    if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll("li"));
    if (cardEls.length === 0) cardEls = Array.from(element.querySelectorAll("dl"));
    cardEls = cardEls.filter((el) => el && el.querySelector("img"));
    const cells = [];
    cardEls.forEach((card) => {
      const imageEl = resolveImg(document2, card.querySelector(".imgArea img, dt img, .img img, img"));
      const textCell = [];
      const txt = card.querySelector(".txtArea") || card.querySelector("dd") || card;
      Array.from(txt.querySelectorAll("small, .point")).forEach((s) => {
        if (s.textContent.trim()) textCell.push(s);
      });
      Array.from(txt.querySelectorAll("h1, h2, h3, h4, h5, h6")).forEach((h) => textCell.push(h));
      Array.from(txt.querySelectorAll("p")).forEach((p) => {
        if (p.textContent.trim()) textCell.push(p);
      });
      const cta = txt.querySelector("a[href]");
      if (cta && cta.getAttribute("href")) {
        const link = document2.createElement("a");
        link.href = cta.getAttribute("href");
        link.textContent = cta.textContent.replace(/\s+/g, " ").trim();
        textCell.push(link);
      }
      if (!imageEl && textCell.length === 0) return;
      cells.push([imageEl || "", textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-video.js
  function parse3(element, { document: document2 }) {
    const iframe = element.querySelector('iframe[src], .video iframe, [class*="video"] iframe');
    const anchor = element.querySelector('a[href*="vimeo"], a[href*="youtube"], a[href*="youtu.be"]');
    let url;
    if (iframe && iframe.getAttribute("src")) {
      url = iframe.getAttribute("src");
    } else if (anchor && anchor.getAttribute("href")) {
      url = anchor.getAttribute("href");
    }
    let poster;
    const posterSource = element.querySelector('.video img, [class*="video"] img, img[class*="poster"]');
    if (posterSource) {
      const src = posterSource.getAttribute("src") || posterSource.getAttribute("data-src") || posterSource.getAttribute("data-original");
      if (src) {
        poster = document2.createElement("img");
        poster.src = src;
        if (posterSource.getAttribute("alt")) poster.alt = posterSource.getAttribute("alt");
      }
    }
    if (!url) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const link = document2.createElement("a");
    link.href = url;
    link.textContent = url;
    const contentCell = [];
    if (poster) contentCell.push(poster);
    contentCell.push(link);
    const cells = [[contentCell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "embed-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-logo.js
  function resolveImg2(document2, source) {
    if (!source) return void 0;
    const src = source.getAttribute("src") || source.getAttribute("data-src") || source.getAttribute("data-original");
    if (src) {
      const img = document2.createElement("img");
      img.src = src;
      if (source.getAttribute("alt")) img.alt = source.getAttribute("alt");
      return img;
    }
    return void 0;
  }
  function parse4(element, { document: document2 }) {
    let cardEls = Array.from(element.querySelectorAll(":scope > li, :scope ul > li, :scope > .cut, :scope .cut"));
    if (cardEls.length === 0) {
      cardEls = Array.from(element.querySelectorAll("img")).map((img) => img.closest("li, .cut") || img);
    }
    cardEls = cardEls.filter((el, i, arr) => el && arr.indexOf(el) === i);
    const cells = [];
    cardEls.forEach((card) => {
      const imgSource = card.tagName === "IMG" ? card : card.querySelector("img");
      const imageEl = resolveImg2(document2, imgSource);
      if (!imageEl) return;
      const textCell = [];
      const txt = card.querySelector(".txtArea, dd, figcaption");
      if (txt) {
        Array.from(txt.querySelectorAll("h1, h2, h3, h4, h5, h6, p, small")).forEach((n) => {
          if (n.textContent.trim()) textCell.push(n);
        });
      }
      cells.push([imageEl, textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-logo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/juvederm-cleanup.js
  var TransformHook = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#quick",
        // Hidden modal/popup layers (visibility:hidden on the source, opened via
        // JS). These hold the "필러 사용 시 주의사항" precautions content, the
        // medical-info/contact block, and the search UI — all non-authorable
        // popups that must NOT land in the page flow.
        ".window",
        ".window2",
        ".caution_cont_wrap"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#header",
        "#menuArea",
        "nav.mobile_snb",
        "#footer",
        "script",
        "noscript",
        "link",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/juvederm-sections.js
  var TransformHook2 = {
    beforeTransform: "beforeTransform",
    afterTransform: "afterTransform"
  };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) {
      return;
    }
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) {
      return;
    }
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
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el) {
        continue;
      }
      if (section.style) {
        const block = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        el.appendChild(block);
      }
      if (i > 0) {
        const hr = document.createElement("hr");
        el.parentNode.insertBefore(hr, el);
      }
    }
  }

  // tools/importer/import-brand-story.js
  var parsers = {
    "hero-banner": parse,
    "cards-feature": parse2,
    "embed-video": parse3,
    "cards-logo": parse4
  };
  var PAGE_TEMPLATE = {
    name: "brand-story",
    description: "Brand story page with visual hero, LNB sidebar navigation, value-story feature list, campaign video, and safety product list",
    urls: [
      "https://www.juvederm.co.kr/juvederm/story.php"
    ],
    blocks: [
      { name: "hero-banner", instances: ["#visual"] },
      { name: "cards-feature", instances: ["section.story_juvederm .story_juvederm_in"] },
      { name: "embed-video", instances: ["section.story_campaign .video_wrap"] },
      { name: "cards-logo", instances: ["section.story_safety ul.story_product"] },
      { name: "section-campaign", instances: ["section.story_campaign"], section: "grey" }
    ],
    sections: [
      { id: "visual", name: "Hero Banner", selector: "#visual", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "lnb", name: "Sub Navigation", selector: "#contents > div.lnb", style: null, blocks: [], defaultContent: ["#contents > div.lnb"] },
      { id: "story_juvederm", name: "Value Story", selector: "section.story_juvederm", style: null, blocks: ["cards-feature"], defaultContent: ["section.story_juvederm .titArea"] },
      { id: "story_campaign", name: "Campaign", selector: "section.story_campaign", style: "grey", blocks: ["embed-video"], defaultContent: ["section.story_campaign .titArea"] },
      { id: "story_safety", name: "Safety", selector: "section.story_safety", style: null, blocks: ["cards-logo"], defaultContent: ["section.story_safety .titArea"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
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
  var import_brand_story_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/index");
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_brand_story_exports);
})();
