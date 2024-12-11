import BoatRepositorySupabase from "@/modules/infrastructure/boat/BoatRepositorySupabase"
import Boat from "@/modules/domain/boats/BoatEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import BoatEntity from "@/modules/domain/boats/BoatEntity"

export const createBoatUseCase = async (
     boatName: string,
     boatDescription: string,
     boatCapacity: string,
     boatType: number,
     boatImages: {
          id: string
          url: string
          boatId: string
          isDefault: boolean
          caption: string | null | undefined
          contentType: string | undefined
          base64: string | undefined
          dimensions: { width: number; height: number }
          size: number | undefined
          mimeType: string | undefined
          fileName: string | undefined | null
     }[]
): Promise<BoatEntity> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const newBoat = await BoatRepositorySupabase.createBoat(profileId, boatName, boatDescription, boatCapacity, boatType)

          await BoatRepositorySupabase.uploadImages(newBoat?.boatId, boatImages)

          return newBoat as Boat
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
