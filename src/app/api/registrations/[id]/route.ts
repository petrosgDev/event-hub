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

    const registration = await prisma.registration.findFirst({
      where: { id, userId: user.id },
    });

    if (!registration) {
      return jsonError({ message: 'Registration not found', statusCode: 404 });
    }

    await prisma.registration.update({
      where: { id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });

    return jsonSuccess({ message: 'Registration cancelled successfully' });
  } catch (error) {
    return jsonError(error);
  }
}

