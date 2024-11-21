import { signupUseCase } from "@/modules/application/auth/signupUseCase"
import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

// Load environment variables from .env.test file
dotenv.config({ path: ".env.test" })

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_TEST_URL || ""
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_TEST_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

describe("Signup Use Case", () => {
     const mockShowTranslatedFlashMessage = jest.fn()

     beforeEach(() => {
          jest.clearAllMocks()
     })

     it("should sign up successfully with valid data", async () => {
          const result = await signupUseCase(
               {
                    email: "test.integration@example.com",
                    password: "password123",
                    confirmPassword: "password123",
                    firstname: "John",
                    lastname: "Doe",
                    username: "johndoe",
                    avatar_url: "https://example.com/avatar.jpg",
               },
               mockShowTranslatedFlashMessage
          )

          expect(result).toHaveProperty("email", "test.integration@example.com")
          expect(mockShowTranslatedFlashMessage).toHaveBeenCalledWith("success", {
               title: "flash_title_success",
               description: "User successfully registered",
          })
     })

     it("should throw validation errors for invalid data", async () => {
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
          try {
               await signupUseCase(
                    {
                         email: "test.integration@example.com",
                         password: "password123",
                         confirmPassword: "password123",
                         firstname: "John",
                         lastname: "Doe",
                         username: "johndoe",
                    },
                    mockShowTranslatedFlashMessage
               )
          } catch (error: any) {
               expect(mockShowTranslatedFlashMessage).toHaveBeenCalledWith("danger", {
                    title: "flash_title_danger",
                    description: "User already exists",
               })
          }
     })
})
