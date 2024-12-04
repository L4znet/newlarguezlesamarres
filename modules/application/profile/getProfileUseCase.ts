import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export const getProfileUseCase = async () => {
     try {
          const { email, firstname, lastname, username, avatar_url } = await authRepository.getCurrentUserMetadata()

          return new ProfileEntity(email, firstname, lastname, username, avatar_url)
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
