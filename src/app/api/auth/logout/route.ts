import { NextRequest } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('refreshToken')?.value;
    if (token) {
      await authService.logout(token);
    }

    const response = jsonSuccess({ message: 'Logged out successfully' });
    response.cookies.delete('refreshToken');
    return response;
  } catch (error) {
    return jsonError(error);
  }
}

