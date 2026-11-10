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

    const config = await prisma.commissionConfig.findUnique({ where: { id: 'default' } });
    const rate = config ? config.rate : 10.0;

    const registration = await prisma.registration.update({
      where: { txRef: tx_ref },
      data: { paymentStatus: 'PAID', status: 'CONFIRMED' },
      include: { event: true },
    });

    const price = registration.event.price || 0;
    const adminAmount = price * (rate / 100);
    const vendorAmount = price - adminAmount;

    await prisma.commission.create({
      data: {
        registrationId: registration.id,
        eventId: registration.eventId,
        vendorId: registration.event.organizerId,
        totalAmount: price,
        commissionRate: rate,
        adminAmount,
        vendorAmount,
      },
    });

    await prisma.registration.update({
      where: { id: registration.id },
      data: {
        commissionRate: rate,
        adminAmount,
        vendorAmount,
      },
    });

    await prisma.event.update({
      where: { id: registration.eventId },
      data: { registeredCount: { increment: 1 } },
    });

    return jsonSuccess({ message: 'Payment successful, registration confirmed' });
  } catch (error) {
    return jsonError(error);
  }
}

