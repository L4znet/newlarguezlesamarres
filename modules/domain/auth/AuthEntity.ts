export default class AuthEntity {
     constructor(
          public id: string,
          public email: string,
          public firstname: string,
          public lastname: string
     ) {}

     static fromSupabaseUser(user: any): AuthEntity {
          return new AuthEntity(user.id, user.email, user.firstname, user.lastname)
     }
}
