import dotenv from 'dotenv';

dotenv.config();

async function main() {
  // Import prisma dynamically to ensure env vars are loaded first
  const { prisma } = await import('../src/lib/prisma');

  console.log('Checking for local file paths...');
  const localDishes = await prisma.dish.findMany({
    where: {
      OR: [
        { imageUrl: { startsWith: '/dishes/' } },
        { videoUrl: { startsWith: '/dishes/' } }
      ]
    },
    select: {
      id: true,
      name: true,
      imageUrl: true
    }
  });

  console.log(`Found ${localDishes.length} dishes with local paths.`);
  if (localDishes.length > 0) {
    console.log(JSON.stringify(localDishes, null, 2));
  }
}

main()
  .catch(e => console.error(e));
