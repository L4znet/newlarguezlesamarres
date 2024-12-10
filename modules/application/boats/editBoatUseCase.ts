import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { useLocalSearchParams } from "expo-router"

export const editBoatUseCase = async (
     boatName: string,
     boatDescription: string,
     boatCapacity: string,
     boatType: number,
     boatImages: {
          uri: string
          caption: string | undefined | null
          contentType: string | undefined
          base64: string | undefined | null
          dimensions: { width: number; height: number }
          size: number | undefined
          mimeType: string | undefined
          fileName: string | undefined | null
     }[]
) => {
     try {
          const params = useLocalSearchParams()

          const boatId = params.boatId

          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const newBoat = await BoatRepositorySupabase.editBoat(profileId, boatName, boatDescription, boatCapacity, boatType, boatId)

          console.log("newBoat", newBoat)

          await BoatRepositorySupabase.uploadAndUpsertImages(newBoat?.boatId, boatImages)

          return newBoat as Boat
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
