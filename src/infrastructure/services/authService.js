const KEY = import.meta.env.VUE_APP_TOKEN_NAME

function factory() {
  return {
    getToken() {
      return localStorage.getItem(KEY)
    },
    setToken(value) {
      return localStorage.setItem(KEY, value)
    },
    clearToken() {
      localStorage.removeItem(KEY)
    },
    isAuthenticated() {
      return !!this.getToken()
    },
    getHeader() {
      const token = this.getToken()
      if (token) {
        return 'Bearer ' + token
      }
      return ''
    },
  }
}

export default factory()
