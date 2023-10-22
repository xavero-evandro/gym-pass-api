import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verifyJwt'
import { nearbyGyms } from './nearbyGymController'
import { searchGym } from './searchGymController'
import { createGym } from './createGymController'
import { verifyUserRole } from '@/http/middlewares/reviryUserRole'

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt)

    app.get('/gyms/search', searchGym)
    app.get('/gyms/nearby', nearbyGyms)

    app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] },createGym)

}