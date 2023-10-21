import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Profile Controller', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get the user profile', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'test@test.com',
                password: '123456',
            })

        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: 'test@test.com',
                password: '123456',
            })

        const {token} = authResponse.body

        const profileResponse = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`)
            .send()


        expect(profileResponse.status).toBe(200)
        expect(profileResponse.body.user).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                name: 'John Doe',
                email: 'test@test.com',
                created_at: expect.any(String),
            })
        )
    })

})