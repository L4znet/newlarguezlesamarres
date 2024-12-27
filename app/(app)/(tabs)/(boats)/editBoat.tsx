import React from "react"
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Platform, View } from "react-native"
import { Button, TextInput, Text, useTheme, ActivityIndicator } from "react-native-paper"
import { PaperSelect } from "react-native-paper-select"
import * as ImagePicker from "expo-image-picker"
import Slideshow from "@/modules/components/Slideshow"
import { useUpdateBoat } from "@/modules/hooks/boats/useUpdateBoat"
import { useBoatTypeOptions } from "@/constants/BoatTypes"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useBoatStore } from "@/modules/stores/boatExternalScreenStore"

export default function EditBoat() {
     const { currentBoat, updateCurrentBoatField } = useBoatStore()
     const { mutate: updateBoat, isPending: isUpdating } = useUpdateBoat()

     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions(locale)
     const colors = useTheme().colors

     if (!currentBoat) {
          return (
               <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <SafeAreaView style={styles.safeView}>
                         <ActivityIndicator size="large" color={colors.primary} />
                         <Text>{t("edit_boat_loading")}</Text>
                    </SafeAreaView>
               </KeyboardAvoidingView>
          )
     }

     if (isUpdating) {
          return (
               <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <SafeAreaView style={styles.safeView}>
                         <ActivityIndicator size="large" color={colors.primary} />
                         <Text>{t("edit_boat_loading")}</Text>
                    </SafeAreaView>
               </KeyboardAvoidingView>
          )
     }

     const handleThumbnailChange = async () => {
          try {
               const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsMultipleSelection: true,
                    aspect: [1, 1],
                    quality: 1,
                    orderedSelection: true,
                    selectionLimit: 5,
                    base64: true,
               })

               if (!result.canceled) {
                    const thumbnails = result.assets.map((asset, index) => ({
                         url: asset.uri,
                         caption: asset.fileName || "",
                         isDefault: index === 0, // La première image est par défaut
                         boatId: currentBoat.id,
                         base64: asset.base64,
                         contentType: asset.type,
                         dimensions: {
                              width: asset.width,
                              height: asset.height,
                         },
                         size: asset.fileSize,
                         mimeType: asset.mimeType,
                         fileName: asset.fileName,
                    }))

                    updateCurrentBoatField("boatImages", thumbnails)
               }
          } catch (error) {
               console.error("Error while selecting images:", error)
          }
     }

     const ensureSingleDefaultImage = () => {
          const updatedImages = currentBoat.boatImages.map((image, index) => ({
               ...image,
               isDefault: index === 0,
          }))
          updateCurrentBoatField("boatImages", updatedImages)
     }

     const handleSave = () => {
          ensureSingleDefaultImage()

          const updatedBoatData = {
               boatName: currentBoat.boatName,
               boatDescription: currentBoat.boatDescription,
               boatCapacity: currentBoat.boatCapacity,
               boatType: currentBoat.boatType,
               boatImages: currentBoat.boatImages,
          }

          updateBoat({
               boatId: currentBoat.id,
               updatedData: updatedBoatData,
               imageSelected: !!currentBoat.boatImages.find((image) => image.isDefault),
          })
     }

     const boatType = boatTypeOptions.find((type) => type._id === currentBoat.boatType.toString())

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <TextInput style={styles.input} placeholder="Nom du bateau" label="Nom du bateau" value={currentBoat.boatName} onChangeText={(text) => updateCurrentBoatField("boatName", text)} />

                         <TextInput style={styles.textarea} multiline placeholder="Description du bateau" label="Description" value={currentBoat.boatDescription} onChangeText={(text) => updateCurrentBoatField("boatDescription", text)} />

                         <TextInput style={styles.input} placeholder="Capacité" label="Capacité" value={currentBoat.boatCapacity} keyboardType="decimal-pad" onChangeText={(text) => updateCurrentBoatField("boatCapacity", text)} />

                         <View style={styles.selector}>
                              <PaperSelect
                                   label="Type de bateau"
                                   value={boatType?.value || ""}
                                   onSelection={(value) => {
                                        const selectedType = value.selectedList[0]
                                        if (selectedType) {
                                             updateCurrentBoatField("boatType", selectedType._id)
                                        }
                                   }}
                                   arrayList={boatTypeOptions}
                                   selectedArrayList={boatType ? [boatType] : []}
                                   multiEnable={false}
                                   dialogTitleStyle={{ color: "white" }}
                                   dialogCloseButtonText="Fermer"
                                   dialogDoneButtonText="Valider"
                              />
                         </View>

                         <Slideshow images={currentBoat.boatImages} />
                         <Button mode="text" onPress={handleThumbnailChange} style={styles.selectImageBtn}>
                              Modifier les images
                         </Button>

                         <Button mode="contained" onPress={() => handleSave()} loading={isUpdating} disabled={isUpdating} style={styles.button}>
                              Enregistrer
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
     scrollViewBoats: {
          width: "100%",
          rowGap: 20,
          paddingTop: 20,
     },
     safeView: {
          width: "90%",
          rowGap: 20,
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
     },
     input: {
          width: "100%",
          marginVertical: 10,
     },
     textarea: {
          width: "100%",
          marginVertical: 10,
     },
     selector: {
          width: "100%",
          marginVertical: 10,
     },
     selectImageBtn: {
          marginVertical: 30,
     },
     button: {
          marginVertical: 30,
     },
})
