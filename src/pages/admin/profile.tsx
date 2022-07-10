import { User } from '@prisma/client';
import axios from 'axios';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import superjson from 'superjson';

import { serverSidePropsWithAuth, userFromRequest } from '@/lib/auth/tokens';

import ContentBox from '@/components/Admin/ContentBox';
import Header from '@/components/Admin/layout/Header';
import Layout from '@/components/Admin/layout/Layout';
import UserForm from '@/components/Admin/profile/UserForm';

import { AdminProps } from '@/context/authContext';

const Profile = ({ user }: AdminProps) => {
  const [formLoading, setFormLoading] = useState(false);
  const [formState, setFormState] = useState<
    Pick<User, 'email' | 'firstName' | 'lastName' | 'password' | 'role'>
  >({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    password: '',
    role: user?.role || 'USER',
  });

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = evt.target.value;
    setFormState({
      ...formState,
      [evt.target.name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      await axios.post(
        '/api/admin/profile',
        {
          ...formState,
          id: user?.id,
        },
        {
          withCredentials: true,
        }
      );
      toast.success('Updated your profile!');
      // eslint-disable-next-line
    } catch (error: any) {
      if (error?.response?.data?.message)
        toast.error(error.response.data.message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <Layout user={user}>
      <Header title='Your profile' />
      <div className='w-100 h-100 p-6'>
        <ContentBox title='User profile' size='col-span-12'>
          <UserForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            state={formState}
            formLoading={formLoading}
            editForm
            submittable
          />
        </ContentBox>
      </div>
      <Toaster position='bottom-center' />
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

export default Profile;
