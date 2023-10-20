import { Gym, Prisma } from '@prisma/client'
import { FetchNearbyGymsParams, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository{

    async findById(id: string){
        const gym = await prisma.gym.findUnique({
            where: {
                id
            }
        })
        if (!gym) return null
        return gym
    }

    async create(gym: Prisma.GymCreateInput){
        const createdGym = await prisma.gym.create({
            data: gym
        })
        return createdGym
    }

    async searchMany(query: string, page: number){
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            take: 20,
            skip: (page - 1) * 20
        })
        return gyms
    }

    async findManyNearby(params: FetchNearbyGymsParams){
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE (
                    6371 *
                    acos(
                        cos(radians(${params.latitude})) *
                        cos(radians(latitude)) *
                        cos(
                            radians(longitude) -
                            radians(${params.longitude})
                        ) +
                        sin(radians(${params.latitude})) *
                        sin(radians(latitude))
                    )
                ) <= 10
        `

        return gyms
    }
}