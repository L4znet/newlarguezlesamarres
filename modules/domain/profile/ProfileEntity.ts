import { User } from "@supabase/auth-js"

export default class ProfileEntity {
     constructor(public user: { user: User }) {}

     static fromSupabaseUser(user: { user: User }): ProfileEntity {
          return new ProfileEntity(user)
     }
}
