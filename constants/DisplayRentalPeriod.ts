import { format, isValid } from "date-fns"
import { enUS, es, fr } from "date-fns/locale"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { Locale } from "@/constants/Locales"

export const displayRentalPeriod = (start: Date | null, end: Date | null, locale: Locale, displayFormat: string = "long") => {
     const t = getTranslator(locale)

     const localeMap = {
          en: enUS,
          fr: fr,
          es: es,
     }
     let dateFormat = ""
     if (displayFormat === "long") {
          dateFormat = "dd MMMM yyyy"
     } else if (displayFormat === "short") {
          dateFormat = "dd/MM/yyyy"
     }

     const parsedStartDate = start ? new Date(start) : null
     const parsedEndDate = end ? new Date(end) : null

     const rentalStartDate = parsedStartDate && isValid(parsedStartDate) ? format(parsedStartDate, dateFormat, { locale: localeMap[locale] || fr }) : t("not_specified")

     const rentalEndDate = parsedEndDate && isValid(parsedEndDate) ? format(parsedEndDate, dateFormat, { locale: localeMap[locale] || fr }) : t("not_specified")

     return {
          rentalStartDate,
          rentalEndDate,
     }
}
