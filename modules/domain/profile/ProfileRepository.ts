interface ProfileRepository {
     changePassword(oldPassword: string, newPassword: string): Promise<any>
     getProfileUseCase(): Promise<any>
     updateProfile(lastname: string, firstname: string, username: string): Promise<any>
     updateAvatar(avatar_url: string): Promise<any>
}

export default ProfileRepository
