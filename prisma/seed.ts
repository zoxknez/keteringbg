import { PrismaClient, DishCategory, DishTag } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_d9nVW1mhpqLw@ep-still-snow-ahpyzmte-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// Definicije jela sa tagovima i informacijama
// Slike ce biti u /public/dishes/ folderu - npr. gulas.jpg, pasulj.jpg itd.

interface DishData {
  name: string
  description: string
  tags: DishTag[]
  isVegetarian?: boolean
  isVegan?: boolean
  isFasting?: boolean
  imageSlug: string // slug za sliku, npr. "gulas" -> /dishes/gulas.jpg
}

// MENI 1 - 500 RSD
const menu1Dishes: DishData[] = [
  {
    name: 'Gulaš svinjski',
    description: 'Tradicionalni svinjski gulaš sa prilogom po izboru (pire, pirinač ili pomfrit)',
    tags: [DishTag.PORK],
    imageSlug: 'gulas-svinjski'
  },
  {
    name: 'Gulaš pileći',
    description: 'Nežni pileći gulaš sa prilogom po izboru (pire, pirinač ili pomfrit)',
    tags: [DishTag.CHICKEN],
    imageSlug: 'gulas-pileci'
  },
  {
    name: 'Grašak sa svinjetinom',
    description: 'Domaći grašak sa sočnim komadima svinjetine i prilogom',
    tags: [DishTag.PORK],
    imageSlug: 'grasak-svinjetina'
  },
  {
    name: 'Grašak sa piletinom',
    description: 'Kremasti grašak sa mekim pilećim mesom i prilogom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'grasak-piletina'
  },
  {
    name: 'Mućkalica svinjska',
    description: 'Pikantna svinjska mućkalica sa paprikom i lukom, servirana sa prilogom',
    tags: [DishTag.PORK],
    imageSlug: 'muckalica-svinjska'
  },
  {
    name: 'Mućkalica pileća',
    description: 'Sočna pileća mućkalica sa povrćem i prilogom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'muckalica-pileca'
  },
  {
    name: 'Krompir paprikaš svinjski',
    description: 'Tradicionalni paprikaš sa svinjskim mesom i krompirićima',
    tags: [DishTag.PORK],
    imageSlug: 'krompir-paprikas-svinjski'
  },
  {
    name: 'Krompir paprikaš pileći',
    description: 'Ukusan paprikaš sa pilećim mesom i mladim krompirom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'krompir-paprikas-pileci'
  },
  {
    name: 'Vojnički pasulj sa junetinom',
    description: 'Bogati pasulj sa sočnim komadima junetine, pravi domaći ukus',
    tags: [DishTag.BEEF],
    imageSlug: 'vojnicki-pasulj'
  },
  {
    name: 'Čorbast pasulj sa kobasicom',
    description: 'Gust čorbast pasulj sa domaćom kobasicom',
    tags: [DishTag.PORK],
    imageSlug: 'corbast-pasulj'
  },
  {
    name: 'Boranija sa svinjetinom',
    description: 'Sveža boranija dinstana sa komadima svinjetine',
    tags: [DishTag.PORK],
    imageSlug: 'boranija-svinjetina'
  },
  {
    name: 'Boranija sa piletinom',
    description: 'Lagana boranija sa mekim pilećim mesom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'boranija-piletina'
  },
  {
    name: 'Musaka sa mešanim mlevenim mesom',
    description: 'Klasična musaka sa slojevima krompira i mešanog mlevenog mesa',
    tags: [DishTag.PORK, DishTag.BEEF],
    imageSlug: 'musaka'
  },
  {
    name: 'Musaka sa piletinom',
    description: 'Laganija verzija musake sa mlevenom piletinom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'musaka-piletina'
  },
  {
    name: 'Pilav sa piletinom',
    description: 'Aromatični pirinač sa komadićima pilećeg mesa',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pilav'
  },
  {
    name: 'Pečeni batak sa karabatakom',
    description: 'Hrskavi pečeni pileći batak i karabatak sa prilogom po izboru',
    tags: [DishTag.CHICKEN],
    imageSlug: 'peceni-batak'
  },
  {
    name: 'Pohovano belo meso',
    description: 'Sočno pohovano pileće belo meso sa prilogom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pohovano-belo-meso'
  },
  {
    name: 'Pileći file u sosu od šampinjona',
    description: 'Nežni pileći file u kremastom sosu od šampinjona sa prilogom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pileci-file-sampinjoni'
  },
  {
    name: 'Domaća gibanica sa mesnim dodatkom',
    description: 'Hrskava domaća gibanica sa mesnim dodatkom i jogurtom',
    tags: [DishTag.PORK],
    imageSlug: 'gibanica'
  },
  {
    name: 'Podvarak sa dimljenim batakom',
    description: 'Kiseli kupus podvarak sa dimljenim pilećim batakom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'podvarak-batak'
  },
  {
    name: 'Podvarak sa svinjetinom',
    description: 'Tradicionalni podvarak sa sočnom svinjetinom',
    tags: [DishTag.PORK],
    imageSlug: 'podvarak-svinjetina'
  },
  {
    name: 'Pileće ćufte u belom sosu',
    description: 'Meke pileće ćufte u kremastom belom sosu sa prilogom i supom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pilece-cufte'
  },
  {
    name: 'Posna sarma',
    description: 'Vegetarijanska sarma punjena pirinčem i povrćem sa prilogom',
    tags: [DishTag.VEGETARIAN, DishTag.FASTING],
    isVegetarian: true,
    isFasting: true,
    imageSlug: 'posna-sarma'
  },
  {
    name: 'Prebranac sa kobasicom',
    description: 'Kremasti prebranac sa domaćom suvom kobasicom',
    tags: [DishTag.PORK],
    imageSlug: 'prebranac-kobasica'
  },
  {
    name: 'Prebranac posni sa ribljim pljeskavicama',
    description: 'Posni prebranac serviran sa domaćim ribljim pljeskavicama',
    tags: [DishTag.FISH, DishTag.FASTING],
    isFasting: true,
    imageSlug: 'prebranac-posni'
  }
]

