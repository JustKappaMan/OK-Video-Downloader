'use strict';

let lastUrl = location.href;

new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
  }
  if (location.search.includes('?st.cmd=movieLayer')) {
    const checker = setInterval(() => {
      if (document.querySelector('#mvplayer_cont')) {
        clearInterval(checker);
        main();
      }
    }, 100);
  }
}).observe(document, { subtree: true, childList: true });

function main() {
  if (!document.querySelector('#okVideoDownloaderPanel')) {
    // If video is embedded from a third party site
    if (document.querySelector('#mvplayer_cont div.js-nav-tmp')) {
      showPanel(createErrorPanel());
    } else {
      showPanel(createDownloadPanel(getVideoSource()));
    }
  }
}

function getVideoSource() {
  const videoPlayer = document.querySelector('a[data-video]');
  const videoPlayerInfo = JSON.parse(
    decodeURIComponent(videoPlayer.getAttribute('data-video'))
  );

  return videoPlayerInfo.videoSrc;
}

function createDownloadPanel(videoSource) {
  const aTag = document.createElement('a');
  aTag.href = videoSource;
  aTag.innerText = 'Скачать';

  const panel = document.createElement('div');
  panel.id = 'okVideoDownloaderPanel';
  panel.style.marginTop = '8px';
  panel.style.fontSize = '15px';
  panel.appendChild(aTag);

  return panel;
}

function createErrorPanel() {
  const label = document.createElement('span');
  label.innerText =
    'Видео со стороннего сайта. Воспользуйтесь инструментами для скачивания с исходного сайта.';
  label.style.color = '#f00';

  const panel = document.createElement('div');
  panel.id = 'okVideoDownloaderPanel';
  panel.style.marginTop = '8px';
  panel.style.fontSize = '15px';
  panel.appendChild(label);

  return panel;
}

function showPanel(panel) {
  document.querySelector('#mvplayer_cont').after(panel);
}
