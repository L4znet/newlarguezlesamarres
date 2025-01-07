import { useQuery } from "@tanstack/react-query"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getCountBoatsUseCase } from "@/modules/application/boats/getCountBoatsUseCase"

export function useCountBoats() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     return useQuery({
          queryKey: ["count_boats"],
          queryFn: () => getCountBoatsUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
