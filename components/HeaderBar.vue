<template>
  <header
    class="pt-[39px] pb-3 flex justify-between items-center top-0 left-0 right-0 z-40 fixed w-full max-w-md mx-auto bg-white"
    style="box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.1608)"
    @touchmove="(e) => e.preventDefault()"
  >
    <div class="pl-5" v-if="hasBack">
      <img
        src="/images/back-button.svg"
        alt="back"
        width="40"
        height="40"
        preload
        class="cursor-pointer"
        @click="handleGoBack"
      />
    </div>
    <div
      :class="['grow text-center', !hasBack ? 'pl-[60px]' : '']"
      v-if="!withLogo"
    >
      <slot />
    </div>
    <div
      :class="[
        'grow text-center w-full justify-center items-center flex',
        !hasBack ? 'pl-[60px]' : '',
      ]"
      v-else
    >
      <img
        src="/images/shachi-spin.png"
        alt="intl"
        width="140"
        height="44"
        preload
        class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      />
    </div>
    <div class="pr-5 shrink-0">
      <div class="relative">
        <button type="button" aria-haspopup="true" @click="langPanelToggle">
          <img
            src="/images/intl-tom.png"
            alt="intl"
            width="40"
            height="40"
            preload
            class="cursor-pointer"
          />
        </button>
        <LanguangePanel v-model:visible="langPanel" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()

defineProps({
  hasBack: {
    type: Boolean,
    default: false,
  },
  withLogo: {
    type: Boolean,
    default: false,
  },
})

const langPanel = ref(false)

const langPanelToggle = (event) => {
  langPanel.value = !langPanel.value
}

const handleGoBack = () => {
  if (window.history.length > 2) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
