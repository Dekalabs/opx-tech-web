import {
  NetworkError,
  NotAuthenticatedError,
  NotValidCredentialsError,
  NotVerifiedAccountError,
} from '@/infrastructure/http/errors'

import authService from '@/infrastructure/services/authService'

const NO_ACTIVE_ACCOUNT_CODE = 'no_active_account'
const NO_EMAIL_VERIFIED_CODE = 'no_email_verified'
const NETWORK_ERROR_MESSAGE = 'Network Error'

const responseErrorInterceptor = error => {
  const code = parseInt(error.response?.status)

  if (error.message.includes(NETWORK_ERROR_MESSAGE)) {
    throw new NetworkError(error)
  }

  if (code === 401) {
    authService.clearToken()

    const customCode = error.response?.data?.code

    if (customCode === NO_ACTIVE_ACCOUNT_CODE) {
      throw new NotValidCredentialsError(error)
    }
    if (customCode === NO_EMAIL_VERIFIED_CODE) {
      throw new NotVerifiedAccountError(error)
    }
    throw new NotAuthenticatedError(error)
  }

  return Promise.reject(error)
}

export default responseErrorInterceptor
