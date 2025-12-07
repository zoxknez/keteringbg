import { PrismaClient, DishCategory } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = "postgresql://neondb_owner:npg_d9nVW1mhpqLw@ep-still-snow-ahpyzmte-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create Menus
  const menus = [
    { name: 'Silver Meni (5 Jela)', dishCount: 5, price: 0 },
    { name: 'Gold Meni (7 Jela)', dishCount: 7, price: 0 },
    { name: 'Platinum Meni (10 Jela)', dishCount: 10, price: 0 },
  ]

  for (const menu of menus) {
    await prisma.menu.create({
      data: menu,
    })
  }

  // Create Dishes
  const dishes = [
    // Appetizers
    { name: 'Elegantni Kanapei', category: DishCategory.APPETIZER, imageUrl: 'https://images.unsplash.com/photo-1541529086526-db283c563270' },
    { name: 'Selekcija Sireva', category: DishCategory.APPETIZER, imageUrl: 'https://images.unsplash.com/photo-1541014741259-de529411b96a' },
    { name: 'Brusketi sa Pršutom', category: DishCategory.APPETIZER, imageUrl: 'https://images.unsplash.com/photo-1572695157363-bc31c5d4efb5' },
    { name: 'Rolnice od Tikvica', category: DishCategory.APPETIZER, imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5' },
    { name: 'Kapreze Ražnjići', category: DishCategory.APPETIZER, imageUrl: 'https://images.unsplash.com/photo-1529312266912-b33cf6227e24' },

    // Mains
    { name: 'Biftek sa Tartufima', category: DishCategory.MAIN, imageUrl: 'https://images.unsplash.com/photo-1544025162-d76690b60944' },
    { name: 'Losos u Sosu od Limuna', category: DishCategory.MAIN, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d' },
    { name: 'Piletina Kordon Blu', category: DishCategory.MAIN, imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8' },
    { name: 'Rižoto sa Šumskim Pečurkama', category: DishCategory.MAIN, imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371' },
    { name: 'Jagnjetina ispod Sača', category: DishCategory.MAIN, imageUrl: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143' },

    // Desserts
    { name: 'Čokoladni Mus', category: DishCategory.DESSERT, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587' },
    { name: 'Voćni Tart', category: DishCategory.DESSERT, imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77ddb933406' },
    { name: 'Tiramisu', category: DishCategory.DESSERT, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9' },
    { name: 'Čizkejk sa Malinama', category: DishCategory.DESSERT, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad' },
    { name: 'Pana Kota', category: DishCategory.DESSERT, imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777' },
  ]

  for (const dish of dishes) {
    await prisma.dish.create({
      data: dish,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
