import React, { useState } from "react"
import { StyleSheet, View, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, useTheme, Text, ActivityIndicator } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { useBoatTypeOptions } from "@/constants/BoatTypes"
import * as ImagePicker from "expo-image-picker"
import { ImagePickerSuccessResult } from "expo-image-picker"
import Slideshow from "@/modules/components/Slideshow"
import { useCreateBoat } from "@/modules/hooks/boats/useCreateBoat"
import { Boat } from "@/interfaces/Boat"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BoatSchema } from "@/modules/domain/boats/schemas/BoatSchema"
import { useBoatStore } from "@/modules/stores/boatStore"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

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

     const { showTranslatedFlashMessage } = useFlashMessage()

     const { boatImages, setBoatImages } = useBoatStore()

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
          reset,
     } = useForm({
          resolver: zodResolver(BoatSchema),
          defaultValues: {
               boatName: "",
               boatDescription: "",
               boatCapacity: "",
               boatImages: [] as Boat["boatImages"],
          },
     })

     const handleMultiplePicture = (result: ImagePickerSuccessResult) => {
          let thumbnails: Boat["boatImages"] = [] as Boat["boatImages"]

          result.assets.forEach((asset, index) => {
               if (result.assets.length > 5) {
                    throw new Error("Error while selecting image: selection limit is 5")
               }

               let isDefault = false

               if (index === 0) {
                    isDefault = true
               }

               if (asset.base64 && asset.type && asset.uri && asset.width && asset.height && asset.fileSize && asset.mimeType && asset.fileName) {
                    thumbnails.push({
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
                    setValue("boatImages", thumbnails)
               } else {
                    throw new Error("Error while selecting image: base64 is undefined")
               }
          })
     }

     const onSubmit = async (data: any) => {
          try {
               createBoat({ ...data })

               reset()
               setBoatImages([])
          } catch (error) {
               showTranslatedFlashMessage("danger", {
                    title: t("flash_title_error"),
                    description: t("supabase_boat_error_added_boat"),
               })
          }
     }
     const onError = (error: any) => {
          showTranslatedFlashMessage("danger", {
               title: t("flash_title_danger"),
               description: t("fix_errors_before_submitting"),
          })
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
                    setBoatImages(
                         result.assets.map((asset, index) => {
                              let isDefault = false

                              if (index === 0) {
                                   isDefault = true
                              }

                              if (asset.base64 && asset.type && asset.uri && asset.width && asset.height && asset.fileSize && asset.mimeType && asset.fileName) {
                                   return {
                                        isDefault: isDefault,
                                        url: asset.uri,
                                        caption: asset.fileName,
                                        contentType: asset.type,
                                        base64: asset.base64,
                                        dimensions: { width: asset.width, height: asset.height },
                                        size: asset.fileSize,
                                        mimeType: asset.mimeType,
                                        fileName: asset.fileName,
                                   }
                              } else {
                                   throw new Error("Error while selecting image: base64 is undefined")
                              }
                         })
                    )
                    handleMultiplePicture(result)
               }
          } catch (error) {
               throw new Error("Error while selecting image: " + error)
          }
     }

     const form = () => {
          return (
               <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <SafeAreaView style={styles.safeView}>
                         <ScrollView style={styles.scrollViewBoats}>
                              <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput error={!!errors.boatName} style={styles.input} placeholder={t("boat_name_placeholder")} label={t("boat_name_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="boatName" />
                              {errors.boatName && <Text style={styles.errorText}>{t(errors.boatName.message as string)}</Text>}

                              <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput error={!!errors.boatDescription} style={styles.textarea} multiline={true} placeholder={t("boat_description_placeholder")} label={t("boat_description_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="boatDescription" />
                              {errors.boatDescription && <Text style={styles.errorText}>{t(errors.boatDescription.message as string)}</Text>}

                              <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput error={!!errors.boatCapacity} style={styles.input} placeholder={t("boat_capacity_placeholder")} label={t("boat_capacity_label")} value={value} keyboardType="decimal-pad" onChangeText={onChange} onBlur={onBlur} />} name="boatCapacity" />
                              {errors.boatCapacity && <Text style={styles.errorText}>{t(errors.boatCapacity.message as string)}</Text>}

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
                                   images={boatImages.map((boatImage: { id: string; url: string; caption: string }) => {
                                        return {
                                             id: boatImage.id as string,
                                             url: boatImage.url as string,
                                             caption: boatImage.caption as string,
                                        }
                                   })}
                              />

                              <Button mode="text" onPress={handleThumbnailChange} style={styles.selectImageBtn}>
                                   {t("change_thumbnail_btn")}
                              </Button>
                              {errors.boatImages && <Text style={styles.errorText}>{t(errors.boatImages.message as string)}</Text>}

                              <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmit, onError)} loading={isPending} disabled={isPending}>
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
     errorText: {
          color: "#ea5555",
          fontSize: 16,
     },
})
