import { NextRequest } from 'next/server';
import { eventsService } from '@/server/services/events.service';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const event = await eventsService.findBySlug(slug);
    return jsonSuccess(event);
  } catch (error) {
    return jsonError(error);
  }
}

