import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('CheckIns History Controller', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to fetch all check- ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const user = await prisma.user.findFirstOrThrow()

        const gym = await prisma.gym.create({
            data: {
                title: 'Gym',
                description: 'Gym Description',
                phone: '123456789',
                latitude: -23.123456,
                longitude: -46.123456,
            }
        })

        await prisma.checkIn.createMany({
            data: [
                {
                    gym_id: gym.id,
                    user_id: user.id,
                },
                {
                    gym_id: gym.id,
                    user_id: user.id,
                }
            ]
        })

        const response = await request(app.server)
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.status).toBe(200)
        expect(response.body.checkIns).toHaveLength(2)
        expect(response.body.checkIns).toEqual(
            [
                expect.objectContaining({
                    id: expect.any(String),
                    gym_id: gym.id,
                    user_id: user.id,
                }),
                expect.objectContaining({
                    id: expect.any(String),
                    gym_id: gym.id,
                    user_id: user.id,
                })
            ]
        )
    })

})