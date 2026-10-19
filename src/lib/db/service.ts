import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { MOCK_COLLEGES, MOCK_VACANCIES, MOCK_NEWS } from '../mock-data';

export async function fetchLiveVacancies(filters?: {
  q?: string;
  category?: string;
  district?: string;
  status?: string;
}) {
  const startTime = Date.now();
  console.log(`\x1b[1m\x1b[34m📥 [DB FETCH - VACANCIES]\x1b[0m Querying Aiven PostgreSQL (\x1b[33mHost: bihar-college-gulshankumargaurav54-afe4.a.aivencloud.com:28429\x1b[0m, \x1b[36mDB: defaultdb\x1b[0m)...`);

  try {
    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    } else {
      where.status = 'PUBLISHED';
    }

    if (filters?.category) {
      where.jobCategory = filters.category;
    }

    if (filters?.district) {
      where.district = filters.district;
    }

    if (filters?.q) {
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { department: { contains: filters.q, mode: 'insensitive' } },
        { postName: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    const vacancies = await prisma.vacancy.findMany({
      where,
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            institutionType: true,
            district: true,
            state: true,
          },
        },
      },
      orderBy: { applicationCloseDate: 'asc' },
    });

    const elapsed = Date.now() - startTime;
    console.log(`\x1b[1m\x1b[32m✔ [DB FETCH SUCCESS]\x1b[0m Retrieved \x1b[1m${vacancies.length} vacancies\x1b[0m from Aiven PostgreSQL (\x1b[32m${elapsed}ms\x1b[0m)`);

    // Format to match UI interface
    const mapped = vacancies.map((v) => ({
      id: v.id,
      collegeId: v.collegeId,
      collegeName: v.college.name,
      collegeSlug: v.college.slug,
      collegeLogo: v.college.logoUrl || undefined,
      title: v.title,
      slug: v.slug,
      department: v.department,
      postName: v.postName,
      numberOfPosts: v.numberOfPosts || 1,
      jobCategory: v.jobCategory as any,
      employmentType: v.employmentType as any,
      qualification: v.qualification,
      experience: v.experience || undefined,
      ageCriteria: v.ageCriteria || undefined,
      salary: v.salary || undefined,
      applicationFee: v.applicationFee || undefined,
      applicationMode: v.applicationMode as any,
      notificationDate: v.notificationDate.toISOString().split('T')[0],
      applicationOpenDate: v.applicationOpenDate.toISOString().split('T')[0],
      applicationCloseDate: v.applicationCloseDate.toISOString().split('T')[0],
      interviewDate: v.interviewDate ? v.interviewDate.toISOString().split('T')[0] : undefined,
      descriptionHtml: v.descriptionHtml,
      notificationPdfUrl: v.notificationPdfUrl || undefined,
      officialApplyUrl: v.officialApplyUrl || undefined,
      district: v.district,
      state: v.state,
      status: v.status as any,
      moderatorRemarks: v.moderatorRemarks || undefined,
    }));

    if (mapped.length > 0) return mapped;
    if (!filters || Object.keys(filters).length === 0) return MOCK_VACANCIES;
    return [];
  } catch (error: any) {
    console.error(`\x1b[31m❌ [DB FETCH ERROR - VACANCIES]\x1b[0m ${error.message}`);
    console.log(`\x1b[33m⚠️  [FALLBACK]\x1b[0m Using cached fallback dataset while database reconnects.`);
    return MOCK_VACANCIES;
  }
}

