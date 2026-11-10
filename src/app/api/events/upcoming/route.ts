import { NextRequest } from 'next/server';
import { eventsService } from '@/server/services/events.service';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const events = await eventsService.getUpcoming(limit);
    return jsonSuccess(events);
  } catch (error) {
    return jsonError(error);
  }
}

