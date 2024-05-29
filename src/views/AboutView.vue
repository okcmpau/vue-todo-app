<script setup>
import LayoutView from '../layouts/LayoutView.vue'
import { ref } from 'vue'

const blogItems = ref([
  {
    image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/vuejs_logo_icon_168246.png',
    title: 'Vue.js',
    details: 'UIの構築に使用されるフレームワーク'
  },
  {
    image: 'https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_tailwind_icon_130128.png',
    title: 'Tailwind',
    details: 'レイアウトとコンポーネントをデザインするために使用されるCSSフレームワーク'
  },
  {
    image: 'https://cdn.icon-icons.com/icons2/2699/PNG/512/firebase_logo_icon_171157.png',
    title: 'Firebase',
    details: '認証、データベース、ホスティングなどのバックエンド機能に使用'
  }
])
</script>

<template>
  <LayoutView>
    <section class="pt-20 pb-10 lg:pt-10 lg:pb-10 lg:pr-10 lg:pl-10 bg-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap justify-center -mx-4">
          <div class="w-full px-4">
            <div class="mx-auto mb-[60px] max-w-[820px] text-center lg:mb-15">
              <h2
                class="mb-8 text-3xl font-bold text-dark sm:text-4xl md:text-[40px] dark:text-white"
              >
                ToDoアプリとは
              </h2>
              <p class="text-base text-body-color dark:text-dark-6">
                このプロジェクトは、ユーザーが日々のタスクを管理するためのシンプルで使いやすいToDoアプリです。
              </p>
              <p class="text-base text-body-color dark:text-dark-6">
                Firebaseをバックエンドに使用し、ユーザー認証、データの保存・更新、リアルタイムでのデータ同期を実現しています。
              </p>
              <p class="text-base text-body-color dark:text-dark-6">
                ユーザーはGoogleアカウントを使用してログインし、個人のToDoリストを管理できます。
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap -mx-4">
          <template v-for="(item, index) in blogItems" :key="index">
            <div class="w-full px-4 md:w-1/2 lg:w-1/3">
              <div class="w-full mb-10">
                <div class="mb-8 overflow-hidden rounded flex justify-center items-center">
                  <img :src="item.image" alt="image" class="w-48 h-48 object-cover" />
                </div>
                <div>
                  <h3>
                    <a
                      :href="item.buttonLink"
                      class="mb-6 text-xl font-semibold text-dark flex justify-center items-center dark:text-white hover:text-primary sm:text-2xl lg:text-xl xl:text-2xl"
                    >
                      {{ item.title }}
                    </a>
                  </h3>
                  <p
                    class="text-base text-body-color dark:text-dark-6 flex justify-center items-center"
                  >
                    {{ item.details }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </section>
  </LayoutView>
</template>

<style scoped>
section {
  height: 100vh;
  overflow-y: auto;
}
</style>
