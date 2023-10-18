import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUserRequest {
    email: string
    password: string
}

interface AuthenticateUserResponse {
    user: User
}


export class AuthenticateUser {
    constructor(private readonly userRepository: UsersRepository) {}

    async execute ({email, password}: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
        const user = await this.userRepository.findByEmail(email)

        if (!user){
            throw new InvalidCredentialsError()
        }

        const hasPasswordMatch = await compare(password, user.password_hash)

        if (!hasPasswordMatch){
            throw new InvalidCredentialsError()
        }

        return {
            user
        }
    }
}