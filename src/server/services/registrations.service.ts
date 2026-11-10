import prisma from '../prisma';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import { chapaService } from '../chapa';

export class RegistrationsService {
  async register(userId: string, eventId: string) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundError('Event');
    if (event.status !== 'PUBLISHED') {
      throw new BadRequestError('Event is not open for registration');
    }
    if (event.registrationDeadline && new Date() > event.registrationDeadline) {
      throw new BadRequestError('Registration deadline has passed');
    }

    const existing = await prisma.registration.findFirst({
      where: { userId, eventId, status: { not: 'CANCELLED' } },
    });
    if (existing && existing.status !== 'CANCELLED') {
      throw new ConflictError('Already registered for this event');
    }

    const isWaitlisted = event.registeredCount >= event.capacity;

    const qrToken = uuidv4();
    const qrExpiry = new Date();
    qrExpiry.setHours(qrExpiry.getHours() + 48);

    const qrData = JSON.stringify({ token: qrToken, eventId, userId });
    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    });

    const registration = existing
      ? await prisma.registration.update({
          where: { id: existing.id },
          data: {
            status: isWaitlisted ? 'WAITLISTED' : 'CONFIRMED',
            qrCode,
            qrToken,
            qrExpiry,
            cancelledAt: null,
          },
          include: {
            event: {
              select: { id: true, title: true, date: true, location: true },
            },
          },
        })
      : await prisma.registration.create({
          data: {
            userId,
            eventId,
            status: isWaitlisted ? 'WAITLISTED' : 'CONFIRMED',
            qrCode,
            qrToken,
            qrExpiry,
          },
          include: {
            event: {
              select: { id: true, title: true, date: true, location: true },
            },
          },
        });

    if (!event.isFree && event.price && event.price > 0) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const txRef = `evt_${event.id}_${Date.now()}`;

      await prisma.registration.update({
        where: { id: registration.id },
        data: { paymentStatus: 'PENDING', txRef },
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const checkoutUrl = await chapaService.initialize({
        amount: event.price,
        email: user?.email || 'student@dbu.edu.et',
        first_name: user?.firstName || 'Student',
        last_name: user?.lastName || 'DBU',
        tx_ref: txRef,
        callback_url: `${frontendUrl}/api/payments/verify-registration/${txRef}`,
        return_url: `${frontendUrl}/dashboard/student/events`,
        customization: {
          title: `Ticket: ${event.title}`,
          description: `Payment for ${event.title} registration`,
        },
      });

      return {
        ...registration,
        requiresPayment: true,
        checkoutUrl,
      };
    }

    if (!isWaitlisted) {
      await prisma.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      });
    }

    await prisma.notification.create({
      data: {
        userId,
        title: isWaitlisted ? 'Added to Waitlist' : 'Registration Confirmed',
        message: `You have been ${isWaitlisted ? 'waitlisted for' : 'registered for'} "${event.title}"`,
        type: 'REGISTRATION_CONFIRMED',
        data: { eventId, registrationId: registration.id },
      },
    });

    return { ...registration, requiresPayment: false };
  }

  async cancel(userId: string, eventId: string) {
    const registration = await prisma.registration.findFirst({
      where: { userId, eventId, status: { not: 'CANCELLED' } },
    });

    if (!registration) throw new NotFoundError('Registration');
    if (registration.status === 'CANCELLED') {
      throw new BadRequestError('Registration already cancelled');
    }

    const wasConfirmed = registration.status === 'CONFIRMED';

    await prisma.registration.update({
      where: { id: registration.id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });

    if (wasConfirmed) {
      await prisma.event.update({
        where: { id: eventId },
        data: { registeredCount: { decrement: 1 } },
      });

      const nextWaitlisted = await prisma.registration.findFirst({
        where: { eventId, status: 'WAITLISTED' },
        orderBy: { registeredAt: 'asc' },
      });

      if (nextWaitlisted) {
        await prisma.registration.update({
          where: { id: nextWaitlisted.id },
          data: { status: 'CONFIRMED' },
        });
        await prisma.event.update({
          where: { id: eventId },
          data: { registeredCount: { increment: 1 } },
        });
      }
    }

    return { message: 'Registration cancelled' };
  }

  async getEventRegistrations(eventId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where: { eventId, status: { not: 'CANCELLED' } },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
              department: true,
              studentId: true,
            },
          },
          attendance: { select: { checkedInAt: true, method: true } },
        },
        orderBy: { registeredAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.registration.count({ where: { eventId, status: { not: 'CANCELLED' } } }),
    ]);

    return { registrations, total, page, limit };
  }

  async getUserRegistrations(userId: string) {
    return prisma.registration.findMany({
      where: { userId, status: { not: 'CANCELLED' } },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            startTime: true,
            endTime: true,
            location: true,
            isOnline: true,
            bannerImage: true,
            status: true,
            category: { select: { name: true, icon: true, color: true } },
          },
        },
        attendance: { select: { checkedInAt: true } },
      },
      orderBy: { registeredAt: 'desc' },
    });
  }

  async getRegistrationById(id: string, userId: string) {
    const registration = await prisma.registration.findFirst({
      where: { id, userId, status: { not: 'CANCELLED' } },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            date: true,
            startTime: true,
            endTime: true,
            location: true,
            isOnline: true,
            bannerImage: true,
            status: true,
            category: { select: { name: true, icon: true, color: true } },
          },
        },
        attendance: { select: { checkedInAt: true } },
      },
    });

    if (!registration) throw new NotFoundError('Registration');
    return registration;
  }

  async getQrCode(registrationId: string, userId: string) {
    const registration = await prisma.registration.findFirst({
      where: { id: registrationId, userId },
    });

    if (!registration) throw new NotFoundError('Registration');
    return { qrCode: registration.qrCode, qrExpiry: registration.qrExpiry };
  }
}

export const registrationsService = new RegistrationsService();

