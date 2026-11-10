import prisma from '../prisma';
import { AppError } from '../errors';

class ScanError extends AppError {
  public code: string;
  public extra?: Record<string, any>;

  constructor(code: string, message: string, extra?: Record<string, any>) {
    super(message, 400);
    this.code = code;
    this.extra = extra;
  }
}

export class AttendanceService {
  async scanQr(qrToken: string, scannerId: string, selectedEventId?: string) {
    const registration = await prisma.registration.findUnique({
      where: { qrToken },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            studentId: true,
            avatar: true,
            department: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            startTime: true,
            endTime: true,
            organizerId: true,
          },
        },
        attendance: true,
      },
    });

    if (!registration) {
      throw new ScanError(
        'INVALID_QR',
        'This QR code is not recognized. It may be fake or corrupted.'
      );
    }

    if (registration.status !== 'CONFIRMED') {
      throw new ScanError(
        'NOT_CONFIRMED',
        `This registration is currently "${registration.status}". Only confirmed tickets can be scanned.`
      );
    }

    if (selectedEventId && registration.eventId !== selectedEventId) {
      throw new ScanError(
        'WRONG_EVENT',
        `This ticket is for a different event: "${registration.event.title}".`,
        { ticketEventTitle: registration.event.title }
      );
    }

    const eventDate = new Date(registration.event.date);

    const [startHour, startMinute] = registration.event.startTime.split(':').map(Number);
    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const scanWindowStart = new Date(startDateTime.getTime() - 60 * 60 * 1000);

    const [endHour, endMinute] = registration.event.endTime.split(':').map(Number);
    const scanWindowEnd = new Date(eventDate);
    scanWindowEnd.setHours(endHour, endMinute, 0, 0);

    const now = new Date();

    if (now < scanWindowStart) {
      const opensAt = scanWindowStart.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      throw new ScanError(
        'TOO_EARLY',
        `Scanning is not yet available. The scan window opens at ${opensAt} (1 hour before the event starts).`,
        { opensAt, eventStart: registration.event.startTime }
      );
    }

    if (now > scanWindowEnd) {
      throw new ScanError(
        'EVENT_ENDED',
        'This event has already ended. Ticket scanning is no longer available.'
      );
    }

    if (registration.attendance) {
      throw new ScanError(
        'ALREADY_SCANNED',
        `${registration.user.firstName} ${registration.user.lastName} has already been checked in.`,
        {
          user: registration.user,
          checkedInAt: registration.attendance.checkedInAt,
        }
      );
    }

    const attendance = await prisma.attendance.create({
      data: {
        registrationId: registration.id,
        userId: registration.userId,
        eventId: registration.eventId,
        method: 'QR_SCAN',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentId: true,
            avatar: true,
            department: true,
          },
        },
        event: { select: { id: true, title: true } },
      },
    });

    await prisma.user.update({
      where: { id: registration.userId },
      data: { streakCount: { increment: 1 } },
    });

    await prisma.notification.create({
      data: {
        userId: registration.userId,
        title: 'Attendance Marked',
        message: `Your attendance for "${registration.event.title}" has been recorded.`,
        type: 'ATTENDANCE_MARKED',
        data: { eventId: registration.eventId },
      },
    });

    return { ...attendance, code: 'SUCCESS' };
  }

  async getEventAttendance(eventId: string) {
    const attendance = await prisma.attendance.findMany({
      where: { eventId },
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
      },
      orderBy: { checkedInAt: 'desc' },
    });

    const total = await prisma.registration.count({
      where: { eventId, status: 'CONFIRMED' },
    });

    return {
      attendance,
      stats: {
        totalRegistered: total,
        totalAttended: attendance.length,
        attendanceRate: total > 0 ? Math.round((attendance.length / total) * 100) : 0,
      },
    };
  }
}

export const attendanceService = new AttendanceService();

