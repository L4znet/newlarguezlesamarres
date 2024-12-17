import React, { useCallback, useMemo, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { BottomSheetModal, BottomSheetModalProps } from "@gorhom/bottom-sheet"
import { ActivityIndicator } from "react-native-paper"
import { useBoats } from "@/modules/hooks/boats/useBoats"

interface BoatSelectorBottomSheetProps extends Partial<BottomSheetModalProps> {
     onSelect: (boatId: string) => void
     selectedBoatId?: string | null
}

const BoatSelectorBottomSheet = React.forwardRef<BottomSheetModal, BoatSelectorBottomSheetProps>(({ onSelect, selectedBoatId, ...rest }, ref) => {
     const snapPoints = useMemo(() => ["25%", "50%", "90%"], [])
     const { data: boats, isLoading, error } = useBoats()
     const [currentSelection, setCurrentSelection] = useState<string | null>(selectedBoatId || null)

     const handleSelect = (boatId: string) => {
          setCurrentSelection(boatId)
          onSelect(boatId)
     }

     console.log("currentSelection", currentSelection)
     console.log("selectedBoatId", selectedBoatId)
     console.log(ref)

     const renderItem = ({ item }: any) => (
          <TouchableOpacity onPress={() => handleSelect(item.boatId)} style={[styles.item, currentSelection === item.boatId && styles.selected]}>
               <Text>{item.boatName}</Text>
          </TouchableOpacity>
     )

     return (
          <BottomSheetModal ref={ref} snapPoints={snapPoints} {...rest}>
               {isLoading && <ActivityIndicator />}
               {error && <Text>Erreur lors de la récupération des bateaux</Text>}
               {boats && <FlatList data={boats} keyExtractor={(item) => item.boatId} renderItem={renderItem} />}
          </BottomSheetModal>
     )
})

const styles = StyleSheet.create({
     contentContainer: { flex: 1, padding: 16 },
     item: { padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
     selected: { backgroundColor: "#cce5ff" },
})

export default BoatSelectorBottomSheet
