import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DishForm from '@/components/admin/DishForm'

export default async function EditDishPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  const dish = await prisma.dish.findUnique({
    where: { id }
  })

  if (!dish) {
    notFound()
  }

  return <DishForm dish={{
    ...dish,
    description: dish.description,
    imageUrl: dish.imageUrl,
    videoUrl: dish.videoUrl,
    tags: dish.tags as string[],
  }} />
}
