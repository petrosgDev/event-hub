import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ organizerId: string }> }
) {
  try {
    const user = await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { organizerId } = await params;

    if (user.role === 'ORGANIZER' && user.id !== organizerId) {
      return jsonError({ message: 'Forbidden', statusCode: 403 });
    }

    const [eventsCount, registrationsCount, attendanceCount] = await Promise.all([
      prisma.event.count({ where: { organizerId } }),
      prisma.registration.count({
        where: { event: { organizerId }, status: 'CONFIRMED' },
      }),
      prisma.attendance.count({
        where: { event: { organizerId } },
      }),
    ]);

    const events = await prisma.event.findMany({
      where: { organizerId },
      select: { id: true, title: true, registeredCount: true, viewCount: true, date: true },
      orderBy: { date: 'desc' },
      take: 5,
    });

    return jsonSuccess({
      eventsCount,
      registrationsCount,
      attendanceCount,
      recentEvents: events,
    });
  } catch (error) {
    return jsonError(error);
  }
}

