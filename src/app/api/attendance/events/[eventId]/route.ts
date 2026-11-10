import { NextRequest } from 'next/server';
import { attendanceService } from '@/server/services/attendance.service';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { eventId } = await params;

    const result = await attendanceService.getEventAttendance(eventId);
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}

