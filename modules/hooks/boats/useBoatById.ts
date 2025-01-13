import { getSingleBoatUseCase } from "@/modules/application/boats/getSingleBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useQuery } from "@tanstack/react-query"

export function useBoatById(boatId: string) {
     const { showTranslatedFlashMessage } = useFlashMessage()

     return useQuery({
          queryKey: ["boats", boatId],
          queryFn: () => getSingleBoatUseCase(boatId),
          staleTime: Infinity,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
     })
}
