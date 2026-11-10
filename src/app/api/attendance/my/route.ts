import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const attendances = await prisma.attendance.findMany({
      where: { userId: user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
            status: true,
            bannerImage: true,
          },
        },
      },
      orderBy: { checkedInAt: 'desc' },
    });

    const formatted = attendances.map((a) => ({
      ...a,
      status: 'ATTENDED',
    }));

    return jsonSuccess(formatted);
  } catch (error) {
    return jsonError(error);
  }
}

