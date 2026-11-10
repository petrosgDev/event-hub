import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/server/services/auth.service';
import { jsonSuccess, jsonError } from '@/server/response';

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get('refreshToken')?.value;
    if (!token) {
      try {
        const body = await req.json();
        token = body.refreshToken;
      } catch {}
    }

    if (!token) {
      return NextResponse.json({ success: false, message: 'No refresh token' }, { status: 401 });
    }

    const tokens = await authService.refreshToken(token);

    const response = jsonSuccess({ accessToken: tokens.accessToken });
    response.cookies.set('refreshToken', tokens.refreshToken, {
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

