import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'


export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []

    async countByUserId(userId: string){
        return this.items.filter(checkIn => checkIn.user_id === userId).length
    }

    async findManyByUserId(userId: string, page: number){
        return this.items
            .filter(checkIn => checkIn.user_id === userId)
            .slice((page - 1) * 20, page * 20)
    }

    async findByUserIdAndDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')
        const checkIn = this.items.find(checkIn => {
            const isSameDay = dayjs(checkIn.created_at).isAfter(startOfTheDay) && dayjs(checkIn.created_at).isBefore(endOfTheDay)
            return checkIn.user_id === userId && isSameDay
        })

        if (!checkIn) return null

        return checkIn

    }

    async create (data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            user_id: data.user_id,
            gym_id: data.gym_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
        }

        this.items.push(checkIn)

        return checkIn
    }
}