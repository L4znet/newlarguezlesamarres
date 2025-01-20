import { BoatRepository } from "@/modules/domain/boats/BoatRepository"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { GetBoatsDTO } from "@/modules/domain/boats/DTO/GetBoatsDTO"

export const getBoatsUseCase = async (boatRepository: BoatRepository): Promise<GetBoatsDTO[] | undefined> => {
     console.log("aaaaaa")
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          console.log("profileId", profileId)

          if (!profileId) {
               throw new Error("User session not found.")
          }

          console.log("profileId", profileId)

          return await boatRepository.getBoats(profileId)
     } catch (error) {
          console.error(error)
          throw new Error((error as Error).message)
     }
}
