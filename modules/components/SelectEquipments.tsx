import React, { useState } from "react"
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, Text as TextPaper, useTheme, Switch } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"
import { z } from "zod"

interface Equipment {
     equipmentName: string
     equipmentQuantity: string
}

export default function SelectEquipments({ equipments, setEquipments }: { equipments: Equipment[]; setEquipments: (equipments: Equipment[]) => void }) {
     const [newEquipment, setNewEquipment] = useState({ equipmentName: "", equipmentQuantity: "1" })

     const router = useRouter()

     const theme = useTheme()

     const handleAddEquipment = () => {
          setNewEquipment({ equipmentName: "", equipmentQuantity: "1" })

          setEquipments([...equipments, { equipmentName: newEquipment.equipmentName, equipmentQuantity: newEquipment.equipmentQuantity }])
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
