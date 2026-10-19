import React from 'react';
import { getServerSession } from '@/lib/auth/session';
import { fetchVacanciesForCollegeAdmin } from '@/lib/db/service';
import prisma from '@/lib/db/prisma';
import CollegeAdminDashboardClient from '@/components/college-admin/CollegeAdminDashboardClient';

export const revalidate = 0; // Fresh query on each request

export default async function CollegeAdminDashboard() {
  const session = await getServerSession();

  let collegeId = session?.collegeId;
  let collegeName = session?.collegeName || 'Institutional Workspace';

  // If session doesn't specify collegeId, find the first college
  if (!collegeId) {
    const firstCollege = await prisma.college.findFirst({
      where: { verificationStatus: 'APPROVED' },
    });
    collegeId = firstCollege?.id || 'col-1';
    collegeName = firstCollege?.name || 'Muzaffarpur Institute of Technology';
  } else if (!session?.collegeName) {
    const col = await prisma.college.findUnique({ where: { id: collegeId } });
    if (col) collegeName = col.name;
  }

  const vacancies = await fetchVacanciesForCollegeAdmin(collegeId);

  return (
    <CollegeAdminDashboardClient
      initialVacancies={vacancies}
      collegeName={collegeName}
      collegeId={collegeId}
    />
  );
}
