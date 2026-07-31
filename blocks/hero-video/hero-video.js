/*
 * hero-video — full-bleed autoplaying background video hero.
 * Authored structure (rows): [ video URL link ] , [ h2 wordmark ].
 * Decorates into: background video layer + centered wordmark overlay +
 * play/pause & mute controls + scroll-down cue.
 */

const ICONS = {
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zm3.3 8.7 1.3-1.3L4.3 3.2 3 4.5l5 5H3v6h4l5 5v-6.2l4.8 4.8z"/></svg>',
  unmuted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
};

function vimeoPost(iframe, method, value) {
  if (!iframe || !iframe.contentWindow) return;
  const msg = { method };
  if (value !== undefined) msg.value = value;
  iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
}

export default function decorate(block) {
  const rows = [...block.children];
  const link = block.querySelector('a[href*="vimeo.com"], a[href*="player.vimeo"]');
  const heading = block.querySelector('h1, h2, h3');

  // If there is no video source, keep the light "no-image" fallback.
  if (!link) {
    block.classList.add('no-image');
    return;
  }

  block.classList.remove('no-image');

  // Build the background video layer.
  const src = link.getAttribute('href');
  const bg = document.createElement('div');
  bg.className = 'hero-video-bg';
  const iframe = document.createElement('iframe');
  iframe.className = 'hero-video-iframe';
  iframe.src = src;
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
  iframe.setAttribute('title', heading ? heading.textContent.trim() : 'Background video');
  iframe.setAttribute('tabindex', '-1');
  iframe.setAttribute('aria-hidden', 'true');
  bg.append(iframe);

  // Centered wordmark overlay.
  const overlay = document.createElement('div');
  overlay.className = 'hero-video-overlay';
  if (heading) overlay.append(heading);

  // Play/pause + mute controls.
  const controls = document.createElement('div');
  controls.className = 'hero-video-controls';
  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.className = 'hero-video-btn hero-video-play';
  playBtn.setAttribute('aria-label', 'Pause video');
  playBtn.innerHTML = ICONS.pause;
  const muteBtn = document.createElement('button');
  muteBtn.type = 'button';
  muteBtn.className = 'hero-video-btn hero-video-mute';
  muteBtn.setAttribute('aria-label', 'Unmute video');
  muteBtn.innerHTML = ICONS.muted;
  controls.append(playBtn, muteBtn);

  let playing = true;
  let muted = true;
  playBtn.addEventListener('click', () => {
    playing = !playing;
    vimeoPost(iframe, playing ? 'play' : 'pause');
    playBtn.innerHTML = playing ? ICONS.pause : ICONS.play;
    playBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
  });
  muteBtn.addEventListener('click', () => {
    muted = !muted;
    vimeoPost(iframe, 'setVolume', muted ? 0 : 1);
    muteBtn.innerHTML = muted ? ICONS.muted : ICONS.unmuted;
    muteBtn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video');
  });

  // Scroll-down cue.
  const scroll = document.createElement('a');
  scroll.className = 'hero-video-scroll';
  scroll.href = '#';
  scroll.setAttribute('aria-label', 'Scroll down');
  scroll.innerHTML = '<span class="hero-video-scroll-dot"></span><span class="hero-video-scroll-label">SCROLL DOWN</span>';
  scroll.addEventListener('click', (e) => {
    e.preventDefault();
    const section = block.closest('.section');
    const next = section?.nextElementSibling;
    (next || section)?.scrollIntoView({ behavior: 'smooth' });
  });

  rows.forEach((r) => r.remove());
  block.append(bg, overlay, controls, scroll);
}
