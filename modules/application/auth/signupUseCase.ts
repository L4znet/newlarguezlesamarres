import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { UserRegistrationSchema } from "../../domain/auth/schemas/UserRegistrationSchema"

export const signupUseCase = async ({ email, password, confirmPassword, firstname, lastname }: { email: string; password: string; confirmPassword: string; firstname: string; lastname: string }): Promise<AuthEntity> => {
     const parsedData = UserRegistrationSchema.safeParse({ email, password, confirmPassword, firstname, lastname })

     if (!parsedData.success) {
          console.log(parsedData.error)
          throw new Error(`Invalid registration data: ${parsedData.error.issues.map((issue) => issue.message).join(", ")}`)
     }

     try {
          const user = await authRepository.signUp(parsedData.data.email, parsedData.data.password, parsedData.data.lastname, parsedData.data.firstname, parsedData.data.username)
          return AuthEntity.fromSupabaseUser(user)
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
