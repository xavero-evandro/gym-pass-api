import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUser } from './authenticateUser'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate User', () => {

    it('should be able to authenticate', async () => {
        const userRepository = new InMemoryUsersRepository()
        const authenticate = new AuthenticateUser(userRepository)

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
        const userRepository = new InMemoryUsersRepository()
        const authenticate = new AuthenticateUser(userRepository)

        await expect(async ()=> await authenticate.execute({
            email: 'teste@teste.com',
            password: '123456'
        })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should be able to authenticate with wrong password', async () => {
        const userRepository = new InMemoryUsersRepository()
        const authenticate = new AuthenticateUser(userRepository)

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