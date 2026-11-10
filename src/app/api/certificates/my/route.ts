import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        event: {
          select: { title: true, date: true },
        },
      },
      orderBy: { issuedAt: 'desc' },
    });

    return jsonSuccess(certificates);
  } catch (error) {
    return jsonError(error);
  }
}

