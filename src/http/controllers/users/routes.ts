import { FastifyInstance } from 'fastify'
import { register } from './registerController'
import { authenticate } from './authenticateController'
import { profile } from './profileController'
import { verifyJwt } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    app.get('/me', { onRequest: [verifyJwt] } ,profile)

}