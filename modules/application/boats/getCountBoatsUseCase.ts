import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"
import { BoatRepository } from "@/modules/domain/boats/BoatRepository"
import BoatEntity from "@/modules/domain/boats/BoatEntity"

export const getCountBoatsUseCase = async (boatRepository: BoatRepository): Promise<boolean> => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id

          const boatCount = await boatRepository.getBoatsCount(profileId)

          return BoatEntity.canCreateOffer(boatCount ?? 0)
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
