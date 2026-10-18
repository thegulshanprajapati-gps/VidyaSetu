import { College, Vacancy, NewsItem } from './types';

export const MOCK_COLLEGES: College[] = [
  {
    id: 'col-1',
    name: 'Muzaffarpur Institute of Technology',
    slug: 'mit-muzaffarpur',
    institutionType: 'ENGINEERING',
    ownershipType: 'GOVERNMENT',
    state: 'Bihar',
    district: 'Muzaffarpur',
    city: 'Muzaffarpur',
    address: 'Brahmapura, Muzaffarpur, Bihar - 842003',
    officialWebsite: 'https://www.mitmuzaffarpur.org',
    officialEmail: 'principal@mitmuzaffarpur.org',
    officialPhone: '+91 621 2262013',
    establishmentYear: 1954,
    affiliationInfo: 'Aryabhatta Knowledge University (AKU) & AICTE Approved',
    description: 'Muzaffarpur Institute of Technology (MIT) is one of the premier state-funded engineering colleges in eastern India, established in 1954. It provides undergraduate and postgraduate technical education across multiple engineering disciplines.',
    verificationStatus: 'APPROVED',
    vacanciesCount: 4,
    submittedAt: '2026-08-10'
  },
  {
    id: 'col-2',
    name: 'Bhagalpur College of Engineering',
    slug: 'bce-bhagalpur',
    institutionType: 'ENGINEERING',
    ownershipType: 'GOVERNMENT',
    state: 'Bihar',
    district: 'Bhagalpur',
    city: 'Bhagalpur',
    address: 'Sabour, Bhagalpur, Bihar - 813210',
    officialWebsite: 'https://www.bcebhagalpur.ac.in',
    officialEmail: 'principal@bcebhagalpur.ac.in',
    officialPhone: '+91 641 2451034',
    establishmentYear: 1960,
    affiliationInfo: 'Bihar Engineering University (BEU) & AICTE Approved',
    description: 'Bhagalpur College of Engineering (BCE) has been nurturing technical talent in Bihar for over six decades, featuring modern workshops and distinguished academic faculty.',
    verificationStatus: 'APPROVED',
    vacanciesCount: 3,
    submittedAt: '2026-08-14'
  },
  {
    id: 'col-3',
    name: 'Government Polytechnic, Patna-7',
    slug: 'gp-patna-7',
    institutionType: 'POLYTECHNIC',
    ownershipType: 'GOVERNMENT',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    address: 'Gulzarbagh, Patna, Bihar - 800007',
    officialWebsite: 'https://gppatna7.org',
    officialEmail: 'principal@gppatna7.org',
    officialPhone: '+91 612 2631558',
    establishmentYear: 1955,
    affiliationInfo: 'State Board of Technical Education (SBTE), Bihar',
    description: 'Government Polytechnic Patna-7 is a pioneer institution in technical diploma education under the Department of Science, Technology & Technical Education, Government of Bihar.',
    verificationStatus: 'APPROVED',
    vacanciesCount: 2,
    submittedAt: '2026-08-18'
  },
  {
    id: 'col-4',
    name: "Patna Women's College (Autonomous)",
    slug: 'patna-womens-college',
    institutionType: 'DEGREE',
    ownershipType: 'AIDED',
    state: 'Bihar',
    district: 'Patna',
    city: 'Patna',
    address: 'Bailey Road, Patna, Bihar - 800001',
    officialWebsite: 'https://patnawomenscollege.in',
    officialEmail: 'info@patnawomenscollege.in',
    officialPhone: '+91 612 2531186',
    establishmentYear: 1940,
    affiliationInfo: 'Patna University & NAAC Grade A+ Accredited',
    description: "Patna Women's College is the first higher educational institution for women in Bihar, recognized for academic excellence, holistic education, and vibrant research culture.",
    verificationStatus: 'APPROVED',
    vacanciesCount: 2,
    submittedAt: '2026-08-20'
  },
  {
    id: 'col-5',
    name: 'Nalanda College of Engineering',
    slug: 'nce-chandi',
    institutionType: 'ENGINEERING',
    ownershipType: 'GOVERNMENT',
    state: 'Bihar',
    district: 'Nalanda',
    city: 'Chandi',
    address: 'Chandi, Nalanda, Bihar - 803108',
    officialWebsite: 'https://ncechandi.ac.in',
    officialEmail: 'principal@ncechandi.ac.in',
    officialPhone: '+91 6111 278044',
    establishmentYear: 2008,
    affiliationInfo: 'Bihar Engineering University (BEU) & AICTE',
    description: 'Established to revive the historical educational prestige of Nalanda, NCE Chandi provides advanced engineering curricula and modern computing facilities.',
    verificationStatus: 'APPROVED',
    vacanciesCount: 1,
    submittedAt: '2026-08-25'
  },
  {
    id: 'col-6',
    name: 'Gaya College of Engineering',
    slug: 'gce-gaya',
    institutionType: 'ENGINEERING',
    ownershipType: 'GOVERNMENT',
    state: 'Bihar',
    district: 'Gaya',
    city: 'Gaya',
    address: 'Shrikrishnapuram, Gaya, Bihar - 823003',
    officialWebsite: 'https://gcegaya.ac.in',
    officialEmail: 'principal@gcegaya.ac.in',
    officialPhone: '+91 631 2222123',
    establishmentYear: 2008,
    affiliationInfo: 'Bihar Engineering University (BEU)',
    description: 'Government engineering college located in Gaya offering state-of-the-art laboratory infrastructure and strong academic mentorship.',
    verificationStatus: 'UNDER_REVIEW',
    vacanciesCount: 0,
    submittedAt: '2026-10-14'
  },
  {
    id: 'col-7',
    name: 'Magadh Institute of Higher Technology',
    slug: 'magadh-institute-technology',
    institutionType: 'POLYTECHNIC',
    ownershipType: 'PRIVATE',
    state: 'Bihar',
    district: 'Patna',
    city: 'Danapur',
    address: 'Khagaul Road, Danapur, Patna - 801503',
    officialWebsite: 'https://www.mihtpatna.edu.in',
    officialEmail: 'registrar@mihtpatna.edu.in',
    officialPhone: '+91 612 2998822',
    establishmentYear: 2016,
    affiliationInfo: 'SBTE Bihar & AICTE Approved',
    description: 'Private polytechnic college offering industry-aligned diploma courses in Civil, Mechanical, and Electrical engineering.',
    verificationStatus: 'PENDING',
    vacanciesCount: 0,
    submittedAt: '2026-10-16'
  }
];

