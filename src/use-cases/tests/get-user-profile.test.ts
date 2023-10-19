import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfile } from '../get-user-profile'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

let userRepository: InMemoryUsersRepository
let getUserProfile: GetUserProfile

describe('Get User Profile', () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        getUserProfile = new GetUserProfile(userRepository)
    })


    it('should be able to get user profile', async () => {
        const createdUser = await userRepository.create({
            name: 'John Doe',
            email: 'teste@teste.com',
            password_hash: await hash('123456', 6)
        })

        const {user} = await getUserProfile.execute({
            userId: createdUser.id
        })

        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('John Doe')
    })

    it('should be able to get user profile with wrong id', async () => {
        await expect(async ()=> await getUserProfile.execute({
            userId: 'wrong-id'
        })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

})