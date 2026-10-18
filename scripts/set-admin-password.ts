import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function setAdminPassword() {
  const newPassword = process.argv[2] || 'BiharAdmin@2026#Secure';
  const email = process.argv[3] || 'admin@biharcollegeportal.in';

  console.log(`\x1b[36m🔒 [PASSWORD UPDATE]\x1b[0m Updating password for \x1b[1m${email}\x1b[0m in Aiven PostgreSQL...`);

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  const updatedUser = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      status: 'ACTIVE',
    },
    create: {
      name: 'Platform Super Administrator',
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      designation: 'State Technical Directorate Nodal Officer',
    },
  });

  console.log(`\x1b[32m✔ [SUCCESS]\x1b[0m Super Admin credentials updated in Aiven PostgreSQL!`);
  console.log(`--------------------------------------------------------`);
  console.log(`  \x1b[1mPortal URL:\x1b[0m  http://admin.localhost:3000 (or /platform-admin)`);
  console.log(`  \x1b[1mEmail:\x1b[0m       ${updatedUser.email}`);
  console.log(`  \x1b[1mNew Password:\x1b[0m \x1b[33m${newPassword}\x1b[0m`);
  console.log(`--------------------------------------------------------`);
}

setAdminPassword()
  .catch((e) => {
    console.error('Error updating password:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
