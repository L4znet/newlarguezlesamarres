import React, { useEffect, useState } from "react"
import { View, FlatList, StyleSheet } from "react-native"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { ActivityIndicator, Button, Card, FAB, Text } from "react-native-paper"
import Slideshow from "@/modules/components/Slideshow"
import { router } from "expo-router"
import { useBoats } from "@/modules/hooks/boats/useBoats"
import { BoatType, displayBoatType, getBoatType } from "@/constants/BoatTypes"
import { useBoatStore } from "@/modules/stores/boatStore"
import { getSingleBoatUseCase } from "@/modules/application/boats/getSingleBoatUseCase"
import { useDeleteBoat } from "@/modules/hooks/boats/useDeleteBoat"

const BoatList = () => {
     const { data: boats, isPending } = useBoats()
     const { mutate: deleteBoat, isPending: isDeletePending, isError: isDeleteError, isSuccess: isDeleteSuccess } = useDeleteBoat()
     const { setCurrentBoat } = useBoatStore()

     if (isPending) return <ActivityIndicator size="large" />

     const EmptyList = () => {
          return (
               //@TODO Translate
               <View style={styles.container}>
                    <Text>Rien à afficher pour le moment</Text>
               </View>
          )
     }

     const handleEditBoat = async (boatId: string) => {
          const boat = await getSingleBoatUseCase(boatId)

          setCurrentBoat(boat)
          router.push({ pathname: "/(app)/(tabs)/(boats)/editBoat" })
     }

     const renderItem = ({ item }: { item: BoatEntity }) => {
          const boatType = displayBoatType(item.boatType as unknown as BoatType)

          return (
               <Card key={item.id} style={styles.card}>
                    <Slideshow images={item.boatImages} />
                    <Card.Title title={item.boatName} subtitle={item.boatDescription} />
                    <Card.Content>
                         <Text>ID : {item.id}</Text>
                         <Text>Capacité : {item.boatCapacity}</Text>
                         <Text>Type : {boatType}</Text>
                    </Card.Content>
                    <Card.Actions>
                         <Button onPress={() => handleEditBoat(item.id)}>Modifier</Button>
                         <Button loading={isDeletePending} disabled={isDeletePending} onPress={async () => deleteBoat(item.id)}>
                              Supprimer
                         </Button>
                    </Card.Actions>
               </Card>
          )
     }

     return <FlatList data={boats} ListEmptyComponent={EmptyList} keyExtractor={(item) => item.id} renderItem={renderItem} />
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
     },
     safeView: {
          width: "100%",
          rowGap: 20,
          justifyContent: "center",
          alignItems: "center",
     },
     fab: {
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
     },
     card: {
          width: "100%",
          marginVertical: 10,
     },
})

export default BoatList
