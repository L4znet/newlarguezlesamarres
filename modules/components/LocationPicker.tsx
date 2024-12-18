import React, { useState } from "react"
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity, SafeAreaView } from "react-native"
import { Modal, Portal } from "react-native-paper"
import { useLocationSearch } from "@/modules/hooks/useLocationSearch"

interface LocationPickerProps {
     visible: boolean
     onDismiss: () => void
     onSelect: (location: any) => void
}

const LocationPicker: React.FC<LocationPickerProps> = ({ visible, onDismiss, onSelect }) => {
     const [searchTerm, setSearchTerm] = useState<string>("")

     const { mutate, data, isPending, error, reset } = useLocationSearch()

     const handleSearch = () => {
          if (searchTerm.trim()) {
               mutate(searchTerm)
          }
     }

     const selectItem = (item: any) => {
          onSelect(item)
          setSearchTerm("")
          reset()
          onDismiss()
     }

     return (
          <Portal>
               <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                    <TextInput placeholderTextColor={"#9a9a9a"} style={styles.input} placeholder="Rechercher un lieu (ville, adresse..)" value={searchTerm} onChangeText={setSearchTerm} onEndEditing={handleSearch} />

                    {isPending && <Text>Chargement...</Text>}
                    {error && <Text>Erreur lors de la recherche</Text>}
                    {data && data.length === 0 && <Text>Aucun résultat</Text>}

                    {!searchTerm && <Text>Saisissez un mot clé pour lancer la recherche</Text>}
                    <SafeAreaView style={{ height: 300 }}>
                         <FlatList
                              style={{ height: 500 }}
                              data={data || []}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item }) => (
                                   <TouchableOpacity style={styles.resultItem} onPress={() => selectItem(item)}>
                                        <Text>{item.address.freeformAddress}</Text>
                                   </TouchableOpacity>
                              )}
                              keyboardShouldPersistTaps="handled"
                         />
                    </SafeAreaView>
               </Modal>
          </Portal>
     )
}

const styles = StyleSheet.create({
     modalContainer: {
          backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          width: "90%",
          alignSelf: "center",
     },
     input: {
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 16,
          borderRadius: 4,
          color: "#000",
     },
     resultItem: {
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
     },
})

export default LocationPicker
