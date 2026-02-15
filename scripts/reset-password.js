
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    const password = 'Dump30915'
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
        where: { email: 'dream30915@gmail.com' },
        data: { password: hashedPassword }
    })

    console.log('Password reset successfully to: ' + password)
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
