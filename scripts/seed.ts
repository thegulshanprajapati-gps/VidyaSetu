import { PrismaClient, UserRole, AccountStatus, InstitutionType, OwnershipType, CollegeVerificationStatus, JobCategory, EmploymentType, ApplicationMode, NewsType, NewsStatus, VacancyStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Bihar College Recruitment Portal PostgreSQL database...');

  // 1. Create Platform Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@biharcollegeportal.in' },
    update: {},
    create: {
      name: 'Platform Super Administrator',
      email: 'admin@biharcollegeportal.in',
      passwordHash: '$2a$12$e8Yk2U882dM5N/fE9E5w6.77LkqO2H1O0X3A/1wJ7Xl6B.M9N9P1a', // password123
      role: UserRole.SUPER_ADMIN,
      status: AccountStatus.ACTIVE,
      isEmailVerified: true,
      designation: 'State Technical Directorate Nodal Officer',
    },
  });
  console.log('Provisioned Super Admin:', superAdmin.email);

  // 2. Colleges Data
  const collegesData = [
    {
      slug: 'mit-muzaffarpur',
      name: 'Muzaffarpur Institute of Technology',
      institutionType: InstitutionType.ENGINEERING,
      ownershipType: OwnershipType.GOVERNMENT,
      state: 'Bihar',
      district: 'Muzaffarpur',
      city: 'Muzaffarpur',
      address: 'Brahmapura, Muzaffarpur, Bihar - 842003',
      officialWebsite: 'https://www.mitmuzaffarpur.org',
      officialEmail: 'principal@mitmuzaffarpur.org',
      officialPhone: '+91 621 2262013',
      establishmentYear: 1954,
      affiliationInfo: 'Aryabhatta Knowledge University (AKU) & AICTE Approved',
      description: 'Muzaffarpur Institute of Technology (MIT) is one of the premier state-funded engineering colleges in eastern India, established in 1954.',
      verificationStatus: CollegeVerificationStatus.APPROVED,
    },
    {
      slug: 'bce-bhagalpur',
      name: 'Bhagalpur College of Engineering',
      institutionType: InstitutionType.ENGINEERING,
      ownershipType: OwnershipType.GOVERNMENT,
      state: 'Bihar',
      district: 'Bhagalpur',
      city: 'Bhagalpur',
      address: 'Sabour, Bhagalpur, Bihar - 813210',
      officialWebsite: 'https://www.bcebhagalpur.ac.in',
      officialEmail: 'principal@bcebhagalpur.ac.in',
      officialPhone: '+91 641 2451034',
      establishmentYear: 1960,
      affiliationInfo: 'Bihar Engineering University (BEU) & AICTE Approved',
      description: 'Bhagalpur College of Engineering (BCE) has been nurturing technical talent in Bihar for over six decades.',
      verificationStatus: CollegeVerificationStatus.APPROVED,
    },
    {
      slug: 'gp-patna-7',
      name: 'Government Polytechnic, Patna-7',
      institutionType: InstitutionType.POLYTECHNIC,
      ownershipType: OwnershipType.GOVERNMENT,
      state: 'Bihar',
      district: 'Patna',
      city: 'Patna',
      address: 'Gulzarbagh, Patna, Bihar - 800007',
      officialWebsite: 'https://gppatna7.org',
      officialEmail: 'principal@gppatna7.org',
      officialPhone: '+91 612 2631558',
      establishmentYear: 1955,
      affiliationInfo: 'State Board of Technical Education (SBTE), Bihar',
      description: 'Government Polytechnic Patna-7 is a pioneer institution in technical diploma education under the Department of Science, Technology & Technical Education.',
      verificationStatus: CollegeVerificationStatus.APPROVED,
    },
    {
      slug: 'patna-womens-college',
      name: "Patna Women's College (Autonomous)",
      institutionType: InstitutionType.DEGREE,
      ownershipType: OwnershipType.AIDED,
      state: 'Bihar',
      district: 'Patna',
      city: 'Patna',
      address: 'Bailey Road, Patna, Bihar - 800001',
      officialWebsite: 'https://patnawomenscollege.in',
      officialEmail: 'info@patnawomenscollege.in',
      officialPhone: '+91 612 2531186',
      establishmentYear: 1940,
      affiliationInfo: 'Patna University & NAAC Grade A+ Accredited',
      description: "Patna Women's College is the first higher educational institution for women in Bihar.",
      verificationStatus: CollegeVerificationStatus.APPROVED,
    },
    {
      slug: 'nce-chandi',
      name: 'Nalanda College of Engineering',
      institutionType: InstitutionType.ENGINEERING,
      ownershipType: OwnershipType.GOVERNMENT,
      state: 'Bihar',
      district: 'Nalanda',
      city: 'Chandi',
      address: 'Chandi, Nalanda, Bihar - 803108',
      officialWebsite: 'https://ncechandi.ac.in',
      officialEmail: 'principal@ncechandi.ac.in',
      officialPhone: '+91 6111 278044',
      establishmentYear: 2008,
      affiliationInfo: 'Bihar Engineering University (BEU) & AICTE',
      description: 'Established to revive the historical educational prestige of Nalanda, NCE Chandi provides advanced engineering curricula.',
      verificationStatus: CollegeVerificationStatus.APPROVED,
    },
    {
      slug: 'gce-gaya',
      name: 'Gaya College of Engineering',
      institutionType: InstitutionType.ENGINEERING,
      ownershipType: OwnershipType.GOVERNMENT,
      state: 'Bihar',
      district: 'Gaya',
      city: 'Gaya',
      address: 'Shrikrishnapuram, Gaya, Bihar - 823003',
      officialWebsite: 'https://gcegaya.ac.in',
      officialEmail: 'principal@gcegaya.ac.in',
      officialPhone: '+91 631 2222123',
      establishmentYear: 2008,
      affiliationInfo: 'Bihar Engineering University (BEU)',
      description: 'Government engineering college located in Gaya offering laboratory infrastructure and strong academic mentorship.',
      verificationStatus: CollegeVerificationStatus.UNDER_REVIEW,
    },
    {
      slug: 'magadh-institute-technology',
      name: 'Magadh Institute of Higher Technology',
      institutionType: InstitutionType.POLYTECHNIC,
      ownershipType: OwnershipType.PRIVATE,
      state: 'Bihar',
      district: 'Patna',
      city: 'Danapur',
      address: 'Khagaul Road, Danapur, Patna - 801503',
      officialWebsite: 'https://www.mihtpatna.edu.in',
      officialEmail: 'registrar@mihtpatna.edu.in',
      officialPhone: '+91 612 2998822',
      establishmentYear: 2016,
      affiliationInfo: 'SBTE Bihar & AICTE Approved',
      description: 'Private polytechnic college offering diploma courses in Civil, Mechanical, and Electrical engineering.',
      verificationStatus: CollegeVerificationStatus.PENDING,
    }
  ];

  const collegeMap = new Map();

  for (const c of collegesData) {
    const college = await prisma.college.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    collegeMap.set(c.slug, college);

    // Create a College Admin for each approved college
    if (c.verificationStatus === CollegeVerificationStatus.APPROVED) {
      await prisma.user.upsert({
        where: { email: c.officialEmail },
        update: { collegeId: college.id },
        create: {
          name: `${c.name} Admin`,
          email: c.officialEmail,
          passwordHash: '$2a$12$e8Yk2U882dM5N/fE9E5w6.77LkqO2H1O0X3A/1wJ7Xl6B.M9N9P1a', // password123
          role: UserRole.COLLEGE_ADMIN,
          status: AccountStatus.ACTIVE,
          collegeId: college.id,
          isEmailVerified: true,
          designation: 'Principal / Authorized Signatory',
        },
      });
    }
  }
  console.log(`Synced ${collegesData.length} colleges and admin accounts.`);

  // 3. Vacancies Data
  const mit = collegeMap.get('mit-muzaffarpur');
  const bce = collegeMap.get('bce-bhagalpur');
  const gpPatna = collegeMap.get('gp-patna-7');
  const pwc = collegeMap.get('patna-womens-college');
  const nce = collegeMap.get('nce-chandi');

  if (mit) {
    await prisma.vacancy.upsert({
      where: { slug: 'assistant-professor-cse-mit-muzaffarpur' },
      update: {},
      create: {
        collegeId: mit.id,
        createdById: superAdmin.id,
        updatedById: superAdmin.id,
        title: 'Assistant Professor (Computer Science & Engineering)',
        slug: 'assistant-professor-cse-mit-muzaffarpur',
        department: 'Computer Science & Engineering',
        postName: 'Assistant Professor',
        numberOfPosts: 6,
        jobCategory: JobCategory.TEACHING,
        employmentType: EmploymentType.PERMANENT,
        qualification: 'B.E./B.Tech & M.E./M.Tech in CSE / IT with First Class or equivalent. Ph.D. preferred.',
        experience: 'Minimum 2 years teaching/research experience preferred.',
        ageCriteria: 'Up to 37 years for General (Age relaxation as per Bihar Govt norms).',
        salary: 'Academic Level 10 (Pay Band Rs. 57,700 - 1,82,400)',
        applicationFee: 'Rs. 750 (Rs. 200 for SC/ST/PwD candidates of Bihar)',
        applicationMode: ApplicationMode.ONLINE,
        notificationDate: new Date('2026-10-01'),
        applicationOpenDate: new Date('2026-10-05'),
        applicationCloseDate: new Date('2026-11-15'),
        interviewDate: new Date('2026-11-28'),
        descriptionHtml: '<h2>Recruitment Overview</h2><p>Applications are invited for regular appointment to the post of Assistant Professor (CSE) at MIT Muzaffarpur.</p>',
        notificationPdfUrl: 'https://example.com/notifications/mit-cse-faculty-2026.pdf',
        officialApplyUrl: 'https://www.mitmuzaffarpur.org/recruitment/2026/apply',
        district: 'Muzaffarpur',
        state: 'Bihar',
        status: VacancyStatus.PUBLISHED,
        publishedAt: new Date('2026-10-05'),
      },
    });
  }

  if (gpPatna) {
    await prisma.vacancy.upsert({
      where: { slug: 'guest-lecturer-mechanical-electrical-gp-patna-7' },
      update: {},
      create: {
        collegeId: gpPatna.id,
        createdById: superAdmin.id,
        updatedById: superAdmin.id,
        title: 'Guest Lecturer in Mechanical & Electrical Engineering',
        slug: 'guest-lecturer-mechanical-electrical-gp-patna-7',
        department: 'Mechanical / Electrical Engineering',
        postName: 'Guest Lecturer',
        numberOfPosts: 8,
        jobCategory: JobCategory.TEACHING,
        employmentType: EmploymentType.GUEST_FACULTY,
        qualification: 'B.E./B.Tech in Mechanical or Electrical Engineering with 1st Class.',
        salary: 'Rs. 1,500/- per lecture subject to maximum Rs. 45,000/- per month.',
        applicationMode: ApplicationMode.WALK_IN,
        notificationDate: new Date('2026-10-10'),
        applicationOpenDate: new Date('2026-10-12'),
        applicationCloseDate: new Date('2026-10-30'),
        interviewDate: new Date('2026-11-02'),
        descriptionHtml: '<h2>Walk-in Interview Notice</h2><p>Government Polytechnic, Patna-7 invites qualified technical graduates for walk-in interviews.</p>',
        notificationPdfUrl: 'https://example.com/notifications/gp-patna7-guest-2026.pdf',
        officialApplyUrl: 'https://gppatna7.org/notices/walk-in-schedule',
        district: 'Patna',
        state: 'Bihar',
        status: VacancyStatus.PUBLISHED,
        publishedAt: new Date('2026-10-12'),
      },
    });
  }

  if (bce) {
    await prisma.vacancy.upsert({
      where: { slug: 'lab-assistant-civil-ece-bce-bhagalpur' },
      update: {},
      create: {
        collegeId: bce.id,
        createdById: superAdmin.id,
        updatedById: superAdmin.id,
        title: 'Laboratory Assistant (Civil & Electronics Engineering)',
        slug: 'lab-assistant-civil-ece-bce-bhagalpur',
        department: 'Civil / Electronics & Communication',
        postName: 'Technical Lab Assistant',
        numberOfPosts: 4,
        jobCategory: JobCategory.TECHNICAL,
        employmentType: EmploymentType.CONTRACTUAL,
        qualification: '3-Year State Board Diploma in Civil / ECE or B.Sc. with Physics and Chemistry.',
        salary: 'Consolidated Rs. 28,500/- per month + applicable allowances.',
        applicationMode: ApplicationMode.ONLINE,
        notificationDate: new Date('2026-10-08'),
        applicationOpenDate: new Date('2026-10-10'),
        applicationCloseDate: new Date('2026-11-08'),
        descriptionHtml: '<h2>Technical Post Circular</h2><p>Bhagalpur College of Engineering seeks qualified technical professionals.</p>',
        notificationPdfUrl: 'https://example.com/notifications/bce-lab-asst-2026.pdf',
        officialApplyUrl: 'https://www.bcebhagalpur.ac.in/career/lab-asst-2026',
        district: 'Bhagalpur',
        state: 'Bihar',
        status: VacancyStatus.PUBLISHED,
        publishedAt: new Date('2026-10-10'),
      },
    });
  }

  // 4. News & Notices Data
  if (mit) {
    await prisma.news.upsert({
      where: { slug: 'mit-muzaffarpur-deadline-extension-notice' },
      update: {},
      create: {
        collegeId: mit.id,
        authorId: superAdmin.id,
        contentType: NewsType.NOTICE,
        title: 'Extension of Online Application Deadline for Regular Faculty Recruitment',
        slug: 'mit-muzaffarpur-deadline-extension-notice',
        summary: 'The last date for submission of online application forms for Assistant Professor positions has been extended up to 15th November 2026.',
        bodyHtml: '<p>The competent authority has approved an extension of 10 days for candidate application submission.</p>',
        category: 'Recruitment Notice',
        publishedAt: new Date('2026-10-12'),
        status: NewsStatus.PUBLISHED,
        isImportant: true,
      },
    });
  }

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
