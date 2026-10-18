import { NextRequest, NextResponse } from 'next/server';
import { getRealtimeDatabaseTree } from '@/lib/db/admin-service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const data = await getRealtimeDatabaseTree();
    return NextResponse.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    console.error('Failed to get realtime database tree:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Database tree query error' },
      { status: 500 }
    );
  }
}
