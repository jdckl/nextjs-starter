import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}?connection_limit=10`,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
