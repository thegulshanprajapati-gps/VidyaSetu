import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  console.log(`\x1b[33m[ADMIN AUTH LOGOUT]\x1b[0m Clearing Super Admin session cookie`);

  const response = NextResponse.json({
    success: true,
    message: 'Super Admin session terminated successfully',
  });

  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
