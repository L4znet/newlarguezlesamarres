import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { useOfferStore } from "@/modules/stores/offerStore"
import OfferEntity from "@/modules/domain/offers/OfferEntity"

export function useOfferById(offerId: string) {
     const setCurrentOffer = useOfferStore((state) => state.setCurrentOffer)

     return useQuery<OfferEntity, Error>({
          queryKey: ["offer", offerId],
          queryFn: () => getSingleOfferUseCase(offerId),
          enabled: !!offerId,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          staleTime: Infinity,
          onSuccess: (data: any) => {
               console.log("sfdlmkjsdfjkl")
               setCurrentOffer(data)
          },
     } as UseQueryOptions<OfferEntity, Error>)
}
