export class NotAuthenticatedError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotAuthenticatedError'
    this.messageI18n = 'errors.authRequired'
  }
}

export class NotValidCredentialsError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotValidCredentialsError'
    this.messageI18n = 'errors.notValidCredentials'
  }
}

export class NotVerifiedAccountError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NotVerifiedAccountError'
    this.messageI18n = 'errors.notVerifiedAccount'
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message)
    this.name = 'NetworkError'
    this.messageI18n = 'errors.network'
  }
}
