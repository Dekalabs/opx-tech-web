import authService from '@/infrastructure/services/authService'
import { NotAuthenticatedError } from '@/infrastructure/http/errors'

import getUserUseCase from '@/application/user/getUserUseCase'

import { useUser } from '@/ui/composables'

const authGuard = async to => {
  if (isNotAuthenticated()) {
    if (needsToAuthenticate(to)) {
      // TODO: Manu - show toast error
      // showError(i18n.global.t('errors.authRequired'))

      return { name: 'Login', replace: true }
    }
    return
  }

  try {
    // TODO: Manu - inspect token
    // await inspectToken()
    await inspectUser()
  } catch (error) {
    const { cleanApp } = useUser()

    authService.clearToken()
    cleanApp()

    // TODO: Manu - show toast error
    // const msg = error.messageI18n || 'errors.general'
    // showError(i18n.global.t(msg))

    return { name: 'login' }
  }

  if (isPublicOnly(to)) {
    return { name: 'Home' }
  }
}

export default authGuard

const isNotAuthenticated = () => !authService.isAuthenticated()

const needsToAuthenticate = to => to.matched.some(m => m.meta.requiresAuth)

const isPublicOnly = to => to.matched.some(m => m.meta.isPublicOnly)

// TODO: Manu - inspect token
// const inspectToken = async () => {
//   if (authService.canRefreshToken()) {
//     await refreshToken({
//       onSuccess: () => {},
//       onError: () => {
//         throw new TokenError('could not refresh the token')
//       },
//     })
//   }
// }

const inspectUser = async () => {
  const { isNotAuthenticated, setUser } = useUser()

  if (isNotAuthenticated()) {
    await getUserUseCase({
      onSuccess: setUser,
      onError: () => {
        throw new NotAuthenticatedError('could not refresh the user')
      },
    })
  }
}
