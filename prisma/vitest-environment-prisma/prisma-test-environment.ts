import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

const prisma = new PrismaClient()

function generateDatabaseURL(schema: string): string {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL must be set')
    const url = new URL(process.env.DATABASE_URL)
    url.searchParams.set('schema', schema)
    return url.toString()
}

export default <Environment> {
    name: 'prisma',
    transformMode: 'web',
    async setup() {
        const schema = randomUUID()
        const databaseURL = generateDatabaseURL(schema)
        process.env.DATABASE_URL = databaseURL

        execSync('npx prisma migrate deploy')

        return {
            async teardown(){
                await prisma.$executeRawUnsafe(
                    `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
                )
                await prisma.$disconnect()
            }
        }
    }
}