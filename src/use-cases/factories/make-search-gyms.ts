import { SearchGym } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGyms() {
    const gymsRepository = new PrismaGymsRepository()
    const useCase = new SearchGym(gymsRepository)
    return useCase
}