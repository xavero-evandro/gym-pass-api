import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetrics } from '../get-user-metrics'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

let getUserMetrics: GetUserMetrics
let checkInsRepository: InMemoryCheckInsRepository

describe('Get user metrics', async () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        getUserMetrics = new GetUserMetrics(checkInsRepository)
    })

    it('should return the number of check-ins for a given user', async () => {
        const userId = 'user-id'
        await checkInsRepository.create({
            user_id: userId,
            gym_id: 'gym-id',
        })
        await checkInsRepository.create({
            user_id: userId,
            gym_id: 'gym-id',
        })
        await checkInsRepository.create({
            user_id: userId,
            gym_id: 'gym-id',
        })

        const { checkInsCount } = await getUserMetrics.execute({ userId })

        expect(checkInsCount).toBe(3)
    })

})