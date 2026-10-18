import React from 'react';
import { fetchLiveVacancies, fetchLiveColleges } from '@/lib/db/service';
import VacanciesDirectoryClient from '@/components/vacancies/VacanciesDirectoryClient';

export const revalidate = 0; // Fresh query on request

export default async function VacanciesPage() {
  const [vacancies, colleges] = await Promise.all([
    fetchLiveVacancies(),
    fetchLiveColleges({ status: 'APPROVED' }),
  ]);

  return <VacanciesDirectoryClient initialVacancies={vacancies} initialColleges={colleges} />;
}
