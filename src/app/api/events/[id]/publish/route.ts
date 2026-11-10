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
    await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { id } = await params;

    const event = await prisma.event.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });

    return jsonSuccess(event);
  } catch (error) {
    return jsonError(error);
  }
}

