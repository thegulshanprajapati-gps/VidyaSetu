import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveVacancies, createVacancyInDB, fetchVacanciesForCollegeAdmin } from '@/lib/db/service';
import { getServerSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const district = searchParams.get('district') || undefined;
    const collegeId = searchParams.get('collegeId') || undefined;
    const q = searchParams.get('q') || undefined;

    if (collegeId) {
      const vacancies = await fetchVacanciesForCollegeAdmin(collegeId);
      return NextResponse.json({ success: true, vacancies });
    }

    const vacancies = await fetchLiveVacancies({ status, category, district, q });
    return NextResponse.json({ success: true, vacancies });
  } catch (error: any) {
    console.error('Failed to get vacancies:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const body = await req.json();

    const collegeId = session?.collegeId || body.collegeId;
    if (!collegeId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: No institutional association found. Please log in as a college administrator.' },
        { status: 401 }
      );
    }

    if (!body.title || !body.department || !body.postName || !body.qualification || !body.applicationCloseDate) {
      return NextResponse.json(
        { success: false, error: 'Required fields missing: title, department, postName, qualification, applicationCloseDate' },
        { status: 400 }
      );
    }

    const vacancy = await createVacancyInDB({
      collegeId,
      createdById: session?.id,
      title: body.title,
      department: body.department,
      postName: body.postName,
      numberOfPosts: body.numberOfPosts ? Number(body.numberOfPosts) : 1,
      jobCategory: body.jobCategory || 'TEACHING',
      employmentType: body.employmentType || 'CONTRACTUAL',
      qualification: body.qualification,
      experience: body.experience,
      ageCriteria: body.ageCriteria,
      salary: body.salary,
      applicationFee: body.applicationFee,
      applicationMode: body.applicationMode || 'ONLINE',
      notificationDate: body.notificationDate,
      applicationOpenDate: body.applicationOpenDate,
      applicationCloseDate: body.applicationCloseDate,
      interviewDate: body.interviewDate,
      descriptionHtml: body.descriptionHtml || '<p>Recruitment notification</p>',
      notificationPdfUrl: body.notificationPdfUrl,
      officialApplyUrl: body.officialApplyUrl,
      district: body.district || 'Patna',
      state: body.state || 'Bihar',
      status: body.action === 'DRAFT' ? 'DRAFT' : 'SUBMITTED',
    });

    return NextResponse.json({ success: true, vacancy });
  } catch (error: any) {
    console.error('Failed to create vacancy:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
