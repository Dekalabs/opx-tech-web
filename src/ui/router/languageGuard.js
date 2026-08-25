import { i18n } from '@/ui/plugins/vue-i18n'
import { router } from '@/ui/plugins/vue-router'
import changeLanguage from '@/application/user/changeLanguage'
import languageService from '@/infraestructure/services/languageService'

let hasToInitLanguage = true

export const languageGuard = () => {
  if (hasToInitLanguage) {
    i18n.global.locale.value = languageService.getLanguage()
    hasToInitLanguage = false
  }
}

export const changeLanguageGuard = lang => {
  return () => {
    changeLanguage(
      {
        language: lang,
      },
      {
        onSuccess: lang => {
          i18n.global.locale.value = lang
          router.push({ name: 'home', replace: true })
        },
        onError: console.error,
      },
    )
  }
}
