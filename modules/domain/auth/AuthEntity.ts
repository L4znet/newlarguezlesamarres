export default class AuthEntity {
     constructor(public userId: User) {}

     static fromSupabaseUser(userId: User): AuthEntity {
          return new AuthEntity(userId)
     }
}
