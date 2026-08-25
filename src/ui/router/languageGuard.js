import { i18n } from '@/ui/plugins/vue-i18n'
import { router } from '@/ui/plugins/vue-router'
import changeLanguageUseCase from '@/application/user/changeLanguageUseCase'
import languageService from '@/infrastructure/services/languageService'

let hasToInitLanguage = true

export const languageGuard = () => {
  if (hasToInitLanguage) {
    i18n.global.locale.value = languageService.getLanguage()
    hasToInitLanguage = false
  }
}

export const changeLanguageGuard = lang => {
  return () => {
    changeLanguageUseCase(
      {
        language: lang,
      },
      {
        onSuccess: lang => {
          i18n.global.locale.value = lang
          router.push({ name: 'Home', replace: true })
        },
        onError: console.error,
      },
    )
  }
}