export const MOCK_VACANCIES: Vacancy[] = [
  {
    id: 'vac-1',
    collegeId: 'col-1',
    collegeName: 'Muzaffarpur Institute of Technology',
    collegeSlug: 'mit-muzaffarpur',
    title: 'Assistant Professor (Computer Science & Engineering)',
    slug: 'assistant-professor-cse-mit-muzaffarpur',
    department: 'Computer Science & Engineering',
    postName: 'Assistant Professor',
    numberOfPosts: 6,
    jobCategory: 'TEACHING',
    employmentType: 'PERMANENT',
    qualification: 'B.E./B.Tech & M.E./M.Tech in CSE / IT with First Class or equivalent. Ph.D. preferred.',
    experience: 'Minimum 2 years teaching/research experience preferred. Fresh Ph.D. holders are encouraged to apply.',
    ageCriteria: 'Up to 37 years for General (Age relaxation as per Bihar Govt norms for SC/ST/EBC/OBC).',
    salary: 'Academic Level 10 (Pay Band Rs. 57,700 - 1,82,400)',
    applicationFee: 'Rs. 750 (Rs. 200 for SC/ST/PwD candidates of Bihar)',
    applicationMode: 'ONLINE',
    notificationDate: '2026-10-01',
    applicationOpenDate: '2026-10-05',
    applicationCloseDate: '2026-11-15',
    interviewDate: '2026-11-28',
    descriptionHtml: `
      <h2>Recruitment Overview</h2>
      <p>Applications are invited from eligible Indian citizens for regular appointment to the post of <strong>Assistant Professor (Computer Science & Engineering)</strong> at Muzaffarpur Institute of Technology.</p>
      
      <h3>Key Duties & Responsibilities</h3>
      <ul>
        <li>Conduct undergraduate and postgraduate lectures, lab sessions, and seminars.</li>
        <li>Supervise final year capstone engineering projects and research publications.</li>
        <li>Participate actively in departmental curriculum design, NBA accreditation, and NAAC evaluations.</li>
        <li>Support institute administrative duties, examination invigilation, and student mentoring.</li>
      </ul>

      <h3>Selection Procedure</h3>
      <p>Candidates will be shortlisted based on Academic Performance Indicator (API) score followed by written presentation and personal interview before the selection committee.</p>
    `,
    notificationPdfUrl: 'https://example.com/notifications/mit-cse-faculty-2026.pdf',
    officialApplyUrl: 'https://www.mitmuzaffarpur.org/recruitment/2026/apply',
    district: 'Muzaffarpur',
    state: 'Bihar',
    status: 'PUBLISHED'
  },
  {
    id: 'vac-2',
    collegeId: 'col-3',
    collegeName: 'Government Polytechnic, Patna-7',
    collegeSlug: 'gp-patna-7',
    title: 'Guest Lecturer in Mechanical & Electrical Engineering',
    slug: 'guest-lecturer-mechanical-electrical-gp-patna-7',
    department: 'Mechanical / Electrical Engineering',
    postName: 'Guest Lecturer',
    numberOfPosts: 8,
    jobCategory: 'TEACHING',
    employmentType: 'GUEST_FACULTY',
    qualification: 'B.E./B.Tech in Mechanical or Electrical Engineering with 1st Class.',
    experience: 'Previous polytechnic or industrial training experience will be given priority.',
    ageCriteria: 'Minimum 21 years. Maximum age criteria as per State Technical Education norms.',
    salary: 'Rs. 1,500/- per lecture subject to maximum Rs. 45,000/- per month.',
    applicationFee: 'Nil',
    applicationMode: 'WALK_IN',
    notificationDate: '2026-10-10',
    applicationOpenDate: '2026-10-12',
    applicationCloseDate: '2026-10-30',
    interviewDate: '2026-11-02',
    descriptionHtml: `
      <h2>Walk-in Interview Notice</h2>
      <p>Government Polytechnic, Patna-7 invites qualified technical graduates for walk-in interviews for the position of Guest Faculty for the academic session 2026-2027.</p>
      
      <h3>Instructions for Candidates</h3>
      <ul>
        <li>Bring original certificates along with two sets of self-attested photocopies.</li>
        <li>Carry updated curriculum vitae and two passport-sized photographs.</li>
        <li>Reporting time on 02 November 2026 is 09:30 AM in the Administrative Block.</li>
      </ul>
    `,
    notificationPdfUrl: 'https://example.com/notifications/gp-patna7-guest-2026.pdf',
    officialApplyUrl: 'https://gppatna7.org/notices/walk-in-schedule',
    district: 'Patna',
    state: 'Bihar',
    status: 'PUBLISHED'
  },
  {
    id: 'vac-3',
    collegeId: 'col-2',
    collegeName: 'Bhagalpur College of Engineering',
    collegeSlug: 'bce-bhagalpur',
    title: 'Laboratory Assistant (Civil & Electronics Engineering)',
    slug: 'lab-assistant-civil-ece-bce-bhagalpur',
    department: 'Civil / Electronics & Communication',
    postName: 'Technical Lab Assistant',
    numberOfPosts: 4,
    jobCategory: 'TECHNICAL',
    employmentType: 'CONTRACTUAL',
    qualification: '3-Year State Board Diploma in Civil / ECE or B.Sc. with Physics and Chemistry.',
    experience: '1 year experience handling soil testing, concrete testing, or electronic circuits laboratory.',
    ageCriteria: '18 to 35 years as on 01-10-2026.',
    salary: 'Consolidated Rs. 28,500/- per month + applicable allowances.',
    applicationFee: 'Rs. 300 (General/OBC), Rs. 100 (SC/ST).',
    applicationMode: 'ONLINE',
    notificationDate: '2026-10-08',
    applicationOpenDate: '2026-10-10',
    applicationCloseDate: '2026-11-08',
    interviewDate: '2026-11-20',
    descriptionHtml: `
      <h2>Technical Post Circular</h2>
      <p>Bhagalpur College of Engineering seeks qualified technical professionals to supervise engineering lab experiments, maintain equipment calibration, and manage student batch assignments.</p>
    `,
    notificationPdfUrl: 'https://example.com/notifications/bce-lab-asst-2026.pdf',
    officialApplyUrl: 'https://www.bcebhagalpur.ac.in/career/lab-asst-2026',
    district: 'Bhagalpur',
    state: 'Bihar',
    status: 'PUBLISHED'
  },
  {
    id: 'vac-4',
    collegeId: 'col-4',
    collegeName: "Patna Women's College (Autonomous)",
    collegeSlug: 'patna-womens-college',
    title: 'Assistant Professor (Commerce & Management Studies)',
    slug: 'assistant-professor-commerce-patna-womens-college',
    department: 'Commerce & Business Administration',
    postName: 'Assistant Professor',
    numberOfPosts: 2,
    jobCategory: 'TEACHING',
    employmentType: 'PERMANENT',
    qualification: 'Master’s Degree in Commerce/Management with minimum 55% marks and UGC NET / SLET qualification.',
    experience: 'Minimum 3 years teaching at collegiate level.',
    ageCriteria: 'As per UGC and Patna University statutes.',
    salary: 'UGC 7th CPC Scales (Level 10)',
    applicationFee: 'Rs. 1,000/-',
    applicationMode: 'OFFLINE',
    notificationDate: '2026-09-25',
    applicationOpenDate: '2026-10-01',
    applicationCloseDate: '2026-11-05',
    interviewDate: '2026-11-18',
    descriptionHtml: `
      <h2>Department of Commerce Vacancy</h2>
      <p>Patna Women's College (Autonomous) invites applications from dedicated female candidates for permanent faculty positions in the Department of Commerce.</p>
    `,
    notificationPdfUrl: 'https://example.com/notifications/pwc-commerce-fac.pdf',
    officialApplyUrl: 'https://patnawomenscollege.in/careers',
    district: 'Patna',
    state: 'Bihar',
    status: 'PUBLISHED'
  },
  {
    id: 'vac-5',
    collegeId: 'col-5',
    collegeName: 'Nalanda College of Engineering',
    collegeSlug: 'nce-chandi',
    title: 'Assistant Registrar (Administration & Examinations)',
    slug: 'assistant-registrar-nce-chandi',
    department: 'Institute Administration',
    postName: 'Assistant Registrar',
    numberOfPosts: 1,
    jobCategory: 'ADMINISTRATIVE',
    employmentType: 'PERMANENT',
    qualification: 'Postgraduate degree with at least 55% marks and 5 years supervisory administrative experience.',
    experience: 'Experience in university examinations, recruitment, or academic administration.',
    ageCriteria: 'Up to 40 years.',
    salary: 'Pay Band 3 (Rs. 15,600 - 39,100 with GP 5,400)',
    applicationFee: 'Rs. 500',
    applicationMode: 'ONLINE',
    notificationDate: '2026-10-12',
    applicationOpenDate: '2026-10-15',
    applicationCloseDate: '2026-11-20',
    descriptionHtml: `
      <h2>Administrative Appointment Notice</h2>
      <p>Applications are invited for the position of Assistant Registrar to head academic records and statutory compliance at NCE Chandi.</p>
    `,
    district: 'Nalanda',
    state: 'Bihar',
    status: 'PUBLISHED'
  },
  {
    id: 'vac-6',
    collegeId: 'col-1',
    collegeName: 'Muzaffarpur Institute of Technology',
    collegeSlug: 'mit-muzaffarpur',
    title: 'Workshop Instructor (Carpentry / Welding / Foundry)',
    slug: 'workshop-instructor-mit-muzaffarpur',
    department: 'Central Mechanical Workshop',
    postName: 'Workshop Instructor',
    numberOfPosts: 3,
    jobCategory: 'TECHNICAL',
    employmentType: 'CONTRACTUAL',
    qualification: 'Diploma in Mechanical Engineering or National Trade Certificate (ITI) with 3 years shop floor experience.',
    applicationMode: 'OFFLINE',
    notificationDate: '2026-10-15',
    applicationOpenDate: '2026-10-15',
    applicationCloseDate: '2026-11-10',
    descriptionHtml: '<p>Central Workshop maintenance and student practical guidance.</p>',
    district: 'Muzaffarpur',
    state: 'Bihar',
    status: 'SUBMITTED',
    moderatorRemarks: 'Pending review by platform moderator'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    collegeName: 'State Board of Technical Education, Bihar',
    contentType: 'CIRCULAR',
    title: 'Standardized Guidelines for Polytechnic Guest Lecturer Emoluments & Leave Rules',
    slug: 'polytechnic-guest-lecturer-guidelines-2026',
    summary: 'Department of Science, Technology and Technical Education issues revised compensation and workload guidelines for guest faculties in state polytechnics.',
    bodyHtml: '<p>Official circular detailing daily lecture allowances, maximum ceilings, and mandatory attendance biometric norms across all 46 government polytechnic colleges in Bihar.</p>',
    category: 'Regulations',
    publishedAt: '2026-10-15',
    isImportant: true
  },
  {
    id: 'news-2',
    collegeName: 'Muzaffarpur Institute of Technology',
    contentType: 'NOTICE',
    title: 'Extension of Online Application Deadline for Regular Faculty Recruitment',
    slug: 'mit-muzaffarpur-deadline-extension-notice',
    summary: 'The last date for submission of online application forms for Assistant Professor positions has been extended up to 15th November 2026.',
    bodyHtml: '<p>Due to technical maintenance on the payment gateway, the competent authority has approved an extension of 10 days for candidate fee submission.</p>',
    category: 'Recruitment Notice',
    publishedAt: '2026-10-12',
    isImportant: true
  },
  {
    id: 'news-3',
    collegeName: 'Bihar Engineering University (BEU)',
    contentType: 'NEWS',
    title: 'BEU Announces Centralized Research Grant Scheme for Engineering Faculties',
    slug: 'beu-centralized-research-grant-scheme',
    summary: 'Seed funding grants of up to Rs. 5 Lakhs announced for newly appointed faculty members conducting research in AI, EV technology, and disaster management.',
    bodyHtml: '<p>Bihar Engineering University invites research proposals from registered faculty members across all affiliated government and private engineering institutes.</p>',
    category: 'Academic News',
    publishedAt: '2026-10-05',
    isImportant: false
  }
];
