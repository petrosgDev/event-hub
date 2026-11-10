import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRoles(req, [Role.SUPER_ADMIN]);
    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    if (!['STUDENT', 'ORGANIZER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    return jsonSuccess(user);
  } catch (error) {
    return jsonError(error);
  }
}

