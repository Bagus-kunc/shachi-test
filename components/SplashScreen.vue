<script setup>
import ovalBlur from '~/assets/images/oval-blur.png'

const loading = ref(true)
const isSupportSerWroker = ref(false)
let checkCachesInterval
let firstCount = 1

const emit = defineEmits(['finish'])

// Init service worker
if (process.client && 'serviceWorker' in navigator) {
  isSupportSerWroker.value = true
  navigator.serviceWorker.getRegistration().then((registration) => {
    if (registration) {
      registration.update()
      console.log('ServiceWorker updated')
    } else {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          )
        },
        (err) => {
          console.log('ServiceWorker registration failed: ', err)
        }
      )
    }
  })
} else {
  isSupportSerWroker.value = false
}

onMounted(() => {
  checkCachesInterval = setInterval(() => {
    firstCount += 1
    if (isSupportSerWroker.value) {
      checkCaches()
    } else {
      clearInterval(checkCachesInterval)
      completeLoading()
    }

    if (firstCount >= 7) {
      clearInterval(checkCachesInterval)
      completeLoading()
    }
  }, 1500)
})

function completeLoading() {
  loading.value = false
  emit('finish')
}

const checkCaches = () => {
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
  caches
    .open(`gacharary-shachi-v2 - ${self.location.origin}`)
    .then(function (cache) {
      return cache.keys()
    })
    .then(function (keys) {
      const chachesUrl = keys.map((i) => i.url)
      const isCacheAlready = urlsToCache.every((i) =>
        chachesUrl.some((a) => a.includes(i))
      )

      if (isCacheAlready) {
        clearInterval(checkCachesInterval)
        completeLoading()
      }
    })
}
</script>

<template>
  <div
    v-if="loading"
    class="w-full max-w-md mx-auto h-screen overflow-hidden bg-cover bg-center flex flex-col fixed z-[2000]"
  >
    <img
      src="/public/images/TOP.png"
      alt="top"
      class="absolute w-full h-full"
    />
    <div
      class="relative z-10 flex flex-col items-center justify-center w-full h-full text-exd-red"
    >
      <div
        class="-z-10 absolute w-full h-[488px] transform -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-cover left-1/2 top-1/2 flex items-center justify-center"
        :style="{ backgroundImage: `url(${ovalBlur})` }"
      ></div>
      <img
        src="~/assets/images/gacha-loading.gif"
        class="w-[100px] h-[100px]"
      />
      <h1 class="font-bold text-exd-2238 text-[#1F52BC] font-noto">LOADING…</h1>

      <!-- <img
        src="~/assets/images/loading.png"
        class="mt-6 ml-5 w-[126px] h-[24px]"
      /> -->
    </div>
  </div>
</template>
