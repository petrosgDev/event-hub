import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const body = await req.json();
    const { registrationId, method } = body;

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return jsonError({ message: 'Registration not found', statusCode: 404 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        registrationId,
        userId: registration.userId,
        eventId: registration.eventId,
        method: method || 'MANUAL',
      },
    });

    return jsonSuccess(attendance, 201);
  } catch (error) {
    return jsonError(error);
  }
}

