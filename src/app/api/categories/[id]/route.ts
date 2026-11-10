import { NextRequest } from 'next/server';
import prisma from '@/server/prisma';
import { requireRoles } from '@/server/auth';
import { jsonSuccess, jsonError } from '@/server/response';
import { Role } from '@prisma/client';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { events: true },
    });
    if (!category) {
      return jsonError({ message: 'Category not found', statusCode: 404 });
    }
    return jsonSuccess(category);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.SUPER_ADMIN]);
    const { id } = await params;
    const body = await req.json();

    const category = await prisma.category.update({
      where: { id },
      data: body,
    });
    return jsonSuccess(category);
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRoles(req, [Role.ADMIN, Role.SUPER_ADMIN]);
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return jsonSuccess({ message: 'Category deleted' });
  } catch (error) {
    return jsonError(error);
  }
}

