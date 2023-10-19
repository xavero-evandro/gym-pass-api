import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUser } from '@/use-cases/factories/make-authenticate-user'
import { FastifyRequest, FastifyReply} from 'fastify'
import { z } from 'zod'

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateSchema.parse(request.body)

    try {
        const authenticateUser = makeAuthenticateUser()
        await authenticateUser.execute({ email, password })
    } catch (error) {
        if (error instanceof InvalidCredentialsError){
            return reply.status(400).send({message: error.message})
        }

        throw error
    }

    return reply.status(200).send()

}