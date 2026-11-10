import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { events: true } } },
      orderBy: { name: 'asc' },
    });
    return jsonSuccess(categories);
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.SUPER_ADMIN]);
    const body = await req.json();

    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        icon: body.icon,
        color: body.color,
        description: body.description,
      },
    });

    return jsonSuccess(category, 201);
  } catch (error) {
    return jsonError(error);
  }
}

