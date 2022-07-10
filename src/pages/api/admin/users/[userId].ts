import { NextApiResponse } from 'next';

import requireLogin, {
  NextApiRequestWithUser,
} from '@/lib/api/middlewares/requireLogin';
import prisma from '@/lib/api/prisma';

import defaultHandler from '../../_defaultHandler';

const handler = defaultHandler<NextApiRequestWithUser, NextApiResponse>()
  .use(requireLogin)
  .get(async (req, res) => {
    // GET User
    const userId = req.query.userId;

    const user = await prisma.user.findUnique({
      where: { id: <string>userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        role: true,
      },
    });

    if (user) {
      user.password = '';
      return res.status(200).json(user);
    }

    res.status(400).json({ error: 'No user could be found.' });
  });

export default handler;
