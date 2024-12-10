import React, { useEffect, useRef, useState } from "react"
import { StyleSheet, View, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, useTheme } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { BoatType, useBoatTypeOptions } from "@/constants/BoatTypes"
import * as ImagePicker from "expo-image-picker"
import { ImagePickerCanceledResult, ImagePickerSuccessResult } from "expo-image-picker"
import Slideshow from "@/modules/components/Slideshow"
import { editBoatUseCase } from "@/modules/application/boats/editBoatUseCase"
import { getBoatsUseCase } from "@/modules/application/boats/getBoatsUseCase"
import { getSingleBoatUseCase } from "@/modules/application/boats/getSingleBoatUseCase"
import { useLocalSearchParams } from "expo-router"

export const selectValidator = (value: any) => {
     if (!value || value.length <= 0) {
          return "Please select a value."
     }

     return ""
}

export default function EditBoat() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions()

     const [boat, setBoat] = useState({})

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
          const fetchBoats = async () => {
               try {
                    const fetchedBoats = await getSingleBoatUseCase(boatId)

                    const boatType = boatTypeOptions.find((type) => type.id === fetchedBoats.boatType)
                    const selectedList = boatType ? [boatType] : []

                    setBoat(fetchedBoats)
               } catch (error) {
                    console.error("Erreur lors de la récupération des bateaux :", error)
               } finally {
                    //   setIsLoading(false)
               }
          }

          fetchBoats()
     }, [boat])

     const handleMultiplePicture = (result: ImagePickerSuccessResult) => {
          const thumbnails = [] as unknown as Boat["boatImages"]

          result.assets.map((asset) => {
               if (asset.uri) {
                    thumbnails.push({
                         url: asset.uri,
                         caption: asset.fileName,
                         isDefault: false,
                         boatId: boatId,
                    })
               } else {
                    throw new Error("Error while selecting image: base64 is undefined")
               }
          })

          setBoat({ ...boat, boatImages: thumbnails })
     }

     const editBoat = async () => {
          try {
               const result = await editBoatUseCase(boat.boatName, boat.boatDescription, boat.boatCapacity, types.id, boat.boatImages)
          } catch (error) {
               console.error("Error while editing boat:", error)
          }
     }

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

                         <Button mode="contained" style={styles.button} onPress={() => editBoat()}>
                              {t("edit_boat_button")}
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
