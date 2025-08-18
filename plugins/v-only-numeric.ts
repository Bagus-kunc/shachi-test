import { defineNuxtPlugin } from '#app'
import type { DirectiveBinding } from 'vue';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('only-numeric', {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
      // Fungsi untuk menghandle input event
      const handleInput = (event: Event) => {
        const input = event.target as HTMLInputElement
        const value = input.value

        // Menghilangkan karakter yang bukan angka
        const numericValue = value.replace(/\D/g, '')

        if (value !== numericValue) {
          input.value = numericValue
          input.dispatchEvent(new Event('input'))
        }
      }

      // Menyimpan fungsi handleInput di elemen untuk digunakan nanti
      ;(el as any).__handleInput__ = handleInput

      // Menambahkan event listener jika binding.value bukan false
      if (binding.value !== false) {
        el.addEventListener('input', handleInput)
      }
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
      // Jika binding value berubah
      if (binding.value !== binding.oldValue) {
        if (binding.value === false) {
          // Hapus event listener jika value adalah false
          el.removeEventListener('input', (el as any).__handleInput__)
        } else {
          // Tambah event listener jika value bukan false
          el.addEventListener('input', (el as any).__handleInput__)
        }
      }
    },
    unmounted(el: HTMLElement) {
      // Hapus event listener saat directive dihapus
      el.removeEventListener('input', (el as any).__handleInput__)
      delete (el as any).__handleInput__
    },
  })
})
