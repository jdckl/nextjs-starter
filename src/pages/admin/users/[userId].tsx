import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import superjson from 'superjson';

import { serverSidePropsWithAuth, userFromRequest } from '@/lib/auth/tokens';

import ContentBox from '@/components/Admin/ContentBox';
import Header from '@/components/Admin/layout/Header';
import Layout from '@/components/Admin/layout/Layout';
import UserForm from '@/components/Admin/profile/UserForm';
import ButtonLink from '@/components/links/ButtonLink';

import { AdminProps } from '@/context/authContext';

const Detail = ({ user }: AdminProps) => {
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

  const getUser = () => axios.get(`/api/admin/users/${router.query.userId}`);

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

    try {
      await axios.patch(
        '/api/admin/users',
        {
          ...profileState,
          id: router.query.userId,
        },
        {
          withCredentials: true,
        }
      );
      toast.success('Updated succesfuly!');
      // eslint-disable-next-line
    } catch (error: any) {
      if (error?.response?.data?.message)
        toast.error(error.response.data.message);
    } finally {
      setProfileFormLoading(false);
    }
  };

  useEffect(() => {
    if (!profileState.email)
      getUser()
        .then((response) => {
          const { email, firstName, lastName, role } = response.data;
          setProfileState({
            ...profileState,
            email,
            firstName,
            lastName,
            role,
          });
        })
        .catch((error) => {
          if (error?.response?.data?.message)
            toast.error(error.response.data.message);
        });
  });

  return (
    <Layout user={user}>
      <Header title={`User profile - ${profileState.email}`}>
        <ButtonLink href='/admin/users'>Back</ButtonLink>
      </Header>
      <div className='w-100 h-100 p-6'>
        <ContentBox title='Profile data' size='col-span-12'>
          <UserForm
            handleSubmit={handleProfileSubmit}
            handleChange={handleProfileChange}
            state={profileState}
            formLoading={profileFormLoading}
            submittable={user.role === 'ADMIN'}
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

export default Detail;
