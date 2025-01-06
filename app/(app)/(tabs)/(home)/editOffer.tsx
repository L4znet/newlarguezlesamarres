import React, { useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { Button, Text, TextInput, Switch } from "react-native-paper"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { RelativePathString, useRouter } from "expo-router"
import { useUpdateOffer } from "@/modules/hooks/offers/useUpdateOffer"
import { useOfferStore } from "@/modules/stores/offerStore"
import title from "react-native-paper/src/components/Typography/v2/Title"

export default function EditOffer() {
     const router = useRouter()
     const { id, title, description, isTeamAvailable, isAvailable, isSkipperAvailable, price, setOfferField, location, equipments, rentalPeriod, selectedBoatId } = useOfferStore()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const { mutate: updateOffer } = useUpdateOffer()

     const handleNavigate = (path: string, params: any) => {
          router.push({
               pathname: path as RelativePathString,
               params,
          })
     }

     const handleSave = () => {
          if (!title || !description || !price) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: "All fields required",
               })
               return
          }

          if (!id || !selectedBoatId) {
               showTranslatedFlashMessage("danger", {
                    title: "flash_title_error",
                    description: "Offers not found",
               })
               router.push("/(app)/(tabs)/(offers)")
               return
          }

          updateOffer({
               id,
               title,
               description,
               price,
               isAvailable,
               equipments,
               isSkipperAvailable,
               isTeamAvailable,
               rentalPeriod,
               location,
               boatId: selectedBoatId as string,
          })
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={{ flexGrow: 1 }}>
                         <TextInput style={styles.input} placeholder={t("offer_title_placeholder")} label={t("offer_title_label")} value={title} onChangeText={(text) => setOfferField("title", text)} />
                         <TextInput style={styles.textarea} placeholder={t("offer_description_placeholder")} label={t("offer_description_label")} value={description} onChangeText={(text) => setOfferField("description", text)} />
                         <TextInput style={styles.input} placeholder={t("offer_price_placeholder")} label={t("offer_price_label")} value={price} keyboardType="decimal-pad" onChangeText={(text) => setOfferField("price", text)} />
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
                         <Button icon={equipments.length > 0 ? "check" : "plus"} mode="contained" onPress={() => handleNavigate("/selectEquipments", { backPath: "/editOffer" })} style={styles.button}>
                              {t("select_equipment_button")}
                         </Button>
                         <Button icon={rentalPeriod.start && rentalPeriod.end ? "check" : "plus"} mode="contained" onPress={() => handleNavigate("/selectRentalPeriod", { backPath: "/editOffer" })} style={styles.button}>
                              {t("select_rental_period_button")}
                         </Button>
                         <Button icon={location.city && location.address && location.country && location.zipcode ? "check" : "plus"} mode="contained" onPress={() => handleNavigate("/selectLocation", { backPath: "/editOffer" })} style={styles.button}>
                              {t("select_location_button")}
                         </Button>
                         <Button icon={selectedBoatId ? "check" : "plus"} mode="contained" onPress={() => handleNavigate("/selectBoat", { backPath: "/editOffer" })} style={styles.button}>
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
