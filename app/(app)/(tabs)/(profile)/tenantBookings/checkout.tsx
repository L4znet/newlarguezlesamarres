import { confirmPayment, PaymentIntent, RetrievePaymentIntentResult, useStripe } from "@stripe/stripe-react-native"
import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Button, Text } from "react-native-paper"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayTotalPrice } from "@/constants/DisplayTotalPrice"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useCreateTransaction } from "@/modules/hooks/rentals/useCreateTransaction"
import { useVerifyAndInsertTransaction } from "@/modules/hooks/rentals/useVerifyAndInsertTransaction"
import { useUpdateOffer } from "@/modules/hooks/offers/useUpdateOffer"
import { useUpdateOfferAvailability } from "@/modules/hooks/offers/useUpdateOfferAvailability"
import { useUpdateBookingStatus } from "@/modules/hooks/bookings/useUpdateBookingStatus"
import { router, useLocalSearchParams } from "expo-router"

export default function Checkout() {
     const { initPaymentSheet, presentPaymentSheet } = useStripe()
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string
     const { showTranslatedFlashMessage } = useFlashMessage()
     const currentOfferToRent = useOfferStore((state) => state.currentOffer)

     const { mutateAsync: createTransaction, isPending: creatingTransaction } = useCreateTransaction()
     const { mutateAsync: verifyAndInsertTransaction } = useVerifyAndInsertTransaction()
     const { mutate: updateOfferAvailability } = useUpdateOfferAvailability()
     const { mutate: updateBookingStatus } = useUpdateBookingStatus()

     const { bookingId } = useLocalSearchParams<{ bookingId: string }>()

     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const { totalAmount, amountForStripe } = displayTotalPrice(currentOfferToRent?.price as string, currentOfferToRent?.rentalPeriod as { start: string; end: string })

     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(new Date(currentOfferToRent?.rentalPeriod.start as string), new Date(currentOfferToRent?.rentalPeriod.end as string), locale)

     const [paymentIntent, setPaymentIntent] = useState({
          clientSecret: "",
          ephemeralKey: "",
          customer: "",
          paymentIntent: "",
     })

     const initializePaymentSheet = async () => {
          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token as string

          const transactionData = await createTransaction({
               accessToken,
               offerId: currentOfferToRent?.id as string,
               amount: amountForStripe,
               userId: session.data.session?.user?.id as string,
          })

          const { paymentIntent, clientSecret, ephemeralKey, customer } = transactionData

          setPaymentIntent({
               clientSecret,
               ephemeralKey,
               customer,
               paymentIntent,
          })

          const { error } = await initPaymentSheet({
               merchantDisplayName: "Example, Inc.",
               customerId: customer,
               customerEphemeralKeySecret: ephemeralKey,
               paymentIntentClientSecret: clientSecret,
               allowsDelayedPaymentMethods: true,
               defaultBillingDetails: {
                    name: "Jane Doe",
               },
          })

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "Payment Initialization Failed",
                    description: error.message,
               })
          }
     }

     useEffect(() => {
          initializePaymentSheet()
     }, [])

     const handlePayment = async () => {
          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token as string
          await initializePaymentSheet()

          console.log({
               paymentIntentId: paymentIntent.paymentIntent,
               offerId: currentOfferToRent?.id as string,
               userId: session.data.session?.user?.id as string,
               accessToken: accessToken,
          })

          try {
               const result = await presentPaymentSheet()

               if (!result.error) {
                    await verifyAndInsertTransaction({
                         accessToken,
                         paymentIntentId: paymentIntent.paymentIntent,
                         offerId: currentOfferToRent?.id as string,
                         userId: session.data.session?.user?.id as string,
                    })

                    updateOfferAvailability({
                         offerId: currentOfferToRent?.id as string,
                         isAvailable: false,
                    })

                    updateBookingStatus({
                         bookingId: bookingId as string,
                         status: "rented",
                    })

                    showTranslatedFlashMessage("success", {
                         title: "Payment Successful",
                         description: "Your payment was successfully processed.",
                    })
                    router.navigate("/(app)/(tabs)/(profile)/tenantBookings")
               } else {
                    showTranslatedFlashMessage("danger", {
                         title: "Payment Failed",
                         description: result.error.message,
                    })
               }
          } catch (e) {
               showTranslatedFlashMessage("danger", {
                    title: "Payment Error",
                    description: "An error occurred during payment. Please try again.",
               })
          }
     }

     return (
          <View style={styles.container}>
               <Text style={styles.title} variant="headlineMedium">
                    {t("your_rental")}
               </Text>
               <Text style={{ marginTop: 16, fontWeight: "bold" }} variant="bodyLarge">
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
                    {t("money_symbol")}
               </Text>
               <View style={styles.totalAmount}>
                    <Text style={styles.title} variant="headlineSmall">
                         Total
                    </Text>
                    <Text style={styles.title} variant="headlineSmall">
                         {totalAmount} €
                    </Text>
               </View>
               <Button onPress={() => handlePayment()} mode={"contained"} disabled={creatingTransaction || !currentOfferToRent} loading={creatingTransaction}>
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
