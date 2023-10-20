import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository{

    async findById(id: string){
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id
            }
        })

        if (!checkIn) return null

        return checkIn
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data
        })

        return checkIn
    }

    async findByUserIdAndDate(userId: string, date: Date){
        const startOfDay = dayjs(date).startOf('date')
        const endOfDay = dayjs(date).endOf('date')
        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfDay.toDate(),
                    lte: endOfDay.toDate()
                }
            }
        })

        return checkIn
    }

    async findManyByUserId(userId: string, page: number){
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 20,
            skip: (page - 1) * 20
        })

        return checkIns
    }

    async countByUserId(userId: string){
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId
            }
        })

        return count
    }
    
    async save(checkIn: CheckIn){
        const updatedCheckIn = await prisma.checkIn.update({
            where: {
                id: checkIn.id
            },
            data: checkIn
        })

        return updatedCheckIn
    }
    
}