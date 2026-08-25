import authService from '@/infraestructure/services/authService'

export default ({ onSuccess, onError }) => {
  try {
    authService.clearToken()
    onSuccess()
  } catch (error) {
    onError(error)
  }
}
