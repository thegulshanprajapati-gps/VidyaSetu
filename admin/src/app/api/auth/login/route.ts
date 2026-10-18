import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { createAdminSessionToken, ADMIN_SESSION_COOKIE, AdminSessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    console.log(`\x1b[35m[ADMIN AUTH ATTEMPT]\x1b[0m Checking credentials for: \x1b[1m${email}\x1b[0m`);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      console.log(`\x1b[31m[ADMIN AUTH FAILED]\x1b[0m User ${email} not found in PostgreSQL`);
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    if (user.role !== 'SUPER_ADMIN') {
      console.log(`\x1b[31m[ADMIN AUTH FAILED]\x1b[0m User ${email} does not possess SUPER_ADMIN role`);
      return NextResponse.json({ success: false, error: 'Access restricted to Platform Super Administrators' }, { status: 403 });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.log(`\x1b[31m[ADMIN AUTH FAILED]\x1b[0m Password hash mismatch for ${email}`);
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const adminUser: AdminSessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: 'SUPER_ADMIN',
    };

    // Generate signed JWT
    const token = await createAdminSessionToken(adminUser);

    console.log(`\x1b[32m[ADMIN AUTH SUCCESS]\x1b[0m Super Admin session initialized: \x1b[1m${email}\x1b[0m`);

    const response = NextResponse.json({
      success: true,
      user: adminUser,
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
