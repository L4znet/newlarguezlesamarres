import { useQuery } from "@tanstack/react-query"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"

export function useBoats() {
     return useQuery({
          queryKey: ["boats"],
          queryFn: () => getBoatsUseCase(),
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          staleTime: Infinity,
     })
}
