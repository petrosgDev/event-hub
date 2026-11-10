import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/server/prisma';
import { requireAuth } from '@/server/auth';
import { certificatesService } from '@/server/services/certificates.service';
import { jsonError } from '@/server/response';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    const { id } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        user: true,
        event: true,
      },
    });

    if (!certificate) {
      return jsonError({ message: 'Certificate not found', statusCode: 404 });
    }

    if (
      user.id !== certificate.userId &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return jsonError({ message: 'Certificate not found', statusCode: 404 });
    }

    const pdfBuffer = await certificatesService.generatePdf(certificate);

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Certificate-${certificate.event.slug || 'EventHub'}.pdf"`,
      },
    });
  } catch (error) {
    return jsonError(error);
  }
}

