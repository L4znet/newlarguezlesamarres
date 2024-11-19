import { ValidationError } from "@/interfaces/ValidationError"
import { Translations, useTranslation } from "@/modules/context/TranslationContext"

export const translateValidationErrors = (errors: ValidationError[]): string[] => {
     const { t } = useTranslation()

     return errors.map((error) => {
          const key = error.code.startsWith("auth_") ? `auth_${error.code}` : `validation_${error.code}`

          let translatedMessage = t(key as keyof Translations)

          if (translatedMessage && error.context) {
               translatedMessage = translatedMessage.replace(/{{(.*?)}}/g, (_, variable) => error.context?.[variable] || "")
          }

          return translatedMessage || error.message
     })
}
