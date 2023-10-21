import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { nearbyGyms } from './nearbyGymController'
import { searchGym } from './searchGymController'
import { createGym } from './createGymController'

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt)

    app.get('/gyms/search', searchGym)
    app.get('/gyms/nearby', nearbyGyms)

    app.post('/gyms', createGym)

}