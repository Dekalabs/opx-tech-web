import languageService from '@/infrastructure/services/languageService'

export default async ({ language }, { onSuccess, onError }) => {
  try {
    languageService.setLanguage(language)
    onSuccess(language)
  } catch (error) {
    onError(error)
  }
}
