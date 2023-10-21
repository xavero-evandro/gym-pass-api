import { makeFetchUserCheckInsHistory } from '@/use-cases/factories/make-fetch-user-check-ins-history'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function checkInsHistory(request: FastifyRequest, reply:FastifyReply){
    const checkInsHistoryQuerySchema = z.object({
        page: z.coerce.number().min(1).default(1),
    })

    const {page} = checkInsHistoryQuerySchema.parse(request.query)

    const checkInsHistory = makeFetchUserCheckInsHistory()

    const {checkIns } = await checkInsHistory.execute({
        userId: request.user.sub,
        page,
    })

    return reply.status(200).send({
        checkIns
    })

}