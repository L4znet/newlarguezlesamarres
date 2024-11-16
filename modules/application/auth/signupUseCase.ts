import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AuthEntity from "../../domain/auth/AuthEntity"
import { UserRegistrationSchema } from "../../domain/auth/schemas/UserRegistrationSchema"
import { useFlashMessage } from "@/modules/context/FlashMessageProvider"

export const signupUseCase = async (data: any) => {
     const { setFlashMessage } = useFlashMessage()

     console.log(data)

     const parsedData = UserRegistrationSchema.safeParse(data)

     console.log("fsdfdsqfdfd", parsedData)

     if (!parsedData.success) {
          console.error(parsedData.error)
          setFlashMessage("error", `Invalid registration data: ${parsedData.error.issues.map((issue) => issue.message).join(", ")}`)
          return
     }

     const { email, password, firstname, lastname, username } = parsedData.data

     try {
          const user = await authRepository.signUp(email, password, firstname, lastname, username)
          return AuthEntity.fromSupabaseUser(user)
     } catch (error: any) {
          setFlashMessage("error", error.message)
          throw new Error((error as Error).message)
     }
}
