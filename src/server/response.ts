import { NextResponse } from 'next/server';
import { AppError } from './errors';
import { ZodError } from 'zod';

export function jsonSuccess(data: any, statusCode: number = 200, meta?: any) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta && { meta }),
    },
    { status: statusCode }
  );
}

export function jsonPaginated(
  data: any[],
  total: number,
  page: number,
  limit: number
) {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    },
    { status: 200 }
  );
}

export function jsonError(error: any) {
  if (error instanceof ZodError) {
    const issues = (error as any).issues || (error as any).errors || [];
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: issues.map((e: any) => ({
          path: Array.isArray(e.path) ? e.path.join('.') : '',
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        ...(error as any).code && { code: (error as any).code },
        ...(error as any).extra && (error as any).extra,
      },
      { status: error.statusCode }
    );
  }

  console.error('Unhandled API Error:', error);
  return NextResponse.json(
    {
      success: false,
      message: error?.message || 'Internal Server Error',
    },
    { status: 500 }
  );
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now().toString(36);
}
