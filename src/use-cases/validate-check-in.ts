import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation'

interface ValidateCheckInRequest {
    checkInId: string
}

interface ValidateCheckInResponse {
    checkIn: CheckIn
}

export class ValidateCheckIn {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        checkInId
    }: ValidateCheckInRequest): Promise<ValidateCheckInResponse>{
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResourceNotFoundError()
        }

        const diffInMinutesFromCreation = dayjs(new Date()).diff(checkIn.created_at, 'minute')

        if (diffInMinutesFromCreation > 20) {
            throw new LateCheckInValidationError()
        }

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return {
            checkIn
        }

    }

}