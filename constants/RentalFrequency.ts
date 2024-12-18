import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export enum RentalFrequency {
     Hour = "0",
     Day = "1",
     Week = "2",
     Month = "3",
}

export const useRentalFrequencyOptions = () => {
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return [
          { _id: RentalFrequency.Hour, value: t("frequency_hour") },
          { _id: RentalFrequency.Day, value: t("frequency_day") },
          { _id: RentalFrequency.Week, value: t("frequency_week") },
          { _id: RentalFrequency.Month, value: t("frequency_month") },
     ]
}
