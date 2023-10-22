import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym Controller', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, 'ADMIN')

        const gymResponse = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym test',
                description: 'Gym test description',
                phone: '123456789',
                latitude: -23.123456,
                longitude: -46.123456,
            })

        expect(gymResponse.status).toBe(201)
    })

})