import authService from '@/infrastructure/services/authService'

const authInterceptor = config => {
  const header = authService.getHeader()
  if (header) {
    config.headers.Authorization = header
  }
  return config
}

export default authInterceptor
