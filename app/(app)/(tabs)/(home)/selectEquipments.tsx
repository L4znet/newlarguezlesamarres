import React, { useState } from "react"
import { View, StyleSheet, FlatList, Text, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { Button, TextInput, Text as TextPaper } from "react-native-paper"
import { RelativePathString, useLocalSearchParams, useRouter } from "expo-router"
import { useOfferExternalScreenStore } from "@/modules/stores/offerExternalScreenStore"

interface Equipment {
     name: string
     quantity: string
}

export default function selectEquipments() {
     const { equipments, addEquipment, removeEquipment } = useOfferExternalScreenStore()
     const [newEquipment, setNewEquipment] = useState({ name: "", quantity: "" })
     const router = useRouter()
     const { backPath } = useLocalSearchParams<{ backPath: string }>()

     const handleAddEquipment = () => {
          if (newEquipment.name.trim() && newEquipment.quantity.trim()) {
               addEquipment(newEquipment)
               setNewEquipment({ name: "", quantity: "" })
          }
     }

     const handleNavigation = () => {
          router.navigate({ pathname: backPath as RelativePathString })
     }
     const cancelSelection = () => {
          handleNavigation()
     }

     return (
          <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
               <SafeAreaView>
                    <ScrollView style={styles.safearea}>
                         <TextPaper style={{ textAlign: "center" }} variant={"titleLarge"}>
                              Ajoutez les équipements inclus dans la location
                         </TextPaper>
                         <TextPaper
                              style={{
                                   textAlign: "center",
                                   marginTop: 10,
                              }}
                              variant={"titleSmall"}
                         >
                              Cela permettra d'ajouter une plue-value à votre annonce, mais ceci n'est pas obligatoire
                         </TextPaper>

                         <View style={styles.inputContainer}>
                              <TextInput style={styles.input} placeholder="Nom de l'équipement" value={newEquipment.name} onChangeText={(name) => setNewEquipment({ ...newEquipment, name: name })} />
                              <TextInput style={styles.input} placeholder="Quantité" value={newEquipment.quantity} keyboardType="numeric" onChangeText={(quantity) => setNewEquipment({ ...newEquipment, quantity: quantity })} />
                              <Button mode="contained" onPress={handleAddEquipment} style={styles.addButton}>
                                   Ajouter
                              </Button>
                         </View>

                         <View style={styles.listContainer}>
                              <FlatList
                                   data={equipments}
                                   keyExtractor={(item, index) => index.toString()}
                                   renderItem={({ item, index }) => (
                                        <View style={styles.listItem}>
                                             <Text style={styles.listText}>{item.quantity === "1" ? item.name : `${item.quantity} ${item.name}`}</Text>
                                             <Button mode="text" onPress={() => removeEquipment(index)}>
                                                  Supprimer
                                             </Button>
                                        </View>
                                   )}
                              />
                         </View>

                         <Button mode="contained" onPress={handleNavigation} style={styles.saveButton}>
                              Enregistrer
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
})
