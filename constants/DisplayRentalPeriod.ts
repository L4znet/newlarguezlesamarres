import { format } from "date-fns"
import { enUS, es, fr } from "date-fns/locale"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export const displayRentalPeriod = (start: string, end: string) => {
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const localeMap = {
          en: enUS,
          fr: fr,
          es: es,
     }

     return {
          rentalStartDate: format(new Date(start), "dd MMMM yyyy", { locale: localeMap[locale] || fr }),
          rentalEndDate: format(new Date(end), "dd MMMM yyyy", { locale: localeMap[locale] || fr }),
     }
}
