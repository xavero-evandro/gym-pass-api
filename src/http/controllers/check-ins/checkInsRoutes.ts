import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createCheckIn } from './createCheckInsController'
import { validateCheckIn } from './validateCheckInsController'
import { checkInsHistory } from './checkInsHistoryController'
import { checkInsMetrics } from './checkInsMetricsController'

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt)

    app.get('/check-ins/history', checkInsHistory)
    app.get('/check-ins/metrics', checkInsMetrics)
    app.post('/gyms/:gymId/check-ins', createCheckIn)
    app.patch('/check-ins/:checkInId/validate', validateCheckIn)
}