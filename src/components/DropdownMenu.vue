<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { UserIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'

const show = ref(false)
const root = ref(null)
const router = useRouter()
const auth = getAuth()
const user = ref(null)
const userName = ref('Your Name')

const logout = async () => {
  const auth = getAuth()
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout Error:', error)
  }
}

const toggle = () => {
  show.value = !show.value
}

const clickOutside = (e) => {
  if (!root.value.contains(e.target) && show.value) {
    show.value = false
  }
}

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser
      userName.value = currentUser.displayName || 'Your Name'
    }
  })
})

onMounted(() => document.addEventListener('click', clickOutside))
onUnmounted(() => document.removeEventListener('click', clickOutside))
</script>

<template>
  <div class="relative" ref="root">
    <img
      :src="user?.photoURL || '../assets/default_user.jpg'"
      class="rounded-full w-10 h-10 cursor-pointer"
      @click="toggle"
    />
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="transform opacity-0 translate-y-2"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="transform opacity-0 translate-y-2"
    >
      <div
        class="absolute top-16 right-0 z-10 w-40 py-2 bg-white rounded-sm shadow dark:bg-gray-800"
        v-show="show"
      >
        <ul>
          <li
            class="text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-600 p-2"
          >
            <router-link to="/profile" class="flex items-center space-x-2">
              <UserIcon class="w-5 h-5" />
              <span class="text-sm font-bold">プロファイル</span></router-link
            >
          </li>
          <li
            class="text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-600 p-2"
          >
            <button @click="logout" class="flex items-center space-x-2 w-full text-left">
              <ArrowRightStartOnRectangleIcon class="w-5 h-5" />
              <span class="text-sm font-bold">ログアウト</span>
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
