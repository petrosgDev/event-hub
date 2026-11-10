import { NextRequest } from 'next/server';
import { registrationsService } from '@/server/services/registrations.service';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id: eventId } = await params;

    const registration = await registrationsService.register(user.id, eventId);
    return jsonSuccess(registration, 201);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id: eventId } = await params;

    const result = await registrationsService.cancel(user.id, eventId);
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}

