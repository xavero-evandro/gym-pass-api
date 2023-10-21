import { makeSearchGyms } from '@/use-cases/factories/make-search-gyms'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function searchGym(request: FastifyRequest, reply: FastifyReply){
    const searchGymQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1),
    })

    const {
        query,
        page
    } = searchGymQuerySchema.parse(request.query)


    const searchGyms = makeSearchGyms()

    const { gym: gyms } = await searchGyms.execute({
        query,
        page,
    })

    return reply.status(200).send({
        gyms
    })

}