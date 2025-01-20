import { useQuery } from "@tanstack/react-query"

import { makeGetCountBoatsUseCase } from "@/modules/orchestration/BoatUseCaseFactory"
export function useCanCreateOffer() {
     const getCountBoat = makeGetCountBoatsUseCase()
     return useQuery({
          queryKey: ["canCreateOffer"],
          queryFn: () => getCountBoat(),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
