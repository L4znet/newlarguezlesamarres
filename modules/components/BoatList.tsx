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
import { getTranslator, useTranslation } from "@/modules/context/TranslationContext"

const BoatList = () => {
     const { data: boats, isPending, error } = useBoats()
     const { mutate: deleteBoat, isPending: isDeletePending, isError: isDeleteError, isSuccess: isDeleteSuccess } = useDeleteBoat()
     const { setCurrentBoat, setBoatImages } = useBoatStore()
     const { locale } = useTranslation()
     const t = getTranslator(locale)

     if (isPending) return <ActivityIndicator size="large" />

     const EmptyList = () => {
          return (
               <View style={styles.container}>
                    <Text>{t("boats_empty_message")}</Text>
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

          const boatImages = item.boatImages.map((image) => {
               return {
                    id: image.id as string,
                    url: image.url as string,
                    caption: image.caption as string,
               }
          })

          return (
               <Card key={item.id} style={styles.card}>
                    <Slideshow images={boatImages} />
                    <Card.Title title={item.boatName} subtitle={item.boatDescription} />
                    <Card.Content>
                         <Text>Capacité : {item.boatCapacity}</Text>
                         <Text>Type : {t(boatType.toLowerCase())}</Text>
                    </Card.Content>
                    <Card.Actions>
                         <Button mode={"contained"} onPress={() => handleEditBoat(item.id)}>
                              Modifier
                         </Button>
                         <Button mode={"outlined"} loading={isDeletePending} disabled={isDeletePending} onPress={async () => deleteBoat(item.id)}>
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
