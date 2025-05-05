<template>
  <div
    class="grow bg-[url('/images/bg-gacha-character.png')] bg-cover bg-center relative flex flex-col justify-center items-center"
    @touchmove="(e) => e.preventDefault()"
  >
    <SparkleStart className="top-3 z-30" />

    <img
      src="/images/gacha-tom.png"
      alt="gacha2"
      class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-none h-auto max-h-[96svh] object-contain"
      preload
    />
    <img
      src="/images/sparkling.png"
      alt="sparkling"
      class="absolute z-10 object-cover w-full h-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 animate-sparkling"
      preload
    />
    <div class="absolute inset-0 z-20 flex justify-center">
      <CircleSpinCharacter
        class="relative top-1/2 -translate-y-[50%]"
        :imageSrc="characterImageUrl"
        :raritySrc="raritySrc"
        headSrc="/images/text-char.png"
        width="100%"
        height="100%"
      />

      <div
        class="absolute text-exd-dark-grey bg-white flex justify-center bottom-[17%] px-4 py-3 min-h-[50px] rounded-lg"
      >
        <p class="text-[17px] max-w-[278px] text-center">{{ charName }}</p>
      </div>
    </div>

    <div class="absolute bottom-0 w-full">
      <SolidButton
        :label="$t('toTheNext')"
        :on-click="handleButton"
        variant="dark"
        has-bottom
      />
    </div>
  </div>

  <ModalAfterSpin
    v-model:visible="hasModal"
    :is-redirect="isRedirect"
    :popup-button="popupButton"
    :popup-link="popupLink"
    :popup-description="popupDescription"
    :popup-image="popupImage"
    :point-category-is-fail="pointCategoryIsFail"
    @closeModalLogin="handleCloseModalLogin"
  />

  <ModalLogin v-model="modalLogin" />

  <Dialog
    v-model:visible="isNotAllowed"
    modal
    class="!bg-white !w-11/12 !max-w-sm border border-exd-gray-44"
  >
    <template #container>
      <img
        src="/images/close.svg"
        alt="close"
        width="30"
        height="30"
        preload
        class="absolute z-50 cursor-pointer right-1 top-1"
        @click="handleClose"
      />
      <div
        class="flex flex-col items-center justify-center w-full gap-4 px-6 py-6"
      >
        <img
          src="/images/warning.svg"
          alt="warning"
          width="40"
          height="40"
          preload
        />
        <div class="w-10/12 text-center">
          <p class="font-bold text-exd-1424 text-exd-gray-scorpion">
            {{ errorMessages }}
          </p>
        </div>
        <SolidButton label="ガチャTOP" :on-click="() => goTo('/dashboard')" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import useRegister from '~/composables/useRegister'
import iconGift from '/icons/icon-gift.svg'
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: 'valid-password',
  layout: 'gacha-machine',
})

const { setSourceFrom } = useRegister()
const route = useRoute()

const hasModal = ref(false)
const errorMessages = ref('')
const modalLogin = ref(false)
const isNotAllowed = ref(false)
const isVisible = ref(false)
const isHiding = ref(false)

const USER = useCookie('USER')
const TOKEN = useCookie('TOKEN')

const characterImageUrl = ref(null)
const charName = ref(null)
const raritySrc = ref(null)

const isRedirect = ref(false)
const popupButton = ref('')
const popupLink = ref('')
const popupDescription = ref('')
const popupImage = ref('')
const pointCategoryIsFail = ref(false)

const handleClose = () => (isNotAllowed.value = false)
const handleShowDialog = () => (hasModal.value = true)
const handleCloseDialog = () => (hasModal.value = false)
const { decryptData } = useEncryption()
const { t } = useI18n()

const handleCloseModalLogin = () => (modalLogin.value = false)

const handleButton = async () => {
  if (isRedirect.value) {
    return handleShowDialog()
  }

  if (!TOKEN.value && !USER.value) {
    handleShowDialog()
  } else {
    await navigateTo('/dashboard')
  }
}

const fetchImage = async () => {
  try {
    const storedData = useCookie('VALID_PASSWORD')

    if (!storedData.value) {
      console.error('No verified data found in localStorage')
      return
    }

    let parsedData
    try {
      parsedData = decryptData(storedData.value)
    } catch (e) {
      console.error('Error parsing stored data:', e)
      return
    }

    const slug = parsedData.slug.toUpperCase()

    const slugData = decryptData(localStorage.getItem(`${slug}_GACHA`))
    console.log(slugData)

    characterImageUrl.value = slugData?.character_image
    charName.value = slugData?.character_name
    raritySrc.value = slugData?.character_rarity
    isRedirect.value = true
    popupLink.value = slugData?.redirect_link
    popupDescription.value = slugData?.popup_description
    popupImage.value = slugData?.popup_image
    pointCategoryIsFail.value = slugData?.point_category_is_fail

    if (slugData?.hide_character && route.path.includes('character')) {
      navigateTo(`/spin/${parsedData.slug}`)
    } else if (slugData?.point_category_is_fail) {
      popupButton.value = t('playAgain')
    } else {
      popupButton.value = t('formHere')
    }
  } catch (e) {
    console.error('Unexpected error:', e)
  }
}

const goTo = async (url) => {
  await navigateTo(url)
}

onMounted(() => {
  fetchImage()
})
</script>

<style scoped>
::v-deep(.p-dialog-header) {
  display: none;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

.notif {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 30px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  top: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.638);

  animation: slideIn 0.3s ease-out forwards;
}

.notif.hide {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animate-sparkling {
  opacity: 0.4;
  transform-box: fill-box;
  transform-origin: center center;
  animation: sparkle 1s infinite cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
