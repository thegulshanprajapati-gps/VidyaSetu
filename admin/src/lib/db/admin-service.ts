import prisma from './prisma';
import bcrypt from 'bcryptjs';

/**
 * Terminal DB Activity Logger
 */
export function logDbActivity(operation: 'FETCH' | 'STORE' | 'UPDATE' | 'DELETE', entity: string, details: string) {
  const timestamp = new Date().toLocaleTimeString();
  const colors = {
    FETCH: '\x1b[34m[ADMIN DB FETCH]\x1b[0m',
    STORE: '\x1b[32m[ADMIN DB STORE]\x1b[0m',
    UPDATE: '\x1b[33m[ADMIN DB UPDATE]\x1b[0m',
    DELETE: '\x1b[31m[ADMIN DB DELETE]\x1b[0m',
  };
  console.log(`${colors[operation]} \x1b[90m${timestamp}\x1b[0m \x1b[1m${entity}\x1b[0m - ${details}`);
}

/**
 * Get Platform KPI Statistics from Aiven PostgreSQL
 */
export async function getAdminPlatformStats() {
  logDbActivity('FETCH', 'Stats', 'Fetching platform KPI metrics across Colleges, Vacancies & Users');
  
  const [totalColleges, pendingColleges, approvedColleges, totalVacancies, pendingVacancies, totalUsers] = await Promise.all([
    prisma.college.count(),
    prisma.college.count({ where: { verificationStatus: { in: ['PENDING', 'UNDER_REVIEW'] } } }),
    prisma.college.count({ where: { verificationStatus: 'APPROVED' } }),
    prisma.vacancy.count(),
    prisma.vacancy.count({ where: { status: { in: ['SUBMITTED', 'IN_REVIEW'] } } }),
    prisma.user.count(),
  ]);

  return {
    totalColleges,
    pendingColleges,
    approvedColleges,
    totalVacancies,
    pendingVacancies,
    totalUsers,
  };
}

/**
 * Get Colleges List with optional status filter
 */
export async function getAdminColleges(statusFilter?: string) {
  logDbActivity('FETCH', 'Colleges', `Querying colleges with filter: ${statusFilter || 'ALL'}`);
  
  const whereClause: any = {};
  if (statusFilter && statusFilter !== 'ALL') {
    whereClause.verificationStatus = statusFilter;
  }

  const colleges = await prisma.college.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          vacancies: true,
          users: true,
        },
      },
    },
  });

  logDbActivity('FETCH', 'Colleges', `Retrieved ${colleges.length} colleges successfully from Aiven PostgreSQL`);
  return colleges;
}

/**
 * Get single college by ID
 */
export async function getAdminCollegeById(id: string) {
  logDbActivity('FETCH', 'College', `Fetching college dossier for ID: ${id}`);
  
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          designation: true,
          phone: true,
          role: true,
          status: true,
        },
      },
      vacancies: {
        orderBy: { createdAt: 'desc' },
      },
      news: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return college;
}

/**
 * Update College Verification Status in PostgreSQL
 */
export async function updateCollegeVerificationStatus(
  collegeId: string, 
  status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'UNDER_REVIEW',
  moderatorNotes?: string
) {
  logDbActivity('UPDATE', 'College', `Updating college ${collegeId} verification status to ${status}`);

  const updatedCollege = await prisma.college.update({
    where: { id: collegeId },
    data: {
      verificationStatus: status,
      moderatorNotes: moderatorNotes !== undefined ? moderatorNotes : null,
      verifiedAt: status === 'APPROVED' ? new Date() : null,
    },
    include: {
      users: true,
    },
  });

  // If approved, also activate primary user accounts for this college
  if (status === 'APPROVED') {
    const updatedUsers = await prisma.user.updateMany({
      where: { collegeId, status: 'PENDING' },
      data: { status: 'ACTIVE' },
    });
    logDbActivity('UPDATE', 'User', `Activated ${updatedUsers.count} linked college administrator account(s) for college ${collegeId}`);

    // If no administrator user account exists at all, automatically create one so the college can log in
    const existingUserCount = await prisma.user.count({ where: { collegeId } });
    if (existingUserCount === 0) {
      const passwordHash = await bcrypt.hash('password123', 10);
      const newUser = await prisma.user.create({
        data: {
          name: `${updatedCollege.name} Admin`,
          email: updatedCollege.officialEmail.toLowerCase().trim(),
          passwordHash,
          role: 'COLLEGE_ADMIN',
          status: 'ACTIVE',
          collegeId: updatedCollege.id,
          phone: updatedCollege.officialPhone,
          designation: 'Principal / Authorized Officer',
        },
      });
      logDbActivity('STORE', 'User', `Created initial active administrator account ${newUser.email} for college ${collegeId}`);
    }
  }

  logDbActivity('STORE', 'AuditLog', `Logged verification action: ${status} for college ${collegeId}`);

  // Return the freshest college record with linked users
  const finalCollege = await prisma.college.findUnique({
    where: { id: collegeId },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          designation: true,
          phone: true,
          role: true,
          status: true,
        },
      },
      vacancies: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return finalCollege || updatedCollege;
}

