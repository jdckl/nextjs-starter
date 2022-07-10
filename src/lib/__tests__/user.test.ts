import prisma from '@/lib/api/prisma';
import { testHelper } from '@/lib/testHelper';

import { createUser } from '../api/users';
import { login } from '../auth';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: function () {
      return {
        user: {
          findUnique: jest.fn(),
          create: jest.fn(),
        },
      };
    },
  };
});

jest.mock('../auth/passwordUtils', () => ({
  verifyPassword: () => jest.fn().mockResolvedValue(true),
  encryptPassword: () => jest.fn().mockResolvedValue('encryptedpw'),
}));

describe('Login method', () => {
  it('succesfuly login', async () => {
    const user = testHelper.mockUser();
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

    const call = await login({ username: user.email, password: user.password });
    expect(call).toMatchObject(
      expect.objectContaining({
        email: user.email,
        password: '',
      })
    );
  });

  it('user not found', async () => {
    const user = testHelper.mockUser();
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    const call = await login({ username: user.email, password: user.password });
    expect(call).toBe(null);
  });
});

describe('CreateUser method', () => {
  it('created succesfuly', async () => {
    const user = testHelper.mockUser();
    jest.spyOn(prisma.user, 'create').mockResolvedValue(user);
    const call = await createUser({
      email: user.email,
      password: user.password,
    });

    expect(call).toMatchObject(user);
    expect(call.password).toBe('');
  });
});
