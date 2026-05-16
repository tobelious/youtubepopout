let currentId = null;
const urlInput = document.getElementById('yt-url');
const popBtn = document.getElementById('pop-btn');

function parseVideoId(raw) {
  raw = raw.trim();
  let m = raw.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = raw.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  m = raw.match(/\/embed\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  return null;
}

function setVideoId(id) {
  currentId = id;
  popBtn.disabled = !id;
}

urlInput.addEventListener('input', () => {
  setVideoId(parseVideoId(urlInput.value));
});

urlInput.addEventListener('paste', () => {
  setTimeout(() => setVideoId(parseVideoId(urlInput.value)), 0);
});

function triggerPopOut() {
  if (!currentId) return;

  const autoplay = document.getElementById('chk-autoplay').checked ? 1 : 0;
  const mute = document.getElementById('chk-mute').checked ? 1 : 0;
  const loop = document.getElementById('chk-loop').checked ? 1 : 0;
  const controls = document.getElementById('chk-controls').checked ? 0 : 1;
  const start = parseInt(document.getElementById('start-time').value) || 0;
  const winW = parseInt(document.getElementById('win-w').value) || 1280;
  const winH = parseInt(document.getElementById('win-h').value) || 720;

  const params = new URLSearchParams({
    autoplay,
    mute,
    loop,
    controls,
    start,
    rel: 0,
    modestbranding: 1
  });

  if (loop) {
    params.append('playlist', currentId);
  }

  const embedUrl = `https://www.youtube.com/embed/${currentId}?${params}`;
  const playerUrl = `https://tobelious.vercel.app/projects/popout/player.html?embed=${encodeURIComponent(embedUrl)}`;

  const left = Math.max(0, Math.round((screen.width - winW) / 2));
  const top = Math.max(0, Math.round((screen.height - winH) / 2));

  const popup = window.open(
    playerUrl,
    'yt_popup_' + currentId,
    `width=${winW},height=${winH},left=${left},top=${top},resizable=yes,scrollbars=no,toolbar=no,menubar=no,location=no,status=no`
  );

  if (!popup) {
    alert('Pop-up blocked. Please allow pop-ups for this extension.');
    return;
  }
}

popBtn.addEventListener('click', triggerPopOut);