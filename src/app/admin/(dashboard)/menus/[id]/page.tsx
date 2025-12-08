import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import MenuForm from '../MenuForm'

export default async function EditMenuPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const menu = await prisma.menu.findUnique({
    where: { id }
  })

  if (!menu) {
    notFound()
  }

  return <MenuForm menu={{
    ...menu,
    price: menu.price?.toString() || null,
  }} />
}
