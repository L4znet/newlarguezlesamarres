export default class AuthEntity {
     constructor(
          public email: string,
          public firstname: string,
          public lastname: string,
          public username: string
     ) {}

     static fromSupabaseUser(user: any): AuthEntity {
          return new AuthEntity(user.email, user.firstname, user.lastname, user.username)
     }
}
