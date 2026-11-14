import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../src/server/seed-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding EventHub DBU database...');
  const result = await seedDatabase(prisma);
  console.log('✅ Database seeded successfully!', result);
  console.log('');
  console.log('📧 Test Accounts:');
  console.log('  Admin/Super Admin: admin@dbu.edu.et / admin');
  console.log('  Vendor/Organizer:  vendor@dbu.edu.et / vendor');
  console.log('  Student:           student@dbu.edu.et / student');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
