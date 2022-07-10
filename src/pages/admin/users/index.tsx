import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Column } from 'react-table';
import superjson from 'superjson';

import { serverSidePropsWithAuth, userFromRequest } from '@/lib/auth/tokens';

import ContentBox from '@/components/Admin/ContentBox';
import Header from '@/components/Admin/layout/Header';
import Layout from '@/components/Admin/layout/Layout';
import Table from '@/components/Admin/Table';
import Input from '@/components/forms/Input';
import ButtonLink from '@/components/links/ButtonLink';

import { AdminProps } from '@/context/authContext';

const Users = ({ user }: AdminProps) => {
  const [search, setSearch] = useState('');
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [usersData, setUsersData] = useState([]);
  const columns = useMemo<Column[]>(
    () => [
      {
        Header: 'First name',
        accessor: 'firstName',
        Cell: ({ cell: { value } }) => (value ? value : '--'),
      },
      {
        Header: 'Last name',
        accessor: 'lastName',
        Cell: ({ cell: { value } }) => (value ? value : '--'),
      },
      {
        Header: 'E-mail',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
        Cell: ({ cell: { value } }) => {
          switch (value) {
            case 'ADMIN':
              return 'Admin';
            case 'USER':
              return 'User';
          }
        },
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ cell: { value } }) => {
          return (
            <div className='w-full text-right'>
              <ButtonLink href={`/admin/users/${value}`}>Detail</ButtonLink>
            </div>
          );
        },
      },
    ],
    []
  );

  const getTableData = useCallback(
    (pageIndex?: number, pageSize?: number) => {
      axios
        .get('/api/admin/users', {
          params: { pageIndex, pageSize, query: search },
        })
        .then((response) => {
          setUsersData(response.data);
        })
        .catch((error) => {
          if (error?.response?.data?.message)
            toast.error(error.response.data.message);
        });
    },
    [search]
  );

  useEffect(() => {
    getTableData();
  }, [search, getTableData]);

  return (
    <Layout user={user}>
      <Header title='Users'>
        {user.role === 'ADMIN' && (
          <ButtonLink href='/admin/users/add'>
            <span className='mr-3 inline-block font-semibold'>+</span> Add user
          </ButtonLink>
        )}
      </Header>
      <div className='w-100 h-100 p-6'>
        <ContentBox title='All users' size='col-span-12'>
          <Input
            className='rounded-b-none border-b-gray-200'
            onChange={handleSearch}
            inputType='text'
            placeholder='Search by user e-mail..'
          />
          <Table onFetch={getTableData} columns={columns} data={usersData} />
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

export default Users;
