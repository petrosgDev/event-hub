import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { jsonSuccess, jsonError } from '@/server/response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode: code },
      include: {
        user: { select: { firstName: true, lastName: true, department: true } },
        event: { select: { title: true, date: true, location: true } },
      },
    });

    if (!certificate) {
      return jsonError({ message: 'Certificate verification failed: Invalid Code', statusCode: 404 });
    }

    return jsonSuccess({
      valid: true,
      certificate,
    });
  } catch (error) {
    return jsonError(error);
  }
}

