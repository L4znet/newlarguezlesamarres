import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export const getProfileUseCase = async () => {
     try {
          const user = await authRepository.getCurrentUserMetadata()
          const { email, firstname, lastname, username, avatar_url } = user
          const profile = {
               email,
               firstname,
               lastname,
               username,
               avatar_url,
          }

          return new ProfileEntity({
               email: profile.email,
               firstname: profile.firstname,
               lastname: profile.lastname,
               username: profile.username,
               avatar_url: profile.avatar_url,
          })
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
