import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUser } from '../authenticate-user'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let userRepository: InMemoryUsersRepository
let authenticate: AuthenticateUser

describe('Authenticate User', () => {

    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        authenticate = new AuthenticateUser(userRepository)
    })


    it('should be able to authenticate', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'teste@teste.com',
            password_hash: await hash('123456', 6)
        })

        const {user} = await authenticate.execute({
            email: 'teste@teste.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should be able to authenticate with wrong email', async () => {
        await expect(async ()=> await authenticate.execute({
            email: 'teste@teste.com',
            password: '123456'
        })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should be able to authenticate with wrong password', async () => {
        await userRepository.create({
            name: 'John Doe',
            email: 'teste@teste.com',
            password_hash: await hash('123456', 6)
        })

        await expect(async ()=> await authenticate.execute({
            email: 'teste@teste.com',
            password: '123123'
        })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

})