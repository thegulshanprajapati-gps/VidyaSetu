import { NextRequest, NextResponse } from 'next/server';
import { storeCollegeInDB } from '@/lib/db/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(`\x1b[1m\x1b[33m🌐 [API POST /api/college-registration]\x1b[0m Received registration request for: \x1b[1m${body.collegeName}\x1b[0m`);

    const slug = (body.collegeName || 'college')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const result = await storeCollegeInDB({
      name: body.collegeName,
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      institutionType: body.institutionType || 'ENGINEERING',
      ownershipType: body.ownershipType || 'GOVERNMENT',
      state: body.state || 'Bihar',
      district: body.district || 'Patna',
      city: body.city || 'Patna',
      address: body.address || 'Bihar',
      officialWebsite: body.officialWebsite,
      officialEmail: body.officialEmail,
      officialPhone: body.officialPhone,
      establishmentYear: body.establishmentYear ? parseInt(body.establishmentYear) : undefined,
      affiliationInfo: body.affiliationInfo,
      description: body.additionalNotes,
      adminName: body.adminName,
      adminEmail: body.adminEmail,
      adminPhone: body.adminPhone,
      adminDesignation: body.adminDesignation,
    });

    console.log(`\x1b[1m\x1b[32m✔ [REGISTRATION SAVED]\x1b[0m College '${body.collegeName}' successfully committed to Aiven PostgreSQL!`);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: any) {
    console.error(`\x1b[31m❌ [REGISTRATION API ERROR]\x1b[0m ${error.message}`);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
