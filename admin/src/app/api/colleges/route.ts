import { NextRequest, NextResponse } from 'next/server';
import { getAdminColleges } from '@/lib/db/admin-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    const colleges = await getAdminColleges(status);
    return NextResponse.json({ success: true, colleges });
  } catch (error: any) {
    console.error('Failed to get colleges:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
