import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.log('Usage: npx tsx scripts/create-admin.ts <email> <password>')
    process.exit(1)
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  try {
    const admin = await prisma.admin.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
        name: 'Admin'
      }
    })

    console.log(`✅ Admin kreiran/ažuriran: ${admin.email}`)
  } catch (error) {
    console.error('Greška:', error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

createAdmin()
