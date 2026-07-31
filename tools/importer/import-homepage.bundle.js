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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document: document2 }) {
    const iframe = element.querySelector('iframe[src*="vimeo"], iframe[src*="youtube"], iframe.vimeo_iframe, .v_bg iframe');
    const bgImage = element.querySelector('.v_bg img, .visual_in img, img[class*="bg"]');
    const heading = element.querySelector('.v_txt h1, .v_txt h2, h1, h2, [class*="title"]');
    const subheading = element.querySelector(".v_txt p, .basic_in p");
    const ctaLinks = Array.from(element.querySelectorAll(".v_txt a, .basic_in a")).filter((a) => !a.classList.contains("scroll_down") && !a.closest(".video_control"));
    const cells = [];
    if (iframe && iframe.src) {
      const link = document2.createElement("a");
      link.href = iframe.src;
      link.textContent = iframe.src;
      cells.push([link]);
    } else if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctaLinks.forEach((a) => contentCell.push(a));
    if (cells.length === 0 && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (contentCell.length > 0) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-brand.js
  function parse2(element, { document: document2 }) {
    let imageEl;
    const imgSource = element.querySelector(".imgArea img, .imgArea .img img, img");
    if (imgSource) {
      const src = imgSource.getAttribute("src") || imgSource.getAttribute("data-src") || imgSource.getAttribute("data-original");
      if (src) {
        imageEl = document2.createElement("img");
        imageEl.src = src;
        if (imgSource.getAttribute("alt")) imageEl.alt = imgSource.getAttribute("alt");
      }
    }
    if (!imageEl) {
      const bgEl = element.querySelector('.imgArea .img, .imgArea [style*="url"], .imgArea');
      if (bgEl) {
        let url;
        const inline = (bgEl.getAttribute("style") || "").match(/url\((['"]?)([^'")]+)\1\)/i);
        if (inline) {
          url = inline[2];
        } else if (typeof getComputedStyle === "function") {
          const computed = getComputedStyle(bgEl).backgroundImage;
          const cm = computed && computed.match(/url\((['"]?)([^'")]+)\1\)/i);
          if (cm) url = cm[2];
        }
        if (url) {
          imageEl = document2.createElement("img");
          imageEl.src = url;
        }
      }
    }
    const txtArea = element.querySelector(".txtArea_in") || element.querySelector(".txtArea");
    const textCell = [];
    if (txtArea) {
      const headings = Array.from(txtArea.querySelectorAll("h1, h2, h3, h4"));
      headings.forEach((h) => textCell.push(h));
      const ctaSource = txtArea.querySelector(".btnArea a[href], a[href]");
      if (ctaSource && ctaSource.getAttribute("href")) {
        const cta = document2.createElement("a");
        cta.href = ctaSource.getAttribute("href");
        cta.textContent = ctaSource.textContent.replace(/\s+/g, " ").trim();
        textCell.push(cta);
      }
    }
    if (!imageEl && textCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[imageEl || "", textCell.length ? textCell : ""]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-story.js
  function parse3(element, { document: document2 }) {
    const slideEls = Array.from(element.querySelectorAll(".swiper-slide, .story_slide")).filter((s) => !s.classList.contains("swiper-slide-duplicate"));
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    slideEls.forEach((slide) => {
      const imgSource = slide.querySelector(".img img, img");
      let imageEl;
      let key;
      if (imgSource) {
        const src = imgSource.getAttribute("src") || imgSource.getAttribute("data-src") || imgSource.getAttribute("data-original");
        if (src) {
          key = src;
          imageEl = document2.createElement("img");
          imageEl.src = src;
          if (imgSource.getAttribute("alt")) imageEl.alt = imgSource.getAttribute("alt");
        }
      }
      if (!imageEl || seen.has(key)) return;
      seen.add(key);
      const textCell = [];
      const txt = slide.querySelector(".txt") || slide.querySelector(".inner") || slide;
      Array.from(txt.querySelectorAll("h1, h2, h3, h4, h5, h6")).forEach((h) => textCell.push(h));
      Array.from(txt.querySelectorAll("p")).forEach((p) => textCell.push(p));
      const cta = txt.querySelector("a[href]");
      if (cta && cta.getAttribute("href")) {
        const link = document2.createElement("a");
        link.href = cta.getAttribute("href");
        link.textContent = cta.textContent.replace(/\s+/g, " ").trim();
        textCell.push(link);
      }
      cells.push([imageEl, textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-story", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function resolveImg(document2, source) {
    if (!source) return void 0;
    const src = source.getAttribute("src") || source.getAttribute("data-src") || source.getAttribute("data-lazy") || source.getAttribute("data-original");
    if (src) {
      const img = document2.createElement("img");
      img.src = src;
      if (source.getAttribute("alt")) img.alt = source.getAttribute("alt");
      return img;
    }
    const inline = (source.getAttribute("style") || "").match(/url\((['"]?)([^'")]+)\1\)/i);
    if (inline) {
      const img = document2.createElement("img");
      img.src = inline[2];
      return img;
    }
    return void 0;
  }
  function parse4(element, { document: document2 }) {
    const cardEls = Array.from(element.querySelectorAll(".roll, .slick-slide")).filter((c) => !c.classList.contains("slick-cloned"));
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    cardEls.forEach((card) => {
      const link = card.querySelector("a[href]");
      const href = link && link.getAttribute("href");
      let imageEl = resolveImg(document2, card.querySelector(".pro_bg .img img, .pro_bg img"));
      if (!imageEl) {
        const bgDiv = card.querySelector('.pro_bg .img, .pro_bg [style*="url"]');
        imageEl = resolveImg(document2, bgDiv);
      }
      const key = href || imageEl && imageEl.src;
      if (!key || seen.has(key)) return;
      seen.add(key);
      const textCell = [];
      const info = card.querySelector(".pro_info") || card;
      Array.from(info.querySelectorAll("h1, h2, h3, h4, h5, h6")).forEach((h) => textCell.push(h));
      const productImg = resolveImg(document2, info.querySelector(".product_img img"));
      if (productImg) textCell.push(productImg);
      if (href) {
        const cta = document2.createElement("a");
        cta.href = href;
        const label = (info.querySelector("h1, h2, h3, h4, h5, h6") || {}).textContent || link.textContent;
        cta.textContent = (label || href).replace(/\s+/g, " ").trim();
        textCell.push(cta);
      }
      if (!imageEl && textCell.length === 0) return;
      cells.push([imageEl || "", textCell.length ? textCell : ""]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-clinic.js
  function parse5(element, { document: document2 }) {
    const bgSource = element.querySelector(".imgArea img, .imgArea .img img, .txtArea dt img");
    let bgImage;
    if (bgSource) {
      const src = bgSource.getAttribute("src") || bgSource.getAttribute("data-src") || bgSource.getAttribute("data-original");
      if (src) {
        bgImage = document2.createElement("img");
        bgImage.src = src;
        if (bgSource.getAttribute("alt")) bgImage.alt = bgSource.getAttribute("alt");
      }
    }
    const headings = Array.from(element.querySelectorAll(".txtArea dt h4, .txtArea h1, .txtArea h2, .txtArea h3, .txtArea h4"));
    const ctaSource = element.querySelector(".txtArea a[href], a[href]");
    let cta;
    if (ctaSource && ctaSource.getAttribute("href")) {
      cta = document2.createElement("a");
      cta.href = ctaSource.getAttribute("href");
      const label = element.querySelector(".txtArea dd p, .txtArea dd");
      cta.textContent = (label ? label.textContent : ctaSource.textContent).replace(/\s+/g, " ").trim();
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    headings.forEach((h) => contentCell.push(h));
    if (cta) contentCell.push(cta);
    if (cells.length === 0 && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (contentCell.length > 0) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-clinic", cells });
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
      element.querySelectorAll(".outlineTit").forEach((tit) => {
        const p = element.ownerDocument.createElement("p");
        p.innerHTML = tit.innerHTML;
        tit.replaceWith(p);
      });
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
    if (hookName !== TransformHook2.beforeTransform) {
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-video": parse,
    "columns-brand": parse2,
    "carousel-story": parse3,
    "cards-product": parse4,
    "hero-clinic": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Homepage with video hero, brand about section, value-story carousel, product collection listing, and find-clinic CTA",
    urls: [
      "https://www.juvederm.co.kr"
    ],
    blocks: [
      { name: "hero-video", instances: ["#visual"] },
      { name: "columns-brand", instances: ["#about"] },
      { name: "carousel-story", instances: ["#story .story_roll"] },
      { name: "cards-product", instances: ["#collection .collection_roll"] },
      { name: "hero-clinic", instances: ["#find"] },
      { name: "section-collection", instances: ["#collection"], section: "grey" }
    ],
    sections: [
      { id: "visual", name: "Video Hero", selector: "#visual", style: null, blocks: ["hero-video"], defaultContent: [] },
      { id: "about", name: "Brand Intro", selector: "#about", style: null, blocks: ["columns-brand"], defaultContent: [] },
      { id: "story", name: "Value Story", selector: "#story", style: null, blocks: ["carousel-story"], defaultContent: ["#story .titArea"] },
      { id: "collection", name: "Product Collection", selector: "#collection", style: "grey", blocks: ["cards-product"], defaultContent: ["#collection .titArea"] },
      { id: "find", name: "Find Clinic CTA", selector: "#find", style: null, blocks: ["hero-clinic"], defaultContent: [] }
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
  var import_homepage_default = {
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
      main.querySelectorAll('img[src*="contents_bg"]').forEach((img) => {
        const wrapper = img.closest("p, picture") || img;
        (wrapper.closest("p") || wrapper).remove();
      });
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
  return __toCommonJS(import_homepage_exports);
})();
