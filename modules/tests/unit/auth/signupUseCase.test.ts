import { faker } from "@faker-js/faker"
import { UserRegistrationSchema } from "@/modules/domain/auth/schemas/UserRegistrationSchema"
import { signUp } from "@/modules/tests/config/hook"
import { mapMessage } from "@/modules/utils/messageMapper"

describe("Signup Use Case", () => {
     const mockShowTranslatedFlashMessage = jest.fn()

     require("dotenv").config({ path: ".env.test" })

     it("signup should create user", async () => {
          const password = faker.internet.password()
          const email = faker.internet.email().toLowerCase()
          const firstname = faker.person.firstName().toLowerCase()
          const lastname = faker.person.lastName().toLowerCase()
          const username = faker.internet.username().toLowerCase()
          const avatar_url = faker.image.avatar()

          const data = {
               password: password,
               confirmPassword: password,
               email: email,
               firstname: firstname,
               lastname: lastname,
               username: username,
               avatar_url: avatar_url,
          }

          const correctUser = {
               email: email,
               firstname: firstname,
               lastname: lastname,
               username: username,
               password: password,
               avatar_url: avatar_url,
          }

          const parsedData = UserRegistrationSchema.safeParse(data)

          const emailParsed = parsedData?.data?.email.toLowerCase() || ""
          const firstnameParsed = parsedData?.data?.firstname.toLowerCase()
          const lastnameParsed = parsedData?.data?.lastname.toLowerCase()
          const usernameParsed = parsedData?.data?.username.toLowerCase()

          const { user, error } = await signUp(emailParsed, password, firstnameParsed, lastnameParsed, usernameParsed)

          expect(user).not.toBeNull()
          expect(error).toBeNull()
          expect(parsedData.error).toBeUndefined()
          expect(parsedData.success).toBe(true)
          expect(parsedData.data).toEqual(correctUser)
          expect(user).not.toBeNull()
     })

     it("signup should throw error if email invalid", async () => {
          const data = {
               email: "invalid-email",
               password: faker.internet.password(),
               firstname: faker.person.firstName(),
               lastname: faker.person.lastName(),
               username: faker.internet.username(),
               avatar_url: faker.image.avatar(),
          }

          const parsedData = UserRegistrationSchema.safeParse(data)

          expect(parsedData.error).not.toBeUndefined()
          expect(parsedData.success).toBe(false)
          expect(parsedData.data).toBeUndefined()
          expect(parsedData.error?.errors[0].code).toBe("invalid_string")
     })

     it("signup should throw error if password too short", async () => {
          const data = {
               email: faker.internet.email(),
               password: "short",
               firstname: faker.person.firstName(),
               lastname: faker.person.lastName(),
               username: faker.internet.username(),
               avatar_url: faker.image.avatar(),
          }

          const parsedData = UserRegistrationSchema.safeParse(data)

          expect(parsedData.error).not.toBeUndefined()
          expect(parsedData.success).toBe(false)
          expect(parsedData.data).toBeUndefined()
          expect(parsedData.error?.errors[0].code).toBe("too_small")
     })
})
