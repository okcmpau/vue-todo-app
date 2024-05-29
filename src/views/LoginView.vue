<script setup>
import LoginButton from '../components/LoginButton.vue'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">ログイン</h2>
      <div class="flex justify-center">
        <LoginButton />
      </div>
    </div>
  </div>
</template>
