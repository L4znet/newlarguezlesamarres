import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useBoatTypeOptions } from "@/constants/BoatTypes"
import { useEffect, useState } from "react"
import { useLocalSearchParams } from "expo-router"
import { getSingleBoatUseCase } from "@/modules/application/boats/getSingleBoatUseCase"
import { updateBoatUseCase } from "@/modules/application/boats/updateBoatUseCase"
import * as ImagePicker from "expo-image-picker"
import { PaperSelect } from "react-native-paper-select"
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View, StyleSheet, Platform } from "react-native"
import { Button, TextInput } from "react-native-paper"
import Slideshow from "@/modules/components/Slideshow"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export default function EditBoat() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions()
     const [isLoading, setIsLoading] = useState(false)
     const { showTranslatedFlashMessage } = useFlashMessage()

     const [boat, setBoat] = useState({
          boatName: "",
          boatDescription: "",
          boatCapacity: "",
          boatType: 0,
          boatImages: [],
     })

     const [types, setType] = useState({
          value: boatTypeOptions[1].value,
          list: boatTypeOptions,
          selectedList: [boatTypeOptions[1]],
          error: "",
          id: 1,
     })

     const params = useLocalSearchParams()
     const boatId = params.boatId

     useEffect(() => {
          const loadBoat = async () => {
               try {
                    const fetchedBoat = await getSingleBoatUseCase(boatId)
                    const boatType = boatTypeOptions.find((type) => type.id === fetchedBoat.boatType)

                    setBoat({
                         boatName: fetchedBoat.boatName,
                         boatDescription: fetchedBoat.boatDescription,
                         boatCapacity: fetchedBoat.boatCapacity,
                         boatType: fetchedBoat.boatType,
                         boatImages: fetchedBoat.boatImages,
                    })

                    setType((prev) => ({
                         ...prev,
                         selectedList: boatType ? [boatType] : [],
                    }))
               } catch (error) {
                    console.error("Erreur lors de la récupération des bateaux :", error)
               }
          }

          loadBoat()
     }, [boatId])

     const handleThumbnailChange = async () => {
          try {
               let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: "images",
                    allowsMultipleSelection: true,
                    aspect: [1, 1],
                    quality: 1,
                    orderedSelection: true,
                    selectionLimit: 5,
                    base64: true,
               })
               if (!result.canceled) {
                    const thumbnails = result.assets.map((asset) => ({
                         url: asset.uri,
                         caption: asset.fileName || "",
                         isDefault: false,
                         boatId: boatId,
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
                    setBoat((prev) => ({ ...prev, boatImages: thumbnails }))
               }
          } catch (error) {
               console.error("Error while selecting image:", error)
          }
     }

     const editBoat = async () => {
          try {
               const result = await updateBoatUseCase(boatId, boat.boatName, boat.boatDescription, boat.boatCapacity, types.id, boat.boatImages, setIsLoading, showTranslatedFlashMessage)
          } catch (error) {
               console.error("Error while editing boat:", error)
          }
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <TextInput style={styles.input} placeholder={t("boat_name_placeholder")} label={t("boat_name_label")} value={boat.boatName} onChangeText={(text) => setBoat((prev) => ({ ...prev, boatName: text }))} />
                         <TextInput style={styles.textarea} multiline={true} placeholder={t("boat_description_placeholder")} label={t("boat_description_label")} value={boat.boatDescription} onChangeText={(text) => setBoat((prev) => ({ ...prev, boatDescription: text }))} />
                         <TextInput style={styles.input} placeholder={t("boat_capacity_placeholder")} label={t("boat_capacity_label")} value={boat.boatCapacity} keyboardType="decimal-pad" onChangeText={(text) => setBoat((prev) => ({ ...prev, boatCapacity: text }))} />

                         <View style={styles.selector}>
                              <PaperSelect
                                   label={t("boat_type_placeholder")}
                                   value={types.value}
                                   onSelection={(value) => {
                                        setType((prev) => ({
                                             ...prev,
                                             value: value.text,
                                             selectedList: value.selectedList,
                                             error: "",
                                             id: value.selectedList[0]._id,
                                        }))
                                        setBoat((prev) => ({ ...prev, boatType: value.selectedList[0].id }))
                                   }}
                                   arrayList={[...types.list]}
                                   selectedArrayList={types.selectedList}
                                   errorText={types.error}
                                   multiEnable={false}
                                   dialogTitleStyle={{ color: "white" }}
                                   dialogCloseButtonText={t("close_btn")}
                                   dialogDoneButtonText={t("done_btn")}
                              />
                         </View>

                         <Slideshow images={boat.boatImages} />

                         <Button mode="text" onPress={handleThumbnailChange} style={styles.selectImageBtn}>
                              {t("change_thumbnail_btn")}
                         </Button>

                         <Button mode="contained" style={styles.button} onPress={() => editBoat()} loading={isLoading} disabled={isLoading}>
                              {isLoading ? t("loading_button_text") : t("edit_boat_button")}
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
     title: {
          fontSize: 24,
          fontWeight: "bold",
     },
     text: {
          fontSize: 16,
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
     fab: {
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
     },
     card: {
          width: "100%",
          marginVertical: 10,
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
     boatImage: {
          width: "100%",
          height: 250,
     },
     slideShow: {
          width: "100%",
          height: 250,
          marginVertical: 30,
     },
     selectImageBtn: {
          marginVertical: 30,
     },
     button: {
          marginVertical: 30,
     },
})
