import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { jsonSuccess, jsonPaginated, parsePagination, jsonError } from '@/server/response';
import { BadRequestError } from '@/server/errors';
import { z } from 'zod';

const feedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { searchParams } = new URL(req.url);
    const { page, limit, skip } = parsePagination(searchParams);

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where: { eventId },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.feedback.count({ where: { eventId } }),
    ]);

    return jsonPaginated(feedback, total, page, limit);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id: eventId } = await params;
    const body = await req.json();
    const validated = feedbackSchema.parse(body);

    const attendance = await prisma.attendance.findUnique({
      where: { userId_eventId: { userId: user.id, eventId } },
    });

    if (!attendance) {
      throw new BadRequestError('You must attend the event to give feedback');
    }

    const feedback = await prisma.feedback.upsert({
      where: { userId_eventId: { userId: user.id, eventId } },
      update: { rating: validated.rating, comment: validated.comment },
      create: {
        userId: user.id,
        eventId,
        rating: validated.rating,
        comment: validated.comment,
      },
    });

    return jsonSuccess(feedback);
  } catch (error) {
    return jsonError(error);
  }
}

