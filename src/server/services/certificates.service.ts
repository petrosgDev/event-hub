import PDFDocument from 'pdfkit';
import prisma from '../prisma';
import { v4 as uuidv4 } from 'uuid';

export class CertificatesService {
  async generatePdf(certificate: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 50,
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        const width = doc.page.width;
        const height = doc.page.height;

        doc.rect(20, 20, width - 40, height - 40).lineWidth(2).stroke('#1e3a8a');
        doc.rect(25, 25, width - 50, height - 50).lineWidth(1).stroke('#3b82f6');
        doc.rect(30, 30, width - 60, height - 60).fillColor('#f8fafc').fill();

        doc
          .fillColor('#1e3a8a')
          .font('Helvetica-Bold')
          .fontSize(40)
          .text('CERTIFICATE', 0, 100, { align: 'center' });

        doc
          .fillColor('#64748b')
          .font('Helvetica')
          .fontSize(16)
          .text('OF PARTICIPATION', 0, 150, { align: 'center', characterSpacing: 5 });

        doc
          .fillColor('#334155')
          .font('Helvetica')
          .fontSize(14)
          .text('This is proudly presented to', 0, 220, { align: 'center' });

        doc
          .fillColor('#0f172a')
          .font('Helvetica-Bold')
          .fontSize(32)
          .text(
            `${certificate.user.firstName} ${certificate.user.lastName}`,
            0,
            260,
            { align: 'center' }
          );

        doc
          .fillColor('#475569')
          .font('Helvetica')
          .fontSize(14)
          .text('for actively participating in and successfully completing the event', 0, 315, {
            align: 'center',
          });

        doc
          .fillColor('#2563eb')
          .font('Helvetica-Bold')
          .fontSize(22)
          .text(`"${certificate.event.title}"`, 0, 345, { align: 'center' });

        const eventDateStr = new Date(certificate.event.date).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        doc
          .fillColor('#64748b')
          .font('Helvetica')
          .fontSize(12)
          .text(`Held on ${eventDateStr}`, 0, 385, { align: 'center' });

        doc.moveTo(100, 480).lineTo(300, 480).lineWidth(1).stroke('#94a3b8');
        doc
          .fillColor('#64748b')
          .font('Helvetica')
          .fontSize(11)
          .text('Debre Birhan University', 100, 490, { width: 200, align: 'center' });

        doc.moveTo(width - 300, 480).lineTo(width - 100, 480).lineWidth(1).stroke('#94a3b8');
        doc
          .fillColor('#64748b')
          .font('Helvetica')
          .fontSize(11)
          .text('EventHub Platform', width - 300, 490, { width: 200, align: 'center' });

        doc
          .fillColor('#94a3b8')
          .font('Helvetica')
          .fontSize(9)
          .text(
            `Verification Code: ${certificate.verificationCode}  |  Issued: ${new Date(certificate.issuedAt).toISOString().split('T')[0]}`,
            0,
            height - 50,
            { align: 'center' }
          );

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  async generateForEvent(eventId: string) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) return;

    const attendees = await prisma.attendance.findMany({
      where: { eventId },
      include: {
        user: true,
      },
    });

    if (attendees.length === 0) return { generatedCount: 0, eventId };

    let generatedCount = 0;

    for (const attendance of attendees) {
      const existing = await prisma.certificate.findUnique({
        where: {
          userId_eventId: {
            userId: attendance.userId,
            eventId: eventId,
          },
        },
      });

      if (!existing) {
        const verificationCode =
          uuidv4().split('-')[0].toUpperCase() + '-' + Date.now().toString(36).toUpperCase();

        await prisma.certificate.create({
          data: {
            userId: attendance.userId,
            eventId: eventId,
            verificationCode,
          },
        });

        await prisma.notification.create({
          data: {
            userId: attendance.userId,
            title: 'Certificate Ready!',
            message: `Your certificate for "${event.title}" is ready to view and download.`,
            type: 'CERTIFICATE_READY',
            data: { eventId },
          },
        });

        generatedCount++;
      }
    }

    return { generatedCount, eventId };
  }
}

export const certificatesService = new CertificatesService();

