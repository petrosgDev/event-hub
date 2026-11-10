import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRoles(req, [Role.SUPER_ADMIN, Role.ADMIN]);

    let config = await prisma.commissionConfig.findUnique({
      where: { id: 'default' },
    });

    if (!config) {
      config = await prisma.commissionConfig.create({
        data: { id: 'default', rate: 10.0 },
      });
    }

    return jsonSuccess({ config });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireRoles(req, [Role.SUPER_ADMIN]);
    const body = await req.json();
    const { rate } = body;

    if (typeof rate !== 'number' || rate < 0 || rate > 100) {
      return NextResponse.json(
        { success: false, message: 'Invalid rate. Must be between 0 and 100.' },
        { status: 400 }
      );
    }

    const config = await prisma.commissionConfig.upsert({
      where: { id: 'default' },
      update: { rate },
      create: { id: 'default', rate },
    });

    return jsonSuccess({ config, message: 'Commission rate updated successfully' });
  } catch (error) {
    return jsonError(error);
  }
}

