import { PrismaClient, DishCategory } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_d9nVW1mhpqLw@ep-still-snow-ahpyzmte-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const getImageUrl = (name: string) => {
  const lower = name.toLowerCase()
  if (lower.includes('gulaš') || lower.includes('gulas')) return 'https://images.unsplash.com/photo-1547592180-85f173990554'
  if (lower.includes('pasulj')) return 'https://images.unsplash.com/photo-1553682472-15c326d55206'
  if (lower.includes('piletina') || lower.includes('pileći') || lower.includes('batak')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d'
  if (lower.includes('sarma') || lower.includes('punjene')) return 'https://images.unsplash.com/photo-1603082303232-e0382722a589' // Generic stuffed food
  if (lower.includes('riba') || lower.includes('pastrmka')) return 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a277d'
  if (lower.includes('roštilj') || lower.includes('ćevap') || lower.includes('pljeskavic')) return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
  if (lower.includes('musaka')) return 'https://images.unsplash.com/photo-1599021456807-b55066453f10'
  if (lower.includes('grašak') || lower.includes('boranija')) return 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6'
  if (lower.includes('šnicla') || lower.includes('kare')) return 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6'
  if (lower.includes('lazanje')) return 'https://images.unsplash.com/photo-1574834719033-5bf6712c85b2'
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' // Generic food
}

async function main() {
  // Clean up
  await prisma.orderDish.deleteMany()
  await prisma.order.deleteMany()
  await prisma.dish.deleteMany()
  await prisma.menu.deleteMany()

  // Meni 1
  const menu1 = await prisma.menu.create({
    data: {
      name: 'Meni 1',
      dishCount: 5, // Default selectable count
      price: 500,
      dishes: {
        create: [
          'Gulaš (svinjski, pileći)+prilog',
          'Grašak (svinjski, pileći)+prilog',
          'Mućkalica (svinjska, pileća)+prilog',
          'Krompir paprikaš (svinjski, pileći)',
          'Vojnički pasulj (junetina)',
          'Čorbast pasulj (kobasica)',
          'Boranija (svinjetina, piletina)',
          'Musaka (mešano mleveno ili piletina)',
          'Pilav (piletina)',
          'Pečeni batak sa karabatakom+prilog',
          'Pohovano belo meso+prilog',
          'Pileći file u sosu od šampinjona+prilog',
          'Domaća gibanica+mesni dodatak+jogurt',
          'Podvarak sa dimljenim batakom ili svinjetinom',
          'Pileće ćufte u belom sosu+prilog+supa/čorba/potaž',
          'Posna sarma (vege)+prilog',
          'Prebranac sa kobasicom',
          'Prebranac posni+riblje pljeskavice'
        ].map(name => ({
          name,
          category: DishCategory.MAIN,
          imageUrl: getImageUrl(name),
          description: 'Masa porcije 500gr + 1/3 hleba + salata'
        }))
      }
    }
  })

  // Meni 2
  const menu2 = await prisma.menu.create({
    data: {
      name: 'Meni 2',
      dishCount: 5,
      price: 650,
      dishes: {
        create: [
          'Gulaš (juneći, svinjski, pileći)+prilog',
          'Bečka šnicla (svinjetina)+prilog+supa/čorba/potaž',
          'Punjene paprike/sarma+prilog+supa/čorba/potaž',
          'Grilovana pastrmka+pirinač s povrćem (restovan krompir), posno',
          'Pileći file u sosu s pomorandžom+prilog',
          'Laks kare u sosu od kačkavalja+pire+supa/čorba/potaž',
          'Pohovano belo meso+pire/pirinač s povrćem',
          'Vojnički pasulj sa junetinom',
          'Lazanje+jogurt',
          'Pečeni batak sa karabatakom+prilog',
          'Pohovana tortilja s mesom+jogurt',
          'Bauk piletina (pileći file, suvi vrat, pavlaka, kačkavalj, jaja, zapečeno u peći)+prilog+supa/čorba',
          'Pileće ćufte u belom sosu+prilog+supa/čorba/potaž',
          'Posna sarma (vege)+prilog',
          'Prebranac sa kobasicom+supa/čorba/potaž',
          'Prebranac posni+riblje pljeskavice+posna čorba'
        ].map(name => ({
          name,
          category: DishCategory.MAIN,
          imageUrl: getImageUrl(name),
          description: 'Masa porcije 500gr + 1/3 hleba + salata + supa/čorba/potaž'
        }))
      }
    }
  })

  // Meni 3
  const menu3 = await prisma.menu.create({
    data: {
      name: 'Meni 3',
      dishCount: 5,
      price: 750,
      dishes: {
        create: [
          'Gulaš (juneći, svinjski, pileći)+prilog+desert',
          'Svadbarski kupus+supa/čorba/potaž+desert',
          'Šnicla u pivu i povrću (svinjetina)+prilog +supa/čorba/potaž+desert',
          'Mlinci s piletinom+potaž+desert',
          'Roštilj+prilog+supa/čorba/potaž+desert',
          'Vojnički pasulj+desert',
          'Punjene paprike/sarma+prilog+supa/čorba/potaž+desert',
          'Lazanje+jogurt+desert',
          'Grilovana pastrmka+prilog (mrsni ili posni)+desert',
          'Laks kare u sosu od kačkavalja+prilog+supa/čorba/potaž+desert',
          'Bečka šnicla (svinjetina)+prilog+supa/čorba/potaž+desert',
          'Ćufte u paradajz sosu+prilog+desert',
          'Karađorđeva šnicla+prilog+supa/čorba/potaž+desert',
          'Bauk piletina (pileći file, suvi vrat, pavlaka, kačkavalj, jaja, zapečeno u peći)+prilog+supa/čorba/potaž+desert',
          'Pileće ćufte u belom sosu+prilog+supa/čorba/potaž+desert',
          'Posna sarma (vege)+prilog+posna čorba+posni kolač',
          'Prebranac sa kobasicom+supa/čorba/potaž+desert',
          'Prebranac posni+posna čorba+posni kolač'
        ].map(name => ({
          name,
          category: DishCategory.MAIN,
          imageUrl: getImageUrl(name),
          description: 'Masa porcije 500gr + 1/3 hleba + salata + supa/čorba/potaž + desert'
        }))
      }
    }
  })

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
