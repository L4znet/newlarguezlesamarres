const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY || ""

export const fetchLocations = async (query: string): Promise<any[]> => {
     const url = `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=10&countrySet=FR`

     const response = await fetch(url)

     if (!response.ok) {
          throw new Error("Erreur lors de la recherche de l'adresse")
     }

     const data = await response.json()
     return data.results
}
