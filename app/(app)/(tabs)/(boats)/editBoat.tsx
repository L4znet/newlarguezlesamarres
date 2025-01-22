import React, { useEffect, useState } from "react"
import { StyleSheet, View, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, useTheme, Text, ActivityIndicator } from "react-native-paper"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { useBoatTypeOptions } from "@/modules/constants/BoatTypes"
import * as ImagePicker from "expo-image-picker"
import { ImagePickerSuccessResult } from "expo-image-picker"
import Slideshow from "@/app/components/Slideshow"
import { useCreateBoat } from "@/modules/hooks/boats/useCreateBoat"
import { Boat } from "@/interfaces/Boat"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BoatSchema } from "@/modules/domain/boats/schemas/BoatSchema"
import { useBoatStore } from "@/modules/stores/boatStore"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useUpdateBoat } from "@/modules/hooks/boats/useUpdateBoat"
import { useBoatById } from "@/modules/hooks/boats/useBoatById"
import { useLocalSearchParams } from "expo-router"

export default function editBoat() {
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     const boatTypeOptions = useBoatTypeOptions(locale)
     const colors = useTheme().colors
     const { boatId } = useLocalSearchParams<{ boatId: string }>()
     const { data: boat, isPending: loadingBoat, error } = useBoatById(boatId as string)

     const { mutate: updateBoat, isPending: isUpdating } = useUpdateBoat()
     const [imageSelected, setImageSelected] = useState(false)

     const { showTranslatedFlashMessage } = useFlashMessage()

     const [boatImagesThumbnail, setBoatImages] = useState(boat?.boatImages || ([] as Boat["boatImages"]))

     const [types, setTypes] = useState({
          value: "",
          list: [] as typeof boatTypeOptions,
          selectedList: [] as typeof boatTypeOptions,
          error: "",
          id: 1,
     })

     useEffect(() => {
          setTypes({
               value: boatTypeOptions[0].value,
               list: boatTypeOptions,
               selectedList: [boatTypeOptions[0]],
               error: "",
               id: 1,
          })
     }, [locale])

     const {
          control,
          handleSubmit,
          setValue,
          reset,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(BoatSchema),
          defaultValues: {
               boatName: boat?.boatName,
               boatDescription: boat?.boatDescription,
               boatCapacity: boat?.boatCapacity,
               boatType: boat?.boatType.toString(),
               boatImages: boat?.boatImages as Boat["boatImages"],
          },
          values: {
               boatName: boat?.boatName,
               boatDescription: boat?.boatDescription,
               boatCapacity: boat?.boatCapacity,
               boatType: boat?.boatType.toString(),
               boatImages: boat?.boatImages as Boat["boatImages"],
          },
     })

     const handleMultiplePicture = (result: ImagePickerSuccessResult) => {
          let thumbnails: Boat["boatImages"] = [] as Boat["boatImages"]

          result.assets.forEach((asset, index) => {
               thumbnails.push({
                    isDefault: index === 0,
                    url: asset.uri,
                    caption: asset.fileName as string,
                    contentType: asset.type as string,
                    base64: asset.base64 as string,
                    dimensions: { width: asset.width, height: asset.height },
                    size: asset.fileSize?.toString() as string,
                    mimeType: asset.mimeType as string,
                    fileName: asset.fileName as string,
               })
          })

          return thumbnails
     }

     const onSubmit = async (data: any) => {
          try {
               updateBoat({ boatId: boatId, updatedData: { ...data }, imageSelected: imageSelected })
               reset()
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
                    selectionLimit: 3,
                    base64: true,
               })
               if (!result.canceled) {
                    if (result.assets.length !== 0) {
                         const thumbnails = result.assets.map((asset, index) => ({
                              isDefault: index === 0,
                              url: asset.uri as string,
                              caption: asset.fileName as string,
                              contentType: asset.type as string,
                              base64: asset.base64 as string,
                              dimensions: { width: asset.width, height: asset.height },
                              size: asset.fileSize?.toString() as string,
                              mimeType: asset.mimeType as string,
                              fileName: asset.fileName as string,
                         }))
                         setImageSelected(true)
                         setBoatImages(thumbnails)
                         setValue("boatImages", thumbnails)
                    }
               } else {
                    setImageSelected(false)
               }
          } catch (error) {
               throw new Error("Error while selecting image: " + error)
          }
     }
     if (loadingBoat || isUpdating) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text>{t("loading_title")}</Text>
               </View>
          )
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput error={!!errors.boatName} style={styles.textarea} multiline={true} placeholder={t("boat_name_placeholder")} label={t("boat_name_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="boatName" />
                         {errors.boatName && <Text style={styles.errorText}>{t(errors.boatName.message as string)}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput error={!!errors.boatDescription} style={styles.textarea} multiline={true} placeholder={t("boat_description_placeholder")} label={t("boat_description_label")} value={value} onChangeText={onChange} onBlur={onBlur} />} name="boatDescription" />
                         {errors.boatDescription && <Text style={styles.errorText}>{t(errors.boatDescription.message as string)}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput error={!!errors.boatCapacity} style={styles.input} placeholder={t("boat_capacity_placeholder")} label={t("boat_capacity_label")} value={value} keyboardType="decimal-pad" onChangeText={onChange} onBlur={onBlur} />} name="boatCapacity" />
                         {errors.boatCapacity && <Text style={styles.errorText}>{t(errors.boatCapacity.message as string)}</Text>}

                         <Controller
                              control={control}
                              name="boatType"
                              render={({ field: { onChange, value }, fieldState: { error } }) => {
                                   return (
                                        <View style={styles.selector}>
                                             <PaperSelect
                                                  label={t("boat_type_placeholder")}
                                                  value={types.list.find((item) => item._id === value)?.value as string}
                                                  onSelection={(selectedValue: any) => {
                                                       const selected = selectedValue.selectedList[0]
                                                       onChange(selected._id.toString())
                                                  }}
                                                  arrayList={types.list}
                                                  selectedArrayList={value ? types.list.filter((item) => item._id === value.toString()) : []}
                                                  multiEnable={false}
                                                  dialogTitleStyle={{ color: "white" }}
                                                  dialogCloseButtonText={t("close_btn")}
                                                  dialogDoneButtonText={t("done_btn")}
                                             />
                                        </View>
                                   )
                              }}
                         />
                         {errors.boatType && <Text style={styles.errorText}>{t(errors.boatType.message as string)}</Text>}

                         <Slideshow
                              images={boatImagesThumbnail.map((boatImage) => {
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

                         <Button mode="contained" style={styles.button} onPress={handleSubmit(onSubmit, onError)} loading={loadingBoat || isUpdating} disabled={loadingBoat || isUpdating}>
                              {loadingBoat || isUpdating ? t("loading_button_text") : t("edit_boat_button")}
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
     errorText: {
          color: "#ea5555",
          fontSize: 16,
     },
})
