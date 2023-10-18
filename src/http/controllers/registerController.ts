import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { RegisterUser } from '@/use-cases/registerUser'
import { FastifyRequest, FastifyReply} from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerSchema = z.object({
        name: z.string().min(2).max(100),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerSchema.parse(request.body)

    try {
        const userRepository = new PrismaUsersRepository()
        const registerUser = new RegisterUser(userRepository)
        await registerUser.execute({ name, email, password })
    } catch (error) {
        if (error instanceof UserAlreadyExistsError){
            return reply.status(409).send({message: error.message})
        }

        throw error
    }

    return reply.status(201).send()

}