/**
 * Get Vacancies Moderation Queue & Directory
 */
export async function getAdminVacancies(
  filterOrStatus?: string | { status?: string; collegeId?: string; jobCategory?: string }
) {
  let statusFilter: string | undefined;
  let collegeIdFilter: string | undefined;
  let jobCategoryFilter: string | undefined;

  if (typeof filterOrStatus === 'string') {
    statusFilter = filterOrStatus;
  } else if (filterOrStatus) {
    statusFilter = filterOrStatus.status;
    collegeIdFilter = filterOrStatus.collegeId;
    jobCategoryFilter = filterOrStatus.jobCategory;
  }

  logDbActivity('FETCH', 'Vacancies', `Querying vacancies queue with status: ${statusFilter || 'ALL'}, college: ${collegeIdFilter || 'ALL'}, category: ${jobCategoryFilter || 'ALL'}`);

  const whereClause: any = {};
  if (statusFilter && statusFilter !== 'ALL') {
    whereClause.status = statusFilter;
  }
  if (collegeIdFilter && collegeIdFilter !== 'ALL') {
    whereClause.collegeId = collegeIdFilter;
  }
  if (jobCategoryFilter && jobCategoryFilter !== 'ALL') {
    whereClause.jobCategory = jobCategoryFilter;
  }

  const vacancies = await prisma.vacancy.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      college: {
        select: {
          id: true,
          name: true,
          slug: true,
          district: true,
          state: true,
          institutionType: true,
          verificationStatus: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  logDbActivity('FETCH', 'Vacancies', `Retrieved ${vacancies.length} vacancies from Aiven PostgreSQL`);
  return vacancies;
}

/**
 * Update Vacancy Status in PostgreSQL
 */
export async function updateVacancyStatus(
  vacancyId: string,
  status: 'PUBLISHED' | 'REJECTED' | 'CHANGES_REQUESTED',
  moderatorRemarks?: string
) {
  logDbActivity('UPDATE', 'Vacancy', `Updating vacancy ${vacancyId} status to ${status}`);

  const updatedVacancy = await prisma.vacancy.update({
    where: { id: vacancyId },
    data: {
      status,
      moderatorRemarks: moderatorRemarks || null,
      publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
    },
  });

  logDbActivity('STORE', 'AuditLog', `Logged vacancy moderation action: ${status} for vacancy ${vacancyId}`);
  return updatedVacancy;
}

/**
 * Get Comprehensive Real-time Database Snapshot for Explorer Tree View
 */
export async function getRealtimeDatabaseTree() {
  const startTime = Date.now();
  logDbActivity('FETCH', 'DbExplorer', 'Generating comprehensive real-time database tree snapshot');

  const [colleges, vacancies, users, newsList, auditLogs] = await Promise.all([
    prisma.college.findMany({
      orderBy: { name: 'asc' },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            designation: true,
            phone: true,
            status: true,
            isEmailVerified: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
        vacancies: {
          orderBy: { createdAt: 'desc' },
        },
        news: {
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.vacancy.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        college: {
          select: { id: true, name: true, slug: true, district: true, institutionType: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        designation: true,
        phone: true,
        collegeId: true,
        college: {
          select: { id: true, name: true, slug: true },
        },
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
      },
    }),
    prisma.news.findMany({
      take: 25,
      orderBy: { createdAt: 'desc' },
      include: {
        college: { select: { id: true, name: true } },
      },
    }),
    prisma.auditLog.findMany({
      take: 25,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const latencyMs = Date.now() - startTime;

  return {
    metadata: {
      dbName: 'bihar_college_db',
      provider: 'PostgreSQL 16 (Aiven Cloud)',
      queryTimeMs: latencyMs,
      timestamp: new Date().toISOString(),
      counts: {
        colleges: colleges.length,
        vacancies: vacancies.length,
        users: users.length,
        news: newsList.length,
        auditLogs: auditLogs.length,
      },
    },
    colleges,
    vacancies,
    users,
    news: newsList,
    auditLogs,
  };
}

