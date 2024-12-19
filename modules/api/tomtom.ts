export const fetchLocations = async (query: string = ""): Promise<any[]> => {
     const TOMTOM_API_KEY = process.env.EXPO_PUBLIC_TOMTOM_API_KEY || ""

     if (!TOMTOM_API_KEY) {
          throw new Error("Clé API TomTom manquante")
     }

     console.log("JE SUIS LAAAA LOCATION")

     const url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?storeResult=false&limit=10&countrySet=FR&key=${TOMTOM_API_KEY}`

     const response = await fetch(url)

     const data = await response.json()
     return data.results
}
