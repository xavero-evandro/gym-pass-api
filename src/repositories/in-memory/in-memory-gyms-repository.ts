import { Gym, Prisma } from '@prisma/client'
import { FetchNearbyGymsParams, GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findManyNearby(params: FetchNearbyGymsParams){
        return this.items.filter(gym => {
            const distance = getDistanceBetweenCoordinates(
                {latitude: params.latitude, longitude: params.longitude},
                {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
            )

            return distance < 10
        })
    }

    async searchMany(query: string, page: number){
        const gyms = this.items.filter(gym => gym.title.includes(query))
            .slice((page - 1) * 20, page * 20)
        return gyms
    }

    async findById(id: string){
        const gym = this.items.find(gym => gym.id === id)

        if (!gym) {
            return null
        }

        return gym
    }

    async create(data: Prisma.GymCreateInput){
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            latitude: new Decimal(data.latitude.toString()),
            longitude: new Decimal(data.longitude.toString()),
            description: data.description ?? null,
            phone: data.phone ?? null,
            created_at: new Date(),
        }

        this.items.push(gym)

        return gym
    }


}