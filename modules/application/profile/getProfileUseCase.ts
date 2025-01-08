import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"
import { getCurrentSessionUseCase } from "@/modules/application/auth/getCurrentSessionUseCase"

export const getProfileUseCase = async () => {
     try {
          const session = await getCurrentSessionUseCase()
          const profileId = session.data.session?.user.id as string

          const user = await authRepository.getCurrentUserProfile(profileId)

          return ProfileEntity.fromSupabaseUser(user)
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
