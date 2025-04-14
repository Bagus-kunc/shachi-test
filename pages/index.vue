<template>
  <div
    @touchmove="(e) => e.preventDefault()"
    class="flex flex-col grow bg-[#085CB0] bg-cover bg-center justify-between relative overflow-hidden cursor-pointer"
  >
    <!-- Overlay background solid color -->
    <div class="bg-[#085CB0] absolute inset-0 z-0"></div>

    <!-- Container scrollable -->
    <div
      class="relative z-10 overflow-y-auto min-h-dvh no-scrollbar"
      @touchmove="handleTouchMove"
      @click="handleShowModal"
    >
      <img src="/public/images/TOP.png" alt="top" class="w-full h-full" />

      <div
        class="absolute w-full h-[488px] z-[20] transform -translate-x-1/2 -translate-y-1/2 bg-center bg-no-repeat bg-cover left-1/2 top-1/2 flex items-center justify-center"
        :style="{ backgroundImage: `url(${ovalBlur})` }"
      >
        <img :src="topTitle" alt="intl" class="w-[350px]" />
      </div>

      <div
        class="absolute bottom-0 w-full transform -translate-x-1/2 bg-center bg-no-repeat bg-cover h-[580px] left-1/2"
        :style="{ backgroundImage: `url(${blueGradient})` }"
      >
        <img
          :src="tapScreen"
          alt="intl"
          class="w-[300px] absolute left-1/2 bottom-[5%] transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  </div>

  <ModalLogin v-model="hasModal" :email="emailVerified" />

  <WarningPopUp
    :is-open="isComplete"
    :on-close="handleClose"
    :has-button="true"
    :on-click-button="handleDialog"
    label-button="GO!"
    :modal-title="$t('verificationCompleted')"
  />

  <WarningPopUp
    :is-open="isFailed"
    :on-close="handleClose"
    :has-button="true"
    :on-click-button="handleDialog"
    label-button="GO!"
    :modal-title="$t('verificationFailed')"
  />
</template>

<script setup>
import topTitle from '~/public/images/top-title.png'
import ovalBlur from '~/assets/images/oval-blur.png'
import tapScreen from '~/assets/images/tap-screen.png'
import blueGradient from '~/public/images/blue-gradient.png'
import { nextTick } from 'vue'
import WarningPopUp from '~/components/WarningPopUp.vue'

const route = useRoute()
const router = useRouter()
const { setSourceFrom } = useRegister()
const hasModal = ref(false)
const isComplete = ref(false)
const isFailed = ref(false)
const emailVerified = ref('')

const TOKEN = useCookie('TOKEN')
const USER = useCookie('USER')
const VALID_PASSWORD = useCookie('VALID_PASSWORD')
const langPanel = ref(false)

const handleShowModal = () => {
  hasModal.value = true
  setSourceFrom('top')
}
const handleDialog = async () => {
  isComplete.value = false
  isFailed.value = false
  router.push('/')
  await nextTick()
  handleShowModal()
}

const handleClose = () => {
  isComplete.value = false
  isFailed.value = false
}

const form = ref({
  emailAddress: '',
  password: '',
})

const updateModel = (field, value) => {
  form.value[field] = value
}

const validateInput = (field, value) => {
  console.log(`Validated ${field}:`, value)
}

const langPanelToggle = (event) => {
  langPanel.value = !langPanel.value
}

const handleTouchMove = (e) => {
  const scrollableElement = e.currentTarget
  const scrollTop = scrollableElement.scrollTop
  const scrollHeight = scrollableElement.scrollHeight
  const offsetHeight = scrollableElement.offsetHeight

  if (scrollHeight > offsetHeight) {
    e.stopPropagation()
  }
}
const checkVerified = async (verified) => {
  try {
    const { status, data } = await useFetchApi(
      'GET',
      `/login/decrypt/${verified}`
    )
    if (status && data && data.email) {
      emailVerified.value = data.email
      handleShowModal()
    }
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  const verified = route.query.verified
  const hash = window.location.hash

  const clearSession = () => {
    localStorage.clear()
    sessionStorage.clear()
    TOKEN.value = null
    USER.value = null
    VALID_PASSWORD.value = null
  }

  if (verified) {
    await checkVerified(verified)
    clearSession()
  } else if (hash === '#verification-failed') {
    isFailed.value = true
    clearSession()
  } else if (TOKEN.value) {
    navigateTo('/dashboard')
  }

  if (hash === '#registration-complete') {
    isComplete.value = true
  }
})
</script>

<style>
.no-scrollbar {
  overflow-x: hidden; /* Mencegah scroll horizontal */
  scrollbar-width: none; /* Sembunyikan scrollbar pada Firefox */
}

/* Sembunyikan scrollbar pada Chrome, Edge, dan Safari */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.background-gradient {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(63, 11, 6, 0.8) 0%,
    rgba(63, 11, 6, 1) 50%
  );
  pointer-events: none;
}

.tap-screen {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(63, 11, 6, 0.8) 00%,
    rgba(63, 11, 6, 1) 100%
  );
  pointer-events: none;
}
</style>
