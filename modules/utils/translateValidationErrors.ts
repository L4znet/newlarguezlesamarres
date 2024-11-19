import { ValidationError } from "@/interfaces/ValidationError"
import { Translations } from "@/modules/context/TranslationContext"

export const translateValidationErrors = (errors: ValidationError[], t: (key: keyof Translations) => string): string[] => {
     return errors.map((error) => {
          let key = error.code

          let translatedMessage = t(key as keyof Translations)

          if (!translatedMessage) {
               console.warn(`Missing translation for error code: ${error.code}`)
               translatedMessage = error.message
          }

          if (translatedMessage && error.context) {
               translatedMessage = translatedMessage.replace(/{{(.*?)}}/g, (_, variable) => error.context?.[variable] || "")
          }

          return translatedMessage
     })
}
