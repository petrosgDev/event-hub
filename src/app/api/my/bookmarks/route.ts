import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            bannerImage: true,
            location: true,
            status: true,
            registeredCount: true,
            capacity: true,
            category: { select: { name: true, icon: true, color: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return jsonSuccess(bookmarks);
  } catch (error) {
    return jsonError(error);
  }
}

