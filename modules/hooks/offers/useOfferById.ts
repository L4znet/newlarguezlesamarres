import { useQuery } from "@tanstack/react-query"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"

export function useOfferById(offerId: string) {
     console.log("JE SUIS LE sdflmkjhfdskjhfdkljm")
     return useQuery({
          queryKey: ["offer", offerId],
          queryFn: () => getSingleOfferUseCase(offerId),
          enabled: !!offerId,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          staleTime: Infinity,
     })
}
