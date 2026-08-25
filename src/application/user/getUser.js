import authService from '@/infraestructure/services/authService'

export default async ({ onSuccess, onError }) => {
  try {
    const user = authService.getToken()
    onSuccess(user)
  } catch (error) {
    onError(error)
  }
}
