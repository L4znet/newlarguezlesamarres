import { useTranslation } from "@/modules/context/TranslationContext"

export enum BoatType {
     Sailboat = "1",
     Catamaran = "2",
     Yacht = "3",
     Motorboat = "4",
     Trimaran = "5",
}

const translations: Record<string, Record<BoatType, string>> = {
     en: {
          [BoatType.Sailboat]: "Sailboat",
          [BoatType.Catamaran]: "Catamaran",
          [BoatType.Yacht]: "Yacht",
          [BoatType.Motorboat]: "Motorboat",
          [BoatType.Trimaran]: "Trimaran",
     },
     fr: {
          [BoatType.Sailboat]: "Voilier",
          [BoatType.Catamaran]: "Catamaran",
          [BoatType.Yacht]: "Yacht",
          [BoatType.Motorboat]: "Bateau à moteur",
          [BoatType.Trimaran]: "Trimaran",
     },
     es: {
          [BoatType.Sailboat]: "Velero",
          [BoatType.Catamaran]: "Catamarán",
          [BoatType.Yacht]: "Yate",
          [BoatType.Motorboat]: "Lancha motora",
          [BoatType.Trimaran]: "Trimarán",
     },
}

export const useBoatTypeOptions = (locale: string) => {
     const t = (key: BoatType) => {
          return translations[locale]?.[key] || translations.en[key]
     }

     return [
          { _id: BoatType.Sailboat, value: t(BoatType.Sailboat) },
          { _id: BoatType.Catamaran, value: t(BoatType.Catamaran) },
          { _id: BoatType.Yacht, value: t(BoatType.Yacht) },
          { _id: BoatType.Motorboat, value: t(BoatType.Motorboat) },
          { _id: BoatType.Trimaran, value: t(BoatType.Trimaran) },
     ]
}

export const getBoatType = (value: string) => {
     return Object.keys(BoatType).find((key) => BoatType[key as keyof typeof BoatType] === value)
}

export const displayBoatType = (type: string | undefined, locale: string = "en") => {
     const currentTranslations = translations[locale] || translations.en
     return type && currentTranslations[type as BoatType] ? currentTranslations[type as BoatType] : currentTranslations[BoatType.Sailboat]
}
