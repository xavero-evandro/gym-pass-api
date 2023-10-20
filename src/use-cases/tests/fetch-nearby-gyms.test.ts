import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGyms } from '../fetch-nearby-gyms'


let gymRepository: InMemoryGymsRepository
let fetchNearbyGyms: FetchNearbyGyms

describe('FetchNearbyGyms', () => {
    beforeEach(() => {
        gymRepository = new InMemoryGymsRepository()
        fetchNearbyGyms = new FetchNearbyGyms(gymRepository)
    })

    it('should return nearby gyms', async () => {
        await gymRepository.create({
            title: 'Gym Near',
            description: 'Gym Description',
            phone: '123456789',
            latitude: -30.0177984,
            longitude: -51.1899247
        })

        await gymRepository.create({
            title: 'Gym Far',
            description: 'Gym Description',
            phone: '123456789',
            latitude: -29.8524701,
            longitude: -51.1363234
        })

        const { gyms } = await fetchNearbyGyms.execute({
            userLatitude: -30.0177984,
            userLongitude: -51.1899247
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([expect.objectContaining({title: 'Gym Near'})])


    })




})