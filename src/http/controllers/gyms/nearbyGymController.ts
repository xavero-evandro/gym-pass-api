import { makeFetchNearbyGyms } from '@/use-cases/factories/make-fetch-nearby-gyms'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function nearbyGyms(request: FastifyRequest, reply: FastifyReply){
    const nearbyGymsQuerySchema = z.object({
        latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
        longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
    })

    const {
        latitude,
        longitude
    } = nearbyGymsQuerySchema.parse(request.query)

    const nearbyGyms = makeFetchNearbyGyms()

    const { gyms } = await nearbyGyms.execute({
        userLatitude: latitude,
        userLongitude: longitude,
    })

    return reply.status(200).send({
        gyms
    })

}