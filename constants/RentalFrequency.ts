import { useTranslation } from "@/modules/context/TranslationContext"

export enum RentalFrequency {
     Hour = "0",
     Day = "1",
     Week = "2",
     Month = "3",
}

// Traductions statiques des fréquences
const translations: Record<string, Record<RentalFrequency, string>> = {
     en: {
          [RentalFrequency.Hour]: "Hourly",
          [RentalFrequency.Day]: "Daily",
          [RentalFrequency.Week]: "Weekly",
          [RentalFrequency.Month]: "Monthly",
     },
     fr: {
          [RentalFrequency.Hour]: "Heure",
          [RentalFrequency.Day]: "Jour",
          [RentalFrequency.Week]: "Semaine",
          [RentalFrequency.Month]: "Mois",
     },
}

export const useRentalFrequencyOptions = (locale: string) => {
     const t = (key: string) => {
          return translations[locale]?.[key as RentalFrequency] || translations.en[key as RentalFrequency]
     }

     return [
          { _id: RentalFrequency.Hour, value: t(RentalFrequency.Hour) },
          { _id: RentalFrequency.Day, value: t(RentalFrequency.Day) },
          { _id: RentalFrequency.Week, value: t(RentalFrequency.Week) },
          { _id: RentalFrequency.Month, value: t(RentalFrequency.Month) },
     ]
}

export const getRentalFrequency = (value: string) => {
     return Object.keys(RentalFrequency).find((key) => RentalFrequency[key as keyof typeof RentalFrequency] === value)
}

export const displayRentalFrequency = (frequency: string | undefined, locale: string = "en") => {
     const currentTranslations = translations[locale] || translations.en
     return frequency && currentTranslations[frequency as RentalFrequency] ? currentTranslations[frequency as RentalFrequency] : currentTranslations[RentalFrequency.Hour]
}
