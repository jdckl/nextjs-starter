import { User } from '@prisma/client';
import { serialize } from 'cookie';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

import prisma from '@/lib/api/prisma';

const JWT_TOKEN_KEY = process.env.JWT_TOKEN_KEY || false;
const cookieOptions = {
  httpOnly: true,
  maxAge: 2592000,
  path: '/',
  sameSite: 'Strict',
  secure: process.env.NODE_ENV === 'production',
};

// Set cookie
function setCookie(
  res: NextApiResponse,
  name: string,
  value: string,
  options: Record<string, unknown> = {}
): void {
  const stringValue =
    typeof value === 'object' ? `j:${JSON.stringify(value)}` : String(value);

  res.setHeader('Set-Cookie', serialize(name, String(stringValue), options));
}

// Set auth cookie
export function authenticateUser(res: NextApiResponse, user: User): void {
  if (!user) return;
  if (!JWT_TOKEN_KEY) throw new Error('Missing JWT configuration!');

  const token = jwt.sign({ email: user.email }, JWT_TOKEN_KEY, {
    expiresIn: '1d',
  });

  setCookie(res, 'auth', token, cookieOptions);
}

// Clear auth cookie
export function clearUser(res: NextApiResponse): void {
  setCookie(res, 'auth', '0', {
    ...cookieOptions,
    path: '/',
    maxAge: 1,
  });
}

// Grab a user from a request
export async function userFromRequest(
  req: IncomingMessage & { cookies: NextApiRequest['cookies'] }
): Promise<User | null> {
  const { auth: token } = req.cookies;

  if (!token) return null;

  try {
    if (!JWT_TOKEN_KEY) throw new Error('Missing JWT configuration!');
    const data = jwt.verify(token, JWT_TOKEN_KEY);

    if (!data) return null;

    const user = await prisma.user.findUnique({
      where: { email: (data as { email: string }).email },
    });

    if (user) user.password = '';

    return user;
  } catch (error) {
    return null;
  }
}

// ServerSideProps "middleware" that pre-checks for an existing login auth, if not returns a redirect instead of props
// Used in authenticated pages (pages/admin) to allow for further extension of props and separated routing
export const serverSidePropsWithAuth =
  <P, Q extends NextParsedUrlQuery = NextParsedUrlQuery>(
    getServerSidePropsFn: GetServerSideProps<P, Q>
  ): GetServerSideProps<P, Q> =>
  async (ctx) => {
    const user = await userFromRequest(ctx.req);

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          statusCode: 302,
        },
      };
    }

    return getServerSidePropsFn(ctx);
  };
