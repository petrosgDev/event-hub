import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRoles(req, [Role.SUPER_ADMIN, Role.ADMIN]);
    const { id } = await params;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true, isVerified: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isVerified: true,
      },
    });

    return jsonSuccess(user, 200, { message: 'User activated successfully' });
  } catch (error) {
    return jsonError(error);
  }
}