// MENI 2 - 650 RSD (uključuje supu/čorbu/potaž)
const menu2Dishes: DishData[] = [
  {
    name: 'Gulaš juneći',
    description: 'Bogati juneći gulaš sa prilogom po izboru',
    tags: [DishTag.BEEF],
    imageSlug: 'gulas-juneci'
  },
  {
    name: 'Gulaš svinjski sa supom',
    description: 'Tradicionalni svinjski gulaš sa prilogom',
    tags: [DishTag.PORK],
    imageSlug: 'gulas-svinjski'
  },
  {
    name: 'Gulaš pileći sa supom',
    description: 'Nežni pileći gulaš sa prilogom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'gulas-pileci'
  },
  {
    name: 'Bečka šnicla',
    description: 'Klasična bečka šnicla od svinjetine sa prilogom i supom/čorbom',
    tags: [DishTag.PORK],
    imageSlug: 'becka-snicla'
  },
  {
    name: 'Punjene paprike',
    description: 'Sočne punjene paprike sa mlevenim mesom, prilogom i supom',
    tags: [DishTag.PORK, DishTag.BEEF],
    imageSlug: 'punjene-paprike'
  },
  {
    name: 'Sarma',
    description: 'Tradicionalna sarma od kiselog kupusa sa prilogom i supom',
    tags: [DishTag.PORK, DishTag.BEEF],
    imageSlug: 'sarma'
  },
  {
    name: 'Grilovana pastrmka',
    description: 'Sveža grilovana pastrmka sa pirinčem i povrćem ili restovanim krompirom (posno)',
    tags: [DishTag.FISH, DishTag.FASTING],
    isFasting: true,
    imageSlug: 'pastrmka'
  },
  {
    name: 'Pileći file u sosu od pomorandže',
    description: 'Egzotični pileći file u slatko-kiselom sosu od pomorandže sa prilogom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pileci-file-pomorandza'
  },
  {
    name: 'Laks kare u sosu od kačkavalja',
    description: 'Sočni svinjski kare u kremastom sosu od kačkavalja sa pireom i supom',
    tags: [DishTag.PORK],
    imageSlug: 'laks-kare'
  },
  {
    name: 'Pohovano belo meso sa pireom',
    description: 'Hrskavo pohovano pileće meso sa kremastim pireom ili pirinčem',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pohovano-belo-meso'
  },
  {
    name: 'Vojnički pasulj sa junetinom',
    description: 'Bogati pasulj sa sočnim komadima junetine',
    tags: [DishTag.BEEF],
    imageSlug: 'vojnicki-pasulj'
  },
  {
    name: 'Lazanje',
    description: 'Domaće lazanje sa bolonjez sosom i jogurtom',
    tags: [DishTag.BEEF, DishTag.PORK],
    imageSlug: 'lazanje'
  },
  {
    name: 'Pečeni batak sa karabatakom',
    description: 'Hrskavi pečeni pileći batak i karabatak sa prilogom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'peceni-batak'
  },
  {
    name: 'Pohovana tortilja sa mesom',
    description: 'Hrskava pohovana tortilja punjena mesom sa jogurtom',
    tags: [DishTag.CHICKEN, DishTag.PORK],
    imageSlug: 'tortilja'
  },
  {
    name: 'Bauk piletina',
    description: 'Specijalitet kuće - pileći file sa suvim vratom, pavlakom, kačkavaljem i jajima, zapečeno u peći sa prilogom i supom',
    tags: [DishTag.CHICKEN, DishTag.PORK],
    imageSlug: 'bauk-piletina'
  },
  {
    name: 'Pileće ćufte u belom sosu',
    description: 'Meke pileće ćufte u kremastom belom sosu sa prilogom i supom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pilece-cufte'
  },
  {
    name: 'Posna sarma',
    description: 'Vegetarijanska sarma punjena pirinčem i povrćem sa prilogom',
    tags: [DishTag.VEGETARIAN, DishTag.FASTING],
    isVegetarian: true,
    isFasting: true,
    imageSlug: 'posna-sarma'
  },
  {
    name: 'Prebranac sa kobasicom i supom',
    description: 'Kremasti prebranac sa domaćom suvom kobasicom i supom/čorbom',
    tags: [DishTag.PORK],
    imageSlug: 'prebranac-kobasica'
  },
  {
    name: 'Prebranac posni sa ribljim pljeskavicama',
    description: 'Posni prebranac serviran sa ribljim pljeskavicama i posnom čorbom',
    tags: [DishTag.FISH, DishTag.FASTING],
    isFasting: true,
    imageSlug: 'prebranac-posni'
  }
]

