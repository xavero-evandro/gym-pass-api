import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface SearchGymRequest {
    query: string,
    page: number,
}

interface SearchGymResponse {
    gym: Gym[]
}

export class SearchGym {
    constructor(private readonly gymsRepository: GymsRepository) {}

    async execute({
        query,
        page,
    }: SearchGymRequest): Promise<SearchGymResponse> {
        const gym = await this.gymsRepository.searchMany(query,page)

        return {
            gym
        }
    }
}