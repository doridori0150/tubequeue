// TubeQueue 서비스 워커 — 앱 설치(공유 대상 등록)용. 항상 네트워크를 먼저 쓰고, 끊겼을 때만 저장본으로 화면을 띄운다.
// skipWaiting/clients.claim 은 쓰지 않는다: 열려 있는 페이지를 탐색 도중에 가로채면 응답이 잘리는 경우가 있었다.
const CACHE = 'tubequeue-v2';
const SHELL = ['./', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return; // YouTube 등 외부 요청은 건드리지 않음
  e.respondWith(fetch(req).then(res => {
    if (res.ok && !url.search) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./'))));
});
