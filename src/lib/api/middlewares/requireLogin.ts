import { User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

import { userFromRequest } from '@/lib/auth/tokens';

export interface NextApiRequestWithUser extends NextApiRequest {
  currentUser: User;
}

export default async function requireLogin(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  const currentUser = await userFromRequest(req);

  if (currentUser) {
    // eslint-disable-next-line no-param-reassign
    (req as NextApiRequestWithUser).currentUser = currentUser;
    next();
  } else {
    res.status(401).json({ error: 'unauthenticated' });
  }
}
