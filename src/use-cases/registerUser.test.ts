import { expect, describe, it } from 'vitest'
import { RegisterUser } from './registerUser'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register User', () => {

    it('should be able to register a new user', async () => {
        const userRepository = new InMemoryUsersRepository()
        const registerUser = new RegisterUser(userRepository)

        const {user} = await registerUser.execute({
            name: 'John Doe',
            email: 'teste@testeeee.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password', async () => {
        const userRepository = new InMemoryUsersRepository()
        const registerUser = new RegisterUser(userRepository)

        const {user} = await registerUser.execute({
            name: 'John Doe',
            email: 'example@test.com',
            password: '123456'
        })
        const isPasswordHashed = await compare('123456', user.password_hash)
        expect(isPasswordHashed).toBe(true)
    })

    it('should not be able to register a user with an email that is already in use', async () => {
        const userRepository = new InMemoryUsersRepository()
        const registerUser = new RegisterUser(userRepository)

        const email = 'teste@teste.com'

        await registerUser.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })

        await expect(registerUser.execute({
            name: 'John Doe',
            email,
            password: '123456'
        })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)

    })

})