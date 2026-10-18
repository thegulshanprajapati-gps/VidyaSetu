import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { createSessionToken, SESSION_COOKIE_NAME, SessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    console.log(`\x1b[34m[PORTAL AUTH ATTEMPT]\x1b[0m Checking credentials for: \x1b[1m${email}\x1b[0m`);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (!user) {
      console.log(`\x1b[31m[PORTAL AUTH FAILED]\x1b[0m No account found for: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.log(`\x1b[31m[PORTAL AUTH FAILED]\x1b[0m Password hash mismatch for: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      console.log(`\x1b[33m[PORTAL AUTH BLOCKED]\x1b[0m Account status is ${user.status} for: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Your account is pending verification by the State Directorate.' },
        { status: 403 }
      );
    }

    // Prepare session payload
    const sessionUser: SessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      collegeName: user.college?.name || null,
      collegeSlug: user.college?.slug || null,
    };

    // Create signed JWT
    const token = await createSessionToken(sessionUser);

    console.log(`\x1b[32m[PORTAL AUTH SUCCESS]\x1b[0m Session initialized for: \x1b[1m${user.name}\x1b[0m (${user.role})`);

    // Update lastLoginAt in PostgreSQL
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
    });

    // Set HTTP-only secure session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Portal login error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
