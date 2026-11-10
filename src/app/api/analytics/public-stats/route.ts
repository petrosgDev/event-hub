import prisma from '@/server/prisma';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET() {
  try {
    const [totalStudents, totalOrganizers, totalEvents, avgFeedback] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'ORGANIZER' } }),
      prisma.event.count({ where: { status: { in: ['PUBLISHED', 'COMPLETED', 'ONGOING'] } } }),
      prisma.feedback.aggregate({ _avg: { rating: true } }),
    ]);

    const satisfaction = avgFeedback._avg.rating
      ? Math.round((avgFeedback._avg.rating / 5) * 100)
      : 98;

    return jsonSuccess({
      students: totalStudents > 1000 ? `${Math.floor(totalStudents / 1000)}K+` : `${totalStudents}+`,
      events: `${totalEvents}+`,
      organizers: `${totalOrganizers}+`,
      satisfaction: `${satisfaction}%`,
    });
  } catch (error) {
    return jsonError(error);
  }
}

