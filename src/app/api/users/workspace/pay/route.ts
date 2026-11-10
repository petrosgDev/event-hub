import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { chapaService } from '@/server/chapa';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const user = await requireRoles(req, [Role.ORGANIZER]);
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });

    if (!dbUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    if (dbUser.hasPaidWorkspace) {
      return NextResponse.json({ success: false, message: 'Workspace already paid' }, { status: 400 });
    }

    const txRef = `wrk_${user.id}_${Date.now()}`;
    await prisma.user.update({
      where: { id: user.id },
      data: { workspaceTxRef: txRef },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const checkoutUrl = await chapaService.initialize({
      amount: 1000,
      email: dbUser.email,
      first_name: dbUser.firstName,
      last_name: dbUser.lastName,
      tx_ref: txRef,
      callback_url: `${frontendUrl}/api/payments/verify-workspace/${txRef}`,
      return_url: `${frontendUrl}/dashboard/organizer`,
      customization: {
        title: 'EventHub DBU Vendor Workspace',
        description: 'Payment for Organizer Workspace Activation',
      },
    });

    return jsonSuccess({ checkoutUrl });
  } catch (error) {
    return jsonError(error);
  }
}

