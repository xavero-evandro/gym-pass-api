import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxCheckInsError } from './errors/max-check-ins-error'


interface CheckInUserRequest {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUserResponse {
    checkIn: CheckIn
}


export class CheckInUser {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) {}

    async execute({
        userId,
        gymId,
        userLatitude,
        userLongitude
    }: CheckInUserRequest): Promise<CheckInUserResponse> {
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            { latitude: userLatitude, longitude: userLongitude },
            { latitude : gym.latitude.toNumber(), longitude: gym.longitude.toNumber() },
        )

        const MAX_DISTANCE_KM = 0.1

        if (distance > MAX_DISTANCE_KM) {
            throw new MaxDistanceError()
        }

        const checkInOnSameDay = await this.checkInsRepository.findByUserIdAndDate(userId, new Date())

        if (checkInOnSameDay){
            throw new MaxCheckInsError()
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })


        return {
            checkIn
        }
    }

}