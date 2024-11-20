// signupUseCase.test.ts

import AuthRepositorySupabase from "@/modules/infrastructure/auth/AuthRepositorySupabase"
import { signupUseCase } from "@/modules/application/auth/signupUseCase"

jest.mock("@/modules/infrastructure/auth/AuthRepositorySupabase")

describe("Signup Use Case", () => {
     const mockShowTranslatedFlashMessage = jest.fn()

     beforeEach(() => {
          jest.clearAllMocks()
     })

     it("should sign up successfully with valid data", async () => {
          const mockUser = { email: "test@example.com", id: "user_123" }
          ;(AuthRepositorySupabase.signUp as jest.Mock).mockResolvedValue(mockUser)

          const result = await signupUseCase(
               {
                    email: "test@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                    firstname: "John",
                    lastname: "Doe",
                    username: "johndoe",
               },
               mockShowTranslatedFlashMessage
          )

          // Assert
          expect(result).toEqual(mockUser)
          expect(AuthRepositorySupabase.signUp).toHaveBeenCalledWith("test@example.com", "password123", "Doe", "John", "johndoe")
          expect(mockShowTranslatedFlashMessage).toHaveBeenCalledWith("success", {
               title: "flash_title_success",
               description: "User successfully registered",
          })
     })

     it("should throw validation errors for invalid data", async () => {
          // Arrange
          const invalidData = {
               email: "invalid-email",
               password: "pass",
               confirmPassword: "different",
               firstname: "",
               lastname: "",
               username: "",
          }

          await signupUseCase(invalidData, mockShowTranslatedFlashMessage)

          expect(mockShowTranslatedFlashMessage).toHaveBeenCalledWith("danger", {
               title: "flash_title_danger",
               description: expect.any(String),
          })
     })

     it("should show error if email already exists", async () => {
          ;(AuthRepositorySupabase.signUp as jest.Mock).mockRejectedValue(new Error("User already exists"))
          await expect(
               signupUseCase(
                    {
                         email: "test@example.com",
                         password: "password123",
                         confirmPassword: "password123",
                         firstname: "John",
                         lastname: "Doe",
                         username: "johndoe",
                    },
                    mockShowTranslatedFlashMessage
               )
          ).rejects.toThrow("User already exists")

          expect(mockShowTranslatedFlashMessage).toHaveBeenCalledWith("danger", {
               title: "flash_title_danger",
               description: "User already exists",
          })
     })
})
