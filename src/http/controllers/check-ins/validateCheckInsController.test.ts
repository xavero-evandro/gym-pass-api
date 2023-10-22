import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate CheckIn Controller', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to validate a check-in', async () => {
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

        const checkIn = await prisma.checkIn.create({
            data: {
                gym_id: gym.id,
                user_id: user.id,
            }
        })

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.status).toBe(204)

        const updatedCheckIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id,
            }
        })

        expect(updatedCheckIn.validated_at).toEqual(expect.any(Date))
    })

})