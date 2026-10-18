import { NextResponse } from 'next/server';
import { getAdminPlatformStats } from '@/lib/db/admin-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const stats = await getAdminPlatformStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    console.error('Failed to get stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
