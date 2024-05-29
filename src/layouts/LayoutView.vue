<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// import { Bars3Icon, MoonIcon, SunIcon } from '@heroicons/vue/16/solid'
import { Bars3Icon } from '@heroicons/vue/16/solid'
import { debounce } from 'lodash'
import DropdownMenu from '../components/DropdownMenu.vue'
import Sidebar from '../components/SidebarComp.vue'

// const theme = ref('light')
// const changeMode = (mode) => {
//   theme.value = mode
//   theme.value === 'light'
//     ? document.documentElement.classList.remove('dark')
//     : document.documentElement.classList.add('dark')
//   localStorage.theme = mode
// }
const innerWidth = ref(window.innerWidth)
const show = ref(innerWidth.value >= 1280 ? true : false)
const checkWindowSize = () => {
  if (window.innerWidth >= 1280) {
    if (show.value === false && innerWidth.value < 1280) show.value = true
  } else {
    if (show.value === true) show.value = false
  }
  innerWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', debounce(checkWindowSize, 100))
})
onUnmounted(() => {
  window.removeEventListener('resize', checkWindowSize)
})
</script>

<template>
  <div class="relative">
    <div
      class="fixed top-0 w-64 h-screen bg-white dark:bg-gray-800 z-20 transform duration-300 dark:text-gray-300"
      :class="{ '-translate-x-full': !show }"
    >
      <Sidebar />
    </div>
    <div
      class="fixed xl:hidden inset-0 bg-gray-900 opacity-50 z-10"
      @click="show = !show"
      v-show="show"
    ></div>
    <div
      class="bg-gray-100 dark:bg-gray-800 h-screen overflow-hidden duration-300"
      :class="{ 'xl:pl-64': show }"
    >
      <div
        class="flex items-center justify-between bg-white dark:bg-gray-600 rounded shadow m-4 p-4"
      >
        <Bars3Icon
          class="h-6 w-6 text-gray-600 dark:text-gray-300 cursor-pointer"
          @click="show = !show"
        />
        <div class="flex items-center space-x-4">
          <!-- <MoonIcon
            class="w-7 h-7 text-gray-600 cursor-pointer"
            @click="changeMode('dark')"
            v-if="theme === 'light'"
          />
          <SunIcon
            class="w-7 h-7 text-gray-300 cursor-pointer"
            @click="changeMode('light')"
            v-else
          /> -->
          <DropdownMenu />
        </div>
      </div>
      <div class="dark:text-gray-300">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
