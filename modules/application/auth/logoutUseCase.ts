import authRepository from "../../infrastructure/auth/AuthRepositorySupabase"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const logoutUseCase = async () => {
     try {
          await authRepository.signOut()
     } catch (error: any) {
          throw new Error((error as Error).message)
     }
}
