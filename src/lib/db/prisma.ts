import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'warn' },
    ],
  });

// Bind query events to terminal logging so every DB interaction is printed to the terminal
// @ts-ignore
prisma.$on('query', (e: any) => {
  const shortQuery = e.query.length > 120 ? `${e.query.substring(0, 120)}...` : e.query;
  console.log(`\x1b[36m⚡ [Aiven PostgreSQL Query]\x1b[0m \x1b[33m${shortQuery}\x1b[0m \x1b[32m(${e.duration}ms)\x1b[0m`);
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
