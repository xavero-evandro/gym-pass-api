import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGym } from '../search-gyms'


let gymRepository: InMemoryGymsRepository
let searchGym: SearchGym

describe('Search Gym', () => {
    beforeEach(() => {
        gymRepository = new InMemoryGymsRepository()
        searchGym = new SearchGym(gymRepository)
    })

    it('should be able to search a gym', async () => {
        await gymRepository.create({
            title: 'Gym JS',
            description: 'Gym Description',
            phone: '123456789',
            latitude: -30.0177984,
            longitude: -51.1899247
        })

        await gymRepository.create({
            title: 'Gym TS',
            description: 'Gym Description',
            phone: '123456789',
            latitude: -30.0177984,
            longitude: -51.1899247
        })

        const { gym } = await searchGym.execute({
            query: 'Gym JS',
            page: 1,
        })

        const { gym: gym2 } = await searchGym.execute({
            query: 'Gym TS',
            page: 1,
        })

        expect(gym).toHaveLength(1)
        expect(gym2).toHaveLength(1)
        expect(gym).toEqual([
            expect.objectContaining({
                title: 'Gym JS',
            })
        ])
        expect(gym2).toEqual([
            expect.objectContaining({
                title: 'Gym TS',
            })
        ])

    })

    it('should be able to search a gym with pagination', async () => {
        for (let i = 1; i <= 22 ; i++) {
            await gymRepository.create({
                title: `Gym ${i}`,
                description: 'Gym Description',
                phone: '123456789',
                latitude: -30.0177984,
                longitude: -51.1899247
            })
        }

        const { gym } = await searchGym.execute({
            query: 'Gym',
            page: 2,
        })

        expect(gym).toHaveLength(2)
        expect(gym).toEqual([
            expect.objectContaining({
                title: 'Gym 21',
            }),
            expect.objectContaining({
                title: 'Gym 22',
            }),
        ])
    })


})