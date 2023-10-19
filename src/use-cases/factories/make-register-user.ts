import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUser } from '../register-user'

export function makeRegisterUser(): RegisterUser {
    const userRepository = new PrismaUsersRepository()
    const registerUser = new RegisterUser(userRepository)
    return registerUser
}