import React, { useState } from "react"
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, Text as TextPaper, useTheme, Switch } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { useOfferStore } from "@/modules/stores/offerStore"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { z } from "zod"

interface Equipment {
     name: string
     quantity: string
}

export default function selectEquipments() {
     const { equipments, removeEquipment, setErrors, getErrors, setEquipments } = useOfferStore()
     const [newEquipment, setNewEquipment] = useState({ equipmentName: "", equipmentQuantity: "1" })

     const router = useRouter()
     const { backPath } = useLocalSearchParams<{ backPath: string }>()
     const theme = useTheme()
     const equipmentsErrors = getErrors("equipments")
     const schema = z.object({
          equipmentName: z
               .string()
               .nonempty("zod_rule_equipment_name_required")
               .refine((value) => value.length >= 3, { message: "zod_rule_equipment_name_too_short" }),
          equipmentQuantity: z
               .string()
               .nonempty("zod_rule_equipment_quantity_required")
               .refine(
                    (value) => {
                         console.log("value", value)
                         return parseInt(value) > 0
                    },
                    { message: "zod_rule_equipment_quantity_invalid" }
               ),
     })

     const handleAddEquipment = () => {
          const validationResult = schema.safeParse({
               equipmentName: newEquipment.equipmentName,
               equipmentQuantity: newEquipment.equipmentQuantity,
          })

          if (!validationResult.success) {
               const errors = validationResult.error.flatten()
               setErrors("equipments", [...(errors.fieldErrors.equipmentName || []), ...(errors.fieldErrors.equipmentQuantity || []), ...(errors.formErrors || [])])
               return
          } else {
               setNewEquipment({ equipmentName: "", equipmentQuantity: "1" })

               setEquipments([...equipments, { equipmentName: newEquipment.equipmentName, equipmentQuantity: newEquipment.equipmentQuantity }])
               setErrors("equipments", [])
          }
     }

     const handleNavigation = () => {
          router.navigate({ pathname: backPath as RelativePathString })
     }

     const handleConfirm = () => {
          setErrors("equipments", [])
          router.navigate({ pathname: backPath as RelativePathString })
     }
     const handleCancel = () => {
          setErrors("equipments", [])
          handleNavigation()
     }

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView>
                    <ScrollView style={styles.safearea}>
                         <TextPaper style={{ textAlign: "center" }} variant={"titleLarge"}>
                              {t("equipment_title")}
                         </TextPaper>
                         <TextPaper
                              style={{
                                   textAlign: "center",
                                   marginTop: 10,
                              }}
                              variant={"titleSmall"}
                         >
                              {t("equipment_description")}
                         </TextPaper>

                         <View style={styles.inputContainer}>
                              <TextInput style={styles.input} placeholder="Nom de l'équipement" value={newEquipment.equipmentName} onChangeText={(name) => setNewEquipment({ ...newEquipment, equipmentName: name })} />

                              <TextInput style={styles.input} placeholder="Quantité" value={newEquipment.equipmentQuantity} keyboardType="numeric" onChangeText={(quantity) => setNewEquipment({ ...newEquipment, equipmentQuantity: quantity })} />

                              {equipmentsErrors &&
                                   equipmentsErrors.map((err, index) => {
                                        return (
                                             <Text key={index} style={[styles.errorText, { color: theme.colors.error }]}>
                                                  {t(err)}
                                             </Text>
                                        )
                                   })}

                              <Button mode="contained" onPress={handleAddEquipment} style={styles.addButton}>
                                   {t("add")}
                              </Button>
                         </View>

                         <View style={styles.listContainer}>
                              <FlatList
                                   data={equipments}
                                   keyExtractor={(item, index) => index.toString()}
                                   renderItem={({ item, index }) => (
                                        <View style={styles.listItem}>
                                             <View style={styles.rowItem}>
                                                  <Text style={{ color: theme.colors.primary }}>{item.equipmentName}</Text>
                                                  <Text style={{ color: theme.colors.primary }}> - </Text>
                                                  <Text style={{ color: theme.colors.primary }}> {item.equipmentQuantity}</Text>
                                             </View>

                                             <Button mode="text" onPress={() => removeEquipment(index)}>
                                                  {t("delete")}
                                             </Button>
                                        </View>
                                   )}
                              />
                         </View>

                         <Button mode="contained" onPress={handleConfirm} style={styles.saveButton}>
                              {t("save")}
                         </Button>
                         <Button mode="outlined" onPress={handleCancel} style={styles.cancelButton}>
                              {t("cancel")}
                         </Button>
                    </ScrollView>
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          width: "90%",
          alignSelf: "center",
     },
     safeView: {
          flex: 1,
          paddingHorizontal: 20,
     },
     scrollView: {
          flexGrow: 1,
          marginTop: 30,
     },
     input: {
          marginVertical: 10,
     },
     textarea: {
          marginVertical: 10,
     },
     inputRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 10,
     },
     button: {
          marginVertical: 10,
     },
     submitButton: {
          marginTop: 20,
     },
     listContainer: {
          paddingBottom: 16,
          marginVertical: 30,
     },
     listItem: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: "#eee",
     },
     listText: {
          fontSize: 16,
          flex: 1,
          color: "white",
     },
     removeButton: {
          borderRadius: 8,
     },
     safearea: {
          marginTop: 30,
     },
     rowItem: {
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
     },
     inputContainer: {
          marginTop: 30,
     },
     addButton: {
          borderRadius: 8,
          marginTop: 30,
     },
     saveButton: {
          borderRadius: 8,
          marginTop: 30,
     },
     cancelButton: {
          borderRadius: 8,
          marginTop: 10,
     },
     errorText: {
          color: "#ea5555",
          fontSize: 16,
     },
})
