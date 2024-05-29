<script setup>
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()

const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()
    const resultSignIn = await signInWithPopup(auth, provider)
    // Log successful sign-in
    console.log('User signed in successfully:', resultSignIn.user)
    // Redirect to Dashboard upon successful sign-in
    router.push('/')
  } catch (error) {
    console.error('Sign In Error: ', error)
  }
}
</script>

<template>
  <button
    @click="signInWithGoogle"
    class="flex items-center py-2.5 px-5 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-400 shadow hover:bg-blue-300 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-100"
  >
    <img
      src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
      alt="Google Logo"
      class="w-5 h-5 mr-2"
    />
    Googleでログイン
  </button>

  <!-- <button
    @click="signInWithGoogle"
    type="button"
    class="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
  >
    Sign In with Google
  </button> -->

  <!-- <button
      @click="signInWithGoogle"
      class="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
    >
      Sign in with Google
    </button> -->
  <!-- <button @click="signInWithGoogle">Sign in with Google</button> -->
</template>
