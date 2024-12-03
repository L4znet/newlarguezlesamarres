export default class ProfileEntity {
     constructor(public profile: Profile) {}

     static fromSupabaseUser(profile: Profile): ProfileEntity {
          return new ProfileEntity(profile)
     }
}
