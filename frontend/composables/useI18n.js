import { ref, onMounted } from 'vue'
import { translations } from '@/utils/translations'

const currentLocale = ref('en')

export const useI18n = () => {
  const setLocale = (locale) => {
    if (translations[locale]) {
      currentLocale.value = locale
      if (typeof window !== 'undefined') {
        localStorage.setItem('locale', locale)
      }
    }
  }

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let result = translations[currentLocale.value]

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k]
      } else {
        // Fallback to English if not found in current locale
        let fallback = translations['en']
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk]
          } else {
            return key // Return key if not found at all
          }
        }
        result = fallback
        break
      }
    }

    if (typeof result === 'string') {
      Object.keys(params).forEach(param => {
        result = result.replace(`{${param}}`, params[param])
      })
      return result
    }

    return key
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale')
      if (savedLocale && translations[savedLocale]) {
        currentLocale.value = savedLocale
      } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0]
        if (translations[browserLang]) {
          currentLocale.value = browserLang
        }
      }
    }
  })

  return {
    locale: currentLocale,
    setLocale,
    t,
    $t: t // Alias for convenience
  }
}
