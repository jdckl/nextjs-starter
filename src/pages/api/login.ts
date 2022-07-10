import { NextApiRequest, NextApiResponse } from 'next';

import useRateLimiter from '@/lib/api/middlewares/useRateLimiter';
import { login } from '@/lib/auth';
import { authenticateUser, clearUser } from '@/lib/auth/tokens';

import defaultHandler from './_defaultHandler';

const handler = defaultHandler<NextApiRequest, NextApiResponse>()
  .use(useRateLimiter)
  .post(async (req, res) => {
    const user = await login(req.body);

    if (user) {
      authenticateUser(res, user);
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: 'Wrong credentials' });
    }
  })
  .delete((_req, res) => {
    clearUser(res);

    res.status(200).send('');
  });

export default handler;