// MENI 3 - 750 RSD (uključuje supu/čorbu/potaž + desert)
const menu3Dishes: DishData[] = [
  {
    name: 'Gulaš sa desertom',
    description: 'Bogati gulaš (juneći, svinjski ili pileći) sa prilogom i desertom po izboru',
    tags: [DishTag.BEEF, DishTag.PORK, DishTag.CHICKEN],
    imageSlug: 'gulas-juneci'
  },
  {
    name: 'Svadbarski kupus',
    description: 'Tradicionalni svadbarski kupus sa mesom, supom/čorbom i desertom',
    tags: [DishTag.PORK],
    imageSlug: 'svadbarski-kupus'
  },
  {
    name: 'Šnicla u pivu i povrću',
    description: 'Sočna svinjska šnicla kuvana u pivu sa povrćem, prilogom, supom i desertom',
    tags: [DishTag.PORK],
    imageSlug: 'snicla-pivo'
  },
  {
    name: 'Mlinci sa piletinom',
    description: 'Tradicionalni mlinci sa sočnom piletinom, potažom i desertom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'mlinci'
  },
  {
    name: 'Roštilj miks',
    description: 'Mešani roštilj (ćevapi, pljeskavica, kobasica) sa prilogom, supom i desertom',
    tags: [DishTag.PORK, DishTag.BEEF],
    imageSlug: 'rostilj'
  },
  {
    name: 'Vojnički pasulj sa desertom',
    description: 'Bogati pasulj sa junetinom i desertom po izboru',
    tags: [DishTag.BEEF],
    imageSlug: 'vojnicki-pasulj'
  },
  {
    name: 'Punjene paprike/sarma sa desertom',
    description: 'Tradicionalne punjene paprike ili sarma sa prilogom, supom i desertom',
    tags: [DishTag.PORK, DishTag.BEEF],
    imageSlug: 'punjene-paprike'
  },
  {
    name: 'Lazanje sa desertom',
    description: 'Domaće lazanje sa bolonjez sosom, jogurtom i desertom',
    tags: [DishTag.BEEF, DishTag.PORK],
    imageSlug: 'lazanje'
  },
  {
    name: 'Grilovana pastrmka sa desertom',
    description: 'Sveža grilovana pastrmka sa prilogom (mrsni ili posni) i desertom',
    tags: [DishTag.FISH],
    imageSlug: 'pastrmka'
  },
  {
    name: 'Laks kare sa desertom',
    description: 'Svinjski kare u sosu od kačkavalja sa prilogom, supom i desertom',
    tags: [DishTag.PORK],
    imageSlug: 'laks-kare'
  },
  {
    name: 'Bečka šnicla sa desertom',
    description: 'Klasična bečka šnicla sa prilogom, supom/čorbom i desertom',
    tags: [DishTag.PORK],
    imageSlug: 'becka-snicla'
  },
  {
    name: 'Ćufte u paradajz sosu',
    description: 'Domaće ćufte u gustom paradajz sosu sa prilogom i desertom',
    tags: [DishTag.PORK, DishTag.BEEF],
    imageSlug: 'cufte-paradajz'
  },
  {
    name: 'Karađorđeva šnicla',
    description: 'Čuvena Karađorđeva šnicla sa kajmakom, prilogom, supom i desertom',
    tags: [DishTag.PORK],
    imageSlug: 'karadjordjeva'
  },
  {
    name: 'Bauk piletina sa desertom',
    description: 'Specijalitet kuće - pileći file sa suvim vratom, pavlakom, kačkavaljem, zapečeno u peći, sa prilogom, supom i desertom',
    tags: [DishTag.CHICKEN, DishTag.PORK],
    imageSlug: 'bauk-piletina'
  },
  {
    name: 'Pileće ćufte u belom sosu sa desertom',
    description: 'Meke pileće ćufte u kremastom sosu sa prilogom, supom i desertom',
    tags: [DishTag.CHICKEN],
    imageSlug: 'pilece-cufte'
  },
  {
    name: 'Posna sarma sa posnim kolačem',
    description: 'Vegetarijanska sarma sa prilogom, posnom čorbom i posnim kolačem',
    tags: [DishTag.VEGETARIAN, DishTag.FASTING],
    isVegetarian: true,
    isFasting: true,
    imageSlug: 'posna-sarma'
  },
  {
    name: 'Prebranac sa kobasicom i desertom',
    description: 'Kremasti prebranac sa domaćom kobasicom, supom i desertom',
    tags: [DishTag.PORK],
    imageSlug: 'prebranac-kobasica'
  },
  {
    name: 'Prebranac posni sa posnim kolačem',
    description: 'Posni prebranac sa posnom čorbom i posnim kolačem',
    tags: [DishTag.VEGETARIAN, DishTag.FASTING],
    isVegetarian: true,
    isFasting: true,
    imageSlug: 'prebranac-posni'
  }
]

