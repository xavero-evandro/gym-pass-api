import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUser } from '../authenticate-user'

export function makeAuthenticateUser() {
    const userRepository = new PrismaUsersRepository()
    const authenticateUser = new AuthenticateUser(userRepository)
    return authenticateUser
}