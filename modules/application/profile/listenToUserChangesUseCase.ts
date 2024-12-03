import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import ProfileEntity from "@/modules/domain/profile/ProfileEntity"

export const listenToUserChangesUseCase = (onUserChange: (user: ProfileEntity) => void) => {
     const unsubscribe = authRepository.onAuthStateChanged(async (session) => {
          if (session?.user) {
               try {
                    const userMetadata = await authRepository.getCurrentUserMetadata()
                    const profileEntity = new ProfileEntity({
                         email: userMetadata.email,
                         firstname: userMetadata.firstname,
                         lastname: userMetadata.lastname,
                         username: userMetadata.username,
                         avatar_url: userMetadata.avatar_url,
                    })
                    onUserChange(profileEntity)
               } catch (error) {
                    console.error("Erreur lors de la récupération des métadonnées utilisateur:", error)
                    onUserChange({} as ProfileEntity)
               }
          } else {
               onUserChange({} as ProfileEntity)
          }
     })

     return unsubscribe
}
