import * as React from 'react';
import superjson from 'superjson';

import { serverSidePropsWithAuth, userFromRequest } from '@/lib/auth/tokens';

import Header from '@/components/Admin/layout/Header';
import Layout from '@/components/Admin/layout/Layout';

import { AdminProps } from '@/context/authContext';

const Dashboard = ({ user }: AdminProps) => {
  return (
    <Layout user={user}>
      <Header title='Dashboard' />
      <div className='w-100 h-100 p-6'>Welcome!</div>
    </Layout>
  );
};

export const getServerSideProps = serverSidePropsWithAuth(async ({ req }) => {
  return {
    props: superjson.serialize({
      user: await userFromRequest(req),
    }).json,
  };
});

export default Dashboard;
