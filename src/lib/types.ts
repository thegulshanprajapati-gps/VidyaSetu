export type InstitutionType = 'POLYTECHNIC' | 'ENGINEERING' | 'DEGREE' | 'UNIVERSITY' | 'MEDICAL' | 'OTHER';
export type OwnershipType = 'GOVERNMENT' | 'PRIVATE' | 'AIDED';
export type CollegeVerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED' | 'SUSPENDED';

export type JobCategory = 'TEACHING' | 'NON_TEACHING' | 'TECHNICAL' | 'ADMINISTRATIVE';
export type EmploymentType = 'PERMANENT' | 'CONTRACTUAL' | 'GUEST_FACULTY' | 'TEMPORARY' | 'PART_TIME';
export type VacancyStatus = 'DRAFT' | 'SUBMITTED' | 'IN_REVIEW' | 'PUBLISHED' | 'CHANGES_REQUESTED' | 'REJECTED' | 'CLOSED' | 'ARCHIVED';

export type NewsType = 'NEWS' | 'NOTICE' | 'CIRCULAR';

export interface College {
  id: string;
  name: string;
  slug: string;
  institutionType: InstitutionType;
  ownershipType: OwnershipType;
  state: string;
  district: string;
  city: string;
  address: string;
  officialWebsite?: string;
  officialEmail: string;
  officialPhone: string;
  establishmentYear: number;
  affiliationInfo?: string;
  description: string;
  logoUrl?: string;
  verificationStatus: CollegeVerificationStatus;
  vacanciesCount?: number;
  submittedAt?: string;
}

export interface Vacancy {
  id: string;
  collegeId: string;
  collegeName: string;
  collegeSlug: string;
  collegeLogo?: string;
  title: string;
  slug: string;
  department: string;
  postName: string;
  numberOfPosts?: number;
  jobCategory: JobCategory;
  employmentType: EmploymentType;
  qualification: string;
  experience?: string;
  ageCriteria?: string;
  salary?: string;
  applicationFee?: string;
  applicationMode: 'ONLINE' | 'OFFLINE' | 'WALK_IN' | 'EMAIL';
  notificationDate: string;
  applicationOpenDate: string;
  applicationCloseDate: string;
  interviewDate?: string;
  descriptionHtml: string;
  notificationPdfUrl?: string;
  officialApplyUrl?: string;
  district: string;
  state: string;
  status: VacancyStatus;
  moderatorRemarks?: string;
}

export interface NewsItem {
  id: string;
  collegeId?: string;
  collegeName?: string;
  collegeSlug?: string;
  contentType: NewsType;
  title: string;
  slug: string;
  summary: string;
  bodyHtml: string;
  category: string;
  publishedAt: string;
  attachmentUrl?: string;
  isImportant?: boolean;
}
