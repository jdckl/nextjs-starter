import { Role, User } from '@prisma/client';
import { NextApiResponse } from 'next';

import requireLogin, {
  NextApiRequestWithUser,
} from '@/lib/api/middlewares/requireLogin';
import prisma from '@/lib/api/prisma';
import { encryptPassword } from '@/lib/auth/passwordUtils';

import defaultHandler from '../../_defaultHandler';

const handler = defaultHandler<NextApiRequestWithUser, NextApiResponse>()
  .use(requireLogin)
  .get(async (req, res) => {
    // GET Users
    const { pageIndex, pageSize, query, role } = req.query;

    const users = await prisma.user.findMany({
      take: pageSize ? Number(pageSize) : 10,
      skip: pageIndex && pageSize ? Number(pageIndex) * Number(pageSize) : 0,
      where: {
        email: {
          contains: (query as string) || '',
        },
        role: {
          in: role ? ([role] as Role[]) : ['ADMIN', 'USER'],
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });
    res.status(200).json(users || []);
  })
  .post(async (req, res) => {
    // POST Users (add user)
    const requestUser = req.currentUser;

    if (requestUser.role !== 'ADMIN') {
      throw new Error('You do not have permission!');
    }

    const {
      email,
      firstName,
      lastName,
      role,
      password,
    }: Pick<User, 'email' | 'firstName' | 'lastName' | 'password' | 'role'> =
      req.body;

    const hashedPassword = await encryptPassword(password);

    try {
      const insertQuery = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          role,
          password: hashedPassword,
        },
      });

      if (insertQuery) {
        return res.status(200).json({ success: true, userId: insertQuery.id });
      }

      throw new Error('Unable to create user!');
      // eslint-disable-next-line
    } catch (e: any) {
      return res.status(400).json({ error: true, message: e.message });
    }
  })
  .patch(async (req, res) => {
    // PATCH Users (update user)
    const requestUser = req.currentUser;

    if (requestUser.role !== 'ADMIN') {
      throw new Error('You do not have permission!');
    }

    const {
      id,
      password,
      ...userData
    }: Pick<
      User,
      'email' | 'firstName' | 'lastName' | 'password' | 'role' | 'id'
    > = req.body;

    let hashedPassword;
    if (password && password.length > 0) {
      hashedPassword = await encryptPassword(password);
    }

    try {
      const updateQuery = await prisma.user.update({
        where: { id: id },
        data: {
          ...userData,
          password: hashedPassword || undefined,
        },
      });

      if (updateQuery) {
        return res.status(200).json({ success: true });
      }

      throw new Error('Unable to update this user!');
      // eslint-disable-next-line
    } catch (e: any) {
      return res.status(400).json({ error: true, message: e.message });
    }
  });

export default handler;
