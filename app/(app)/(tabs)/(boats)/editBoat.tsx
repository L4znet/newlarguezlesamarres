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
import { useBoatTypeOptions } from "@/constants/BoatTypes"

export default function EditBoat({ route }: { route: any }) {
     const { currentBoatId } = useBoatStore()
     const { data: boat, isLoading, error } = useBoatById(currentBoatId as string)
     const { mutate: updateBoat, isPending: isUpdating } = useUpdateBoat()
     const { showTranslatedFlashMessage } = useFlashMessage()
     const { colors } = useTheme()
     const { locale } = useTranslation()
     const t = getTranslator(locale)
     const boatTypeOptions = useBoatTypeOptions(locale)

     const [types] = useState({
          value: boatTypeOptions[0].value,
          list: boatTypeOptions,
          selectedList: [boatTypeOptions[0]],
          error: "",
          id: 1,
     })

     const {
          control,
          handleSubmit,
          setValue,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(BoatSchema),
          defaultValues: {
               boatName: "",
               boatDescription: "",
               boatCapacity: "",
               boatType: "",
          },
     })

     useEffect(() => {
          if (boat) {
               setValue("boatName", boat.boatName)
               setValue("boatDescription", boat.boatDescription)
               setValue("boatCapacity", boat.boatCapacity.toString())
               setValue("boatType", boat.boatType.toString())
          }
     }, [boat, setValue])

     const onSubmit = (data: any) => {
          updateBoat(
               { id: currentBoatId, ...data },
               {
                    onSuccess: () => {
                         showTranslatedFlashMessage("success", {
                              title: "Boat updated",
                              description: "The boat was successfully updated.",
                         })
                    },
                    onError: () => {
                         showTranslatedFlashMessage("danger", {
                              title: "Error",
                              description: "Failed to update the boat.",
                         })
                    },
               }
          )
     }

     if (isLoading) {
          return (
               <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text>{t("loading_title")}</Text>
               </View>
          )
     }

     if (error) {
          return (
               <View style={styles.container}>
                    <Text style={styles.errorText}>Failed to load boat details. Please try again later.</Text>
               </View>
          )
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView style={styles.safeView}>
                    <ScrollView style={styles.scrollView}>
                         <Controller control={control} name="boatName" render={({ field: { onChange, value } }) => <TextInput label={t("boat_name_label")} placeholder={t("boat_name_placeholder")} value={value} onChangeText={onChange} error={!!errors.boatName} style={styles.input} />} />
                         {errors.boatName && <Text style={styles.errorText}>{errors.boatName.message}</Text>}

                         <Controller control={control} name="boatDescription" render={({ field: { onChange, value } }) => <TextInput label={t("boat_description_label")} placeholder={t("boat_description_label")} value={value} onChangeText={onChange} error={!!errors.boatDescription} style={styles.input} multiline />} />
                         {errors.boatDescription && <Text style={styles.errorText}>{errors.boatDescription.message}</Text>}

                         <Controller control={control} name="boatCapacity" render={({ field: { onChange, value } }) => <TextInput label={t("boat_capacity_label")} placeholder={t("boat_capacity_label")} value={value} onChangeText={onChange} keyboardType="numeric" error={!!errors.boatCapacity} style={styles.input} />} />
                         {errors.boatCapacity && <Text style={styles.errorText}>{errors.boatCapacity.message}</Text>}

                         <Controller
                              control={control}
                              name="boatType"
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                   <View style={styles.selector}>
                                        <PaperSelect
                                             label={t("boat_type_placeholder")}
                                             value={types.list.find((item) => item._id.toString() === value.toString())?.value || ""}
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
                              )}
                         />

                         <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isUpdating} disabled={isUpdating} style={styles.button}>
                              {isUpdating ? "Updating..." : "Update Boat"}
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
     errorText: {
          color: "#ea5555",
          fontSize: 14,
     },
     selector: {
          width: "100%",
          marginVertical: 10,
     },
})
