import { User } from '@prisma/client';

import { encryptPassword } from '@/lib/auth/passwordUtils';

import prisma from './prisma';

export interface UserParams {
  email: string;
  password: string;
  wallet?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  vat?: string;
}

export async function createUser(params: UserParams): Promise<User> {
  const { email } = params;
  const password = await encryptPassword(params.password);
  const user = await prisma.user.create({
    data: { email, password },
  });

  user.password = '';

  return user;
}
