export default class ProfileEntity {
     constructor(
          public readonly email: string | undefined,
          public readonly firstname: string,
          public readonly lastname: string,
          public readonly username: string,
          public readonly avatar: string | undefined
     ) {}

     static fromSupabaseUser(profile: Profile): ProfileEntity {
          return new ProfileEntity(profile.email, profile.firstname, profile.lastname, profile.username, profile.avatar_url)
     }
}
