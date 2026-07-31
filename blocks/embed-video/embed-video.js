/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
    <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : embed}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedVimeo = (url, autoplay) => {
  // Extract the numeric video id from either a vimeo.com/{id} share link or a
  // pre-formed player.vimeo.com/video/{id} embed link.
  const video = (url.pathname.match(/\d+/) || [])[0] || '';
  // Preserve any params authored on a player embed URL (e.g. loop, muted,
  // title=0) — the source campaign video relies on these for its chrome-less,
  // auto-playing background style. Fall back to a muted autoplay when the block
  // was opened via a poster click.
  const params = new URLSearchParams(url.search);
  if (autoplay) {
    params.set('muted', '1');
    params.set('autoplay', '1');
  }
  const query = params.toString();
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${video}${query ? `?${query}` : ''}"
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  if (!url.href.startsWith('https://twitter.com')) {
    url.href = url.href.replace('https://x.com', 'https://twitter.com');
  }
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-video-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['twitter', 'x.com'],
      embed: embedTwitter,
    },
  ];
  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url, autoplay);
    block.classList = `block embed-video embed-video-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed-video';
  }
  block.classList.add('embed-video-is-loaded');
};

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-video-placeholder';
    wrapper.innerHTML = '<div class="embed-video-placeholder-play"><button type="button" title="Play"></button></div>';
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => {
      loadEmbed(block, link, true);
    });
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}
