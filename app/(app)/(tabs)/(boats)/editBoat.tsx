import React, { useEffect, useState } from "react"
import { StyleSheet, View, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, useTheme, Text, ActivityIndicator } from "react-native-paper"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { BoatSchema } from "@/modules/domain/boats/schemas/BoatSchema"
import { useBoatById } from "@/modules/hooks/boats/useBoatById"
import { useUpdateBoat } from "@/modules/hooks/boats/useUpdateBoat"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"
import { useBoatStore } from "@/modules/stores/boatStore"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { PaperSelect } from "react-native-paper-select"
import { useBoatTypeOptions, displayBoatType } from "@/constants/BoatTypes"
import Slideshow from "@/modules/components/Slideshow"
import * as ImagePicker from "expo-image-picker"

export default function EditBoat({ route }: { route: any }) {
     const { setCurrentBoatId, currentBoatId } = useBoatStore()
     const { data: boat, isPending, error } = useBoatById(currentBoatId as string)
     const { mutate: updateBoat, isPending: isUpdating } = useUpdateBoat()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { boatImages, setBoatImages } = useBoatStore()
     const { colors } = useTheme()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions(locale)
     const [imageSelected, setImageSelected] = useState(false)

     useEffect(() => {
          if (boat) {
               setBoatImages(boat.boatImages)
          }
     }, [boat])

     const {
          control,
          handleSubmit,
          setValue,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(BoatSchema),
          defaultValues: {
               boatName: boat?.boatName,
               boatDescription: boat?.boatDescription,
               boatCapacity: boat?.boatCapacity,
               boatType: boat?.boatType.toString(),
               boatImages: boat?.boatImages,
          },
          values: {
               boatName: boat?.boatName,
               boatDescription: boat?.boatDescription,
               boatCapacity: boat?.boatCapacity,
               boatType: boat?.boatType.toString(),
               boatImages: boat?.boatImages,
          },
     })

     const handleThumbnailChange = async () => {
          try {
               const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: "images",
                    allowsMultipleSelection: true,
                    quality: 1,
                    base64: true,
                    selectionLimit: 3,
               })
               if (!result.canceled) {
                    const newImages = result.assets.map((asset, index) => ({
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

                    setBoatImages(newImages)
                    setImageSelected(true)
               }
          } catch (error) {
               console.error("Error while selecting images:", error)
          }
     }

     const onSubmit = (data: any) => {
          updateBoat({
               boatId: currentBoatId as string,
               updatedData: {
                    boatName: data.boatName,
                    boatDescription: data.boatDescription,
                    boatCapacity: parseInt(data.boatCapacity),
                    boatType: data.boatType,
                    boatImages: data.boatImages,
               },
               imageSelected,
          })
     }

     if (isUpdating) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text>{t("loading_title")}</Text>
               </View>
          )
     }

     if (isPending) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text>{t("a_moment_title")}</Text>
               </View>
          )
     }

     if (error) {
          return (
               <View style={styles.container}>
                    <Text style={styles.errorText}>{t("error_loading_boat")}</Text>
               </View>
          )
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollView}>
                         <Controller control={control} name="boatName" render={({ field: { onChange, value } }) => <TextInput label={t("boat_name_label")} placeholder={t("boat_name_placeholder")} value={value} onChangeText={onChange} error={!!errors.boatName} style={styles.input} />} />
                         {errors.boatName && <Text style={styles.errorText}>{t(errors.boatName.message as string)}</Text>}

                         <Controller control={control} name="boatDescription" render={({ field: { onChange, value } }) => <TextInput label={t("boat_description_label")} placeholder={t("boat_description_placeholder")} value={value} onChangeText={onChange} error={!!errors.boatDescription} style={styles.input} multiline />} />
                         {errors.boatDescription && <Text style={styles.errorText}>{t(errors.boatDescription.message as string)}</Text>}

                         <Controller control={control} name="boatCapacity" render={({ field: { onChange, value } }) => <TextInput label={t("boat_capacity_label")} placeholder={t("boat_capacity_placeholder")} value={value} onChangeText={onChange} keyboardType="numeric" error={!!errors.boatCapacity} style={styles.input} />} />
                         {errors.boatCapacity && <Text style={styles.errorText}>{t(errors.boatCapacity.message as string)}</Text>}

                         <Controller
                              control={control}
                              name="boatType"
                              render={({ field: { onChange, value }, fieldState: { error } }) => {
                                   const boatType = boatTypeOptions.find((option) => option._id === value)
                                   return (
                                        <PaperSelect
                                             label={t("boat_type_placeholder")}
                                             value={boatType?.value || ""}
                                             onSelection={(selectedValue: any) => {
                                                  const selectedType = selectedValue.selectedList[0]
                                                  if (selectedType) {
                                                       onChange(selectedType._id)
                                                  }
                                             }}
                                             arrayList={boatTypeOptions}
                                             selectedArrayList={boatType ? [boatType] : []}
                                             multiEnable={false}
                                             dialogTitleStyle={{ color: "white" }}
                                             dialogCloseButtonText={t("close_btn")}
                                             dialogDoneButtonText={t("done_btn")}
                                        />
                                   )
                              }}
                         />

                         <Controller
                              control={control}
                              name={"boatImages"}
                              render={({ field: { onChange, value } }) => {
                                   return (
                                        <>
                                             <Slideshow images={boatImages} />
                                             <Button mode="text" onPress={handleThumbnailChange} style={styles.selectImageBtn}>
                                                  {t("change_thumbnail_btn")}
                                             </Button>
                                        </>
                                   )
                              }}
                         />

                         {errors.boatImages && <Text style={styles.errorText}>{t(errors.boatImages.message as string)}</Text>}

                         <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isUpdating} disabled={isUpdating} style={styles.button}>
                              {isUpdating ? t("loading_button_text") : t("edit_btn")}
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
     safeView: {
          flex: 1,
          width: "90%",
     },
     scrollView: {
          flex: 1,
     },
     input: {
          marginVertical: 10,
     },
     button: {
          marginVertical: 20,
     },
     selectImageBtn: {
          marginVertical: 10,
     },
     errorText: {
          color: "#ea5555",
          fontSize: 14,
     },
})
