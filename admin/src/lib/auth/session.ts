import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'bihar_admin_session';
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'bihar-college-portal-super-secret-jwt-key-2026-production'
);

export interface AdminSessionUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN';
}

/**
 * Sign Super Admin JWT Session Token
 */
export async function createAdminSessionToken(user: AdminSessionUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

/**
 * Verify Super Admin JWT Session Token
 */
export async function verifyAdminSessionToken(token: string): Promise<AdminSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AdminSessionUser;
  } catch (error) {
    return null;
  }
}

/**
 * Get current admin session user from cookies
 */
export async function getAdminServerSession(): Promise<AdminSessionUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return await verifyAdminSessionToken(token);
}
