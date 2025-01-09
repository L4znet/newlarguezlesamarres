import React, { useState } from "react"
import { StyleSheet, View, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, useTheme, Text, ActivityIndicator } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { useBoatTypeOptions } from "@/constants/BoatTypes"
import * as ImagePicker from "expo-image-picker"
import { ImagePickerSuccessResult } from "expo-image-picker"
import Slideshow from "@/modules/components/Slideshow"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useCreateBoat } from "@/modules/hooks/boats/useCreateBoat"
import { Boat } from "@/interfaces/Boat"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OfferSchema } from "@/modules/domain/offers/schemas/OfferSchema"
import { BoatSchema } from "@/modules/domain/boats/schemas/BoatSchema"

export const selectValidator = (value: any) => {
     if (!value || value.length <= 0) {
          return "Please select a value."
     }

     return ""
}

export default function createBoat() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions(locale)
     const colors = useTheme().colors
     const { data: boats, isPending, error, mutate: createBoat } = useCreateBoat()

     const [boat, setBoat] = useState<Boat>({
          boatName: "",
          boatDescription: "",
          boatCapacity: "",
          boatType: 1,
          boatImages: [],
     })

     const [types, setType] = useState({
          value: boatTypeOptions[0].value,
          list: boatTypeOptions,
          selectedList: [boatTypeOptions[0]],
          error: "",
          id: 1,
     })

     const {
          control,
          handleSubmit,
          trigger,
          setValue,
          resetField,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(BoatSchema),
          defaultValues: {
               boatName: "",
               boatDescription: "",
               boatCapacity: "",
               boatImages: [],
          },
     })

     const handleMultiplePicture = (result: ImagePickerSuccessResult) => {
          const thumbnails = [] as unknown as Boat["boatImages"]

          result.assets.forEach((asset, index) => {
               if (result.assets.length > 5) {
                    throw new Error("Error while selecting image: selection limit is 5")
               }

               let isDefault = false

               if (index === 0) {
                    isDefault = true
               }

               if (asset.base64) {
                    thumbnails.push({
                         boatId: "",
                         id: "",
                         isDefault: isDefault,
                         url: asset.uri,
                         caption: asset.fileName,
                         contentType: asset.type,
                         base64: asset.base64,
                         dimensions: { width: asset.width, height: asset.height },
                         size: asset.fileSize,
                         mimeType: asset.mimeType,
                         fileName: asset.fileName,
                    })
               } else {
                    throw new Error("Error while selecting image: base64 is undefined")
               }
          })

          setBoat({ ...boat, boatImages: thumbnails })
     }

     const onSubmit = async () => {
          createBoat({
               boatName: boat.boatName,
               boatDescription: boat.boatDescription,
               boatCapacity: boat.boatCapacity,
               boatType: types.id,
               boatImages: boat.boatImages,
          })
     }

     const onError = (error: any) => {
          console.error("Error while creating boat:", error)
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

     const form = () => {
          return (
               <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <SafeAreaView style={styles.safeView}>
                         <ScrollView style={styles.scrollViewBoats}>
                              <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("boat_name_placeholder")} label={t("boat_name_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="boatName" />

                              <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.textarea} multiline={true} placeholder={t("boat_description_placeholder")} label={t("boat_description_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="boatDescription" />

                              <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput style={styles.input} placeholder={t("boat_capacity_placeholder")} label={t("boat_capacity_label")} value={value} keyboardType="decimal-pad" onChangeText={onChange} onBlur={onBlur} />} name="boatCapacity" />

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

                              <Slideshow
                                   images={boat.boatImages.map((boatImage) => {
                                        return {
                                             id: boatImage.id,
                                             url: boatImage.url,
                                             caption: boatImage.caption as string,
                                        }
                                   })}
                              />

                              <Button mode="text" onPress={handleThumbnailChange} style={styles.selectImageBtn}>
                                   {t("change_thumbnail_btn")}
                              </Button>

                              <Button mode="contained" style={styles.button} onPress={() => handleSubmit(onSubmit, onError)} loading={isPending} disabled={isPending}>
                                   {isPending ? t("loading_button_text") : t("create_boat_button")}
                              </Button>
                         </ScrollView>
                    </SafeAreaView>
               </KeyboardAvoidingView>
          )
     }

     const loader = () => {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text>{t("loading_title")}</Text>
               </View>
          )
     }

     return isPending ? loader() : form()
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
