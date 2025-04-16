// Tentukan nama cache dan file yang ingin di-cache
const CACHE_NAME = `gacharary-shachi-v2 - ${self.location.origin}`
const urlsToCache = [
  '/favicon.ico',
  '/video/new-spin-point.mp4',
  '/video/new-spin-character.mp4',
  '/images/sparkling.png',
  '/images/TOP.png',
  '/images/shachi-spin.png',
  '/images/gacha-tom.png',
  '/images/warning.svg',
  '/images/close.svg',
  '/images/export.svg',
  '/images/intl-tom.png',
  '/images/back-button.svg',
  '/images/rank-gold.png',
  '/icons/icon-gift.svg',
]

self.addEventListener('install', function (event) {
  self.skipWaiting()
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache')
        return cache.addAll(urlsToCache).then(() => {
          console.log('Add all cache')
        })
      })
      .catch((error) => {
        console.error('Failed to cache:', error)
      })
  )
})

self.addEventListener('activate', function (event) {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .catch((error) => {
        console.error('Failed to clean up old caches:', error)
      })
  )

  return self.clients.claim()
})

self.addEventListener('fetch', function (event) {
  if (
    event.request.url.endsWith('.mp4') &&
    event.request.headers.has('range')
  ) {
    event.respondWith(handleRangeRequest(event.request))
  } else {
    event.respondWith(
      caches
        .match(event.request)
        .then(function (response) {
          if (response) {
            return response
          }

          return fetch(event.request)
            .then(function (networkResponse) {
              return networkResponse
            })
            .catch((error) => {
              console.error('Fetch failed:', error)
            })
        })
        .catch((error) => {
          console.error('Cache match failed:', error)
        })
    )
  }
})

async function handleRangeRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  const response = await cache.match(request.url)

  if (!response) {
    return fetch(request)
  }

  const range = request.headers.get('range')
  const bytes = /bytes\=(\d+)\-(\d+)?/.exec(range)
  const start = Number(bytes[1])
  const videoBlob = await response.blob()
  const videoArrayBuffer = await videoBlob.arrayBuffer()
  const videoSize = videoArrayBuffer.byteLength

  // Jika tidak ada end byte, kirimkan dari start sampai akhir
  const end = bytes[2] ? Number(bytes[2]) : videoSize - 1
  const chunk = videoArrayBuffer.slice(start, end + 1)

  // Header untuk range response
  return new Response(chunk, {
    status: 206,
    statusText: 'Partial Content',
    headers: [
      ['Cache-Control', 'public, max-age=3600'],
      ['Content-Range', `bytes ${start}-${end}/${videoSize}`],
      ['Content-Length', chunk.byteLength],
      ['Content-Type', 'video/mp4'],
    ],
  })
}
