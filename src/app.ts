import fastify from 'fastify'
import { usersRoutes } from './http/controllers/users/userRoutes'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { gymsRoutes } from './http/controllers/gyms/gymsRoutes'
import { checkInsRoutes } from './http/controllers/check-ins/checkInsRoutes'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET
})

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInsRoutes)

app.setErrorHandler((error, _, reply) => {
    if ( error instanceof ZodError){
        return reply.status(400).send({message: 'Validation failed', issues: error.format()})
    }

    if (env.NODE_ENV !== 'production'){
        console.error(error)
    } else {
        // should log error to a service like DataDog or NewRelic
    }

    return reply.status(500).send({message: 'Internal server error'})
})