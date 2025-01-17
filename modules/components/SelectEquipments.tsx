import React, { useState } from "react"
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, Text as TextPaper, useTheme, Switch } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { z } from "zod"
import { OfferSchema } from "@/modules/domain/offers/schemas/OfferSchema"

interface Equipment {
     equipmentName: string
     equipmentQuantity: string
}

export default function SelectEquipments({ equipments, setEquipments }: { equipments: Equipment[]; setEquipments: (equipments: Equipment[]) => void; errors: {} | null }) {
     const [newEquipment, setNewEquipment] = useState({ equipmentName: "", equipmentQuantity: "1" })
     const [errors, setErrors] = useState<z.ZodIssue[]>([])
     const router = useRouter()

     const theme = useTheme()

     const EquipmentsSchema = z.object({
          equipments: z.array(
               z.object({
                    equipmentName: z.string().nonempty("zod_rule_equipment_name_required").min(3, "zod_rule_equipment_name_min_length"),
                    equipmentQuantity: z
                         .string()
                         .nonempty("zod_rule_equipment_quantity_required")
                         .refine(
                              (value) => {
                                   const num = parseInt(value)
                                   return !isNaN(num) && num > 0
                              },
                              { message: "zod_rule_equipment_quantity_min_value" }
                         ),
               })
          ),
     })

     const handleAddEquipment = () => {
          try {
               EquipmentsSchema.parse({ equipments: [...equipments, newEquipment] })
               setEquipments([...equipments, newEquipment])
               setNewEquipment({ equipmentName: "", equipmentQuantity: "1" })
               setErrors([])
          } catch (e) {
               if (e instanceof z.ZodError) {
                    setErrors(e.errors)
               }
          }
     }

     const removeEquipment = (index: number) => {
          setEquipments(equipments.filter((_, i) => i !== index))
     }

     const { locale } = useTranslation()
     const t = getTranslator(locale)

     return (
          <View style={styles.container}>
               <View style={styles.inputContainer}>
                    <TextInput style={styles.input} placeholder="Nom de l'équipement" value={newEquipment.equipmentName} onChangeText={(name) => setNewEquipment({ ...newEquipment, equipmentName: name })} />

                    <TextInput style={styles.input} placeholder="Quantité" value={newEquipment.equipmentQuantity} keyboardType="numeric" onChangeText={(quantity) => setNewEquipment({ ...newEquipment, equipmentQuantity: quantity })} />
                    <Button mode="contained" onPress={handleAddEquipment} style={styles.addButton}>
                         {t("add")}
                    </Button>
                    {errors.length > 0 &&
                         errors.map((error, index) => (
                              <Text key={index} style={styles.errorText}>
                                   {t(error.message)}
                              </Text>
                         ))}
               </View>

               <View style={styles.listContainer}>
                    <FlatList
                         nestedScrollEnabled={true}
                         data={equipments}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({ item, index }) => (
                              <View style={styles.listItem} key={index}>
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
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          width: "100%",
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
