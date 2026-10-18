import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.communityPost.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    await prisma.communityPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Post successfully deleted by administrator / moderator.',
    });
  } catch (error: any) {
    console.error('Failed to delete community post:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await req.json();

    if (action === 'like') {
      const updated = await prisma.communityPost.update({
        where: { id: params.id },
        data: { likes: { increment: 1 } },
      });
      return NextResponse.json({ success: true, post: updated });
    }

    if (action === 'flag') {
      const updated = await prisma.communityPost.update({
        where: { id: params.id },
        data: { isFlagged: true },
      });
      return NextResponse.json({ success: true, post: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Failed to update community post:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