export async function fetchLiveColleges(filters?: {
  status?: string;
  district?: string;
  type?: string;
  q?: string;
}) {
  const startTime = Date.now();
  console.log(`\x1b[1m\x1b[36m📥 [DB FETCH - COLLEGES]\x1b[0m Querying Aiven PostgreSQL (\x1b[33mHost: bihar-college-gulshankumargaurav54-afe4.a.aivencloud.com:28429\x1b[0m)...`);

  try {
    const where: any = {};
    if (filters?.status) {
      where.verificationStatus = filters.status;
    }
    if (filters?.district) {
      where.district = filters.district;
    }
    if (filters?.type) {
      where.institutionType = filters.type;
    }
    if (filters?.q) {
      where.OR = [
        { name: { contains: filters.q, mode: 'insensitive' } },
        { city: { contains: filters.q, mode: 'insensitive' } },
        { affiliationInfo: { contains: filters.q, mode: 'insensitive' } },
      ];
    }

    const colleges = await prisma.college.findMany({
      where,
      include: {
        _count: {
          select: {
            vacancies: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const elapsed = Date.now() - startTime;
    console.log(`\x1b[1m\x1b[32m✔ [DB FETCH SUCCESS]\x1b[0m Retrieved \x1b[1m${colleges.length} colleges\x1b[0m from Aiven PostgreSQL (\x1b[32m${elapsed}ms\x1b[0m)`);

    const mapped = colleges.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      institutionType: c.institutionType as any,
      ownershipType: c.ownershipType as any,
      state: c.state,
      district: c.district,
      city: c.city,
      address: c.address,
      officialWebsite: c.officialWebsite || undefined,
      officialEmail: c.officialEmail,
      officialPhone: c.officialPhone,
      establishmentYear: c.establishmentYear || 1950,
      affiliationInfo: c.affiliationInfo || undefined,
      description: c.description || '',
      logoUrl: c.logoUrl || undefined,
      verificationStatus: c.verificationStatus as any,
      vacanciesCount: c._count.vacancies,
      submittedAt: c.createdAt.toISOString().split('T')[0],
    }));

    if (mapped.length > 0) return mapped;
    if (!filters || Object.keys(filters).length === 0) return MOCK_COLLEGES;
    return [];
  } catch (error: any) {
    console.error(`\x1b[31m❌ [DB FETCH ERROR - COLLEGES]\x1b[0m ${error.message}`);
    return MOCK_COLLEGES;
  }
}

export async function fetchLiveNews() {
  const startTime = Date.now();
  console.log(`\x1b[1m\x1b[35m📥 [DB FETCH - NEWS & NOTICES]\x1b[0m Reading circulars from Aiven PostgreSQL...`);

  try {
    const news = await prisma.news.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        college: {
          select: { name: true, slug: true },
        },
      },
      orderBy: { publishedAt: 'desc' },
    });

    const elapsed = Date.now() - startTime;
    console.log(`\x1b[1m\x1b[32m✔ [DB FETCH SUCCESS]\x1b[0m Retrieved \x1b[1m${news.length} news items\x1b[0m from Aiven PostgreSQL (\x1b[32m${elapsed}ms\x1b[0m)`);

    if (news.length > 0) {
      return news.map((n) => ({
        id: n.id,
        collegeId: n.collegeId || undefined,
        collegeName: n.college?.name || undefined,
        collegeSlug: n.college?.slug || undefined,
        contentType: n.contentType as any,
        title: n.title,
        slug: n.slug,
        summary: n.summary,
        bodyHtml: n.bodyHtml,
        category: n.category,
        publishedAt: n.publishedAt ? n.publishedAt.toISOString().split('T')[0] : 'Recent',
        attachmentUrl: n.attachmentUrl || undefined,
        isImportant: n.isImportant,
      }));
    }

    return MOCK_NEWS;
  } catch (error: any) {
    console.error(`\x1b[31m❌ [DB FETCH ERROR - NEWS]\x1b[0m ${error.message}`);
    return MOCK_NEWS;
  }
}

