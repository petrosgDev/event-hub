import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    await prisma.notification.update({
      where: { id, userId: user.id },
      data: { isRead: true },
    });

    return jsonSuccess({ message: 'Marked as read' });
  } catch (error) {
    return jsonError(error);
  }
}

