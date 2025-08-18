<template>
  <div class="w-full px-8">
    <Button
      :disabled="disabled"
      :loading="hasLoading"
      :class="[
        variantClass,
        variant === 'skip' ? '!p-2' : '!py-4 !px-6',
        bottomClass,
        disabled ? '!cursor-not-allowed' : '!cursor-pointer',
        '!w-full !uppercase !font-bold !text-exd-1424 !rounded-full text-white !relative',
      ]"
      raised
      @click="handleClick"
    >
      <span class="!text-center !w-full sm:!text-exd-1424 !text-exd-1220">{{ label }}</span>
      <div class="!absolute !right-6 !top-1/2 !transform !-translate-y-1/2">
        <LoadingIcon v-if="hasLoading && variant !== 'skip'" />
        <img
          v-if="hasIcon && !hasLoading && variant !== 'skip'"
          :src="variant !== 'tom' ? arrow : arrowTom"
          alt="arrow"
          width="10"
          height="10"
        />
      </div>
      <div v-if="hasIcon && variant === 'skip'" class="flex pr-3">
        <img :src="arrowSkip" alt="arrow" width="16" height="10" />
        <img :src="arrowSkip" alt="arrow" width="16" height="10" />
      </div>
    </Button>
  </div>
</template>

<script setup>
import LoadingIcon from './LoadingIcon.vue'
import arrow from '~/assets/images/arrow.svg'
import arrowTom from '~/assets/images/arrow-gray.png'
import arrowSkip from '~/assets/images/arrow-skip.svg'

const props = defineProps({
  hasIcon: {
    type: Boolean,
    default: true,
  },
  hasBottom: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hasLoading: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  },
  variant: {
    type: String,
    default: 'gold',
    validator: (value) =>
      [
        'gold',
        'tom',
        'red',
        'skip',
        'red-coral',
        'blue-green',
        'disabled',
        'gray',
        'dark',
        'tomato',
      ].includes(value),
  },
  onClick: {
    type: Function,
    default: null,
  },
})

const variantClass = computed(() => {
  if (props.variant === 'skip') {
    return '!bg-exd-gray-scorpion !text-white text-start !text-[16px] !w-auto !font-normal !opacity-90  !rounded-xl'
  } else if (props.variant === 'blue-green') {
    return '!bg-exd-blue-green'
  } else if (props.variant === 'red-coral') {
    return '!bg-exd-red-coral'
  } else if (props.variant === 'gold') {
    return '!bg-exd-gold'
  } else if (props.variant === 'tom') {
    return '!bg-exd-yellow-tom !text-exd-dark-grey'
  } else if (props.variant === 'disabled') {
    return '!bg-exd-stone-300'
  } else if (props.variant === 'gray') {
    return '!bg-exd-dark-grey'
  } else if (props.variant === 'dark') {
    return '!bg-exd-dark'
  } else if (props.variant === 'tomato') {
    return '!bg-exd-tomato'
  } else {
    return '!bg-exd-red-vermilion'
  }
})

const bottomClass = computed(() => {
  return props.hasBottom
    ? 'inset-x-1/2 z-50 -translate-x-1/2 -translate-y-1/4 !absolute !bottom-1'
    : ''
})

const handleClick = (event) => {
  props.onClick && props.onClick(event)
}
</script>
