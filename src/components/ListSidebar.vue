<script setup>
import { reactive, computed } from 'vue'
import { PencilIcon, ListBulletIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useRoute } from 'vue-router'

const icons = {
  PencilIcon: PencilIcon,
  ListBulletIcon: ListBulletIcon
}

const lists = reactive([
  {
    name: 'About',
    icon: 'PencilIcon',
    link: '/about'
  },
  {
    name: 'ToDoリスト',
    icon: 'ListBulletIcon',
    link: '/todo'
    // show: false,
    // sublists: [
    //   {
    //     name: '商品一覧',
    //     link: '/product',
    //   },
    //   {
    //     name: '注文一覧',
    //     link: '/order',
    //   },
    // ],
  }
])

const toggle = (name) => {
  const list = lists.find((list) => list.name === name)
  list.show = !list.show
}

const enter = (element) => {
  element.style.height = 'auto'
  const height = getComputedStyle(element).height
  element.style.height = 0
  getComputedStyle(element)
  setTimeout(() => {
    element.style.height = height
  })
}

const leave = (element) => {
  element.style.height = getComputedStyle(element).height
  getComputedStyle(element)
  setTimeout(() => {
    element.style.height = 0
  })
}

// const currentRoute = computed(() => {
//   return useRoute().fullPath;
// });

const route = useRoute()
const currentRoute = computed(() => route.fullPath)
</script>

<template>
  <ul class="text-gray-700 dark:text-gray-300">
    <li class="mb-1" v-for="list in lists" :key="list.name">
      <router-link
        v-if="!list.sublists"
        :to="list.link"
        class="flex items-center p-2 rounded-sm hover:text-white hover:bg-blue-400"
        :class="{ 'bg-blue-600 text-white': currentRoute === list.link }"
      >
        <component :is="icons[list.icon]" class="w-6 h-6 mr-2"></component>
        <span>{{ list.name }}</span>
      </router-link>
      <div
        v-else
        class="flex items-center p-2 cursor-pointer rounded-sm hover:bg-blue-400 hover:text-white"
        @click="toggle(list.name)"
      >
        <div class="flex items-center">
          <component v-bind:is="icons[list.icon]" class="w-6 h-6 mr-2"></component>
          <span>{{ list.name }}</span>
        </div>
        <ChevronDownIcon
          class="w-4 h-4 transform duration-300"
          :class="!list.show ? 'rotate-0' : '-rotate-180'"
        />
      </div>
      <transition @enter="enter" @leave="leave">
        <ul class="mt-1 overflow-hidden" v-show="list.show">
          <li class="mb-1" v-for="list in list.sublists" :key="list.name">
            <router-link
              :to="list.link"
              class="block p-2 rounded-sm hover:bg-blue-400 hover:text-white"
              :class="{ 'bg-blue-600 text-white': currentRoute === list.link }"
            >
              <span class="pl-8">{{ list.name }}</span>
            </router-link>
          </li>
        </ul>
      </transition>
    </li>
  </ul>
</template>

<style scoped>
.v-enter-from,
.v-leave-to {
  height: 0;
}

.v-enter-active,
.v-leave-active {
  transition: height 0.3s;
}

.v-enter-to,
.v-leave-from {
  height: 100px;
}
</style>
