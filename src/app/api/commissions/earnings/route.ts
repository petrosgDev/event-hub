import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    await requireRoles(req, [Role.SUPER_ADMIN, Role.ADMIN]);

    const result = await prisma.commission.aggregate({
      _sum: {
        totalAmount: true,
        adminAmount: true,
        vendorAmount: true,
      },
    });

    const vendorBreakdown = await prisma.commission.groupBy({
      by: ['vendorId'],
      _sum: {
        adminAmount: true,
        vendorAmount: true,
        totalAmount: true,
      },
      orderBy: {
        _sum: {
          adminAmount: 'desc',
        },
      },
      take: 10,
    });

    const vendorIds = vendorBreakdown.map((v) => v.vendorId);
    const vendors = await prisma.user.findMany({
      where: { id: { in: vendorIds } },
      select: { id: true, firstName: true, lastName: true, email: true },
    });

    const breakdownWithNames = vendorBreakdown.map((v) => ({
      ...v,
      vendor: vendors.find((user) => user.id === v.vendorId),
    }));

    return jsonSuccess({
      totals: {
        totalVolume: result._sum.totalAmount || 0,
        platformRevenue: result._sum.adminAmount || 0,
        vendorPayouts: result._sum.vendorAmount || 0,
      },
      vendorBreakdown: breakdownWithNames,
    });
  } catch (error) {
    return jsonError(error);
  }
}

