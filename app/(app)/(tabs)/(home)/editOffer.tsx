import React, { useEffect } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useRouter, useLocalSearchParams } from "expo-router"
import { RentalFrequency, useRentalFrequencyOptions } from "@/constants/RentalFrequency"
import { useUpdateOffer } from "@/modules/hooks/offers/useUpdateOffer"
import { useOfferStore } from "@/modules/stores/offerStore"

export default function EditOffer() {
     const router = useRouter()
     const { currentOffer, location, equipments, rentalPeriod, selectedBoatId, setLocation, setEquipments, setRentalPeriod, selectBoat, setOfferField } = useOfferStore()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const { mutate: updateOffer } = useUpdateOffer()
     const rentalFrequencyOptions = useRentalFrequencyOptions(locale)

     const handleNavigate = (path: string, params: any) => {
          router.push({
               pathname: path as RelativePathString,
               params,
          })
     }

     const frequencyParsed = rentalFrequencyOptions.find((option) => option._id === frequency) || rentalFrequencyOptions[0]

     const { id, title, description, price, isAvailable, frequency, isSkipperAvailable, isTeamAvailable, boatId } = currentOffer as any

     console.log({
          rentalPeriod,
     })

     const handleSave = () => {
          if (!title || !description || !price) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: t("all_fields_required"),
               })
               return
          }

          const boatId = selectedBoatId as string

          updateOffer({
               id: id,
               title,
               description,
               price,
               isAvailable,
               frequency,
               equipments,
               isSkipperAvailable,
               isTeamAvailable,
               rentalPeriod,
               location,
               boatId,
          })
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
                         <TextInput style={styles.input} placeholder={t("offer_title_placeholder")} label={t("offer_title_label")} value={title} onChangeText={(text) => setOfferField("title", text)} />
                         <TextInput style={styles.textarea} placeholder={t("offer_description_placeholder")} label={t("offer_description_label")} value={description} onChangeText={(text) => setOfferField("description", text)} />
                         <TextInput style={styles.input} placeholder={t("offer_price_placeholder")} label={t("offer_price_label")} value={price} keyboardType="decimal-pad" onChangeText={(text) => setOfferField("price", text)} />
                         <PaperSelect
                              label={t("rental_frequency_placeholder")}
                              value={frequencyParsed.value}
                              onSelection={(value: any) => {
                                   setOfferField("frequency", value)
                              }}
                              arrayList={rentalFrequencyOptions}
                              selectedArrayList={[frequencyParsed]}
                              errorText=""
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
                                        backPath: "/editOffer",
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
                                        backPath: "/editOffer",
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
                                        backPath: "/editOffer",
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
                                        backPath: "/editOffer",
                                   })
                              }
                              style={styles.button}
                         >
                              {t("select_boat_button")}
                         </Button>
                         <Button mode="contained" onPress={handleSave} style={styles.confirmButton}>
                              {t("confirm_button")}
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
     },
     button: {
          marginVertical: 10,
     },
     confirmButton: {
          marginVertical: 50,
     },
})
