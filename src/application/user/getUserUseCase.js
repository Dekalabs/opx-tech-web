import User from '@/domain/User'

import authService from '@/infrastructure/services/authService'

export default async ({ onSuccess, onError }) => {
  try {
    // TODO: Manu - userAPI
    // const userData = await userAPI.me()
    // onSuccess(new User(userData))
    const userData = authService.getToken()
    onSuccess(new User({ id: userData, name: userData }))
  } catch (error) {
    onError(error)
  }
}
