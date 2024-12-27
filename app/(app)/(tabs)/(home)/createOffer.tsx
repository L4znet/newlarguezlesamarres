import React from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useRouter } from "expo-router"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { RentalFrequency, useRentalFrequencyOptions } from "@/constants/RentalFrequency"
import { useOfferStore } from "@/modules/stores/offerStore"

export default function createOffer() {
     const router = useRouter()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const rentalFrequencyOptions = useRentalFrequencyOptions(locale)

     const { equipments, rentalPeriod, location, selectedBoatId, offerTitle, offerDescription, offerPrice, isAvailable, isSkipperAvailable, isTeamAvailable, setOfferField, resetStore } = useOfferStore()

     const [frequency, setFrequency] = React.useState({
          value: rentalFrequencyOptions[0].value,
          list: rentalFrequencyOptions,
          selectedList: [rentalFrequencyOptions[0]],
          error: "",
          id: parseInt(RentalFrequency.Hour),
     })

     const { mutate: createOffer, isPending } = useCreateOffer(
          () => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "L'offre a été créée avec succès.",
               })
               resetStore()
               router.push("/(app)/(tabs)/(home)")
          },
          (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: error.message,
               })
          }
     )

     const handleSubmit = () => {
          if (rentalPeriod.start && rentalPeriod.end && location.city && location.address && location.country && location.zipcode && selectedBoatId) {
               createOffer({
                    title: offerTitle,
                    description: offerDescription,
                    price: offerPrice,
                    isAvailable,
                    isSkipperAvailable,
                    isTeamAvailable,
                    frequency: frequency.id,
                    equipments,
                    rentalPeriod: {
                         start: rentalPeriod.start,
                         end: rentalPeriod.end,
                    },
                    location,
                    boatId: selectedBoatId,
                    deletedAt: null,
               })
          } else {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: "Veuillez remplir tous les champs requis.",
               })
          }
     }

     const handleNavigate = (path: string, params: any) => {
          router.push({
               pathname: path as RelativePathString,
               params,
          })
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
                         <TextInput style={styles.input} placeholder={t("offer_title_placeholder")} label={t("offer_title_label")} value={offerTitle} onChangeText={(title) => setOfferField("offerTitle", title)} />
                         <TextInput style={styles.textarea} placeholder={t("offer_description_placeholder")} label={t("offer_description_label")} value={offerDescription} onChangeText={(description) => setOfferField("offerDescription", description)} />
                         <TextInput style={styles.input} keyboardType="decimal-pad" placeholder={t("offer_price_placeholder")} label={t("offer_price_label")} value={offerPrice} onChangeText={(price) => setOfferField("offerPrice", price)} />
                         <PaperSelect
                              label={t("rental_frequency_placeholder")}
                              value={frequency.value}
                              onSelection={(value: any) => {
                                   setFrequency({
                                        ...frequency,
                                        value: value.text,
                                        selectedList: value.selectedList,
                                        error: "",
                                        id: parseInt(value.selectedList[0]._id),
                                   })
                              }}
                              arrayList={[...frequency.list]}
                              selectedArrayList={frequency.selectedList}
                              errorText={frequency.error}
                              multiEnable={false}
                         />
                         <View style={styles.inputRow}>
                              <Text>{t("is_available_label")}</Text>
                              <Switch value={isAvailable} onValueChange={(value) => setOfferField("isAvailable", value)} />
                         </View>
                         <View style={styles.inputRow}>
                              <Text>{t("is_skipper_available_label")}</Text>
                              <Switch value={isSkipperAvailable} onValueChange={(value) => setOfferField("isSkipperAvailable", value)} />
                         </View>
                         <View style={styles.inputRow}>
                              <Text>{t("is_team_available_label")}</Text>
                              <Switch value={isTeamAvailable} onValueChange={(value) => setOfferField("isTeamAvailable", value)} />
                         </View>
                         <Button
                              icon={equipments.length > 0 ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectEquipments", {
                                        initialEquipments: equipments || [],
                                        backPath: "/createOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_equipment_button")}
                         </Button>
                         <Button
                              icon={rentalPeriod.start && rentalPeriod.end ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectRentalPeriod", {
                                        initialPeriod: rentalPeriod,
                                        backPath: "/createOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_rental_period_button")}
                         </Button>

                         <Button
                              icon={location.city && location.address && location.country && location.zipcode ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectLocation", {
                                        initialLocation: location,
                                        backPath: "/createOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_location_button")}
                         </Button>

                         <Button
                              icon={selectedBoatId ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectBoat", {
                                        initialBoatId: selectedBoatId,
                                        backPath: "/createOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_boat_button")}
                         </Button>

                         <Button mode="contained" style={styles.submitButton} onPress={handleSubmit} loading={isPending} disabled={isPending}>
                              {isPending ? t("loading_button_text") : t("create_offer_button")}
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          width: "90%",
          alignSelf: "center",
     },
     safeView: {
          flex: 1,
          paddingHorizontal: 20,
     },
     scrollView: {
          flexGrow: 1,
          marginTop: 30,
     },
     input: {
          marginVertical: 10,
     },
     textarea: {
          marginVertical: 10,
     },
     inputRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
          color: "white",
     },
     button: {
          marginVertical: 10,
     },
     submitButton: {
          marginTop: 50,
     },
     equipmentList: {
          paddingBottom: 16,
          marginVertical: 30,
     },
})
