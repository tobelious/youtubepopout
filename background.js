// youtube popout chrome extension
// by tobelious
// https://tobelious.vercel.app

chrome.action.onClicked.addListener((tab) => {
  if (!tab.url) return;

  const videoId = parseVideoId(tab.url);

  if (!videoId) {
    console.log("No valid YouTube video ID found on this page.");
    return;
  }

  triggerPopOut(videoId);
});

function parseVideoId(url) {
  let m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = url.match(/\/embed\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

function triggerPopOut(currentId) {
  const autoplay = 0; // no autoplay
  const mute = 0;     // not muted
  const controls = 1; // show controls
  const loop = 0;     // dont loop
  const start = 0;    // start from beginning
  const winW = 1280;  // 1280 width
  const winH = 720;   // 720 height

  const params = new URLSearchParams({
    autoplay,
    mute,
    loop,
    controls,
    start,
    rel: 0,
    modestbranding: 1
  });

  const embedUrl = `https://www.youtube.com/embed/${currentId}?${params}`;
  const playerUrl = `https://tobelious.vercel.app/projects/popout/player.html?embed=${encodeURIComponent(embedUrl)}`;

  chrome.windows.create({
    url: playerUrl,
    type: 'popup',
    width: winW,
    height: winH,
    focused: true
  });
}