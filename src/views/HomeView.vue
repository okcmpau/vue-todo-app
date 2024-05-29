<script setup>
import LayoutView from '../layouts/LayoutView.vue'
</script>

<template>
  <LayoutView>
    <div class="flex items-center justify-center min-h-[calc(100vh-7rem)]">
      <div class="text-center">
        <h2 class="text-4xl font-bold mb-4">ToDoアプリへようこそ！</h2>
        <p class="text-lg">ログインに成功しました。</p>
        <router-link to="/todo">
          <button
            class="mt-5 py-2.5 px-5 text-sm font-medium text-white bg-blue-700 rounded-lg border hover:border-gray-400 shadow hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-100"
          >
            ToDo項目追加
          </button>
        </router-link>
      </div>
    </div>
  </LayoutView>
</template>
