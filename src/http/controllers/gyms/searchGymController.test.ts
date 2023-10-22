import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms Controller', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to search gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, 'ADMIN')

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym JS',
                description: 'Gym JS description',
                phone: '123456789',
                latitude: -23.123456,
                longitude: -46.123456,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Gym TS',
                description: 'Gym TS description',
                phone: '123456789',
                latitude: -23.223456,
                longitude: -46.223456,
            })

        const response = await request(app.server)
            .get('/gyms/search')
            .set('Authorization', `Bearer ${token}`)
            .query({
                query: 'Gym JS'
            })

        expect(response.status).toBe(200)
        expect(response.body.gyms.length).toBe(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Gym JS'
            })
        ])

    })

})