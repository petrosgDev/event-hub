import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/prisma';
import { seedDatabase } from '@/server/seed-data';

export async function GET(req: NextRequest) {
  return handleSeed(req);
}

export async function POST(req: NextRequest) {
  return handleSeed(req);
}

async function handleSeed(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    const secretKey = process.env.SEED_SECRET || 'dbu-seed-2026';

    const categoryCount = await prisma.category.count().catch(() => 0);

    // Allow seed if the database has 0 categories, or if valid key provided
    if (categoryCount > 0 && key !== secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Database already has data. To re-seed, provide ?key=dbu-seed-2026',
        },
        { status: 403 }
      );
    }

    const result = await seedDatabase(prisma);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with DBU categories, demo events, and accounts!',
      result,
      accounts: {
        admin: 'admin@dbu.edu.et / admin',
        vendor: 'vendor@dbu.edu.et / vendor',
        student: 'student@dbu.edu.et / student',
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed database',
      },
      { status: 500 }
    );
  }
}
