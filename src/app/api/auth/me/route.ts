import { NextRequest } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const profile = await authService.getMe(user.id);
    return jsonSuccess(profile);
  } catch (error) {
    return jsonError(error);
  }
}

