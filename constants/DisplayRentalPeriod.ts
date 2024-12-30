import { format, isValid } from "date-fns"
import { enUS, es, fr } from "date-fns/locale"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

export const displayRentalPeriod = (start: string | null, end: string | null) => {
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const localeMap = {
          en: enUS,
          fr: fr,
          es: es,
     }

     const parsedStartDate = start ? new Date(start) : null
     const parsedEndDate = end ? new Date(end) : null

     const rentalStartDate = parsedStartDate && isValid(parsedStartDate) ? format(parsedStartDate, "dd MMMM yyyy", { locale: localeMap[locale] || fr }) : t("not_specified")

     const rentalEndDate = parsedEndDate && isValid(parsedEndDate) ? format(parsedEndDate, "dd MMMM yyyy", { locale: localeMap[locale] || fr }) : t("not_specified")

     return {
          rentalStartDate,
          rentalEndDate,
     }
}
