import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckIn } from '../validate-check-in'

export function makeValidateCheckIn() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new ValidateCheckIn(checkInsRepository)
    return useCase
}