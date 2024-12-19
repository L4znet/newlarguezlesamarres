import React, { useEffect, useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useRouter } from "expo-router"
import { useCreateOffer } from "@/modules/hooks/offers/useCreateOffer"
import { RentalFrequency, useRentalFrequencyOptions } from "@/constants/RentalFrequency"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"

export default function createOffer() {
     const router = useRouter()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const rentalFrequencyOptions = useRentalFrequencyOptions(locale)
     const [frequency, setFrequency] = useState({
          value: rentalFrequencyOptions[0].value,
          list: rentalFrequencyOptions,
          selectedList: [rentalFrequencyOptions[0]],
          error: "",
          id: parseInt(RentalFrequency.Hour),
     })

     const { equipments, rentalPeriod, location, selectedBoatId, resetStore } = useOfferExternalScreenStore()

     useEffect(() => {
          resetStore()
     }, [])

     const [offer, setOffer] = useState({
          boatId: "",
          profileId: "",
          title: "",
          description: "",
          price: 0,
          isAvailable: false,
          isSkipperAvailable: false,
          isTeamAvailable: false,
          rentalPeriod: { start: "", end: "" },
          location: {
               city: "",
               address: "",
               country: "",
               zipcode: "",
          },
          equipments: [],
     })

     const { mutate: createOffer, isPending } = useCreateOffer(
          () => {
               showTranslatedFlashMessage("success", {
                    title: "flash_title_success",
                    description: "L'offre a été créée avec succès.",
               })
          },
          (error) => {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: error.message,
               })
          }
     )

     const handleSubmit = () => {
          if (rentalPeriod.startDate && rentalPeriod.endDate && location.city && location.address && location.country && location.zipcode && selectedBoatId) {
               createOffer({
                    ...offer,
                    frequency: frequency.id,
                    equipments,
                    rentalPeriod: {
                         start: rentalPeriod.startDate,
                         end: rentalPeriod.endDate,
                    },
                    location,
                    boatId: selectedBoatId,
                    deletedAt: null,
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
                         <TextInput style={styles.input} placeholder={t("offer_title_placeholder")} label={t("offer_title_label")} value={offer.title} onChangeText={(title) => setOffer({ ...offer, title })} />
                         <TextInput style={styles.textarea} placeholder={t("offer_description_placeholder")} label={t("offer_description_label")} value={offer.description} onChangeText={(description) => setOffer({ ...offer, description })} />
                         <TextInput style={styles.input} placeholder={t("offer_price_placeholder")} label={t("offer_price_label")} value={offer.price.toString()} onChangeText={(price) => setOffer({ ...offer, price: parseFloat(price) })} />
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
                              <Switch value={offer.isAvailable} onValueChange={(value) => setOffer({ ...offer, isAvailable: value })} />
                         </View>
                         <View style={styles.inputRow}>
                              <Text>{t("is_skipper_available_label")}</Text>
                              <Switch value={offer.isSkipperAvailable} onValueChange={(value) => setOffer({ ...offer, isSkipperAvailable: value })} />
                         </View>
                         <View style={styles.inputRow}>
                              <Text>{t("is_team_available_label")}</Text>
                              <Switch value={offer.isTeamAvailable} onValueChange={(value) => setOffer({ ...offer, isTeamAvailable: value })} />
                         </View>
                         <Button
                              icon={equipments.length > 0 ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectEquipments", {
                                        initialEquipments: offer.equipments || [],
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_equipment_button")}
                         </Button>
                         <Button
                              icon={rentalPeriod.startDate && rentalPeriod.endDate ? "check" : "plus"}
                              mode="contained"
                              onPress={() =>
                                   handleNavigate("/selectRentalPeriod", {
                                        initialPeriod: offer.rentalPeriod,
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
                                        initialLocation: offer.location,
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
                                        initialBoatId: offer.boatId,
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
