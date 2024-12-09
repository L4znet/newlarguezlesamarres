import React, { useRef, useState } from "react"
import { StyleSheet, View, Image, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, useTheme } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { BoatType, useBoatTypeOptions } from "@/constants/BoatTypes"
import * as ImagePicker from "expo-image-picker"
import { ImagePickerCanceledResult, ImagePickerSuccessResult } from "expo-image-picker"
import Slideshow from "@/modules/components/Slideshow"
import { createBoatUseCase } from "@/modules/application/boats/createBoatUseCase"
import Boat from "@/modules/domain/boats/BoatEntity"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { getCurrentUserUseCase } from "@/modules/application/auth/getCurrentUserUseCase"

export const selectValidator = (value: any) => {
     if (!value || value.length <= 0) {
          return "Please select a value."
     }

     return ""
}

export default function AddBoat() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions()
     console.log(boatTypeOptions)

     const [boat, setBoat] = useState<{
          boatName: string
          boatDescription: string
          boatCapacity: string
          boatType: number
          boatImages: { uri: string; caption: string }[]
     }>({
          boatName: "Mon super bateau",
          boatDescription: "fsdfdskojmqksljlm",
          boatCapacity: "10",
          boatType: 1,
          boatImages: [
               { uri: "https://picsum.photos/200/300", caption: "Image 1" },
               { uri: "https://picsum.photos/200/300", caption: "Image 2" },
               { uri: "https://picsum.photos/200/300", caption: "Image 3" },
               { uri: "https://picsum.photos/200/300", caption: "Image 3" },
               { uri: "https://picsum.photos/200/300", caption: "Image 3" },
          ],
     })

     const [types, setType] = useState({
          value: boatTypeOptions[1].value,
          list: boatTypeOptions,
          selectedList: [boatTypeOptions[1]],
          error: "",
          id: 1,
     })

     const singleSelectRef = useRef(null)

     const theme = useTheme()

     const handleMultiplePicture = (result: ImagePickerSuccessResult) => {
          const thumbnails = [] as { uri: string; caption: string | null | undefined }[]

          result.assets.map((asset) => {
               thumbnails.push({ uri: asset.uri, caption: asset.fileName })
          })

          console.log(thumbnails)

          setBoat({ ...boat, boatImages: thumbnails })
     }

     const createBoat = async () => {
          const currentUser = await getCurrentUserUseCase()

          const boatToInsert = {
               profile_id: currentUser?.user.user.id,
               boatName: boat.boatName,
               boatDescription: boat.boatDescription,
               boatCapacity: boat.boatCapacity,
               boatType: types.id,
               boatImages: boat.boatImages,
          }

          await createBoatUseCase(boatToInsert.boatName, boatToInsert.boatDescription, boatToInsert.boatCapacity, boatToInsert.boatType, boatToInsert.boatImages)
     }

     const handleThumbnailChange = async () => {
          try {
               let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsMultipleSelection: true,
                    aspect: [1, 1],
                    quality: 1,
                    orderedSelection: true,
                    selectionLimit: 5,
               })
               if (!result.canceled) {
                    handleMultiplePicture(result)
               }
          } catch (error) {
               console.error("Error while selecting image:", error)
          }
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <TextInput style={styles.input} placeholder={t("boat_name_placeholder")} label={t("boat_name_label")} value={boat.boatName} onChangeText={(boatName) => setBoat({ ...boat, boatName })} />
                         <TextInput style={styles.textarea} multiline={true} placeholder={t("boat_description_placeholder")} label={t("boat_description_label")} value={boat.boatDescription} onChangeText={(boatDescription) => setBoat({ ...boat, boatDescription })} />
                         <TextInput style={styles.input} placeholder={t("boat_capacity_placeholder")} label={t("boat_capacity_label")} value={boat.boatCapacity} keyboardType="decimal-pad" onChangeText={(boatCapacity) => setBoat({ ...boat, boatCapacity })} />

                         <View style={styles.selector}>
                              <PaperSelect
                                   label={t("boat_type_placeholder")}
                                   value={types.value}
                                   onSelection={(value: any) => {
                                        setType({
                                             ...types,
                                             value: value.text,
                                             selectedList: value.selectedList,
                                             error: "",
                                             id: value.selectedList[0]._id,
                                        })
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

                         <Button mode="contained" style={styles.button} onPress={() => createBoat()}>
                              {t("add_boat_button")}
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
