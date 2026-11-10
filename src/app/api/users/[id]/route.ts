import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(req);
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        department: true,
        bio: true,
        phone: true,
        interests: true,
        streakCount: true,
        badges: true,
        studentId: true,
        hasPaidWorkspace: true,
        createdAt: true,
        university: { select: { id: true, name: true } },
        _count: {
          select: { registrations: true, attendance: true, certificates: true, feedback: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return jsonSuccess(user);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(req);
    const { id } = await params;

    if (authUser.id !== id && !['ADMIN', 'SUPER_ADMIN'].includes(authUser.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { firstName, lastName, department, bio, phone, interests, avatar } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(department !== undefined && { department }),
        ...(bio !== undefined && { bio }),
        ...(phone !== undefined && { phone }),
        ...(interests && { interests }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        avatar: true,
        department: true,
        bio: true,
        interests: true,
        phone: true,
      },
    });

    return jsonSuccess(updated);
  } catch (error) {
    return jsonError(error);
  }
}