// Funkcija koja proverava da li postoji lokalna slika, inace koristi placeholder
const getImageUrl = (slug: string) => {
  // Koristicemo lokalne slike iz /dishes/ foldera
  // Placeholder slike dok ne ubacite svoje
  const placeholders: Record<string, string> = {
    'gulas-svinjski': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
    'gulas-pileci': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
    'gulas-juneci': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600',
    'grasak-svinjetina': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600',
    'grasak-piletina': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600',
    'muckalica-svinjska': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    'muckalica-pileca': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    'krompir-paprikas-svinjski': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
    'krompir-paprikas-pileci': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600',
    'vojnicki-pasulj': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600',
    'corbast-pasulj': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600',
    'boranija-svinjetina': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600',
    'boranija-piletina': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600',
    'musaka': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600',
    'musaka-piletina': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600',
    'pilav': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600',
    'peceni-batak': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    'pohovano-belo-meso': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    'pileci-file-sampinjoni': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    'pileci-file-pomorandza': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    'gibanica': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600',
    'podvarak-batak': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    'podvarak-svinjetina': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    'pilece-cufte': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600',
    'posna-sarma': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    'prebranac-kobasica': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600',
    'prebranac-posni': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600',
    'becka-snicla': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
    'punjene-paprike': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    'sarma': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    'pastrmka': 'https://images.unsplash.com/photo-1535025639604-9a804c092faa?w=600',
    'laks-kare': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
    'lazanje': 'https://images.unsplash.com/photo-1619895092538-128341789043?w=600',
    'tortilja': 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600',
    'bauk-piletina': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    'svadbarski-kupus': 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    'snicla-pivo': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
    'mlinci': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600',
    'rostilj': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    'cufte-paradajz': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600',
    'karadjordjeva': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600'
  }

  // Vrati placeholder ili default sliku
  return placeholders[slug] || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'
}

