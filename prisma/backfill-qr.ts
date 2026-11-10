import { PrismaClient } from '@prisma/client';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Backfilling QR codes for all registrations missing them...');

  const registrations = await prisma.registration.findMany({
    where: {
      qrCode: null,
      status: { not: 'CANCELLED' },
    },
    select: {
      id: true,
      qrToken: true,
      eventId: true,
      userId: true,
    },
  });

  console.log(`Found ${registrations.length} registrations without QR codes.`);

  let updated = 0;
  for (const reg of registrations) {
    // If no qrToken exists, generate one
    const token = reg.qrToken || `${reg.id}-${Date.now()}`;
    const qrData = JSON.stringify({ token, eventId: reg.eventId, userId: reg.userId });

    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    const qrExpiry = new Date();
    qrExpiry.setDate(qrExpiry.getDate() + 30); // 30 days from now

    await prisma.registration.update({
      where: { id: reg.id },
      data: {
        qrCode,
        qrToken: token,
        qrExpiry,
      },
    });

    updated++;
  }

  console.log(`✅ Updated ${updated} registrations with QR codes.`);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error('❌ Backfill failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
