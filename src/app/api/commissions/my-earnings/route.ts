import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRoles(req, [Role.ORGANIZER, Role.SUPER_ADMIN, Role.ADMIN]);
    const vendorId = user.id;

    const result = await prisma.commission.aggregate({
      where: { vendorId },
      _sum: {
        totalAmount: true,
        adminAmount: true,
        vendorAmount: true,
      },
    });

    const recentTransactions = await prisma.commission.findMany({
      where: { vendorId },
      include: {
        event: { select: { title: true } },
        registration: { select: { status: true, txRef: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return jsonSuccess({
      totals: {
        grossSales: result._sum.totalAmount || 0,
        platformFees: result._sum.adminAmount || 0,
        netEarnings: result._sum.vendorAmount || 0,
      },
      recentTransactions,
    });
  } catch (error) {
    return jsonError(error);
  }
}

