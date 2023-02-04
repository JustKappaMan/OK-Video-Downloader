'use strict';

let lastUrl = location.href;

new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
  }
  if (location.pathname.includes('/video/')) {
    const checker = setInterval(() => {
      if (document.querySelector('div.vp_video')) {
        clearInterval(checker);
        main();
      }
    }, 100);
  }
}).observe(document, {
  subtree: true,
  childList: true
});

function main() {
  if (!document.querySelector('#okVideoDownloaderPanel')) {
    showPanel(createDownloadPanel(getSources()));
  }
}

function getSources() {
  const videoPlayer = document.querySelector('div[data-module="OKVideo"]');
  const videoPlayerInfo = JSON.parse(decodeURIComponent(videoPlayer.getAttribute('data-options')));
  const videoPlayerMetadata = JSON.parse(decodeURIComponent(videoPlayerInfo.flashvars.metadata));

  let sources = {};

  for (const video of videoPlayerMetadata.videos) {
    switch (video.name) {
      case 'mobile':
        sources['144p'] = video.url;
        break;
      case 'lowest':
        sources['240p'] = video.url;
        break;
      case 'low':
        sources['360p'] = video.url;
        break;
      case 'sd':
        sources['480p'] = video.url;
        break;
      case 'hd':
        sources['720p'] = video.url;
        break;
      case 'full':
        sources['Original'] = video.url;
        break;
    }
  }

  return sources;
}

function createDownloadPanel(sources) {
  const label = document.createElement('span');
  label.innerText = 'Скачать:';
  label.style.margin = '0 2px 0 0';

  const panel = document.createElement('div');
  panel.id = 'okVideoDownloaderPanel';
  panel.style.margin = '8px 12px 0';
  panel.style.fontSize = '14px';
  panel.appendChild(label);

  for (const [quality, url] of Object.entries(sources)) {
    const aTag = document.createElement('a');
    aTag.href = url;
    aTag.innerText = quality;
    aTag.style.margin = '0 2px';
    panel.appendChild(aTag);
  }

  return panel;
}

function showPanel(panel) {
  document.querySelector('div.vp_video').after(panel);
}