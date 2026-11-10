import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  location: z.string().optional(),
  isOnline: z.boolean().optional().default(false),
  meetingUrl: z.string().url().optional(),
  capacity: z.number().int().min(1).max(10000).optional().default(100),
  categoryId: z.string().uuid().optional(),
  clubId: z.string().uuid().optional(),
  tags: z.array(z.string()).optional().default([]),
  registrationDeadline: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  ticketTiers: z
    .array(
      z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        price: z.number().min(0),
        capacity: z.number().int().min(1),
      })
    )
    .min(1, 'At least one ticket tier is required'),
});

export const updateEventSchema = createEventSchema.partial();

export const eventQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['date', 'popularity', 'title', 'createdAt']).optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type EventQuery = z.infer<typeof eventQuerySchema>;

