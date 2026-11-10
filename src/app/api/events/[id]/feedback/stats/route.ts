import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;

    const stats = await prisma.feedback.aggregate({
      where: { eventId },
      _avg: { rating: true },
      _count: { rating: true },
      _min: { rating: true },
      _max: { rating: true },
    });

    const distribution = await prisma.feedback.groupBy({
      by: ['rating'],
      where: { eventId },
      _count: { rating: true },
    });

    return jsonSuccess({
      averageRating: stats._avg.rating ? Math.round(stats._avg.rating * 10) / 10 : 0,
      totalReviews: stats._count.rating,
      distribution: distribution.map((d) => ({
        rating: d.rating,
        count: d._count.rating,
      })),
    });
  } catch (error) {
    return jsonError(error);
  }
}

