import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Profile Controller', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to get the user profile', async () => {
        const { token } = await createAndAuthenticateUser(app)

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