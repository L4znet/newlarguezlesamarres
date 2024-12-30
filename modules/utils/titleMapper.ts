export const mapMessageTitle = (title: string, locale: string = "fr"): string => {
     const localizedTitles: Record<string, Record<string, string>> = {
          en: { Error: "Error" },
          fr: { Error: "Erreur" },
          es: { Error: "Error" },
     }

     const translation = localizedTitles[locale]
     return translation[title] || title
}
