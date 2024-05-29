import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from './auth'
import HomeView from '../views/HomeView.vue'
import TodoList from '../views/TodoList.vue'
import Login from '../views/LoginView.vue'
import AboutView from '../views/AboutView.vue'
import Profile from '../views/UserProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { requiresAuth: true },
      component: HomeView
    },
    {
      path: '/todo',
      name: 'Todo',
      meta: { requiresAuth: true },
      component: TodoList
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile',
      name: 'Profile',
      meta: { requiresAuth: true },
      component: Profile
    },
    {
      path: '/about',
      name: 'about',
      meta: { requiresAuth: true },
      component: AboutView
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const authenticated = await isAuthenticated()

  if (requiresAuth && !authenticated) {
    next('/login')
  } else if (to.path === '/login' && authenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
