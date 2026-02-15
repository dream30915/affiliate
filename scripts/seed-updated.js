
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
    // Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'dream30915@gmail.com'
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Dump30915', 10)

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

    console.log('Admin user upserted:', admin.email)

    // Create Categories
    const categoriesList = [
        { name: 'เทคโนโลยี', slug: 'tech' },
        { name: 'สุขภาพ', slug: 'health' },
        { name: 'แฟชั่น', slug: 'fashion' },
        { name: 'กีฬา', slug: 'sports' }
    ]

    const categories = []
    for (const cat of categoriesList) {
        const c = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name },
            create: { name: cat.name, slug: cat.slug }
        })
        categories.push(c)
        console.log(`Created category: ${c.name}`)
    }

    const techId = categories.find(c => c.slug === 'tech')?.id
    const healthId = categories.find(c => c.slug === 'health')?.id
    const fashionId = categories.find(c => c.slug === 'fashion')?.id

    // Create Products
    const products = [
        {
            name: 'Premium Wireless Headphones',
            description: 'Experience high-fidelity sound with our premium wireless headphones. Noise-cancelling technology and 30-hour battery life.',
            price: 299.99,
            discount: 10,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            commission: 15.0,
            featured: true,
            categoryId: techId
        },
        {
            name: 'Smart Fitness Watch',
            description: 'Track your health and fitness goals with precision. Features heart rate monitoring, GPS, and water resistance.',
            price: 199.50,
            discount: 5,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            commission: 10.0,
            featured: true,
            categoryId: healthId
        },
        {
            name: 'Ergonomic Office Chair',
            description: 'Work in comfort with our ergonomic office chair. Adjustable lumbar support and breathable mesh back.',
            price: 350.00,
            discount: 0,
            image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
            commission: 12.0,
            featured: false,
            categoryId: fashionId
        },
        {
            name: '4K Ultra HD Camera',
            description: 'Capture life in stunning detail with our 4K Ultra HD camera. Perfect for content creators and photography enthusiasts.',
            price: 899.00,
            discount: 15,
            image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
            commission: 8.0,
            featured: true,
            categoryId: techId
        },
    ]

    for (const product of products) {
        // Find if product already exists to avoid duplicates if possible, 
        // but for now we'll just create or catch error
        try {
            const p = await prisma.product.create({
                data: product,
            })
            console.log(`Created product: ${p.name}`)
        } catch (e) {
            console.log(`Product ${product.name} might already exist.`)
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect())
