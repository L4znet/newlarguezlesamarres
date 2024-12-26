import { View } from "react-native"
import { Button, Text } from "react-native-paper"
import { router, useLocalSearchParams } from "expo-router"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"
import { Offer } from "@/interfaces/Offer"
import { getSingleOfferUseCase } from "@/modules/application/offers/getSingleOfferUseCase"
import { useEffect, useState } from "react"

export default function offerDetail() {
     const { offerId } = useLocalSearchParams<{
          offerId: string
     }>()

     const { currentOfferToRent, setCurrentOfferToRent } = useOfferExternalScreenStore()
     const [offerToRent, setOfferToRent] = useState<Offer | undefined>(undefined)

     const fetchSingleOffer = async (offerId: string) => {
          try {
               return await getSingleOfferUseCase(offerId)
          } catch (error) {
               console.error("Erreur lors de la récupération de l'offre", error)
          }
     }

     useEffect(() => {
          fetchSingleOffer(offerId).then((offer) => {
               setOfferToRent(offer)
          })
     }, [])

     const convertAmountForStripe = (amount: number) => {
          return amount * 100
     }

     const getHowManyDays = (start: string, end: string) => {
          const startDate = new Date(start)
          const endDate = new Date(end)
          const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          return diffDays
     }

     const handleRentOffer = (offer: Offer) => {
          let amount: number
          if (offer.frequency === 0) {
               // we need to calculate the amount by hours

               const startDate = new Date(offer.rentalPeriod.start)
               const endDate = new Date(offer.rentalPeriod.end)

               const diffTime = Math.abs(endDate.getTime() - startDate.getTime())

               const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

               const price = diffHours * parseInt(offer.price)

               amount = convertAmountForStripe(price)
          } else {
               const days = getHowManyDays(offer.rentalPeriod.start, offer.rentalPeriod.end)
               const price = days * parseInt(offer.price)
               amount = convertAmountForStripe(price)
          }

          setCurrentOfferToRent({
               ...offer,
               amount: amount.toString(),
          })
          router.navigate("/(app)/(tabs)/(home)/checkout")
     }
     return (
          <View>
               <Text>Bienvenue sur la page de détail des offres</Text>

               <Text>Voici l'offre sélectionnée : {offerId}</Text>
               <Text>
                    La période : DU {offerToRent?.rentalPeriod.start} AU {offerToRent?.rentalPeriod.end}
               </Text>

               <Button
                    onPress={() => {
                         handleRentOffer(offerToRent as Offer)
                    }}
               >
                    Aller sur le checkout
               </Button>
          </View>
     )
}
