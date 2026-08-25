import authService from '@/infraestructure/services/authService'

export default async ({ token }, { onSuccess, onError }) => {
  try {
    authService.setToken(token)

    onSuccess()
  } catch (error) {
    onError(error)
  }
}
