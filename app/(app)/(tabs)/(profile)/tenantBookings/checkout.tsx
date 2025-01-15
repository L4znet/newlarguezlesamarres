import { useStripe } from "@stripe/stripe-react-native"
import React, { useState } from "react"
import { StyleSheet, View } from "react-native"
import { ActivityIndicator, Button, Text, useTheme } from "react-native-paper"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { displayTotalPrice } from "@/constants/DisplayTotalPrice"
import { displayRentalPeriod } from "@/constants/DisplayRentalPeriod"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useCreateTransaction } from "@/modules/hooks/rentals/useCreateTransaction"
import { useVerifyAndInsertTransaction } from "@/modules/hooks/rentals/useVerifyAndInsertTransaction"
import { useUpdateOfferAvailability } from "@/modules/hooks/offers/useUpdateOfferAvailability"
import { useUpdateBookingStatus } from "@/modules/hooks/bookings/useUpdateBookingStatus"
import { router, useLocalSearchParams } from "expo-router"
import { useOfferById } from "@/modules/hooks/offers/useOfferById"

export default function Checkout() {
     const { initPaymentSheet, presentPaymentSheet } = useStripe()
     const API_URL = process.env.EXPO_PUBLIC_API_URL as string
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { mutateAsync: createTransaction, isPending: creatingTransactionPending } = useCreateTransaction()
     const { mutateAsync: verifyAndInsertTransaction } = useVerifyAndInsertTransaction()
     const { mutate: updateOfferAvailability } = useUpdateOfferAvailability()
     const { mutate: updateBookingStatus } = useUpdateBookingStatus()

     const [paymentIntentOrder, setPaymentIntent] = useState({
          clientSecret: "",
          ephemeralKey: "",
          customer: "",
          paymentIntentId: "",
     })

     const initializePaymentSheet = async ({ clientSecret, ephemeralKey, customer, paymentIntentId }: { clientSecret: string; ephemeralKey: string; customer: string; paymentIntentId: string }) => {
          setPaymentIntent({
               clientSecret,
               ephemeralKey,
               customer,
               paymentIntentId,
          })

          const { error } = await initPaymentSheet({
               merchantDisplayName: "Ynov, Inc.",
               customerId: customer,
               customerEphemeralKeySecret: ephemeralKey,
               paymentIntentClientSecret: clientSecret,
               allowsDelayedPaymentMethods: true,
               defaultBillingDetails: {
                    name: "Charly Escalona",
               },
          })

          if (error) {
               showTranslatedFlashMessage("danger", {
                    title: "Payment Initialization Failed",
                    description: error.message,
               })
          }
     }

     const { bookingId, offerId } = useLocalSearchParams<{ bookingId: string; offerId: string }>()

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const theme = useTheme()
     const { data: currentOfferToRent, isPending: isPendingCheckoutOffer, isError: isOfferError, error } = useOfferById(offerId)

     if (isPendingCheckoutOffer && !currentOfferToRent) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>{t("a_moment_title")}</Text>
               </View>
          )
     }

     const { totalAmount, amountForStripe } = displayTotalPrice(currentOfferToRent?.price as string, {
          start: currentOfferToRent?.rentalPeriod.start as string,
          end: currentOfferToRent?.rentalPeriod.end as string,
     })
     const { rentalStartDate, rentalEndDate } = displayRentalPeriod(new Date(currentOfferToRent?.rentalPeriod.start as string), new Date(currentOfferToRent?.rentalPeriod.end as string), locale)

     if (isPendingCheckoutOffer) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text>{t("a_moment_title")}</Text>
               </View>
          )
     }

     const handlePayment = async () => {
          console.log("handlePayment")

          const session = await getCurrentSessionUseCase()
          const accessToken = session.data.session?.access_token as string

          const { paymentIntent, clientSecret, ephemeralKey, customer } = await createTransaction({
               accessToken,
               offerId: currentOfferToRent?.id as string,
               amount: amountForStripe,
               userId: session.data.session?.user?.id as string,
          })

          await initializePaymentSheet({
               paymentIntentId: paymentIntent,
               clientSecret: clientSecret,
               ephemeralKey: ephemeralKey,
               customer: customer,
          })

          console.log({
               paymentIntentId: paymentIntent,
               clientSecret: clientSecret,
               ephemeralKey: ephemeralKey,
               customer: customer,
          })

          try {
               const result = await presentPaymentSheet()

               if (!result.error && paymentIntent && clientSecret && ephemeralKey && customer) {
                    console.log("Payment successful", {
                         paymentIntent,
                    })

                    await verifyAndInsertTransaction({
                         accessToken,
                         paymentIntentId: paymentIntent,
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
                    console.log("updateBookingStatus", {
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
               <Button onPress={() => handlePayment()} mode={"contained"} disabled={creatingTransactionPending || !currentOfferToRent} loading={creatingTransactionPending}>
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
