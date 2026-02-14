import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import 'dotenv/config'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
})

async function main() {
    // Create Admin User
    // Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10)

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: adminPassword,
            role: 'ADMIN',
        },
        create: {
            email: adminEmail,
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    })

    console.log({ admin })

    // Create Test Affiliate User
    const affiliateEmail = 'affiliate@example.com'
    const affiliatePassword = await bcrypt.hash('affiliate123', 10)

    const affiliate = await prisma.user.upsert({
        where: { email: affiliateEmail },
        update: {},
        create: {
            email: affiliateEmail,
            name: 'Test Affiliate',
            password: affiliatePassword,
            role: 'USER',
        },
    })

    console.log({ affiliate })

    // Create Products
    const products = [
        {
            name: 'Premium Wireless Headphones',
            description: 'Experience high-fidelity sound with our premium wireless headphones. Noise-cancelling technology and 30-hour battery life.',
            price: 299.99,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            commission: 15.0,
        },
        {
            name: 'Smart Fitness Watch',
            description: 'Track your health and fitness goals with precision. Features heart rate monitoring, GPS, and water resistance.',
            price: 199.50,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            commission: 10.0,
        },
        {
            name: 'Ergonomic Office Chair',
            description: 'Work in comfort with our ergonomic office chair. Adjustable lumbar support and breathable mesh back.',
            price: 350.00,
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
            commission: 12.0,
        },
        {
            name: '4K Ultra HD Camera',
            description: 'Capture life in stunning detail with our 4K Ultra HD camera. Perfect for content creators and photography enthusiasts.',
            price: 899.00,
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
            commission: 8.0,
        },
    ]

    for (const product of products) {
        const p = await prisma.product.create({
            data: product,
        })
        console.log(`Created product with id: ${p.id}`)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
