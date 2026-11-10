import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.SUPER_ADMIN]);

    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalAttendance,
      activeEvents,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.registration.count({ where: { status: 'CONFIRMED' } }),
      prisma.attendance.count(),
      prisma.event.count({ where: { status: 'PUBLISHED', date: { gte: new Date() } } }),
      prisma.user.count({
        where: { createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
      }),
    ]);

    const attendanceRate =
      totalRegistrations > 0 ? Math.round((totalAttendance / totalRegistrations) * 100) : 0;

    return jsonSuccess({
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalAttendance,
      activeEvents,
      recentUsers,
      attendanceRate,
    });
  } catch (error) {
    return jsonError(error);
  }
}

