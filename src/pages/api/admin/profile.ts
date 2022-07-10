import { User } from '@prisma/client';
import { NextApiResponse } from 'next';

import requireLogin, {
  NextApiRequestWithUser,
} from '@/lib/api/middlewares/requireLogin';
import prisma from '@/lib/api/prisma';
import { encryptPassword } from '@/lib/auth/passwordUtils';

import defaultHandler from '../_defaultHandler';

const handler = defaultHandler<NextApiRequestWithUser, NextApiResponse>()
  .use(requireLogin)
  .post(async (req, res) => {
    // POST Profile (update profile)
    const user = req.currentUser;

    const {
      id,
      email,
      firstName,
      lastName,
      password,
    }: Pick<
      User,
      'email' | 'firstName' | 'lastName' | 'password' | 'role' | 'id'
    > = req.body;

    if (user?.id !== id) {
      throw new Error('Unauthorized operation.');
    }

    let hashedPassword;
    if (password.length > 0) {
      hashedPassword = await encryptPassword(password);
    }

    try {
      const updateQuery = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword || undefined,
        },
      });

      if (updateQuery) {
        return res.status(200).json({ success: true });
      }

      throw new Error('Unable to update this profile!');
      // eslint-disable-next-line
    } catch (e: any) {
      return res.status(400).json({ error: true, message: e.message });
    }
  });

export default handler;
