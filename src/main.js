import './assets/main.css'
import './index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './config/firebase.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Optional: Log the Firebase app instance to confirm initialization
// console.log('Firebase App:', firebaseApp);
app.mount('#app')
