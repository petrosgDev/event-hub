import { NextRequest } from 'next/server';
import { registrationsService } from '@/server/services/registrations.service';
import { requireRoles } from '@/server/auth';
import { jsonPaginated, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { id: eventId } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await registrationsService.getEventRegistrations(eventId, page, limit);
    return jsonPaginated(result.registrations, result.total, result.page, result.limit);
  } catch (error) {
    return jsonError(error);
  }
}

