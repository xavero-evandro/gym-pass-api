export class MaxCheckInsError extends Error {
    constructor() {
        super('User already checked in today')
    }
}