import { GymAlreadyExistsError } from '@/use-cases/errors/gym-already-exists-error'
import { makeCreateGym } from '@/use-cases/factories/make-create-gym'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createGym(request: FastifyRequest, reply: FastifyReply){
    const createGymBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
    })

    const {
        title,
        description,
        latitude,
        longitude,
        phone
    } = createGymBodySchema.parse(request.body)


    try {
        const createGym  = makeCreateGym()

        await createGym.execute({
            title,
            description,
            phone,
            latitude,
            longitude,
        })

    } catch (err) {
        if (err instanceof GymAlreadyExistsError) {
            return reply.status(409).send({
                message: err.message,
            })
        }
        throw err
    }

    return reply.status(201).send()

}