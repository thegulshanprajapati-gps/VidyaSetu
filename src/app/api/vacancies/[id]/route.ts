import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: params.id },
      include: { college: true },
    });

    if (!vacancy) {
      return NextResponse.json({ success: false, error: 'Vacancy not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vacancy });
  } catch (error: any) {
    console.error('Failed to get vacancy:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, moderatorRemarks } = body;

    const data: any = {};
    if (status) data.status = status;
    if (moderatorRemarks !== undefined) data.moderatorRemarks = moderatorRemarks;
    if (status === 'PUBLISHED') data.publishedAt = new Date();

    const updated = await prisma.vacancy.update({
      where: { id: params.id },
      data,
      include: { college: true },
    });

    return NextResponse.json({ success: true, vacancy: updated });
  } catch (error: any) {
    console.error('Failed to update vacancy:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
