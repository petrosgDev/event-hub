import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/prisma';
import { chapaService } from '@/server/chapa';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tx_ref: string }> }
) {
  try {
    await requireAuth(req);
    const { tx_ref } = await params;

    const isVerified = await chapaService.verify(tx_ref);
    if (!isVerified) {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { workspaceTxRef: tx_ref },
      data: { hasPaidWorkspace: true },
    });

    return jsonSuccess({ message: 'Workspace payment verified' });
  } catch (error) {
    return jsonError(error);
  }
}

