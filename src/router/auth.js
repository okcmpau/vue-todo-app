import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const isAuthenticated = () => {
  const auth = getAuth()
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(!!user)
    })
  })
}
