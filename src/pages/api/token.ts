import { NextApiRequest, NextApiResponse } from 'next';

import { userFromRequest } from '@/lib/auth/tokens';

import defaultHandler from './_defaultHandler';

const handler = defaultHandler<NextApiRequest, NextApiResponse>().get(
  async (req, res) => {
    const user = await userFromRequest(req);

    if (user) {
      res.json(user);
    } else {
      res.status(401).send('');
    }
  }
);

export default handler;
