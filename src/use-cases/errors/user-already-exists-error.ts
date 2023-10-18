export class UserAlreadyExistsError extends Error {
    constructor() {
        super('User with email already exists')
    }
}