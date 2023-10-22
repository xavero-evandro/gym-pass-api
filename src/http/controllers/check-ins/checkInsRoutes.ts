import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { FastifyInstance } from 'fastify'
import { createCheckIn } from './createCheckInsController'
import { validateCheckIn } from './validateCheckInsController'
import { checkInsHistory } from './checkInsHistoryController'
import { checkInsMetrics } from './checkInsMetricsController'
import { verifyUserRole } from '@/http/middlewares/reviryUserRole'

export async function checkInsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt)

    app.get('/check-ins/history', checkInsHistory)
    app.get('/check-ins/metrics', checkInsMetrics)
    app.post('/gyms/:gymId/check-ins', createCheckIn)
    app.patch('/check-ins/:checkInId/validate', {onRequest: [verifyUserRole('ADMIN')]},validateCheckIn)
}