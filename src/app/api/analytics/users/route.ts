import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.SUPER_ADMIN]);

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    });

    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    });

    return jsonSuccess({
      usersByRole: usersByRole.map((r) => ({ role: r.role, count: r._count.role })),
      activeUsers,
    });
  } catch (error) {
    return jsonError(error);
  }
}

