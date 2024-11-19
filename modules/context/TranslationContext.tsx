import React, { createContext, useContext, useMemo, useState } from "react"
import { translateValidationErrors } from "@/modules/utils/translateValidationErrors"
import { ValidationError } from "@/interfaces/ValidationError"
import { Locale } from "@/constants/Locales"

const translationFiles = {
     en: require("../translations/en.json"),
     fr: require("../translations/fr.json"),
}

export type Translations = typeof translationFiles.en

export interface TranslationContextProps {
     t: (key: string | number | symbol) => string
     locale: Locale
     setLocale: (locale: Locale) => void
     translateErrors: (errors: ValidationError[]) => string[]
}

export const TranslationContext = createContext<TranslationContextProps | null>(null)

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [locale, setLocale] = useState<Locale>("fr")

     const t = (key: string | number | symbol): string => {
          if (typeof key !== "string") {
               console.warn(`Invalid translation key: ${String(key)}`)
               return String(key) // Retourne la clé convertie en chaîne si ce n'est pas une chaîne
          }

          const translations: Translations = translationFiles[locale]
          const value = translations[key as keyof Translations]

          if (typeof value === "object" && value.translation) {
               return value.translation
          }

          if (typeof value === "string") {
               return value
          }

          console.warn(`Missing translation for key: ${key}`)
          return key
     }

     const translateErrors = (errors: ValidationError[]): string[] => {
          return translateValidationErrors(errors, t)
     }

     const value = useMemo(
          () => ({
               t,
               locale,
               setLocale,
               translateErrors,
          }),
          [locale]
     )

     return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}

export const useTranslation = (): TranslationContextProps => {
     const context = useContext(TranslationContext)
     if (!context) {
          throw new Error("useTranslation must be used within a TranslationProvider")
     }
     return context
}
