import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ValidateCheckIn } from '../validate-check-in'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { LateCheckInValidationError } from '../errors/late-check-in-validation'

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckIn: ValidateCheckIn

describe('Validate check-in', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository()
        validateCheckIn = new ValidateCheckIn(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should validate a check-in', async () => {
        const checkIn = await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-id',
        })

        const { checkIn: validatedCheckIn } = await validateCheckIn.execute({
            checkInId: checkIn.id
        })

        expect(validatedCheckIn.validated_at).not.toBeNull()
        expect(validatedCheckIn.validated_at).toBeInstanceOf(Date)
        expect(checkInsRepository.items[0].validated_at).not.toBeNull()
    })

    it('should throw an error if check-in does not exist', async () => {
        await expect(validateCheckIn.execute({
            checkInId: 'invalid-check-in-id'
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date('2023-01-01 12:00:00'))

        const checkIn = await checkInsRepository.create({
            user_id: 'user-id',
            gym_id: 'gym-id',
        })

        const twentyOneMinutesLater = 21 * 60 * 1000

        vi.advanceTimersByTime(twentyOneMinutesLater)

        await expect(() => validateCheckIn.execute({
            checkInId: checkIn.id
        })).rejects.toBeInstanceOf(LateCheckInValidationError)

    })

})