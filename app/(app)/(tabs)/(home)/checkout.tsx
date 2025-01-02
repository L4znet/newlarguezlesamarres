import { confirmPayment, useStripe } from "@stripe/stripe-react-native"
import React, { useEffect, useState } from "react"
import { Alert, StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayRentalFrequency } from "@/constants/RentalFrequency"
import { displayTotalPrice } from "@/constants/DisplayTotalPrice"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export default function Checkout() {
     const { initPaymentSheet, presentPaymentSheet } = useStripe()
     const [paymentSheetParams, setPaymentSheetParams] = useState({
          paymentIntent: "",
          ephemeralKey: "",
          customer: "",
     })
     const [loading, setLoading] = useState(false)
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string
     const { showTranslatedFlashMessage } = useFlashMessage()
     const currentOfferToRent = useOfferStore((state) => state.currentOffer)

     const fetchPaymentSheetParams = async () => {
          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token as string

          const { amountForStripe } = displayTotalPrice(
               currentOfferToRent?.price as string,
               currentOfferToRent?.rentalPeriod as {
                    start: string
                    end: string
               },
               currentOfferToRent?.frequency as number
          )

          const url = `${API_URL}/transactions`

          const response = await fetch(url, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
               },
               body: JSON.stringify({
                    offerId: currentOfferToRent?.id,
                    amount: amountForStripe,
                    userId: session.data.session?.user?.id,
               }),
          })

          const data = await response.json()

          console.log({ ...data })

          return {
               paymentIntent: data.clientSecret,
               ephemeralKey: data.ephemeralKey,
               customer: data.customer,
          }
     }

     const initializePaymentSheet = async () => {
          const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams()
          setPaymentSheetParams({ paymentIntent, ephemeralKey, customer })

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
          console.log("error", error)

          if (!error) {
               console.log("Payment sheet initialized")
               setLoading(true)
          }
     }

     useEffect(() => {
          initializePaymentSheet()
     }, [])

     const handlePayment = async () => {
          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token as string

          console.log(accessToken)

          try {
               const presentPaymentSheetResult = await presentPaymentSheet()

               if (!presentPaymentSheetResult.error) {
                    showTranslatedFlashMessage("success", {
                         title: "flash_title_success",
                         description: "Payment successful",
                    })
               }
          } catch (e) {
               console.log("Error", e)
          }
     }

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const frequencyParsed = displayRentalFrequency(currentOfferToRent?.frequency.toString(), locale)

     const { totalAmount } = displayTotalPrice(currentOfferToRent?.price as string, currentOfferToRent?.rentalPeriod as { start: string; end: string }, currentOfferToRent?.frequency as number)

     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(currentOfferToRent?.rentalPeriod.start as string, currentOfferToRent?.rentalPeriod.end as string)

     return (
          <View style={styles.container}>
               <Text style={styles.title} variant="headlineMedium">
                    {t("your_rental")}
               </Text>
               <Text
                    variant="bodyLarge"
                    style={{
                         marginTop: 16,
                         fontWeight: "bold",
                    }}
               >
                    {currentOfferToRent?.title}
               </Text>
               <Text variant="bodyLarge">{currentOfferToRent?.description}</Text>
               <Text style={styles.subtitle} variant="titleLarge">
                    {t("rental_date")}
               </Text>
               <Text variant="bodyMedium">Du {rentalStartDate}</Text>
               <Text variant="bodyMedium">Au {rentalEndDate}</Text>
               <Text variant="titleSmall">
                    {t("unit_price")} : {currentOfferToRent?.price}
                    {t("money_symbol")} / {frequencyParsed.toLowerCase()}
               </Text>
               <View style={styles.totalAmount}>
                    <Text style={styles.title} variant="headlineSmall">
                         Total
                    </Text>
                    <Text style={styles.title} variant="headlineSmall">
                         {totalAmount} €
                    </Text>
               </View>
               <Button onPress={() => handlePayment()} mode={"contained"} disabled={!loading} loading={!loading}>
                    {totalAmount} {t("money_symbol")}
               </Button>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          padding: 16,
     },
     title: {
          fontWeight: "bold",
          marginVertical: 16,
     },
     subtitle: {
          fontWeight: "bold",
          marginTop: 16,
          marginBottom: 8,
     },
     totalAmount: {
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 16,
     },
})
