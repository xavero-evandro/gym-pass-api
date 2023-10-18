import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUser } from '@/use-cases/authenticateUser'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { FastifyRequest, FastifyReply} from 'fastify'
import { z } from 'zod'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateSchema.parse(request.body)

    try {
        const userRepository = new PrismaUsersRepository()
        const authenticateUser = new AuthenticateUser(userRepository)
        await authenticateUser.execute({ email, password })
    } catch (error) {
        if (error instanceof InvalidCredentialsError){
            return reply.status(400).send({message: error.message})
        }

        throw error
    }

    return reply.status(200).send()

}