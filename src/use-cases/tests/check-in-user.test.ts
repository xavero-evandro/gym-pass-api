import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUser } from '../check-in-user'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { MaxCheckInsError } from '../errors/max-check-ins-error'
import { MaxDistanceError } from '../errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUser: CheckInUser

describe('Check in user', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        checkInUser = new CheckInUser(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'Gym Name',
            latitude: -30.0177984,
            longitude: -51.1899247,
            description: 'Gym Description',
            phone: '123456789',
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should create a check in', async () => {
        const { checkIn } = await checkInUser.execute({
            userId: 'user-id',
            gymId: 'gym-01',
            userLatitude: -30.0177984,
            userLongitude: -51.1899247
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2023,0,1,10,0,0))

        await checkInUser.execute({
            userId: 'user-id',
            gymId: 'gym-01',
            userLatitude: -30.0177984,
            userLongitude: -51.1899247
        })

        await expect(checkInUser.execute({
            userId: 'user-id',
            gymId: 'gym-01',
            userLatitude: -30.0177984,
            userLongitude: -51.1899247
        })).rejects.toBeInstanceOf(MaxCheckInsError)
    })


    it('should be able to check in twice in different days', async () => {
        vi.setSystemTime(new Date(2023,0,1,10,0,0))

        await checkInUser.execute({
            userId: 'user-id',
            gymId: 'gym-01',
            userLatitude: -30.0177984,
            userLongitude: -51.1899247
        })

        vi.setSystemTime(new Date(2023,0,2,10,0,0))

        await expect(checkInUser.execute({
            userId: 'user-id',
            gymId: 'gym-01',
            userLatitude: -30.0177984,
            userLongitude: -51.1899247
        })).resolves.toBeTruthy()
    })

    it('should not be able to check in when far away from a gym', async () => {
        await expect(() => checkInUser.execute({
            userId: 'user-id',
            gymId: 'gym-01',
            userLatitude: -29.999804,
            userLongitude: -51.149431
        })
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })


})