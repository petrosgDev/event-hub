import { NextRequest } from 'next/server';
import { eventsService } from '@/server/services/events.service';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { searchParams } = new URL(req.url);

    const result = await eventsService.getByOrganizer(user.id, searchParams);
    return jsonSuccess(result.events, 200, { total: result.total, page: result.page, limit: result.limit });
  } catch (error) {
    return jsonError(error);
  }
}

