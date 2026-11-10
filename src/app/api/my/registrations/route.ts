import { NextRequest } from 'next/server';
import { registrationsService } from '@/server/services/registrations.service';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const registrations = await registrationsService.getUserRegistrations(user.id);
    return jsonSuccess(registrations);
  } catch (error) {
    return jsonError(error);
  }
}

