import { confirmPaymentSheetPayment, useStripe } from "@stripe/stripe-react-native"
import React, { useEffect, useState } from "react"
import { Alert, View } from "react-native"
import { Button } from "react-native-paper"
import { useLocalSearchParams } from "expo-router"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { undefined } from "zod"

export default function Checkout() {
     const { initPaymentSheet, presentPaymentSheet } = useStripe()
     const [loading, setLoading] = useState(false)
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string

     const currentOfferToRent = useOfferStore((state) => state.currentOfferToRent)
     const fetchPaymentSheetParams = async () => {
          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token

          const response = await fetch(`${API_URL}/transactions`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
               },
               body: JSON.stringify({
                    offerId: currentOfferToRent.id,
                    amount: currentOfferToRent.price,
                    currency: "eur",
                    userId: session.data.session?.user.id,
               }),
          })

          const { paymentIntent, ephemeralKey, customer } = await response.json()

          return {
               paymentIntent,
               ephemeralKey,
               customer,
          }
     }

     const initializePaymentSheet = async () => {
          const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams()

          const { error } = await initPaymentSheet({
               merchantDisplayName: "Example, Inc.",
               customerId: customer,
               customerEphemeralKeySecret: ephemeralKey,
               paymentIntentClientSecret: paymentIntent,
               allowsDelayedPaymentMethods: true,
               defaultBillingDetails: {
                    name: "Jane Doe",
               },
          })
          if (!error) {
               setLoading(true)
          }
     }

     useEffect(() => {
          initializePaymentSheet()
     }, [])

     const handlePayment = async () => {
          try {
               const { error, paymentOption } = await presentPaymentSheet()
               if (error) {
                    Alert.alert("Error", error.message)
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

     return (
          <View>
               <Button onPress={() => handlePayment()} disabled={!loading} mode={"contained"}>
                    Réserver
               </Button>
          </View>
     )
}
