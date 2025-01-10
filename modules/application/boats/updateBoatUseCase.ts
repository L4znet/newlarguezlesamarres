import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { MessageType } from "react-native-flash-message"
import { router } from "expo-router"

export const updateBoatUseCase = async (
     boatId: string,
     updatedData: {
          boatName: string
          boatDescription: string
          boatCapacity: string
          boatType: number
          boatImages: {
               id?: string | null
               url: string
               boatId?: string
               isDefault: boolean
               caption: string | null
               contentType: string
               base64: string
               dimensions: { width: number; height: number }
               size: string
               mimeType: string
               fileName: string | null
          }[]
     },
     imageSelected: boolean
) => {
     // console.log all data in updatedData but without base64 image data

     console.log("Boat updated")

     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const updatedBoat = await BoatRepositorySupabase.updateBoat(updatedData.boatName, updatedData.boatDescription, updatedData.boatCapacity, updatedData.boatType, boatId)

          if (!updatedBoat?.id) {
               throw new Error("Failed to update boat.")
          }

          if (imageSelected) {
               console.log("Image selected")

               await BoatRepositorySupabase.uploadUpdateImages(boatId, updatedData.boatImages)
          }

          router.push("/(app)/(tabs)/(boats)")
     } catch (error) {
          console.log("error ici", error)
          throw new Error((error as Error).message)
     }
}
