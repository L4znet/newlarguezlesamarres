import AuthRepositorySupabase from "../../infrastructure/auth/AuthRepositorySupabase"
import EmailUpdateEntity from "@/modules/domain/profile/EmailUpdateEntity"

export const updateEmailUseCase = async (email: string): Promise<EmailUpdateEntity | undefined> => {
     try {
          const updatedEmail = await AuthRepositorySupabase.updateEmail(email)

          const { updatedUser, error } = updatedEmail

          if (updatedUser.user) {
               return EmailUpdateEntity.fromSupabaseUser({
                    email: updatedUser.user.email,
               })
          }
     } catch (error) {
          throw new Error((error as Error).message)
     }
}
