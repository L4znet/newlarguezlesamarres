import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getCountBoatsUseCase } from "@/modules/application/boats/getCountBoatsUseCase"
import { BoatRepositorySupabase } from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { makeGetBoatsUseCase, makeGetCountBoatsUseCase } from "@/modules/orchestration/BoatUseCaseFactory"

export function useCountBoats() {
     const { showTranslatedFlashMessage } = useFlashMessage()

     const getCountBoat = makeGetCountBoatsUseCase()
     return useQuery({
          queryKey: ["count_boats"],
          queryFn: () => getCountBoat(),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
