import { FetchNearbyGyms } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearbyGyms() {
    const gymsRepository = new PrismaGymsRepository()
    const useCase = new FetchNearbyGyms(gymsRepository)
    return useCase
}