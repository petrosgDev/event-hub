import { NextRequest } from 'next/server';
import { eventsService } from '@/server/services/events.service';
import { createEventSchema, eventQuerySchema } from '@/server/schemas/events.schema';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonPaginated, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryObj: Record<string, string> = {};
    searchParams.forEach((val, key) => {
      queryObj[key] = val;
    });

    const validated = eventQuerySchema.parse(queryObj);
    const result = await eventsService.findAll(validated, searchParams);

    return jsonPaginated(result.events, result.total, result.page, result.limit);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const body = await req.json();
    const validated = createEventSchema.parse(body);

    const event = await eventsService.create(validated, user.id, user.universityId);
    return jsonSuccess(event, 201);
  } catch (error) {
    return jsonError(error);
  }
}