export async function storeCollegeInDB(data: {
  name: string;
  slug: string;
  institutionType: string;
  ownershipType: string;
  state: string;
  district: string;
  city: string;
  address: string;
  officialWebsite?: string;
  officialEmail: string;
  officialPhone: string;
  establishmentYear?: number;
  affiliationInfo?: string;
  description?: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminDesignation: string;
}) {
  const startTime = Date.now();
  console.log(`\x1b[1m\x1b[33m💾 [DB STORE - NEW COLLEGE]\x1b[0m Writing to Aiven PostgreSQL defaultdb table 'College' and 'User'...`);

  try {
    const college = await prisma.college.create({
      data: {
        name: data.name,
        slug: data.slug,
        institutionType: data.institutionType as any,
        ownershipType: data.ownershipType as any,
        state: data.state || 'Bihar',
        district: data.district,
        city: data.city,
        address: data.address,
        officialWebsite: data.officialWebsite,
        officialEmail: data.officialEmail,
        officialPhone: data.officialPhone,
        establishmentYear: data.establishmentYear,
        affiliationInfo: data.affiliationInfo,
        description: data.description || 'Institutional registration pending administrative vetting.',
        verificationStatus: 'PENDING',
      },
    });

    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: data.adminName,
        email: data.adminEmail.toLowerCase().trim(),
        passwordHash,
        role: 'COLLEGE_ADMIN',
        status: 'PENDING',
        collegeId: college.id,
        phone: data.adminPhone,
        designation: data.adminDesignation,
      },
    });

    const elapsed = Date.now() - startTime;
    console.log(`\x1b[1m\x1b[32m✔ [DB STORE COMPLETE]\x1b[0m Successfully stored college \x1b[1m${college.name}\x1b[0m (ID: \x1b[36m${college.id}\x1b[0m) & Admin \x1b[1m${user.email}\x1b[0m in Aiven PostgreSQL! (\x1b[32m${elapsed}ms\x1b[0m)`);

    return { success: true, college, user };
  } catch (error: any) {
    console.error(`\x1b[31m❌ [DB STORE ERROR]\x1b[0m Failed to store college: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch a single live college by its URL slug
 */
export async function getLiveCollegeBySlug(slug: string) {
  try {
    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        vacancies: {
          where: { status: 'PUBLISHED' },
          orderBy: { applicationCloseDate: 'asc' },
        },
        news: {
          where: { status: 'PUBLISHED' },
          orderBy: { publishedAt: 'desc' },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (college) {
      return {
        id: college.id,
        name: college.name,
        slug: college.slug,
        institutionType: college.institutionType as any,
        ownershipType: college.ownershipType as any,
        state: college.state,
        district: college.district,
        city: college.city,
        address: college.address,
        officialWebsite: college.officialWebsite || undefined,
        officialEmail: college.officialEmail,
        officialPhone: college.officialPhone,
        establishmentYear: college.establishmentYear || 1950,
        affiliationInfo: college.affiliationInfo || undefined,
        description: college.description || '',
        logoUrl: college.logoUrl || undefined,
        verificationStatus: college.verificationStatus as any,
        authorizationLetterUrl: college.authorizationLetterUrl || undefined,
        moderatorNotes: college.moderatorNotes || undefined,
        vacancies: college.vacancies.map((v) => ({
          id: v.id,
          collegeId: v.collegeId,
          collegeName: college.name,
          collegeSlug: college.slug,
          collegeLogo: college.logoUrl || undefined,
          title: v.title,
          slug: v.slug,
          department: v.department,
          postName: v.postName,
          numberOfPosts: v.numberOfPosts || 1,
          jobCategory: v.jobCategory as any,
          employmentType: v.employmentType as any,
          qualification: v.qualification,
          experience: v.experience || undefined,
          salary: v.salary || undefined,
          applicationMode: v.applicationMode as any,
          notificationDate: v.notificationDate.toISOString().split('T')[0],
          applicationOpenDate: v.applicationOpenDate.toISOString().split('T')[0],
          applicationCloseDate: v.applicationCloseDate.toISOString().split('T')[0],
          descriptionHtml: v.descriptionHtml,
          district: v.district,
          state: v.state,
          status: v.status as any,
        })),
        news: college.news.map((n) => ({
          id: n.id,
          title: n.title,
          slug: n.slug,
          summary: n.summary,
          category: n.category,
          publishedAt: n.publishedAt ? n.publishedAt.toISOString().split('T')[0] : 'Recent',
        })),
      };
    }

    const mock = MOCK_COLLEGES.find((c) => c.slug === slug);
    if (mock) {
      const mockVacancies = MOCK_VACANCIES.filter((v) => v.collegeId === mock.id && v.status === 'PUBLISHED');
      const mockNews = MOCK_NEWS.filter((n) => n.collegeName === mock.name);
      return { ...mock, vacancies: mockVacancies, news: mockNews };
    }

    return null;
  } catch (error) {
    console.error(`[DB GET COLLEGE BY SLUG ERROR] ${slug}:`, error);
    const mock = MOCK_COLLEGES.find((c) => c.slug === slug);
    if (mock) {
      const mockVacancies = MOCK_VACANCIES.filter((v) => v.collegeId === mock.id && v.status === 'PUBLISHED');
      const mockNews = MOCK_NEWS.filter((n) => n.collegeName === mock.name);
      return { ...mock, vacancies: mockVacancies, news: mockNews };
    }
    return null;
  }
}

/**
 * Fetch a single live college by ID (for admin/inspection)
 */
export async function getLiveCollegeById(id: string) {
  try {
    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            phone: true,
          },
        },
        vacancies: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            vacancies: true,
          },
        },
      },
    });

    if (college) {
      return college;
    }

    const mock = MOCK_COLLEGES.find((c) => c.id === id);
    return mock || null;
  } catch (error) {
    console.error(`[DB GET COLLEGE BY ID ERROR] ${id}:`, error);
    const mock = MOCK_COLLEGES.find((c) => c.id === id);
    return mock || null;
  }
}

/**
 * Fetch a single live vacancy by slug with college & related vacancies
 */
export async function getLiveVacancyBySlug(slug: string) {
  try {
    const vacancy = await prisma.vacancy.findUnique({
      where: { slug },
      include: {
        college: true,
      },
    });

    if (vacancy) {
      const related = await prisma.vacancy.findMany({
        where: {
          id: { not: vacancy.id },
          status: 'PUBLISHED',
          OR: [
            { collegeId: vacancy.collegeId },
            { jobCategory: vacancy.jobCategory },
          ],
        },
        include: { college: true },
        take: 3,
      });

      return {
        vacancy: {
          id: vacancy.id,
          collegeId: vacancy.collegeId,
          collegeName: vacancy.college.name,
          collegeSlug: vacancy.college.slug,
          collegeLogo: vacancy.college.logoUrl || undefined,
          title: vacancy.title,
          slug: vacancy.slug,
          department: vacancy.department,
          postName: vacancy.postName,
          numberOfPosts: vacancy.numberOfPosts || 1,
          jobCategory: vacancy.jobCategory as any,
          employmentType: vacancy.employmentType as any,
          qualification: vacancy.qualification,
          experience: vacancy.experience || undefined,
          ageCriteria: vacancy.ageCriteria || undefined,
          salary: vacancy.salary || undefined,
          applicationFee: vacancy.applicationFee || undefined,
          applicationMode: vacancy.applicationMode as any,
          notificationDate: vacancy.notificationDate.toISOString().split('T')[0],
          applicationOpenDate: vacancy.applicationOpenDate.toISOString().split('T')[0],
          applicationCloseDate: vacancy.applicationCloseDate.toISOString().split('T')[0],
          interviewDate: vacancy.interviewDate ? vacancy.interviewDate.toISOString().split('T')[0] : undefined,
          descriptionHtml: vacancy.descriptionHtml,
          notificationPdfUrl: vacancy.notificationPdfUrl || undefined,
          officialApplyUrl: vacancy.officialApplyUrl || undefined,
          district: vacancy.district,
          state: vacancy.state,
          status: vacancy.status as any,
        },
        college: {
          id: vacancy.college.id,
          name: vacancy.college.name,
          slug: vacancy.college.slug,
          institutionType: vacancy.college.institutionType as any,
          ownershipType: vacancy.college.ownershipType as any,
          district: vacancy.college.district,
          state: vacancy.college.state,
          address: vacancy.college.address,
          officialWebsite: vacancy.college.officialWebsite || undefined,
          officialEmail: vacancy.college.officialEmail,
          officialPhone: vacancy.college.officialPhone,
        },
        relatedVacancies: related.map((r) => ({
          id: r.id,
          collegeId: r.collegeId,
          collegeName: r.college.name,
          collegeSlug: r.college.slug,
          title: r.title,
          slug: r.slug,
          department: r.department,
          postName: r.postName,
          jobCategory: r.jobCategory as any,
          employmentType: r.employmentType as any,
          applicationCloseDate: r.applicationCloseDate.toISOString().split('T')[0],
          district: r.district,
          state: r.state,
          status: r.status as any,
          qualification: r.qualification,
        })),
      };
    }

    const mockVacancy = MOCK_VACANCIES.find((v) => v.slug === slug);
    if (mockVacancy) {
      const mockCollege = MOCK_COLLEGES.find((c) => c.id === mockVacancy.collegeId);
      const mockRelated = MOCK_VACANCIES.filter(
        (v) => v.id !== mockVacancy.id && (v.collegeId === mockVacancy.collegeId || v.jobCategory === mockVacancy.jobCategory)
      ).slice(0, 3);
      return {
        vacancy: mockVacancy,
        college: mockCollege,
        relatedVacancies: mockRelated,
      };
    }

    return null;
  } catch (error) {
    console.error(`[DB GET VACANCY BY SLUG ERROR] ${slug}:`, error);
    const mockVacancy = MOCK_VACANCIES.find((v) => v.slug === slug);
    if (mockVacancy) {
      const mockCollege = MOCK_COLLEGES.find((c) => c.id === mockVacancy.collegeId);
      const mockRelated = MOCK_VACANCIES.filter(
        (v) => v.id !== mockVacancy.id && (v.collegeId === mockVacancy.collegeId || v.jobCategory === mockVacancy.jobCategory)
      ).slice(0, 3);
      return {
        vacancy: mockVacancy,
        college: mockCollege,
        relatedVacancies: mockRelated,
      };
    }
    return null;
  }
}

/**
 * Fetch all vacancies for a specific college admin
 */
export async function fetchVacanciesForCollegeAdmin(collegeId: string) {
  try {
    const vacancies = await prisma.vacancy.findMany({
      where: { collegeId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (vacancies.length > 0) {
      return vacancies.map((v) => ({
        id: v.id,
        collegeId: v.collegeId,
        collegeName: v.college.name,
        collegeSlug: v.college.slug,
        title: v.title,
        slug: v.slug,
        department: v.department,
        postName: v.postName,
        numberOfPosts: v.numberOfPosts || 1,
        jobCategory: v.jobCategory as any,
        employmentType: v.employmentType as any,
        qualification: v.qualification,
        experience: v.experience || undefined,
        salary: v.salary || undefined,
        applicationMode: v.applicationMode as any,
        notificationDate: v.notificationDate.toISOString().split('T')[0],
        applicationOpenDate: v.applicationOpenDate.toISOString().split('T')[0],
        applicationCloseDate: v.applicationCloseDate.toISOString().split('T')[0],
        descriptionHtml: v.descriptionHtml,
        district: v.district,
        state: v.state,
        status: v.status as any,
        createdAt: v.createdAt.toISOString().split('T')[0],
      }));
    }

    // If no vacancies in DB for this college, fallback to mock filtered by collegeId (e.g. col-1)
    return MOCK_VACANCIES.filter((v) => v.collegeId === collegeId);
  } catch (error) {
    console.error(`[DB FETCH VACANCIES FOR COLLEGE ERROR] ${collegeId}:`, error);
    return MOCK_VACANCIES.filter((v) => v.collegeId === collegeId);
  }
}

/**
 * Create a new vacancy in PostgreSQL (from College Admin)
 */
export async function createVacancyInDB(data: {
  collegeId: string;
  createdById?: string;
  title: string;
  department: string;
  postName: string;
  numberOfPosts?: number;
  jobCategory: any;
  employmentType: any;
  qualification: string;
  experience?: string;
  ageCriteria?: string;
  salary?: string;
  applicationFee?: string;
  applicationMode?: any;
  notificationDate?: string;
  applicationOpenDate?: string;
  applicationCloseDate: string;
  interviewDate?: string;
  descriptionHtml: string;
  notificationPdfUrl?: string;
  officialApplyUrl?: string;
  district: string;
  state?: string;
  status?: 'DRAFT' | 'SUBMITTED';
}) {
  const startTime = Date.now();
  console.log(`\x1b[1m\x1b[33m💾 [DB STORE - NEW VACANCY]\x1b[0m Creating vacancy for college ${data.collegeId}...`);

  try {
    // Determine creator User ID
    let creatorId = data.createdById;
    if (!creatorId) {
      const existingUser = await prisma.user.findFirst({
        where: { collegeId: data.collegeId },
      });
      if (existingUser) {
        creatorId = existingUser.id;
      } else {
        // Fallback to any admin user
        const anyAdmin = await prisma.user.findFirst({
          where: { role: 'SUPER_ADMIN' },
        });
        creatorId = anyAdmin?.id || 'system-admin';
      }
    }

    const uniqueSlug = `${data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`;

    const notifDate = data.notificationDate ? new Date(data.notificationDate) : new Date();
    const openDate = data.applicationOpenDate ? new Date(data.applicationOpenDate) : new Date();
    const closeDate = new Date(data.applicationCloseDate);
    const interview = data.interviewDate ? new Date(data.interviewDate) : null;

    const vacancy = await prisma.vacancy.create({
      data: {
        collegeId: data.collegeId,
        createdById: creatorId,
        updatedById: creatorId,
        title: data.title,
        slug: uniqueSlug,
        department: data.department,
        postName: data.postName,
        numberOfPosts: data.numberOfPosts || 1,
        jobCategory: data.jobCategory,
        employmentType: data.employmentType,
        qualification: data.qualification,
        experience: data.experience,
        ageCriteria: data.ageCriteria,
        salary: data.salary,
        applicationFee: data.applicationFee,
        applicationMode: data.applicationMode || 'ONLINE',
        notificationDate: notifDate,
        applicationOpenDate: openDate,
        applicationCloseDate: closeDate,
        interviewDate: interview,
        descriptionHtml: data.descriptionHtml || '<p>Detailed recruitment notice</p>',
        notificationPdfUrl: data.notificationPdfUrl,
        officialApplyUrl: data.officialApplyUrl,
        district: data.district,
        state: data.state || 'Bihar',
        status: data.status || 'SUBMITTED',
        submittedAt: data.status === 'SUBMITTED' ? new Date() : null,
      },
      include: {
        college: true,
      },
    });

    const elapsed = Date.now() - startTime;
    console.log(`\x1b[1m\x1b[32m✔ [DB STORE VACANCY COMPLETE]\x1b[0m Successfully stored vacancy \x1b[1m${vacancy.title}\x1b[0m (ID: \x1b[36m${vacancy.id}\x1b[0m) in Aiven PostgreSQL! (\x1b[32m${elapsed}ms\x1b[0m)`);

    return vacancy;
  } catch (error: any) {
    console.error(`\x1b[31m❌ [DB STORE VACANCY ERROR]\x1b[0m Failed to store vacancy: ${error.message}`);
    throw error;
  }
}

/**
 * Update College Verification Status in PostgreSQL (Root app)
 */
export async function updateCollegeVerificationStatusInDB(
  collegeId: string,
  status: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'UNDER_REVIEW',
  moderatorNotes?: string
) {
  const college = await prisma.college.update({
    where: { id: collegeId },
    data: {
      verificationStatus: status,
      moderatorNotes: moderatorNotes !== undefined ? moderatorNotes : null,
      verifiedAt: status === 'APPROVED' ? new Date() : null,
    },
    include: { users: true },
  });

  if (status === 'APPROVED') {
    await prisma.user.updateMany({
      where: { collegeId, status: 'PENDING' },
      data: { status: 'ACTIVE' },
    });

    const userCount = await prisma.user.count({ where: { collegeId } });
    if (userCount === 0) {
      const passwordHash = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          name: `${college.name} Admin`,
          email: college.officialEmail.toLowerCase().trim(),
          passwordHash,
          role: 'COLLEGE_ADMIN',
          status: 'ACTIVE',
          collegeId: college.id,
          phone: college.officialPhone,
          designation: 'Principal / Authorized Officer',
        },
      });
    }
  }

  return await prisma.college.findUnique({
    where: { id: collegeId },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          phone: true,
        },
      },
      _count: {
        select: {
          vacancies: true,
        },
      },
    },
  });
}

