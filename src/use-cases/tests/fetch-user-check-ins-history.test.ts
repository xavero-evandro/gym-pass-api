import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import {  beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistory } from '../fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let fetchUserCheckInsHistory: FetchUserCheckInsHistory

describe('Fetch User check-ins history', async () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        fetchUserCheckInsHistory = new FetchUserCheckInsHistory(checkInsRepository)

        // await gymsRepository.create({
        //     id: 'gym-01',
        //     title: 'Gym Name',
        //     latitude: -30.0177984,
        //     longitude: -51.1899247,
        //     description: 'Gym Description',
        //     phone: '123456789',
        // })

    })

    it('should fetch user check-ins history', async () => {
        await checkInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-01',
            validated_at: new Date(),
        })

        await checkInsRepository.create({
            user_id: 'user-01',
            gym_id: 'gym-02',
            validated_at: new Date(),
        })

        const { checkIns } = await fetchUserCheckInsHistory.execute({
            userId: 'user-01',
            page: 1
        })

        expect(checkIns.length).toBe(2)
        expect(checkIns).toEqual([
            expect.objectContaining({
                user_id: 'user-01',
                gym_id: 'gym-01',
            }),
            expect.objectContaining({
                user_id: 'user-01',
                gym_id: 'gym-02',
            })
        ])
    })

    it('should fetch paginated user check-ins history', async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                user_id: 'user-01',
                gym_id: `gym-${i}`,
                validated_at: new Date(),
            })
        }

        const { checkIns } = await fetchUserCheckInsHistory.execute({
            userId: 'user-01',
            page: 2
        })

        expect(checkIns.length).toBe(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gym_id: 'gym-21' }),
            expect.objectContaining({ gym_id: 'gym-22' }),
        ])

    })

})