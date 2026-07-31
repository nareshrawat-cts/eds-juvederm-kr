/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: juvederm.co.kr site-wide cleanup.
 *
 * Removes non-authorable site chrome and widgets so the import contains only
 * page-level authorable content. All selectors below were verified against
 * migration-work/cleaned.html.
 *
 * Verified DOM (cleaned.html):
 *   - #header.fixed          (line 5)    site header / PC menu
 *   - #menuArea              (line 137)  mobile menu area (site chrome)
 *   - .insta_wrap            (line 236)  WRAPPER around #quick AND main content
 *                                        -> do NOT remove; only remove #quick
 *   - #quick                 (line 237)  floating social quick-links widget
 *   - nav.mobile_snb         (line 281)  mobile duplicate of authorable div.lnb
 *   - #footer                (line 521)  site footer
 *   - #onetrust-consent-sdk  (line 801)  OneTrust cookie consent banner
 *
 * Authorable content preserved: #contents > div.lnb (sub navigation, kept per
 * page-templates.json), #visual, #about/#story/#collection/#find, and the
 * section.* content blocks.
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / widgets that would interfere with block parsing.
    // #quick is the floating social quick-links widget nested inside
    // .insta_wrap; remove #quick only (never .insta_wrap, which also wraps
    // the main content). #onetrust-consent-sdk is the OneTrust cookie banner.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#quick',
      // Hidden modal/popup layers (visibility:hidden on the source, opened via
      // JS). These hold the "필러 사용 시 주의사항" precautions content, the
      // medical-info/contact block, and the search UI — all non-authorable
      // popups that must NOT land in the page flow.
      '.window',
      '.window2',
      '.caution_cont_wrap',
    ]);

    // The decorative section eyebrow ".outlineTit" (a big outlined wordmark,
    // e.g. "Juvéderm®" in #story .titArea) is a <div> containing text + <sup>.
    // The markdown conversion splits such a div into two paragraphs
    // ("Juvéderm" and a lone "®"). Converting it to a <p> keeps it as a single
    // clean paragraph so it can be styled as one watermark, like the source.
    element.querySelectorAll('.outlineTit').forEach((tit) => {
      const p = element.ownerDocument.createElement('p');
      p.innerHTML = tit.innerHTML;
      tit.replaceWith(p);
    });
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome and leftover elements.
    WebImporter.DOMUtils.remove(element, [
      '#header',
      '#menuArea',
      'nav.mobile_snb',
      '#footer',
      'script',
      'noscript',
      'link',
      'iframe',
    ]);
  }
}