async function main() {
  console.log('🗑️ Brisanje starih podataka...')
  
  // Clean up
  await prisma.orderDish.deleteMany()
  await prisma.order.deleteMany()
  await prisma.dish.deleteMany()
  await prisma.menu.deleteMany()

  console.log('📦 Kreiranje Menija 1 (500 RSD)...')
  
  // Meni 1 - 500 RSD
  const menu1 = await prisma.menu.create({
    data: {
      name: 'Meni 1',
      dishCount: 5,
      price: 500,
      dishes: {
        create: menu1Dishes.map(dish => ({
          name: dish.name,
          description: dish.description,
          category: DishCategory.MAIN,
          tags: dish.tags,
          isVegetarian: dish.isVegetarian || false,
          isVegan: dish.isVegan || false,
          isFasting: dish.isFasting || false,
          imageUrl: getImageUrl(dish.imageSlug)
        }))
      }
    }
  })

  console.log('📦 Kreiranje Menija 2 (650 RSD)...')
  
  // Meni 2 - 650 RSD
  const menu2 = await prisma.menu.create({
    data: {
      name: 'Meni 2',
      dishCount: 5,
      price: 650,
      dishes: {
        create: menu2Dishes.map(dish => ({
          name: dish.name,
          description: dish.description,
          category: DishCategory.MAIN,
          tags: dish.tags,
          isVegetarian: dish.isVegetarian || false,
          isVegan: dish.isVegan || false,
          isFasting: dish.isFasting || false,
          imageUrl: getImageUrl(dish.imageSlug)
        }))
      }
    }
  })

  console.log('📦 Kreiranje Menija 3 (750 RSD)...')
  
  // Meni 3 - 750 RSD
  const menu3 = await prisma.menu.create({
    data: {
      name: 'Meni 3',
      dishCount: 5,
      price: 750,
      dishes: {
        create: menu3Dishes.map(dish => ({
          name: dish.name,
          description: dish.description,
          category: DishCategory.MAIN,
          tags: dish.tags,
          isVegetarian: dish.isVegetarian || false,
          isVegan: dish.isVegan || false,
          isFasting: dish.isFasting || false,
          imageUrl: getImageUrl(dish.imageSlug)
        }))
      }
    }
  })

  console.log('✅ Seeding završen!')
  console.log(`   - Meni 1: ${menu1Dishes.length} jela`)
  console.log(`   - Meni 2: ${menu2Dishes.length} jela`)
  console.log(`   - Meni 3: ${menu3Dishes.length} jela`)
  console.log('')
  console.log('📸 Za slike:')
  console.log('   Ubacite slike u /public/dishes/ folder')
  console.log('   Nazivi: gulas-svinjski.jpg, becka-snicla.jpg, itd.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
