import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.SUPER_ADMIN]);

    const vendors = await prisma.user.findMany({
      where: { role: Role.ORGANIZER, isVerified: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        department: true,
        createdAt: true,
        isActive: true,
        isVerified: true,
        _count: { select: { organizedEvents: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return jsonSuccess(vendors);
  } catch (error) {
    return jsonError(error);
  }
}

