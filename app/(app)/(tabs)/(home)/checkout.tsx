import { confirmPaymentSheetPayment, useStripe } from "@stripe/stripe-react-native"
import React, { useEffect, useState } from "react"
import { Alert, View } from "react-native"
import { Button, Text } from "react-native-paper"
import { useLocalSearchParams } from "expo-router"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { undefined } from "zod"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayRentalFrequency } from "@/constants/RentalFrequency"
import { displayTotalPrice } from "@/constants/displayTotalPrice"

export default function Checkout() {
     const { initPaymentSheet, presentPaymentSheet } = useStripe()
     const [loading, setLoading] = useState(false)
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string

     const currentOfferToRent = useOfferStore((state) => state.currentOffer)

     const fetchPaymentSheetParams = async () => {
          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token

          const { amountForStripe } = displayTotalPrice(
               currentOfferToRent?.price as string,
               currentOfferToRent?.rentalPeriod as {
                    start: string
                    end: string
               },
               currentOfferToRent?.frequency as number
          )

          const response = await fetch(`${API_URL}/transactions`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
               },
               body: JSON.stringify({
                    offerId: currentOfferToRent?.id,
                    amount: amountForStripe,
                    currency: "eur",
                    userId: session.data.session?.user.id,
               }),
          })

          const { clientSecret, ephemeralKey, customer } = await response.json()

          return {
               clientSecret,
               ephemeralKey,
               customer,
          }
     }

     const initializePaymentSheet = async () => {
          const { clientSecret, ephemeralKey, customer } = await fetchPaymentSheetParams()

          const { error } = await initPaymentSheet({
               merchantDisplayName: "Example, Inc.",
               customerId: customer,
               customerEphemeralKeySecret: ephemeralKey,
               paymentIntentClientSecret: clientSecret,
               allowsDelayedPaymentMethods: true,
               returnURL: "",
               defaultBillingDetails: {
                    name: "Jane Doe",
               },
          })
          if (!error) {
               setLoading(true)
          }
     }

     useEffect(() => {
          const init = async () => {
               initializePaymentSheet()
          }
          init()
     }, [])

     const handlePayment = async () => {
          await initializePaymentSheet()
          try {
               const { error, paymentOption } = await presentPaymentSheet()
               if (error) {
                    console.log("Payment failed", error)
               } else {
                    console.log("Payment successful", paymentOption)
                    confirmPayment()
               }
          } catch (e) {
               console.log("Error", e)
          }
     }

     const confirmPayment = async () => {
          const { error } = await confirmPaymentSheetPayment()

          console.log("Payment confirmed", error)
     }

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const frequencyParsed = displayRentalFrequency(currentOfferToRent?.frequency.toString(), locale)

     const { amountForStripe, unitAmount, totalAmount } = displayTotalPrice(
          currentOfferToRent?.price as string,
          currentOfferToRent?.rentalPeriod as {
               start: string
               end: string
          },
          currentOfferToRent?.frequency as number
     )

     return (
          <View>
               <Text>Vous vous apprétez à réserver cette offre, voici un résumer avant de procéder au paiement</Text>

               <Text>{currentOfferToRent?.title}</Text>
               <Text>{currentOfferToRent?.description}</Text>

               <Text>
                    {currentOfferToRent?.price}€ / {frequencyParsed.toLowerCase()}
               </Text>
               <Text>Pour un total de : {totalAmount} €</Text>
               <Button onPress={() => handlePayment()} disabled={!loading} mode={"contained"}>
                    Payer {totalAmount} €
               </Button>
          </View>
     )
}
