import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveColleges } from '@/lib/db/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const district = searchParams.get('district') || undefined;
    const type = searchParams.get('type') || undefined;
    const q = searchParams.get('q') || undefined;

    const colleges = await fetchLiveColleges({ status, district, type, q });
    return NextResponse.json({ success: true, colleges });
  } catch (error: any) {
    console.error('Failed to get colleges:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
