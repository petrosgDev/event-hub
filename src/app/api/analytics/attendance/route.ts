import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const attendances = await prisma.attendance.findMany({
      where: { checkedInAt: { gte: sixMonthsAgo } },
      select: { checkedInAt: true, method: true },
    });

    const byMethod = await prisma.attendance.groupBy({
      by: ['method'],
      _count: { method: true },
    });

    return jsonSuccess({
      totalAttendance: attendances.length,
      byMethod: byMethod.map((m) => ({ method: m.method, count: m._count.method })),
    });
  } catch (error) {
    return jsonError(error);
  }
}

