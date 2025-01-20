import React, { useState } from "react"
import { View, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native"
import { Button, Text } from "react-native-paper"
import { Equipment } from "@/interfaces/Offer"

export default function EquipmentList({ initialList, onUpdate }: { initialList: Equipment[]; onUpdate: (list: Equipment[]) => void }) {
     const [equipment, setEquipment] = useState<Equipment>({
          name: "",
          quantity: "1",
     })
     const [equipmentList, setEquipmentList] = useState<Equipment[]>(initialList)

     const addEquipment = () => {
          if (!equipment.name) return
          const updatedList = [...equipmentList, equipment]
          setEquipmentList(updatedList)
          onUpdate(updatedList)
          setEquipment({
               name: "",
               quantity: "1",
          })
     }

     const removeEquipment = (index: number) => {
          const updatedList = equipmentList.filter((_, i) => i !== index)
          setEquipmentList(updatedList)
          onUpdate(updatedList)
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <Text style={styles.title}>Ajouter un équipement</Text>
               <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={equipment.name} onChangeText={(text) => setEquipment({ ...equipment, name: text })} placeholder="Nom de l'équipement" placeholderTextColor="white" />
                    <TextInput style={styles.input} value={equipment.quantity} onChangeText={(text) => setEquipment({ ...equipment, quantity: text })} placeholder="Quantité" placeholderTextColor="white" />

                    <Button mode="contained" onPress={addEquipment} style={styles.addButton}>
                         Ajouter
                    </Button>
               </View>
               <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                         data={equipmentList}
                         keyExtractor={(item, index) => index.toString()}
                         contentContainerStyle={styles.listContainer}
                         renderItem={({ item, index }) => (
                              <View style={styles.listItem}>
                                   <Text style={styles.listText}>{item.quantity === "1" ? item.name : `${item.quantity} ${item.name}`}</Text>=
                                   <Button mode="outlined" style={styles.removeButton} onPress={() => removeEquipment(index)}>
                                        Supprimer
                                   </Button>
                              </View>
                         )}
                    />
               </SafeAreaView>
          </KeyboardAvoidingView>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          marginTop: 30,
     },
     title: {
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 16,
     },
     inputContainer: {
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
     },
     input: {
          flex: 1,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginRight: 8,
          color: "white",
     },
     addButton: {
          borderRadius: 8,
          paddingHorizontal: 16,
     },
     listContainer: {
          paddingBottom: 16,
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
     },
     removeButton: {
          borderRadius: 8,
     },
})
