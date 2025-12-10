import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function main() {
  console.log('🚀 Starting migration to Vercel Blob...');

  // Import prisma dynamically to ensure env vars are loaded first
  const { prisma } = await import('../src/lib/prisma');

  const dishesDir = path.join(process.cwd(), 'public', 'dishes');
  
  try {
    const files = await fs.readdir(dishesDir);
    
    for (const file of files) {
      if (file === 'README.md') continue;

      const filePath = path.join(dishesDir, file);
      const fileStat = await fs.stat(filePath);
      
      if (fileStat.isFile()) {
        console.log(`\nProcessing: ${file}`);
        
        // 1. Read file
        const fileContent = await fs.readFile(filePath);
        
        // 2. Upload to Vercel Blob
        console.log('  - Uploading to Blob...');
        const blob = await put(`dishes/${file}`, fileContent, {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN,
          addRandomSuffix: true // Ensure unique filename to avoid conflicts
        });
        
        console.log(`  - Uploaded! New URL: ${blob.url}`);

        // 3. Update Database
        const oldUrl = `/dishes/${file}`;
        
        // Update Image URLs
        const updatedImages = await prisma.dish.updateMany({
          where: {
            imageUrl: oldUrl
          },
          data: {
            imageUrl: blob.url
          }
        });

        // Update Video URLs
        const updatedVideos = await prisma.dish.updateMany({
          where: {
            videoUrl: oldUrl
          },
          data: {
            videoUrl: blob.url
          }
        });

        if (updatedImages.count > 0 || updatedVideos.count > 0) {
          console.log(`  - Database updated: ${updatedImages.count} images, ${updatedVideos.count} videos linked.`);
        } else {
          console.log('  - No database records found using this file.');
        }
      }
    }

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
