import { faker } from "@faker-js/faker"
import { UserRegistrationSchema } from "@/modules/domain/auth/schemas/UserRegistrationSchema"
import { signIn, signUp } from "@/modules/tests/config/hook"

describe("Login Use Case", () => {
     const mockShowTranslatedFlashMessage = jest.fn()

     require("dotenv").config({ path: ".env.test" })

     it("login should login user", async () => {
          const password = faker.internet.password()
          const email = faker.internet.email().toLowerCase()
          const firstname = faker.person.firstName().toLowerCase()
          const lastname = faker.person.lastName().toLowerCase()
          const username = faker.internet.username().toLowerCase()
          const avatar_url = faker.image.avatar()

          const { user: userCreated, error: signUpError } = await signUp(email, password, firstname, lastname, username, avatar_url)

          const { user, error } = await signIn(email, password)
          expect(user).not.toBeNull()
          expect(error).toBeNull()
          expect(signUpError).toBeNull()
          expect(user.session?.user?.email).toBe(email)
          expect(user.session?.user?.role).toBe("authenticated")
          expect(user.session?.access_token).toBeDefined()
     })

     it("login should failed if email used while signup aren't similar", async () => {
          const password = faker.internet.password()
          const email = faker.person.firstName().toLowerCase() + "." + faker.person.lastName().toLowerCase() + "@gmail.com"
          const firstname = faker.person.firstName().toLowerCase()
          const lastname = faker.person.lastName().toLowerCase()
          const username = faker.internet.username().toLowerCase()
          const avatar_url = faker.image.avatar()
          const badEmail = faker.internet.email().toLowerCase()

          const { user: userCreated, error: signUpError } = await signUp(email, password, firstname, lastname, username, avatar_url)

          const { user, error } = await signIn(badEmail, password)
          expect(user).toEqual({ session: null, user: null })
          expect(error).toBeDefined()
          expect(signUpError).toBeNull()
     })
})
