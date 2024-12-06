import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export enum BoatType {
     Sailboat = "1",
     Catamaran = "2",
     Yacht = "3",
     Motorboat = "4",
     Trimaran = "5",
}

export const useBoatTypeOptions = () => {
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return [
          { _id: BoatType.Sailboat, value: t("sailboat") },
          { _id: BoatType.Catamaran, value: t("catamaran") },
          { _id: BoatType.Yacht, value: t("yacht") },
          { _id: BoatType.Motorboat, value: t("motorboat") },
          { _id: BoatType.Trimaran, value: t("trimaran") },
     ]
}
