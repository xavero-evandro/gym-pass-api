import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGym } from '../create-gym'


let gymRepository: InMemoryGymsRepository
let createGym: CreateGym

describe('Create Gym', () => {
    beforeEach(() => {
        gymRepository = new InMemoryGymsRepository()
        createGym = new CreateGym(gymRepository)
    })

    it('should be able to create a new gym', async () => {
        const { gym } = await createGym.execute({
            title: 'Gym Name',
            description: 'Gym Description',
            phone: '123456789',
            latitude: -30.0177984,
            longitude: -51.1899247
        })

        expect(gym.id).toEqual(expect.any(String))
    })


})