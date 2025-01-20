import { getSingleBoatUseCase } from "@/modules/application/boats/getSingleBoatUseCase"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useQuery } from "@tanstack/react-query"
import { makeGetSingleBoatUseCase } from "@/modules/orchestration/BoatUseCaseFactory"

export function useBoatById(boatId: string) {
     const { showTranslatedFlashMessage } = useFlashMessage()
     const getBoatById = makeGetSingleBoatUseCase()
     return useQuery({
          queryKey: ["boat", boatId],
          queryFn: () => getBoatById(boatId),
          staleTime: Infinity,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
     })
}
