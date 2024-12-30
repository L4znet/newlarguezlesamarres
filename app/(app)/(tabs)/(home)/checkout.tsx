import { confirmPaymentSheetPayment, useStripe } from "@stripe/stripe-react-native"
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
import { useStripePayment } from "@/modules/hooks/useStripePayment"

export default function Checkout() {
     const { initPaymentSheet, presentPaymentSheet } = useStripe()
     const [loading, setLoading] = useState(false)
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string
     const { showTranslatedFlashMessage } = useFlashMessage()
     const currentOfferToRent = useOfferStore((state) => state.currentOffer)
     const { mutate, data, isPending, error } = useStripePayment()

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

          mutate({ accessToken: accessToken as string, offerId: currentOfferToRent?.id as string, currency: "eur", amount: amountForStripe, userId: session.data.session?.user.id as string })

          return {
               clientSecret: data?.clientSecret as string,
               ephemeralKey: data?.ephemeralKey as string,
               customer: data?.customer as string,
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
               returnURL: "payments-example://stripe-redirect",
               defaultBillingDetails: {
                    name: "Jane Doe",
               },
          })
          console.log("aaaa", {
               error: error,
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
               await initializePaymentSheet()
               const { error, paymentOption } = await presentPaymentSheet()

               confirmPayment()
          } catch (e) {
               console.log("Error", e)
          }
     }

     const confirmPayment = async () => {
          await initializePaymentSheet()
          const confirmPaymentSheetPaymentResult = await confirmPaymentSheetPayment()

          if (confirmPaymentSheetPaymentResult.error) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_payment_error",
                    description: confirmPaymentSheetPaymentResult.error.message,
               })
          } else {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_payment_success",
                    description: "Payment successful",
               })
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
