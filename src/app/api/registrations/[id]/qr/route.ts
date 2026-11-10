import { NextRequest } from 'next/server';
import { registrationsService } from '@/server/services/registrations.service';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    const result = await registrationsService.getQrCode(id, user.id);
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}

