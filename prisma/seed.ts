import { PrismaClient } from '@prisma/client';

import { encryptPassword } from '../src/lib/auth/passwordUtils';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'hello@jdckl.dev' },
    update: {
      role: 'ADMIN',
    },
    create: {
      email: 'hello@jdckl.dev',
      password: await encryptPassword('password'),
      role: 'ADMIN',
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
