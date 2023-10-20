import { Gym, Prisma } from '@prisma/client'

export interface FetchNearbyGymsParams {
    latitude: number
    longitude: number
}

export interface GymsRepository {
    findById(id: string): Promise<Gym | null>
    create(gym: Prisma.GymCreateInput): Promise<Gym>
    searchMany(query: string, page: number): Promise<Gym[]>
    findManyNearby(params: FetchNearbyGymsParams): Promise<Gym[]>
}