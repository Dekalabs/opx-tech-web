const BASE_KEY = import.meta.env.VUE_APP_I18N_NAME

function factory() {
  return {
    getLanguage() {
      return localStorage.getItem(BASE_KEY) || import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE
    },

    setLanguage(lang) {
      localStorage.setItem(BASE_KEY, lang)
    },
  }
}

export default factory()
