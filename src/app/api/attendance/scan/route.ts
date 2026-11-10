import { NextRequest } from 'next/server';
import { attendanceService } from '@/server/services/attendance.service';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const user = await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const body = await req.json();
    const { qrToken, eventId } = body;

    const result = await attendanceService.scanQr(qrToken, user.id, eventId);
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}

