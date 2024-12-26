import { useStripe } from "@stripe/stripe-react-native"
import React, { useEffect, useState } from "react"
import { Alert, View } from "react-native"
import { Button } from "react-native-paper"
import { useLocalSearchParams } from "expo-router"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export default function Checkout() {
     const { initPaymentSheet, presentPaymentSheet } = useStripe()
     const [loading, setLoading] = useState(false)
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string

     const currentOfferToRent = useOfferExternalScreenStore((state) => state.currentOfferToRent)
     const fetchPaymentSheetParams = async () => {
          /* return {
               paymentIntent,
               ephemeralKey,
               customer,
          }*/
     }

     const initializePaymentSheet = async () => {
          const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams()

          console.log({
               paymentIntent: paymentIntent,
               ephemeralKey: ephemeralKey,
               customer: customer,
          })

          const { error } = await initPaymentSheet({
               merchantDisplayName: "Example, Inc.",
               customerId: customer,
               customerEphemeralKeySecret: ephemeralKey,
               paymentIntentClientSecret: paymentIntent,
               allowsDelayedPaymentMethods: true,
               defaultBillingDetails: {
                    name: `${firstname} ${lastname}`,
               },
          })

          console.log("error", error)

          if (!error) {
               setLoading(true)
          }
     }

     useEffect(() => {
          initializePaymentSheet()
     }, [])

     const openPaymentSheet = async () => {
          //  initializePaymentSheet()

          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token

          const response = await fetch(API_URL + "/transactions", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken,
               },
               body: JSON.stringify({
                    offerId: currentOfferToRent?.id,
                    amount: currentOfferToRent?.amount as string,
               }),
          })

          console.log(API_URL + "/transactions")
          console.log(response)

          console.log("dsflmkjsfdkljm")

          const { paymentIntent, ephemeralKey, customer } = await response.json()

          console.log({
               status: response.status,
               paymentIntent: paymentIntent,
               ephemeralKey: ephemeralKey,
               customer: customer,
          })

          /*     const { error } = await presentPaymentSheet()
          console.log(error)

          if (error) {
               Alert.alert(`Error code: ${error.code}`, error.message)
          } else {
               Alert.alert("Success", "Your order is confirmed!")
          }*/
     }

     return (
          <View>
               <Button onPress={() => openPaymentSheet()} disabled={loading} mode={"contained"}>
                    Réserver
               </Button>
          </View>
     )
}
