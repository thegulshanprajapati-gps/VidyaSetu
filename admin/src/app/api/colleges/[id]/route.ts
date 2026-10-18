import { NextRequest, NextResponse } from 'next/server';
import { getAdminCollegeById, updateCollegeVerificationStatus } from '@/lib/db/admin-service';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const college = await getAdminCollegeById(params.id);
    if (!college) {
      return NextResponse.json({ success: false, error: 'College not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, college });
  } catch (error: any) {
    console.error('Failed to get college details:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, moderatorNotes } = body;

    if (!['APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'UNDER_REVIEW'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid verification status' }, { status: 400 });
    }

    const updated = await updateCollegeVerificationStatus(params.id, status, moderatorNotes);
    return NextResponse.json({ success: true, college: updated });
  } catch (error: any) {
    console.error('Failed to update college status:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
