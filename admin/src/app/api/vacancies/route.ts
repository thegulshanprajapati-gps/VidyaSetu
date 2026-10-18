import { NextRequest, NextResponse } from 'next/server';
import { getAdminVacancies } from '@/lib/db/admin-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const collegeId = searchParams.get('collegeId') || undefined;
    const jobCategory = searchParams.get('jobCategory') || undefined;

    const vacancies = await getAdminVacancies({ status, collegeId, jobCategory });
    return NextResponse.json({ success: true, vacancies });
  } catch (error: any) {
    console.error('Failed to get vacancies queue:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

