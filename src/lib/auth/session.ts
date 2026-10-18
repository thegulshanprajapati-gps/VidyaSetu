import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'bihar_portal_session';
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bihar-college-portal-super-secret-jwt-key-2026-production'
);

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COLLEGE_ADMIN' | 'MODERATOR' | 'CANDIDATE';
  collegeId?: string | null;
  collegeName?: string | null;
  collegeSlug?: string | null;
}

/**
 * Sign JWT Session Token
 */
export async function createSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

/**
 * Verify JWT Session Token
 */
export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionUser;
  } catch (error) {
    return null;
  }
}

/**
 * Get current session user from cookies (Server Component / Route Handler)
 */
export async function getServerSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
