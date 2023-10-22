import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('FetchNearbyGyms', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should return nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Near',
                description: 'Gym Description',
                phone: '123456789',
                latitude: -30.0177984,
                longitude: -51.1899247
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym Far',
                description: 'Gym Description',
                phone: '123456789',
                latitude: -29.8524701,
                longitude: -51.1363234
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .set('Authorization', `Bearer ${token}`)
            .query({
                latitude: -30.0177984,
                longitude: -51.1899247
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.gyms.length).toBe(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Gym Near'
            })
        ])
    })




})