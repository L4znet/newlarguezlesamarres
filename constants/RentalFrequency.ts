import { useTranslation } from "@/modules/context/TranslationContext"

export enum RentalFrequency {
     Day = "1",
     Week = "2",
     Month = "3",
}

const translations: Record<string, Record<RentalFrequency, string>> = {
     es: {
          [RentalFrequency.Day]: "Día",
          [RentalFrequency.Week]: "Semana",
          [RentalFrequency.Month]: "Mes",
     },
     en: {
          [RentalFrequency.Day]: "Day",
          [RentalFrequency.Week]: "Week",
          [RentalFrequency.Month]: "Month",
     },
     fr: {
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
          { _id: RentalFrequency.Day, value: t(RentalFrequency.Day) },
          { _id: RentalFrequency.Week, value: t(RentalFrequency.Week) },
          { _id: RentalFrequency.Month, value: t(RentalFrequency.Month) },
     ]
}

export const getRentalFrequency = (value: string) => {
     return Object.keys(RentalFrequency).find((key) => RentalFrequency[key as keyof typeof RentalFrequency] === value)
}

export const getFrequencyLabelByIndex = (index: number) => {
     return Object.keys(RentalFrequency).find((key) => RentalFrequency[key as keyof typeof RentalFrequency] === index.toString())
}

export const displayRentalFrequency = (frequency: string | undefined, locale: string = "fr") => {
     const currentTranslations = translations[locale] || translations.en
     return frequency && currentTranslations[frequency as RentalFrequency] ? currentTranslations[frequency as RentalFrequency] : currentTranslations[RentalFrequency.Day]
}
