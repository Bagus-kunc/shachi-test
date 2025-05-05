<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible')"
    modal
    class="!bg-white !w-11/12 !max-w-[320px] border border-exd-gray-44"
  >
    <template v-if="isRedirect" #container>
      <img
        src="/images/close.svg"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleCloseDialog"
      />
      <div
        class="w-full flex flex-col justify-center items-center py-6 !pb-8 relative"
      >
        <div v-if="popupImage" class="w-auto h-24 mt-4">
          <img :src="popupImage" class="object-contain w-full h-full" />
        </div>
        <div
          :class="[
            'font-bold  px-4 text-exd-1530 text-center text-exd-gray-scorpion',
            popupImage ? 'pt-3 pb-8' : 'py-10',
          ]"
          style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)"
        >
          <!-- <div class="max-h-[200px] px-16 overflow-auto leading-normal" v-html="popupDescription">
          </div> -->

          <p class="max-h-[200px] px-8 leading-normal whitespace-pre-line">
            {{ $t('congrats') }}
          </p>
        </div>
        <div
          class="inline-flex flex-wrap items-center justify-center w-full px-8 gap-x-3 gap-y-1"
        >
          <div class="speech-bubble text-[10pt]">
            {{ $t('share') }}
            <div class="triangle-border"></div>
            <div class="triangle-inner"></div>
          </div>

          <img
            v-for="(link, index) in socialMediaLinks"
            :key="index"
            :src="link.src"
            :alt="link.alt"
            :aria-label="link.alt"
            class="cursor-pointer md:size-7 size-7"
            @click="openLink(link.url)"
            preload
          />
        </div>
        <!-- <SolidButton
          :label="popupButton"
          :on-click="() => handleToRedirect()"
          variant="dark"
        /> -->
      </div>
    </template>

    <template v-else #container>
      <img
        src="/images/close.svg"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleCloseDialog"
      />
      <div
        class="w-full flex flex-col justify-center items-center gap-4 py-6 !pb-8 relative"
      >
        <div class="font-bold text-center text-exd-1424 text-exd-gray-scorpion">
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('toWinPrizes') }}
          </p>
          <p style="text-shadow: 0 3px 3px rgba(0, 0, 0, 0.16)">
            {{ $t('membershipRegistrationRequired') }}
          </p>
        </div>
        <SolidButton
          :label="$t('newMemberRegistration')"
          :on-click="handleToRegister"
          variant="tom"
        />
        <SolidButton
          :label="$t('loginToMyPage')"
          :on-click="handleToLogin"
          variant="gray"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import download from '~/assets/images/download.svg'
import facebook from '~/assets/images/facebook.svg'
import line from '~/assets/images/line.svg'
import x from '~/assets/images/x.svg'
import instagram from '~/assets/images/instagram.png'
import tiktok from '~/assets/images/tiktok.png'
import web1 from '~/assets/icons/web1.png'
import web2 from '~/assets/icons/web2.png'
import web3 from '~/assets/icons/web3.png'

const t = useI18n()
const socialMediaLinks = ref([])

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  isRedirect: { type: Boolean, default: false },
  popupButton: { type: String, default: '' },
  popupLink: { type: String, default: '' },
  popupDescription: { type: String, default: '' },
  popupImage: { type: String, default: '' },
  pointCategoryIsFail: { type: Boolean, default: false },
  shareData: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:visible', 'closeModalLogin'])

const { decryptData } = useEncryption()
const { setSourceFrom } = useRegister()

const handleShowDialog = () => emit('update:visible', true)
const handleCloseDialog = () => emit('update:visible', false)
const spinDetailData = ref({})

const handleToRedirect = async () => {
  if (props.pointCategoryIsFail) {
    const storedData = useCookie('VALID_PASSWORD')
    let parsedData = decryptData(storedData.value)

    const slug = parsedData.slug

    await navigateTo(`/spin/${slug}`)
  } else {
    window.location.href = props.popupLink // Use self-navigation
  }
}

const handleToRegister = async () => {
  setSourceFrom('spin')
  await navigateTo('/register')
}

const handleToLogin = () => {
  setSourceFrom('spin')
  handleCloseDialog()
  emit('closeModalLogin')
}

const openLink = (url) => {
  window.open(url, '_blank')
}

const share = (type) => {
  switch (type) {
    case 'image':
      downloadImage()
      break
    case 'facebook':
      shareToFacebook()
      break
    case 'x':
      shareToX()
      break
    case 'line':
      shareToLine()
      break

    default:
      break
  }
}

const generateUrlToShare = () => {
  let objectToShare = {
    url: url,
    quote: quote,
  }

  try {
    objectToShare.url =
      url +
      '/share/' +
      spinDetailData.value.character_id +
      '/' +
      spinDetailData.value.location_id
    objectToShare.quote =
      quote +
      '/share/' +
      spinDetailData.value.character_id +
      '/' +
      spinDetailData.value.location_id
  } catch (error) {
    console.log(error)
  }

  return objectToShare
}

const shareToFacebook = () => {
  let objectToShare = generateUrlToShare()
  try {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        objectToShare.url
      )}`
    )
  } catch (error) {
    console.log(error)
  }
}

const shareToX = () => {
  let objectToShare = generateUrlToShare()

  try {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        objectToShare.quote
      )}`
    )
  } catch (error) {
    console.log(error)
  }
}

const shareToLine = () => {
  let objectToShare = generateUrlToShare()
  try {
    window.open(
      `https://line.me/R/msg/text/?${encodeURIComponent(objectToShare.quote)}`
    )
  } catch (error) {
    console.log(error)
  }
}

watch(
  () => props.shareData,
  (share) => {
    socialMediaLinks.value = [
      { url: share.share_website1, src: web1, alt: 'Web 1' },
      { url: share.share_website2, src: web2, alt: 'Web 2' },
      { url: share.share_website3, src: web3, alt: 'Web 3' },
      { url: share.share_line_link, src: line, alt: 'Line' },
      { url: share.share_x_link, src: x, alt: 'X (Twitter)' },
      { url: share.share_fb_link, src: facebook, alt: 'Facebook' },
      { url: share.share_ig_link, src: instagram, alt: 'Instagram' },
      { url: share.share_tiktok_link, src: tiktok, alt: 'TikTok' },
    ].filter((link) => link.url)
  }
)
</script>

<style scoped>
.speech-bubble {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #555555;
  border-radius: 6px;
  padding: 7px 12px;
  display: inline-block;
  color: #000;
  max-width: 300px;
}

.triangle-border {
  position: absolute;
  top: 50%;
  right: -9px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 9px;
  border-color: transparent transparent transparent #606060;
  transform: translateY(-50%);
}

.triangle-inner {
  position: absolute;
  top: 50%;
  right: -8px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 0 4px 14px;
  border-color: transparent transparent transparent white;
  transform: translateY(-50%);
}
</style>
