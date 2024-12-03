export default class EmailUpdateEntity {
     constructor(public email: { email: string | undefined }) {}

     static fromSupabaseUser(email: { email: string | undefined }): EmailUpdateEntity {
          return new EmailUpdateEntity(email)
     }
}
