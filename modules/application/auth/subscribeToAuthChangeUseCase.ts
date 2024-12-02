import authRepository from "@/modules/infrastructure/auth/AuthRepositorySupabase"

export const subscribeToAuthChangesUseCase = (onAuthStateChange: (user: any) => void) => {
     return authRepository.onAuthStateChanged((session) => {
          if (session?.user) {
               console.log("session", session.user)
               onAuthStateChange(session.user)
          } else {
               onAuthStateChange(null)
          }
     })
}
