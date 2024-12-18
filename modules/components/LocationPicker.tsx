import React, { useState } from "react"
import { View, TextInput, FlatList, StyleSheet, Text } from "react-native"
import { Modal, Portal, Button } from "react-native-paper"
import { useLocationSearch } from "@/modules/hooks/useLocationSearch"

interface LocationPickerProps {
     visible: boolean
     onDismiss: () => void
     onSelect: (location: any) => void
}

const LocationPicker: React.FC<LocationPickerProps> = ({ visible, onDismiss, onSelect }) => {
     const [query, setQuery] = useState<string>("")

     const { data, isLoading, error } = useLocationSearch(query)

     return (
          <Portal>
               <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                    <TextInput style={styles.input} placeholder="Rechercher une adresse" value={query} onChangeText={setQuery} />

                    {isLoading && <Text>Chargement...</Text>}
                    {error && <Text>Erreur lors de la recherche</Text>}

                    <FlatList
                         style={{ maxHeight: 300 }} // Limite la hauteur
                         data={data || []}
                         keyExtractor={(item, index) => index.toString()}
                         renderItem={({ item }) => (
                              <Text style={styles.resultItem} onPress={() => onSelect(item)}>
                                   {item.address.freeformAddress}
                              </Text>
                         )}
                         keyboardShouldPersistTaps="handled"
                    />
               </Modal>
          </Portal>
     )
}

const styles = StyleSheet.create({
     modalContainer: {
          backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          maxHeight: "80%", // Limite la hauteur de la modal
          width: "90%", // Ajuste la largeur
          alignSelf: "center",
     },
     input: {
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 16,
          borderRadius: 4,
     },
     resultItem: {
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ccc",
     },
})

export default LocationPicker
