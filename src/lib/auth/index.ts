import { User } from '@prisma/client';

import prisma from '@/lib/api/prisma';

import { verifyPassword } from './passwordUtils';

export interface LoginParams {
  username: string;
  password: string;
}

export async function login(params: LoginParams): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email: params.username },
  });

  if (!user) return null;

  if (await verifyPassword(user.password, params.password)) {
    user.password = '';
    return user;
  }

  return null;
}
