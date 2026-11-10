import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import { UnauthorizedError, ForbiddenError } from './errors';
import { Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  universityId: string | null;
  firstName: string;
  lastName: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-change-me';

export async function getAuthUser(req: NextRequest | Request): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get('authorization');
    let token: string | undefined;

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if ('cookies' in req && typeof req.cookies?.get === 'function') {
      token = (req as NextRequest).cookies.get('accessToken')?.value;
    }

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!decoded?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        universityId: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      universityId: user.universityId,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(req: NextRequest | Request): Promise<AuthUser> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }
  return user;
}

export async function requireRoles(
  req: NextRequest | Request,
  allowedRoles: Role[]
): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (!allowedRoles.includes(user.role)) {
    throw new ForbiddenError('Insufficient permissions');
  }
  return user;
}

