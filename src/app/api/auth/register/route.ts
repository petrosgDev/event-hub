import { NextRequest } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { registerSchema } from '@/server/schemas/auth.schema';
import { jsonSuccess, jsonError } from '@/server/response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);
    const result = await authService.register(validated);

    const response = jsonSuccess(
      {
        user: result.user,
        accessToken: result.accessToken,
      },
      201
    );

    response.cookies.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    return jsonError(error);
  }
}

