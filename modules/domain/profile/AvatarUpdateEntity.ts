export default class AvatarUpdateEntity {
     constructor(public avatar: { avatar: string | undefined }) {}

     static fromSupabaseUser(avatar: { avatar: string | undefined }): AvatarUpdateEntity {
          return new AvatarUpdateEntity(avatar)
     }
}
