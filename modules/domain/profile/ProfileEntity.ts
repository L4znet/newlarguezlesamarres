export default class ProfileEntity {
     constructor(public profile: { profile: Profile }) {}

     static fromSupabaseUser(profile: { profile: Profile }): ProfileEntity {
          return new ProfileEntity(profile)
     }
}
