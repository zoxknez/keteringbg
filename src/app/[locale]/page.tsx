import { prisma } from '@/lib/prisma'
import HomeClient from '@/components/HomeClient'

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const menusData = await prisma.menu.findMany({
    orderBy: { price: 'asc' },
    include: { dishes: true }
  })

  const menus = menusData.map(menu => ({
    ...menu,
    price: menu.price ? menu.price.toNumber() : 0
  }))

  return <HomeClient menus={menus} />
}
