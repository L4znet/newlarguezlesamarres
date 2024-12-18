import { useQuery } from "@tanstack/react-query"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useBoats() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     return useQuery({
          queryKey: ["boats"],
          queryFn: () => getBoatsUseCase(showTranslatedFlashMessage),
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })
}
