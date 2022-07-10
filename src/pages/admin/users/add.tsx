import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import superjson from 'superjson';

import { serverSidePropsWithAuth, userFromRequest } from '@/lib/auth/tokens';

import ContentBox from '@/components/Admin/ContentBox';
import Header from '@/components/Admin/layout/Header';
import Layout from '@/components/Admin/layout/Layout';
import UserForm from '@/components/Admin/profile/UserForm';
import ButtonLink from '@/components/links/ButtonLink';

import { AdminProps } from '@/context/authContext';

const Add = ({ user }: AdminProps) => {
  const router = useRouter();

  const [profileFormLoading, setProfileFormLoading] = useState(false);
  const [profileState, setProfileState] = useState<
    Pick<User, 'email' | 'firstName' | 'lastName' | 'password' | 'role'>
  >({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'USER',
  });

  const handleProfileChange = (
    evt: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = evt.target.value;
    setProfileState({
      ...profileState,
      [evt.target.name]: value,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFormLoading(true);
    let validationErr = false;

    try {
      if (!profileState.email || !profileState.password) {
        validationErr = true;
        return;
      }

      const response = await axios.post(
        '/api/admin/users',
        {
          ...profileState,
        },
        {
          withCredentials: true,
        }
      );
      toast.success('Created succesfuly!');
      router.push(`/admin/users/${response.data.userId}`);
      // eslint-disable-next-line
    } catch (error: any) {
      if (error?.response?.data?.message)
        toast.error(error.response.data.message);
    } finally {
      if (validationErr) toast.error('Form is missing required fields!');
      setProfileFormLoading(false);
    }
  };

  return (
    <Layout user={user}>
      <Header title='New user'>
        <ButtonLink href='/admin/users'>Back</ButtonLink>
      </Header>
      <div className='w-100 h-100 p-6'>
        <ContentBox title='Profile data' size='col-span-12'>
          <UserForm
            handleSubmit={handleProfileSubmit}
            handleChange={handleProfileChange}
            state={profileState}
            formLoading={profileFormLoading}
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

export default Add;
