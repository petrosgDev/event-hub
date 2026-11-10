import { NextRequest } from 'next/server';
import { eventsService } from '@/server/services/events.service';
import { updateEventSchema } from '@/server/schemas/events.schema';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await eventsService.findById(id);
    return jsonSuccess(event);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { id } = await params;
    const body = await req.json();
    const validated = updateEventSchema.parse(body);

    const updated = await eventsService.update(id, validated, user.id, user.role);
    return jsonSuccess(updated);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { id } = await params;

    const result = await eventsService.delete(id, user.id, user.role);
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}

