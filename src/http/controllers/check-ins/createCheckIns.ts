import { makeCheckIn } from '@/use-cases/factories/make-check-in'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createCheckIn(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    })

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.number().refine((value) => Math.abs(value) <= 180),
    })

    const { gymId } = createCheckInParamsSchema.parse(request.params)
    const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

    const createCheckIn = makeCheckIn()

    const { checkIn } = await createCheckIn.execute({
        userId: request.user.sub,
        gymId,
        userLatitude: latitude,
        userLongitude: longitude,

    })

    await reply.status(201).send()
}