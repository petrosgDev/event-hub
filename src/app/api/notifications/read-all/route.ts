import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    await prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });

    return jsonSuccess({ message: 'All notifications marked as read' });
  } catch (error) {
    return jsonError(error);
  }
}

