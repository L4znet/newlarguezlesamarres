interface AuthRepository {
     signUp(email: string, password: string, lastname: string, firstname: string, username: string): Promise<any>
     signIn(email: string, password: string): Promise<any>
     signOut(): Promise<void>
     getCurrentUser(): Promise<any>
}

export default AuthRepository
