import { router } from '@/ui/plugins/vue-router'
import authService from '@/infraestructure/services/authService'
// import store from '@/store'
// import { showErrorMessage } from '@/common/utils/toast'

const authGuard = async to => {
  if (isNotAuthenticated()) {
    if (needsToAuthenticate(to)) {
      return router.push({ name: 'login', replace: true })
    }
    return
  }

//   try {
//     await checkToken()
//   } catch (error) {
//     showErrorMessage(error)
//     store.dispatch('auth/clean')
//   }

  if (isPublicOnly(to)) {
    return router.push({ name: 'home' })
  }
}

export default authGuard

const isNotAuthenticated = () => !authService.isAuthenticated()

const needsToAuthenticate = to => to.matched.some(m => m.meta.requiresAuth)

const isPublicOnly = to => to.matched.some(m => m.meta.isPublicOnly)

// const checkToken = async () => {
//   await store.dispatch('user/checkMe')
// }
