import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUser } from '../check-in-user'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeCheckIn() {
    const checkInRepository = new PrismaCheckInsRepository()
    const gymRepository = new PrismaGymsRepository()
    const useCase = new CheckInUser(checkInRepository,gymRepository)
    return useCase
}