# HarmonyCa brand fonts — drop-in guide

The HarmonyCa microsite (`/harmony-*` pages) is designed in two **licensed**
fonts. Until the licensed webfont files are added, the site renders with free
look-alikes and upgrades automatically once the real files are present — no
code changes required.

| Role            | Licensed font (Figma) | Free fallback (currently shown) |
|-----------------|-----------------------|---------------------------------|
| Display serif   | **Saol Standard**     | Cormorant Garamond (Google)     |
| Grotesque sans  | **Founders Grotesk**  | Inter (Google)                  |

## How the swap works

- `styles/harmony-fonts.css` declares `@font-face` for the licensed families,
  pointing at the local files listed below. It's loaded (with the Google
  fallbacks) by `loadFonts()` in `scripts/scripts.js`, gated to `harmony` paths.
- Every HarmonyCa block's font stack is `'<licensed>', '<fallback>', …`, e.g.
  `'Saol Standard', 'Cormorant Garamond', Georgia, serif`. The browser uses the
  first family that successfully loads.
- All faces use `font-display: swap`, so text paints immediately with the
  fallback and re-renders in place when the licensed face finishes loading.

## To install the real fonts

1. Obtain the licensed **woff2** files (subset to Latin if possible for size).
2. Drop them into `/fonts/` with these EXACT names (referenced by
   `styles/harmony-fonts.css`):

   ```
   saol-standard-light.woff2
   saol-standard-light-italic.woff2      (used by the italic accent words)
   founders-grotesk-light.woff2          (weight 300)
   founders-grotesk-regular.woff2        (weight 400)
   founders-grotesk-medium.woff2         (weight 500)
   ```

3. That's it — reload a harmony page. The licensed faces take over; the Google
   fallbacks stay only as a safety net.

If a weight/style you need isn't in the list above, add a matching `@font-face`
block in `styles/harmony-fonts.css` and a file here with the same name.
