import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const whereClause: any = {};
    if (category && category !== 'ALL') {
      whereClause.category = category;
    }

    const posts = await prisma.communityPost.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ success: true, posts });
  } catch (error: any) {
    console.error('Failed to get community posts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, category, authorName, authorEmail } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and discussion content are required' },
        { status: 400 }
      );
    }

    // Try to get session user if logged in
    const session = await getServerSession();

    const post = await prisma.communityPost.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        category: category || 'GENERAL',
        authorName: session?.name || authorName?.trim() || 'Candidate Member',
        authorEmail: session?.email || authorEmail?.trim() || null,
        authorRole: session?.role || 'CANDIDATE',
        likes: 0,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('Failed to create community post:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
