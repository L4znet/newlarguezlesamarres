import React from "react"
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Platform, View } from "react-native"
import { Button, TextInput, Text, useTheme, ActivityIndicator } from "react-native-paper"
import { PaperSelect } from "react-native-paper-select"
import * as ImagePicker from "expo-image-picker"
import Slideshow from "@/modules/components/Slideshow"
import { useUpdateBoat } from "@/modules/hooks/boats/useUpdateBoat"
import { useBoatTypeOptions } from "@/constants/BoatTypes"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { useBoatStore } from "@/modules/stores/boatStore"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BoatSchema } from "@/modules/domain/boats/schemas/BoatSchema"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export default function EditBoat() {
     const { currentBoat, updateCurrentBoatField, setBoatToUpdate, setImageSelectedState, imageSelectedState, boatToUpdate } = useBoatStore()
     const { mutate: updateBoat, isPending: isUpdating } = useUpdateBoat()

     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions(locale)
     const colors = useTheme().colors

     const { showTranslatedFlashMessage } = useFlashMessage()
     const {
          control,
          handleSubmit,
          trigger,
          setValue,
          getValues,
          resetField,
          formState: { errors },
          reset,
     } = useForm({
          resolver: zodResolver(BoatSchema),
          defaultValues: {
               boatName: currentBoat?.boatName,
               boatDescription: currentBoat?.boatDescription,
               boatCapacity: currentBoat?.boatCapacity,
               boatType: currentBoat?.boatType,
               boatImages: currentBoat?.boatImages,
          },
     })

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

     if (currentBoat.boatName && currentBoat.boatDescription && currentBoat.boatCapacity && currentBoat.boatType) {
          setValue("boatName", currentBoat.boatName)
          setValue("boatDescription", currentBoat.boatDescription)
          setValue("boatCapacity", currentBoat.boatCapacity)
          setValue("boatType", currentBoat.boatType)
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

     if (!boatToUpdate) {
          return null
     }

     if (boatToUpdate.boatImages.length > 0) {
          console.log("boatImages", {
               url: boatToUpdate.boatImages[0].url,
               caption: boatToUpdate.boatImages[0].caption,
               contentType: boatToUpdate.boatImages[0].contentType,
               dimensions: boatToUpdate.boatImages[0].dimensions,
               size: boatToUpdate.boatImages[0].size,
               mimeType: boatToUpdate.boatImages[0].mimeType,
               fileName: boatToUpdate.boatImages[0].fileName,
          })

          setValue("boatImages", boatToUpdate.boatImages)
     }

     const handleThumbnailChange = async () => {
          try {
               const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ["images"],
                    allowsMultipleSelection: true,
                    aspect: [1, 1],
                    quality: 1,
                    orderedSelection: true,
                    selectionLimit: 5,
                    base64: true,
               })

               if (!result.canceled) {
                    setImageSelectedState(true)
                    setBoatToUpdate({
                         ...currentBoat,
                         boatImages: result.assets.map((image, index) => ({
                              url: image.uri as string,
                              isDefault: false,
                              caption: image.fileName as string,
                              contentType: image.type as string,
                              base64: image.base64 as string,
                              dimensions: { width: image.width, height: image.height },
                              size: image?.fileSize?.toString() as string,
                              mimeType: image.type as string,
                              fileName: image.fileName as string,
                              boatId: currentBoat.id,
                         })),
                    })
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

          setValue("boatImages", updatedImages)
     }

     const onSubmit = (data: any) => {
          console.log("data", {
               boatName: data.boatName,
               boatDescription: data.boatDescription,
               boatCapacity: data.boatCapacity,
               boatType: data.boatType,
          })

          const updatedData = {
               boatName: getValues("boatName"),
               boatDescription: getValues("boatDescription"),
               boatCapacity: getValues("boatCapacity"),
               boatType: getValues("boatType"),
               boatImages: getValues("boatImages"),
          }

          updateBoat({ boatId: currentBoat.id, updatedData, imageSelected: imageSelectedState })
     }

     const onError = (error: any) => {
          console.log("Error while submitting form:", error)

          showTranslatedFlashMessage("danger", {
               title: t("flash_title_danger"),
               description: t("fix_errors_before_submitting"),
          })
     }

     const boatType = boatTypeOptions.find((type) => type._id === currentBoat.boatType.toString())

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollViewBoats}>
                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput label={t("boat_name_label")} style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.boatName} />} name="boatName" />
                         {errors.boatName && <Text style={styles.errorText}>{t(errors.boatName.message as string)}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput label={t("boat_description_label")} style={styles.textarea} onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.boatDescription} />} name="boatDescription" />
                         {errors.boatDescription && <Text style={styles.errorText}>{t(errors.boatDescription.message as string)}</Text>}

                         <Controller control={control} render={({ field: { onChange, onBlur, value } }) => <TextInput label={t("boat_capacity_label")} style={styles.input} onBlur={onBlur} onChangeText={onChange} value={value} error={!!errors.boatCapacity} />} name="boatCapacity" />
                         {errors.boatCapacity && <Text style={styles.errorText}>{t(errors.boatCapacity.message as string)}</Text>}

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

                         <Slideshow
                              images={currentBoat.boatImages.map((boatImage) => {
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

                         <Button mode="contained" onPress={handleSubmit(onSubmit, onError)} loading={isUpdating} disabled={isUpdating} style={styles.button}>
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
     errorText: {
          color: "#ea5555",
          fontSize: 16,
     },
})
