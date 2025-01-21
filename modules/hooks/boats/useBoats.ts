import { useQuery } from "@tanstack/react-query"
import { makeGetBoatsUseCase } from "@/modules/orchestration/BoatUseCaseFactory"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export function useBoats() {
     const { showTranslatedFlashMessage } = useFlashMessage()
     const getBoats = makeGetBoatsUseCase()

     const { data, isPending, error } = useQuery({
          queryKey: ["boats"],
          queryFn: async () => {
               const boats = await getBoats()
               return boats
          },
          refetchOnMount: true,
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
          staleTime: Infinity,
     })

     if (error) {
          showTranslatedFlashMessage("danger", {
               title: "flash_title_error",
               description: "An error occurred while fetching boats.",
          })
     }

     return { data, isPending, error }
}
