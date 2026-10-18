import { NextRequest, NextResponse } from 'next/server';
import { updateVacancyStatus } from '@/lib/db/admin-service';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, moderatorRemarks } = body;

    if (!['PUBLISHED', 'REJECTED', 'CHANGES_REQUESTED'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid vacancy status' }, { status: 400 });
    }

    const updated = await updateVacancyStatus(params.id, status, moderatorRemarks);
    return NextResponse.json({ success: true, vacancy: updated });
  } catch (error: any) {
    console.error('Failed to update vacancy status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
