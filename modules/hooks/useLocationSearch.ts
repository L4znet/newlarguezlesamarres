import { useQuery } from "@tanstack/react-query"
import { fetchLocations } from "../api/tomtom"

export const useLocationSearch = (query: string) => {
     return useQuery({
          queryKey: ["locations", query],
          queryFn: () => fetchLocations(query),
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          staleTime: Infinity,
     })
}
