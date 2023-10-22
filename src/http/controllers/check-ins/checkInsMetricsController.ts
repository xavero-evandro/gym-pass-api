import { makeGetUserMetrics } from '@/use-cases/factories/make-get-user-metrics'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function checkInsMetrics(request:FastifyRequest, reply: FastifyReply){
    const checkInsMetrics = makeGetUserMetrics()

    const {checkInsCount} = await checkInsMetrics.execute({
        userId: request.user.sub,
    })

    return reply.status(200).send({
        checkInsCount
    })
}