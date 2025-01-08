import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { router } from "expo-router"
import { MessageType } from "react-native-flash-message"
import BoatEntity from "@/modules/domain/boats/BoatEntity"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export const createBoatUseCase = async ({ boatName, boatDescription, boatCapacity, boatType, boatImages }: { boatName: string; boatDescription: string; boatCapacity: string; boatType: number; boatImages: any[] }) => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          if (!profileId) {
               throw new Error("User session not found.")
          }

          const newBoat = await BoatRepositorySupabase.createBoat(profileId, boatName, boatDescription, boatCapacity, boatType)

          if (!newBoat?.id) {
               throw new Error("Failed to create boat.")
          }

          await BoatRepositorySupabase.uploadImages(newBoat.id, boatImages)

          router.push("/(app)/(tabs)/(boats)")
          return newBoat
     } catch (error) {
          throw error
     }
}
