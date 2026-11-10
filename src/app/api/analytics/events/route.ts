import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);

    const eventsByStatus = await prisma.event.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyEvents = await prisma.event.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { createdAt: true },
    });

    const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (11 - i));
      const month = d.toLocaleString('default', { month: 'short', year: 'numeric' });
      const count = monthlyEvents.filter((e) => {
        const eDate = new Date(e.createdAt);
        return eDate.getMonth() === d.getMonth() && eDate.getFullYear() === d.getFullYear();
      }).length;
      return { month, count };
    });

    const topEvents = await prisma.event.findMany({
      select: { id: true, title: true, registeredCount: true, viewCount: true },
      orderBy: { registeredCount: 'desc' },
      take: 10,
    });

    return jsonSuccess({
      eventsByStatus: eventsByStatus.map((s) => ({ status: s.status, count: s._count.status })),
      monthlyTrend,
      topEvents,
    });
  } catch (error) {
    return jsonError(error);
  }
}

