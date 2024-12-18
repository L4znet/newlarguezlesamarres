import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchLocations } from "../api/tomtom"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export const useLocationSearch = () => {
     const { showTranslatedFlashMessage } = useFlashMessage()
     return useMutation({
          mutationFn: (query: string) => fetchLocations(query),
          onError: (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: "An error occurred while searching for locations",
               })
          },
     })
}
