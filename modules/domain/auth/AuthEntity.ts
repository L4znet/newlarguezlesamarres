import { User } from "@supabase/auth-js"

export default class AuthEntity {
     constructor(
          public user: {
               user: User
          }
     ) {}

     static fromSupabaseUser(user: { user: User }): AuthEntity {
          return new AuthEntity(user)
     }
}
