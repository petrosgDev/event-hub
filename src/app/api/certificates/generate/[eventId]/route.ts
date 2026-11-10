import { NextRequest } from 'next/server';
import { certificatesService } from '@/server/services/certificates.service';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.ORGANIZER, Role.SUPER_ADMIN]);
    const { eventId } = await params;

    const result = await certificatesService.generateForEvent(eventId);
    return jsonSuccess(result, 201);
  } catch (error) {
    return jsonError(error);
  }
}

