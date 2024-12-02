import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export const getProfileUseCase = async () => {
     try {
          const user: unknown = await authRepository.getCurrentUser()
          const profile = {
               email: (user as Profile).email,
               firstname: (user as Profile).firstname,
               lastname: (user as Profile).lastname,
               username: (user as Profile).username,
               avatar_url: (user as Profile).avatar_url,
          }

          return new ProfileEntity({ profile: profile as Profile })
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
