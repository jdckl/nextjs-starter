import { User } from '@prisma/client';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import superjson from 'superjson';

import { userFromRequest } from '@/lib/auth/tokens';

import Login from '@/components/Login';

export interface LoginProps {
  user?: User;
}

export default function LoginPage({ user }: LoginProps) {
  const router = useRouter();

  useEffect(() => {
    if (user && router.asPath === '/login') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  return <Login />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await userFromRequest(context.req);

  if (!user || (user && user.role === 'USER')) return { props: {} };

  return {
    props: superjson.serialize({
      user,
    }).json,
  };
}
