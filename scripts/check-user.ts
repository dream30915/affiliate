
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.user.findMany()
    console.log('--- USERS IN DATABASE ---')
    users.forEach(u => {
        console.log(`Email: ${u.email}, Role: ${u.role}, HasPassword: ${!!u.password}`)
    })
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
