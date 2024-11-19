const errorMessageMapping: Record<string, string> = {
     Error: "Erreur",
     Success: "Succès",
}

export const mapMessageTitle = (title: string, locale: string = "en"): string => {
     const localizedTitles: Record<string, Record<string, string>> = {
          en: { Error: "Error" },
          fr: { Error: "Erreur" },
          // Ajoute d'autres langues si nécessaire
     }

     const translation = localizedTitles[locale]
     return translation[title] || title // Retourne la traduction ou le titre brut si non mappé
}
