import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function createSampleBlogPost() {
  try {
    // Get first admin user
    const admin = await prisma.admin.findFirst()
    
    if (!admin) {
      console.log('❌ No admin user found. Please create an admin first.')
      return
    }

    console.log('✓ Found admin:', admin.email)

    // Create sample blog post
    const post = await prisma.blogPost.create({
      data: {
        title: 'Dobrodošli na naš blog!',
        slug: 'dobrodosli-na-nas-blog',
        excerpt: 'Uz nas ćete otkriti tajne profesionalnog kateringa, recepte, savete i priče iz naše kuhinje.',
        content: `Drago nam je što ste ovde! 

Naš blog je mesto gde ćemo deliti sa vama sve što čini ketering posebnim - od recepata koje koristimo, preko saveta za organizaciju događaja, do pogleda iza kulisa naše profesionalne kuhinje.

Ketering nije samo priprema hrane - to je umetnost koja zahteva strast, posvećenost i pažnju prema svakom detalju. Bilo da planirate korporativni događaj, svadbu ili intimnu proslavu, mi smo tu da vam pomognemo da sve bude savršeno.

Na našem blogu ćete pronaći:
- Provjerene recepte koje možete isprobati kod kuće
- Savete za planiranje događaja
- Priče iz naše kuhinje i sa različitih događaja
- Video sadržaj koji pokazuje kako pripremamo naša jela
- Sezonske ideje i inspiraciju

Pratite nas redovno za nove postove, i ne zaboravite da podelite sa nama vaša iskustva u komentarima!`,
        coverImage: '/dishes/README.md',
        isPublished: true,
        publishedAt: new Date(),
        category: 'NEWS',
        tags: ['dobrodošlica', 'ketering', 'beograd', 'blog'],
        metaTitle: 'Dobrodošli na Blog - Ketering Beograd',
        metaDescription: 'Otkrijte tajne profesionalnog kateringa kroz naš blog. Recepti, saveti i priče iz kuhinje.',
        authorId: admin.id,
        videoEmbeds: {
          create: [
            {
              platform: 'YOUTUBE',
              videoId: 'dQw4w9WgXcQ', // Example YouTube video
              title: 'Kako pripremamo naša jela',
              position: 0,
            },
          ],
        },
      },
      include: {
        videoEmbeds: true,
      },
    })

    console.log('✓ Sample blog post created:', post.title)
    console.log('  - Slug:', post.slug)
    console.log('  - Videos:', post.videoEmbeds.length)
    console.log('  - URL: /blog/' + post.slug)
  } catch (error) {
    console.error('❌ Error creating sample post:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleBlogPost()
