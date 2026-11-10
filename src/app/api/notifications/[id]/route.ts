import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    await prisma.notification.delete({
      where: { id, userId: user.id },
    });

    return jsonSuccess({ message: 'Notification deleted' });
  } catch (error) {
    return jsonError(error);
  }
}

