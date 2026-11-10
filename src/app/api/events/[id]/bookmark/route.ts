import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id: eventId } = await params;

    const existing = await prisma.bookmark.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      return jsonSuccess({ bookmarked: false });
    } else {
      await prisma.bookmark.create({
        data: { userId: user.id, eventId },
      });
      return jsonSuccess({ bookmarked: true });
    }
  } catch (error) {
    return jsonError(error);
  }
}

