import React from 'react';
import { fetchLiveColleges } from '@/lib/db/service';
import CollegesDirectoryClient from '@/components/colleges/CollegesDirectoryClient';

export const revalidate = 0; // Fresh query on request so approved colleges appear immediately

export default async function CollegesDirectoryPage() {
  const colleges = await fetchLiveColleges({ status: 'APPROVED' });

  return <CollegesDirectoryClient initialColleges={colleges} />;
}
