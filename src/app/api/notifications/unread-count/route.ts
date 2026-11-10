import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const count = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    return jsonSuccess({ count });
  } catch (error) {
    return jsonError(error);
  }
}

