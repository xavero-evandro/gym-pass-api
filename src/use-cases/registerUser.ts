import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUserRequest {
    name: string
    email: string
    password: string
}

interface RegisterUserResponse {
    user: User
}

export class RegisterUser {
    constructor(private userRepository: UsersRepository) {}

    async execute({ name, email, password }: RegisterUserRequest): Promise<RegisterUserResponse> {
        const userWithEmailAlreadyExists = await this.userRepository.findUniqueEmail(email)

        if (userWithEmailAlreadyExists) {
            throw new UserAlreadyExistsError()
        }

        const passwordHash = await hash(password, 6)

        const user = await this.userRepository.create({
            name,
            email,
            password_hash: passwordHash
        })

        return {
            user
        }
    }
}


