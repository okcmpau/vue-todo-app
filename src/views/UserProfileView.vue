<script setup>
import { ref, onMounted } from 'vue'
import LayoutView from '../layouts/LayoutView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const auth = getAuth()
const db = getFirestore()
const user = ref(null)
const userName = ref('Your Name')
const company = ref('')
const bio = ref('')
const isEditing = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser
      userName.value = currentUser.displayName || 'Your Name'

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        company.value = userData.company || ''
        bio.value = userData.bio || ''
      }
    }
  })
})

async function saveProfile() {
  if (user.value) {
    await setDoc(doc(db, 'users', user.value.uid), {
      company: company.value,
      bio: bio.value
    })
    console.log('Profile successfully saved')
    isEditing.value = false
  }
}

function startEditing() {
  isEditing.value = true
}
</script>

<template>
  <LayoutView>
    <div class="container h-screen max-w-full">
      <div
        class="m-auto my-28 w-140 max-w-lg items-center justify-center overflow-hidden rounded-2xl bg-slate-200 shadow-xl"
      >
        <div class="h-24 bg-white"></div>
        <div class="-mt-20 flex justify-center">
          <img class="h-32 rounded-full" :src="user?.photoURL || '../assets/default_user.jpg'" />
        </div>
        <div class="mt-5 mb-1 px-3 text-center text-lg">{{ userName }}</div>
        <div class="mb-5 px-3 text-center text-sky-500">
          <div v-if="!isEditing">
            {{ company }}
          </div>
          <input v-else v-model="company" placeholder="会社名" class="w-full rounded-md p-2" />
        </div>
        <blockquote class="mb-5 px-3 text-center">
          <div v-if="!isEditing">
            <p class="mx-2 mb-7 text-center text-base">{{ bio }}</p>
          </div>
          <textarea v-else v-model="bio" placeholder="Bio" class="w-full rounded-md p-2"></textarea>
        </blockquote>
        <div class="mb-5 px-3 text-center">
          <button
            v-if="!isEditing"
            @click="startEditing"
            class="rounded-md bg-blue-700 py-2 px-4 text-white hover:bg-blue-500"
          >
            編集
          </button>
          <button
            v-else
            @click="saveProfile"
            class="mb-5 w-full rounded-md bg-blue-500 py-2 text-white"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </LayoutView>
</template>

<style>
.line-through {
  text-decoration: line-through;
}
</style>
