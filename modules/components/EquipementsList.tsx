import React, { useState } from "react"
import { View, TextInput, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { Button, Text } from "react-native-paper"

export default function EquipmentList({ initialList, onUpdate }: { initialList: string[]; onUpdate: (list: string[]) => void }) {
     const [equipment, setEquipment] = useState<string>("")
     const [equipmentList, setEquipmentList] = useState<string[]>(initialList)

     const addEquipment = () => {
          if (equipment.trim() !== "") {
               const updatedList = [...equipmentList, equipment.trim()]
               setEquipmentList(updatedList)
               onUpdate(updatedList)
               setEquipment("")
          }
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
                    <TextInput style={styles.input} placeholder="Entrez un équipement" value={equipment} onChangeText={(text) => setEquipment(text)} onSubmitEditing={addEquipment} returnKeyType="done" />
                    <Button mode="contained" onPress={addEquipment} style={styles.addButton}>
                         Ajouter
                    </Button>
               </View>

               <FlatList
                    data={equipmentList}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item, index }) => (
                         <View style={styles.listItem}>
                              <Text style={styles.listText}>{item}</Text>
                              <Button mode="outlined" style={styles.removeButton} onPress={() => removeEquipment(index)}>
                                   Supprimer
                              </Button>
                         </View>
                    )}
               />
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
