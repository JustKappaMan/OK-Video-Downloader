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
}).observe(document, { subtree: true, childList: true });

function main() {
  if (!document.querySelector('#okVideoDownloaderPanel')) {
    const videoSources = getVideoSources();
    // If a video is uploaded to Odnoklassniki directly
    if (Object.keys(videoSources).length) {
      showPanel(createDownloadPanel(videoSources));
      // If a video is embedded from a third party site
    } else {
      showPanel(createErrorPanel());
    }
  }
}

function getVideoSources() {
  let videoSources = {};

  const videoPlayer = document.querySelector('div[data-module="OKVideo"]');
  const videoPlayerInfo = JSON.parse(
    decodeURIComponent(videoPlayer.getAttribute('data-options'))
  );
  const videoPlayerMetadata = JSON.parse(
    decodeURIComponent(videoPlayerInfo.flashvars.metadata)
  );

  // If a video is embedded from a third party site
  if ('originalUrl' in videoPlayerMetadata.movie) {
    return videoSources;
  }

  for (const video of videoPlayerMetadata.videos) {
    switch (video.name) {
      case 'mobile':
        videoSources['144p'] = video.url;
        break;
      case 'lowest':
        videoSources['240p'] = video.url;
        break;
      case 'low':
        videoSources['360p'] = video.url;
        break;
      case 'sd':
        videoSources['480p'] = video.url;
        break;
      case 'hd':
        videoSources['720p'] = video.url;
        break;
      case 'full':
        videoSources['Original'] = video.url;
        break;
    }
  }

  return videoSources;
}

function createDownloadPanel(videoSources) {
  const label = document.createElement('span');
  label.innerText = 'Скачать:';
  label.style.margin = '0 2px 0 0';

  const panel = document.createElement('div');
  panel.id = 'okVideoDownloaderPanel';
  panel.style.margin = '8px 12px 0';
  panel.style.fontSize = '14px';
  panel.appendChild(label);

  for (const [quality, url] of Object.entries(videoSources)) {
    const aTag = document.createElement('a');
    aTag.href = url;
    aTag.innerText = quality;
    aTag.style.margin = '0 2px';
    panel.appendChild(aTag);
  }

  return panel;
}

function createErrorPanel() {
  const label = document.createElement('span');
  label.innerText =
    'Видео со стороннего сайта. Воспользуйтесь инструментами для скачивания с исходного сайта.';
  label.style.color = '#f00';
  label.style.marginRight = '2px';

  const panel = document.createElement('div');
  panel.id = 'okVideoDownloaderPanel';
  panel.style.margin = '8px 12px 0';
  panel.style.fontSize = '14px';
  panel.appendChild(label);

  return panel;
}

function showPanel(panel) {
  document.querySelector('div.vp_video').after(panel);
}